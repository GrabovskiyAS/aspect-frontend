<script setup lang="ts">
import { ref, watch, onBeforeMount } from 'vue'
import type {
  IInvertor,
  ISimpleDictionary,
  IDocument,
  IInvAvalControl,
  IUser,
  IInvSerieDiscount,
} from '@/Interfaces/invertors.js'
import { useFetch } from '@/api/useFetch'
import { priceFormat } from '@/api/priceFormat'
import { useUserStore } from '@/stores/user'
import { getDiscountSerie, getInvPrice } from '@/api/utils'
import Tag from 'primevue/tag'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import OverlayBadge from 'primevue/overlaybadge'
import ProgressSpinner from 'primevue/progressspinner'
import SelectButton from 'primevue/selectbutton'
import { filterInvertors } from '@/api/filtterInvertors'
import { getValueFromDictionary } from '@/api/getValueFromDictionary'

const user = useUserStore()
const props = defineProps([
  'invInputVolage',
  'invTypeOfControl',
  'invVariantOfControl',
  'invEMC',
  'invDC',
  'invBreak',
  'power',
  'error',
])
const emit = defineEmits(['invSelected'])
const discountGroupId = defineModel<number>('discountGroupId')
const selectInv = (inv: IInvertor) => {
  emit('invSelected', inv)
}

const discontGroups = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true }) // Группы скидок. Отопбаржается только для аспекта
const discontGroupSelected = ref<ISimpleDictionary>() // Выбранная группа скидок. Отопбаржается только для аспекта
const data = ref<IDocument<IInvertor>>({ data: [], error: null, loading: true }) // Все инверторы
const dataDisplay = ref<IInvertor[]>([]) // Инверторы после фильтров
const invAvalControl = ref<IDocument<IInvAvalControl>>({ data: [], error: null, loading: true }) // способ управления для серии
const userInvDisount = ref<IDocument<IUser>>({ data: [], error: null, loading: true }) // скидка для пользователя
const serieDiscounts = ref<IDocument<IInvSerieDiscount>>({ data: [], error: null, loading: true }) // скидка для серий
const brakModule = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true }) // тормозной модуль

//------- модал выбора опций }

async function loadDiscounts() {
  if (user.isUser()) {
    userInvDisount.value = await useFetch(`/data/Users/${user.getUser().userId.value}`)
    discountGroupId.value = userInvDisount.value.data[0].discountGroupId
  }
}

async function loadData() {
  invAvalControl.value = await useFetch('/data/Inv_type_of_control')
  data.value = await useFetch('/data/Invertors')
  discontGroups.value = await useFetch('/data/InvDiscountGroup')
  brakModule.value = await useFetch('/data/Inv_breake_module')
  await loadDiscounts()
  dataDisplay.value = data.value.data
}

watch(
  () => [user.userId],
  async () => {
    await loadDiscounts()
  },
)

watch(discountGroupId, async () => {
  serieDiscounts.value = await useFetch(`/data/InvSerieDiscount?group_id=${discountGroupId.value}`)
})

watch(discontGroupSelected, () => {
  if (discontGroupSelected.value) {
    discountGroupId.value = discontGroupSelected.value.id
  }
})

watch(
  () => [
    props.invInputVolage,
    props.invTypeOfControl,
    props.invEMC,
    props.invDC,
    props.invBreak,
    props.invVariantOfControl,
    props.error,
    props.power,
  ],
  () => {
    dataDisplay.value = filterInvertors(
      data.value.data,
      invAvalControl.value.data,
      props.invInputVolage,
      props.invTypeOfControl,
      props.invVariantOfControl,
      props.invEMC,
      props.invDC,
      props.invBreak,
      props.power,
      props.error,
    )
  },
)

onBeforeMount(async () => {
  await loadData()
  dataDisplay.value = filterInvertors(
    data.value.data,
    invAvalControl.value.data,
    props.invInputVolage,
    props.invTypeOfControl,
    props.invVariantOfControl,
    props.invEMC,
    props.invDC,
    props.invBreak,
    props.power,
    props.error,
  )
})
</script>

