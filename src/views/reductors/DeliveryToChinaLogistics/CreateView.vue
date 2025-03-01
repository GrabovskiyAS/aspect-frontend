<script setup lang="ts">
import { ref } from 'vue'
import type { ILogistic } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import { insertDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'
import type { AxiosResponse } from 'axios'

const data = ref<ILogistic>({ name: '', value: 0 })

const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true

  const payload: ILogistic = {
    name: data.value.name,
    value: data.value.value,
  }

  insertDataReductors(`/data/DeliveryToChinaLogistics`, payload)
    .then((response: AxiosResponse) => {
      router.push(`/reductors/DeliveryToChinaLogistics/Update/${response.data.id}`)
    })
    .catch((error) => {
      console.log(error)
    })

  saving.value = false
}
</script>

<template>
  <h1 class="pt-5">Доставка до логистического центра в Китае. Создание</h1>
  <div class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputText id="name" v-model="data.name" class="w-full" />
        <label for="name">Масса</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="value" v-model="data.value" class="w-full" />
        <label for="value">Цена</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/DeliveryToChinaLogistics/List`" rel="noopener">
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
