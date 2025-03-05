<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type { RedDiscount, IRedGearView } from '@/Interfaces/reductors'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
const props = defineProps(['gearType', 'typeConfig', 'commonData'])
const discount = defineModel('discount')
const emit = defineEmits(['redSelected'])

const selectRed = (red: IRedGearView) => {
  emit('redSelected', red)
}

const gears = ref<IDocument<IRedGearView>>({ data: [], error: null, loading: true })
const discountGroups = ref<IDocument<RedDiscount>>({ data: [], error: null, loading: true })
const discontGroupSelected = ref<RedDiscount>()
const gaersDisplay = ref<IRedGearView[]>([])
const loading = ref<boolean>(true)

const loadData = async () => {
  gears.value = await useFetch('/data/RedGearsView', 'reductors')
  discountGroups.value = await useFetch('/data/RedDiscounts', 'reductors')
  loading.value = false
}

watch(discontGroupSelected, () => {
  if (discontGroupSelected.value) discount.value = discontGroupSelected.value.discount
})

const filter = () => {
  gaersDisplay.value = gears.value.data.filter(
    (item: IRedGearView) =>
      item.gear_type_id === props.gearType &&
      ((props.typeConfig.type === 1 &&
        (Number(item.t2n) * props.commonData.inputSpeed) /
          (9550 * Number(item.ex_ratio)) /
          props.typeConfig.value >
          props.commonData.serviceFactor * (1 - props.commonData.outputSpeedError / 100) &&
        (Number(item.t2n) * props.commonData.inputSpeed) /
          (9550 * Number(item.ex_ratio)) /
          props.typeConfig.value <
          props.commonData.serviceFactor * (1 + props.commonData.outputSpeedError / 100) &&
        Number(item.ex_ratio) >
          (props.commonData.inputSpeed / props.commonData.outputSpeed) *
            (1 - props.commonData.serviceFactorError / 100) &&
        Number(item.ex_ratio) <
          (props.commonData.inputSpeed / props.commonData.outputSpeed) *
            (1 + props.commonData.serviceFactorError / 100)) ||
        (props.typeConfig.type === 2 &&
          Number(item.t2n) > props.typeConfig.value * props.commonData.serviceFactor &&
          Number(item.ex_ratio) >
            (props.commonData.inputSpeed / props.commonData.outputSpeed) * 0.7 &&
          Number(item.ex_ratio) <
            (props.commonData.inputSpeed / props.commonData.outputSpeed) * 1.5)),
  )
}

watch(
  () => [
    props.gearType.type,
    props.typeConfig.value,
    props.typeConfig.type,
    props.commonData.inputSpeed,
    props.commonData.outputSpeed,
    props.commonData.serviceFactor,
    props.commonData.outputSpeedError,
    props.commonData.serviceFactorError,
  ],
  () => {
    filter()
  },
)

onBeforeMount(async () => {
  await loadData()
  filter()
})
</script>

<template>
  <template v-if="loading">
    <ProgressSpinner
      style="width: 200px; height: 200px"
      strokeWidth="8"
      fill="transparent"
      animationDuration="2s"
      aria-label="Custom ProgressSpinner"
    />
  </template>
  <template v-else>

    <h1 class="mt-5">
      Редукторы с переходным фланцем ({{ gaersDisplay.length }}/{{ gears.data.length }})
    </h1>
    <DataTable
      :value="gaersDisplay"
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      tableStyle="min-width: 50rem"
    >
      <!-- <Column field="gear_type_id" header="gear_type_id" style="width: 10%"></Column> -->
      <Column field="code_aspect" header="Код редуктора" style="width: 10%" sortable></Column>

      <Column field="t2n" header="Номинальный момент T2N, Hм" style="width: 10%" sortable></Column>

      <Column field="ex_ratio" header="i" style="width: 10%" sortable></Column>

      <Column header="об/мин" style="width: 10%">
        <template #body="{ data }">
          {{ (props.commonData.inputSpeed / data.ex_ratio).toFixed(2) }} об/мин
        </template>
      </Column>

      <Column header="Сервис фактор, Sf" style="width: 10%">
        <template #body="{ data }">
          {{
            (
              (data.t2n * props.commonData.inputSpeed) /
              (9550 * data.ex_ratio) /
              props.typeConfig.value
            ).toFixed(2)
          }}
        </template>
      </Column>

      <Column header="Номинальная входная мощность редуктора, кВт" style="width: 10%">
        <template #body="{ data }">
          {{ data.p1n }}
          <!-- <p>1:   {{ Number(data.t2n) * props.commonData.inputSpeed/(9550*Number(data.ex_ratio))/props.typeConfig.value }} > {{ props.commonData.serviceFactor }}</p>
          <p>2:   {{ Number(data.ex_ratio)  }} > {{ props.commonData.inputSpeed / props.commonData.outputSpeed * 0.7 }}</p>
          <p>3:   {{ Number(data.ex_ratio) }} < {{ props.commonData.inputSpeed/props.commonData.outputSpeed*1.5 }}</p> -->
        </template>
      </Column>

      <!-- <Column field="price" header="Цена" style="width: 10%" sortable>
        <template #body="{ data }">
          <div
                    class="font-bold text-xl border-round m-2 flex align-items-center justify-content-center"
                    style="min-width: 80px; min-height: 40px"
                  >
                    {{ priceFormat(Number(data.price) * 14.19 ) }} &#8381;
                  </div>
        </template>
      </Column> -->

      <Column header="" headerStyle="width: 5em">
        <template #body="{ data }">
          <Button label="Выбрать" severity="help" rounded class="mr-2" @click="selectRed(data)" />
        </template>
      </Column>
    </DataTable>
  </template>
</template>
