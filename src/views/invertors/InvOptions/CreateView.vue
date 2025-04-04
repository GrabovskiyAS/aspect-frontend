<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type {
  IDocument,
  ISimpleDictionary,
  IInvSerie,
  IItem,
  IInvOption,
} from '@/Interfaces/invertors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Select from 'primevue/select'
import Listbox from 'primevue/listbox'
import { useRouter } from 'vue-router'
import { insertData } from '@/api/dataActionsInvertors'
import MyAutocomplete from '@/components/Common/MyAutocomplete.vue'

const series = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const items = ref<IDocument<IItem>>({ data: [], error: null, loading: true })
const typeOfOption = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const invOption = ref<IInvOption>({
  item_name: '',
  name: '',
  altern_name: '',
  short_title: '',
  full_title: '',
  series: '',
  option_id: 0,
})
const optionForm = ref<ISimpleDictionary>({ name: '' })
const seriesForm = ref<IInvSerie[]>([])
const item = ref<number>(0)
const loading = ref<boolean>(true)
const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true
  const url: string = '/data/Inv_options'
  let seriesStr: string = ''

  seriesForm.value.map((item) => (seriesStr += item.id + ','))
  seriesStr = seriesStr.substring(0, seriesStr.length - 1)

  const formData = {
    item_id: item.value,
    name: invOption.value.name,
    short_title: invOption.value.short_title,
    full_title: invOption.value.full_title,
    series: seriesStr,
    option_id: optionForm.value.id,
  }

  insertData(url, formData).then((response) => {
    router.push(`/invertors/InvOptions/Update/${response.data.id}`)
  })
  saving.value = false
}

async function loadData() {
  series.value = await useFetch('/data/Inv_series_dict')
  typeOfOption.value = await useFetch('/data/Type_of_options')
  items.value = await useFetch('/data/Items')
  loading.value = false
}

loadData()
</script>

<template>
  <h1 class="pt-5">Опция для преобразователя частоты. Создание</h1>
  <div v-if="loading">loading ...</div>
  <div v-else class="pt-5">
    <div class="field pt-5">
      <MyAutocomplete
        v-model="item"
        optionLabel="id"
        :options="items.data"
        label="item"
        value="1"
      />
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
        <InputText id="title" v-model="invOption.name" class="w-full" />
        <label for="title">Наименование</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="altern_name" v-model="invOption.altern_name" class="w-full" />
        <label for="altern_name">Альтернативное наименование</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="title" v-model="invOption.full_title" class="w-full" />
        <label for="title">Наименование полное</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="title" v-model="invOption.short_title" class="w-full" />
        <label for="title">Наименование короткое</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/invertors/InvOptions/List`" rel="noopener">
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
