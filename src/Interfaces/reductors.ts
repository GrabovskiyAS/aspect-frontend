export interface IMainDimentionGear {
  id?: number
  gear_size_id: number
  gear_type_id: number
  Q: number
  Q2: number
  A: number
  A1: number
  B: number
  B0: number
  B1: string
  C: number
  C1: number
  H: number
  h2: number
  h3: number
  h1: number
  K1: number
  K2: number
  L: number
  L3: number
  L4: number
  S0: number
  R2: number
  f7: number
}

export interface IGearMass {
  id?: number
  gear_type_id: number
  gearbox_size_id: number
  mount_type_id: number
  mass: number
}

export interface IShaftData {
  SE7: string
  SD6: string
  St9: string
  Sb: string
}

export interface IFlangeData {
  m: number
  n: number
  p: number
  s: string
}

export interface IRedTypeConfig {
  type: number
  value: number
}

export interface ITypeConfig {
  name: string
  by: string
  id: number
}

export interface IRedCommonData {
  inputSpeed: number
  outputSpeed: number
  serviceFactor: number
  outputSpeedError: number
  serviceFactorError: number
}

export interface IShaft {
  type: number
  direction: number
}

export interface IFlange {
  type: number
  adapter: number
  name: string
}

export interface IFlangeType {
  id?: number
  name: string
  description: string
}

export interface IShaftDimentionData {
  id?: number
  SE7: string
  SD6: string
  St9: string
  Sb: string
  HD: string
  Hd9: string
  HQ: string
  HQ1: string
  HQ3: string
  JD2: string
  JD3: string
  Jd8: string
  Jd10: string
  JW: string
  JW1: string
  JW2: string
  JW5: string
  LQ: string
  LD5: string
  LQ4: string
  LS6: string
  LW3: string
  LW4: string
  LW6: string
  Lmod: string
  motor_height_id: number
  shaft_type_id: number
  dimention_size_output_shaft: string
  item_name: number
}

// ======================================================= Модели редукторов ================================================

export interface IFlangeDimention {
  id?: number
  name: string
  m: number
  n: number
  p: number
  s: string
  f: number
  // flange_type_id: number;
  // motor_height_id: number;
  flange_image_id: number
  flange_imageB5_id: number
  flange_imageB14_id: number
}

export interface IFlangeDimentionAddon {
  id?: number
  gear_type_id: number
  mount_type_id: number
  gearbox_size_id: number
  flange_name: string
}

export interface IOutputAdapterImage {
  id?: number
  image: string
}

export interface IFlangeDimentionImage {
  id?: number
  image: string
  image2: string
}

export interface IRedGearType {
  id?: number
  name: string
  description: string
  mount_position_image: string
  image: string
  shaft_direction_image: string
}

export interface IRedStep {
  id?: number
  steps: number
  kpd: number
}

export interface IRedMountType {
  id?: number
  description: string
  image: string
  K: string
  C: string
  F: string
  S: string
  K_figure: string
  C_figure: string
  F_figure: string
  S_figure: string
  K_data: string;
  C_data: string;
  F_data: string;
  S_data: string;
}

export interface IRedMountTypeView {
  id_gear: number
  r: string
  id: number
  description: string
  image: string
}

export interface IRedMountAvalList {
  id?: number
  mount_types: string
  description: string
}

export interface IRedGearSize {
  id?: number
  code_size_manuf: string
  gear_type_id: number
  gear_steps_id: number
  list_of_aval_mount_id: number
  red_item_type_id: number
  gear_box_list_size_id: number
  shaft_aval_list_id: number
}

export interface IRedItemType {
  id?: number
  // mount_type_id: number
  description: string
  image: string
}

export interface IRedGearBoxListSize {
  id?: number
  description: string
}

export interface IRedShaftType {
  id?: number
  sign: string
  description: string
  image: string
}

export interface IRedShaftTypeView {
  id_gear: number
  r: number
  d: string
  id: number
  list_shaft_id: number
  image: string
}

export interface IRedShaftTypeAvalList {
  id?: number
  shaft_output_types: string
  description: string
}

export interface IRedShaftDirection {
  id?: number
  description: string
}

