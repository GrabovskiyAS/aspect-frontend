<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type { IRedShaftDirection, IRedShaftAvalDirection } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Listbox from 'primevue/listbox'
import { insertDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'

const data = ref<IRedShaftAvalDirection>({ description: '', avalible_direction_shaft: '' })
const shaftDirections = ref<IDocument<IRedShaftDirection>>({ data: [], error: null, loading: true })
const loading = ref<boolean>(true)
const selectedShaftDirections = ref<IRedShaftDirection[]>([])

const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true
  let shaftDirectionsStr: string = ''

  selectedShaftDirections.value.map(
    (item: IRedShaftDirection) => (shaftDirectionsStr += item.id + ','),
  )
  shaftDirectionsStr = shaftDirectionsStr.substring(0, shaftDirectionsStr.length - 1)

  const payload: IRedShaftAvalDirection = {
    avalible_direction_shaft: shaftDirectionsStr,
    description: data.value.description,
  }

  insertDataReductors(`/data/RedShaftAvalDirections`, payload)
    .then((response) => {
      if (response.data.id)
        router.push(`/reductors/RedShaftAvalDirection/Update/${response.data.id}`)
    })
    .catch((error) => {
      console.log(error)
    })
  saving.value = false
}

onBeforeMount(async () => {
  shaftDirections.value = await useFetch('/data/RedShaftDirections', 'reductors')
  loading.value = false
})
</script>

<template>
  <h1 class="pt-5">RedShaftAvalDirections. Создание</h1>
  <div v-if="loading">loading ...</div>
  <div v-else class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputText id="description" v-model="data.description" class="w-full" />
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
