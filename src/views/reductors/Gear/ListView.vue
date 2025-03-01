<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useFetch } from '@/api/useFetch'
import { RouterLink } from 'vue-router'
import type { IDocument } from '@/Interfaces/invertors.js'
import type {
  IRedGearEfficiency,
  IRedGearSize,
  IRedGearView,
  IRedRatioCode,
} from '@/Interfaces/reductors'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import { getValueFromDictionary } from '@/api/getValueFromDictionary'

const data = ref<IDocument<IRedGearView>>({ data: [], error: null, loading: true })
const efficiencies = ref<IDocument<IRedGearEfficiency>>({ data: [], error: null, loading: true })
const sizes = ref<IDocument<IRedGearSize>>({ data: [], error: null, loading: true })
const ratio = ref<IDocument<IRedRatioCode>>({ data: [], error: null, loading: true })
const loading = ref<boolean>(true)

onBeforeMount(async () => {
  data.value = await useFetch('/data/RedGears', 'reductors')
  efficiencies.value = await useFetch('/data/RedGearEfficiencies', 'reductors')
  sizes.value = await useFetch('/data/RedGearSizes', 'reductors')
  ratio.value = await useFetch('/data/RedRatioCodes', 'reductors')
  loading.value = false
})
</script>

<template>
  <div v-if="loading">
    <h2>Загружаю данные...</h2>
  </div>
  <div v-else>
    <div class="grid">
      <div class="col-10">
        <h1 class="pt-5">Gear</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/reductors/RedGear/Create/`" rel="noopener">
          <Button label="Создать" severity="info"></Button>
        </RouterLink>
      </div>
    </div>
    <div v-if="data.data">
      <DataTable
        :value="data.data"
        stripedRows
        tableStyle="min-width: 50rem"
        :loading="data.loading"
        paginator
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
      >
        <Column field="item_name" header="item" sortable style="width: 10%"></Column>
        <Column header="code_size_manuf" sortable style="width: 10%">
          <template #body="{ data }">
            {{ getValueFromDictionary(sizes.data, data.gear_size_id, 'code_size_manuf') }}
          </template>
        </Column>
        <Column header="ratio_code" sortable style="width: 10%">
          <template #body="{ data }">
            {{ getValueFromDictionary(ratio.data, data.ratio_code_id, 'code_name') }}
          </template>
        </Column>
        <Column header="ex_ratio" sortable style="width: 10%">
          <template #body="{ data }">
            {{ data.ex_ratio }}
          </template>
        </Column>
        <Column header="t2n" sortable style="width: 10%">
          <template #body="{ data }">
            {{ data.t2n }}
          </template>
        </Column>
        <Column header="p1n" sortable style="width: 10%">
          <template #body="{ data }">
            {{ data.p1n }}
          </template>
        </Column>
        <Column header="gear_efficiency" sortable style="width: 10%">
          <template #body="{ data }">
            {{ getValueFromDictionary(efficiencies.data, data.gear_efficiency_id, 'description') }}
          </template>
        </Column>

        <Column header="Действия">
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/reductors/RedGear/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <RouterLink :to="`/reductors/RedGear/Delete/${slotProps.data.id}`">
                <Button icon="pi pi-trash" severity="danger" />
              </RouterLink>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
}
</style>
