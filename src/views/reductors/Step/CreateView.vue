<script setup lang="ts">
import { ref } from 'vue'
import type { IRedStep } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import FloatLabel from 'primevue/floatlabel'
import { insertDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'
import type { AxiosResponse } from 'axios'

const data = ref<IRedStep>({ steps: 0, kpd: 0 })

const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true

  const payload: IRedStep = {
    steps: data.value.steps,
    kpd: data.value.kpd,
  }

  insertDataReductors(`/data/RedGearSteps`, payload)
    .then((response: AxiosResponse) => {
      router.push(`/reductors/RedGearStep/Update/${response.data.id}`)
    })
    .catch((error) => {
      console.log(error)
    })

  saving.value = false
}
</script>

<template>
  <h1 class="pt-5">RedGearTypes. Создание</h1>
  <div class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="name" v-model="data.steps" class="w-full" />
        <label for="name">steps</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="description" v-model="data.kpd" class="w-full" />
        <label for="description">kpd</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/RedGearStep/List`" rel="noopener">
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
