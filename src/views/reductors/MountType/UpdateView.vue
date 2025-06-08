<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type { IRedMountType } from '@/Interfaces/reductors'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'

import FloatLabel from 'primevue/floatlabel'
import Toast from 'primevue/toast'
import FileUpload from 'primevue/fileupload'
import { useToast } from 'primevue/usetoast'
import { updateDataReductors } from '@/api/dataActionsReductors'
import { useBaseUrl } from '@/stores/baseUrl'
import axios from 'axios'

const baseUrl = useBaseUrl()
const data = ref<IDocument<IRedMountType>>({ data: [], error: null, loading: true }) // Входы/Выходы
const loading = ref<boolean>(true)

const props = defineProps(['id'])
const saving = ref<boolean>(false)
const toast = useToast()

const submission = async () => {
  saving.value = true

  const payload: IRedMountType = {
    description: data.value.data[0].description,
    image: data.value.data[0].image,
    K: data.value.data[0].K,
    C: data.value.data[0].C,
    F: data.value.data[0].F,
    S: data.value.data[0].S,
    K_figure: data.value.data[0].K_figure,
    C_figure: data.value.data[0].C_figure,
    F_figure: data.value.data[0].F_figure,
    S_figure: data.value.data[0].S_figure,
    K_data: data.value.data[0].K_data,
    C_data: data.value.data[0].C_data,
    F_data: data.value.data[0].F_data,
    S_data: data.value.data[0].S_data,
  }

  updateDataReductors(`/data/RedMountTypes/${props.id}`, payload)
    .then(() => {
      toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 })
    })
    .catch((error) => {
      console.log(error)
    })
  saving.value = false
}

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

async function onKSelect(event: any) {
  const formData = new FormData()
  formData.append('file', event.files[0])

  await axios
    .post(`${baseUrl.s3url}/dms/file`, formData)
    .then((res) => {
      data.value.data[0].K = res.data.key
    })
    .catch((err) => console.log(err))
}

async function onCSelect(event: any) {
  const formData = new FormData()
  formData.append('file', event.files[0])

  await axios
    .post(`${baseUrl.s3url}/dms/file`, formData)
    .then((res) => {
      data.value.data[0].C = res.data.key
    })
    .catch((err) => console.log(err))
}

async function onFSelect(event: any) {
  const formData = new FormData()
  formData.append('file', event.files[0])

  await axios
    .post(`${baseUrl.s3url}/dms/file`, formData)
    .then((res) => {
      data.value.data[0].F = res.data.key
    })
    .catch((err) => console.log(err))
}

async function onSSelect(event: any) {
  const formData = new FormData()
  formData.append('file', event.files[0])

  await axios
    .post(`${baseUrl.s3url}/dms/file`, formData)
    .then((res) => {
      data.value.data[0].S = res.data.key
    })
    .catch((err) => console.log(err))
}

async function onK_figureSelect(event: any) {
  const formData = new FormData()
  formData.append('file', event.files[0])

  await axios
    .post(`${baseUrl.s3url}/dms/file`, formData)
    .then((res) => {
      data.value.data[0].K_figure = res.data.key
    })
    .catch((err) => console.log(err))
}

async function onC_figureSelect(event: any) {
  const formData = new FormData()
  formData.append('file', event.files[0])

  await axios
    .post(`${baseUrl.s3url}/dms/file`, formData)
    .then((res) => {
      data.value.data[0].C_figure = res.data.key
    })
    .catch((err) => console.log(err))
}

async function onF_figureSelect(event: any) {
  const formData = new FormData()
  formData.append('file', event.files[0])

  await axios
    .post(`${baseUrl.s3url}/dms/file`, formData)
    .then((res) => {
      data.value.data[0].F_figure = res.data.key
    })
    .catch((err) => console.log(err))
}

async function onS_figureSelect(event: any) {
  const formData = new FormData()
  formData.append('file', event.files[0])

  await axios
    .post(`${baseUrl.s3url}/dms/file`, formData)
    .then((res) => {
      data.value.data[0].S_figure = res.data.key
    })
    .catch((err) => console.log(err))
}

async function loadData() {
  data.value = await useFetch(`/data/RedMountTypes/${props.id}`, 'reductors')
  loading.value = false
}

loadData()
</script>

