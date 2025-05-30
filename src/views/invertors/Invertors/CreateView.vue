<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type {
  IDocument,
  IInvertor,
  IInvSerie,
  ISimpleDictionary,
  IItem,
} from '@/Interfaces/invertors'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Listbox from 'primevue/listbox'
import FloatLabel from 'primevue/floatlabel'
import Select from 'primevue/select'
import Toast from 'primevue/toast'
import AutoComplete from 'primevue/autocomplete'
import { insertData } from '@/api/dataActionsInvertors'
import { useRouter } from 'vue-router'

const data = ref<IInvertor>({
  item_name: '',
  serie_id: 0,
  input_voltage_id: 0,
  output_voltage_id: 0,
  size_id: 0,
  type_of_break_module_id: 0,
  type_of_dc_drossel_id: 0,
  type_of_emc_drossel_id: 0,
  type_of_control_id: 0,
  name: '',
  altern_name: '',
  p_heavy_g: '0',
  p_pumps_p: '0',
  current_g: '0',
  current_p: '0',
})
const items = ref<IDocument<IItem>>({ data: [], error: null, loading: true })
const series = ref<IDocument<IInvSerie>>({ data: [], error: null, loading: true })
const invInputVoltage = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const invOutputVoltage = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const sizes = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const invBreakModule = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const invDC = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const invEMC = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })

const invDCdata = ref<ISimpleDictionary>({ name: '', id: 0 })
const invEMCdata = ref<ISimpleDictionary>({ name: '', id: 0 })
const invBreakModuleData = ref<ISimpleDictionary>({ name: '', id: 0 })
const invInputVoltageData = ref<ISimpleDictionary>({ name: '', id: 0 })
const invOutputVoltageData = ref<ISimpleDictionary>({ name: '', id: 0 })
const invSizeData = ref<ISimpleDictionary>({ name: '', id: 0 })
const invSerieData = ref<ISimpleDictionary>({ name: '', id: 0 })
const item = ref<IItem>({ type_id: 0, name: '', quantity: 0, waiting_period_id: 0 })
const itemsDisplay = ref<IItem[]>([])

const p_heavy_g = ref<number>(0)
const p_pumps_p = ref<number>(0)
const current_g = ref<number>(0)
const current_p = ref<number>(0)

const saving = ref<boolean>(false)
const router = useRouter()

const loading = ref<boolean>(true)

