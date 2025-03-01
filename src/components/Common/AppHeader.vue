<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ref, computed, watch, onUnmounted, onMounted } from 'vue'
import Menubar from 'primevue/menubar'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import type { IMenuItem } from '@/Interfaces/invertors'
import { useLoginStore } from '@/stores/login'
import { useUnreadInvConfigs } from '@/stores/unreadInvConfig'
import { useWebSocketStore } from '@/stores/ws'
import AuthModal from './AuthModal.vue'
import { useRouter } from 'vue-router'

const user = useUserStore()
const invUnread = useUnreadInvConfigs()
const loginModal = useLoginStore()
const ws = useWebSocketStore()
const router = useRouter()

onMounted(() => invUnread.count()) // при загрузке определеяем количесвто неоткрытых конфигураций
onUnmounted(() => ws.closeConnection())
watch(
  () => [ws.message],
  () => invUnread.count(),
) // при получении сообщения определеяем количесвто неоткрытых конфигураций

const menuItems = ref<IMenuItem[]>([
  {
    label: 'Главная',
    icon: 'pi pi-home',
    route: '/',
    show: computed((): boolean => true),
    badge: 0,
    level: 1,
  },
  {
    label: 'Конфигурации',
    icon: 'pi pi-cog',
    show: computed((): boolean => user.isUser()),
    items: [
      {
        label: 'Преобразователи частоты',
        show: computed((): boolean => true),
        route: '/config',
      },
      {
        label: 'Редукторы с переходным фланцем',
        show: computed((): boolean => true),
        route: '/reductors/RedConfigs/List',
      },
    ],
    badge: computed((): number => Number(invUnread.unreadInvConfigs)),
    level: 1,
  },
  {
    label: 'Справочники',
    icon: 'pi pi-search',
    show: computed((): boolean => user.isStaff()),
    level: 1,
    items: [
      {
        label: 'Пользователи',
        icon: 'pi pi-user',
        show: computed((): boolean => true),
        route: '/invertors/Users/List',
      },
      {
        label: 'Органиазции',
        icon: 'pi pi-building',
        show: computed((): boolean => true),
        route: '/invertors/Companies/List',
      },
      {
        label: 'Журнал',
        icon: 'pi pi-book',
        show: computed((): boolean => user.isSuperadmin()),
        route: '/logs',
      },

      {
        label: 'Общие',
        icon: 'pi pi-book',
        show: computed((): boolean => user.isSuperadmin()),
        items: [
          {
            label: 'Производители',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/Manufactory/List',
          },
          {
            label: 'Типы элементов',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/TypeOfItems/List',
          },
          {
            label: 'Сроки ожидания',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/WaitingPeriod/List',
          },
          {
            label: 'Действия журналирования',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/Actions/List',
          },
          {
            label: 'Валюты',
            icon: 'pi pi-book',
            show: computed((): boolean => true),
            route: '/invertors/Currencies/List',
          },
          {
            label: 'Курсы валют',
            icon: 'pi pi-book',
            show: computed((): boolean => true),
            route: '/common/CurrencyRate/List',
          },
       ],
      },
      {
        label: 'Доставка',
        icon: 'pi pi-book',
        show: computed((): boolean => user.isSuperadmin()),
        items: [
          {
            label: 'До логистического центра в китае',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/DeliveryToChinaLogistics/List',
          },
          {
            label: 'До границы Китая',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/DeliveryToChinaBorders/List',
          },
          {
            label: 'По России',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/DeliveryRussias/List',
          },
        ],
      },
      {
        label: 'Редукторы',
        icon: 'pi pi-bolt',
        show: computed((): boolean => user.isSuperadmin()),
        items: [
          {
            label: 'FlangeDimentionImage',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/FlangeDimentionImage/List',
          },
          {
            label: 'OutputAdapterImage',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/OutputAdapterImage/List',
          },
          {
            label: 'Опции Item',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/ItemOptions/List',
          },
          {
            label: 'Опции масла',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/OilOptions/List',
          },
          {
            label: 'Опции покраски',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/ColorOptions/List',
          },
          {
            label: 'Опции редуктора',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/GearOptions/List',
          },
          {
            label: 'Опции гарантии',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/WarrantyOptions/List',
          },
          {
            label: 'RedGear',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/RedGear/List',
          },
          {
            label: 'RedGearType',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/RedGearType/List',
          },
          {
            label: 'RedMountType',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/RedMountType/List',
          },
          {
            label: 'RedMountAvalList',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/RedMountAvalList/List',
          },
          {
            label: 'RedGearSize',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/RedGearSize/List',
          },
          {
            label: 'RedItemType',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/RedItemType/List',
          },
          {
            label: 'RedGearBoxListSize',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/RedGearBoxListSize/List',
          },
          {
            label: 'RedShaftType',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/RedShaftType/List',
          },
          {
            label: 'RedShaftTypeAvalList',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/RedShaftTypeAvalList/List',
          },
          {
            label: 'RedShaftDirection',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/RedShaftDirection/List',
          },
          {
            label: 'RedShaftAvalDirection',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/RedShaftAvalDirection/List',
          },
          {
            label: 'RedRatioCode',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/RedRatioCode/List',
          },
          {
            label: 'RedGearEfficiency',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/reductors/RedGearEfficiency/List',
          },
        ],
      },
      {
        label: 'Преобразователи частоты',
        icon: 'pi pi-bolt',
        show: computed((): boolean => user.isSuperadmin()),
        items: [
          {
            label: 'Преобразователи частоты',
            icon: 'pi pi-bolt',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/Invertors/List',
          },
          {
            label: 'Опции для ПЧ',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/InvOptions/List',
          },
          {
            label: 'Элементы',
            icon: 'pi pi-objects-column',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/Items/List',
          },
          {
            label: 'Серии ПЧ',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/InvSeries/List',
          },
          {
            label: 'Входы/выходы',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/InputOutput/List',
          },
          {
            separator: true,
          },
          {
            label: 'Входные напряжения',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/InvInputVoltage/List',
          },
          {
            label: 'Типы управления',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/TypeOfControl/List',
          },
          {
            label: 'Способы управления',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/VariantsOfControl/List',
          },
          {
            label: 'Дроссели ЕМС',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/InvEMCDrossel/List',
          },
          {
            label: 'DC фильтры',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/InvDCDrossel/List',
          },
          // {
          //     label: 'Мощности',
          //     icon: '',
          //     show: computed((): boolean => true),
          //     route: '/'
          // },
          {
            label: 'Тормозные модули',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/InvBreakeModule/List',
          },
          {
            label: 'Выходные напряжения',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/InvOutputVoltage/List',
          },
          {
            label: 'Типы опций',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/InvTypeOfOptions/list',
          },
          {
            label: 'Способы управления для серии',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/InvTypeOfControls/List',
          },
          {
            label: 'Уровни защиты',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/LevelIP/List',
          },
          {
            label: 'Перегрузки',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/InvOverloads/List',
          },
          {
            label: 'Панели',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/InvTypeOfPanels/List',
          },
          {
            label: 'Допустимые температуры окружающей среды',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/AmbientTemperatures/List',
          },
          {
            label: 'Точность регулирования частоты',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/InvAccurancyFreq/List',
          },
          {
            label: 'Размеры',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/InvSizes/List',
          },
          {
            label: 'Сигналы',
            icon: 'pi pi-book',
            show: computed((): boolean => user.isSuperadmin()),
            route: '/invertors/InvTypeOfSignals/List',
          },
        ],
      },
    ],
  },
  {
    label: 'Upload',
    icon: 'pi pi-upload',
    show: computed((): boolean => user.isStaff()),
    badge: 0,
    level: 1,
    items: [
      {
        label: 'Инстарт',
        icon: '',
        show: computed((): boolean => user.isStaff()),
        route: '/upload',
      },
    ],
  },
  {
    label: 'Скидки',
    icon: 'pi pi-percentage',
    show: computed((): boolean => user.isSuperadmin()),
    badge: 0,
    level: 1,
    items: [
      {
        label: 'Преобразователи частоты',
        icon: '',
        show: computed((): boolean => user.isSuperadmin()),
        route: '/invertors/InvDiscountGroups/List',
      },
      {
        label: 'Редукторы с переходным фланцем',
        icon: '',
        show: computed((): boolean => user.isSuperadmin()),
        route: '/reductors/RedDiscount/List',
      },
    ],
  },
  {
    label: 'Контакты',
    icon: 'pi pi-envelope',
    route: '/contacts',
    show: computed((): boolean => true),
    badge: 0,
    level: 1,
  },
])
</script>

