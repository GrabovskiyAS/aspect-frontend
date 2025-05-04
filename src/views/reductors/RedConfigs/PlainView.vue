<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue'
import type { IDocument } from '@/Interfaces/invertors'
import type { RedDiscount } from '@/Interfaces/reductors'
import { useFetch } from '@/api/useFetch'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
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
import DisplayPrice from '@/components/Common/DisplayPrice.vue'
import DeliveryReport from '@/components/Reductors/DeliveryReport.vue'
import { patchDataReductors } from '@/api/dataActionsReductors'
import { generatePDFReductor } from '@/api/generatePDFreductor'
import moment from 'moment'
// import { getShaftDimentionValues } from '@/api/getShaftDimentionValues';
import MainGearData from '@/components/Reductors/MainGearData.vue'
import { useUserStore } from '@/stores/user'

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

let gear_type_id = 0
let gear_size_id = 0
let userId = 0

const mountData = ref<string>('')
const totalPrice = ref<number>(0)

const loading = ref<boolean>(true)
const props = defineProps(['id'])
const nominal_power = ref<number>(0)

async function savePDF(print_price: number) {
  generatePDFReductor(
    red.value.data[0],
    totalPrice.value,
    print_price,
  )
}

const submission = async () => {
  let payload;

  if (user.isStaff())
    payload = { info: red.value.data[0].info,
                discount: discontGroupSelected.value?.discount
               }
  else
    payload = { info: red.value.data[0].info }

  patchDataReductors(`/data/UserRedConfigs/${props.id}`, payload).then(
    () => {
      // console.log(response)
      toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 })
    },
  )
}

const loadData = async () => {
  red.value = await useFetch(`/data/UserRedConfigsExtends/${props.id}`, 'reductors')
  discountGroups.value = await useFetch('/data/RedDiscounts', 'reductors')
  shaftDimentionData.value = await useFetch(`/data/ShaftDimentionDatas`, 'reductors')
  // Опции { ===================================================================================================================================================================
  oilL.value = await useFetch(
    `data/RedOilIs?mounting_position_id=${red.value.data[0].mount_position_id}&size_id=${red.value.data[0].gear.gear_size_id}`,
    'reductors',
  )
  nominal_power.value = Number(
    (
      (red.value.data[0].gear.t2n * red.value.data[0].user_input_speed) /
      (9550 * red.value.data[0].gear.ex_ratio)
    ).toFixed(2),
  )
  gearOptions.value = await useFetch(
    `/data/GearOptionsView?gear_type_id=${red.value.data[0].gear.gear_size.gear_type.name}&size_id=${red.value.data[0].gear.gear_size.gear_box_list_size_id}`,
    'reductors',
  )
  // Опции } ===================================================================================================================================================================

  // Картинки }

  adapterImage2.value = await useFetch(
    `/data/flangeDimentionImages/${red.value.data[0].flange_adapter.flange_name_ref.flange_image_id}`,
    'reductors',
  )
  // Картинки }

  gear_type_id = red.value.data[0].gear.gear_size.gear_type.id
  gear_size_id = red.value.data[0].gear.gear_size.gear_box_list_size_id

  // масса
  mass.value = await useFetch(
    `/data/RedGearMass?gear_type_id=${gear_type_id}&gearbox_size_id=${gear_size_id}&mount_type_id=${red.value.data[0].mount_type.id}`,
    'reductors',
  )

  // Размеры фланца выходного вала {

  flnageDimentionAddon.value = await useFetch(
    `/data/FlangeDimentionAddons?gear_type_id=${gear_type_id}&gearbox_size_id=${gear_size_id}&mount_type_id=${red.value.data[0].mount_type.id}`,
    'reductors',
  )
  if (flnageDimentionAddon.value.data.length > 0) {
    flnageDimention.value = await useFetch(
      `/data/FlangeDimentionsExtends?name=${flnageDimentionAddon.value.data[0].flange_name}`,
      'reductors',
    )

    if (red.value.data[0].mount_position_id === 20)
      flangeDimentionImages.value = await useFetch(
        `/data/flangeDimentionImages/${flnageDimention.value.data[0].flange_imageB5_id}`,
        'reductors',
      )

    if (red.value.data[0].mount_position_id === 30)
      flangeDimentionImages.value = await useFetch(
        `/data/flangeDimentionImages/${flnageDimention.value.data[0].flange_imageB14_id}`,
        'reductors',
      )

  }
  // Размеры фланца выходного вала }


  options.value = JSON.parse(red.value.data[0].options)

  gearOptionsSelected.value = options.value.gear_options;

      // oil_options: oilOptionsSelected.value,
      // color_options: colorOptionsSelected.value,
      // warranty_options: warrantyOptionSelected.value

  // определение параметров выходного вала {
  shaftDimention.value = await useFetch(
    `/data/ShaftDimentions?gear_type_id=${gear_type_id}&gearbox_size_id=${gear_size_id}&shaft_type_id=${red.value.data[0].shaft_type.id}`,
    'reductors',
  )
  if (shaftDimention.value.data.length > 0)
    outputShaftSize.value = shaftDimentionData.value.data.find(
      (item: IShaftDimentionData) =>
        item.id == shaftDimention.value.data[0].shaft_id
        // item.dimention_size_output_shaft === shaftDimention.value.data[0].output_shaft_size &&
        // item.shaft_type_id === red.value.data[0].shaft_type.id,
    )
  // определение параметров выходного вала }

  flangeSize.value = shaftDimentionData.value.data.find(
    (item: IShaftDimentionData) => item.id === red.value.data[0].flange_adapter.shaft_dimention_id,
  )

  userId = user.getUser().userId.value

  // готовим данные для главного чертежа
  switch (red.value.data[0].mount_type.id) {
    case 10:
      mountData.value = red.value.data[0].mount_type.K_data;
      break;
    case 20:
      mountData.value = red.value.data[0].mount_type.K_data;
      break;
    case 30:
      mountData.value = red.value.data[0].mount_type.K_data;
      break;
    case 40:
      mountData.value = red.value.data[0].mount_type.K_data;
      break;
  }
  // Группа накруток
  discontGroupSelected.value = discountGroups.value.data.find((item: RedDiscount) => item.discount == red.value.data[0].discount)


  loading.value = false
}

