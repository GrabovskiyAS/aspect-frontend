<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument, IInvertor, IInvSerie, ISimpleDictionary } from '@/Interfaces/invertors'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Listbox from 'primevue/listbox'
import FloatLabel from 'primevue/floatlabel'
import Select from 'primevue/select'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { updateData } from '@/api/dataActionsInvertors'

const data = ref<IDocument<IInvertor>>({ data: [], error: null, loading: true })
const series = ref<IDocument<IInvSerie>>({ data: [], error: null, loading: true })
const invInputVoltage = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const invOutputVoltage = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const sizes = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const invBreakModule = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const invDC = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const invEMC = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })

const invDCdata = ref<ISimpleDictionary>({ name: '' })
const invEMCdata = ref<ISimpleDictionary>({ name: '' })
const invBreakModuleData = ref<ISimpleDictionary>({ name: '' })
const invInputVoltageData = ref<ISimpleDictionary>({ name: '' })
const invOutputVoltageData = ref<ISimpleDictionary>({ name: '' })
const invSizeData = ref<ISimpleDictionary>({ name: '' })
const invSerieData = ref<IInvSerie>()

const p_heavy_g = ref<number>(0)
const p_pumps_p = ref<number>(0)
const current_g = ref<number>(0)
const current_p = ref<number>(0)

const props = defineProps(['id'])
const saving = ref<boolean>(false)
const toast = useToast()

const submission = async () => {
  saving.value = true

  const payload: IInvertor = {
    item_name: data.value.data[0].item_name,
    name: data.value.data[0].name,
    altern_name: data.value.data[0].altern_name,
    serie_id: invSerieData.value!.id!,
    size_id: invSizeData.value.id!,
    type_of_emc_drossel_id: invEMCdata.value.id!,
    type_of_dc_drossel_id: invDCdata.value.id!,
    type_of_break_module_id: invBreakModuleData.value.id!,
    input_voltage_id: invInputVoltageData.value.id!,
    output_voltage_id: invOutputVoltageData.value.id!,
    p_heavy_g: String(p_heavy_g.value ?? ''),
    p_pumps_p: String(p_pumps_p.value ?? ''),
    current_p: String(current_p.value ?? ''),
    current_g: String(current_g.value ?? ''),
  }

  await updateData(`/data/Invertors/${props.id}`, payload)
    .then(() => {
      toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 })
    })
    .catch(function (error) {
      console.log(error)
    })
  saving.value = false
}

async function loadData() {
  data.value = await useFetch(`/data/Invertors/${props.id}`)
  series.value = await useFetch('/data/Inv_series_dict')
  invInputVoltage.value = await useFetch('/data/Inv_input_voltage')
  invOutputVoltage.value = await useFetch('/data/Inv_output_voltage')
  sizes.value = await useFetch('/data/Inv_sizes')
  invBreakModule.value = await useFetch('/data/Inv_breake_module')
  invDC.value = await useFetch('/data/Inv_DC_drossel')
  invEMC.value = await useFetch('/data/Inv_EMC_drossel')

  invSerieData.value = series.value.data.find(
    (item: IInvSerie) => item.id === data.value.data[0].serie_id,
  )

  invDCdata.value = invDC.value.data.find(
    (item) => item.id === data.value.data[0].type_of_dc_drossel_id,
  )!
  invEMCdata.value = invEMC.value.data.find(
    (item) => item.id === data.value.data[0].type_of_emc_drossel_id,
  )!
  invBreakModuleData.value = invBreakModule.value.data.find(
    (item) => item.id === data.value.data[0].type_of_break_module_id,
  )!
  invInputVoltageData.value = invInputVoltage.value.data.find(
    (item) => item.id === data.value.data[0].input_voltage_id,
  )!
  invOutputVoltageData.value = invOutputVoltage.value.data.find(
    (item) => item.id === data.value.data[0].output_voltage_id,
  )!
  invSizeData.value = sizes.value.data.find((item) => item.id === data.value.data[0].size_id)!

  p_heavy_g.value = Number(data.value.data[0].p_heavy_g)
  p_pumps_p.value = Number(data.value.data[0].p_pumps_p)
  current_g.value = Number(data.value.data[0].current_g)
  current_p.value = Number(data.value.data[0].current_p)
}

loadData()
</script>

<template>
  <Toast />

  <h1 class="pt-5">Преобразователь частоты. Редактирование</h1>
  <div v-if="data.loading">loading ...</div>
  <div v-else class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="id" v-model="data.data[0].id" disabled class="w-full" />
        <label for="id">id</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="item" v-model="data.data[0].item_name" disabled class="w-full" />
        <label for="id">item</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="title" v-model="data.data[0].name" class="w-full" />
        <label for="title">Наименование</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="altern_name" v-model="data.data[0].altern_name" class="w-full" />
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
