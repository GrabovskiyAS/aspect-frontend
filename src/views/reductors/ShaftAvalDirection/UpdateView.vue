<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type { IRedShaftDirection, IRedShaftAvalDirection } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import FloatLabel from 'primevue/floatlabel'
import Toast from 'primevue/toast'
import Listbox from 'primevue/listbox'
import { useToast } from 'primevue/usetoast'
import { updateDataReductors } from '@/api/dataActionsReductors'

const data = ref<IDocument<IRedShaftAvalDirection>>({ data: [], error: null, loading: true })
const shaftDirections = ref<IDocument<IRedShaftDirection>>({ data: [], error: null, loading: true })
const loading = ref<boolean>(true)
const selectedShaftDirections = ref<IRedShaftDirection[]>([])

const props = defineProps(['id'])
const saving = ref<boolean>(false)
const toast = useToast()

const submission = async () => {
  saving.value = true
  let shaftDirectionsStr: string = ''

  selectedShaftDirections.value.map(
    (item: IRedShaftDirection) => (shaftDirectionsStr += item.id + ','),
  )
  shaftDirectionsStr = shaftDirectionsStr.substring(0, shaftDirectionsStr.length - 1)

  const payload: IRedShaftAvalDirection = {
    avalible_direction_shaft: shaftDirectionsStr,
    description: data.value.data[0].description,
  }

  updateDataReductors(`/data/RedShaftAvalDirections/${props.id}`, payload)
    .then(() => {
      toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 })
    })
    .catch((error) => {
      console.log(error)
    })
  saving.value = false
}

onBeforeMount(async () => {
  data.value = await useFetch(`/data/RedShaftAvalDirections/${props.id}`, 'reductors')
  shaftDirections.value = await useFetch('/data/RedShaftDirections', 'reductors')

  selectedShaftDirections.value = shaftDirections.value.data.filter((item: IRedShaftDirection) =>
    data.value.data[0].avalible_direction_shaft.toString().includes(item.id!.toString()),
  )

  loading.value = false
})
</script>

<template>
  <Toast />

  <h1 class="pt-5">RedShaftAvalDirections. Редактирование</h1>
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
        <InputText id="description" v-model="data.data[0].description" class="w-full" />
        <label for="description">Описание</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <label>Типы</label>
      <Listbox
        :options="shaftDirections.data"
        v-model="selectedShaftDirections"
        optionLabel="description"
        multiple
      />
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/RedShaftAvalDirection/List`" rel="noopener">
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
