<script setup lang="ts">
import type { IRedCommonData } from '@/Interfaces/reductors'
import InputNumber from 'primevue/inputnumber'
import Panel from 'primevue/panel'

const model = defineModel<IRedCommonData>()
</script>

<template>
  <Panel header="Параметры редуктора">
    <template v-if="model">
      <div class="field mt-3">
        <label for="redCommonInputSpeed">Входная скорость, об/мин</label>
        <InputNumber
          v-model="model.inputSpeed"
          inputId="horizontal-buttons"
          showButtons
          buttonLayout="horizontal"
          :step="0.25"
          :min="500"
          :max="3000"
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

      <div class="field mt-3">
        <div class="grid">
          <div class="col-8">
            <label for="redCommonOutputSpeed">Выходная скорость, об/мин </label>
            <InputNumber
              v-model="model.outputSpeed"
              inputId="horizontal-buttons"
              showButtons
              buttonLayout="horizontal"
              :step="0.25"
              :min="0.1"
              :max="1000"
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
          <div class="col-4">
            <label for="redCommonOutputSpeed">&nbsp;</label>
            <InputNumber
              v-model="model.outputSpeedError"
              inputId="horizontal-buttons"
              showButtons
              :step="1"
              :min="5"
              :max="90"
              prefix="&#177; "
              suffix=" %"
              fluid
            >
            </InputNumber>
          </div>
        </div>
      </div>

      <div class="field mt-3">
        <div class="grid">
          <div class="col-8">
            <label for="redCommonServiceFactor">Сервис фактор</label>
            <InputNumber
              v-model="model.serviceFactor"
              inputId="horizontal-buttons"
              showButtons
              buttonLayout="horizontal"
              :step="0.25"
              :min="0.4"
              :max="4"
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
          <div class="col-4">
            <label for="redCommonOutputSpeed">&nbsp;</label>
            <InputNumber
              v-model="model.serviceFactorError"
              inputId="horizontal-buttons"
              showButtons
              :step="1"
              :min="5"
              :max="90"
              prefix="&#177; "
              suffix=" %"
              fluid
            >
            </InputNumber>
          </div>
        </div>
      </div>
    </template>
  </Panel>
</template>