watch(discontGroupSelected, () => {
  if (discontGroupSelected.value)
    red.value.data[0].discount = discontGroupSelected.value.discount
})

const docNumber = computed(() => {
    const suffix = red.value.data[0].user_id.toString() +
    '/' +
    red.value.data[0].id!.toString() +
    ' от ' +
    moment(red.value.data[0].date).format('DD.MM.YYYY')

    if (user.isStaff())
      return red.value.data[0].full_order_number + suffix
    else
      return red.value.data[0].short_order_number + suffix
    })


onBeforeMount(async () => {
  await loadData()
})
</script>

<template>
  <Toast />
  <template v-if="loading"> loading </template>
  <template v-else>
    <template v-if="red.data[0].user_id == userId || user.isStaff()">
      <h1 class="pt-5">Технико-коммерческое предложение № {{ docNumber }}</h1>
      <div class="field pt-5">
        <FloatLabel>
          <Textarea id="info" v-model="red.data[0].info" class="w-full" />
          <label for="info">Комментарий</label>
        </FloatLabel>
      </div>

      <div class="field grid">
        <Button
          label="PDF"
          severity="help"
          icon="pi pi-download"
          @click="savePDF(1)"
          v-if="totalPrice"
          class="ml-2"
        />
        <Button
          label="PDF без цен"
          severity="secondary"
          icon="pi pi-download"
          @click="savePDF(0)"
          v-if="totalPrice"
          class="ml-2"
        />
        <Button
          label="Сохранить"
          severity="primary"
          icon="pi pi-save"
          @click="submission"
          class="ml-2"
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
          <div>
            <div class="mt-1" style="width: 100%">
              <Tag :value="red.data[0].mount_type.description"/>
            </div>
            <div class="mt-1" style="width: 100%">
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].mount_type.K}`"
                v-if="red.data[0].gear.gear_size.gear_type.id == 10"
              />
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].mount_type.C}`"
                v-if="red.data[0].gear.gear_size.gear_type.id == 20"
              />
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].mount_type.S}`"
                v-if="red.data[0].gear.gear_size.gear_type.id == 30"
              />
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].mount_type.F}`"
                v-if="red.data[0].gear.gear_size.gear_type.id == 40"
              />
            </div>
          </div>
        </div>
        <Divider />


        <label class="col-fixed font-semibold" style="width: 200px">Фланец выходного вала</label>

        <div class="col">
          <div class="mt-1" style="width: 100%" v-if="flangeDimentionImages.data.length > 0">
            <img
              :src="`${baseUrl.s3Storage}/${flangeDimentionImages.data[0].image}`"
              v-if="flangeDimentionImages.data[0].image.length > 2"
            />
            <img
              :src="`${baseUrl.s3Storage}/${flangeDimentionImages.data[0].image2}`"
              v-if="flangeDimentionImages.data[0].image2.length > 2"
            />
          </div>
          <div>
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

            <div class="mt-1" style="width: 100%">
              <img :src="`${baseUrl.s3Storage}/${red.data[0].shaft_type.image}`" />
            </div>
          </div>
        </div>
        <Divider />


        <label class="col-fixed font-semibold" style="width: 200px">Направление выходного вала</label>
        <div class="col">
          <div>
            <div class="mt-1" style="width: 100%">
              {{ red.data[0].shaft_diirection.description }}
            </div>
            <div class="mt-1" style="width: 100%">
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].gear.gear_size.gear_type.shaft_direction_image}`"
              />
            </div>
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
            <div class="mt-1" style="width: 100%">{{ oilL.data[0].description }} л</div>
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px"
          >Положение редуктора в пространстве</label
        >
        <div class="col">
          <div>
            <div class="mt-1" style="width: 100%">
              {{ red.data[0].mount_position.code }}
            </div>
            <div class="mt-1" style="width: 100%">
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].gear.gear_size.gear_type.mount_position_image}`"
              />
            </div>
          </div>
        </div>
        <Divider />





        <label class="col-fixed font-semibold" style="width: 200px">Переходной адаптер</label>
        <div class="col">
          <div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Тип" severity="primary" /> {{ red.data[0].flange_type.designation_type }}
              {{ red.data[0].flange_type.flange_type_description }}
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Код" severity="primary" /> {{ red.data[0].flange_adapter.code_adapter }}
            </div>
            <div class="mt-1" style="width: 100%">
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].flange_adapter.adapter_image.image}`"
              />
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

        <label class="col-fixed font-semibold" style="width: 200px">Масса</label>
        <div class="col">
          <div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Масса редуктора" severity="primary" /> {{ mass.data[0].mass }} кг
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
        <div class="col">
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
              />
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].mount_type.C_figure}`"
                v-if="red.data[0].gear.gear_size.gear_type.id == 20"
              />
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].mount_type.S_figure}`"
                v-if="red.data[0].gear.gear_size.gear_type.id == 30"
              />
              <img
                :src="`${baseUrl.s3Storage}/${red.data[0].mount_type.F_figure}`"
                v-if="red.data[0].gear.gear_size.gear_type.id == 40"
              />
            </div>
            <MainGearData
              :gear-type-id="red.data[0].gear.gear_size.gear_type.id"
              :gear-size-id="red.data[0].gear.gear_size.gear_box_list_size_id"
              :data="mountData"
            />
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Габариты фланца</label>
        <div class="col">
          <div>
            <div class="mt-1" style="width: 100%" v-if="flangeDimentionImages.data.length > 0">
              <img
                :src="`${baseUrl.s3Storage}/${flangeDimentionImages.data[0].image}`"
                v-if="flangeDimentionImages.data[0].image.length > 2"
              />
              <img
                :src="`${baseUrl.s3Storage}/${flangeDimentionImages.data[0].image2}`"
                v-if="flangeDimentionImages.data[0].image2.length > 2"
              />
            </div>
          </div>
          <div>
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
              <img :src="`${baseUrl.s3Storage}/${red.data[0].shaft_type.image}`" />
            </div>
          </div>
        </div>
        <Divider />

        <label class="col-fixed font-semibold" style="width: 200px">Габариты адаптера</label>
        <div class="col">
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
                :src="`${baseUrl.s3Storage}/${red.data[0].flange_adapter.adapter_image.image}`"
              />
              <img :src="`${baseUrl.s3Storage}/${adapterImage2.data[0].image}`" />
            </div>


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
          <div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Редуктор" severity="primary" />
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
              <Tag value="Масло" severity="primary" />
              {{ options.oil_options.description }},
              <!--DisplayPrice
                :price="options.oil_options.price"
                :discount="0"
                currency-symbol="&#165;"
                size="S"
              /-->
            </div>

            <div class="mt-5" style="width: 100%">
              <Tag value="Покарска" severity="info" />
              {{ options.color_options.description }},
              <!--DisplayPrice
                :price="options.color_options.price"
                :discount="0"
                currency-symbol="&#165;"
                size="S"
              /-->
            </div>

            <div class="mt-5" style="width: 100%">
              <Tag value="Гарантия" severity="secondary" />
              {{ options.warranty_options.description }},
              {{ options.warranty_options.add_description }},
            </div>
          </div>
        </div>
        <Divider />

      </div>

      <DeliveryReport :red="red.data[0]" v-model="totalPrice"/>

      <div v-if="user.isStaff()" class="mt-5">
        <h3 v-if="discountGroups.data" class="font-bold">Накрутка</h3>
        <SelectButton
          v-model="discontGroupSelected"
          class="bg-primary"
          :options="discountGroups.data"
          optionLabel="name"
        />
      </div>


      <div class="mt-5" style="width: 100%">
        <Tag value="Итоговая цена редуктора с опциями в Екатеринбурге" severity="info" />
        <DisplayPrice
          :price="totalPrice * (1 + red.data[0].discount/100)"
          :discount="0"
          currency-symbol="&#165;"
          size="S"
        />
        <DisplayPrice
          :price="totalPrice * (1 + red.data[0].discount/100) * red.data[0].rate_rub_cny"
          :discount="0"
          currency-symbol="&#8381;"
          size="S"
        />
      </div>
    </template>
    <template v-else> Недостаточно прав </template>
  </template>
</template>
