<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument, IInvOverload } from '@/Interfaces/invertors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import FloatLabel from 'primevue/floatlabel'
import Toast from 'primevue/toast'
import { useRouter } from 'vue-router'
import { deleteData } from '@/api/dataActionsInvertors'

const router = useRouter()
const data = ref<IDocument<IInvOverload>>({ data: [], error: null, loading: true })
const props = defineProps(['id'])

const submission = async () => {
  const url: string = `/data/Inv_type_of_overload/${props.id}`
  deleteData(url).then(() => {
    router.push('/invertors/InvOverloads/List')
  })
}

async function loadData() {
  data.value = await useFetch(`/data/Inv_type_of_overload/${props.id}`)
}

loadData()
</script>

<template>
  <Toast />

  <h1 class="pt-5">Перегрузка. Удалить?</h1>
  <div v-if="data.loading">loading ...</div>
  <div v-else class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="id" v-model="data.data[0].id" disabled class="w-full" />
        <label for="id">id</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="item" v-model="data.data[0].g_mode" disabled class="w-full" />
        <label for="id">Режим G</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="title" v-model="data.data[0].p_mode" disabled class="w-full" />
        <label for="title">Режим P</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/invertors/InvOverloads/List`" rel="noopener">
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
