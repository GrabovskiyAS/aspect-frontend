<script setup lang="ts">
import { ref } from 'vue'

import Stepper from 'primevue/stepper'
import StepItem from 'primevue/stepitem'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import Button from 'primevue/button'
import GearTypeSelect from '@/components/Reductors/GearTypeSelect.vue'
import GearTypeConfig from '@/components/Reductors/GearTypeConfig.vue'
import GearCommonConfig from '@/components/Reductors/GearCommonConfig.vue'
import ReductorList from '@/components/Reductors/ReductorList.vue'
import MountingPositionSelect from '@/components/Reductors/MountingPositionSelect.vue'
import MountType from '@/components/Reductors/MountType.vue'
import ShaftSelect from '@/components/Reductors/ShaftSelect.vue'
import type { IRedCommonData, IRedTypeConfig, IShaft } from '@/Interfaces/reductors'

const gearTypeId = ref<number>(0)
const typeConfig = ref<IRedTypeConfig>({ type: 0, value: 0 })
const commonData = ref<IRedCommonData>({
  inputSpeed: 500,
  outputSpeed: 0.1,
  serviceFactor: 0.4,
  outputSpeedError: 5,
  serviceFactorError: 5,
})
const selectedRed = ref<number>(0)
const mountPosition = ref<number>(0)
const mountType = ref<number>(0)
const shaft = ref<IShaft>({ type: 0, direction: 0 })
</script>

<template>
  <Stepper value="1">
    <StepItem value="1">
      <Step>Выбор типа редуктора</Step>
      <StepPanel v-slot="{ activateCallback }">
        <GearTypeSelect v-model="gearTypeId" />

        <div class="py-6">
          <Button label="Дальше" @click="activateCallback('2')" v-if="gearTypeId" />
        </div>
      </StepPanel>
    </StepItem>

    <StepItem value="2">
      <Step>Способ выбора редуктора</Step>
      <StepPanel v-slot="{ activateCallback }">
        <GearTypeConfig v-model="typeConfig" />

        <div class="flex py-6 gap-2">
          <Button label="Назад" severity="secondary" @click="activateCallback('1')" />
          <Button label="Дальше" @click="activateCallback('3')" />
        </div>
      </StepPanel>
    </StepItem>

    <StepItem value="3">
      <Step>Параметры редуктора</Step>
      <StepPanel v-slot="{ activateCallback }">
        <GearCommonConfig v-model="commonData" />

        <div class="flex py-6 gap-2">
          <Button label="Назад" severity="secondary" @click="activateCallback('2')" />
          <Button label="Дальше" @click="activateCallback('4')" />
        </div>
      </StepPanel>
    </StepItem>

    <StepItem value="4">
      <Step>Выбор редуктора</Step>
      <StepPanel v-slot="{ activateCallback }">
        <ReductorList
          :gearType="gearTypeId"
          :typeConfig="typeConfig"
          :commonData="commonData"
          v-model="selectedRed"
        />

        <div class="flex py-6 gap-2">
          <Button label="Назад" severity="secondary" @click="activateCallback('3')" />
          <Button label="Дальше" @click="activateCallback('5')" />
        </div>
      </StepPanel>
    </StepItem>

    <StepItem value="5">
      <Step>Монтажное положение</Step>
      <StepPanel v-slot="{ activateCallback }">
        <MountingPositionSelect v-model="mountPosition" />

        <div class="flex py-6 gap-2">
          <Button label="Назад" severity="secondary" @click="activateCallback('4')" />
          <Button label="Дальше" @click="activateCallback('6')" />
        </div>
      </StepPanel>
    </StepItem>

    <StepItem value="6">
      <Step>Способ монтажа</Step>
      <StepPanel v-slot="{ activateCallback }">
        <MountType v-model="mountType" />

        <div class="flex py-6 gap-2">
          <Button label="Назад" severity="secondary" @click="activateCallback('5')" />
          <Button label="Дальше" @click="activateCallback('7')" />
        </div>
      </StepPanel>
    </StepItem>

    <StepItem value="7">
      <Step>Вал</Step>
      <StepPanel v-slot="{ activateCallback }">
        <ShaftSelect v-model="shaft" />

        <div class="flex py-6 gap-2">
          <Button label="Назад" severity="secondary" @click="activateCallback('6')" />
          <Button label="Дальше" @click="activateCallback('8')" />
        </div>
      </StepPanel>
    </StepItem>

    <StepItem value="8">
      <Step>Переходный фланец</Step>
      <StepPanel v-slot="{ activateCallback }">
        <div class="flex flex-col h-48">
          <div
            class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
          >
            Content II
          </div>
        </div>
        <div class="flex py-6 gap-2">
          <Button label="Назад" severity="secondary" @click="activateCallback('7')" />
        </div>
      </StepPanel>
    </StepItem>
  </Stepper>
</template>
