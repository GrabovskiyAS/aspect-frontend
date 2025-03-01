<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type {
  IDocument,
  IInvOption,
  ISimpleDictionary,
  IInvSerie,
  IInvOptionDiscount,
  IInvSerieDiscount,
} from '@/Interfaces/invertors'

import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import OverlayBadge from 'primevue/overlaybadge'
import Divider from 'primevue/divider'
import { useUserStore } from '@/stores/user'
import { useLoginStore } from '@/stores/login'
import SelectSimpleList from '../Common/SelectSimpleList.vue'
import { useFetch } from '@/api/useFetch'
import { getValueFromDictionary } from '@/api/getValueFromDictionary'
import { priceFormat } from '@/api/priceFormat'
import { saveLog } from '@/api/log'
import { addUserInvConfig } from '@/api/saveUserInvConfig'
import { getDiscountOption, getInvPrice, getOptionPrice } from '@/api/utils'
import InvertorInfoForModal from '../Invertors/InvertorInfoForModal.vue'

const user = useUserStore()
const loginModal = useLoginStore()
const router = useRouter()

const props = defineProps(['invertor', 'discontGroupId'])
const dialogOpened = defineModel<boolean>('dialogOpened')

const serie = ref<IDocument<IInvSerie>>({ data: [], error: null, loading: true }) // Серия
const options = ref<IDocument<IInvOption>>({ data: [], error: null, loading: true })
const serieDiscounts = ref<IDocument<IInvSerieDiscount>>({ data: [], error: null, loading: true }) // скидка для серий
const optionDiscounts = ref<IDocument<IInvOptionDiscount>>({ data: [], error: null, loading: true }) // скидка для опций

const submitted = ref(false)
const optionsDisplay = ref<IDocument<IInvOption>>({ data: [], error: null, loading: true })
const typeOfOptions = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const selectedOptions = ref<IInvOption[]>([])
const selectedTypeOFOptions = ref<ISimpleDictionary[]>([])
const optionsPrice = ref<number>(0) // итоговая цена выбранных опций
const optionsPriceDiscount = ref<number>(0) // итоговая цена выбранных опций со скидкой
const loading = ref<boolean>(true)

const saveUserInvConfig = async () => {
  if (user.isUser())
    addUserInvConfig(
      props.invertor,
      selectedOptions.value,
      serieDiscounts.value.data,
      optionDiscounts.value.data,
    )
      .then((id: number) => router.push(`/inv_config?id=${id}`))
      .catch(() => console.log('Конфигурация не создана'))
}

const hideDialog = () => {
  dialogOpened.value = false
  submitted.value = false
}

const loadOptionDiscounts = async () => {
  if (user.isUser() && props.invertor.id && props.discontGroupId) {
    optionDiscounts.value = await useFetch(
      `/data/InvOptionDiscount?group_id=${props.discontGroupId}`,
    )
    serieDiscounts.value = await useFetch(`/data/InvSerieDiscount?group_id=${props.discontGroupId}`)
  }
}

const loadData = async () => {
  loading.value = true
  selectedOptions.value = []
  saveLog(3, String(props.invertor.serie))

  if (props.invertor.id) {
    typeOfOptions.value = await useFetch(
      `/data/Type_of_options_for_serie?serie_id=${props.invertor.serie_id}`,
    )
    serie.value = await useFetch(`/data/Inv_series/${props.invertor.serie_id}`)
    options.value = await useFetch(`/data/Inv_options?serie_id=${props.invertor.serie_id}`)

    await loadOptionDiscounts()
    optionsDisplay.value = { ...options.value }
    loading.value = false
  }
}

watch(
  () => [props.invertor],
  () => loadData(),
) // Если загрузили с новым ПЧ, то перегружаем данные для него

// Если изменились выбранные типы опций
watch(selectedTypeOFOptions, () => {
  optionsDisplay.value.data = []
  if (selectedTypeOFOptions.value) {
    options.value.data.forEach((item: IInvOption) => {
      if (JSON.stringify(selectedTypeOFOptions.value).includes(item.option_id.toString())) {
        optionsDisplay.value.data.push(item)
      }
    })
  } else optionsDisplay.value = { ...options.value }
})

watch(selectedOptions, () => {
  // Если измелися список выбранных опций
  optionsPrice.value = 0
  optionsPriceDiscount.value = 0
  selectedOptions.value.map(
    (item) => (optionsPrice.value = optionsPrice.value + Number(item.price)),
  )

  if (user.isUser()) {
    selectedOptions.value.map(
      (item) =>
        (optionsPriceDiscount.value += Number(
          getOptionPrice(Number(item.price), item.option_id, optionDiscounts.value.data),
        )),
    )
  }
})
</script>

