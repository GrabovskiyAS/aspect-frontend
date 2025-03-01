<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFetch } from '@/api/useFetch'
import type { IDocument, IUser } from '@/Interfaces/invertors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Toast from 'primevue/toast'
import Checkbox from 'primevue/checkbox'
import { deleteData } from '@/api/dataActionsInvertors'

const router = useRouter()
const data = ref<IDocument<IUser>>({ data: [], error: null, loading: true })
const props = defineProps(['id'])

const submission = async () => {
  const url: string = '/data/Users/' + props.id
  deleteData(url).then(() => {
    router.push('/invertors/Users/List')
  })
}

async function loadData() {
  data.value = await useFetch('data/Users/' + props.id)
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <Toast />

  <h1 class="pt-5">Пользователь. Удалить?</h1>
  <div v-if="data.loading">loading ...</div>
  <div v-else class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputText id="title" v-model="data.data[0].username" disabled class="w-full" />
        <label for="title">Логин</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="first_name" v-model="data.data[0].first_name" disabled class="w-full" />
        <label for="tifirst_nametle">Имя</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="last_name" v-model="data.data[0].last_name" disabled class="w-full" />
        <label for="titlast_namele">Фамилия</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="email" v-model="data.data[0].email" disabled class="w-full" />
        <label for="email">email</label>
      </FloatLabel>
    </div>

    <div class="card flex flex-wrap justify-center gap-4">
      <div class="flex items-center">
        <Checkbox v-model="data.data[0].is_active" :binary="true" disabled inputId="is_active" />
        <label for="is_active" class="ml-2">Активный</label>
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/invertors/Users/List`" rel="noopener">
        <Button link label="Отменить" />
      </RouterLink>
      <Button
        label="Удалить"
        severity="danger"
        icon="pi pi-times"
        iconPos="right"
        @click="submission"
      />
    </div>
  </div>
</template>
