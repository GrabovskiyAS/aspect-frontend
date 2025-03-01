<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type { IOutputAdapterImage } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'

import FloatLabel from 'primevue/floatlabel'
import Toast from 'primevue/toast'
import FileUpload from 'primevue/fileupload'
import { useToast } from 'primevue/usetoast'
import { updateDataReductors } from '@/api/dataActionsReductors'
import { useBaseUrl } from '@/stores/baseUrl'
import axios from 'axios'

const data = ref<IDocument<IOutputAdapterImage>>({ data: [], error: null, loading: true }) // Входы/Выходы
const loading = ref<boolean>(true)

const props = defineProps(['id'])
const saving = ref<boolean>(false)
const toast = useToast()
const baseUrl = useBaseUrl()

async function onPhotoSelect(event: any) {
  const formData = new FormData()
  formData.append('file', event.files[0])

  await axios
    .post(`${baseUrl.s3url}/dms/file`, formData)
    .then((res) => {
      data.value.data[0].image = res.data.key
    })
    .catch((err) => console.log(err))
}

const submission = async () => {
  saving.value = true

  const payload: IOutputAdapterImage = {
    image: data.value.data[0].image,
  }

  updateDataReductors(`/data/OutputAdapterImages/${props.id}`, payload)
    .then(() => {
      toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 })
    })
    .catch((error) => {
      console.log(error)
    })
  saving.value = false
}

async function loadData() {
  data.value = await useFetch(`/data/OutputAdapterImages/${props.id}`, 'reductors')

  loading.value = false
}

onBeforeMount(async () => {
  await loadData()
})
</script>

<template>
  <Toast />

  <h1 class="pt-5">OutputAdapterImages. Редактирование</h1>
  <div v-if="loading">loading ...</div>
  <div v-else class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="id" v-model="data.data[0].id" disabled class="w-full" />
        <label for="id">id</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <div class="width:100%"><h3 class="font-semibold">Изображение</h3></div>
      <img :src="`${baseUrl.s3Storage}/${data.data[0].image}`" />
      <FileUpload
        mode="basic"
        @select="onPhotoSelect"
        customUpload
        :auto="true"
        chooseLabel="Выбрать"
        severity="primary"
      />
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/OutputAdapterImage/List`" rel="noopener">
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
