<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type { IRedShaftDirection, IRedShaftAvalDirection } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import FloatLabel from 'primevue/floatlabel'
import Listbox from 'primevue/listbox'
import { deleteDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'

const data = ref<IDocument<IRedShaftAvalDirection>>({ data: [], error: null, loading: true })
const shaftDirections = ref<IDocument<IRedShaftDirection>>({ data: [], error: null, loading: true })
const loading = ref<boolean>(true)
const selectedShaftDirections = ref<IRedShaftDirection[]>([])

const props = defineProps(['id'])
const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true

  deleteDataReductors(`/data/RedShaftAvalDirections/${props.id}`)
    .then(() => {
      router.push('/reductors/RedShaftAvalDirection/List')
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
  <h1 class="pt-5">RedShaftAvalDirections. Удалить?</h1>
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
        <InputText id="description" v-model="data.data[0].description" class="w-full" disabled />
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
        disabled
      />
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/RedShaftAvalDirection/List`" rel="noopener">
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
