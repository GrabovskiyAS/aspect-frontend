<script setup lang="ts">
import { ref, watch } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import type { IDocument, IItem } from '@/Interfaces/invertors'
import type { ICSVRow, IParseResult } from '@/api/Parsing/interfaces'

import Papa from 'papaparse'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import ColumnGroup from 'primevue/columngroup'
import Column from 'primevue/column'
import Row from 'primevue/row'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'

import { useFetch } from '@/api/useFetch'
import { upload } from '@/api/Parsing/upload'
import { getSeverity, setID } from '@/api/Parsing/utils'

const text = ref<string>('')
const data = ref<IParseResult>({ data: null, errors: null, meta: null })
const items = ref<IDocument<IItem>>({ data: [], loading: true, error: null })
const column_id = ref<string>('')
const column_price = ref<string>('')
const column_quantity = ref<string>('')
const csv_columns = ref<string[]>([])
const columnIdIndex = ref<number>(0)
const columnPriceIndex = ref<number>(0)
const columnQuantityIndex = ref<number>(0)
const CSVData = ref<ICSVRow[]>([
  {
    data: [],
    item_name: '',
    item_id: 0,
    waiting_period_id: 0,
    type_id: 0,
    action: '',
    uploaded: false,
    price_uploaded: 0,
  },
])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  id: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

async function loadData() {
  items.value = await useFetch('/data/Items')
}

function reset() {
  text.value = ''
  columnIdIndex.value = 0
  columnPriceIndex.value = 0
  columnQuantityIndex.value = 0
  data.value = { data: null, errors: null, meta: null }
  CSVData.value = []
}

function parse() {
  data.value = Papa.parse(text.value)
  csv_columns.value = data.value.data[0]
  data.value.data.map((item: any) =>
    CSVData.value.push({
      data: item,
      item_name: '',
      item_id: 0,
      type_id: 0,
      waiting_period_id: 0,
      action: 'IGNORE',
      uploaded: false,
      price_uploaded: 0,
    }),
  )
}

watch(column_id, () => {
  for (let i = 0; i < data.value.data[0].length; i++) {
    if (data.value.data[0][i] == column_id.value) {
      columnIdIndex.value = i
      break
    }
  }
})

watch(column_price, () => {
  for (let i = 0; i < data.value.data[0].length; i++) {
    if (data.value.data[0][i] == column_price.value) {
      columnPriceIndex.value = i
      break
    }
  }
})

watch(column_quantity, () => {
  for (let i = 0; i < data.value.data[0].length; i++) {
    if (data.value.data[0][i] == column_quantity.value) {
      columnQuantityIndex.value = i
      break
    }
  }
})

loadData()
</script>

