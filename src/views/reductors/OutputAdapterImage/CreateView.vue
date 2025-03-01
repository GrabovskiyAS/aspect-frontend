<script setup lang="ts">
import { ref } from 'vue'
import type { IOutputAdapterImage } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import { insertDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'

const data = ref<IOutputAdapterImage>({ image: '' }) // Входы/Выходы

const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true

  const payload: IOutputAdapterImage = {
    image: data.value.image,
  }

  insertDataReductors(`/data/OutputAdapterImages`, payload)
    .then((response) => {
      router.push(`/reductors/OutputAdapterImage/Update/${response.data.id}`)
    })
    .catch((error) => {
      console.log(error)
    })

  saving.value = false
}
</script>

<template>
  <h1 class="pt-5">OutputAdapterImages. Создание</h1>
  <div class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputText id="mount_position_image" v-model="data.image" class="w-full" />
        <label for="mount_position_image">Изображение</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/OutputAdapterImage/List`" rel="noopener">
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
