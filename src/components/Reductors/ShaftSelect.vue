<script setup lang="ts">
import type { IDocument } from '@/Interfaces/invertors'
import type {
  IRedShaftTypeView,
  IRedShaftDirectionView,
  IShaft,
  IShaftDimentionData,
  IShaftDimention,
  IFlangeDimentionImage,
} from '@/Interfaces/reductors'
import { ref, onBeforeMount, watch } from 'vue'
import { useFetch } from '@/api/useFetch'
import RadioButton from 'primevue/radiobutton'
import { useBaseUrl } from '@/stores/baseUrl'
import ShaftData from './ShaftData.vue'

const baseUrl = useBaseUrl()
const shaftTypes = ref<IDocument<IRedShaftTypeView>>({ data: [], error: null, loading: true })
const shaftDirections = ref<IDocument<IRedShaftDirectionView>>({
  data: [],
  error: null,
  loading: true,
})
const shaftDimentions = ref<IDocument<IShaftDimention>>({ data: [], error: [], loading: true })
const shaftDimentionData = ref<IDocument<IShaftDimentionData>>({
  data: [],
  error: [],
  loading: true,
})
const shaftDimention = ref<IShaftDimention>()
const shaftType = ref<IRedShaftTypeView>()
const shaftDirection = ref<IRedShaftDirectionView>()
const outputShaftSize = ref<IShaftDimentionData>()
  const flangeDimentionImages2 = ref<IDocument<IFlangeDimentionImage>>({
  data: [],
  error: [],
  loading: true,
})


const loading = ref<boolean>(true)

const model = defineModel<IShaft>()
const props = defineProps(['id_gear', 'gearTypeId', 'gearSizeId', 'mountType', 'red'])

const loadData = async () => {
  shaftTypes.value = await useFetch(`/data/RedShaftTypesView?id_gear=${props.id_gear}`, 'reductors')
  shaftDirections.value = await useFetch(
    `/data/RedShaftDirectionsView?id_gear=${props.id_gear}`,
    'reductors',
  )

  shaftDimentionData.value = await useFetch(`/data/shaftDimentionDatas`, 'reductors')
  shaftDimentions.value = await useFetch(`/data/ShaftDimentions`, 'reductors')

  shaftType.value = shaftTypes.value.data[0]
  shaftDirection.value = shaftDirections.value.data[0]
  loading.value = false
}

watch(shaftType, () => {
  if (shaftType.value) {
    model.value!.type = shaftType.value.id!
    // определение параметров выходного вала {
    shaftDimention.value = shaftDimentions.value.data.find(
      (item: IShaftDimention) =>
        item.gear_type_id == props.gearTypeId &&
        item.gearbox_size_id == props.gearSizeId &&
        item.shaft_type_id == shaftType.value!.id,
    )
    // console.log('shaftDimention', shaftDimention.value)
    // console.log('shaftType', shaftType.value.id)
    if (shaftDimention.value)
      outputShaftSize.value = shaftDimentionData.value.data.find(
        (item: IShaftDimentionData) =>
          item.id == shaftDimention.value!.shaft_id
          // Number(item.dimention_size_output_shaft) == shaftDimention.value!.output_shaft_size &&
          // item.shaft_type_id == shaftType.value!.id,
      )
    // console.log('outputShaftSize', outputShaftSize.value)
    // определение параметров выходного вала }
  }
})

watch(shaftDirection, () => {
  if (shaftDirection.value) {
    model.value!.direction = shaftDirection.value.id!
  }
})

// Изображение Фланца переходного вала
watch(() => [props.red.gear_type_id, props.red.gear_box_list_size_id, props.mountType],  async() => {
  const url = `/data/FlangeDimentionAddons?gear_type_id=${props.red.gear_type_id}&gearbox_size_id=${props.red.gear_box_list_size_id}&mount_type_id=${props.mountType}`;
  const flnageDimentionAddon = ref();
  const flnageDimention = ref();

  flnageDimentionAddon.value = await useFetch(url, 'reductors')

  if (flnageDimentionAddon.value.data.length > 0) {
    flnageDimention.value = await useFetch(
      `/data/FlangeDimentionsExtends?name=${flnageDimentionAddon.value.data[0].flange_name}`,
      'reductors',
    )

    if (props.mountType === 20) {
      flangeDimentionImages2.value = await useFetch(
        `/data/flangeDimentionImages/${flnageDimention.value.data[0].flange_imageB5_id}`,
        'reductors',
      )
    }

    if (props.mountType === 30) {
      flangeDimentionImages2.value = await useFetch(
        `/data/flangeDimentionImages/${flnageDimention.value.data[0].flange_imageB14_id}`,
        'reductors',
      )
    }
  }
})


onBeforeMount(() => {
  loadData()
})
</script>

<template>
  <div class="mt-5" v-if="!loading">
    <span class="text-2xl font-semibold mt-5 text-primary">Вал</span>
    <div class="grid">
      <div class="col-4">
        <p class="font-semibold mb-2">Тип</p>
        <div v-for="shaft in shaftTypes.data" :key="shaft.id" class="flex items-center gap-2 mt-1">
          <RadioButton v-model="shaftType" :inputId="shaft.d" name="dynamic" :value="shaft" />
          <label :for="shaft.d">{{ shaft.d }}</label>
        </div>
      </div>

      <div class="col-5">
        <img v-bind:src="`${baseUrl.s3Storage}/${shaftType!.image}`" height="200" />
        <!-- {{ outputShaftSize }} -->
      </div>

      <div class="col-3 align-items-start">
        <ShaftData
          :outputShaftSize="outputShaftSize"
          :shaft_type_id="shaftType!.id"
          v-if="outputShaftSize"
        />
      </div>

    </div>
    <div class="grid  mt-5">
      <div class="col-4">
        <p class="font-semibold mb-2">Направление</p>

        <div
          v-for="direction in shaftDirections.data"
          :key="direction.id"
          class="flex items-center gap-2 mt-1"
        >
          <RadioButton
            v-model="shaftDirection"
            :inputId="direction.d"
            name="dynamic"
            :value="direction"
          />
          <label :for="direction.d">{{ direction.d }}</label>
        </div>
      </div>
      <div class="col-5">
        <img :src="`${baseUrl.s3Storage}/${shaftDirection!.shaft_direction_image}`" height="200"/>
      </div>
      <div class="col-3"></div>
    </div>

    <div class="grid  mt-5">
      <div class="col-4">
        <p class="font-semibold mb-2">Фланец выходного вала</p>
      </div>
      <div class="col-5">
        <img :src="`${baseUrl.s3Storage}/${flangeDimentionImages2.data[0].image}`" v-if="flangeDimentionImages2?.data?.[0]?.image"/>
        <img :src="`${baseUrl.s3Storage}/${flangeDimentionImages2.data[0].image2}`" v-if="flangeDimentionImages2?.data?.[0]?.image2"/>
      </div>
      <div class="col-3"></div>
    </div>

  </div>
</template>
