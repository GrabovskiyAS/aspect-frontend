<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useFetch } from '@/api/useFetch'
import { RouterLink } from 'vue-router'
import type { IDocument } from '@/Interfaces/invertors.js'
import type {
  IRedGearBoxListSize,
  IRedGearSize,
  IRedGearType,
  IRedItemType,
  IRedMountAvalList,
  IRedShaftTypeAvalList,
  IRedStep,
} from '@/Interfaces/reductors'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { getValueFromDictionary } from '@/api/getValueFromDictionary'

const data = ref<IDocument<IRedGearSize>>({ data: [], error: null, loading: true })
const gear_types = ref<IDocument<IRedGearType>>({ data: [], error: null, loading: true })
const gear_steps = ref<IDocument<IRedStep>>({ data: [], error: null, loading: true })
const list_of_aval_mounts = ref<IDocument<IRedMountAvalList>>({
  data: [],
  error: null,
  loading: true,
})
const red_item_types = ref<IDocument<IRedItemType>>({ data: [], error: null, loading: true })
const gear_box_list_sizes = ref<IDocument<IRedGearBoxListSize>>({
  data: [],
  error: null,
  loading: true,
})
const shaft_aval_lists = ref<IDocument<IRedShaftTypeAvalList>>({
  data: [],
  error: null,
  loading: true,
})
const loading = ref<boolean>(true)

onBeforeMount(async () => {
  data.value = await useFetch('/data/RedGearSizes', 'reductors')
  gear_types.value = await useFetch('/data/RedGearTypes', 'reductors')
  gear_steps.value = await useFetch('/data/RedSteps', 'reductors')
  list_of_aval_mounts.value = await useFetch('/data/RedMountAvalLists', 'reductors')
  red_item_types.value = await useFetch('/data/RedItemTypes', 'reductors')
  gear_box_list_sizes.value = await useFetch('/data/RedGearBoxListSizes', 'reductors')
  shaft_aval_lists.value = await useFetch('/data/RedShaftTypeAvalLists', 'reductors')
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
        <h1 class="pt-5">RedGearSize</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/reductors/RedGearSize/Create/`" rel="noopener">
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
        <Column field="code_size_manuf" header="code_size_manuf" sortable style="width: 15%">
          <template #body="{ data }">
            {{ data.code_size_manuf }}
          </template>
        </Column>

        <Column header="gear_type" sortable style="width: 15%">
          <template #body="{ data }">
            {{ getValueFromDictionary(gear_types.data, data.gear_type_id, 'description') }}
          </template>
        </Column>

        <Column header="gear_steps" sortable style="width: 15%">
          <template #body="{ data }">
            <p class="mt-2">
              <Tag severity="info">steps</Tag
              >{{ getValueFromDictionary(gear_steps.data, data.gear_steps_id, 'steps') }}
            </p>
            <p class="mt-2">
              <Tag severity="success">kpd</Tag
              >{{ getValueFromDictionary(gear_steps.data, data.gear_steps_id, 'kpd') }}
            </p>
          </template>
        </Column>

        <Column header="list_of_aval_mount" sortable style="width: 15%">
          <template #body="{ data }">
            {{
              getValueFromDictionary(
                list_of_aval_mounts.data,
                data.list_of_aval_mount_id,
                'description',
              )
            }}
          </template>
        </Column>

        <Column header="red_item_type" sortable style="width: 15%">
          <template #body="{ data }">
            {{ getValueFromDictionary(red_item_types.data, data.red_item_type_id, 'description') }}
          </template>
        </Column>

        <Column header="gear_box_list_size" sortable style="width: 15%">
          <template #body="{ data }">
            {{
              getValueFromDictionary(
                gear_box_list_sizes.data,
                data.gear_box_list_size_id,
                'description',
              )
            }}
          </template>
        </Column>

        <Column header="shaft_aval_list" sortable style="width: 15%">
          <template #body="{ data }">
            {{
              getValueFromDictionary(shaft_aval_lists.data, data.shaft_aval_list_id, 'description')
            }}
          </template>
        </Column>

        <Column header="Действия">
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/reductors/RedGearSize/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <RouterLink :to="`/reductors/RedGearSize/Delete/${slotProps.data.id}`">
                <Button icon="pi pi-trash" severity="danger" />
              </RouterLink>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
