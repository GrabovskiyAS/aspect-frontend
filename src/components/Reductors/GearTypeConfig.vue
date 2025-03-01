<script setup lang="ts">
import type { IRedTypeConfig, ITypeConfig } from '@/Interfaces/reductors'
import { ref, onBeforeMount, watch } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Panel from 'primevue/panel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const typeConfig = ref<ITypeConfig>({ name: '', by: '', id: 0 })
const typeConfigs = ref<ITypeConfig[]>([
  {
    name: 'Мощность подключаемого электродвигателя, кВт',
    by: 'По мощности подключаемого электродвигателя',
    id: 1,
  },
  { name: 'Выходной момент, Нм', by: 'По выходному моменту', id: 2 },
])
const configPowerValue = ref<number>(3)
const configTorqueValue = ref<number>(150)

const metaKey = ref(true)
const model = defineModel<IRedTypeConfig>()

watch(typeConfig, () => {
  if (typeConfig.value) model.value!.type = typeConfig.value.id
})

watch([configPowerValue, configTorqueValue], () => {
  if (typeConfig.value.id == 1) model.value!.value = configPowerValue.value
  else model.value!.value = configTorqueValue.value
})

onBeforeMount(() => {
  typeConfig.value = typeConfigs.value[0]
  model.value!.value = 3
})
</script>

<template>
  <Panel header="Способ выбора редуктора">
    <template v-if="model">
      <div class="field">
        <DataTable
          v-model:selection="typeConfig"
          selectionMode="single"
          :metaKeySelection="metaKey"
          dataKey="id"
          :value="typeConfigs"
        >
          <Column selectionMode="single" style="width: 5%"></Column>
          <Column header="" style="width: 95%">
            <template #body="{ data }">
              {{ data.by }}
            </template>
          </Column>
        </DataTable>
      </div>

      <div class="field mt-5" v-if="typeConfig.id == 1">
        <label for="configValue">{{ typeConfigs[0].name }}</label>

        <InputNumber
          v-model="configPowerValue"
          inputId="horizontal-buttons"
          showButtons
          buttonLayout="horizontal"
          :step="0.01"
          :min="0.12"
          :max="90"
          fluid
        >
          <template #incrementbuttonicon>
            <span class="pi pi-plus" />
          </template>
          <template #decrementbuttonicon>
            <span class="pi pi-minus" />
          </template>
        </InputNumber>
      </div>

      <div class="field mt-5" v-if="typeConfig.id == 2">
        <label for="configValue">{{ typeConfigs[1].name }}</label>

        <InputNumber
          v-model="configTorqueValue"
          inputId="horizontal-buttons"
          showButtons
          buttonLayout="horizontal"
          :step="1"
          :min="150"
          :max="58000"
          fluid
        >
          <template #incrementbuttonicon>
            <span class="pi pi-plus" />
          </template>
          <template #decrementbuttonicon>
            <span class="pi pi-minus" />
          </template>
        </InputNumber>
      </div>
    </template>
  </Panel>
</template>
