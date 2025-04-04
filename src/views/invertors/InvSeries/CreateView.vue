<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument, ISimpleDictionary, IFile, IInvSerie } from '@/Interfaces/invertors'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import FileUpload from 'primevue/fileupload'
import { useBaseUrl } from '@/stores/baseUrl'
import uploadFile from '@/api/uploadFile'
import { useRouter } from 'vue-router'
import { insertData } from '@/api/dataActionsInvertors'

const baseUrl = useBaseUrl()
const router = useRouter()

const data = ref<IInvSerie>({
  name: '',
  altern_name: '',
  description: '',
  manufactory_id: 0,
  output_voltage_id: 0,
  type_of_control_id: 0,
  type_of_panel_id: 0,
  type_of_overload_id: 0,
  type_of_accuracy_freq_id: 0,
  ambient_temperature_id: 0,
  level_IP_id: 0,
  min_power: '',
  max_power: '',
  photo: '',
  schema: '',
  is_active: true,
})
const manufactoryData = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const outputVoltageData = ref<IDocument<ISimpleDictionary>>({
  data: [],
  error: null,
  loading: true,
})
const typeOfControlData = ref<IDocument<ISimpleDictionary>>({
  data: [],
  error: null,
  loading: true,
})
const typeOfPanelData = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const typeOfOverloadData = ref<IDocument<ISimpleDictionary>>({
  data: [],
  error: null,
  loading: true,
})
const typeOfAccuracyFreqData = ref<IDocument<ISimpleDictionary>>({
  data: [],
  error: null,
  loading: true,
})
const ambientTemperatureData = ref<IDocument<ISimpleDictionary>>({
  data: [],
  error: null,
  loading: true,
})
const levelIPData = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })

const manufactory = ref<ISimpleDictionary>({ name: '' })
const outputVoltage = ref<ISimpleDictionary>({ name: '' })
const typeOfControl = ref<ISimpleDictionary>({ name: '' })
const typeOfPanel = ref<ISimpleDictionary>({ name: '' })
const typeOfOverload = ref<ISimpleDictionary>({ name: '' })
const typeOfAccuracyFreq = ref<ISimpleDictionary>({ name: '' })
const ambientTemperature = ref<ISimpleDictionary>({ name: '' })
const levelIP = ref<ISimpleDictionary>({ name: '' })
const min_power = ref<number>()
const max_power = ref<number>()
const photo = ref<IFile>()
const schema = ref<IFile>()
const saving = ref<boolean>(false)
const loading = ref<boolean>(true)

const submission = async () => {
  saving.value = true

  const payload: IInvSerie = {
    name: data.value.name,
    altern_name: data.value.altern_name,
    description: data.value.description,
    manufactory_id: manufactory.value.id!,
    output_voltage_id: outputVoltage.value.id!,
    type_of_control_id: typeOfControl.value.id!,
    type_of_panel_id: typeOfPanel.value.id!,
    type_of_overload_id: typeOfOverload.value.id!,
    type_of_accuracy_freq_id: typeOfAccuracyFreq.value.id!,
    ambient_temperature_id: ambientTemperature.value.id!,
    level_IP_id: levelIP.value.id!,
    min_power: String(min_power.value),
    max_power: String(max_power.value),
    photo: '',
    schema: '',
    is_active: data.value.is_active,
  }

  // photo.value && photo.value.file_blob && formData.append("photo", photo.value.file_blob, String(photo.value.file_name))
  // schema.value && schema.value.file_blob && formData.append("schema", schema.value.file_blob, String(schema.value.file_name))

  insertData('/data/Inv_series', payload)
    .then((response) => {
      router.push(`/invertors/InvSeries/Update/${response.data.id}`)
    })
    .catch(function (error) {
      console.log(error)
    })
  saving.value = false
}

const upload_photo = async (event: any) => {
  photo.value = await uploadFile(event)
}
const upload_schema = async (event: any) => {
  schema.value = await uploadFile(event)
}

async function loadData() {
  manufactoryData.value = await useFetch('/data/Manufactory')
  outputVoltageData.value = await useFetch('/data/Inv_output_voltage')
  typeOfControlData.value = await useFetch('/data/Type_of_control')
  typeOfPanelData.value = await useFetch('/data/Inv_type_of_panels')
  typeOfOverloadData.value = await useFetch('/data/Inv_overload_dict')
  typeOfAccuracyFreqData.value = await useFetch('/data/Inv_accurancy_freq')
  ambientTemperatureData.value = await useFetch('/data/Ambient_temperatures')
  levelIPData.value = await useFetch('/data/Level_IP')
  loading.value = false
}

