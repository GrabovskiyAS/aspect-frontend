<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument, IUser, ICompany, ISimpleDictionary } from '@/Interfaces/invertors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Toast from 'primevue/toast'
import Message from 'primevue/message'
import { useToast } from 'primevue/usetoast'
import Checkbox from 'primevue/checkbox'
import Password from 'primevue/password'
import Listbox from 'primevue/listbox'
import MyAutocomplete from '@/components/Common/MyAutocomplete.vue'
import { updateData } from '@/api/dataActionsInvertors'
import type { UserRedDiscount, RedDiscount } from '@/Interfaces/reductors'
import { insertDataReductors, updateDataReductors } from '@/api/dataActionsReductors'
import { roles } from '@/assets/enums'
import EnumTag from '@/components/Common/EnumTag.vue'

const props = defineProps(['id'])
const toast = useToast()
const data = ref<IDocument<IUser>>({ data: [], error: null, loading: true })
const companies = ref<IDocument<ICompany>>({ data: [], error: null, loading: true })
const invDiscountGroups = ref<IDocument<ISimpleDictionary>>({
  data: [],
  error: null,
  loading: true,
})
const redDiscountGroups = ref<IDocument<RedDiscount>>({ data: [], error: null, loading: true })
const redDiscountGroupId = ref<number>()
const userRedDiscount = ref<IDocument<UserRedDiscount>>({ data: [], error: null, loading: true })

const saving = ref<boolean>(false)
const loading = ref<boolean>(true)
const changePassword = ref<boolean>(false)
const userRoles = ref()

const submission = async () => {
  saving.value = true
  const url: string = `/data/Users/${props.id}`

  let r: string[] = []
  userRoles.value.map((item: any) => r.push(item.key))
  data.value.data[0].roles = r

  let payload: IUser;
  if (changePassword.value)
    payload = {
      username: data.value.data[0].username,
      password: data.value.data[0].password,
      first_name: data.value.data[0].first_name,
      last_name: data.value.data[0].last_name,
      email: data.value.data[0].email,
      is_active: data.value.data[0].is_active,
      discountGroupId: data.value.data[0].discountGroupId,
      companyId: data.value.data[0].companyId,
      roles: data.value.data[0].roles
    }
  else
    payload = {
      username: data.value.data[0].username,
      first_name: data.value.data[0].first_name,
      last_name: data.value.data[0].last_name,
      email: data.value.data[0].email,
      is_active: data.value.data[0].is_active,
      discountGroupId: data.value.data[0].discountGroupId,
      companyId: data.value.data[0].companyId,
      roles: data.value.data[0].roles
    }

  updateData(url, payload).then(() => {
    toast.add({
      severity: 'info',
      summary: 'Успешно',
      detail: 'Данные пользователя обновлены',
      life: 3000,
    })
  })

  if (userRedDiscount.value.data.length > 0) {
    updateDataReductors(`/data/RedUserDiscounts/${userRedDiscount.value.data[0].id}`, {
      user_id: userRedDiscount.value.data[0].user_id,
      discount_id: redDiscountGroupId.value,
    }).then(() => {
      toast.add({
        severity: 'info',
        summary: 'Успешно',
        detail: 'Группа скидок на редукторы обновлена',
        life: 3000,
      })
    })
  } else {
    insertDataReductors(`/data/RedUserDiscounts`, {
      user_id: data.value.data[0].id,
      discount_id: redDiscountGroupId.value,
    }).then(() => {
      toast.add({
        severity: 'info',
        summary: 'Успешно',
        detail: 'Группа скидок на редукторы добалена',
        life: 3000,
      })
    })
  }

  saving.value = false
}

async function loadData() {
  data.value = await useFetch(`/data/Users/${props.id}`)
  companies.value = await useFetch('/data/Companies')
  invDiscountGroups.value = await useFetch('/data/InvDiscountGroup')
  redDiscountGroups.value = await useFetch('/data/RedDiscounts', 'reductors')
  userRedDiscount.value = await useFetch(`/data/RedUserDiscounts?user_id=${props.id}`, 'reductors')

  userRoles.value = roles.filter((item) => data.value.data[0].roles!.includes(item.key) )

  loading.value = false
}

loadData()
</script>

<template>
  <Toast />

  <h1 class="pt-5">Пользователь. Редактирование</h1>
  <div v-if="loading">loading ...</div>
  <div v-else class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputText id="username" v-model="data.data[0].username" class="w-full" />
        <label for="username">Логин</label>
      </FloatLabel>
      <Message v-if="!data.data[0].username" severity="error" size="small" variant="simple">Поле не заполнено.</Message>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <Password id="password" v-model="data.data[0].password" class="w-full" :disabled="!changePassword" />
        <label for="password">Пароль</label>
      </FloatLabel>
      <div class="flex items-center gap-2">
        <Checkbox v-model="changePassword" inputId="changePassword" binary name="changePassword" value="changePassword" />
        <label for="ingredient2"> Изменить пароль </label>
    </div>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="first_name" v-model="data.data[0].first_name" class="w-full" />
        <label for="first_name">Имя</label>
      </FloatLabel>
      <Message v-if="!data.data[0].first_name" severity="error" size="small" variant="simple">Поле не заполнено.</Message>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="last_name" v-model="data.data[0].last_name" class="w-full" />
        <label for="first_name">Фамилия</label>
      </FloatLabel>
      <Message v-if="!data.data[0].last_name" severity="error" size="small" variant="simple">Поле не заполнено.</Message>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="email" v-model="data.data[0].last_name" class="w-full" />
        <label for="email">email</label>
      </FloatLabel>
      <Message v-if="!data.data[0].email" severity="error" size="small" variant="simple">Поле не заполнено.</Message>
    </div>

    <div class="card flex flex-wrap justify-center gap-4 pt-5">
      <div class="flex items-center">
        <Checkbox v-model="data.data[0].is_active" :binary="true" inputId="is_active" />
        <label for="is_active" class="ml-2">Активный</label>
      </div>
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
  </div>

    <div class="field pt-5" v-if="companies">
      <MyAutocomplete
        v-model="data.data[0].companyId"
        optionLabel="name"
        :value="data.data[0].companyId"
        :options="companies.data"
        label="Организация"
      />
      <Message v-if="!data.data[0].companyId" severity="error" size="small" variant="simple">Поле не заполнено.</Message>
    </div>

    <div class="field pt-5" v-if="invDiscountGroups">
      <MyAutocomplete
        v-model="data.data[0].discountGroupId"
        optionLabel="name"
        :value="data.data[0].discountGroupId"
        :options="invDiscountGroups.data"
        label="Группа скидок на преобразователи частоты"
      />
      <Message v-if="!data.data[0].discountGroupId" severity="error" size="small" variant="simple">Поле не заполнено.</Message>
    </div>

    <div class="field pt-5" v-if="redDiscountGroups.data">
      <MyAutocomplete
        v-model="redDiscountGroupId"
        optionLabel="name"
        :value="userRedDiscount.data[0] ? userRedDiscount.data[0].discount_id : 1"
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
