<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useFetch } from '@/api/useFetch'
import { RouterLink } from 'vue-router'
import type { IDocument, ISimpleDictionary } from '@/Interfaces/invertors'
import type { ICurrencyRate } from '@/Interfaces/reductors'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import moment from 'moment'
import { getValueFromDictionary} from '@/api/getValueFromDictionary'

const data = ref<IDocument<ICurrencyRate>>({ data: [], error: null, loading: true })
const currencies = ref<IDocument<ISimpleDictionary>>({data: [], error: [], loading: true})

onBeforeMount(async () => {
  data.value = await useFetch('/data/CurrencyRates', 'reductors')
  currencies.value = await useFetch('/data/currencies', 'reductors')
})
</script>

<template>
  <div v-if="data.loading">
    <h2>Загружаю данные...</h2>
  </div>
  <div v-else>
    <div class="grid">
      <div class="col-10">
        <h1 class="pt-5">Оменные курсы валют</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/common/CurrencyRate/Create/`" rel="noopener">
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
        <Column field="date" header="Дата" sortable style="width: 15%">
          <template #body="{ data }">
            {{ moment(data.date).format('DD.MM.YYYY') }}
          </template>
        </Column>
        <Column field="currency1_id" header="Валюта 1" sortable style="width: 10%" >
          <template #body="{ data }">
            {{ getValueFromDictionary(currencies.data, data.currency1_id) }}
          </template>
        </Column>
        <Column field="currency1_id" header="Валюта 2" sortable style="width: 10%" >
          <template #body="{ data }">
            {{ getValueFromDictionary(currencies.data, data.currency2_id) }}
          </template>
        </Column>
        <Column
          field="rate"
          header="Курс обемна"
          sortable
          style="width: 10%"
        ></Column>

        <Column header="Действия">
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/common/CurrencyRate/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <!-- <RouterLink :to="`/common/CurrencyRate/Delete/${slotProps.data.id}`">
                <Button icon="pi pi-trash" severity="danger" />
              </RouterLink> -->
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
