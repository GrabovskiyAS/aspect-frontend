<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue'
import type { IDocument } from '@/Interfaces/invertors'
import type { ColorOptionsView, IFlange, IRedGearView, IRedMountType, IRedShaftType, IShaft, OilOptionsView, OutputAdapter, RedDiscount, WarrantyOptions } from '@/Interfaces/reductors'
import { useFetch } from '@/api/useFetch'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import ButtonGroup from 'primevue/buttongroup'
import Divider from 'primevue/divider'
import SelectButton from 'primevue/selectbutton'
import FloatLabel from 'primevue/floatlabel'
import Textarea from 'primevue/textarea'
import { useBaseUrl } from '@/stores/baseUrl'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import type {
  GearOptionsView,
  IFlangeDimention,
  IFlangeDimentionAddon,
  IFlangeDimentionImage,
  IGearMass,
  IRedOilI,
  IShaftDimentionData,
} from '@/Interfaces/reductors'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { priceFormat  } from '@/api/priceFormat'
import DeliveryReport from '@/components/Reductors/DeliveryReport.vue'
import { patchDataReductors } from '@/api/dataActionsReductors'
import { generatePDFReductor } from '@/api/generatePDFreductor'
import moment from 'moment'
// import { getShaftDimentionValues } from '@/api/getShaftDimentionValues';
import MainGearData from '@/components/Reductors/MainGearData.vue'
import { useUserStore } from '@/stores/user'
import { generateHash } from '@/api/Reductors/generateHash'
import { ProgressSpinner } from 'primevue'
import MountingPositionSelect from '@/components/Reductors/MountingPositionSelect.vue'
import MountType from '@/components/Reductors/MountType.vue'
import ShaftSelect from '@/components/Reductors/ShaftSelect.vue'
import AdapterFlange from '@/components/Reductors/AdapterFlange.vue'
import OptionsSelect from '@/components/Reductors/OptionsSelect.vue'
import WarrantyOptionsSelect from '@/components/Reductors/WarrantyOptionsSelect.vue'
import { getFullOrderName } from '@/api/Reductors/getFullOrderName'
import CopySplitButton from '@/components/Common/CopySplitButton.vue'
import WebSocket from '@/components/Reductors/WebSocket.vue'
import { downloadFile } from '@/api/downloadFile'

const baseUrl = useBaseUrl()
const toast = useToast()
const user = useUserStore()
const discountGroups = ref<IDocument<RedDiscount>>({ data: [], error: null, loading: true })
const discontGroupSelected = ref<RedDiscount>()
const red = ref<IDocument<any>>({ data: [], error: [], loading: true })
const oilL = ref<IDocument<IRedOilI>>({ data: [], error: [], loading: true })
const gearOptions = ref<IDocument<GearOptionsView>>({ data: [], error: [], loading: true })
const gearOptionsSelected = ref<GearOptionsView[]>([])
const shaftDimention = ref<IDocument<any>>({ data: [], error: [], loading: true })
const shaftDimentionData = ref<IDocument<any>>({ data: [], error: [], loading: true })
const mass = ref<IDocument<IGearMass>>({ data: [], error: [], loading: true })
const flnageDimentionAddon = ref<IDocument<IFlangeDimentionAddon>>({
  data: [],
  error: [],
  loading: true,
})
const flnageDimention = ref<IDocument<IFlangeDimention>>({ data: [], error: [], loading: true })
const flangeSize = ref<IShaftDimentionData>()
const outputShaftSize = ref<IShaftDimentionData>()
const options = ref()

const flangeDimentionImages = ref<IDocument<IFlangeDimentionImage>>({
  data: [],
  error: [],
  loading: true,
})
const adapterImage2 = ref<IDocument<IFlangeDimentionImage>>({ data: [], error: [], loading: true })
let gear_type_id = 0;
let gear_size_id = 0;
let userId = 0

const mountData = ref<string>('')
const totalPrice = ref<number>(0)

const loading = ref<boolean>(true)
const props = defineProps(['id'])
const nominal_power = ref<number>(0)
const pdf1 = ref<string>('')
const pdf2 = ref<string>('')

// ====================================================== Переменные для режима редактирования ================================================
const editMode = ref<boolean>(false)
const mountPosition = ref<number>(0)
const mountType = ref<number>(0)
const mountTypeName = ref<string>('')
const shaft = ref<IShaft>({ type: 0, direction: 0 })
const warrantyOptionSelected = ref<WarrantyOptions>()
const oilOptionsSelected = ref<OilOptionsView | null>(null)
const colorOptionsSelected = ref<ColorOptionsView | null>(null)
const warrantyPrice = ref<number>(0)
const flange = ref<IFlange>({ type: 0, adapter: 0, name: '', mass: 0 })
const flangeAdapter = ref<IDocument<OutputAdapter>>(({ data: [], error: [], loading: true }))