<template>
  <Menubar :model="menuItems" class="menu" style="width: 100%; border: 0">
    <template #start>
      <RouterLink to="/">
        <img src="../../assets/aspect_logo.jpg" height="48" />
      </RouterLink>
    </template>

    <template #item="{ item, props, hasSubmenu, root }">
      <template v-if="item.route">
        <router-link v-slot="{ href, navigate }" :to="item.route" custom v-if="item.show">
          <a
            v-ripple
            :href="href"
            class="flex items-center"
            v-bind="props.action"
            @click="navigate"
          >
            <span :class="item.icon" />
            <span
              v-if="item.level == 1"
              class="cursor-pointer overflow-hidden font-semibold text-lg"
              >{{ item.label }}
            </span>
            <span v-else class="ml-2">{{ item.label }} </span>
            <Badge
              v-if="item.badge"
              :class="{ 'ml-auto': !root, 'ml-2': root }"
              :value="item.badge"
            />
            <span
              v-if="item.shortcut"
              class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
              >{{ item.shortcut }}</span
            >
            <i
              v-if="hasSubmenu"
              :class="[
                'pi pi-angle-down',
                { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root },
              ]"
            ></i>
          </a>
        </router-link>
      </template>
      <template v-else>
        <a v-ripple class="flex items-center" v-bind="props.action" custom v-if="item.show">
          <span :class="item.icon" />
          <span v-if="item.level == 1" class="cursor-pointer overflow-hidden font-semibold text-lg"
            >{{ item.label }}
          </span>
          <span v-else class="ml-2">{{ item.label }} </span>
          <Badge
            v-if="item.badge"
            :class="{ 'ml-auto': !root, 'ml-2': root }"
            :value="item.badge"
          />
          <span
            v-if="item.shortcut"
            class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
            >{{ item.shortcut }}</span
          >
          <i
            v-if="hasSubmenu"
            :class="[
              'pi pi-angle-down',
              { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root },
            ]"
          ></i>
        </a>
      </template>
    </template>

    <template #end>
      <div class="flex items-center align-items-center gap-2">
        <div class="text-xl font-semibold pr-5">+7 (343) 227-07-27</div>
        <span
          v-if="user.isUser()"
          @click="
            () => {
              user.logout()
              router.push('/')
            }
          "
        >
          <span class="flex align-items-center menu-exit">
            <Button severity="contrast" class="flex align-items-center">
              <span class="pi pi-sign-in p-menuitem-icon"></span>
              <span class="ml-2 font-semibold text-lg"> {{ user.getUser().userName }} </span>
            </Button>
          </span>
        </span>
        <span v-else>
          <span class="flex align-items-center menu-exit">
            <Button
              severity="contrast"
              class="flex align-items-center"
              @click="loginModal.visible = true"
            >
              <span class="pi pi-sign-in p-menuitem-icon"></span>
              <span class="ml-2 font-semibold text-lg"> Вход </span>
            </Button>
          </span>
        </span>
      </div>
    </template>
  </Menubar>

  <template>
    <AuthModal v-if="!user.isUser()"/>
  </template>
</template>

<style scoped>
.menu {
  margin: 30px 0;
}
.menu-exit {
  cursor: pointer;
}
</style>
