<script setup lang="ts">
import { ref } from 'vue'
import type { IFlangeDimentionImage } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import { insertDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'

const data = ref<IFlangeDimentionImage>({ image: '', image2: '' }) // Входы/Выходы

const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true

  const payload: IFlangeDimentionImage = {
    image: data.value.image,
    image2: data.value.image2,
  }

  insertDataReductors(`/data/FlangeDimentionImages`, payload)
    .then((response) => {
      router.push(`/reductors/FlangeDimentionImage/Update/${response.data.id}`)
    })
    .catch((error) => {
      console.log(error)
    })

  saving.value = false
}
</script>

<template>
  <h1 class="pt-5">FlangeDimentionImages. Создание</h1>
  <div class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputText id="mount_position_image" v-model="data.image" class="w-full" />
        <label for="mount_position_image">Изображение</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="mount_position_image" v-model="data.image2" class="w-full" />
        <label for="mount_position_image">Изображение 2</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/FlangeDimentionImage/List`" rel="noopener">
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
