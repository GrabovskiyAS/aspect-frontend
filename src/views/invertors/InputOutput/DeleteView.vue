<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument, ISimpleDictionary, IInvInputOuptput } from '@/Interfaces/invertors'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import FloatLabel from 'primevue/floatlabel'
import MyAutocomplete from '@/components/Common/MyAutocomplete.vue'
import { useRouter } from 'vue-router'
import { deleteData } from '@/api/dataActionsInvertors'

const data = ref<IDocument<IInvInputOuptput>>({ data: [], error: null, loading: true }) // Входы/Выходы
const signals = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true }) // Сигналы
const series = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true }) // Серии
const signal = ref<string>('')
const serie = ref<string>('')
const loading = ref<boolean>(true)

const props = defineProps(['id'])
const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true

  deleteData(`/data/Inv_spec_of_in_out/${props.id}`).then(() => {
    router.push('/invertors/InputOutput/List')
  })
  saving.value = false
}

async function loadData() {
  data.value = await useFetch(`/data/Inv_spec_of_in_out/${props.id}`)
  signals.value = await useFetch('/data/Inv_type_of_signals')
  series.value = await useFetch('/data/Inv_series_dict')
  serie.value = String(data.value.data[0].serie_id)
  signal.value = String(data.value.data[0].signal_id)
  loading.value = false
}

loadData()
</script>

<template>
  <h1 class="pt-5">Опция для преобразователя частоты. Удалить?</h1>
  <div v-if="loading">loading ...</div>
  <div v-else class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="id" v-model="data.data[0].id" disabled class="w-full" />
        <label for="id">id</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <MyAutocomplete
        v-model="serie"
        optionLabel="name"
        :value="serie"
        label="Серия"
        disabled
        :options="series.data"
      />
    </div>

    <div class="field pt-5">
      <MyAutocomplete
        v-model="signal"
        optionLabel="name"
        :value="signal"
        label="Сигнал"
        disabled
        :options="signals.data"
      />
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="title" v-model="data.data[0].quantity" disabled class="w-full" />
        <label for="title">Количество</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink to="/invertors/InputOutput/List" rel="noopener">
        <Button link label="Отменить" />
      </RouterLink>
      <Button
        label="Удалить"
        severity="danger"
        icon="pi pi-check"
        iconPos="right"
        @click="submission"
        :loading="saving"
      />
    </div>
  </div>
</template>