<template>
  <Dialog
    v-model:visible="dialogOpened"
    :style="{ width: '1280px' }"
    :header="invertor.name"
    :modal="true"
  >
    <InvertorInfoForModal :serie="serie" :invertor="invertor" :loading="loading" />
    <!-- loading -->

    <SelectSimpleList
      :url="`/data/Type_of_options_for_serie?serie_id=${props.invertor.serie_id}`"
      title="Тип опции"
      v-model="selectedTypeOFOptions"
      v-if="!loading"
    />

    <h1 class="mt-5">Опции ({{ optionsDisplay.data.length }})</h1>

    <DataTable
      v-if="!loading"
      :value="optionsDisplay.data"
      v-model:selection="selectedOptions"
      stripedRows
      tableStyle="min-width: 50rem"
    >
      <Column selectionMode="multiple" headerStyle="width: 5%"></Column>
      <Column field="name" header="Наименование" headerStyle="width: 10%"></Column>
      <Column field="full_title" header="Описание" headerStyle="width: 10%"></Column>
      <Column field="short_title" header="Доп. описание" headerStyle="width: 10%"></Column>
      <Column header="Тип" headerStyle="width: 10%">
        <template #body="{ data }" v-if="!typeOfOptions.loading">
          <span>{{ getValueFromDictionary(typeOfOptions.data, data.option_id) }} </span>
        </template>
      </Column>

      <Column header="Количество" headerStyle="width: 10%">
        <template #body="{ data }">
          <div class="font-bold text-xl w-full">{{ data.quantity }}</div>
          <div v-if="data.quantity <= 0" class="font-bold text-xl w-full">
            <Tag :value="data.waiting_period_str" severity="warn" />
          </div>
        </template>
      </Column>
      <Column header="Цена" headerStyle="width: 10%">
        <template #body="{ data }">
          <span v-if="data.price == 0"><Tag value="По запросу" severity="danger" /></span>
          <span v-else>
            <div v-if="user.isUser()">
              <OverlayBadge
                :value="`- ${getDiscountOption(data.option_id, optionDiscounts.data)} %`"
                severity="warn"
                v-if="!loading && !optionDiscounts.loading"
                class="mr-4"
              >
                <div
                  class="surface-700 text-white font-bold text-xl line-through border-round m-2 flex align-items-center justify-content-center"
                  style="min-width: 80px; min-height: 40px"
                >
                  {{ priceFormat(data.price) }} &#8381;
                </div>
              </OverlayBadge>
              <div
                class="bg-primary font-bold text-xl border-round m-2 flex align-items-center justify-content-center mr-5"
                style="min-width: 80px; min-height: 40px"
                v-if="!loading && !optionDiscounts.loading"
              >
                {{ priceFormat(getOptionPrice(data.price, data.option_id, optionDiscounts.data)) }}
                &#8381;
              </div>
            </div>
            <div v-else>
              <div
                class="font-bold text-xl border-round m-2 flex align-items-center justify-content-center"
              >
                {{ priceFormat(data.price) }} &#8381;
              </div>
            </div>
          </span>
        </template>
      </Column>
    </DataTable>

    <Divider class="mt-5" />
    <p class="font-semibold text-lg">
      Цена частотного преобразователя {{ invertor.name }}:
      <span class="font-bold text-xl" v-if="!user.isUser()">
        {{ priceFormat(invertor.price) }} &#8381;</span
      >
      <span v-else>
        <a
          class="font-bold text-xl line-through border-round m-2"
          style="min-width: 80px; min-height: 40px"
        >
          {{ priceFormat(invertor.price) }} &#8381;
        </a>
        <a
          class="bg-primary font-bold text-xl border-round p-2"
          style="min-width: 80px; min-height: 40px"
          v-if="!loading && !serieDiscounts.loading"
        >
          {{
            priceFormat(getInvPrice(Number(invertor.price), invertor.serie_id, serieDiscounts.data))
          }}
          &#8381;
        </a>
      </span>
    </p>

    <p class="font-semibold text-lg">
      Цена выбранных опций:
      <span class="font-bold text-xl" v-if="!user.isUser()">
        {{ priceFormat(optionsPrice) }} &#8381;</span
      >
      <span v-else>
        <a
          class="font-bold text-xl line-through border-round m-2"
          style="min-width: 80px; min-height: 40px"
        >
          {{ priceFormat(optionsPrice) }} &#8381;
        </a>
        <a
          class="bg-primary font-bold text-xl border-round p-2"
          style="min-width: 80px; min-height: 40px"
          v-if="!loading"
        >
          {{ priceFormat(optionsPriceDiscount) }} &#8381;
        </a>
      </span>
    </p>

    <Divider class="mt-5" />

    <p class="font-bold text-xl">
      Итого:
      <span class="font-bold text-xl" v-if="!user.isUser()">
        {{ priceFormat(Number(optionsPrice) + Number(invertor.price)) }} &#8381;</span
      >
      <span v-else>
        <a
          class="font-bold text-xl line-through border-round m-2"
          style="min-width: 80px; min-height: 40px"
        >
          {{ priceFormat(Number(optionsPrice) + Number(invertor.price)) }} &#8381;
        </a>
        <a
          class="bg-primary font-bold text-xl border-round p-2"
          style="min-width: 80px; min-height: 40px"
          v-if="!loading && !serieDiscounts.loading"
        >
          {{
            priceFormat(
              getInvPrice(Number(invertor.price), invertor.serie_id, serieDiscounts.data) +
                Number(optionsPriceDiscount),
            )
          }}
          &#8381;
        </a>
      </span>
    </p>

    <template #footer>
      <Button label="Закрыть" severity="secondary" icon="pi pi-times" text @click="hideDialog" />
      <Button
        v-if="user.isUser()"
        label="Сохранить в мои конфигурации"
        icon="pi pi-save"
        @click="saveUserInvConfig"
      />
      <Button
        v-else
        label="Для сохранения конфигурации выполните вход"
        severity="info"
        icon="pi pi-sign-in"
        @click="loginModal.visible = true"
      />
    </template>
  </Dialog>
</template>
