<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useFetch } from '@/api/useFetch'
import { RouterLink } from 'vue-router'
import type { IDocument } from '@/Interfaces/invertors.js'
import type { IRedShaftType } from '@/Interfaces/reductors'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import { useBaseUrl } from '@/stores/baseUrl'

const data = ref<IDocument<IRedShaftType>>({ data: [], error: null, loading: true })
const baseUrl = useBaseUrl()

onBeforeMount(async () => {
  data.value = await useFetch('/data/RedShaftTypes', 'reductors')
})
</script>

<template>
  <div v-if="data.loading">
    <h2>Загружаю данные...</h2>
  </div>
  <div v-else>
    <div class="grid">
      <div class="col-10">
        <h1 class="pt-5">RedShaftTypes</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/reductors/RedShaftType/Create/`" rel="noopener">
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
        <Column field="sign" header="sign" sortable style="width: 15%">
          <template #body="{ data }">
            {{ data.sign }}
          </template>
        </Column>
        <Column field="description" header="Описание" sortable style="width: 10%"></Column>
        <Column field="image" header="Изображение" sortable style="width: 10%">
          <template #body="{ data }">
            <img :src="`${baseUrl.s3Storage}/${data.image}`" />
          </template>
        </Column>

        <Column header="Действия">
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/reductors/RedShaftType/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <RouterLink :to="`/reductors/RedShaftType/Delete/${slotProps.data.id}`">
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
