<script setup lang="ts">
import { ref } from 'vue'

import GearTypeSelect from '@/components/Reductors/GearTypeSelect.vue'
import GearTypeConfig from '@/components/Reductors/GearTypeConfig.vue'
import GearCommonConfig from '@/components/Reductors/GearCommonConfig.vue'
import ReductorList from '@/components/Reductors/ReductorList.vue'
import RedModal from './RedModal.vue'
import type { IRedCommonData, IRedTypeConfig, IRedGearView } from '@/Interfaces/reductors'

const gearTypeId = ref<number>(10)
const typeConfig = ref<IRedTypeConfig>({ type: 0, value: 0 })
const commonData = ref<IRedCommonData>({
  inputSpeed: 1450,
  outputSpeed: 100,
  serviceFactor: 1.2,
  outputSpeedError: 30,
  serviceFactorError: 30,
})
const selectedRed = ref<IRedGearView>()
const discount = ref<number>(0)
const dialog = ref<boolean>(false)

const redSelected = (red: IRedGearView) => {
  selectedRed.value = { ...red }
  dialog.value = true
}
</script>

<template>
  <div class="grid">
    <div class="col-4">
      <GearTypeSelect v-model="gearTypeId" />
    </div>
    <div class="col-4">
      <GearTypeConfig v-model="typeConfig" />
    </div>
    <div class="col-4">
      <GearCommonConfig v-model="commonData" />
    </div>
  </div>

  <ReductorList
    :gearType="gearTypeId"
    :typeConfig="typeConfig"
    :commonData="commonData"
    v-model:discount="discount"
    @redSelected="redSelected"
  />

  <RedModal
    v-model:dialogOpened="dialog"
    :red="selectedRed"
    :gearType="gearTypeId"
    :typeConfig="typeConfig"
    :commonData="commonData"
    :gearTypeId="gearTypeId"
    :discount="discount"
    v-if="selectedRed"
  />
</template>