const submission = async () => {
  saving.value = true

  if (
    item.value.id &&
    data.value.name &&
    invSerieData.value.id &&
    invSizeData.value.id &&
    invEMCdata.value.id &&
    invDCdata.value.id &&
    invBreakModuleData.value.id &&
    invInputVoltageData.value.id
  ) {
    const payload: IInvertor = {
      item_name: item.value.name,
      name: data.value.name,
      altern_name: data.value.altern_name,
      serie_id: invSerieData.value.id,
      size_id: invSizeData.value.id,
      type_of_emc_drossel_id: invEMCdata.value.id,
      type_of_dc_drossel_id: invDCdata.value.id,
      type_of_break_module_id: invBreakModuleData.value.id,
      input_voltage_id: invInputVoltageData.value.id,
      output_voltage_id: invOutputVoltageData.value.id!,
      p_heavy_g: String(p_heavy_g.value),
      p_pumps_p: String(p_pumps_p.value),
      current_p: String(current_p.value),
      current_g: String(current_g.value),
    }

    insertData('/data/Invertors', payload)
      .then((response) => {
        router.push(`/invertors/Invertors/Update/${response.data.id}`)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  saving.value = false
}

const search = (event: any) => {
  itemsDisplay.value = event.query
    ? items.value.data.filter(
        (item) => item.id && item.id.toString().includes(event.query.toString()),
      )
    : items.value.data
}

async function loadData() {
  items.value = await useFetch('/data/Items')
  series.value = await useFetch('/data/Inv_series_dict')
  invInputVoltage.value = await useFetch('/data/Inv_input_voltage')
  invOutputVoltage.value = await useFetch('/data/Inv_output_voltage')
  sizes.value = await useFetch('/data/Inv_sizes')
  invBreakModule.value = await useFetch('/data/Inv_breake_module')
  invDC.value = await useFetch('/data/Inv_DC_drossel')
  invEMC.value = await useFetch('/data/Inv_EMC_drossel')
  loading.value = false
}

loadData()
</script>

<template>
  <Toast />

  <h1 class="pt-5">Преобразователь частоты. Создание</h1>
  <div v-if="loading">loading ...</div>
  <div v-else class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <AutoComplete
          v-model="item"
          dropdown
          :suggestions="itemsDisplay"
          optionLabel="id"
          placeholder="item"
          @complete="search"
          class="w-full md:w-56"
        />
        <label for="item">item</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="title" v-model="data.name" class="w-full" />
        <label for="title">Наименование</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="altern_name" v-model="data.altern_name" class="w-full" />
        <label for="altern_name">Альтернативное наименование</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Select
          v-model="invSerieData"
          :options="series.data"
          optionLabel="name"
          placeholder="Серия"
          class="w-full md:w-56"
        />
        <label for="serie">Серия</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Select
          v-model="invInputVoltageData"
          :options="invInputVoltage.data"
          optionLabel="name"
          placeholder="Входное напряжение"
          class="w-full md:w-56"
        />
        <label for="invInputVoltage">Входное напряжение</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Select
          v-model="invOutputVoltageData"
          :options="invOutputVoltage.data"
          optionLabel="name"
          placeholder="Выходное напряжение"
          class="w-full md:w-56"
        />
        <label for="invInputVoltage">Выходное напряжение</label>
      </FloatLabel>
    </div>


    <div class="field pt-5">
      <FloatLabel>
        <Select
          v-model="invSizeData"
          :options="sizes.data"
          optionLabel="name"
          placeholder="Входное напряжение"
          class="w-full md:w-56"
        />
        <label for="invInputVoltage">Размер</label>
      </FloatLabel>
    </div>

    <div class="grid pt-5">
      <div class="col">
        <label for="invInputVoltage">Тормозной модуль</label>
        <Listbox
          v-model="invBreakModuleData"
          :options="invBreakModule.data"
          optionLabel="name"
          placeholder="Тормозной модуль"
          class="w-full md:w-56"
        />
      </div>
      <div class="col">
        <label for="invInputVoltage">DC дроссель</label>
        <Listbox
          v-model="invDCdata"
          :options="invDC.data"
          optionLabel="name"
          placeholder="DC дроссель"
          class="w-full md:w-56"
        />
      </div>
      <div class="col">
        <label for="invInputVoltage">EMC дроссель</label>
        <Listbox
          v-model="invEMCdata"
          :options="invEMC.data"
          optionLabel="name"
          placeholder="EMC дроссель"
          class="w-full md:w-56"
        />
      </div>
    </div>

    <div class="grid pt-5">
      <div class="col">
        <div class="field pt-5">
          <FloatLabel>
            <InputNumber id="p_heavy_g" v-model="p_heavy_g" class="w-full" />
            <label for="p_heavy_g">p_heavy_g</label>
          </FloatLabel>
        </div>
        <div class="field pt-5">
          <FloatLabel>
            <InputNumber id="p_pumps_p" v-model="p_pumps_p" class="w-full" />
            <label for="p_pumps_p">p_pumps_p</label>
          </FloatLabel>
        </div>
      </div>
      <div class="col">
        <div class="field pt-5">
          <FloatLabel>
            <InputNumber id="current_g" v-model="current_g" class="w-full" />
            <label for="current_g">current_g</label>
          </FloatLabel>
        </div>
        <div class="field pt-5">
          <FloatLabel>
            <InputNumber id="current_p" v-model="current_p" class="w-full" />
            <label for="current_p">current_p</label>
          </FloatLabel>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/invertors/Invertors/List`" rel="noopener">
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
