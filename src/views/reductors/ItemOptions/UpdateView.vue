<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type { ItemOptions } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'

import FloatLabel from 'primevue/floatlabel'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { updateDataReductors } from '@/api/dataActionsReductors'

const data = ref<IDocument<ItemOptions>>({ data: [], error: null, loading: true }) // Входы/Выходы
const loading = ref<boolean>(true)

const props = defineProps(['id'])
const saving = ref<boolean>(false)
const toast = useToast()

const submission = async () => {
  saving.value = true

  const payload: ItemOptions = {
    gear_size_list_id: data.value.data[0].gear_size_list_id,
    gear_type_id: data.value.data[0].gear_type_id,
    gear_option_name: data.value.data[0].gear_option_name,
    oil_option_name: data.value.data[0].oil_option_name,
    color_option_name: data.value.data[0].color_option_name,
    item_name: data.value.data[0].item_name,
  }

  updateDataReductors(`/data/ItemOptions/${props.id}`, payload)
    .then(() => {
      toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 })
    })
    .catch((error) => {
      console.log(error)
    })
  saving.value = false
}

async function loadData() {
  data.value = await useFetch(`/data/ItemOptions/${props.id}`, 'reductors')

  loading.value = false
}

onBeforeMount(async () => {
  await loadData()
})
</script>

<template>
  <Toast />

  <h1 class="pt-5">Опции Item. Редактирование</h1>
  <div v-if="loading">loading ...</div>
  <div v-else class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="id" v-model="data.data[0].id" disabled class="w-full" />
        <label for="id">id</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputNumber
          id="gear_size_list_id"
          v-model="data.data[0].gear_size_list_id"
          class="w-full"
        />
        <label for="gear_size_list_id">gear_size_list_id</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="gear_type_id" v-model="data.data[0].gear_type_id" class="w-full" />
        <label for="gear_type_id">Тип релуктора</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="gear_option_name" v-model="data.data[0].gear_option_name" class="w-full" />
        <label for="gear_option_name">Опция </label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="oil_option_name" v-model="data.data[0].oil_option_name" class="w-full" />
        <label for="oil_option_name">oil_option_name</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="color_option_name" v-model="data.data[0].color_option_name" class="w-full" />
        <label for="color_option_name">color_option_name</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="item_name" v-model="data.data[0].item_name" class="w-full" />
        <label for="item_name">item_name</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/ItemOptions/List`" rel="noopener">
        <Button link label="Отменить" />
      </RouterLink>
      <Button
        label="Сохранить"
        severity="success"
        icon="pi pi-check"
        iconPos="right"
        @click="submission"
        :loading="saving"
      />
    </div>
  </div>
</template>