export interface IRedShaftDirectionView {
  id_gear: number
  r: string
  d: string
  id: number
  shaft_direction_id: number
  shaft_direction_image: string
}

export interface IRedShaftAvalDirection {
  id?: number
  avalible_direction_shaft: string
  description: string
}

export interface IRedGear {
  id?: number
  gear_size_id: number
  ratio_code_id: number
  ex_ratio: number
  t2n: number
  p1n: number
  gear_efficiency_id: number
  item_name: string
}

export interface IRedRatioCode {
  id?: number
  code_name: string
  ratio: number
}

export interface IRedGearEfficiency {
  id?: number
  gear_efficiency: number
  description: string
}

export interface IRedMountingPosition {
  id?: number
  code: string
  description: string
  image: string
}

export interface IRedOilI {
  id?: number
  gear_size_id: number
  mounting_position_id: number
  description: string
}

export interface IRedGearView {
  id_gear: number
  id_size_gear: number
  code_manuf: string
  code_aspect: string
  p1n_1450: string
  gear_type_id: number
  steps_quantity: number
  kpd: string
  gear_steps_id: string
  list_of_aval_mount_id: number
  red_item_type_id: number
  gear_box_list_size_id: number
  shaft_aval_list_id: number
  shaft_aval_direction_id: number
  ratio_code_id: number
  t2n: string
  ex_ratio: string
  p1n: string
  price: string
  currency_id: number
  item_name: string
}

export interface OutputAdapter {
  id?: number
  code_adapter: string
  height_id: number
  adapter_type_id: number
  shaft_dimention_id: number
  flange_name: string
  power: number
  item_name: string
  adapter_image_id: string
  L: number
}

// ==================================================================================== опции

export interface ItemOptions {
  id?: number
  gear_size_list_id: number
  gear_type_id: number
  gear_option_name: string
  oil_option_name: string
  color_option_name: string
  item_name: string
}

export interface WarrantyOptions {
  id?: number
  name: string
  description: string
  sign: string
  add_description: string
  isActive: boolean
}

export interface OilOptions {
  id?: number
  name: string
  description: string
  sign: string
  add_description: string
  isActive: boolean
}

export interface ColorOptions {
  id?: number
  name: string
  description: string
  sign: string
  add_description: string
  isActive: boolean
}

export interface GearOptions {
  id?: number
  name: string
  description: string
  sign: string
  add_description: string
  isActive: boolean
}

export interface GearOptionsView {
  name: string;
  id: number;
  description: string
  sign: string
  add_description: string
  item_name: string
  gear_size_list_id: number
  price: number
  currency_id: number
  item_id: number;
}

export interface ColorOptionsView {
  name: string;
  id: number;
  description: string
  sign: string
  add_description: string
  item_name: string
  gear_size_list_id: number
  price: number
  currency_id: number
  item_id: number;
}

export interface OilOptionsView {
  name: string;
  id: number;
  description: string;
  sign: string;
  add_description: string;
  item_name: string;
  gear_size_list_id: number;
  price: number;
  currency_id: number;
  item_id: number;
}

export interface IShaftDimention {
  id?: number
  shaft_type_id: number;
  gear_type_id: number;
  gearbox_size_id: number;
  output_shaft_size: number;
  shaft_id: number;
}

// ============================================================================ Конфигурация =======================================================

export interface IUserRedConfig {
  id?: number
  full_order_number: string;
  short_order_number: string;
  rate_rub_cny: number;
  user_power: number
  user_torque: number
  user_input_speed: number
  user_output_speed: number
  user_service_factor: number
  gear_id: number
  gear_price: number
  discount: number
  mount_position_id: number
  mount_type_id: number
  shaft_type_id: number
  shaft_direcion_id: number
  flange_type_id: number
  flange_adapter_id: number
  options: string
  date?: string
  user_id: number
  staff_opened: boolean
  info: string
}

export interface RedDiscount {
  id?: number
  name: string
  discount: number
}

export interface UserRedDiscount {
  id?: number
  user_id: number
  discount_id: number
}

export interface ILogistic {
  id?: number;
  name: string;
  value: number;
}

export interface ICurrencyRate {
  id?: number;
  currency1_id: number;
  currency2_id: number;
  date: Date;
  rate: number;
}
