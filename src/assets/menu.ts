import { ref, computed } from 'vue'
import type { IMenuItem } from '@/Interfaces/invertors'

export const menuItems = ref<IMenuItem[]>([
  {
    label: 'Главная',
    icon: 'pi pi-home',
    route: '/',
    show: computed((): boolean => true),
    badge: 0,
    level: 1,
  },
  {
    label: 'Справочники',
    icon: 'pi pi-search',
    show: computed((): boolean => true),
    level: 1,
    items: [
      {
        label: 'Преобразователи частоты',
        icon: 'pi pi-arrow-right-arrow-left',
        show: computed((): boolean => true),
        route: '/invertors/Invertors/List',
      },
      {
        label: 'Опции для ПЧ',
        icon: 'pi pi-bolt',
        show: computed((): boolean => true),
        route: '/',
      },
      {
        label: 'Элементы',
        icon: 'pi pi-objects-column',
        show: computed((): boolean => true),
        route: '/',
      },
      {
        separator: true,
      },
      {
        label: 'Серии ПЧ',
        icon: 'pi pi-pencil',
        show: computed((): boolean => true),
        route: '/invertors/InvSeries/List',
      },
      {
        label: 'Входы/выходы',
        icon: '',
        show: computed((): boolean => true),
        route: '/',
      },
      {
        label: 'Общие',
        icon: 'pi pi-book',
        show: computed((): boolean => true),
        items: [
          {
            label: 'Производители',
            icon: 'pi pi-book',
            show: computed((): boolean => true),
            route: '/invertors/Manufactory/List',
          },
          {
            label: 'Типы элементов',
            icon: 'pi pi-book',
            show: computed((): boolean => true),
            route: '/invertors/TypeOfItems/List',
          },
        ],
      },

      {
        label: 'Конфигуратор',
        icon: 'pi pi-cog',
        show: computed((): boolean => true),
        items: [
          {
            label: 'Входные напряжения',
            icon: 'pi pi-book',
            show: computed((): boolean => true),
            route: '/invertors/InvInputVoltage/List',
          },
          {
            label: 'Типы управления',
            icon: 'pi pi-book',
            show: computed((): boolean => true),
            route: '/invertors/TypeOfControl/List',
          },
          {
            label: 'Способы управления',
            icon: 'pi pi-book',
            show: computed((): boolean => true),
            route: '/invertors/VariantsOfControl/List',
          },
          {
            label: 'Дроссели ЕМС',
            icon: 'pi pi-book',
            show: computed((): boolean => true),
            route: '/invertors/InvEMCDrossel/List',
          },
          {
            label: 'DC фильтры',
            icon: 'pi pi-book',
            show: computed((): boolean => true),
            route: '/invertors/InvDCDrossel/List',
          },
          {
            label: 'Мощности',
            icon: '',
            show: computed((): boolean => true),
            route: '/',
          },
          {
            label: 'Тормозные модули',
            icon: 'pi pi-book',
            show: computed((): boolean => true),
            route: '/invertors/InvBreakeModule/List',
          },
        ],
      },
      {
        label: 'Справочники серий ПЧ',
        icon: 'pi pi-book',
        items: [
          {
            label: 'Входные напряжения',
            icon: '',
            show: computed((): boolean => true),
            route: '/',
          },
          {
            label: 'Выходные напряжения',
            icon: 'pi pi-book',
            show: computed((): boolean => true),
            route: '/invertors/InvOutputVoltage/List',
          },
          {
            label: 'Вид опции',
            icon: '',
            show: computed((): boolean => true),
            route: '/',
          },
          {
            label: 'Способы управления для серии',
            icon: '',
            show: computed((): boolean => true),
            route: '/',
          },
          {
            label: 'Уровни защиты',
            icon: 'pi pi-book',
            show: computed((): boolean => true),
            route: '/invertors/LevelIP/List',
          },
          {
            label: 'Перегрузки (переделать)',
            icon: '',
            show: computed((): boolean => true),
            route: '/invertors/InvTypeOfOverload/List',
          },
          {
            label: 'Панели',
            icon: 'pi pi-book',
            show: computed((): boolean => true),
            route: '/invertors/InvTypeOfPanels/List',
          },
          {
            label: 'Допустимые температуры окружающей среды',
            icon: 'pi pi-book',
            show: computed((): boolean => true),
            route: '/invertors/AmbientTemperatures/List',
          },
          {
            label: 'Точность регулирования частоты',
            icon: 'pi pi-book',
            show: computed((): boolean => true),
            route: '/invertors/InvAccurancyFrenq/List',
          },
          {
            label: 'Размеры (переделать)',
            icon: 'pi pi-book',
            show: computed((): boolean => true),
            route: '/invertors/InvSizes/List',
          },
          {
            label: 'Сигналы',
            icon: 'pi pi-book',
            show: computed((): boolean => true),
            route: '/invertors/InvTypeOfSignals/List',
          },
        ],
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
