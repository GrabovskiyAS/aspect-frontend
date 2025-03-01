<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type { IRedRatioCode } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import FloatLabel from 'primevue/floatlabel'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { updateDataReductors } from '@/api/dataActionsReductors'

const data = ref<IDocument<IRedRatioCode>>({ data: [], error: null, loading: true }) // Входы/Выходы
const loading = ref<boolean>(true)

const props = defineProps(['id'])
const saving = ref<boolean>(false)
const toast = useToast()

const submission = async () => {
  saving.value = true

  const payload: IRedRatioCode = {
    code_name: data.value.data[0].code_name,
    ratio: data.value.data[0].ratio,
  }

  updateDataReductors(`/data/RedRatioCodes/${props.id}`, payload)
    .then(() => {
      toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 })
    })
    .catch((error) => {
      console.log(error)
    })
  saving.value = false
}

async function loadData() {
  data.value = await useFetch(`/data/RedRatioCodes/${props.id}`, 'reductors')
  loading.value = false
}

loadData()
</script>

<template>
  <Toast />

  <h1 class="pt-5">RedRatioCodes. Редактирование</h1>
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
        <InputNumber id="ratio" v-model="data.data[0].ratio" class="w-full" />
        <label for="ratio">ratio</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/RedRatioCode/List`" rel="noopener">
        <Button link label="Отменить" />
      </RouterLink>
      <Button
        label="Сохранить"
        severity="success"
        icon="pi pi-check"
        iconPos="right"
        @click="submission"
        :loading="saving"
      />
    </div>
  </div>
</template>