async function savePDF(print_price: number) {
  generatePDFReductor(
    red.value.data[0],
    totalPrice.value,
    print_price,
  )
}

const submission = async () => {
  const selectedRed = ref<IDocument<IRedGearView>>(({ data: [], error: [], loading: true }))
  selectedRed.value = await useFetch(`/data/RedGearsView/${red.value.data[0].gear.id}`, 'reductors')

  const updatePayload = {
    full_order_number: getFullOrderName(selectedRed.value.data[0], flange.value.name, mountTypeName.value, shaft.value.type, shaft.value.direction, mountPosition.value, oilOptionsSelected.value, colorOptionsSelected.value, gearOptionsSelected.value, 'full' ),
    short_order_number: getFullOrderName(selectedRed.value.data[0], flange.value.name, mountTypeName.value, shaft.value.type, shaft.value.direction, mountPosition.value, oilOptionsSelected.value, colorOptionsSelected.value, gearOptionsSelected.value, 'short' ),
    discount: red.value.data[0].discount,
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
    info: red.value.data[0].info,
    totalPrice: totalPrice.value,
  }

  patchDataReductors(`/data/UserRedConfigs/${props.id}`, updatePayload).then(
    () => {
      toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 })
    },
  )
}

// ===============================================================================================================
// ============================== Размеры фланца выходного вала ==================================================
// ===============================================================================================================

const loadShaftData = async (gear_type_id: number, gear_size_id: number, mount_type_id: number) => {
  flnageDimention.value.data = [];
  flangeDimentionImages.value.data = [];

  flnageDimentionAddon.value = await useFetch(
      `/data/FlangeDimentionAddons?gear_type_id=${gear_type_id}&gearbox_size_id=${gear_size_id}&mount_type_id=${mount_type_id}`,
      'reductors',
    )

    if (flnageDimentionAddon.value.data.length > 0) {
      flnageDimention.value = await useFetch(
        `/data/FlangeDimentionsExtends?name=${flnageDimentionAddon.value.data[0].flange_name}`,
        'reductors',
      )

      if (red.value.data[0].mount_type.id === 20) {
        flangeDimentionImages.value = await useFetch(
          `/data/flangeDimentionImages/${flnageDimention.value.data[0].flange_imageB5_id}`,
          'reductors',
        )
      }

      if (red.value.data[0].mount_type.id === 30) {
        flangeDimentionImages.value = await useFetch(
          `/data/flangeDimentionImages/${flnageDimention.value.data[0].flange_imageB14_id}`,
          'reductors',
        )
      }
    }
}

const loadMass = async (gear_type_id: number, gear_size_id: number, mount_type_id: number) => {
  mass.value.data = [];
  mass.value = await useFetch(
    `/data/RedGearMass?gear_type_id=${gear_type_id}&gearbox_size_id=${gear_size_id}&mount_type_id=${mount_type_id}`,
    'reductors',
  )
}

const loadOil = async () => {
  oilL.value = await useFetch(
    `data/RedOilIs?mounting_position_id=${mountPosition.value}&size_id=${red.value.data[0].gear.gear_size_id}`,
    'reductors',
  )
}

// определение параметров выходного вала {
const loadShaftDimentionData = async (gear_type_id: number, gear_size_id: number, shaft_type_id: number) => {
  outputShaftSize.value = { SE7: '', SD6: '', St9: '', Sb: '', HD: '', Hd9: '', HQ: '', HQ1: '', HQ3: '', JD2: '', JD3: '', Jd8: '', Jd10: '', JW: '',
                            JW1: '', JW2: '', JW5: '', LQ: '', LD5: '', LQ4: '', LS6: '', LW3: '', LW4: '', LW6: '', Lmod: '', motor_height_id: 0, shaft_type_id: 0, dimention_size_output_shaft: '', item_name: 0 };

  shaftDimention.value = await useFetch(
    `/data/ShaftDimentions?gear_type_id=${gear_type_id}&gearbox_size_id=${gear_size_id}&shaft_type_id=${shaft_type_id}`,
    'reductors',
  )
  if (shaftDimention.value.data.length > 0)
    outputShaftSize.value = shaftDimentionData.value.data.find(
      (item: IShaftDimentionData) =>
        item.id == shaftDimention.value.data[0].shaft_id
  )
}
// определение параметров выходного вала }

const updateMountType = async () => {
  const mountTypeData: IDocument<IRedMountType> = await useFetch(`/data/RedMountTypes/${mountType.value}`, 'reductors')
  red.value.data[0].mount_type = mountTypeData.data[0]
}

