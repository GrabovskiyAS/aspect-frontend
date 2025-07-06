<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type { WarrantyOptions } from '@/Interfaces/reductors'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const warrantyOptions = ref<IDocument<WarrantyOptions>>({ data: [], error: [], loading: true })
const warrantyOptionSelected = defineModel<WarrantyOptions>('warrantyOptionSelected')
const warrantyPrice = defineModel<number>('warrantyPrice')
const loading = ref<boolean>(true)

const getWarrantyPrice = (name: string): number => {
  switch (name) {
    case 'WR24':
      return 5;
    case 'WR36':
      return 7;
    default:
      return 0
  }
}

watch(warrantyOptionSelected, () => {
  warrantyPrice.value = getWarrantyPrice(warrantyOptionSelected.value!.name)
})

const loadData = async () => {
  warrantyOptions.value = await useFetch('/data/WarrantyOptions', 'reductors')
  // оставляем только актвные опции гарантии
  warrantyOptions.value.data = warrantyOptions.value.data.filter((item) => item.isActive == true)
  warrantyOptionSelected.value = warrantyOptionSelected?.value ? warrantyOptionSelected.value : warrantyOptions.value.data[0]
  loading.value = false
}

onBeforeMount(async () => {
  await loadData()
})
</script>

<template>
  <div class="mt-5" v-if="!loading">
    <span class="text-2xl font-semibold mt-5 text-primary">Опции гарантии</span>
    <DataTable
      :value="warrantyOptions.data"
      v-model:selection="warrantyOptionSelected"
      stripedRows
      tableStyle="min-width: 50rem"
    >
      <Column selectionMode="single" headerStyle="width: 5%"></Column>
      <Column field="sign" header="Префикс"></Column>
      <Column field="description" header="Наменование" headerStyle="width: 85%"></Column>
      <Column header="Цена" headerStyle="width: 10%">
        <template #body="{ data }">
          <span
            class="font-bold text-xl border-round m-2 flex align-items-center justify-content-center"
          >
            {{ getWarrantyPrice(data.name) }} %</span
          >
        </template>
      </Column>
    </DataTable>
  </div>
</template>
