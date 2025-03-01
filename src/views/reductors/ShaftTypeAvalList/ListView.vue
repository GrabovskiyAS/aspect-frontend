<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useFetch } from '@/api/useFetch'
import { RouterLink } from 'vue-router'
import type { IDocument } from '@/Interfaces/invertors.js'
import type { IRedShaftType, IRedShaftTypeAvalList } from '@/Interfaces/reductors'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import { getShaftNames } from '@/api/utils'

const data = ref<IDocument<IRedShaftTypeAvalList>>({ data: [], error: null, loading: true })
const shaftTypes = ref<IDocument<IRedShaftType>>({ data: [], error: null, loading: true })
const loading = ref<boolean>(true)

onBeforeMount(async () => {
  data.value = await useFetch('/data/RedShaftTypeAvalLists', 'reductors')
  shaftTypes.value = await useFetch('/data/RedShaftTypes', 'reductors')
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
        <h1 class="pt-5">RedShaftTypeAvalLists</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/reductors/RedShaftTypeAvalList/Create/`" rel="noopener">
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
        <Column header="Тип" sortable style="width: 20%">
          <template #body="{ data }">
            {{ getShaftNames(shaftTypes.data, data.shaft_output_types) }}
          </template>
        </Column>
        <Column field="description" header="Описание" sortable style="width: 20%"></Column>

        <Column header="Действия">
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/reductors/RedShaftTypeAvalList/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <RouterLink :to="`/reductors/RedShaftTypeAvalList/Delete/${slotProps.data.id}`">
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
