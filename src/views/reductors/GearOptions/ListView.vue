<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useFetch } from '@/api/useFetch'
import { RouterLink } from 'vue-router'
import type { IDocument } from '@/Interfaces/invertors.js'
import type { GearOptions } from '@/Interfaces/reductors'
import Tag from 'primevue/tag'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

const data = ref<IDocument<GearOptions>>({ data: [], error: null, loading: true })

onBeforeMount(async () => {
  data.value = await useFetch('/data/GearOptions', 'reductors')
})
</script>

<template>
  <div v-if="data.loading">
    <h2>Загружаю данные...</h2>
  </div>
  <div v-else>
    <div class="grid">
      <div class="col-10">
        <h1 class="pt-5">Опции редуктора</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/reductors/GearOptions/Create/`" rel="noopener">
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
        <Column field="name" header="Наименование" sortable style="width: 15%">
          <template #body="{ data }">
            {{ data.name }}
          </template>
        </Column>
        <Column field="description" header="Описание" sortable style="width: 10%"></Column>
        <Column
          field="add_description"
          header="Дополнительное описание"
          sortable
          style="width: 10%"
        ></Column>
        <Column field="sign" header="sign" sortable style="width: 10%"></Column>
        <Column field="isActive" header="Активная" sortable style="width: 10%">
          <template #body="{ data }">
            <Tag value="Активный" severity="success" v-if="data.isActive"/>
            <Tag value="Деактивирована" severity="danger" v-else/>
          </template>
        </Column>

        <Column header="Действия">
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/reductors/GearOptions/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <RouterLink :to="`/reductors/GearOptions/Delete/${slotProps.data.id}`">
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
