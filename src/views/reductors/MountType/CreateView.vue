<script setup lang="ts">
import { ref } from 'vue'
import type { IRedMountType } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import { insertDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'

const data = ref<IRedMountType>({
  description: '',
  image: '',
  K: '',
  C: '',
  F: '',
  S: '',
  K_figure: '',
  C_figure: '',
  F_figure: '',
  S_figure: '',
  K_data: '',
  C_data: '',
  F_data: '',
  S_data: '',
}) // Входы/Выходы

const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true

  const payload = {
    description: data.value.description,
    image: data.value.image,
    K: data.value.K,
    C: data.value.C,
    F: data.value.F,
    S: data.value.S,
  }

  insertDataReductors(`/data/RedMountTypes`, payload)
    .then((response) => {
      router.push(`/reductors/RedMountTypes/Update/${response.data.id}`)
    })
    .catch((error) => {
      console.log(error)
    })

  saving.value = false
}
</script>

<template>
  <h1 class="pt-5">RedMountTypes. Создание</h1>
  <div class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputText id="description" v-model="data.description" class="w-full" />
        <label for="description">Описание</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="mount_position_image" v-model="data.image" class="w-full" />
        <label for="mount_position_image">Изображение</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/RedMountType/List`" rel="noopener">
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
