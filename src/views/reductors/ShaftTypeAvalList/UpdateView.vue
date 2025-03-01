<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type { IRedShaftType, IRedShaftTypeAvalList } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import FloatLabel from 'primevue/floatlabel'
import Toast from 'primevue/toast'
import Listbox from 'primevue/listbox'
import { useToast } from 'primevue/usetoast'
import { updateDataReductors } from '@/api/dataActionsReductors'

const data = ref<IDocument<IRedShaftTypeAvalList>>({ data: [], error: null, loading: true })
const shaftTypes = ref<IDocument<IRedShaftType>>({ data: [], error: null, loading: true })
const loading = ref<boolean>(true)
const selectedShaftTypes = ref<IRedShaftType[]>([])

const props = defineProps(['id'])
const saving = ref<boolean>(false)
const toast = useToast()

const submission = async () => {
  saving.value = true
  let shaftTypesStr: string = ''

  selectedShaftTypes.value.map((item) => (shaftTypesStr += item.id + ','))
  shaftTypesStr = shaftTypesStr.substring(0, shaftTypesStr.length - 1)

  const payload: IRedShaftTypeAvalList = {
    shaft_output_types: shaftTypesStr,
    description: data.value.data[0].description,
  }

  updateDataReductors(`/data/RedShaftTypeAvalLists/${props.id}`, payload)
    .then(() => {
      toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 })
    })
    .catch((error) => {
      console.log(error)
    })
  saving.value = false
}

onBeforeMount(async () => {
  data.value = await useFetch(`/data/RedShaftTypeAvalLists/${props.id}`, 'reductors')
  shaftTypes.value = await useFetch('/data/RedShaftTypes', 'reductors')

  selectedShaftTypes.value = shaftTypes.value.data.filter((item: IRedShaftType) =>
    data.value.data[0].shaft_output_types.toString().includes(item.id!.toString()),
  )

  loading.value = false
})
</script>

<template>
  <Toast />

  <h1 class="pt-5">RedShaftTypeAvalLists. Редактирование</h1>
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
