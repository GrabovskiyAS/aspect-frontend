<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type {
  OilOptions,
  ColorOptionsView,
  GearOptionsView,
  IRedGearType,
  IRedOilI,
} from '@/Interfaces/reductors'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import DisplayPrice from '../Common/DisplayPrice.vue'
import { getPriceY } from '@/api/getPriceY'

const props = defineProps(['red', 'gearTypeId', 'mountingPositionId', 'discount', 'shaft'])

const gearTypes = ref<IDocument<IRedGearType>>({ data: [], error: [], loading: true })
const colorOptions = ref<IDocument<ColorOptionsView>>({ data: [], error: [], loading: true })
const gearOptions = ref<IDocument<GearOptionsView>>({ data: [], error: [], loading: true })
const gearOptionsDisplay = ref<GearOptionsView[]>([])
const oilOptions = ref<IDocument<OilOptions>>({ data: [], error: [], loading: true })
const oilL = ref<IDocument<IRedOilI>>({ data: [], error: [], loading: true })
const gearTypeLetter = ref<string>('')

const gearOptionsSelected = defineModel('gearOptionsSelected', { required: true, type: Array<GearOptionsView> })
const colorOptionsSelected = defineModel('colorOptionsSelected')
const oilOptionsSelected = defineModel('oilOptionsSelected')

const loading = ref<boolean>(true)
const L = ref<number>(0)

const loadOilL = async () => {
  oilL.value = await useFetch(
    `data/RedOilIs?mounting_position_id=${props.mountingPositionId}&size_id=${props.red.id_size_gear}`,
    'reductors',
  )
  if (oilL.value.data.length > 0) L.value = Number(oilL.value.data[0].description.replace(',', '.'))
  else L.value = 0

  oilOptionsSelected.value = oilOptions.value.data[0]
}

const loadData = async () => {
  gearTypes.value = await useFetch('/data/RedGearTypes', 'reductors')
  gearTypeLetter.value = gearTypes.value.data.find(
    (item: IRedGearType) => item.id == props.gearTypeId,
  )!.name
  gearOptions.value = await useFetch(
    `/data/GearOptionsView?gear_type_id=${gearTypeLetter.value}&size_id=${props.red.gear_box_list_size_id}`,
    'reductors',
  )
  colorOptions.value = await useFetch(
    `/data/ColorOptionsView?size_id=${props.red.gear_box_list_size_id}`,
    'reductors',
  )
  oilOptions.value = await useFetch(
    `/data/OilOptionsView?gear_type_id=${gearTypeLetter.value}`,
    'reductors',
  )
  colorOptionsSelected.value = colorOptions.value.data[0]

  gearOptionsDisplay.value = gearOptions.value.data //  Устанавливаем начальное значение опций редуктора для отображения равным всем загруженным опциям

  loadOilL()

  loading.value = false
}

watch(
  () => [props.mountingPositionId],
  async () => {
    loadOilL()
  },
)

const filterGearOptions = () => {
  if (gearOptions.value.data.length > 0) {  //Если опции уже загрузились
      gearOptionsDisplay.value = gearOptions.value.data

      if (props.shaft.type == 30) {
        // Ищем опцию FR10
        const FR10 = gearOptions.value.data.find((option:GearOptionsView ) => option.sign == 'SD');

        // Ищем опцию FR10 в уже выбранных опциях
        const exist = gearOptionsSelected.value.find((option:GearOptionsView ) => option.sign == 'SD')

        // Если FR10 найден а опция не выбрана нет, то добавляем
        if (!exist && FR10 )
          gearOptionsSelected.value.push(FR10);
      } else {

        // Удяляем всё, кроме стяжной муфты
        gearOptionsDisplay.value = gearOptions.value.data.filter((option:GearOptionsView ) => option.sign != 'SD');
      }
    }
}

// Если изменился тип вала
watch(
  () => [props.shaft.type, gearOptionsSelected.value],
  () => { filterGearOptions() }
)



onBeforeMount(async () => {
  await loadData()
  filterGearOptions()
})
</script>

<template>
  <div class="mt-5" v-if="!loading">
    <span class="text-2xl font-semibold mt-5 text-primary">Опции</span>

    <div v-if="L">
      <p class="font-semibold">Масло</p>
      <DataTable
        :value="oilOptions.data"
        v-model:selection="oilOptionsSelected"
        stripedRows
        tableStyle="min-width: 50rem"
      >
        <Column selectionMode="single" headerStyle="width: 5%"></Column>
        <Column field="description" header="Наменование" headerStyle="width: 10%"></Column>
        <Column header="Цена за 1 л" headerStyle="width: 3%">
          <template #body="{ data }">
            <DisplayPrice
              :price="getPriceY(data.price, data.currency_id)"
              :discount="0"
              currency-symbol="&#165;"
              size="S"
            />
          </template>
        </Column>
        <Column header="Объём" headerStyle="width: 3%">
          <template #body> {{ L }} л </template>
        </Column>
        <Column header="Итого" headerStyle="width: 3%">
          <template #body="{ data }">
            <DisplayPrice
              :price="getPriceY(data.price * L, data.currency_id)"
              :discount="0"
              currency-symbol="&#165;"
              size="S"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <p class="font-semibold mt-5">Редуктор</p>
    <DataTable
      :value="gearOptionsDisplay"
      selectionMode="multiple"

      v-model:selection="gearOptionsSelected"
      stripedRows
      tableStyle="min-width: 50rem"
    >
      <!-- <Column selectionMode="multiple" headerStyle="width: 5%"></Column> -->
      <Column field="description" header="Наменование" headerStyle="width: 10%"></Column>
      <Column header="Цена" headerStyle="width: 3%">
        <template #body="{ data }">
          <DisplayPrice
            :price="data.price"
            :discount="0"
            currency-symbol="&#165;"
            size="S"
          />
        </template>
      </Column>
    </DataTable>

    <p class="font-semibold mt-5">Покраска</p>
    <DataTable
      :value="colorOptions.data"
      v-model:selection="colorOptionsSelected"
      stripedRows
      tableStyle="min-width: 50rem"
    >
      <Column selectionMode="single" headerStyle="width: 5%"></Column>
      <Column field="description" header="Наменование" headerStyle="width: 10%"></Column>
      <Column header="Цена" headerStyle="width: 3%">
        <template #body="{ data }">
          <DisplayPrice
            :price="getPriceY(data.price, data.currency_id)"
            :discount="0"
            currency-symbol="&#165;"
            size="S"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
