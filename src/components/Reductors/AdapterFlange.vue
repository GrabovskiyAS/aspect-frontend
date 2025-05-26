<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import RadioButton from 'primevue/radiobutton'
import Tag from 'primevue/tag'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type {
  IFlangeDimention,
  IFlange,
  IFlangeDimentionImage,
  IOutputAdapterImage,
  IRedGearSize,
  IShaftDimention,
  IShaftDimentionData,
  OutputAdapter,
  IFlangeData,
  IShaftData,
} from '@/Interfaces/reductors'
import { useBaseUrl } from '@/stores/baseUrl'
import { getAdapterShaftData, getAdapterFlangeData } from '@/api/Reductors/flange'

interface IFlangeType {
  name: string
  id: number
  image: string
}

const baseUrl = useBaseUrl()
const props = defineProps(['red', 'inputSpeed', 'shaftType'])
const model = defineModel<IFlange>()
// const modelFlangeTypeSize = defineModel<IFlange>('flange_type')

const flangeTypes: IFlangeType[] = [
  { name: 'AP фланец с перех муфтой под вал ЭД', id: 10, image: 'AE.png' },
  { name: 'AE свободный вых вал', id: 20, image: 'AP.png' },
]
const flangeType = ref<IFlangeType>({
  name: 'AP фланец с перех муфтой под вал ЭД',
  id: 10,
  image: 'AE.png',
})

const flangeAdapters = ref<IDocument<OutputAdapter>>({ data: [], error: [], loading: true })
const flangeTypeSizes = ref<IDocument<IFlangeType>>({ data: [], error: [], loading: true })
const outpuAdapterImages = ref<IDocument<IOutputAdapterImage>>({
  data: [],
  error: [],
  loading: true,
})
const shaftDimentions = ref<IDocument<IShaftDimention>>({ data: [], error: [], loading: true })
const shaftDimentionData = ref<IDocument<IShaftDimentionData>>({
  data: [],
  error: [],
  loading: true,
})
const gearSizes = ref<IDocument<IRedGearSize>>({ data: [], error: [], loading: true })
const flangeDimentions = ref<IDocument<IFlangeDimention>>({ data: [], error: [], loading: true })
const flangeDimentionImages = ref<IDocument<IFlangeDimentionImage>>({
  data: [],
  error: [],
  loading: true,
})
const flangeAdaptersFiltered = ref<any[]>([])
const flangeTypeSize = ref<IFlangeType>()
const outputShaftData = ref<IShaftData | null>()
const outputFlangeData = ref<IFlangeData | null>()

const flangeTypeSizeImage = ref<string>('')
const flangeTypeSizeImage2 = ref<string>('')

const flangeAdapter = ref<OutputAdapter>()
const loading = ref<boolean>(true)
const power = ref<number>(0)
const flangeAdapterImage = ref<string>('')
const flangeAdapterImage2 = ref<string>('')

const filter = async () => {
  flangeAdaptersFiltered.value = flangeAdapters.value.data.filter(
    (item: OutputAdapter) =>
      item.power > 0.5 * power.value &&
      item.power < 4 * power.value &&
      item.adapter_type_id == flangeType.value.id,
  )

  flangeAdaptersFiltered.value = flangeAdaptersFiltered.value.map((item: OutputAdapter) => {
    return {
      id: item.id,
      name: item.code_adapter + ' - высота: ' + item.height_id.toString(),
      code_adapter: item.code_adapter,
      flange_name: item.flange_name,
      L: item.L,
      height_id: item.height_id,
    }
  })

  flangeAdapter.value = flangeAdaptersFiltered.value[0]
}

const loadData = async () => {
  flangeAdapters.value = await useFetch('/data/OutputAdapters', 'reductors')
  flangeTypeSizes.value = await useFetch('/data/FlangeTypes?not_null=1', 'reductors')
  outpuAdapterImages.value = await useFetch(`/data/OutputAdapterImages`, 'reductors')
  shaftDimentions.value = await useFetch(`/data/ShaftDimentions`, 'reductors')
  gearSizes.value = await useFetch(`/data/RedGearSizes`, 'reductors')
  shaftDimentionData.value = await useFetch(`/data/ShaftDimentionDatas`, 'reductors')
  flangeDimentions.value = await useFetch(`/data/FlangeDimentions`, 'reductors')
  flangeDimentionImages.value = await useFetch(`/data/FlangeDimentionImages`, 'reductors')

  flangeTypeSize.value = flangeTypeSizes.value.data[0] // устанавливаем начальное знечение типа фланца

  power.value = Number(
    ((Number(props.red.t2n) * props.inputSpeed) / (9550 * Number(props.red.ex_ratio))).toFixed(2),
  )
  filter()

  loading.value = false
}


