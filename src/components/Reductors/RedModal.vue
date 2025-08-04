<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import type {
  GearOptionsView,
  IShaft,
  ColorOptionsView,
  WarrantyOptions,
  IUserRedConfig,
  IFlange,
  OilOptionsView,
  IRedMountType,
  IRedShaftType,
  IRedShaftDirection,
  IFlangeType,
  IRedMountingPosition,
  OutputAdapter,
  IRedGearType,
} from '@/Interfaces/reductors'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import { useUserStore } from '@/stores/user'
import { useLoginStore } from '@/stores/login'
import MountingPositionSelect from '@/components/Reductors/MountingPositionSelect.vue'
import MountType from '@/components/Reductors/MountType.vue'
import ShaftSelect from '@/components/Reductors/ShaftSelect.vue'
import AdapterFlange from './AdapterFlange.vue'
import OptionsSelect from './OptionsSelect.vue'
import WarrantyOptionsSelect from './WarrantyOptionsSelect.vue'
import { insertDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'
import { getPriceY } from '@/api/getPriceY'
import { getFullOrderName } from '@/api/Reductors/getFullOrderName'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import DeliveryReport from './DeliveryReport.vue'
import { priceFormat } from '@/api/priceFormat'
import moment from 'moment'
import { Tag } from 'primevue'
import { generatePDFReductor } from '@/api/generatePDFreductor'

const user = useUserStore()
const router = useRouter()
const loginModal = useLoginStore()
const props = defineProps(['red', 'gearTypeId', 'gearType', 'typeConfig', 'commonData', 'discount'])
const submitted = ref(false)
const dialogOpened = defineModel<boolean>('dialogOpened')
const mountPosition = ref<number>(0)
const mountType = ref<number>(0)
const mountTypeName = ref<string>('')
const shaft = ref<IShaft>({ type: 0, direction: 0 })
const gearTypeLetter = ref<IDocument<IRedGearType>>({ data: [], error: null, loading: true })
const warrantyOptionSelected = ref<WarrantyOptions>()
const oilOptionsSelected = ref<OilOptionsView | null>(null)
const colorOptionsSelected = ref<ColorOptionsView | null>(null)
const gearOptionsSelected = ref<GearOptionsView[]>([])
const warrantyPrice = ref<number>(0)
const flange = ref<IFlange>({ type: 0, adapter: 0, name: '', mass: 0 })
const step = ref<number>(1)
const orderName = computed(() => { return getFullOrderName(props.red, flange.value.name, mountTypeName.value, shaft.value.type, shaft.value.direction, mountPosition.value, oilOptionsSelected.value, colorOptionsSelected.value, gearOptionsSelected.value, 'full' )})
const totalPrice = ref<number>(0)
const rate = ref<IDocument<any>>({data: [], error: [], loading: true});


const rate_rub_cny = computed(() => {
  return rate.value?.data?.[0] || 0
})

const reductorPrice = computed(() => {
  return {
    flange_adapter: {
      id: flange.value.adapter,
      mass: flange.value.mass,
    },
    mount_type: {
      id: mountType.value,
    },
    mount_position_id: mountPosition.value,
    gear: {
      gear_size_id: props.red.id_size_gear,
      gear_size: {
        gear_type: {
          id: props.red.gear_type_id,
          name: gearTypeLetter.value?.data?.[0]?.name,
        },
        gear_box_list_size_id: props.red.gear_box_list_size_id,
      },
    },
    options: JSON.stringify({
       gear_options: gearOptionsSelected.value,
       oil_options: oilOptionsSelected.value,
       color_options: colorOptionsSelected.value,
       warranty_options: warrantyOptionSelected.value
    }),
    gear_price: props.red.price,
    rate_rub_cny: rate_rub_cny.value,
    totalPrice: totalPrice.value,
  }
} )

async function savePDF() {
  const gearExtended:IDocument<any> = await useFetch(`/data/RedGearsExtended/${props.red.id_gear}`,'reductors');
  const moutType:IDocument<IRedMountType> = await useFetch(`/data/RedMountTypes/${mountType.value}`,'reductors');
  const shaftTyoe:IDocument<IRedShaftType> = await useFetch(`/data/RedShaftTypes/${shaft.value.type}`,'reductors');
  const shaftDirection:IDocument<IRedShaftDirection> = await useFetch(`/data/RedShaftDirections/${shaft.value.direction}`,'reductors');
  const flangeType:IDocument<IFlangeType> = await useFetch(`/data/FlangeTypes/${flange.value.type}`,'reductors');
  const mountPositionData:IDocument<IRedMountingPosition> = await useFetch(`/data/RedMountingPositions/${mountPosition.value}`,'reductors');
  const flangeAdapter:IDocument<OutputAdapter> = await useFetch(`/data/OutputAdaptersExtended/${flange.value.adapter}`,'reductors');

  if (mountPositionData?.data && mountPositionData?.data.length > 0 &&
      gearExtended.data && gearExtended.data.length > 0) {

  const userConfig = {
    full_order_number: orderName.value,
    rate_rub_cny: rate_rub_cny.value,
    user_power: props.typeConfig.type == 1 ? props.typeConfig.value : 0,
    user_torque: props.typeConfig.type == 2 ? props.typeConfig.value : 0,
    user_input_speed: props.commonData.inputSpeed,
    user_output_speed: props.commonData.outputSpeed,
    user_service_factor: props.commonData.serviceFactor,
    gear: gearExtended.data?.[0],
    gear_price: props.red.price,
    discount: 1 + props.discount/100,
    mount_position_id: mountPosition.value,
    "mount_position": mountPositionData?.data?.[0],
    "mount_type": moutType?.data?.[0],
    "shaft_type": shaftTyoe?.data?.[0],
    "shaft_diirection": shaftDirection?.data?.[0],
    "flange_type": flangeType?.data?.[0],
    "flange_adapter": flangeAdapter?.data?.[0],
    options: JSON.stringify({
       gear_options: gearOptionsSelected.value,
       oil_options: oilOptionsSelected.value,
       color_options: colorOptionsSelected.value,
       warranty_options: warrantyOptionSelected.value
    }),
    date: new Date()
  }

  generatePDFReductor(userConfig, totalPrice.value, 0)
}
}

const saveUserRedConfig = async () => {
  const selectedOptionsStr = ref<string[]>([])
  const selectedOptionsPricesStr = ref<string[]>([])


  if (gearOptionsSelected.value) {
    gearOptionsSelected.value.map((item: GearOptionsView) => {
      selectedOptionsStr.value.push(item.item_name!.toString())
      if (item.price)
        selectedOptionsPricesStr.value.push(getPriceY(item.price, item.currency_id, rate_rub_cny.value).toString())
    })
  }
  const payload: IUserRedConfig = {
    rate_rub_cny: rate_rub_cny.value,
    full_order_number: getFullOrderName(props.red, flange.value.name, mountTypeName.value, shaft.value.type, shaft.value.direction, mountPosition.value, oilOptionsSelected.value, colorOptionsSelected.value, gearOptionsSelected.value, 'full' ),
    short_order_number: getFullOrderName(props.red, flange.value.name, mountTypeName.value, shaft.value.type, shaft.value.direction, mountPosition.value, oilOptionsSelected.value, colorOptionsSelected.value, gearOptionsSelected.value, 'short' ),
    user_power: props.typeConfig.type == 1 ? props.typeConfig.value : 0,
    user_torque: props.typeConfig.type == 2 ? props.typeConfig.value : 0,
    user_input_speed: props.commonData.inputSpeed,
    user_output_speed: props.commonData.outputSpeed,
    user_service_factor: props.commonData.serviceFactor,
    gear_id: props.red.id_gear,
    gear_price: props.red.price,
    discount: +props.discount,
    mount_position_id: mountPosition.value,
    mount_type_id: mountType.value,
    shaft_type_id: shaft.value.type,
    shaft_direcion_id: shaft.value.direction,
    flange_type_id: flange.value.type,
    flange_adapter_id: flange.value.adapter,
    options: JSON.stringify({
      gear_options: gearOptionsSelected.value,
      oil_options: oilOptionsSelected.value,
      color_options: colorOptionsSelected.value,
      warranty_options: warrantyOptionSelected.value
    }),
    user_id: user.getUser().userId.value,
    staff_opened: false,
    info: '',
    totalPrice: totalPrice.value,
  }

  await insertDataReductors(`/data/UserRedConfigs`, payload)
    .then((response) => {
      router.push(`/reductors/RedConfigs/Update/${response.data.id}`)
    })
    .catch((error) => {
      console.log(error)
    })
}

const hideDialog = () => {
  dialogOpened.value = false
  submitted.value = false
}

onBeforeMount(async () => {
  rate.value = await useFetch('/data/getRate/1/2', 'reductors');
  gearTypeLetter.value = await useFetch(`/data/RedGearTypes/${props.gearTypeId}`, 'reductors')
  // if (user.isUser()) {
  //   const userRedDiscount = await useFetch('/data/RedUserDiscountsExtends', 'reductors');
  //   const d: any = userRedDiscount.data.find((item: any) => item.user_id == user.userId)
  //   if (d && d.discount && d.discount.discount)
  //     discount.value = d.discount.discount
  // }
})
</script>

<template>
  <Dialog
    v-model:visible="dialogOpened"
    :style="{ width: '1280px' }"
    :header="orderName"
    :modal="true"
  >


        <div class="flex align-items-center">
          <div>
            <label class="font-semibold">Итоговая цена редуктора с опциями в Екатеринбурге</label>
          </div>

          <div class="ml-3">
            <Tag :value="priceFormat(totalPrice * (1 + props.discount/100)) + ' &#165;'" severity="primary" />
          </div>

          <div class="ml-3">
            <Tag :value="priceFormat(totalPrice * (1 + props.discount/100) * rate_rub_cny) + ' &#8381;'" severity="info" />
          </div>

          <div class="ml-1">
            (по курсу {{ rate_rub_cny }} &#8381; за 1 &#165; на {{ moment().format('DD.MM.YYYY') }})
          </div>
        </div>


  <DeliveryReport :red="reductorPrice" :display="false" v-model="totalPrice"/>

  <div class="card flex justify-center">

      <Stepper value="1" class="w-full">
        <StepList>
          <Step value="1">Монтажное положение</Step>
          <Step value="2">Способ монтажа</Step>
          <Step value="3">Выходной вал</Step>
          <Step value="4">Адаптер</Step>
          <Step value="5">Опции</Step>
        </StepList>

        <StepPanels>
          <StepPanel v-slot="{ activateCallback }" value="1">
              <div class="flex justify-end">
                <Button label="Дальше" icon="pi pi-arrow-right" iconPos="right" @click="{ step = 2; activateCallback('2') } " />
              </div>
            <MountingPositionSelect v-model="mountPosition" :gearTypeId="gearTypeId" />
          </StepPanel>

          <StepPanel v-slot="{ activateCallback }" value="2">
              <div class="flex justify-between">
                <Button label="Обратно" severity="secondary" icon="pi pi-arrow-left" @click="{ step = 1; activateCallback('1') }" />
                <Button label="Дальше" icon="pi pi-arrow-right" iconPos="right" @click="{ step = 3; activateCallback('3') }" />
              </div>
            <MountType v-model="mountType" v-model:mount-type-name="mountTypeName" :id_gear="props.red.id_gear" :gear_type_id="props.gearTypeId" />
          </StepPanel>

          <StepPanel v-slot="{ activateCallback }" value="3">
              <div class="flex justify-between">
                <Button label="Обратно" severity="secondary" icon="pi pi-arrow-left" @click="{ step = 2; activateCallback('2') }"/>
                <Button label="Дальше" icon="pi pi-arrow-right" iconPos="right" @click="{ step = 4; activateCallback('4') }"/>
              </div>
            <ShaftSelect
              v-model="shaft"
              :id_gear="props.red.id_gear"
              :gear-type-id="red.gear_type_id"
              :mount-type="mountType"
              :gear-size-id="red.gear_box_list_size_id"
              v-if="mountType"
            />
          </StepPanel>

          <StepPanel v-slot="{ activateCallback }" value="4">
              <div class="flex justify-between">
                <Button label="Обратно" severity="secondary" icon="pi pi-arrow-left" @click="{ step = 3; activateCallback('3') }" />
                <Button label="Дальше" icon="pi pi-arrow-right" iconPos="right" @click="{ step = 5; activateCallback('5') }" />
              </div>
            <AdapterFlange
              v-model="flange"
              :t2n="props.red.t2n"
              :ex_ratio="props.red.ex_ratio"
              :inputSpeed="props.commonData.inputSpeed"
              :shaft-type="shaft.type"
              v-if="shaft"
            />
          </StepPanel>

          <StepPanel v-slot="{ activateCallback }" value="5">
              <div class="flex">
              <Button label="Обратно" icon="pi pi-arrow-left" iconPos="right" @click=" { step = 4; activateCallback('4'); } "/>
              </div>

            {{ props.red.gear_box_list_size_id }}
            {{ props.red.id_size_gear }}
            <OptionsSelect
              :gear_box_list_size_id="props.red.gear_box_list_size_id"
              :id_size_gear="props.red.id_size_gear"
              :gear-type-id="gearTypeId"
              :mounting-position-id="mountPosition"
              :discount="1 + props.discount/100"
              :shaft="shaft"
              v-model:oilOptionsSelected="oilOptionsSelected"
              v-model:colorOptionsSelected="colorOptionsSelected"
              v-model:gearOptionsSelected="gearOptionsSelected"
              v-if="props?.red?.gear_box_list_size_id && props?.red?.id_size_gear"
            />

            <WarrantyOptionsSelect
              v-model:warrantyOptionSelected="warrantyOptionSelected"
              v-model:warrantyPrice="warrantyPrice"
            />

          </StepPanel>
        </StepPanels>
      </Stepper>
   </div>

    <template #footer>
      <Button label="Закрыть" severity="secondary" icon="pi pi-times" text @click="hideDialog" />
      <Button
          label="PDF"
          severity="help"
          icon="pi pi-download"
          @click="savePDF()"
          v-if="totalPrice"
          class="ml-2"
        />
      <Button
        v-if="user.isUser()"
        label="Сохранить в мои конфигурации"
        icon="pi pi-save"
        @click="saveUserRedConfig"
      />
      <Button
        v-if="!user.isUser()"
        label="Для сохранения конфигурации выполните вход"
        severity="info"
        icon="pi pi-sign-in"
        @click="loginModal.visible = true"
      />
    </template>
  </Dialog>
</template>
