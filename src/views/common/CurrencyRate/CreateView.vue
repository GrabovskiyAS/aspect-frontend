<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import type { IDocument, ISimpleDictionary } from '@/Interfaces/invertors'
import type { ICurrencyRate } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import FloatLabel from 'primevue/floatlabel'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import { insertDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'
import type { AxiosResponse } from 'axios'
import { useFetch } from '@/api/useFetch'

const data = ref<ICurrencyRate>({ currency1_id: 1, currency2_id: 1, date: new Date(), rate: 1, })
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
    date: data.value.date,
    rate: data.value.rate,
  }

  insertDataReductors(`/data/CurrencyRates`, payload)
    .then((response: AxiosResponse) => {
      router.push(`/common/CurrencyRate/Update/${response.data.id}`)
    })
    .catch((error) => {
      console.log(error)
    })
  saving.value = false
}

onBeforeMount(async () => {
    currencies.value = await useFetch('/data/currencies', 'reductors')
    loading.value = false
  })

</script>

<template>
  <h1 class="pt-5">Обменный курс валют. Создание</h1>
  <div class="pt-5" v-if="!loading">

    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="rate" v-model="data.rate" :minFractionDigits="2" :maxFractionDigits="5" class="w-full" />
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
        <DatePicker id="date" v-model="data.date" dateFormat="dd.mm.yy" class="w-full" />
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
