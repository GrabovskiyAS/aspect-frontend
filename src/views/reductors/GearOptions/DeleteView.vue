<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type { GearOptions } from '@/Interfaces/reductors'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import FloatLabel from 'primevue/floatlabel'
import Toast from 'primevue/toast'
import { deleteDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'

const data = ref<IDocument<GearOptions>>({ data: [], error: null, loading: true }) // Входы/Выходы
const loading = ref<boolean>(true)

const props = defineProps(['id'])
const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true

  deleteDataReductors(`/data/GearOptions/${props.id}`)
    .then(() => {
      router.push('/reductors/GearOptions/List')
    })
    .catch((error) => {
      console.log(error)
    })
  saving.value = false
}

async function loadData() {
  data.value = await useFetch(`/data/GearOptions/${props.id}`, 'reductors')
  loading.value = false
}

loadData()
</script>

<template>
  <Toast />

  <h1 class="pt-5">Опции редуктора. Удалить?</h1>
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
        <InputText id="name" v-model="data.data[0].name" disabled class="w-full" />
        <label for="name">Наименование</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="description" v-model="data.data[0].description" disabled class="w-full" />
        <label for="description">Описание</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText
          id="add_description"
          v-model="data.data[0].add_description"
          disabled
          class="w-full"
        />
        <label for="add_description">Дополнительное описание</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="Sign" v-model="data.data[0].sign" disabled class="w-full" />
        <label for="Sign">Sign</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Checkbox id="is_active" v-model="data.data[0].isActive" :binary="true" inputId="is_active" disabled/>
        <label class="ml-3" for="is_active">Активная</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/GearOptions/List`" rel="noopener">
        <Button link label="Отменить" />
      </RouterLink>
      <Button
        label="Удалить"
        severity="danger"
        icon="pi pi-check"
        iconPos="right"
        @click="submission"
        :loading="saving"
      />
    </div>
  </div>
</template>
