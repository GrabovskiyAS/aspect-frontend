<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument, IInvAvalControl, ISimpleDictionary } from '@/Interfaces/invertors'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import FloatLabel from 'primevue/floatlabel'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import MyAutocomplete from '@/components/Common/MyAutocomplete.vue'
import { updateData } from '@/api/dataActionsInvertors'

const data = ref<IDocument<IInvAvalControl>>({ data: [], error: null, loading: true })
const series = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const controls = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const loading = ref<boolean>(true)

const serie = ref<string>('')
const control = ref<string>('')

const props = defineProps(['id'])
const saving = ref<boolean>(false)
const toast = useToast()

const submission = async () => {
  saving.value = true

  await updateData(`/data/Inv_type_of_control/${props.id}`, {
    serie_id: serie.value,
    control_id: control.value,
  })
    .then(() => {
      toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 })
    })
    .catch(function (error) {
      console.log(error)
    })
  saving.value = false
}

async function loadData() {
  data.value = await useFetch('/data/Inv_type_of_control')
  series.value = await useFetch('/data/Inv_series_dict')
  controls.value = await useFetch('/data/Variants_of_control')

  serie.value = String(data.value.data[0].serie_id)
  control.value = String(data.value.data[0].control_id)
  loading.value = false
}

loadData()
</script>

<template>
  <Toast />

  <h1 class="pt-5">Способ управления для серии. Редактирование</h1>
  <div v-if="loading">loading ...</div>
  <div v-else class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="id" v-model="data.data[0].id" disabled class="w-full" />
        <label for="id">id</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <MyAutocomplete
        :options="series.data"
        optionLabel="name"
        label="Серия"
        :value="serie"
        v-model="serie"
      />
    </div>

    <div class="field pt-5">
      <MyAutocomplete
        optionLabel="name"
        :options="controls.data"
        label="Способ управления"
        :value="control"
        v-model="control"
      />
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/invertors/InvTypeOfControls/List`" rel="noopener">
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