<template>
  <div v-if="data.loading">
    <div class="card flex justify-center">
      <ProgressSpinner
        style="width: 200px; height: 200px"
        strokeWidth="8"
        fill="transparent"
        animationDuration="2s"
        aria-label="Custom ProgressSpinner"
      />
    </div>
  </div>
  <div v-else>
    <div v-if="user.isStaff()" class="mt-5">
      <h3 v-if="discontGroups.data" class="font-bold">Группа скидок</h3>
      <SelectButton
        v-model="discontGroupSelected"
        class="bg-primary"
        :options="discontGroups.data"
        optionLabel="name"
      />
    </div>
    <h1 class="mt-5 pt-5">Преобразователи частоты ({{ dataDisplay.length }})</h1>
    <div v-if="dataDisplay.length > 0">
      <DataTable
        :value="dataDisplay"
        stripedRows
        tableStyle="min-width: 50rem"
        paginator
        :rows="20"
        :rowsPerPageOptions="[10, 20, 50]"
      >
        <Column header="Модель" sortable headerStyle="width: 10em">
          <template #body="{ data }">
            <template v-if="user.isStaff()"><p class="text-500">{{ data.name }}</p></template>
            <p>{{ data.altern_name }}</p>
          </template>
        </Column>

        <Column header="Серия" sortable headerStyle="width: 3em">
          <template #body="{ data }">
            <template v-if="user.isStaff()"><p class="text-500">{{ data.serie_str }}</p></template>
            <p>{{ data.serie_altern_str }}</p>
          </template>
        </Column>

        <Column header="Мощность" headerStyle="width: 6em">
          <template #body="{ data }">
            <div class="mt-1" style="width: 100%">
              <Tag value="Pg" severity="primary" /> {{ data.p_heavy_g }} кВт
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Pp" severity="info" /> {{ data.p_pumps_p }} кВт
            </div>
          </template>
        </Column>

        <Column header="Ток" headerStyle="width: 6em">
          <template #body="{ data }">
            <div class="mt-1" style="width: 100%">
              <Tag value="Ig" severity="warn" /> {{ data.current_g }} А
            </div>
            <div class="mt-1" style="width: 100%">
              <Tag value="Ip" severity="danger" /> {{ data.current_p }} А
            </div>
          </template>
        </Column>

        <Column header="Перегрузка" headerStyle="width: 15em">
          <template #body="{ data }">
            <div class="mt-1" style="width: 100%">
              <Tag value="Режим G" severity="info" /> {{ data.overload_g_mode }}
            </div>
            <div v-if="data.overload_p_mode != 'None'" class="mt-1" style="width: 100%">
              <Tag value="Режим P" severity="info" /> {{ data.overload_p_mode }}
            </div>
          </template>
        </Column>

        <Column field="type_of_control_str" header="Управление" headerStyle="width: 10em"></Column>

        <Column header="Особенности" headerStyle="width: 15em">
          <template #body="{ data }">
            <p><Tag value="Панель" severity="info" class="mt-1"/> {{ data.type_of_panel_str }}</p>
            <p><Tag value="Тормозной модуль" severity="info"  class="mt-1"/> {{ getValueFromDictionary(brakModule.data, data.type_of_break_module_id) }}</p>
            <p><Tag value="DC дроссель" severity="info"  class="mt-1"/> {{ data.type_of_dc_drossel_str }}</p>
            <p><Tag value="EMC дроссель" severity="info"  class="mt-1"/> {{ data.type_of_emc_drossel_str }}</p>
            <p><Tag value="Степень защиты" severity="info"  class="mt-1"/> {{ data.level_IP_str }}</p>
          </template>
        </Column>
        <Column header="Количество" field="quantity" sortable headerStyle="width: 5em">
          <template #body="{ data }">
            <div class="font-bold text-xl w-full">{{ data.quantity }}</div>
            <div v-if="data.quantity <= 0" class="font-bold text-xl w-full">
              <Tag :value="data.waiting_period_str" severity="warn" />
            </div>
          </template>
        </Column>
        <Column header="Цена" field="price" sortable headerStyle="width: 8em">
          <template #body="{ data }">
            <span v-if="data.price == 0"><Tag value="По запросу" severity="danger" /></span>
            <span v-else>
              <div v-if="user.isUser()">
                <OverlayBadge
                  :value="`- ${getDiscountSerie(data.serie_id, serieDiscounts.data)} %`"
                  severity="warn"
                  v-if="!serieDiscounts.loading && !userInvDisount.loading"
                >
                  <div
                    class="surface-700 text-white font-bold text-xl line-through border-round m-2 flex align-items-center justify-content-center"
                    style="min-width: 80px; min-height: 40px"
                  >
                    {{ priceFormat(data.price) }} &#8381;
                  </div>
                </OverlayBadge>
                <div
                  class="bg-primary font-bold text-xl border-round m-2 flex align-items-center justify-content-center"
                  style="min-width: 80px; min-height: 40px"
                  v-if="!serieDiscounts.loading && !userInvDisount.loading"
                >
                  {{ priceFormat(getInvPrice(data.price, data.serie_id, serieDiscounts.data)) }}
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
        <Column header="" headerStyle="width: 5em">
          <template #body="{ data }">
            <Button label="Выбрать" severity="help" rounded class="mr-2" @click="selectInv(data)" />
          </template>
        </Column>
      </DataTable>
    </div>
    <div v-else>
      <h1>Не найдено для заданных параметров</h1>
    </div>
  </div>
</template>