<template>
  <Toast />

  <h1 class="pt-5">RedGearTypes. Редактирование</h1>
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
      <FloatLabel>
        <InputText id="K_data" v-model="data.data[0].K_data" class="w-full" />
        <label for="K_data">Данные K</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="C_data" v-model="data.data[0].C_data" class="w-full" />
        <label for="C_data">Данные C</label>
      </FloatLabel>
    </div>
    <div class="field pt-5">
      <FloatLabel>
        <InputText id="F_data" v-model="data.data[0].F_data" class="w-full" />
        <label for="F_data">Данные F</label>
      </FloatLabel>
    </div>
    <div class="field pt-5">
      <FloatLabel>
        <InputText id="S_data" v-model="data.data[0].S_data" class="w-full" />
        <label for="S_data">Данные S</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <div class="width:100%"><h3 class="font-semibold">Изображение</h3></div>
      <img :src="`${baseUrl.s3Storage}/${data.data[0].image}`"  width="300"/>
      <FileUpload
        mode="basic"
        @select="onPhotoSelect"
        customUpload
        :auto="true"
        chooseLabel="Выбрать"
        severity="primary"
      />
    </div>

    <div class="field pt-5">
      <div class="width:100%"><h3 class="font-semibold">Изображение K</h3></div>
      <img :src="`${baseUrl.s3Storage}/${data.data[0].K}`"  width="300"/>
      <FileUpload
        mode="basic"
        @select="onKSelect"
        customUpload
        :auto="true"
        chooseLabel="Выбрать"
        severity="primary"
      />
    </div>

    <div class="field pt-5">
      <div class="width:100%"><h3 class="font-semibold">Изображение C</h3></div>
      <img :src="`${baseUrl.s3Storage}/${data.data[0].C}`"  width="300"/>
      <FileUpload
        mode="basic"
        @select="onCSelect"
        customUpload
        :auto="true"
        chooseLabel="Выбрать"
        severity="primary"
      />
    </div>

    <div class="field pt-5">
      <div class="width:100%"><h3 class="font-semibold">Изображение F</h3></div>
      <img :src="`${baseUrl.s3Storage}/${data.data[0].F}`"  width="300"/>
      <FileUpload
        mode="basic"
        @select="onFSelect"
        customUpload
        :auto="true"
        chooseLabel="Выбрать"
        severity="primary"
      />
    </div>

    <div class="field pt-5">
      <div class="width:100%"><h3 class="font-semibold">Изображение S</h3></div>
      <img :src="`${baseUrl.s3Storage}/${data.data[0].S}`"  width="300"/>
      <FileUpload
        mode="basic"
        @select="onSSelect"
        customUpload
        :auto="true"
        chooseLabel="Выбрать"
        severity="primary"
      />
    </div>

    <div class="field pt-5">
      <div class="width:100%"><h3 class="font-semibold">Изображение K для чертежей</h3></div>
      <img :src="`${baseUrl.s3Storage}/${data.data[0].K_figure}`"  width="300"/>
      <FileUpload
        mode="basic"
        @select="onK_figureSelect"
        customUpload
        :auto="true"
        chooseLabel="Выбрать"
        severity="primary"
      />
    </div>

    <div class="field pt-5">
      <div class="width:100%"><h3 class="font-semibold">Изображение C для чертежей</h3></div>
      <img :src="`${baseUrl.s3Storage}/${data.data[0].C_figure}`"  width="300"/>
      <FileUpload
        mode="basic"
        @select="onC_figureSelect"
        customUpload
        :auto="true"
        chooseLabel="Выбрать"
        severity="primary"
      />
    </div>

    <div class="field pt-5">
      <div class="width:100%"><h3 class="font-semibold">Изображение F для чертежей</h3></div>
      <img :src="`${baseUrl.s3Storage}/${data.data[0].F_figure}`"  width="300"/>
      <FileUpload
        mode="basic"
        @select="onF_figureSelect"
        customUpload
        :auto="true"
        chooseLabel="Выбрать"
        severity="primary"
      />
    </div>

    <div class="field pt-5">
      <div class="width:100%"><h3 class="font-semibold">Изображение S для чертежей</h3></div>
      <img :src="`${baseUrl.s3Storage}/${data.data[0].S_figure}`"  width="300"/>
      <FileUpload
        mode="basic"
        @select="onS_figureSelect"
        customUpload
        :auto="true"
        chooseLabel="Выбрать"
        severity="primary"
      />
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/RedMountType/List`" rel="noopener">
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