const updateShaftType = async () => {
  const shaftTypeDate: IDocument<IRedShaftType> = await useFetch(`/data/RedShaftTypes/${shaft.value.type}`, 'reductors')
  red.value.data[0].shaft_type.id = shaft.value.type;
  red.value.data[0].shaft_type.description = shaftTypeDate.data[0].description;
  red.value.data[0].shaft_type.image = shaftTypeDate.data[0].image;
}

watch(pdf1, () => {
  red.value.data[0].pdf1 = pdf1.value;
  // toast.add({ severity: 'info', summary: 'PDF с ценами', detail: 'Данные обновлены', life: 3000 })
})

watch(pdf2, () => {
  red.value.data[0].pdf2 = pdf2.value;
  // toast.add({ severity: 'info', summary: 'PDF без цен', detail: 'Данные обновлены', life: 3000 })
})

watch(() => shaft.value.type, async () => {
  await loadShaftDimentionData(gear_type_id, gear_size_id, shaft.value.type);
  await updateShaftType();
})

watch(mountPosition, async () => {
  await loadOil();
})

watch(() => flange.value.adapter, async () => {
  flangeAdapter.value = await useFetch(`/data/OutputAdaptersExtended/${flange.value.adapter}`,'reductors');

 if (flangeAdapter.value?.data)
  red.value.data[0].flange_adapter = flangeAdapter.value.data?.[0]
})

watch(() =>[gearOptionsSelected.value, colorOptionsSelected.value, oilOptionsSelected.value, warrantyOptionSelected.value], () => {
  red.value.data[0].options = JSON.stringify({
       gear_options: gearOptionsSelected.value,
       oil_options: oilOptionsSelected.value,
       color_options: colorOptionsSelected.value,
       warranty_options: warrantyOptionSelected.value
    })

  options.value = JSON.parse(red.value.data[0].options)
})

watch(mountType, async () => {
  if (mountType.value) {
    await updateMountType();
    await loadShaftData(gear_type_id, red.value.data[0].gear.gear_size.gear_box_list_size_id, mountType.value);
    await loadMass(gear_type_id, gear_size_id, mountType.value);

      // готовим данные для главного чертежа
    switch (red.value.data[0].gear.gear_size.gear_type.id) {
      case 10:
        mountData.value = red.value.data[0].mount_type.K_data;
        break;
      case 20:
        mountData.value = red.value.data[0].mount_type.C_data;
        break;
      case 30:
        mountData.value = red.value.data[0].mount_type.S_data;
        break;
      case 40:
        mountData.value = red.value.data[0].mount_type.F_data;
        break;
    }
  }
})

const loadData = async () => {
  red.value = await useFetch(`/data/UserRedConfigsExtends/${props.id}`, 'reductors')
  discountGroups.value = await useFetch('/data/RedDiscounts', 'reductors')
  shaftDimentionData.value = await useFetch(`/data/ShaftDimentionDatas`, 'reductors')

  gear_type_id = red.value.data[0].gear.gear_size.gear_type.id
  gear_size_id = red.value.data[0].gear.gear_size.gear_box_list_size_id

  nominal_power.value = Number(
    (
      (red.value.data[0].gear.t2n * red.value.data[0].user_input_speed) /
      (9550 * red.value.data[0].gear.ex_ratio)
    ).toFixed(2),
  )

  // список доступных опций
  gearOptions.value = await useFetch(
    `/data/GearOptionsView?gear_type_id=${red.value.data[0].gear.gear_size.gear_type.name}&size_id=${red.value.data[0].gear.gear_size.gear_box_list_size_id}`,
    'reductors',
  )

  // Картинки {
  adapterImage2.value = await useFetch(
    `/data/flangeDimentionImages/${red.value.data[0].flange_adapter.flange_name_ref.flange_image_id}`,
    'reductors',
  )
  // Картинки }

  mountTypeName.value = red.value.data[0].description;
  mountType.value = red.value.data[0].mount_type.id;
  mountPosition.value = red.value.data[0].mount_position_id;
  shaft.value = {
                  type: red.value.data[0].shaft_type.id,
                  direction: red.value.data[0].shaft_diirection.id
                }
  flange.value = {
                  type: red.value.data[0].flange_type.id,
                  adapter: red.value.data[0].flange_adapter.id,
                  name: red.value.data[0].flange_adapter.code_adapter,
                  mass: red.value.data[0].flange_adapter.mass,
                };

  options.value = JSON.parse(red.value.data[0].options)

  gearOptionsSelected.value = options.value.gear_options;
  oilOptionsSelected.value = options.value.oil_options;
  colorOptionsSelected.value = options.value.color_options;
  warrantyOptionSelected.value = options.value.warranty_options;

  flangeSize.value = shaftDimentionData.value.data.find(
    (item: IShaftDimentionData) => item.id === red.value.data[0].flange_adapter.shaft_dimention_id,
  )

  userId = user.getUser().userId.value

  // Группа накруток
  discontGroupSelected.value = discountGroups.value.data.find((item: RedDiscount) => item.discount == red.value.data[0].discount)

  loading.value = false
}

