<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import { AxiosInstanceInvertors } from '@/api/axiosInstance'
import type { IDocument, IInvAvalControl, ISimpleDictionary } from '@/Interfaces/invertors'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'

import FloatLabel from 'primevue/floatlabel'
import Toast from 'primevue/toast'
import { useRouter } from 'vue-router'
import { getValueFromDictionary } from '@/api/getValueFromDictionary'

const router = useRouter()
const data = ref<IDocument<IInvAvalControl>>({ data: [], error: null, loading: true })
const series = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const controls = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const loading = ref<boolean>(true)

const props = defineProps(['id'])

const submission = async () => {
  const url: string = `/data/Inv_type_of_control/${props.id}`

  AxiosInstanceInvertors.delete(url, {}).then(() => {
    router.push('/invertors/InvTypeOfControls/List')
  })
}

async function loadData() {
  data.value = await useFetch('/data/Inv_type_of_control')
  series.value = await useFetch('/data/Inv_series_dict')
  controls.value = await useFetch('/data/Variants_of_control')
  loading.value = false
}

loadData()
</script>

<template>
  <Toast />

  <h1 class="pt-5">Способ управления для серии. Удалить?</h1>
  <div v-if="loading">loading ...</div>
  <div v-else class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="id" v-model="data.data[0].id" disabled class="w-full" />
        <label for="id">id</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputNumber
          id="item"
          v-model="data.data[0].serie_id"
          :value="getValueFromDictionary(series.data, data.data[0].serie_id)"
          disabled
          class="w-full"
        />
        <label for="id">Серия</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputNumber
          id="item"
          v-model="data.data[0].control_id"
          :value="getValueFromDictionary(controls.data, data.data[0].control_id)"
          disabled
          class="w-full"
        />
        <label for="title">Способ упралвеия</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/invertors/InvTypeOfControls/List`" rel="noopener">
        <Button link label="Отменить" />
      </RouterLink>
      <Button
        label="Удалить"
        severity="danger"
        icon="pi pi-times"
        iconPos="right"
        @click="submission"
      />
    </div>
  </div>
</template>
