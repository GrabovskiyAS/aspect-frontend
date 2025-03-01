<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useFetch } from '@/api/useFetch'
import { RouterLink } from 'vue-router'
import type { IDocument } from '@/Interfaces/invertors.js'
import type { IRedMountType } from '@/Interfaces/reductors'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import { useBaseUrl } from '@/stores/baseUrl'
import RadioButton from 'primevue/radiobutton';

const data = ref<IDocument<IRedMountType>>({ data: [], error: null, loading: true })
const baseUrl = useBaseUrl()
const mode = ref('Картинки');
const categories = ref([
  { name: 'Картинки', key: 'A' },
  { name: 'Схемы', key: 'M' },
]);

onBeforeMount(async () => {
  data.value = await useFetch('/data/RedMountTypes', 'reductors')
})
</script>

<template>
  <div v-if="data.loading">
    <h2>Загружаю данные...</h2>
  </div>
  <div v-else>
    <div class="grid">
      <div class="col-10">
        <h1 class="pt-5">RedMountTypes</h1>
        <div v-for="category in categories" :key="category.key" class="flex items-center gap-2">
            <RadioButton v-model="mode" :inputId="category.key" name="dynamic" :value="category.name" />
            <label :for="category.key">{{ category.name }}</label>
        </div>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/reductors/RedMountType/Create/`" rel="noopener">
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
        <Column field="description" header="Описание" sortable style="width: 10%"></Column>
        <Column header="Данные" sortable style="width: 10%">
          <template #body="{ data }">
            <p>K: {{ data.K_data}}</p>
            <p>C: {{ data.C_data}}</p>
            <p>F: {{ data.F_data}}</p>
            <p>S: {{ data.S_data}}</p>
          </template>
        </Column>
        <!-- <Column header="Изображение" sortable style="width: 10%">
          <template #body="{ data }">
            <img :src="`${baseUrl.s3Storage}/${data.image}`"/>
          </template>
        </Column> -->
        <Column header="Изображение K" sortable style="width: 10%">
          <template #body="{ data }">
            <img :src="`${baseUrl.s3Storage}/${data.K}`" v-if="mode == 'Картинки'"/>
            <img :src="`${baseUrl.s3Storage}/${data.K_figure}`" v-if="mode == 'Схемы'" width="300"/>
          </template>
        </Column>
        <Column header="Изображение C" sortable style="width: 10%">
          <template #body="{ data }">
            <img :src="`${baseUrl.s3Storage}/${data.C}`" v-if="mode == 'Картинки'"/>
            <img :src="`${baseUrl.s3Storage}/${data.C_figure}`" v-if="mode == 'Схемы'" width="300"/>
          </template>
        </Column>
        <Column header="Изображение F" sortable style="width: 10%">
          <template #body="{ data }">
            <img :src="`${baseUrl.s3Storage}/${data.F}`" v-if="mode == 'Картинки'"/>
            <img :src="`${baseUrl.s3Storage}/${data.F_figure}`" v-if="mode == 'Схемы'" width="300"/>
          </template>
        </Column>
        <Column header="Изображение S" sortable style="width: 10%">
          <template #body="{ data }">
            <img :src="`${baseUrl.s3Storage}/${data.S}`" v-if="mode == 'Картинки'"/>
            <img :src="`${baseUrl.s3Storage}/${data.S_figure}`" v-if="mode == 'Схемы'" width="300"/>
          </template>
        </Column>

        <Column header="Действия">
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/reductors/RedMountType/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <RouterLink :to="`/reductors/RedMountType/Delete/${slotProps.data.id}`">
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