watch(discontGroupSelected, () => {
  if (discontGroupSelected.value)
    red.value.data[0].discount = discontGroupSelected.value.discount
})

const docNumber2 = computed(() => {
  return generateHash(red.value.data[0].id) + ' от ' + moment(red.value.data[0].date).format('DD.MM.YYYY HH:mm');
})

const reductorPrice = computed(() => {
  let payload = null;
  if (!loading.value && red.value?.data?.[0])
  payload = {
    flange_adapter: {
      id: flange.value.adapter,
      mass: flange.value.mass,
    },
    mount_type: {
      id: mountType.value,
    },
    mount_position_id: mountPosition.value,
    gear: {
      gear_size_id: red.value.data[0].gear.gear_size_id,
      gear_size: {
        gear_type: {
          id: gear_type_id,
          name: red.value.data[0].gear.gear_size.gear_type.name,
        },
        gear_box_list_size_id: red.value.data[0].gear.gear_size.gear_box_list_size_id,
      },
    },
    options: JSON.stringify({
       gear_options: gearOptionsSelected.value,
       oil_options: oilOptionsSelected.value,
       color_options: colorOptionsSelected.value,
       warranty_options: warrantyOptionSelected.value
    }),
    gear_price: Number(red.value.data[0].gear_price),
    rate_rub_cny: red.value.data[0].rate_rub_cny,
  }

  return payload;
} )

onBeforeMount(async () => {
  await loadData()
})
</script>

