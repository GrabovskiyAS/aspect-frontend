<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useFetch } from '@/api/useFetch'
import { RouterLink } from 'vue-router'
import type { IDocument } from '@/Interfaces/invertors'
import type { IRedShaftAvalDirection, IRedShaftDirection } from '@/Interfaces/reductors'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import { getShaftDirectionNames } from '@/api/utils'

const data = ref<IDocument<IRedShaftAvalDirection>>({ data: [], error: null, loading: true })
const directions = ref<IDocument<IRedShaftDirection>>({ data: [], error: null, loading: true })
const loading = ref<boolean>(true)

onBeforeMount(async () => {
  data.value = await useFetch('/data/RedShaftAvalDirections', 'reductors')
  directions.value = await useFetch('/data/RedShaftDirections', 'reductors')
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
        <h1 class="pt-5">RedShaftAvalDirections</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/reductors/RedShaftAvalDirection/Create/`" rel="noopener">
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
        <Column field="name" header="Направление" sortable style="width: 35%">
          <template #body="{ data }">
            {{ getShaftDirectionNames(directions.data, data.avalible_direction_shaft) }}
          </template>
        </Column>
        <Column field="description" header="Описание" sortable style="width: 10%"></Column>

        <Column header="Действия">
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/reductors/RedShaftAvalDirection/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <RouterLink :to="`/reductors/RedShaftAvalDirection/Delete/${slotProps.data.id}`">
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
