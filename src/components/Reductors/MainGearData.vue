<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useFetch } from '@/api/useFetch'
import Tag from 'primevue/tag'
import type { IDocument } from '@/Interfaces/invertors'
import type { IMainDimentionGear } from '@/Interfaces/reductors'

const props = defineProps(['gearTypeId', 'gearSizeId', 'data'])
const mainGearDimentionData = ref<IDocument<IMainDimentionGear>>({
  data: [],
  error: null,
  loading: true,
})
const loading = ref<boolean>(true)

const loadData = async () => {
  mainGearDimentionData.value = await useFetch(
    `/data/MainDimentionGears?gear_type_id=${props.gearTypeId}&gear_size_id=${props.gearSizeId}`,
    'reductors',
  )
  loading.value = false
}

const getParams = ():string[] | null => {
  if (props.data)
    return props.data.split(',');
  else
    return null;
}

const getValue = (element: string) => {
  const v =  Object.values(mainGearDimentionData.value.data[0]);
  const k =  Object.keys(mainGearDimentionData.value.data[0]);

  const i = k.indexOf(element);
  if (i>-1)
    return v[i]
  else
    return 'Не определено'
}

onBeforeMount(async () => {
  await loadData()
})
</script>

<template>
  <template v-if="!loading">
    <div
      class="mt-1"
      style="width: 100%"
      v-for="(element) in getParams()"
      v-bind:key="element"
    >
      <Tag severity="info" :value="element" />
      {{ getValue(element) }}
    </div>
  </template>
</template>
