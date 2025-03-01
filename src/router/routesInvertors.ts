export const routesInvertors = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: 'Аспект. Конфигуратор',
    },
    component: () => import('../views/MainView.vue'),
  },
  {
    path: '/express',
    name: 'express',
    component: () => import('../views/ExpressVue.vue'),
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: () => import('../views/ContactsView.vue'),
  },
  {
    path: '/config',
    name: 'config',
    component: () => import('../views/invertors/UserInvConfigs/ListView.vue'),
  },
  {
    path: '/logs',
    name: 'logs',
    component: () => import('../views/LogsView.vue'),
  },

  {
    path: '/inv_config',
    name: 'inv_config',
    component: () => import('../views/invertors/UserInvConfigs/PlainView.vue'),
  },

  {
    path: '/upload',
    name: 'upload',
    component: () => import('../views/ParseXSLX.vue'),
  },

  // ######################### справочники #########################
  // ------------------------- входные напряижения -----------------
  {
    path: '/invertors/InvInputVoltage/List',
    name: 'InvInputVoltageList',
    component: () => import('../views/invertors/InvInputVoltage/ListView.vue'),
  },
  {
    path: '/invertors/InvInputVoltage/Update/:id',
    name: 'InvInputVoltageUpdate',
    component: () => import('../views/invertors/InvInputVoltage/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/InvInputVoltage/Create',
    name: 'InvInputVoltageCreate',
    component: () => import('../views/invertors/InvInputVoltage/CreateView.vue'),
  },
  {
    path: '/invertors/InvInputVoltage/Delete/:id',
    name: 'InvInputVoltageDelete',
    component: () => import('../views/invertors/InvInputVoltage/DeleteView.vue'),
    props: true,
  },
  // ------------------------- выходные напряижения -----------------
  {
    path: '/invertors/InvOutputVoltage/List',
    name: 'InvOutputVoltageList',
    component: () => import('../views/invertors/InvOutputVoltage/ListView.vue'),
  },
  {
    path: '/invertors/InvOutputVoltage/Update/:id',
    name: 'InvOutputVoltageUpdate',
    component: () => import('../views/invertors/InvOutputVoltage/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/InvOutputVoltage/Create',
    name: 'InvOutputVoltageCreate',
    component: () => import('../views/invertors/InvOutputVoltage/CreateView.vue'),
  },
  {
    path: '/invertors/InvOutputVoltage/Delete/:id',
    name: 'InvOutputVoltageDelete',
    component: () => import('../views/invertors/InvOutputVoltage/DeleteView.vue'),
    props: true,
  },
  // ------------------------- Валюты -----------------
  {
    path: '/invertors/Currencies/List',
    name: 'CurrenciesList',
    component: () => import('../views/invertors/Currencies/ListView.vue'),
  },
  {
    path: '/invertors/Currencies/Update/:id',
    name: 'CurrenciesyUpdate',
    component: () => import('../views/invertors/Currencies/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/Currencies/Create',
    name: 'CurrenciesCreate',
    component: () => import('../views/invertors/Currencies/CreateView.vue'),
  },
  {
    path: '/invertors/Currencies/Delete/:id',
    name: 'CurrenciesDelete',
    component: () => import('../views/invertors/Currencies/DeleteView.vue'),
    props: true,
  },
  // ------------------------- Производители -----------------
  {
    path: '/invertors/Manufactory/List',
    name: 'ManufactoryList',
    component: () => import('../views/invertors/Manufactory/ListView.vue'),
  },
  {
    path: '/invertors/Manufactory/Update/:id',
    name: 'ManufactoryUpdate',
    component: () => import('../views/invertors/Manufactory/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/Manufactory/Create',
    name: 'ManufactoryCreate',
    component: () => import('../views/invertors/Manufactory/CreateView.vue'),
  },
  {
    path: '/invertors/Manufactory/Delete/:id',
    name: 'ManufactoryDelete',
    component: () => import('../views/invertors/Manufactory/DeleteView.vue'),
    props: true,
  },
  // ------------------------- Уровни защиты -----------------
  {
    path: '/invertors/LevelIP/List',
    name: 'LevelIPList',
    component: () => import('../views/invertors/LevelIP/ListView.vue'),
  },
  {
    path: '/invertors/LevelIP/Update/:id',
    name: 'LevelIPUpdate',
    component: () => import('../views/invertors/LevelIP/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/LevelIP/Create',
    name: 'LevelIPCreate',
    component: () => import('../views/invertors/LevelIP/CreateView.vue'),
  },
  {
    path: '/invertors/LevelIP/Delete/:id',
    name: 'LevelIPDelete',
    component: () => import('../views/invertors/LevelIP/DeleteView.vue'),
    props: true,
  },
  // ------------------------- Панели -----------------
  {
    path: '/invertors/InvTypeOfPanels/List',
    name: 'InvTypeOfPanelsList',
    component: () => import('../views/invertors/InvTypeOfPanels/ListView.vue'),
  },
  {
    path: '/invertors/InvTypeOfPanels/Update/:id',
    name: 'InvTypeOfPanelsUpdate',
    component: () => import('../views/invertors/InvTypeOfPanels/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/InvTypeOfPanels/Create',
    name: 'InvTypeOfPanelsCreate',
    component: () => import('../views/invertors/InvTypeOfPanels/CreateView.vue'),
  },
  {
    path: '/invertors/InvTypeOfPanels/Delete/:id',
    name: 'InvTypeOfPanelsDelete',
    component: () => import('../views/invertors/InvTypeOfPanels/DeleteView.vue'),
    props: true,
  },
  // ------------------------- Сигналы -----------------
  {
    path: '/invertors/InvTypeOfSignals/List',
    name: 'InvTypeOfSignalsList',
    component: () => import('../views/invertors/InvTypeOfSignals/ListView.vue'),
  },
  {
    path: '/invertors/InvTypeOfSignals/Update/:id',
    name: 'InvTypeOfSignalsUpdate',
    component: () => import('../views/invertors/InvTypeOfSignals/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/InvTypeOfSignals/Create',
    name: 'InvTypeOfSignalsCreate',
    component: () => import('../views/invertors/InvTypeOfSignals/CreateView.vue'),
  },
  {
    path: '/invertors/InvTypeOfSignals/Delete/:id',
    name: 'InvTypeOfSignalsDelete',
    component: () => import('../views/invertors/InvTypeOfSignals/DeleteView.vue'),
    props: true,
  },
  // ------------------------- Темпаратура окружающей среды -----------------
  {
    path: '/invertors/AmbientTemperatures/List',
    name: 'AmbientTemperaturesList',
    component: () => import('../views/invertors/AmbientTemperatures/ListView.vue'),
  },
  {
    path: '/invertors/AmbientTemperatures/Update/:id',
    name: 'AmbientTemperaturesUpdate',
    component: () => import('../views/invertors/AmbientTemperatures/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/AmbientTemperatures/Create',
    name: 'AmbientTemperaturesCreate',
    component: () => import('../views/invertors/AmbientTemperatures/CreateView.vue'),
  },
  {
    path: '/invertors/AmbientTemperatures/Delete/:id',
    name: 'AmbientTemperaturesDelete',
    component: () => import('../views/invertors/AmbientTemperatures/DeleteView.vue'),
    props: true,
  },
  // ------------------------- Точность регулирования частоты -----------------
  {
    path: '/invertors/InvAccurancyFreq/List',
    name: 'InvAccurancyFreqList',
    component: () => import('../views/invertors/InvAccurancyFreq/ListView.vue'),
  },
  {
    path: '/invertors/InvAccurancyFreq/Update/:id',
    name: 'InvAccurancyFreqUpdate',
    component: () => import('../views/invertors/InvAccurancyFreq/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/InvAccurancyFreq/Create',
    name: 'InvAccurancyFreqCreate',
    component: () => import('../views/invertors/InvAccurancyFreq/CreateView.vue'),
  },
  {
    path: '/invertors/InvAccurancyFreq/Delete/:id',
    name: 'InvAccurancyFreqDelete',
    component: () => import('../views/invertors/InvAccurancyFreq/DeleteView.vue'),
    props: true,
  },
  // ------------------------- Тип управления -----------------
  {
    path: '/invertors/TypeOfControl/List',
    name: 'TypeOfControlList',
    component: () => import('../views/invertors/TypeOfControl/ListView.vue'),
  },
  {
    path: '/invertors/TypeOfControl/Update/:id',
    name: 'TypeOfControlUpdate',
    component: () => import('../views/invertors/TypeOfControl/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/TypeOfControl/Create',
    name: 'TypeOfControlCreate',
    component: () => import('../views/invertors/TypeOfControl/CreateView.vue'),
  },
  {
    path: '/invertors/TypeOfControl/Delete/:id',
    name: 'TypeOfControlDelete',
    component: () => import('../views/invertors/TypeOfControl/DeleteView.vue'),
    props: true,
  },
  // ------------------------- Способ управления -----------------
  {
    path: '/invertors/VariantsOfControl/List',
    name: 'VariantsOfControlList',
    component: () => import('../views/invertors/VariantsOfControl/ListView.vue'),
  },
  {
    path: '/invertors/VariantsOfControl/Update/:id',
    name: 'VariantsOfControlUpdate',
    component: () => import('../views/invertors/VariantsOfControl/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/VariantsOfControl/Create',
    name: 'VariantsOfControlCreate',
    component: () => import('../views/invertors/VariantsOfControl/CreateView.vue'),
  },
  {
    path: '/invertors/VariantsOfControl/Delete/:id',
    name: 'VariantsOfControlDelete',
    component: () => import('../views/invertors/VariantsOfControl/DeleteView.vue'),
    props: true,
  },
  // ------------------------- Тормозные модули -----------------
  {
    path: '/invertors/InvBreakeModule/List',
    name: 'InvBreakeModuleList',
    component: () => import('../views/invertors/InvBreakeModule/ListView.vue'),
  },
  {
    path: '/invertors/InvBreakeModule/Update/:id',
    name: 'InvBreakeModuleUpdate',
    component: () => import('../views/invertors/InvBreakeModule/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/InvBreakeModule/Create',
    name: 'InvBreakeModuleCreate',
    component: () => import('../views/invertors/InvBreakeModule/CreateView.vue'),
  },
  {
    path: '/invertors/InvBreakeModule/Delete/:id',
    name: 'InvBreakeModuleDelete',
    component: () => import('../views/invertors/InvBreakeModule/DeleteView.vue'),
    props: true,
  },
  // ------------------------- DC дроссели -----------------
  {
    path: '/invertors/InvDCDrossel/List',
    name: 'InvDCDrosselList',
    component: () => import('../views/invertors/InvDCDrossel/ListView.vue'),
  },
  {
    path: '/invertors/InvDCDrossel/Update/:id',
    name: 'InvDCDrosselUpdate',
    component: () => import('../views/invertors/InvDCDrossel/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/InvDCDrossel/Create',
    name: 'InvDCDrosselCreate',
    component: () => import('../views/invertors/InvDCDrossel/CreateView.vue'),
  },
  {
    path: '/invertors/InvDCDrossel/Delete/:id',
    name: 'InvDCDrosselDelete',
    component: () => import('../views/invertors/InvDCDrossel/DeleteView.vue'),
    props: true,
  },
  // ------------------------- EMC дроссели -----------------
  {
    path: '/invertors/InvEMCDrossel/List',
    name: 'InvEMCDrosselList',
    component: () => import('../views/invertors/InvEMCDrossel/ListView.vue'),
  },
  {
    path: '/invertors/InvEMCDrossel/Update/:id',
    name: 'InvEMCDrosselUpdate',
    component: () => import('../views/invertors/InvEMCDrossel/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/InvEMCDrossel/Create',
    name: 'InvEMCDrosselCreate',
    component: () => import('../views/invertors/InvEMCDrossel/CreateView.vue'),
  },
  {
    path: '/invertors/InvEMCDrossel/Delete/:id',
    name: 'InvEMCDrosselDelete',
    component: () => import('../views/invertors/InvEMCDrossel/DeleteView.vue'),
    props: true,
  },
  // ------------------------- Размеры инвероторов -----------------
  {
    path: '/invertors/InvSizes/List',
    name: 'InvSizesList',
    component: () => import('../views/invertors/InvSizes/ListView.vue'),
  },
  {
    path: '/invertors/InvSizes/Update/:id',
    name: 'InvSizesUpdate',
    component: () => import('../views/invertors/InvSizes/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/InvSizes/Create',
    name: 'InvSizesCreate',
    component: () => import('../views/invertors/InvSizes/CreateView.vue'),
  },
  {
    path: '/invertors/InvSizes/Delete/:id',
    name: 'InvSizesDelete',
    component: () => import('../views/invertors/InvSizes/DeleteView.vue'),
    props: true,
  },
  // ------------------------- Типы элементов -----------------
  {
    path: '/invertors/TypeOfItems/List',
    name: 'TypeOfItemsList',
    component: () => import('../views/invertors/TypeOfItems/ListView.vue'),
  },
  {
    path: '/invertors/TypeOfItems/Update/:id',
    name: 'TypeOfItemsUpdate',
    component: () => import('../views/invertors/TypeOfItems/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/TypeOfItems/Create',
    name: 'TypeOfItemsCreate',
    component: () => import('../views/invertors/TypeOfItems/CreateView.vue'),
  },
  {
    path: '/invertors/TypeOfItems/Delete/:id',
    name: 'TypeOfItemsDelete',
    component: () => import('../views/invertors/TypeOfItems/DeleteView.vue'),
    props: true,
  },
  // ------------------------- Инверторы -----------------
  {
    path: '/invertors/Invertors/List',
    name: 'InvertorsList',
    component: () => import('../views/invertors/Invertors/ListView.vue'),
  },
  {
    path: '/invertors/Invertors/Update/:id',
    name: 'InvertorsUpdate',
    component: () => import('../views/invertors/Invertors/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/Invertors/Create',
    name: 'InvertorsCreate',
    component: () => import('../views/invertors/Invertors/CreateView.vue'),
  },
  {
    path: '/invertors/Invertors/Delete/:id',
    name: 'InvertorsDelete',
    component: () => import('../views/invertors/Invertors/DeleteView.vue'),
    props: true,
  },
  // ------------------------- Серии инверторов -----------------
  {
    path: '/invertors/InvSeries/List',
    name: 'InvSeriesList',
    component: () => import('../views/invertors/InvSeries/ListView.vue'),
  },
  {
    path: '/invertors/InvSeries/Update/:id',
    name: 'InvSeriesUpdate',
    component: () => import('../views/invertors/InvSeries/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/InvSeries/Create',
    name: 'InvSeriesCreate',
    component: () => import('../views/invertors/InvSeries/CreateView.vue'),
  },
  {
    path: '/invertors/InvSeries/Delete/:id',
    name: 'InvSeriesDelete',
    component: () => import('../views/invertors/InvSeries/DeleteView.vue'),
    props: true,
  },

  // ------------------------- Опции инверторов -----------------
  {
    path: '/invertors/InvOptions/List',
    name: 'InvOptionsList',
    component: () => import('../views/invertors/InvOptions/ListView.vue'),
  },
  {
    path: '/invertors/InvOptions/Update/:id',
    name: 'InvOptionsUpdate',
    component: () => import('../views/invertors/InvOptions/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/InvOptions/Create',
    name: 'InvOptionsCreate',
    component: () => import('../views/invertors/InvOptions/CreateView.vue'),
  },
  {
    path: '/invertors/InvOptions/Delete/:id',
    name: 'InvOptionsDelete',
    component: () => import('../views/invertors/InvOptions/DeleteView.vue'),
    props: true,
  },
  // ------------------------- Items -----------------
  {
    path: '/invertors/Items/List',
    name: 'ItemsList',
    component: () => import('../views/invertors/Items/ListView.vue'),
  },
  // ------------------------- Сроки ожидания -----------------
  {
    path: '/invertors/WaitingPeriod/List',
    name: 'WaitingPeriodList',
    component: () => import('../views/invertors/WaitingPeriod/ListView.vue'),
  },
  {
    path: '/invertors/WaitingPeriod/Update/:id',
    name: 'WaitingPeriodUpdate',
    component: () => import('../views/invertors/WaitingPeriod/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/WaitingPeriod/Create',
    name: 'WaitingPeriodCreate',
    component: () => import('../views/invertors/WaitingPeriod/CreateView.vue'),
  },
  {
    path: '/invertors/WaitingPeriod/Delete/:id',
    name: 'WaitingPeriodDelete',
    component: () => import('../views/invertors/WaitingPeriod/DeleteView.vue'),
    props: true,
  },
  // ------------------------- Управление Вход/выход -----------------
  {
    path: '/invertors/InputOutput/List',
    name: 'InputOutputList',
    component: () => import('../views/invertors/InputOutput/ListView.vue'),
  },
  {
    path: '/invertors/InputOutput/Update/:id',
    name: 'InputOutputUpdate',
    component: () => import('../views/invertors/InputOutput/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/InputOutput/Create',
    name: 'InputOutputCreate',
    component: () => import('../views/invertors/InputOutput/CreateView.vue'),
  },
  {
    path: '/invertors/InputOutput/Delete/:id',
    name: 'InputOutputDelete',
    component: () => import('../views/invertors/InputOutput/DeleteView.vue'),
    props: true,
  },

  // ------------------------- Типы опций -----------------
  {
    path: '/invertors/InvTypeOfOptions/List',
    name: 'InvTypeOfOptionsList',
    component: () => import('../views/invertors/InvTypeOfOptions/ListView.vue'),
  },
  {
    path: '/invertors/InvTypeOfOptions/Update/:id',
    name: 'InvTypeOfOptionsUpdate',
    component: () => import('../views/invertors/InvTypeOfOptions/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/InvTypeOfOptions/Create',
    name: 'InvTypeOfOptionsCreate',
    component: () => import('../views/invertors/InvTypeOfOptions/CreateView.vue'),
  },
  {
    path: '/invertors/InvTypeOfOptions/Delete/:id',
    name: 'InvTypeOfOptionsDelete',
    component: () => import('../views/invertors/InvTypeOfOptions/DeleteView.vue'),
    props: true,
  },

  // ------------------------- Перегрузки -----------------
  {
    path: '/invertors/InvOverloads/List',
    name: 'InvOverloadsList',
    component: () => import('../views/invertors/InvOverloads/ListView.vue'),
  },
  {
    path: '/invertors/InvOverloads/Update/:id',
    name: 'InvOverloadsUpdate',
    component: () => import('../views/invertors/InvOverloads/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/InvOverloads/Create',
    name: 'InvOverloadsCreate',
    component: () => import('../views/invertors/InvOverloads/CreateView.vue'),
  },
  {
    path: '/invertors/InvOverloads/Delete/:id',
    name: 'InvOverloadsDelete',
    component: () => import('../views/invertors/InvOverloads/DeleteView.vue'),
    props: true,
  },

  // ------------------------- Способы управления для серии -----------------
  {
    path: '/invertors/InvTypeOfControls/List',
    name: 'InvTypeOfControlsList',
    component: () => import('../views/invertors/InvTypeOfControls/ListView.vue'),
  },
  {
    path: '/invertors/InvTypeOfControls/Update/:id',
    name: 'InvTypeOfControlsUpdate',
    component: () => import('../views/invertors/InvTypeOfControls/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/InvTypeOfControls/Create',
    name: 'InvTypeOfControlsCreate',
    component: () => import('../views/invertors/InvTypeOfControls/CreateView.vue'),
  },
  {
    path: '/invertors/InvTypeOfControls/Delete/:id',
    name: 'InvTypeOfControlsDelete',
    component: () => import('../views/invertors/InvTypeOfControls/DeleteView.vue'),
    props: true,
  },

  // ------------------------- Действия логирования -----------------
  {
    path: '/invertors/Actions/List',
    name: 'ActionsList',
    component: () => import('../views/invertors/Actions/ListView.vue'),
  },
  {
    path: '/invertors/Actions/Update/:id',
    name: 'ActionsUpdate',
    component: () => import('../views/invertors/Actions/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/Actions/Create',
    name: 'ActionsCreate',
    component: () => import('../views/invertors/Actions/CreateView.vue'),
  },
  {
    path: '/invertors/Actions/Delete/:id',
    name: 'ActionsDelete',
    component: () => import('../views/invertors/Actions/DeleteView.vue'),
    props: true,
  },

  // ------------------------- Организации -----------------
  {
    path: '/invertors/Companies/List',
    name: 'CompaniesList',
    component: () => import('../views/invertors/Companies/ListView.vue'),
  },
  {
    path: '/invertors/Companies/Update/:id',
    name: 'CompaniesUpdate',
    component: () => import('../views/invertors/Companies/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/Companies/Create',
    name: 'CompaniesCreate',
    component: () => import('../views/invertors/Companies/CreateView.vue'),
  },
  {
    path: '/invertors/Companies/Delete/:id',
    name: 'CompaniesDelete',
    component: () => import('../views/invertors/Companies/DeleteView.vue'),
    props: true,
  },

  // ------------------------- Пользователи -----------------
  {
    path: '/invertors/Users/List',
    name: 'UsersList',
    component: () => import('../views/invertors/User/ListView.vue'),
  },
  {
    path: '/invertors/Users/Update/:id',
    name: 'UsersUpdate',
    component: () => import('../views/invertors/User/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/Users/Create',
    name: 'UsersCreate',
    component: () => import('../views/invertors/User/CreateView.vue'),
  },
  {
    path: '/invertors/Users/Delete/:id',
    name: 'UsersDelete',
    component: () => import('../views/invertors/User/DeleteView.vue'),
    props: true,
  },

  // -----------------------------------------------------------------------------------------------------------
  // ------------------------------------------ Скидки ---------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------

  // ------------------------- Группы скидок -----------------
  {
    path: '/invertors/InvDiscountGroups/List',
    name: 'invDiscountGroupList',
    component: () => import('../views/invertors/InvDiscountGroups/ListView.vue'),
  },
  {
    path: '/invertors/InvDiscountGroups/Update/:id',
    name: 'invDiscountGroupUpdate',
    component: () => import('../views/invertors/InvDiscountGroups/UpdateView.vue'),
    props: true,
  },
  {
    path: '/invertors/InvDiscountGroups/Create',
    name: 'invDiscountGroupCreate',
    component: () => import('../views/invertors/InvDiscountGroups/CreateView.vue'),
  },
  {
    path: '/invertors/InvDiscountGroups/Delete/:id',
    name: 'invDiscountGroupDelete',
    component: () => import('../views/invertors/InvDiscountGroups/DeleteView.vue'),
    props: true,
  },
]
