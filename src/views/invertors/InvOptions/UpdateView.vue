<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument, ISimpleDictionary, IInvSerie, IInvOption } from '@/Interfaces/invertors'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Select from 'primevue/select'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import Listbox from 'primevue/listbox'
import { updateData } from '@/api/dataActionsInvertors'

const series = ref<IDocument<IInvSerie>>({ data: [], error: null, loading: true })
const invOption = ref<IDocument<IInvOption>>({ data: [], error: null, loading: true })
const typeOfOption = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })

const optionForm = ref<ISimpleDictionary>({ name: '', id: 0 })
const seriesForm = ref<IInvSerie[]>([])
const loading = ref<boolean>(true)
const saving = ref<boolean>(false)

const props = defineProps(['id'])
const toast = useToast()

const submission = async () => {
  saving.value = true
  const url: string = `/data/Inv_options/${props.id}`
  let seriesStr: string = ''

  seriesForm.value.map((item) => (seriesStr += item.id + ','))
  seriesStr = seriesStr.substring(0, seriesStr.length - 1)

  const formData: IInvOption = {
    item_name: invOption.value.data[0].item_name,
    name: invOption.value.data[0].name,
    altern_name: invOption.value.data[0].altern_name,
    short_title: invOption.value.data[0].short_title,
    full_title: invOption.value.data[0].full_title,
    series: seriesStr,
    option_id: optionForm.value.id!,
  }

  updateData(url, formData).then(() => {
    toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 })
  })
  saving.value = false
}

async function loadData() {
  invOption.value = await useFetch(`/data/Inv_options/${props.id}`)
  series.value = await useFetch('/data/Inv_series_dict')
  typeOfOption.value = await useFetch('/data/Type_of_options')

  seriesForm.value = series.value.data.filter((item) =>
    invOption.value.data[0].series.toString().includes(item.id!.toString()),
  )
  optionForm.value = typeOfOption.value.data.find(
    (item) => invOption.value.data[0].option_id === item.id,
  )!

  loading.value = false
}

loadData()
</script>

<template>
  <Toast />

  <h1 class="pt-5">Опция для преобразователя частоты. Редактирование</h1>
  <div v-if="loading">loading ...</div>
  <div v-else class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="id" v-model="invOption.data[0].id" disabled class="w-full" />
        <label for="id">id</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="item" v-model="invOption.data[0].item_name" disabled class="w-full" />
        <label for="id">item</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="title" v-model="invOption.data[0].name" class="w-full" />
        <label for="title">Наименование</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="title" v-model="invOption.data[0].altern_name" class="w-full" />
        <label for="title">Альтернативное наименование</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <label for="series">Серии</label>
      <Listbox
        v-model="seriesForm"
        :options="series.data"
        multiple
        optionLabel="name"
        class="w-full md:w-56"
        listStyle="max-height:250px"
      />
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Select
          v-model="optionForm"
          :options="typeOfOption.data"
          optionLabel="name"
          placeholder="Тип"
          class="w-full md:w-56"
        />
        <label for="id">Тип</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="title" v-model="invOption.data[0].full_title" class="w-full" />
        <label for="title">Наименование полное</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="title" v-model="invOption.data[0].short_title" class="w-full" />
        <label for="title">Наименование короткое</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/invertors/InvOptions/List`" rel="noopener">
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
