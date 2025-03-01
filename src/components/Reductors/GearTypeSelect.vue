<script setup lang="ts">
import type { IDocument } from '@/Interfaces/invertors'
import type { IRedGearType } from '@/Interfaces/reductors'
import { ref, onBeforeMount, watch } from 'vue'
import { useFetch } from '@/api/useFetch'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Panel from 'primevue/panel'
import Tag from 'primevue/tag'
import { useBaseUrl } from '@/stores/baseUrl'

const gearTypes = ref<IDocument<IRedGearType>>({ data: [], error: null, loading: true })
const gearType = ref<IRedGearType>()
const model = defineModel()
const selectedGearType = ref()
const metaKey = ref(true)
const baseUrl = useBaseUrl()

const loadData = async () => {
  gearTypes.value = await useFetch('/data/RedGearTypes', 'reductors')
  gearType.value = gearTypes.value.data[0]
}

onBeforeMount(async () => {
  await loadData()
  selectedGearType.value = gearTypes.value.data[0]
})

watch(selectedGearType, () => {
  if (selectedGearType.value) model.value = selectedGearType.value.id
})

const getSeverity = (index: number) => {
  switch (index) {
    case 0:
      return 'info'
    case 1:
      return 'success'
    case 2:
      return 'secondary'
    case 3:
      return 'warn'
  }
}
</script>

<template>
  <Panel header="Тип редуктора">
    <template v-if="!gearTypes.loading">
      <DataTable
        v-model:selection="selectedGearType"
        selectionMode="single"
        :metaKeySelection="metaKey"
        dataKey="id"
        :value="gearTypes.data"
        stripedRows
        :loading="gearTypes.loading"
      >
        <Column selectionMode="single" style="width: 5%"></Column>
        <Column header="" style="width: 10%">
          <template #body="{ data }">
            <img :src="`${baseUrl.s3Storage}/${data.image}`" style="height: 50px" />
          </template>
        </Column>
        <Column field="name" header="" style="width: 85%">
          <template #body="{ data, index }">
            <Tag :severity="getSeverity(index)">{{ data.name }}</Tag>
            {{ data.description }}
          </template>
        </Column>
      </DataTable>
    </template>
  </Panel>
</template>
