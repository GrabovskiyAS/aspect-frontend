<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type { WarrantyOptions } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import FloatLabel from 'primevue/floatlabel'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { updateDataReductors } from '@/api/dataActionsReductors'

const data = ref<IDocument<WarrantyOptions>>({ data: [], error: null, loading: true }) // Входы/Выходы
const loading = ref<boolean>(true)

const props = defineProps(['id'])
const saving = ref<boolean>(false)
const toast = useToast()

const submission = async () => {
  saving.value = true

  const payload: WarrantyOptions = {
    name: data.value.data[0].name,
    description: data.value.data[0].description,
    add_description: data.value.data[0].add_description,
    sign: data.value.data[0].sign,
    isActive: data.value.data[0].isActive,
  }

  updateDataReductors(`/data/WarrantyOptions/${props.id}`, payload)
    .then(() => {
      toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 })
    })
    .catch((error) => {
      console.log(error)
    })
  saving.value = false
}

async function loadData() {
  data.value = await useFetch(`/data/WarrantyOptions/${props.id}`, 'reductors')

  loading.value = false
}

onBeforeMount(async () => {
  await loadData()
})
</script>

<template>
  <Toast />

  <h1 class="pt-5">Опции гарантии. Редактирование</h1>
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
        <InputText id="name" v-model="data.data[0].name" class="w-full" />
        <label for="name">Наименование</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="description" v-model="data.data[0].description" class="w-full" />
        <label for="description">Описание</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="description" v-model="data.data[0].add_description" class="w-full" />
        <label for="description">Дополнительное описание</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="description" v-model="data.data[0].sign" class="w-full" />
        <label for="description">Sign</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Checkbox id="is_active" v-model="data.data[0].isActive" :binary="true" inputId="is_active" />
        <label class="ml-3" for="is_active">Активная</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/WarrantyOptions/List`" rel="noopener">
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
