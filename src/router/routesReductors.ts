export const routesReductors = [
  {
    path: '/reductors/RedConfigs/List',
    name: 'RedConfigsList',
    component: () => import('../views/reductors/RedConfigs/ListView.vue'),
  },
  {
    path: '/reductors/RedConfigs/Update/:id',
    name: 'RedConfigsPlain',
    component: () => import('../views/reductors/RedConfigs/PlainView.vue'),
    props: true,
  },
  // ------------------------- FlangeDimentionImage -----------------
  {
    path: '/reductors/FlangeDimentionImage/List',
    name: 'FlangeDimentionImageList',
    component: () => import('../views/reductors/FlangeDimentionImage/ListView.vue'),
  },
  {
    path: '/reductors/FlangeDimentionImage/Update/:id',
    name: 'FlangeDimentionImageUpdate',
    component: () => import('../views/reductors/FlangeDimentionImage/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/FlangeDimentionImage/Create',
    name: 'FlangeDimentionImageCreate',
    component: () => import('../views/reductors/FlangeDimentionImage/CreateView.vue'),
  },
  {
    path: '/reductors/FlangeDimentionImage/Delete/:id',
    name: 'FlangeDimentionImageDelete',
    component: () => import('../views/reductors/FlangeDimentionImage/DeleteView.vue'),
    props: true,
  },
  // ------------------------- OutputAdapterImage -----------------
  {
    path: '/reductors/OutputAdapterImage/List',
    name: 'OutputAdapterImageList',
    component: () => import('../views/reductors/OutputAdapterImage/ListView.vue'),
  },
  {
    path: '/reductors/OutputAdapterImage/Update/:id',
    name: 'OutputAdapterImageUpdate',
    component: () => import('../views/reductors/OutputAdapterImage/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/OutputAdapterImage/Create',
    name: 'OutputAdapterImageCreate',
    component: () => import('../views/reductors/OutputAdapterImage/CreateView.vue'),
  },
  {
    path: '/reductors/OutputAdapterImage/Delete/:id',
    name: 'OutputAdapterImageDelete',
    component: () => import('../views/reductors/OutputAdapterImage/DeleteView.vue'),
    props: true,
  },
  // ------------------------- ItemOptions -----------------
  {
    path: '/reductors/ItemOptions/List',
    name: 'ItemOptionsList',
    component: () => import('../views/reductors/ItemOptions/ListView.vue'),
  },
  {
    path: '/reductors/ItemOptions/Update/:id',
    name: 'ItemOptionsOptionsUpdate',
    component: () => import('../views/reductors/ItemOptions/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/ItemOptions/Create',
    name: 'ItemOptionsOptionsCreate',
    component: () => import('../views/reductors/ItemOptions/CreateView.vue'),
  },
  {
    path: '/reductors/ItemOptions/Delete/:id',
    name: 'ItemOptionsOptionsDelete',
    component: () => import('../views/reductors/ItemOptions/DeleteView.vue'),
    props: true,
  },
  // ------------------------- WarrantyOptions -----------------
  {
    path: '/reductors/WarrantyOptions/List',
    name: 'WarrantyOptionsList',
    component: () => import('../views/reductors/WarrantyOptions/ListView.vue'),
  },
  {
    path: '/reductors/WarrantyOptions/Update/:id',
    name: 'WarrantyOptionsOptionsUpdate',
    component: () => import('../views/reductors/WarrantyOptions/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/WarrantyOptions/Create',
    name: 'WarrantyOptionsOptionsCreate',
    component: () => import('../views/reductors/WarrantyOptions/CreateView.vue'),
  },
  {
    path: '/reductors/WarrantyOptions/Delete/:id',
    name: 'WarrantyOptionsOptionsDelete',
    component: () => import('../views/reductors/WarrantyOptions/DeleteView.vue'),
    props: true,
  }, // ------------------------- ColorOptions -----------------
  {
    path: '/reductors/ColorOptions/List',
    name: 'ColorOptionsList',
    component: () => import('../views/reductors/ColorOptions/ListView.vue'),
  },
  {
    path: '/reductors/ColorOptions/Update/:id',
    name: 'ColorOptionsUpdate',
    component: () => import('../views/reductors/ColorOptions/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/ColorOptions/Create',
    name: 'ColorOptionsCreate',
    component: () => import('../views/reductors/ColorOptions/CreateView.vue'),
  },
  {
    path: '/reductors/ColorOptions/Delete/:id',
    name: 'ColorOptionsDelete',
    component: () => import('../views/reductors/ColorOptions/DeleteView.vue'),
    props: true,
  },
  // ------------------------- GearOptions -----------------
  {
    path: '/reductors/GearOptions/List',
    name: 'GearOptionsList',
    component: () => import('../views/reductors/GearOptions/ListView.vue'),
  },
  {
    path: '/reductors/GearOptions/Update/:id',
    name: 'GearOptionsUpdate',
    component: () => import('../views/reductors/GearOptions/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/GearOptions/Create',
    name: 'GearOptionsCreate',
    component: () => import('../views/reductors/GearOptions/CreateView.vue'),
  },
  {
    path: '/reductors/GearOptions/Delete/:id',
    name: 'GearOptionsDelete',
    component: () => import('../views/reductors/GearOptions/DeleteView.vue'),
    props: true,
  },
  // ------------------------- OilOptions -----------------
  {
    path: '/reductors/OilOptions/List',
    name: 'OilOptionsList',
    component: () => import('../views/reductors/OilOptions/ListView.vue'),
  },
  {
    path: '/reductors/OilOptions/Update/:id',
    name: 'OilOptionsUpdate',
    component: () => import('../views/reductors/OilOptions/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/OilOptions/Create',
    name: 'OilOptionsCreate',
    component: () => import('../views/reductors/OilOptions/CreateView.vue'),
  },
  {
    path: '/reductors/OilOptions/Delete/:id',
    name: 'OilOptionsDelete',
    component: () => import('../views/reductors/OilOptions/DeleteView.vue'),
    props: true,
  },
  // ------------------------- RedDiscount -----------------
  {
    path: '/reductors/RedDiscount/List',
    name: 'RedDiscountList',
    component: () => import('../views/reductors/Discount/ListView.vue'),
  },
  {
    path: '/reductors/RedDiscount/Update/:id',
    name: 'RedDiscountUpdate',
    component: () => import('../views/reductors/Discount/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/RedDiscount/Create',
    name: 'RedDiscountCreate',
    component: () => import('../views/reductors/Discount/CreateView.vue'),
  },
  {
    path: '/reductors/RedDiscount/Delete/:id',
    name: 'RedDiscountDelete',
    component: () => import('../views/reductors/Discount/DeleteView.vue'),
    props: true,
  },
  // ------------------------- DeliveryToChinaLogistics -----------------
  {
    path: '/reductors/DeliveryToChinaLogistics/List',
    name: 'DeliveryToChinaLogisticsList',
    component: () => import('../views/reductors/DeliveryToChinaLogistics/ListView.vue'),
  },
  {
    path: '/reductors/DeliveryToChinaLogistics/Update/:id',
    name: 'DeliveryToChinaLogisticsUpdate',
    component: () => import('../views/reductors/DeliveryToChinaLogistics/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/DeliveryToChinaLogistics/Create',
    name: 'DeliveryToChinaLogisticsCreate',
    component: () => import('../views/reductors/DeliveryToChinaLogistics/CreateView.vue'),
  },
  {
    path: '/reductors/DeliveryToChinaLogistics/Delete/:id',
    name: 'DeliveryToChinaLogisticsDelete',
    component: () => import('../views/reductors/DeliveryToChinaLogistics/DeleteView.vue'),
    props: true,
  },

  // ------------------------- DeliveryToChinaBorders -----------------
  {
    path: '/reductors/DeliveryToChinaBorders/List',
    name: 'DeliveryDeliveryToChinaBordersList',
    component: () => import('../views/reductors/DeliveryToChinaBorders/ListView.vue'),
  },
  {
    path: '/reductors/DeliveryToChinaBorders/Update/:id',
    name: 'DeliveryToChinaBordersUpdate',
    component: () => import('../views/reductors/DeliveryToChinaBorders/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/DeliveryToChinaBorders/Create',
    name: 'DeliveryToChinaBordersCreate',
    component: () => import('../views/reductors/DeliveryToChinaBorders/CreateView.vue'),
  },
  {
    path: '/reductors/DeliveryToChinaBorders/Delete/:id',
    name: 'DeliveryToChinaBordersDelete',
    component: () => import('../views/reductors/DeliveryToChinaBorders/DeleteView.vue'),
    props: true,
  },

  // ------------------------- DeliveryRussias -----------------
  {
    path: '/reductors/DeliveryRussias/List',
    name: 'DeliveryRussiasList',
    component: () => import('../views/reductors/DeliveryRussias/ListView.vue'),
  },
  {
    path: '/reductors/DeliveryRussias/Update/:id',
    name: 'DeliveryRussiasUpdate',
    component: () => import('../views/reductors/DeliveryRussias/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/DeliveryRussias/Create',
    name: 'DeliveryRussiasCreate',
    component: () => import('../views/reductors/DeliveryRussias/CreateView.vue'),
  },
  {
    path: '/reductors/DeliveryRussias/Delete/:id',
    name: 'DeliveryRussiasDelete',
    component: () => import('../views/reductors/DeliveryRussias/DeleteView.vue'),
    props: true,
  },

  // ------------------------- RedGearType -----------------
  {
    path: '/reductors/RedGearType/List',
    name: 'RedGearTypeList',
    component: () => import('../views/reductors/GearType/ListView.vue'),
  },
  {
    path: '/reductors/RedGearType/Update/:id',
    name: 'RedGearTypeUpdate',
    component: () => import('../views/reductors/GearType/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/RedGearType/Create',
    name: 'RedGearTypeCreate',
    component: () => import('../views/reductors/GearType/CreateView.vue'),
  },
  {
    path: '/reductors/RedGearType/Delete/:id',
    name: 'RedGearTypeDelete',
    component: () => import('../views/reductors/GearType/DeleteView.vue'),
    props: true,
  },
  // ------------------------- RedStep -----------------
  {
    path: '/reductors/RedStep/List',
    name: 'RedStepList',
    component: () => import('../views/reductors/Step/ListView.vue'),
  },
  {
    path: '/reductors/RedStep/Update/:id',
    name: 'RedStepUpdate',
    component: () => import('../views/reductors/Step/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/RedStep/Create',
    name: 'RedStepCreate',
    component: () => import('../views/reductors/Step/CreateView.vue'),
  },
  {
    path: '/reductors/RedStep/Delete/:id',
    name: 'RedStepDelete',
    component: () => import('../views/reductors/Step/DeleteView.vue'),
    props: true,
  },
  // ------------------------- RedMountType -----------------
  {
    path: '/reductors/RedMountType/List',
    name: 'RedMountTypeList',
    component: () => import('../views/reductors/MountType/ListView.vue'),
  },
  {
    path: '/reductors/RedMountType/Update/:id',
    name: 'RedMountTypeUpdate',
    component: () => import('../views/reductors/MountType/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/RedMountType/Create',
    name: 'RedMountTypeCreate',
    component: () => import('../views/reductors/MountType/CreateView.vue'),
  },
  {
    path: '/reductors/RedMountType/Delete/:id',
    name: 'RedMountTypeDelete',
    component: () => import('../views/reductors/MountType/DeleteView.vue'),
    props: true,
  },
  // ------------------------- RedMountAvalList -----------------
  {
    path: '/reductors/RedMountAvalList/List',
    name: 'RedMountAvalListList',
    component: () => import('../views/reductors/MountAvalList/ListView.vue'),
  },
  {
    path: '/reductors/RedMountAvalList/Update/:id',
    name: 'RedMountAvalListUpdate',
    component: () => import('../views/reductors/MountAvalList/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/RedMountAvalList/Create',
    name: 'RedMountAvalListCreate',
    component: () => import('../views/reductors/MountAvalList/CreateView.vue'),
  },
  {
    path: '/reductors/RedMountAvalList/Delete/:id',
    name: 'RedMountAvalListDelete',
    component: () => import('../views/reductors/MountAvalList/DeleteView.vue'),
    props: true,
  },
  // ------------------------- RedGearSize -----------------
  {
    path: '/reductors/RedGearSize/List',
    name: 'RedGearSizeList',
    component: () => import('../views/reductors/GearSize/ListView.vue'),
  },
  {
    path: '/reductors/RedGearSize/Update/:id',
    name: 'RedGearSizeUpdate',
    component: () => import('../views/reductors/GearSize/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/RedGearSize/Create',
    name: 'RedGearSizeCreate',
    component: () => import('../views/reductors/GearSize/CreateView.vue'),
  },
  {
    path: '/reductors/RedGearSize/Delete/:id',
    name: 'RedGearSizeDelete',
    component: () => import('../views/reductors/GearSize/DeleteView.vue'),
    props: true,
  },
  // ------------------------- RedItemType -----------------
  {
    path: '/reductors/RedItemType/List',
    name: 'RedItemTypeList',
    component: () => import('../views/reductors/ItemType/ListView.vue'),
  },
  {
    path: '/reductors/RedItemType/Update/:id',
    name: 'RedItemTypeUpdate',
    component: () => import('../views/reductors/ItemType/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/RedItemType/Create',
    name: 'RedItemTypeCreate',
    component: () => import('../views/reductors/ItemType/CreateView.vue'),
  },
  {
    path: '/reductors/RedItemType/Delete/:id',
    name: 'RedItemTypeDelete',
    component: () => import('../views/reductors/ItemType/DeleteView.vue'),
    props: true,
  },
  // ------------------------- RedGearBoxListSize -----------------
  {
    path: '/reductors/RedGearBoxListSize/List',
    name: 'RedGearBoxListSizeList',
    component: () => import('../views/reductors/GearBoxListSize/ListView.vue'),
  },
  {
    path: '/reductors/RedGearBoxListSize/Update/:id',
    name: 'RedGearBoxListSizeUpdate',
    component: () => import('../views/reductors/GearBoxListSize/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/RedGearBoxListSize/Create',
    name: 'RedGearBoxListSizeCreate',
    component: () => import('../views/reductors/GearBoxListSize/CreateView.vue'),
  },
  {
    path: '/reductors/RedGearBoxListSize/Delete/:id',
    name: 'RedGearBoxListSizeDelete',
    component: () => import('../views/reductors/GearBoxListSize/DeleteView.vue'),
    props: true,
  },
  // ------------------------- RedShaftType -----------------
  {
    path: '/reductors/RedShaftType/List',
    name: 'RedShaftTypeList',
    component: () => import('../views/reductors/ShaftType/ListView.vue'),
  },
  {
    path: '/reductors/RedShaftType/Update/:id',
    name: 'RedShaftTypeUpdate',
    component: () => import('../views/reductors/ShaftType/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/RedShaftType/Create',
    name: 'RedShaftTypeCreate',
    component: () => import('../views/reductors/ShaftType/CreateView.vue'),
  },
  {
    path: '/reductors/RedShaftType/Delete/:id',
    name: 'RedShaftTypeDelete',
    component: () => import('../views/reductors/ShaftType/DeleteView.vue'),
    props: true,
  },
  // ------------------------- RedShaftTypeAvalList -----------------
  {
    path: '/reductors/RedShaftTypeAvalList/List',
    name: 'RedShaftTypeAvalListList',
    component: () => import('../views/reductors/ShaftTypeAvalList/ListView.vue'),
  },
  {
    path: '/reductors/RedShaftTypeAvalList/Update/:id',
    name: 'RedShaftTypeAvalListUpdate',
    component: () => import('../views/reductors/ShaftTypeAvalList/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/RedShaftTypeAvalList/Create',
    name: 'RedShaftTypeAvalListCreate',
    component: () => import('../views/reductors/ShaftTypeAvalList/CreateView.vue'),
  },
  {
    path: '/reductors/RedShaftTypeAvalList/Delete/:id',
    name: 'RedShaftTypeAvalListDelete',
    component: () => import('../views/reductors/ShaftTypeAvalList/DeleteView.vue'),
    props: true,
  },
  // ------------------------- RedShaftDirection -----------------
  {
    path: '/reductors/RedShaftDirection/List',
    name: 'RedShaftDirectionList',
    component: () => import('../views/reductors/ShaftDirection/ListView.vue'),
  },
  {
    path: '/reductors/RedShaftDirection/Update/:id',
    name: 'RedShaftDirectionUpdate',
    component: () => import('../views/reductors/ShaftDirection/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/RedShaftDirection/Create',
    name: 'RedShaftDirectionCreate',
    component: () => import('../views/reductors/ShaftDirection/CreateView.vue'),
  },
  {
    path: '/reductors/RedShaftDirection/Delete/:id',
    name: 'RedShaftDirectionDelete',
    component: () => import('../views/reductors/ShaftDirection/DeleteView.vue'),
    props: true,
  },
  // ------------------------- RedShaftAvalDirection -----------------
  {
    path: '/reductors/RedShaftAvalDirection/List',
    name: 'RedShaftAvalDirectionList',
    component: () => import('../views/reductors/ShaftAvalDirection/ListView.vue'),
  },
  {
    path: '/reductors/RedShaftAvalDirection/Update/:id',
    name: 'RedShaftAvalDirectionUpdate',
    component: () => import('../views/reductors/ShaftAvalDirection/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/RedShaftAvalDirection/Create',
    name: 'RedShaftAvalDirectionCreate',
    component: () => import('../views/reductors/ShaftAvalDirection/CreateView.vue'),
  },
  {
    path: '/reductors/RedShaftAvalDirection/Delete/:id',
    name: 'RedShaftAvalDirectionDelete',
    component: () => import('../views/reductors/ShaftAvalDirection/DeleteView.vue'),
    props: true,
  },
  // ------------------------- RedGear -----------------
  {
    path: '/reductors/RedGear/List',
    name: 'RedGearList',
    component: () => import('../views/reductors/Gear/ListView.vue'),
  },
  {
    path: '/reductors/RedGear/Update/:id',
    name: 'RedGearUpdate',
    component: () => import('../views/reductors/Gear/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/RedGear/Create',
    name: 'RedGearCreate',
    component: () => import('../views/reductors/Gear/CreateView.vue'),
  },
  {
    path: '/reductors/RedGear/Delete/:id',
    name: 'RedGearDelete',
    component: () => import('../views/reductors/Gear/DeleteView.vue'),
    props: true,
  },
  // ------------------------- RedRatioCode -----------------
  {
    path: '/reductors/RedRatioCode/List',
    name: 'RedRatioCodeList',
    component: () => import('../views/reductors/RatioCode/ListView.vue'),
  },
  {
    path: '/reductors/RedRatioCode/Update/:id',
    name: 'RedRatioCodeUpdate',
    component: () => import('../views/reductors/RatioCode/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/RedRatioCode/Create',
    name: 'RedRatioCodeCreate',
    component: () => import('../views/reductors/RatioCode/CreateView.vue'),
  },
  {
    path: '/reductors/RedRatioCode/Delete/:id',
    name: 'RedRatioCodeDelete',
    component: () => import('../views/reductors/RatioCode/DeleteView.vue'),
    props: true,
  },
  // ------------------------- RedGearEfficiency -----------------
  {
    path: '/reductors/RedGearEfficiency/List',
    name: 'RedGearEfficiencyList',
    component: () => import('../views/reductors/GearEfficiency/ListView.vue'),
  },
  {
    path: '/reductors/RedGearEfficiency/Update/:id',
    name: 'RedGearEfficiencyUpdate',
    component: () => import('../views/reductors/GearEfficiency/UpdateView.vue'),
    props: true,
  },
  {
    path: '/reductors/RedGearEfficiency/Create',
    name: 'RedGearEfficiencyCreate',
    component: () => import('../views/reductors/GearEfficiency/CreateView.vue'),
  },
  {
    path: '/reductors/RedGearEfficiency/Delete/:id',
    name: 'RedGearEfficiencyDelete',
    component: () => import('../views/reductors/GearEfficiency/DeleteView.vue'),
    props: true,
  },
  // ------------------------- CurrencyRate -----------------
  {
    path: '/common/CurrencyRate/List',
    name: 'CurrencyRateList',
    component: () => import('../views/common/CurrencyRate/ListView.vue'),
  },
  {
    path: '/common/CurrencyRate/Update/:id',
    name: 'CurrencyRateUpdate',
    component: () => import('../views/common/CurrencyRate/UpdateView.vue'),
    props: true,
  },
  {
    path: '/common/CurrencyRate/Create',
    name: 'CurrencyRateCreate',
    component: () => import('../views/common/CurrencyRate/CreateView.vue'),
  },
  {
    path: '/common/CurrencyRate/Delete/:id',
    name: 'CurrencyRateDelete',
    component: () => import('../views/common/CurrencyRate/DeleteView.vue'),
    props: true,
  },
]
