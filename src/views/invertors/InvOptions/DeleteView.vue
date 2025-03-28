<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument, ISimpleDictionary, IInvOption, IInvSerie } from '@/Interfaces/invertors'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Select from 'primevue/select'
import Listbox from 'primevue/listbox'
import { useRouter } from 'vue-router'
import { deleteData } from '@/api/dataActionsInvertors'

const router = useRouter()
const props = defineProps(['id'])
const series = ref<IDocument<IInvSerie>>({ data: [], error: null, loading: true })
const invOption = ref<IDocument<IInvOption>>({ data: [], error: null, loading: true })
const typeOfOption = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const optionForm = ref<ISimpleDictionary>({ name: '' })
const seriesForm = ref<IInvSerie[]>([])
const loading = ref<boolean>(true)
const saving = ref<boolean>(false)

const submission = async () => {
  saving.value = true
  deleteData(`/data/Inv_options/${props.id}`).then(() => {
    router.push('/invertors/InvOptions/List')
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
  optionForm.value = typeOfOption.value.data.filter(
    (item) => invOption.value.data[0].option_id === item.id,
  )[0]

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
      <label for="series">Серии</label>
      <Listbox
        v-model="seriesForm"
        :options="series.data"
        multiple
        disabled
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
          disabled
          optionLabel="name"
          placeholder="Тип"
          class="w-full md:w-56"
        />
        <label for="id">Тип</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="title" v-model="invOption.data[0].name" disabled class="w-full" />
        <label for="title">Наименование</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="altern_name" v-model="invOption.data[0].altern_name" disabled class="w-full" />
        <label for="altern_name">Альтернативное наименование</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="title" v-model="invOption.data[0].full_title" disabled class="w-full" />
        <label for="title">Наименование полное</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="title" v-model="invOption.data[0].short_title" disabled class="w-full" />
        <label for="title">Наименование короткое</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/invertors/InvOptions/List`" rel="noopener">
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
