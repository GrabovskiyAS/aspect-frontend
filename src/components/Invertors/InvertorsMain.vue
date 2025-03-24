<script setup lang="ts">
import { ref } from 'vue'
import type { IInvertor, IPower, ISimpleDictionary } from '@/Interfaces/invertors'
import { saveLog } from '@/api/log'

import SelectSimpleList from '@/components/Common/SelectSimpleList.vue'
import InventorsList from '@/components/Invertors/InventorsList.vue'
import SelectPower from '@/components/Common/SelectPower.vue'
import SelectOptionsModal from '@/components/Invertors/SelectOptionsModal.vue'

const invInputVolage = ref<ISimpleDictionary[]>([])
const invTypeOfControl = ref<ISimpleDictionary[]>([])
const invVariantOfControl = ref<ISimpleDictionary[]>([])
const invEMC = ref<ISimpleDictionary[]>([])
const invDC = ref<ISimpleDictionary[]>([])
const invBreak = ref<ISimpleDictionary[]>([])
const invPower = ref<IPower>({ power: '0', error: 10 })
const discountGroupId = ref<number>(0)

const selectedInvertor = ref<IInvertor>({
  item_name: '',
  serie_id: 0,
  input_voltage_id: 0,
  size_id: 0,
  type_of_break_module_id: 0,
  type_of_dc_drossel_id: 0,
  type_of_emc_drossel_id: 0,
  name: '',
  altern_name: '',
  p_heavy_g: '',
  p_pumps_p: '',
  current_g: '',
  current_p: '',
})
const dialog = ref<boolean>(false)

const invSelected = (inv: IInvertor) => {
  selectedInvertor.value = { ...inv }
  dialog.value = true
}

saveLog(7, '')
</script>

<template>
  <div class="grid">
    <div class="col">
      <SelectPower title="Мощность" v-model:power="invPower.power" v-model:error="invPower.error" />
    </div>
    <div class="col">
      <SelectSimpleList
        url="/data/Inv_input_voltage"
        title="Входное напряжение"
        v-model="invInputVolage"
      />
    </div>
    <div class="col">
      <SelectSimpleList
        url="/data/Type_of_control"
        title="Метод управления"
        v-model="invTypeOfControl"
      />
    </div>
    <div class="col">
      <SelectSimpleList
        url="/data/Variants_of_control"
        title="Способ управления"
        v-model="invVariantOfControl"
      />
    </div>
  </div>
  <div class="grid">
    <div class="col">
      <SelectSimpleList url="/data/Inv_EMC_drossel" title="ЕМС дроссель" v-model="invEMC" />
    </div>
    <div class="col">
      <SelectSimpleList url="/data/Inv_DC_drossel" title="DC дроссель" v-model="invDC" />
    </div>
    <div class="col">
      <SelectSimpleList url="/data/Inv_breake_module" title="Тормозной модуль" v-model="invBreak" />
    </div>
  </div>

  <InventorsList
    :invInputVolage="invInputVolage"
    :invTypeOfControl="invTypeOfControl"
    :invVariantOfControl="invVariantOfControl"
    :invEMC="invEMC"
    :invDC="invDC"
    :invBreak="invBreak"
    :power="invPower.power"
    :error="invPower.error"
    v-model:discountGroupId="discountGroupId"
    @invSelected="invSelected"
  />

  <SelectOptionsModal
    v-model:dialogOpened="dialog"
    :invertor="selectedInvertor"
    :discontGroupId="discountGroupId"
  />
</template>