<template>
  <Toast />
  <WebSocket :roomId="props.id" v-model:pdf1="pdf1" v-model:pdf2="pdf2"/>
  <template v-if="loading">
    <div class="w-full flex flex-wrap justify-content-center align-content-center" style="height: 500px">
      <ProgressSpinner
        style="width: 200px; height: 200px"
        strokeWidth="8"
        fill="transparent"
        animationDuration="2s"
        aria-label="Custom ProgressSpinner"
      />
    </div>
  </template>
  <template v-else>
    <template v-if="red.data[0].user_id == userId || user.isStaff()">
      <h1 class="pt-5">Технико-коммерческое предложение № {{ docNumber2 }}</h1>
      <h2>{{ red.data[0].full_order_number }}</h2>
      <div class="field pt-5" v-if = "editMode">
        <FloatLabel>
          <Textarea id="info" v-model="red.data[0].info" class="w-full" />
          <label for="info">Комментарий</label>
        </FloatLabel>
      </div>

      <div class="field grid mt-5">

        <div class="card flex justify-center" v-if="red?.data[0]?.pdf1">
        <ButtonGroup>
            <Button icon="pi pi-download" label="PDF" severity="help"/>
            <Button label="с ценами"
            severity="help"
            @click="downloadFile(`${baseUrl.s3url}/dms/download/${red?.data[0]?.pdf1}`, `aspect ${red?.data[0]?.full_order_number}.pdf`)"/>
            <Button label="без цен"
            severity="secondary"
            @click="downloadFile(`${baseUrl.s3url}/dms/download/${red?.data[0]?.pdf2}`, `aspect ${red?.data[0]?.full_order_number} без цен.pdf`)"/>
        </ButtonGroup>
        </div>

        <CopySplitButton
        :url1="`${baseUrl.s3Storage}/${red?.data[0]?.pdf1}`"
        :url2="`${baseUrl.s3Storage}/${red?.data[0]?.pdf2}`"
        class="ml-2"
        v-if="red?.data[0]?.pdf1"
        />
        <Button
          label="Измнеить конфигурацию"
          severity="primary"
          icon="pi pi-pencil"
          @click="() => { editMode = !editMode; }"
          class="ml-2"
          v-if = "!editMode"
        />
        <Button
          label="Сохранить"
          severity="primary"
          icon="pi pi-save"
          @click="() => {
            editMode = !editMode;
            submission()
          } "
          class="ml-2"
          v-if = "editMode"
        />
        <Button
          label="Отменить изменения"
          severity="danger"
          variant="link"
          @click="() => {
            editMode = !editMode;
          } "
          class="ml-2"
          v-if = "editMode"
        />


        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Тип редуктора</label>
        <div class="col">
          <div>
            <div class="mt-1" style="width: 100%">
              <Tag :value="red.data[0].gear.gear_size.gear_type.name" severity="primary" />
              {{ red.data[0].gear.gear_size.gear_type.description }}
            </div>
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Габарит</label>
        <div class="col">
          <div>
            <div class="mt-1" style="width: 100%">
              {{ red.data[0].gear.gear_size.gear_box_list_size_id }}
            </div>
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Количество ступеней</label>
        <div class="col">
          <div>
            <div class="mt-1" style="width: 100%">
              {{ red.data[0].gear.gear_size.gear_steps.steps }}
            </div>
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Способ монтажа</label>
        <div class="col">
          <div v-if="!editMode">
            <div class="mt-1" style="width: 100%">
              <Tag :value="red.data[0].mount_type.description"/>
            </div>
            <div class="mt-1" style="width: 100%" v-if="!loading">
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].mount_type.K}`"
                v-if="red.data[0].gear.gear_size.gear_type.id == 10"
                width="300"
              />

              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].mount_type.C}`"
                v-if="red.data[0].gear.gear_size.gear_type.id == 20"
                width="300"
              />

              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].mount_type.S}`"
                v-if="red.data[0].gear.gear_size.gear_type.id == 30"
                width="300"
              />

              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].mount_type.F}`"
                v-if="red.data[0].gear.gear_size.gear_type.id == 40"
                width="300"
              />
            </div>
          </div>
          <div v-else>
            <MountType v-model="mountType"
                       v-model:mount-type-name="mountTypeName"
                       :id_gear="red.data[0].gear.id"
                       :gear_type_id="red.data[0].gear.gear_size.gear_type.id"
                       :show-title="false"/>
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Выходной вал</label>
        <div class="col">

          <div>
            <div class="mt-1 mb-1" style="width: 100%">
              <Tag value="Тип" severity="primary" /> {{ red.data[0].shaft_type.description }}
            </div>

            <!-- Сплошной вал -->
            <div v-if="red.data[0].shaft_type.id === 10">
              <Tag value="d6 x E7"/> {{ outputShaftSize?.SD6 }} x {{ outputShaftSize?.SE7 }}
            </div>

            <!-- Полый вал -->
            <div v-if="red.data[0].shaft_type.id === 20">
              <Tag value="D"/> {{ outputShaftSize?.HD }}
            </div>

            <!-- Вал со стяжной муфтой -->
            <div v-if="red.data[0].shaft_type.id === 30">
              <Tag value="D2"/> {{ outputShaftSize?.JD2 }}
            </div>

            <!-- Вал с эвольвентными шлицами -->
            <div v-if="red.data[0].shaft_type.id === 40">
              <Tag value="D5"/> {{ outputShaftSize?.LD5 }}
            </div>

            <!-- <div class="mt-1" style="width: 100%">
              <img :src="`${baseUrl.s3Storage}/${red.data[0].shaft_type.image}`" />
            </div> -->
          </div>
        </div>
        <Divider />


        <label class="col-fixed font-semibold" style="width: 200px">Направление выходного вала</label>
        <div class="col">
          <div v-if="!editMode">
            <div class="mt-1" style="width: 100%">
              <Tag :value="red.data[0].shaft_diirection.description" severity="primary" />
            </div>
            <div class="mt-1" style="width: 100%">
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].gear.gear_size.gear_type.shaft_direction_image}`"
                width="300"
              />
            </div>
          </div>
          <div v-else>
            <ShaftSelect
              v-model="shaft"
              :id_gear="red.data[0].gear.id"
              :gear-type-id="red.data[0].gear.gear_size.gear_type.id"
              :mount-type="mountType"
              :gear-size-id="red.data[0].gear.gear_size.gear_box_list_size_id"
              v-if="mountType"
            />
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Скорость</label>
        <div class="col">
          <div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Входная" severity="primary" /> {{ red.data[0].user_input_speed }} об/мин
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Выходная" severity="info" />
              {{ (red.data[0].user_input_speed / red.data[0].gear.ex_ratio).toFixed(2) }} об/мин
            </div>
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">КПД</label>
        <div class="col">
          <div>
            <div class="mt-1" style="width: 100%">
              {{ red.data[0].gear.gear_efficiency.gear_efficiency }}
            </div>
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Передаточное число</label>
        <div class="col">
          <div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Точное" severity="info" /> {{ red.data[0].gear.ex_ratio }}
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Код" severity="primary" /> {{ red.data[0].gear.ratio_code.ratio }}
            </div>
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Момент</label>
        <div class="col">
          <div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Номинальный" severity="primary" /> {{ red.data[0].gear.t2n }} Нм
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Необходимый" severity="info" /><span v-if="red.data[0].user_torque > 0"
                >{{ red.data[0].user_torque }} Нм</span
              ><span v-else> Не задано</span>
            </div>
            <div class="mt-1" style="width: 100%" v-if="red.data[0]?.user_power">
              <Tag value="Исходя из данных двигателя" severity="secondary" />
              {{
                (
                  (9550 * Number(red.data[0].user_power) ) /
                  Number(red.data[0].user_input_speed / red.data[0].gear.ex_ratio)
                ).toFixed(2)
              }}
              Нм
            </div>
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Мощность</label>
        <div class="col">
          <div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Подключаемого двигателя" severity="primary" />
              {{ red.data[0].user_power }} кВт
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Номинальная входная мощность редуктора" severity="info" />
              {{ nominal_power }} кВт
            </div>
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Сервис фактор</label>
        <div class="col">
          <div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Из мощности" severity="primary" /><span
                v-if="red.data[0].user_power > 0"
                >{{ (nominal_power / red.data[0].user_power).toFixed(2) }}

                <!-- ((data.t2n * props.commonData.inputSpeed) / (9550 * data.ex_ratio) / props.typeConfig.value ).toFixed(2) -->

                </span

              ><span v-else>Не задано</span>
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Из крутящего момента" severity="primary" /><span
                v-if="red.data[0].user_torque > 0"
                >{{ red.data[0].gear.t2n / red.data[0].user_torque }}</span
              ><span v-else>Не задано</span>
            </div>
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Необходимое кол-во масла</label>
        <div class="col">
          <div>
            <div class="mt-1" style="width: 100%">{{ oilL?.data?.[0]?.description }} л</div>
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px"
          >Положение редуктора в пространстве</label
        >
        <div class="col">
          <div v-if="!editMode">
            <div class="mt-1" style="width: 100%">
              <Tag :value="red.data[0].mount_position.code" severity="primary"/>
            </div>
            <div class="mt-1" style="width: 100%">
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].gear.gear_size.gear_type.mount_position_image}`"
                width="300"
              />
            </div>
          </div>
          <div v-else>
            <MountingPositionSelect v-model="mountPosition"
                                    :gearTypeId="red.data[0].gear.gear_size.gear_type.id"
                                    :show-title="false"/>
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Переходной адаптер</label>
        <div class="col">
          <div v-if="!editMode">
            <div class="mt-1" style="width: 100%">
              <Tag value="Тип" severity="primary" /> {{ red.data[0].flange_type.designation_type }}
              {{ red.data[0].flange_type.flange_type_description }}
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Код" severity="primary" /> {{ red.data[0].flange_adapter.code_adapter }}
            </div>

          </div>
          <div v-else>
            <AdapterFlange
              v-model="flange"
              :t2n="red.data[0].gear.t2n"
              :ex_ratio="red.data[0].gear.ex_ratio"
              :inputSpeed="red.data[0].user_input_speed"
              :shaft-type="shaft.type"
              v-if="shaft"
            />
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Масса</label>
        <div class="col">
          <div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Масса редуктора" severity="primary" /> {{ mass.data[0]?.mass ? mass.data[0]?.mass : 'Нет в справочнике' }} кг
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Масса адаптера" severity="primary" />
              {{ red.data[0].flange_adapter.mass }} кг
            </div>
          </div>
        </div>
        <Divider />









        <h1>Габаритные чертежи к техническому листу</h1>
        <Divider />
        <label class="col-fixed font-semibold" style="width: 200px"
          >Общий габарит корпуса (направление вала и фланца может не совпадать)</label
        >
        <div class="col flex">
          <div>
            <div class="mt-1" style="width: 100%">
              <Tag :value="red.data[0].mount_type.description"/>
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag :value="red.data[0].gear.gear_size.gear_type.description"/>
            </div>
            <div class="mt-1" style="width: 100%">
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].mount_type.K_figure}`"
                v-if="red.data[0].gear.gear_size.gear_type.id == 10"
                width="600"
              />
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].mount_type.C_figure}`"
                v-if="red.data[0].gear.gear_size.gear_type.id == 20"
                width="600"
              />
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].mount_type.S_figure}`"
                v-if="red.data[0].gear.gear_size.gear_type.id == 30"
                width="600"
              />
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].mount_type.F_figure}`"
                v-if="red.data[0].gear.gear_size.gear_type.id == 40"
                width="600"
              />
            </div>
          </div>
          <div class="ml-5 align-content-center justify-content-center flex-wrap">
            <MainGearData
              :gear-type-id="red.data[0].gear.gear_size.gear_type.id"
              :gear-size-id="red.data[0].gear.gear_size.gear_box_list_size_id"
              :data="mountData"
            />
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Габариты фланца</label>
        <div class="col flex">
          <div>
            <div class="mt-1" style="width: 100%" v-if="flangeDimentionImages.data.length > 0">
              <img
                :src="`${baseUrl.s3Storage}/${flangeDimentionImages.data[0].image}`"
                v-if="flangeDimentionImages.data[0].image.length > 2"
                height="200"
              />
              <img
                :src="`${baseUrl.s3Storage}/${flangeDimentionImages.data[0].image2}`"
                v-if="flangeDimentionImages.data[0].image2.length > 2"
                height="200"
              />
            </div>
          </div>
          <div class="ml-5">
            <div v-if="flnageDimention.data.length > 0">
              <div class="mt-1" style="width: 100%">
                <Tag value="m1" severity="primary" /> {{ flnageDimention.data[0].m }}
              </div>
              <div class="mt-1" style="width: 100%">
                <Tag value="N1" severity="primary" /> {{ flnageDimention.data[0].n }}
              </div>
              <div class="mt-1" style="width: 100%">
                <Tag value="P1" severity="primary" /> {{ flnageDimention.data[0].p }}
              </div>
              <div class="mt-1" style="width: 100%">
                <Tag value="s1" severity="primary" /> {{ flnageDimention.data[0].s }}
              </div>
              <div class="mt-1" style="width: 100%">
                <Tag value="f1" severity="primary" /> {{ flnageDimention.data[0].f }}
              </div>
            </div>
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Габариты вала</label>
        <div class="col">
          <div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Тип" severity="primary" /> {{ red.data[0].shaft_type.description }}
            </div>
            <!-- Сплошной вал -->
            <div v-if="red.data[0].shaft_type.id === 10">
              <p>d6 x E7 = {{ outputShaftSize?.SD6 }} x {{ outputShaftSize?.SE7 }}</p>
              <p>t9/b = {{ outputShaftSize?.St9 }}/{{ outputShaftSize?.Sb }}</p>
            </div>

            <!-- Полый вал -->
            <div v-if="red.data[0].shaft_type.id === 20">
              <p>D = {{ outputShaftSize?.HD }}</p>
              <p>T/b = {{ outputShaftSize?.St9 }}/{{ outputShaftSize?.Sb }}</p>
              <p>
                Q/Q1/Q3 = {{ outputShaftSize?.HQ }}/{{ outputShaftSize?.HQ1 }}/{{
                  outputShaftSize?.HQ3
                }}
              </p>
            </div>

            <!-- Вал со стяжной муфтой -->
            <div v-if="red.data[0].shaft_type.id === 30">
              <p>
                D2/D3/d8 = {{ outputShaftSize?.JD2 }}/{{ outputShaftSize?.JD3 }}/{{
                  outputShaftSize?.Jd8
                }}
              </p>
              <p>
                W/W1/W2/W5 = {{ outputShaftSize?.JW }}/{{ outputShaftSize?.JW1 }}/J{{
                  outputShaftSize?.JW2
                }}/{{ outputShaftSize?.JW5 }}
              </p>
              <p>d8 = {{ outputShaftSize?.Jd8 }}</p>
              <p>W5 = {{ outputShaftSize?.JW5 }}</p>
            </div>

            <!-- Вал с эвольвентными шлицами -->
            <div v-if="red.data[0].shaft_type.id === 40">
              <p>D5 = {{ outputShaftSize?.LD5 }}</p>
              <p>W6 = {{ outputShaftSize?.LW6 }}</p>
              <p>
                Q/W3/W4/Q4/S6 = {{ outputShaftSize?.LQ }}/{{ outputShaftSize?.LW3 }}/{{
                  outputShaftSize?.LW4
                }}/{{ outputShaftSize?.LQ4 }}/{{ outputShaftSize?.LS6 }}
              </p>
            </div>
            <!-- <div v-for="element in getShaftDimentionValues(outputShaftSize)" v-bind:key="element.name" class="mt-1" style="width: 100%">
                          <Tag :value="element.name" severity="primary" /> {{ element.value }}
                        </div> -->
            <div class="mt-1" style="width: 100%">
              <img :src="`${baseUrl.s3Storage}/${red.data[0].shaft_type.image}`" width="300"/>
            </div>
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Габариты адаптера</label>
        <div class="col flex">
          <div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Тип" severity="primary" /> {{ red.data[0].flange_type.designation_type }}
              {{ red.data[0].flange_type.flange_type_description }}
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Код" severity="primary" /> {{ red.data[0].flange_adapter.code_adapter }}
            </div>
            <div class="mt-1" style="width: 100%">
              <p>
                Фланец P1/N1: {{ red.data[0].flange_adapter.flange_name_ref.p }}мм/{{
                  red.data[0].flange_adapter.flange_name_ref.n
                }}мм (край/крепеж отв)
              </p>
              <p>
                Подключаемый вал d1xL: {{ flangeSize!.SD6 }} x {{ red.data[0].flange_adapter.L }}
              </p>
            </div>
            <div class="mt-1" style="width: 100%">
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].flange_adapter.adapter_image.image}`" width="300"
              />
              <img :src="`${baseUrl.s3Storage}/${adapterImage2.data[0].image}`" width="300" v-if="adapterImage2.data[0].image.length > 1"/>
            </div>
          </div>
          <div class="ml-5 align-content-center justify-content-center flex-wrap">
            <div class="mt-1" style="width: 100%">
              <Tag value="L2" severity="primary" /> {{ red.data[0].flange_adapter.L }}
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="m1" severity="primary" />
              {{ red.data[0].flange_adapter.flange_name_ref.m }}
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="N1" severity="primary" />
              {{ red.data[0].flange_adapter.flange_name_ref.n }}
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="P1" severity="primary" />
              {{ red.data[0].flange_adapter.flange_name_ref.p }}
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="s1" severity="primary" />
              {{ red.data[0].flange_adapter.flange_name_ref.s }}
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="f1" severity="primary" />
              {{ red.data[0].flange_adapter.flange_name_ref.f }}
            </div>

            <div class="mt-1" style="width: 100%">
              <!-- был Е1 -->
              <Tag value="L" severity="primary" /> {{ flangeSize!.SE7 }}
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="D1" severity="primary" /> {{ flangeSize!.SD6 }}
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="t1" severity="primary" /> {{ flangeSize!.St9 }}
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="b1" severity="primary" /> {{ flangeSize!.Sb }}
            </div>

          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Опции</label>
        <div class="col">
          <div v-if="!editMode">
            <div class="mt-1" style="width: 100%">
              <Tag value="Опции редуктора" severity="primary" />
              <DataTable :value="gearOptionsSelected" stripedRows tableStyle="min-width: 40rem">
                <Column header="Наименование" headerStyle="width: 25%">
                  <template #body="{ data }">
                    {{ data.description }}
                  </template>
                </Column>
                <!--Column header="Цена" headerStyle="width: 15%">
                  <template #body="{ data }">
                    <DisplayPrice
                      :price="data.price"
                      :discount="red.data[0].discount"
                      currency-symbol="&#165;"
                      size="S"
                    />
                  </template>
                </Column-->
                <Column header="" headerStyle="width: 50%"></Column>
              </DataTable>
            </div>

            <div class="mt-5" style="width: 100%">
              <Tag value="Опции масла" severity="primary" />
              {{ options.oil_options.description }},
              <!--DisplayPrice
                :price="options.oil_options.price"
                :discount="0"
                currency-symbol="&#165;"
                size="S"
              /-->
            </div>

            <div class="mt-5" style="width: 100%">
              <Tag value="Опции покраски" severity="info" />
              {{ options?.color_options?.description }},
              <!--DisplayPrice
                :price="options.color_options.price"
                :discount="0"
                currency-symbol="&#165;"
                size="S"
              /-->
            </div>

            <div class="mt-5" style="width: 100%">
              <Tag value="Опции гарантии" severity="secondary" />
              {{ options.warranty_options.description }},
              {{ options.warranty_options.add_description }},
            </div>
          </div>
          <div v-else>
            <OptionsSelect
              :id_size_gear="red.data?.[0]?.gear?.gear_size_id"
              :gear_box_list_size_id="red.data?.[0]?.gear?.gear_size.gear_box_list_size_id"
              :gear-type-id="red.data?.[0]?.gear?.gear_size?.gear_type?.id"
              :mounting-position-id="mountPosition"
              :discount="1 + red.data[0].discount/100"
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
        </div>

        <Divider />
      <label class="col-fixed font-semibold" style="width: 200px">Итоговая цена редуктора с опциями в Екатеринбурге</label>
      <div class="col">
        <div>
          <div class="mt-1" style="width: 100%">
            <Tag :value="priceFormat(totalPrice * (1 + red.data[0].discount/100)) + ' &#165;'" severity="primary" />
          </div>

          <div class="mt-1" style="width: 100%">
          <Tag :value="priceFormat(totalPrice * (1 + red.data[0].discount/100) * red.data[0].rate_rub_cny) + ' &#8381;'" severity="info" />
          (по курсу {{ red.data[0].rate_rub_cny }} &#8381; за 1 &#165; на {{ moment(red.data[0].date).format('DD.MM.YYYY') }})
          </div>
        </div>
      </div>
    </div>



      <DeliveryReport :red="reductorPrice" :display="true" v-model="totalPrice" />

      <div v-if="user.isStaff()" class="mt-5">
        <h3 v-if="discountGroups.data" class="font-bold">Накрутка</h3>
        <SelectButton
          v-model="discontGroupSelected"
          class="bg-primary"
          :options="discountGroups.data"
          optionLabel="name"
        />
      </div>


    </template>
    <template v-else> Недостаточно прав </template>


  </template>
</template>
