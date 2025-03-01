<script setup lang="ts">
import { ref } from 'vue'
import type { IRedMountAvalList } from '@/Interfaces/reductors'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import { insertDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'

const data = ref<IRedMountAvalList>({ mount_types: '', description: '' }) // Входы/Выходы

const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true

  const payload: IRedMountAvalList = {
    mount_types: data.value.mount_types,
    description: data.value.description,
  }

  insertDataReductors(`/data/RedMountAvalLists`, payload)
    .then((response) => {
      router.push(`/reductors/RedMountAvalList/Update/${response.data.id}`)
    })
    .catch((error) => {
      console.log(error)
    })

  saving.value = false
}
</script>

<template>
  <h1 class="pt-5">RedMountAvalList. Создание</h1>
  <div class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputText id="mount_types" v-model="data.mount_types" class="w-full" />
        <label for="mount_types">mount_types</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="description" v-model="data.description" class="w-full" />
        <label for="description">Описание</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/RedMountAvalList/List`" rel="noopener">
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
