<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument, ISimpleDictionary, IInvInputOuptput } from '@/Interfaces/invertors'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import FloatLabel from 'primevue/floatlabel'
import Toast from 'primevue/toast'
import MyAutocomplete from '@/components/Common/MyAutocomplete.vue'
import { useRouter } from 'vue-router'
import { insertData } from '@/api/dataActionsInvertors'

const data = ref<IInvInputOuptput>({ serie_id: 0, signal_id: 0, quantity: 0 }) // Входы/Выходы
const signals = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true }) // Сигналы
const series = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true }) // Серии
const signal = ref<number>(0)
const serie = ref<number>(0)
const loading = ref<boolean>(true)

const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true

  const payload: IInvInputOuptput = {
    serie_id: serie.value,
    signal_id: signal.value,
    quantity: data.value.quantity,
  }

  insertData('/data/Inv_spec_of_in_out', payload)
    .then(function (response) {
      router.push(`/invertors/InputOutput/Update/${response.data.id}`)
    })
    .catch(function (error) {
      console.log(error)
    })
  saving.value = false
}

async function loadData() {
  signals.value = await useFetch('/data/Inv_type_of_signals')
  series.value = await useFetch('/data/Inv_series_dict')
  loading.value = false
}

loadData()
</script>

<template>
  <Toast />

  <h1 class="pt-5">Входы/выходы управления. Создание</h1>
  <div v-if="loading">loading ...</div>
  <div v-else class="pt-5">
    <div class="field pt-5">
      <MyAutocomplete v-model="serie" :value="serie" label="Серия" :options="series.data" />
    </div>

    <div class="field pt-5">
      <MyAutocomplete v-model="signal" :value="signal" label="Сигнал" :options="signals.data" />
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="title" v-model="data.quantity" class="w-full" />
        <label for="title">Количество</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink to="/invertors/InputOutput/List" rel="noopener">
        <Button link label="Отменить" />
      </RouterLink>
      <Button
        label="Создать"
        severity="success"
        icon="pi pi-check"
        iconPos="right"
        @click="submission"
        :loading="saving"
      />
    </div>
  </div>
</template>
