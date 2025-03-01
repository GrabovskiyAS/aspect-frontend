<script setup lang="ts">
import { ref } from 'vue'
import type { ItemOptions } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import { insertDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'

const data = ref<ItemOptions>({
  gear_size_list_id: 0,
  gear_type_id: 0,
  gear_option_name: '',
  oil_option_name: '',
  color_option_name: '',
  item_name: '',
})

const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true

  const payload: ItemOptions = {
    gear_size_list_id: data.value.gear_size_list_id,
    gear_type_id: data.value.gear_type_id,
    gear_option_name: data.value.gear_option_name,
    oil_option_name: data.value.oil_option_name,
    color_option_name: data.value.color_option_name,
    item_name: data.value.item_name,
  }

  insertDataReductors(`/data/ItemOptions`, payload)
    .then((response) => {
      router.push(`/reductors/ItemOptions/Update/${response.data.id}`)
    })
    .catch((error) => {
      console.log(error)
    })

  saving.value = false
}
</script>

<template>
  <h1 class="pt-5">Опции масла. Создание</h1>
  <div class="pt-5">
    <div class="field pt-5">
      <div class="field pt-5">
        <FloatLabel>
          <InputNumber id="gear_size_list_id" v-model="data.gear_size_list_id" class="w-full" />
          <label for="gear_size_list_id">gear_size_list_id</label>
        </FloatLabel>
      </div>

      <div class="field pt-5">
        <FloatLabel>
          <InputNumber id="gear_type_id" v-model="data.gear_type_id" class="w-full" />
          <label for="gear_type_id">Тип релуктора</label>
        </FloatLabel>
      </div>

      <div class="field pt-5">
        <FloatLabel>
          <InputText id="gear_option_name" v-model="data.gear_option_name" class="w-full" />
          <label for="gear_option_name">Опция </label>
        </FloatLabel>
      </div>

      <div class="field pt-5">
        <FloatLabel>
          <InputText id="oil_option_name" v-model="data.oil_option_name" class="w-full" />
          <label for="oil_option_name">oil_option_name</label>
        </FloatLabel>
      </div>

      <div class="field pt-5">
        <FloatLabel>
          <InputText id="color_option_name" v-model="data.color_option_name" class="w-full" />
          <label for="color_option_name">color_option_name</label>
        </FloatLabel>
      </div>

      <div class="field pt-5">
        <FloatLabel>
          <InputText id="item_name" v-model="data.item_name" class="w-full" />
          <label for="item_name">item_name</label>
        </FloatLabel>
      </div>

      <div class="flex flex-wrap justify-center gap-4 pt-5">
        <RouterLink :to="`/reductors/ItemOptions/List`" rel="noopener">
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
  </div>
</template>
