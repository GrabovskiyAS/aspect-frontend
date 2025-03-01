<script setup lang="ts">
import type { IDocument } from '@/Interfaces/invertors'
import type { IRedMountTypeView } from '@/Interfaces/reductors'
import { ref, onBeforeMount, watch } from 'vue'
import { useFetch } from '@/api/useFetch'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useBaseUrl } from '@/stores/baseUrl'

const mountTypes = ref<IDocument<IRedMountTypeView>>({ data: [], error: null, loading: true })
const model = defineModel<number>()
const mountTypeName =  defineModel<string>('mountTypeName')
const props = defineProps(['id_gear', 'gear_type_id'])
const selectedMountType = ref<IRedMountTypeView>()
const metaKey = ref(true)
const baseUrl = useBaseUrl()

const loadData = async () => {
  mountTypes.value = await useFetch(`/data/RedMountTypesView?id_gear=${props.id_gear}`, 'reductors')
  selectedMountType.value = mountTypes.value.data[0]
}

onBeforeMount(() => {
  loadData()
})

watch(selectedMountType, () => {
  if (selectedMountType.value) {
    model.value = selectedMountType.value!.id!
    mountTypeName.value = selectedMountType.value!.description!
  }
})
</script>

<template>
  <template v-if="!mountTypes.loading">
    <div class="mt-5">
      <span class="text-2xl font-semibold mt-5 text-primary">Способ монтажа</span>
      <DataTable
        v-model:selection="selectedMountType"
        selectionMode="single"
        :metaKeySelection="metaKey"
        dataKey="id"
        :value="mountTypes.data"
        stripedRows
        tableStyle="min-width: 50rem"
        :loading="mountTypes.loading"
      >
        <Column selectionMode="single" style="width: 5%"></Column>
        <Column field="description" header="Описание" style="width: 30%"></Column>
        <Column header="Изображение" style="width: 70%">
          <template #body="{ data }">
            <img
              :src="`${baseUrl.s3Storage}/${data.K}`"
              style="height: 100px"
              v-if="props.gear_type_id == 10"
            />
            <img
              :src="`${baseUrl.s3Storage}/${data.C}`"
              style="height: 100px"
              v-if="props.gear_type_id == 20"
            />
            <img
              :src="`${baseUrl.s3Storage}/${data.F}`"
              style="height: 100px"
              v-if="props.gear_type_id == 30"
            />
            <img
              :src="`${baseUrl.s3Storage}/${data.S}`"
              style="height: 100px"
              v-if="props.gear_type_id == 40"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </template>
</template>
