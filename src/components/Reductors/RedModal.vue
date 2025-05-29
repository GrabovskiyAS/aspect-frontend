<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import type {
  GearOptionsView,
  IShaft,
  ColorOptionsView,
  WarrantyOptions,
  IUserRedConfig,
  IFlange,
  OilOptionsView,
} from '@/Interfaces/reductors'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Stepper from 'primevue/stepper'
import StepItem from 'primevue/stepitem'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import Divider from 'primevue/divider'
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
const warrantyOptionSelected = ref<WarrantyOptions>()
const oilOptionsSelected = ref<OilOptionsView | null>(null)
const colorOptionsSelected = ref<ColorOptionsView | null>(null)
const gearOptionsSelected = ref<GearOptionsView[]>([])
const warrantyPrice = ref<number>(0)
const flange = ref<IFlange>({ type: 0, adapter: 0, name: '' })
const step = ref<number>(1)
const discount = ref<number>(0)
const activeStep = ref(1);

const saveUserRedConfig = async () => {
  const selectedOptionsStr = ref<string[]>([])
  const selectedOptionsPricesStr = ref<string[]>([])
  const rate = ref<IDocument<any>>({data: [], error: [], loading: true});
  rate.value = await useFetch('/data/getRate/1/2', 'reductors');

  if (gearOptionsSelected.value) {
    gearOptionsSelected.value.map((item: GearOptionsView) => {
      selectedOptionsStr.value.push(item.item_name!.toString())
      if (item.price)
        selectedOptionsPricesStr.value.push(getPriceY(item.price, item.currency_id).toString())
    })
  }
  const payload: IUserRedConfig = {
    rate_rub_cny: rate.value.data[0],
    full_order_number: getFullOrderName(props.red, flange.value.name, mountTypeName.value, shaft.value.type, shaft.value.direction, mountPosition.value, oilOptionsSelected.value, colorOptionsSelected.value, gearOptionsSelected.value, 'full' ),
    short_order_number: getFullOrderName(props.red, flange.value.name, mountTypeName.value, shaft.value.type, shaft.value.direction, mountPosition.value, oilOptionsSelected.value, colorOptionsSelected.value, gearOptionsSelected.value, 'short' ),
    user_power: props.typeConfig.type == 1 ? props.typeConfig.value : 0,
    user_torque: props.typeConfig.type == 2 ? props.typeConfig.value : 0,
    user_input_speed: props.commonData.inputSpeed,
    user_output_speed: props.commonData.outputSpeed,
    user_service_factor: props.commonData.serviceFactor,
    gear_id: props.red.id_gear,
    gear_price: props.red.price,
    discount: discount.value,
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
  if (user.isUser()) {
    const userRedDiscount = await useFetch('/data/RedUserDiscountsExtends', 'reductors');
    const d: any = userRedDiscount.data.find((item: any) => item.user_id == user.userId)
    if (d && d.discount && d.discount.discount)
      discount.value = d.discount.discount
  }
})
</script>