<template>
  <h1 class="mt-5">Загрузка справочника Items для преобразователей частоты Инстарт</h1>
  <div v-if="items.loading">Загружаю...</div>
  <div v-else>
    <Stepper value="1" linear>
      <StepList>
        <Step value="1">Ctrl+v</Step>
        <Step value="2">Колонки</Step>
        <Step value="3">Загрузка</Step>
        <Step value="4">Финал</Step>
      </StepList>
      <StepPanels>
        <!------------------------------------------------------ ctrl+v --------------------------------------------------------->
        <StepPanel v-slot="{ activateCallback }" value="1">
          <div class="flex flex-col h-48">
            <div class="mt-5 font-semibold text-xl">Исходные данные (Ctrl+V)</div>
          </div>
          <div class="flex flex-col h-48">
            <Textarea v-model="text" rows="5" cols="80" class="w-full md:w-56" />
          </div>
          <div class="flex pt-6 justify-end">
            <Button
              label="Разобрать"
              icon="pi pi-arrow-right"
              @click="
                () => {
                  parse()
                  activateCallback('2')
                }
              "
            />
          </div>
        </StepPanel>

        <!------------------------------------------------------ сопоставление колонок --------------------------------------------------------->
        <StepPanel v-slot="{ activateCallback }" value="2">
          <div class="mt-5 font-semibold text-xl">Сопоставление колонок</div>
          <div class="grid">
            <div class="col">
              <label for="column_id">id</label>
              <Select
                v-model="column_id"
                :options="csv_columns"
                placeholder="Выбрать..."
                class="w-full md:w-56"
              />
            </div>
            <div class="col">
              <label for="username">Цена</label>
              <Select
                v-model="column_price"
                :options="csv_columns"
                placeholder="Выбрать..."
                class="w-full md:w-56"
              />
            </div>
            <div class="col">
              <label for="username">Количество</label>
              <Select
                v-model="column_quantity"
                :options="csv_columns"
                placeholder="Выбрать..."
                class="w-full md:w-56"
              />
            </div>
          </div>

          <div class="mt-5 font-semibold text-xl">Данные</div>
          <DataTable
            :value="data.data"
            tableStyle="min-width: 50rem"
            stripedRows
            paginator
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20, 50]"
          >
            <template v-for="(column, index, key) in data.data" :key="key">
              <Column :header="data.data[0][index]">
                <template #body="{ data }">
                  {{ data[index] }}
                </template>
              </Column>
            </template>
          </DataTable>

          <div class="flex pt-6 justify-between">
            <Button
              label="Назад"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback('1')"
            />
            <Button
              label="Вперёд"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="
                () => {
                  CSVData = setID(items.data, CSVData, columnIdIndex)
                  activateCallback('3')
                }
              "
              v-if="column_id && column_price && column_quantity"
            />
          </div>
        </StepPanel>

        <!------------------------------------------------------ загрузка --------------------------------------------------------->
        <StepPanel v-slot="{ activateCallback }" value="3">
          <template v-if="csv_columns.length > 0">
            <div class="mt-5 font-semibold text-xl">Данные для загрузки</div>
            <DataTable
              :value="CSVData"
              v-model:filters="filters"
              filterDisplay="row"
              tableStyle="min-width: 50rem"
              stripedRows
              paginator
              :rows="10"
              :rowsPerPageOptions="[5, 10, 20, 50]"
            >
              <ColumnGroup type="header">
                <Row>
                  <Column header="Исходные данные" :colspan="3" />
                  <Column header="Items" :colspan="2" />
                </Row>
                <Row>
                  <Column header="id" />
                  <Column header="Цена" />
                  <Column header="Количество" />
                  <Column header="id" />
                  <Column header="Действие" />
                </Row>
              </ColumnGroup>

              <Column header="id">
                <template #body="slotProps">
                  {{ slotProps.data.data[columnIdIndex] }}
                </template>
              </Column>
              <Column header="Цена">
                <template #body="{ data }">
                  <span class="font-bold text-xl">{{ data.data[columnPriceIndex] }}</span>
                </template>
              </Column>
              <Column header="Количество">
                <template #body="slotProps">
                  {{ slotProps.data.data[columnQuantityIndex] }}
                </template>
              </Column>
              <Column field="id" header="id">
                <template #body="{ data }">
                  <template v-if="data.item_name">
                    <Tag severity="success" :value="data.item_name" />
                  </template>
                  <template v-else>
                    <Tag severity="danger" value="Не найдено" />
                  </template>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                  <InputText
                    v-model="filterModel.value"
                    type="text"
                    @input="filterCallback()"
                    placeholder="Искать"
                  />
                </template>
              </Column>
              <Column header="Действие">
                <template #body="{ data }">
                  <Tag
                    :value="data.action"
                    :severity="getSeverity(data.action)"
                    v-if="data.id < 0"
                    @click="
                      () => {
                        data.action == 'IGNORE'
                          ? (data.action = 'INSERT')
                          : (data.action = 'IGNORE')
                      }
                    "
                  />
                  <Tag :value="data.action" :severity="getSeverity(data.action)" v-else />
                </template>
              </Column>
            </DataTable>
          </template>

          <div class="pt-6">
            <Button
              label="Назад"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback('2')"
            />
            <Button
              label="Загрузить"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="
                async () => {
                  const result = await upload(CSVData, columnQuantityIndex, columnPriceIndex)
                  if (result) CSVData = result
                  activateCallback('4')
                }
              "
            />
          </div>
        </StepPanel>
        <!------------------------------------------------------ Финал --------------------------------------------------------->
        <StepPanel v-slot="{ activateCallback }" value="4">
          <template v-if="csv_columns.length > 0">
            <div class="mt-5 font-semibold text-xl">Отчёт о загрузке</div>
            <DataTable
              :value="CSVData"
              v-model:filters="filters"
              filterDisplay="row"
              tableStyle="min-width: 50rem"
              stripedRows
              showGridlines
            >
              <ColumnGroup type="header">
                <Row>
                  <Column header="Исходные данные" :colspan="3" />
                  <Column header="Items" :colspan="2" />
                  <Column header="Отчёт о загрузке" :colspan="2" />
                </Row>
                <Row>
                  <Column header="id" />
                  <Column header="Цена" />
                  <Column header="Количество" />
                  <Column header="id" />
                  <Column header="Действие" />
                  <Column header="Количество" />
                  <Column header="Цена" />
                </Row>
              </ColumnGroup>
              <Column header="id (исходное)">
                <template #body="slotProps">
                  {{ slotProps.data.data[columnIdIndex] }}
                </template>
              </Column>
              <Column header="Цена">
                <template #body="{ data }">
                  <span class="font-bold text-xl">{{ data.data[columnPriceIndex] }}</span>
                </template>
              </Column>
              <Column header="Количество">
                <template #body="slotProps">
                  {{ slotProps.data.data[columnQuantityIndex] }}
                </template>
              </Column>
              <Column field="id" header="id (items)">
                <template #body="{ data }">
                  {{ data.id }}
                </template>
              </Column>
              <Column header="Действие">
                <template #body="{ data }">
                  <Tag :value="data.action" :severity="getSeverity(data.action)" />
                </template>
              </Column>
              <Column header="Количество">
                <template #body="{ data }">
                  <Tag value="ЗАГРУЖЕНО" severity="success" v-if="data.uploaded" />
                </template>
              </Column>
              <Column header="Цена">
                <template #body="{ data }">
                  <Tag value="БЕЗ ИЗМЕНЕНИЙ" severity="success" v-if="data.price_uploaded == 1" />
                  <Tag value="ДОБАВЛЕНО" severity="danger" v-if="data.price_uploaded == 2" />
                </template>
              </Column>
            </DataTable>
          </template>
          <div class="pt-6">
            <Button
              label="Сброс"
              severity="primary"
              @click="
                () => {
                  reset()
                  activateCallback('1')
                }
              "
            />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>