loadData()
</script>

<template>
  <h1 class="pt-5">Серия преобразователя частоты. Создание</h1>
  <div v-if="loading">loading ...</div>
  <div v-else class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputText id="title" v-model="data.name" class="w-full" />
        <label for="title">Наименование</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="title" v-model="data.altern_name" class="w-full" />
        <label for="title">Альтернативное наименование</label>
      </FloatLabel>
    </div>

    <div class="field">
      <div class="grid">
        <div class="col-6">
          <div class="width:100%"><h3 class="font-semibold">Изображение</h3></div>
          <img v-if="photo" v-bind:src="String(photo.file_base64data)" width="350" />
          <img
            v-else
            :src="`${baseUrl.baseUrlInvertors}/inv_series/no_photo.jpg`"
            width="350"
            height="262"
          />
          <FileUpload
            mode="basic"
            name="demo[]"
            url="/api/upload"
            accept="image/*"
            :maxFileSize="1000000"
            customUpload
            @uploader="upload_photo"
            :auto="true"
            chooseLabel="Выбрать"
          />
        </div>
        <div class="col-6">
          <div class="width:100%"><h3 class="font-semibold">Схема</h3></div>
          <img v-if="schema" v-bind:src="String(schema.file_base64data)" width="350" />
          <img
            v-else
            :src="`${baseUrl.baseUrlInvertors}/inv_series/no_photo.jpg`"
            width="350"
            height="262"
          />
          <FileUpload
            mode="basic"
            name="demo[]"
            url="/api/upload"
            accept="image/*"
            :maxFileSize="10000000"
            customUpload
            @uploader="upload_schema"
            :auto="true"
            chooseLabel="Выбрать"
          />
        </div>
      </div>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Textarea id="description" v-model="data.description" class="w-full" />
        <label for="title">Описание</label>
      </FloatLabel>
    </div>

    <div class="grid">
      <div class="col">
        <div class="field pt-5">
          <FloatLabel>
            <InputNumber id="min_power" v-model="min_power" class="w-full" />
            <label for="min_power">Мощность минимальная</label>
          </FloatLabel>
        </div>
      </div>
      <div class="col">
        <div class="field pt-5">
          <FloatLabel>
            <InputNumber id="max_power" v-model="max_power" class="w-full" />
            <label for="max_power">Мощность максимальная</label>
          </FloatLabel>
        </div>
      </div>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Select
          v-model="manufactory"
          :options="manufactoryData.data"
          optionLabel="name"
          placeholder="Производитель"
          class="w-full md:w-56"
        />
        <label for="serie">Производитель</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Select
          v-model="outputVoltage"
          :options="outputVoltageData.data"
          optionLabel="name"
          placeholder="Выходное напряжение"
          class="w-full md:w-56"
        />
        <label for="serie">Выходное напряжение</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Select
          v-model="typeOfControl"
          :options="typeOfControlData.data"
          optionLabel="name"
          placeholder="Управление"
          class="w-full md:w-56"
        />
        <label for="serie">Управление</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Select
          v-model="typeOfOverload"
          :options="typeOfOverloadData.data"
          optionLabel="name"
          placeholder="Перегрузка"
          class="w-full md:w-56"
        />
        <label for="serie">Перегрузка</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Select
          v-model="typeOfPanel"
          :options="typeOfPanelData.data"
          optionLabel="name"
          placeholder="Панель"
          class="w-full md:w-56"
        />
        <label for="serie">Панель</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Select
          v-model="typeOfAccuracyFreq"
          :options="typeOfAccuracyFreqData.data"
          optionLabel="name"
          placeholder="Точность регулирования"
          class="w-full md:w-56"
        />
        <label for="serie">Точность регулирования</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Select
          v-model="ambientTemperature"
          :options="ambientTemperatureData.data"
          optionLabel="name"
          placeholder="Допустимая температура окружающей среды"
          class="w-full md:w-56"
        />
        <label for="serie">Допустимая температура окружающей среды</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Select
          v-model="levelIP"
          :options="levelIPData.data"
          optionLabel="name"
          placeholder="Допустимая температура окружающей среды"
          class="w-full md:w-56"
        />
        <label for="serie">Уровень защиты</label>
      </FloatLabel>
    </div>

    <div class="flex items-center gap-2">
      <Checkbox id="is_active" v-model="data.is_active" binary />
      <label for="is_active">Активная серия</label>
    </div>


    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/invertors/InvSeries/List`" rel="noopener">
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
