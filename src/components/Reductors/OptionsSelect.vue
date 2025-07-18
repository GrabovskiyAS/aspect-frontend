<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type {
  ColorOptionsView,
  GearOptionsView,
  IRedGearType,
  IRedOilI,
  OilOptionsView,
} from '@/Interfaces/reductors'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import DisplayPrice from '../Common/DisplayPrice.vue'
import { getPriceY } from '@/api/getPriceY'

const props = defineProps(['id_size_gear', 'gear_box_list_size_id', 'gearTypeId', 'mountingPositionId', 'discount', 'shaft'])

const gearTypes = ref<IDocument<IRedGearType>>({ data: [], error: [], loading: true })
const colorOptions = ref<IDocument<ColorOptionsView>>({ data: [], error: [], loading: true })
const gearOptions = ref<IDocument<GearOptionsView>>({ data: [], error: [], loading: true })
const gearOptionsDisplay = ref<GearOptionsView[]>([])
const oilOptions = ref<IDocument<OilOptionsView>>({ data: [], error: [], loading: true })
const oilL = ref<IDocument<IRedOilI>>({ data: [], error: [], loading: true })
const gearTypeLetter = ref<string>('')
const rate = ref<IDocument<any>>({data: [], error: [], loading: true});

const gearOptionsSelected = defineModel('gearOptionsSelected', { required: true, type: Array<GearOptionsView> })
const colorOptionsSelected = defineModel('colorOptionsSelected')
const oilOptionsSelected = defineModel('oilOptionsSelected')

const loading = ref<boolean>(true)
const L = ref<number>(0)

const rate_rub_cny = computed(() => {
  return rate.value?.data?.[0] || 0
})

const loadOilL = async () => {
  oilL.value = await useFetch(
    `data/RedOilIs?mounting_position_id=${props.mountingPositionId}&size_id=${props.id_size_gear}`,
    'reductors',
  )

  if (oilL.value.data.length > 0) L.value = Number(oilL.value.data[0].description.replace(',', '.'))
  else L.value = 0

  if (!oilOptionsSelected.value)
    oilOptionsSelected.value = oilOptions.value.data[0]
}

const loadData = async () => {
  gearTypes.value = await useFetch('/data/RedGearTypes', 'reductors')
  rate.value = await useFetch('/data/getRate/1/2', 'reductors');
  gearTypeLetter.value = gearTypes.value.data.find(
    (item: IRedGearType) => item.id == props.gearTypeId,
  )!.name
  gearOptions.value = await useFetch(
    `/data/GearOptionsView?gear_type_id=${gearTypeLetter.value}&size_id=${props.gear_box_list_size_id}`,
    'reductors',
  )
  colorOptions.value = await useFetch(
    `/data/ColorOptionsView?size_id=${props.gear_box_list_size_id}`,
    'reductors',
  )
  oilOptions.value = await useFetch(
    `/data/OilOptionsView?gear_type_id=${gearTypeLetter.value}`,
    'reductors',
  )
  colorOptionsSelected.value = colorOptionsSelected?.value ? colorOptionsSelected?.value : colorOptions.value.data[0]

  colorOptions.value.data = colorOptions.value.data.map((item) => item = {...item, price: getPriceY(item.price, item.currency_id, rate_rub_cny.value)})
  oilOptions.value.data = oilOptions.value.data.map((item) => item = {...item, price: getPriceY(item.price, item.currency_id, rate_rub_cny.value)})

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
  <div v-if="!loading">
    <!-- <span class="text-2xl font-semibold mt-5 text-primary">Опции</span> -->
    <div v-if="L" class="card w-full">

      <!-- <div class="grid"> -->
        <!-- <div class="col-4"> -->
          <p class="text-2xl font-semibold mt-5 text-primary">Опции редуктора</p>
            <DataTable
              :value="gearOptionsDisplay"
              selectionMode="multiple"

              v-model:selection="gearOptionsSelected"
              stripedRows
              tableStyle="min-width: 100%"
            >
              <Column selectionMode="multiple" headerStyle="width: 5%"></Column>
              <Column field="sign" header="Префикс"></Column>
              <Column field="description" header="Наменование" headerStyle="width: 90%"></Column>
              <Column header="Цена" headerStyle="width: 10%">
                <template #body="{ data }">
                  <DisplayPrice
                    :price="data.price * props.discount"
                    :discount="0"
                    currency-symbol="&#165;"
                    size="S"
                  />
                </template>
              </Column>
            </DataTable>
          <!-- </div> -->

          <!-- <div class="col-4"> -->
            <p class="text-2xl font-semibold mt-5 text-primary">Опции покраски</p>
              <DataTable
                :value="colorOptions.data"
                v-model:selection="colorOptionsSelected"
                stripedRows
                tableStyle="min-width: 100%"
              >
                <Column selectionMode="single" headerStyle="width: 5%"></Column>
                <Column field="sign" header="Префикс"></Column>
                <Column field="description" header="Наменование" headerStyle="width: 85%"></Column>
                <Column header="Цена" headerStyle="width: 10%">
                  <template #body="{ data }">
                    <DisplayPrice
                      :price="data.price * props.discount"
                      :discount="0"
                      currency-symbol="&#165;"
                      size="S"
                    />
                  </template>
                </Column>
              </DataTable>
          <!-- </div> -->

          <!-- <div class="col-4"> -->
            <p class="text-2xl font-semibold mt-5 text-primary">Опции масла</p>
            <DataTable
              :value="oilOptions.data"
              v-model:selection="oilOptionsSelected"
              stripedRows
              tableStyle="min-width: 100%"
            >
              <Column selectionMode="single" headerStyle="width: 5%"></Column>
              <Column field="sign" header="Префикс"></Column>
              <Column field="description" header="Наменование" headerStyle="width: 75%"></Column>
              <Column header="Цена за 1 л" headerStyle="width: 10%">
                <template #body="{ data }">
                  <DisplayPrice
                    :price="data.price * props.discount"
                    :discount="0"
                    currency-symbol="&#165;"
                    size="S"
                  />
                </template>
              </Column>
              <Column header="Объём" headerStyle="width: 10%">
                <template #body> {{ L }} л </template>
              </Column>
              <Column header="Сумма" headerStyle="width: 10%">
                <template #body="{ data }">
                  <DisplayPrice
                    :price="data.price * L * props.discount"
                    :discount="0"
                    currency-symbol="&#165;"
                    size="S"
                  />
                </template>
              </Column>
            </DataTable>
          <!-- </div> -->
        <!-- </div> -->
      </div>


  </div>
</template>