<template>
  <Dialog
    v-model:visible="dialogOpened"
    :style="{ width: '1280px' }"
    :header="props.red.code_aspect"
    :modal="true"
  >

  <div class="card flex justify-center">

  <!-- <Stepper value="1" class="w-full">
    <StepItem value="1">
        <Step>Монтажное положение</Step>
        <StepPanel v-slot="{ activateCallback }">
            <div class="flex flex-col h-48">
              <MountingPositionSelect v-model="mountPosition" :gearTypeId="gearTypeId" />
            </div>
             <div class="py-6">
                <Button label="Next" @click="activateCallback('2')" />
            </div>
        </StepPanel>
    </StepItem>
    <StepItem value="2">
        <Step>Способ монтажа</Step>
        <StepPanel v-slot="{ activateCallback }">
            <div class="flex flex-col h-48">
              <MountType v-model="mountType" v-model:mount-type-name="mountTypeName" :id_gear="props.red.id_gear" :gear_type_id="props.gearTypeId" />
            </div>
            <div class="flex py-6 gap-2">
                <Button label="Back" severity="secondary" @click="activateCallback('1')" />
                <Button label="Next" @click="activateCallback('3')" />
            </div>
        </StepPanel>
    </StepItem>
    <StepItem value="3">
        <Step>Выходной вал</Step>
        <StepPanel v-slot="{ activateCallback }">
            <div class="flex flex-col h-48">
              <ShaftSelect
              v-model="shaft"
              :id_gear="props.red.id_gear"
              :gear-type-id="red.gear_type_id"
              :mount-type="mountType"
              :gear-size-id="red.gear_box_list_size_id"
              :red="props.red"
              v-if="mountType"
            />
            </div>
             <div class="py-6">
                <Button label="Back" severity="secondary" @click="activateCallback('2')" />
                <Button label="Next" @click="activateCallback('4')" />
            </div>
        </StepPanel>
    </StepItem>
    <StepItem value="4">
        <Step>Адаптер</Step>
        <StepPanel v-slot="{ activateCallback }">
            <div class="flex flex-col h-48">
              <AdapterFlange
              v-model="flange"
              :red="props.red"
              :inputSpeed="props.commonData.inputSpeed"
              :shaft-type="shaft.type"
              v-if="shaft"
            />
            </div>
             <div class="py-6">
                <Button label="Back" severity="secondary" @click="activateCallback('3')" />
                <Button label="Next" @click="activateCallback('5')" />
            </div>
        </StepPanel>
    </StepItem>
    <StepItem value="5">
        <Step>Опции</Step>
        <StepPanel v-slot="{ activateCallback }">
            <div class="flex flex-col h-48">
              <OptionsSelect
              :red="props.red"
              :gear-type-id="gearTypeId"
              :mounting-position-id="mountPosition"
              :discount="props.discount"
              :shaft="shaft"
              v-model:oilOptionsSelected="oilOptionsSelected"
              v-model:colorOptionsSelected="colorOptionsSelected"
              v-model:gearOptionsSelected="gearOptionsSelected"
            />

            <WarrantyOptionsSelect
              v-model:warrantyOptionSelected="warrantyOptionSelected"
              v-model:warrantyPrice="warrantyPrice"
            />
            </div>
             <div class="py-6">
                <Button label="Back" severity="secondary" @click="activateCallback('4')" />

            </div>
        </StepPanel>
    </StepItem>
  </Stepper> -->

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
            <MountingPositionSelect v-model="mountPosition" :gearTypeId="gearTypeId" />
            <div class="flex pt-6 justify-end">
              <Button label="Дальше" icon="pi pi-arrow-right" iconPos="right" @click="{ step = 2; activateCallback('2') } " />
            </div>
          </StepPanel>

          <StepPanel v-slot="{ activateCallback }" value="2">
            <MountType v-model="mountType" v-model:mount-type-name="mountTypeName" :id_gear="props.red.id_gear" :gear_type_id="props.gearTypeId" />
            <div class="flex pt-6 justify-between">
                <Button label="Обратно" severity="secondary" icon="pi pi-arrow-left" @click="{ step = 1; activateCallback('1') }" />
                <Button label="Дальше" icon="pi pi-arrow-right" iconPos="right" @click="{ step = 3; activateCallback('3') }" />
            </div>
          </StepPanel>

          <StepPanel v-slot="{ activateCallback }" value="3">
            <ShaftSelect
              v-model="shaft"
              :id_gear="props.red.id_gear"
              :gear-type-id="red.gear_type_id"
              :mount-type="mountType"
              :gear-size-id="red.gear_box_list_size_id"
              :red="props.red"
              v-if="mountType"
            />
            <div class="flex pt-6 justify-between">
                <Button label="Обратно" severity="secondary" icon="pi pi-arrow-left" @click="{ step = 2; activateCallback('2') }"/>
                <Button label="Дальше" icon="pi pi-arrow-right" iconPos="right" @click="{ step = 4; activateCallback('4') }"/>
            </div>
          </StepPanel>

          <StepPanel v-slot="{ activateCallback }" value="4">
            <AdapterFlange
              v-model="flange"
              :red="props.red"
              :inputSpeed="props.commonData.inputSpeed"
              :shaft-type="shaft.type"
              v-if="shaft"
            />
            <div class="flex pt-6 justify-between">
                <Button label="Обратно" severity="secondary" icon="pi pi-arrow-left" @click="{ step = 3; activateCallback('3') }" />
                <Button label="Дальше" icon="pi pi-arrow-right" iconPos="right" @click="{ step = 5; activateCallback('5') }" />
            </div>
          </StepPanel>

          <StepPanel v-slot="{ activateCallback }" value="5">

            <OptionsSelect
              :red="props.red"
              :gear-type-id="gearTypeId"
              :mounting-position-id="mountPosition"
              :discount="props.discount"
              :shaft="shaft"
              v-model:oilOptionsSelected="oilOptionsSelected"
              v-model:colorOptionsSelected="colorOptionsSelected"
              v-model:gearOptionsSelected="gearOptionsSelected"
            />

            <WarrantyOptionsSelect
              v-model:warrantyOptionSelected="warrantyOptionSelected"
              v-model:warrantyPrice="warrantyPrice"
            />

            <div class="flex pt-6">
              <Button label="Обратно" icon="pi pi-arrow-left" iconPos="right" @click=" { step = 4; activateCallback('4'); } "/>
            </div>
          </StepPanel>
        </StepPanels>
      </Stepper>
   </div>

    <template #footer>
      <Button label="Закрыть" severity="secondary" icon="pi pi-times" text @click="hideDialog" />
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
