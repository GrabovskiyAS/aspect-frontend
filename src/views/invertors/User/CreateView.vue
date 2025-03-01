<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

import type { ICompany, IDocument, ISimpleDictionary, IUser } from '@/Interfaces/invertors'
import type { RedDiscount } from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Checkbox from 'primevue/checkbox'
import Password from 'primevue/password'
import Message from 'primevue/message'
import Listbox from 'primevue/listbox'
import { insertData } from '@/api/dataActionsInvertors'
import { useFetch } from '@/api/useFetch'
import MyAutocomplete from '@/components/Common/MyAutocomplete.vue'
import { insertDataReductors } from '@/api/dataActionsReductors'
import { roles } from '@/assets/enums'
import EnumTag from '@/components/Common/EnumTag.vue'

const router = useRouter()
const companies = ref<IDocument<ICompany>>({ data: [], error: null, loading: true })
const discountGroups = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const redDiscountGroups = ref<IDocument<RedDiscount>>({ data: [], error: null, loading: true })
const redDiscountGroupId = ref<number>()

const data = ref<IUser>({
  username: '',
  password: '',
  first_name: '',
  last_name: '',
  email: '',
  is_active: true,
  discountGroupId: 0,
  companyId: 0,
  roles: []
})
const saving = ref<boolean>(false)
const userRoles = ref()

const submission = async () => {
  saving.value = true
  const url: string = '/data/Users'

  let r: string[] = []
  userRoles.value.map((item: any) => r.push(item.key))
  data.value.roles = r

  const result = ref()
  await insertData(url, data.value).then((response) => result.value = response).catch((error) => console.log(error));

  await insertDataReductors(`/data/RedUserDiscounts`, {
      user_id: result.value.data.id,
      discount_id: redDiscountGroupId.value,
    }).then(() => {
      router.push(`/invertors/Users/Update/${result.value.data.id}`)
      })

  saving.value = false
}

const loadData = async () => {
  companies.value = await useFetch('/data/Companies')
  discountGroups.value = await useFetch('/data/InvDiscountGroup')
  redDiscountGroups.value = await useFetch('/data/RedDiscounts', 'reductors')

  redDiscountGroupId.value = 2//redDiscountGroups.value.data.find((item) => item.id == 2)
}

onBeforeMount(() => {
  loadData()
})
</script>

<template>
  <h1 class="pt-5">Пользователь. Создание</h1>
  <div class="field pt-5">
    <FloatLabel>
      <InputText name="username" v-model="data.username" class="w-full" />
      <label for="username">Логин</label>
    </FloatLabel>
    <Message v-if="!data.username" severity="error" size="small" variant="simple">Поле не заполнено.</Message>
  </div>

  <div class="field pt-5">
    <FloatLabel>
      <Password
        name="password"
        v-model="data.password"
        promptLabel="Укажите пароль"
        weakLabel="Слишком простой"
        mediumLabel="Средней сложности"
        strongLabel="Достаточно сложный"
        toggleMask
      />
      <label for="password">Пароль</label>
    </FloatLabel>
    <Message v-if="!data.password" severity="error" size="small" variant="simple">Поле не заполнено.</Message>
  </div>

  <div class="field pt-5">
    <FloatLabel>
      <MyAutocomplete
        :options="companies.data"
        optionLabel="name"
        v-model="data.companyId"
        v-if="companies"
      />
      <label class="ml-2">Организация</label>
    </FloatLabel>
    <Message v-if="!data.companyId" severity="error" size="small" variant="simple">Поле не заполнено.</Message>
  </div>

  <div class="field pt-5">
    <FloatLabel>
      <InputText name="first_name" v-model="data.first_name" class="w-full" />
      <label for="first_name">Имя</label>
    </FloatLabel>
    <Message v-if="!data.first_name" severity="error" size="small" variant="simple">Поле не заполнено.</Message>
  </div>

  <div class="field pt-5">
    <FloatLabel>
      <InputText name="last_name" v-model="data.last_name" class="w-full" />
      <label for="last_name">Фамилия</label>
    </FloatLabel>
    <Message v-if="!data.last_name" severity="error" size="small" variant="simple">Поле не заполнено.</Message>
  </div>

  <div class="field pt-5">
    <FloatLabel>
      <InputText name="email" v-model="data.email" class="w-full" />
      <label for="email">email</label>
    </FloatLabel>
    <Message v-if="!data.email" severity="error" size="small" variant="simple">Поле не заполнено.</Message>
  </div>

  <div class="field pt-5">
    <FloatLabel>
      <Checkbox v-model="data.is_active" :binary="true" inputId="is_active" />
      <label for="is_active" class="ml-2">Активный</label>
    </FloatLabel>
  </div>

  <div class="field pt-5" v-if="companies">
      <Listbox
        v-model="userRoles"
        :options="roles"
        multiple
        checkmark
        class="w-full md:w-56"
        listStyle="max-height:250px"
      >
      <template #option="slotProps">
        <div class="flex items-center">
          <EnumTag :enum="roles" :value="slotProps.option.key"/>
        </div>
      </template>
    </Listbox>
    <Message v-if="!userRoles" severity="error" size="small" variant="simple">Поле не заполнено.</Message>

  </div>

  <div class="field pt-5">
    <FloatLabel>
      <MyAutocomplete
        :options="discountGroups.data"
        optionLabel="name"
        v-model="data.discountGroupId"
        v-if="discountGroups"
      />
      <label class="ml-2">Группа скидок на преобразователи частоты</label>
    </FloatLabel>
    <Message v-if="!data.discountGroupId" severity="error" size="small" variant="simple">Поле не заполнено.</Message>
  </div>

  <div class="field pt-5" v-if="!redDiscountGroups.loading">
    <MyAutocomplete
      v-model="redDiscountGroupId"
      optionLabel="name"
      value="2"
      :options="redDiscountGroups.data"
      label="Накрутка на редукторы"
    />
    <Message v-if="!redDiscountGroupId" severity="error" size="small" variant="simple">Поле не заполнено.</Message>
  </div>

  <div class="flex flex-wrap justify-center gap-4 pt-5">
    <RouterLink :to="`/invertors/Users/List`" rel="noopener">
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
</template>
