<script setup lang="ts">
import { ref } from 'vue'
import type { WarrantyOptions } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Checkbox from 'primevue/checkbox'
import { insertDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'

const data = ref<WarrantyOptions>({ name: '', description: '', add_description: '', sign: '', isActive: true }) // Входы/Выходы

const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true

  const payload: WarrantyOptions = {
    name: data.value.name,
    description: data.value.description,
    add_description: data.value.add_description,
    sign: data.value.sign,
    isActive: data.value.isActive,
  }

  insertDataReductors(`/data/WarrantyOptions`, payload)
    .then((response) => {
      router.push(`/reductors/WarrantyOptions/Update/${response.data.id}`)
    })
    .catch((error) => {
      console.log(error)
    })

  saving.value = false
}
</script>

<template>
  <h1 class="pt-5">Опции гарантии. Создание</h1>
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
        <InputText id="add_description" v-model="data.add_description" class="w-full" />
        <label for="add_description">Дополнительное описание</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="Sign" v-model="data.sign" class="w-full" />
        <label for="Sign">Sign</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Checkbox id="is_active" v-model="data.isActive" :binary="true" inputId="is_active" />
        <label class="ml-3" for="is_active">Активная</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/WarrantyOptions/List`" rel="noopener">
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