watch([flangeType, flangeAdapter], async () => {
  // изменяем знначение модели компонента по значениям внутренней модели
  if (flangeType.value) model.value!.type = flangeType.value.id
  if (flangeAdapter.value) {
    model.value!.adapter = flangeAdapter.value!.id!
    model.value!.name = flangeAdaptersFiltered.value.find((item) => item.id == flangeAdapter.value!.id!).code_adapter
  }

  // Формируем изображение для переходного адаптера
  const flangeAdapterImageId = flangeAdapters.value.data.find(
    (item) => item.code_adapter === flangeAdapter.value!.code_adapter,
  )?.adapter_image_id
  if (flangeAdapterImageId) {
    flangeAdapterImage.value = outpuAdapterImages.value.data.find(
      (item) => item.id === Number(flangeAdapterImageId),
    )!.image
  }

  // Формируем данные для переходного адаптера =============================================================
  // {
  // const gearSize = gearSizes.value.data.find((item) => item.id === props.red.id_size_gear)
  // const outputShaft = shaftDimentions.value.data.find((item) => item.gear_type_id === props.red.gear_type_id && item.gearbox_size_id == gearSize!.gear_box_list_size_id)!
  // outputShaftData.value = shaftDimentionData.value.data.find((item) => Number(item.dimention_size_output_shaft) == outputShaft.output_shaft_size && item.shaft_type_id === props.shaftType)

  if (flangeAdapter.value && flangeAdapter.value.id) {
    outputShaftData.value = getAdapterShaftData(
      flangeAdapters.value.data,
      shaftDimentionData.value.data,
      flangeAdapter.value.id,
    )
    outputFlangeData.value = getAdapterFlangeData(
      flangeAdapters.value.data,
      flangeDimentions.value.data,
      flangeAdapter.value.id,
    )
  } else {
    outputShaftData.value = null
    outputFlangeData.value = null
  }

  // }
  // Формируем данные для переходного адаптера =============================================================

    const imageId = flangeDimentions.value.data.find((item) => item.name == flangeAdapter.value.flange_name);
    // console.log(imageId.flange_image_id)
    flangeAdapterImage2.value = flangeDimentionImages.value.data.find((item) => item.id == imageId.flange_image_id)
    console.log(flangeAdapterImage2.value.image)
})

watch(flangeTypeSize, () => {
  const flangeDimention = flangeDimentions.value.data.find(
    (item) => item.name === flangeAdapter.value!.flange_name,
  )
  let imageId: number = 0
  if (flangeTypeSize.value!.id === 10) imageId = flangeDimention!.flange_imageB5_id
  if (flangeTypeSize.value!.id === 20) imageId = flangeDimention!.flange_imageB14_id

  flangeTypeSizeImage.value = flangeDimentionImages.value.data.find(
    (item) => item.id === imageId,
  )!.image
  flangeTypeSizeImage2.value = flangeDimentionImages.value.data.find(
    (item) => item.id === imageId,
  )!.image2
})

watch(flangeType, () => {
  filter()
})

onBeforeMount(async () => {
  await loadData()
})
</script>

<template>
  <div class="mt-5" v-if="!loading">
    <!-- <span class="text-2xl font-semibold mt-5 text-primary">Адаптер</span> -->

    <span class="text-2xl font-semibold mt-5 text-primary">Тип переходного адаптера</span>
    <div class="grid">

      <div class="col-4">
        <div>
          <div v-for="flange in flangeTypes" :key="flange.id" class="flex items-center gap-2 mt-1">
            <RadioButton v-model="flangeType" :inputId="flange.name" name="dynamic" :value="flange" />
            <label :for="flange.name">{{ flange.name }}</label>
          </div>
        </div>
      </div>

      <div class="col-5 flex justify-content-center flex-wrap">
        <div><img :src="`${baseUrl.s3Storage}/${flangeAdapterImage}`" height="300"/></div>
      </div>

      <div class="col-1 flex justify-content-center align-content-center flex-wrap">
        <div>
          <div class="mt-1" style="width: 100%">
            <Tag value="L" severity="primary" /> {{ flangeAdapter!.L }}
          </div>
          <div class="mt-1" style="width: 100%">
            <Tag value="E1" severity="primary" /> {{ outputShaftData?.SE7 }}
          </div>
          <div class="mt-1" style="width: 100%">
            <Tag value="d1" severity="primary" /> {{ outputShaftData?.SD6 }}
          </div>
          <div class="mt-1" style="width: 100%">
            <Tag value="t1" severity="primary" /> {{ outputShaftData?.St9 }}
          </div>
          <div class="mt-1" style="width: 100%">
            <Tag value="b" severity="primary" /> {{ outputShaftData?.Sb }}
          </div>
        </div>
      </div>
      <div class="col-2 flex justify-content-center align-content-center flex-wrap">
        <div>
          <div class="mt-1" style="width: 100%">
            <Tag value="m1" severity="primary" /> {{ outputFlangeData?.m }}
          </div>
          <div class="mt-1" style="width: 100%">
            <Tag value="n1" severity="primary" /> {{ outputFlangeData?.n }}
          </div>
          <div class="mt-1" style="width: 100%">
            <Tag value="p1" severity="primary" /> {{ outputFlangeData?.p }}
          </div>
          <div class="mt-1" style="width: 100%">
            <Tag value="s1" severity="primary" /> {{ outputFlangeData?.s }}
          </div>
        </div>
      </div>
    </div>

    <div class="grid">
      <div class="col-4">
        <div class="mt-5">
          <span class="mt-5 text-2xl font-semibold text-primary">Габарит переходного адаптера</span>
          <div
            v-for="adapter in flangeAdaptersFiltered"
            :key="adapter"
            class="flex items-center gap-2 mt-1"
          >
            <RadioButton
              v-model="flangeAdapter"
              :inputId="adapter.name"
              name="dynamic"
              :value="adapter"
            />
            <label :for="adapter.name">{{ adapter.name }}</label>
          </div>
        </div>
      </div>
      <div class="col-5 flex justify-content-center flex-wrap">
        <div><img :src="`${baseUrl.s3Storage}/${flangeAdapterImage2.image}`" height="200"/></div>

      </div>


      </div>
    </div>


        <!-- <div><img :src="`${baseUrl.s3Storage}/${flangeType.image}`" height="200"/></div> -->
        <!-- <img :src="`${baseUrl.s3Storage}/${flangeTypeSizeImage}`"/>
        <img :src="`${baseUrl.s3Storage}/${flangeTypeSizeImage2}`"/> -->


</template>
