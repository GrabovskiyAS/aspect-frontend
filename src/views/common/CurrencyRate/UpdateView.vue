<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import type { IDocument, ISimpleDictionary } from '@/Interfaces/invertors'
import type { ICurrencyRate } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import FloatLabel from 'primevue/floatlabel'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import Toast from 'primevue/toast'
import { updateDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import type { AxiosResponse } from 'axios'
import { useFetch } from '@/api/useFetch'

const props = defineProps(['id'])
const toast = useToast()
const data = ref<IDocument<ICurrencyRate>>({data: [], error: [], loading: true})
const currencies = ref<IDocument<ISimpleDictionary>>({data: [], error: [], loading: true})
const saving = ref<boolean>(false)
const loading = ref<boolean>(true)
const currency1 = ref<ISimpleDictionary>({name: '', id: 1})
const currency2 = ref<ISimpleDictionary>({name: '', id: 1})
const router = useRouter()

const submission = async () => {
  saving.value = true

  const payload: ICurrencyRate = {
    currency1_id: currency1.value.id!,
    currency2_id: currency2.value.id!,
    date: data.value.data[0].date,
    rate: data.value.data[0].rate,
  }

  updateDataReductors(`/data/CurrencyRates/${props.id}`, payload)
    .then(() => {
      toast.add({ severity: 'info', summary: 'Успешно', detail: 'Данные обновлены', life: 3000 })
    })
    .catch((error) => {
      console.log(error)
    })
  saving.value = false
}

onBeforeMount(async () => {
    data.value = await useFetch(`/data/currencyRates/${props.id}`, 'reductors')
    currencies.value = await useFetch('/data/currencies', 'reductors')
    currency1.value = currencies.value.data.find((item) => item.id == data.value.data[0].currency1_id)!
    currency2.value = currencies.value.data.find((item) => item.id == data.value.data[0].currency2_id)!
    loading.value = false
  })

</script>

<template>
  <Toast/>
  <h1 class="pt-5">Обменный курс валют. Редактирование</h1>
  <div class="pt-5" v-if="!loading">

    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="rate" v-model="data.data[0].rate" :minFractionDigits="2" :maxFractionDigits="5" class="w-full" />
        <label for="rate">Курс</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Select id="currency1" v-model="currency1" :options="currencies.data" optionLabel="name" class="w-full" />
        <label for="currency1">Валюта 1</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Select id="currency2" v-model="currency2" :options="currencies.data" optionLabel="name" class="w-full" />
        <label for="currency2">за Валюта 2</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <DatePicker id="date" v-model="data.data[0].date" dateFormat="dd.mm.yy" class="w-full" />
        <label for="date">Дата</label>
      </FloatLabel>
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/common/CurrencyRate/List`" rel="noopener">
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
