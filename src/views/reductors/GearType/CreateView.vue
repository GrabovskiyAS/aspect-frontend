<script setup lang="ts">
import { ref } from 'vue'
import type { IRedGearType } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import { insertDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'

const data = ref<IRedGearType>({
  name: '',
  description: '',
  mount_position_image: '',
  image: '',
  shaft_direction_image: '',
}) // Входы/Выходы

const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true

  const payload: IRedGearType = {
    name: data.value.name,
    description: data.value.description,
    mount_position_image: data.value.mount_position_image,
    image: data.value.image,
    shaft_direction_image: data.value.shaft_direction_image,
  }

  insertDataReductors(`/data/RedGearTypes`, payload)
    .then((response) => {
      router.push(`/reductors/RedGearType/Update/${response.data.id}`)
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
        <InputText id="name" v-model="data.name" class="w-full" />
        <label for="name">Наименование</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="description" v-model="data.description" class="w-full" />
        <label for="description">Описание</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="mount_position_image" v-model="data.mount_position_image" class="w-full" />
        <label for="mount_position_image">Изображение</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/RedGearType/List`" rel="noopener">
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
