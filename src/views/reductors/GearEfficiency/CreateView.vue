<script setup lang="ts">
import { ref } from 'vue'
import type { IRedGearEfficiency } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import FloatLabel from 'primevue/floatlabel'
import { insertDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'

const data = ref<IRedGearEfficiency>({ gear_efficiency: 0, description: '' }) // Входы/Выходы

const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true

  const payload: IRedGearEfficiency = {
    gear_efficiency: data.value.gear_efficiency,
    description: data.value.description,
  }

  insertDataReductors(`/data/RedGearEfficiencies`, payload)
    .then((response) => {
      router.push(`/reductors/RedGearEfficiency/Update/${response.data.id}`)
    })
    .catch((error) => {
      console.log(error)
    })

  saving.value = false
}
</script>

<template>
  <h1 class="pt-5">RedGearEfficiencys. Создание</h1>
  <div class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="name" v-model="data.gear_efficiency" class="w-full" />
        <label for="name">gear_efficiency</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="description" v-model="data.description" class="w-full" />
        <label for="description">Описание</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/RedGearEfficiency/List`" rel="noopener">
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
