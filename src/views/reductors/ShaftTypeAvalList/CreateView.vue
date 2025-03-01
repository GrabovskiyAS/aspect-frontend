<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type { IRedShaftType, IRedShaftTypeAvalList } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Listbox from 'primevue/listbox'
import { insertDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'

const data = ref<IRedShaftTypeAvalList>({ description: '', shaft_output_types: '' })
const shaftTypes = ref<IDocument<IRedShaftType>>({ data: [], error: null, loading: true })
const loading = ref<boolean>(true)
const selectedShaftTypes = ref<IRedShaftType[]>([])
const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true
  let shaftTypesStr: string = ''

  selectedShaftTypes.value.map((item) => (shaftTypesStr += item.id + ','))
  shaftTypesStr = shaftTypesStr.substring(0, shaftTypesStr.length - 1)

  const payload: IRedShaftTypeAvalList = {
    shaft_output_types: shaftTypesStr,
    description: data.value.description,
  }

  insertDataReductors(`/data/RedShaftTypeAvalLists`, payload)
    .then((response) => {
      router.push(`/reductors/RedShaftTypeAvalList/Update/${response.data.id}`)
    })
    .catch((error) => {
      console.log(error)
    })
  saving.value = false
}

onBeforeMount(async () => {
  shaftTypes.value = await useFetch('/data/RedShaftTypes', 'reductors')
  loading.value = false
})
</script>

<template>
  <h1 class="pt-5">RedShaftTypeAvalLists. Создание</h1>
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
        :options="shaftTypes.data"
        v-model="selectedShaftTypes"
        optionLabel="description"
        multiple
      />
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/RedShaftTypeAvalList/List`" rel="noopener">
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
