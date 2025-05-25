
import { ref } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { dejavuFont } from './dejavuFont'
import { useBaseUrl } from '@/stores/baseUrl'
import { useUserStore } from '@/stores/user'
import type { IDocument } from '@/Interfaces/invertors'
import type { RedDiscount } from '@/Interfaces/reductors'
import type {
  GearOptionsView,
  IFlangeDimention,
  IFlangeDimentionAddon,
  IFlangeDimentionImage,
  IGearMass,
  IRedOilI,
  IShaftDimentionData,
} from '@/Interfaces/reductors'
import { useFetch } from '@/api/useFetch'
import axios from 'axios'
import moment from 'moment'
import { getGearDataPlainText } from './Reductors/gearDataPlainText'
import { generateHash } from '@/api/Reductors/generateHash.ts'

const baseUrl = useBaseUrl()
const user = useUserStore()
const discountGroups = ref<IDocument<RedDiscount>>({ data: [], error: null, loading: true })
const discontGroupSelected = ref<RedDiscount>()
const oilL = ref<IDocument<IRedOilI>>({ data: [], error: [], loading: true })
const gearOptions = ref<IDocument<GearOptionsView>>({ data: [], error: [], loading: true })
const gearOptionsSelected = ref<GearOptionsView[]>([])
const shaftDimention = ref<IDocument<any>>({ data: [], error: [], loading: true })
const shaftDimentionData = ref<IDocument<any>>({ data: [], error: [], loading: true })
const mass = ref<IDocument<IGearMass>>({ data: [], error: [], loading: true })
const flnageDimentionAddon = ref<IDocument<IFlangeDimentionAddon>>({
  data: [],
  error: [],
  loading: true,
})
const flnageDimention = ref<IDocument<IFlangeDimention>>({ data: [], error: [], loading: true })
const flangeSize = ref<IShaftDimentionData>()
const outputShaftSize = ref<IShaftDimentionData>()
const options = ref()

const flangeDimentionImages = ref<IDocument<IFlangeDimentionImage>>({
  data: [],
  error: [],
  loading: true,
})
const adapterImage2 = ref<IDocument<IFlangeDimentionImage>>({ data: [], error: [], loading: true })

let gear_type_id = 0
let gear_size_id = 0
let userId = 0

const mountData = ref<string>('')
const loading = ref<boolean>(true)
const nominal_power = ref<number>(0)

function numberWithSpaces(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const loadData = async (red: any) => {
  discountGroups.value = await useFetch('/data/RedDiscounts', 'reductors')
  shaftDimentionData.value = await useFetch(`/data/ShaftDimentionDatas`, 'reductors')

  // Опции { ===================================================================================================================================================================
  oilL.value = await useFetch(
    `data/RedOilIs?mounting_position_id=${red.mount_position_id}&size_id=${red.gear.gear_size_id}`,
    'reductors',
  )
  nominal_power.value = Number(
    (
      (red.gear.t2n * red.user_input_speed) /
      (9550 * red.gear.ex_ratio)
    ).toFixed(2),
  )
  gearOptions.value = await useFetch(
    `/data/GearOptionsView?gear_type_id=${red.gear.gear_size.gear_type.name}&size_id=${red.gear.gear_size.gear_box_list_size_id}`,
    'reductors',
  )
  // Опции } ===================================================================================================================================================================

  // Картинки }
  adapterImage2.value = await useFetch(
    `/data/flangeDimentionImages/${red.flange_adapter.flange_name_ref.flange_image_id}`,
    'reductors',
  )
  // Картинки }

  gear_type_id = red.gear.gear_size.gear_type.id
  gear_size_id = red.gear.gear_size.gear_box_list_size_id

  // масса
  mass.value = await useFetch(
    `/data/RedGearMass?gear_type_id=${gear_type_id}&gearbox_size_id=${gear_size_id}&mount_type_id=${red.mount_type.id}`,
    'reductors',
  )

  // Размеры фланца выходного вала {

  flnageDimentionAddon.value = await useFetch(
    `/data/FlangeDimentionAddons?gear_type_id=${gear_type_id}&gearbox_size_id=${gear_size_id}&mount_type_id=${red.mount_type.id}`,
    'reductors',
  )

  if (flnageDimentionAddon.value.data.length > 0) {
    flnageDimention.value = await useFetch(
      `/data/FlangeDimentionsExtends?name=${flnageDimentionAddon.value.data[0].flange_name}`,
      'reductors',
    )

    if (red.shaft_type.id === 20)
      flangeDimentionImages.value = await useFetch(
        `/data/flangeDimentionImages/${flnageDimention.value.data[0].flange_imageB5_id}`,
        'reductors',
      )

    if (red.shaft_type.id === 30)
      flangeDimentionImages.value = await useFetch(
        `/data/flangeDimentionImages/${flnageDimention.value.data[0].flange_imageB14_id}`,
        'reductors',
      )


  }
  // Размеры фланца выходного вала }


  options.value = JSON.parse(red.options)

  gearOptionsSelected.value = options.value.gear_options;

      // oil_options: oilOptionsSelected.value,
      // color_options: colorOptionsSelected.value,
      // warranty_options: warrantyOptionSelected.value

  // определение параметров выходного вала {
  shaftDimention.value = await useFetch(
    `/data/ShaftDimentions?gear_type_id=${gear_type_id}&gearbox_size_id=${gear_size_id}&shaft_type_id=${red.shaft_type.id}`,
    'reductors',
  )
  if (shaftDimention.value.data.length > 0)
    outputShaftSize.value = shaftDimentionData.value.data.find(
      (item: IShaftDimentionData) =>
        item.id == shaftDimention.value.data[0].shaft_id
        // item.dimention_size_output_shaft === shaftDimention.value.data[0].output_shaft_size &&
        // item.shaft_type_id === red.shaft_type.id,
    )
  // определение параметров выходного вала }

  flangeSize.value = shaftDimentionData.value.data.find(
    (item: IShaftDimentionData) => item.id === red.flange_adapter.shaft_dimention_id,
  )

  userId = user.getUser().userId.value

  // готовим данные для главного чертежа
  switch (red.mount_type.id) {
    case 10:
      mountData.value = red.mount_type.K_data;
      break;
    case 20:
      mountData.value = red.mount_type.K_data;
      break;
    case 30:
      mountData.value = red.mount_type.K_data;
      break;
    case 40:
      mountData.value = red.mount_type.K_data;
      break;
  }
  // console.log('mountData.value', mountData.value)

  // Группа накруток
  discontGroupSelected.value = discountGroups.value.data.find((item: RedDiscount) => item.discount == red.discount)


  loading.value = false
}

const getMeta = (url: string, cb: Function) => {
  const img = new Image()
  img.onload = () => cb(null, img)
  img.onerror = (err) => cb(err)
  img.src = url
}

export async function generatePDFReductor(red: any, totalPrice: number, print_price: number) {
  await loadData(red)

  const filename = 'aspect_reductor'
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' })

  let mounting_type_image: string = ''

  //=================================================================== Логотип аспект============= ====================================================
  let logo: string = ''
  await axios.get(`${baseUrl.s3url}/dms/getBase64/profwave_logo.png`).then((response) => {
    logo = response.data
  })
  //=================================================================== Изображение способа монтажа ====================================================
  let mountTypeImageUrl: string = '';
  switch (red.gear.gear_size.gear_type.id) {
    case 10: mountTypeImageUrl = red.mount_type.K; break;
    case 20: mountTypeImageUrl = red.mount_type.C; break;
    case 30: mountTypeImageUrl = red.mount_type.S; break;
    case 40: mountTypeImageUrl = red.mount_type.F; break;
  }
  await axios.get(`${baseUrl.s3url}/dms/getBase64/${mountTypeImageUrl}`).then((response) => {
    mounting_type_image = response.data
  })

  let mountTypeImageRaio: number = 1;
  getMeta(mounting_type_image, (err: any, img: any) => {
    mountTypeImageRaio = img.naturalWidth / img.naturalHeight
  })
  //================================================================== Положение редуктора в пространстве =============================================
  let mounting_position_image: string = ''
  await axios
    .get(`${baseUrl.s3url}/dms/getBase64/${red.gear.gear_size.gear_type.mount_position_image}`)
    .then((response) => {
      mounting_position_image = response.data
    })

    let mounting_position_ratio: number = 1;
    if (mounting_position_image)
    getMeta(mounting_position_image, (err: any, img: any) => {
      mounting_position_ratio = img.naturalWidth / img.naturalHeight
    })

// =================================================================== Вызодной вал ====================================================================
  let shaft_type_image: string = ''
  await axios
  .get(`${baseUrl.s3url}/dms/getBase64/${red.shaft_type.image}`)
  .then((response) => {
    shaft_type_image = response.data
  })

  let shaft_type_image_ratio: number = 1;
  getMeta(shaft_type_image, (err: any, img: any) => {
    shaft_type_image_ratio = img.naturalWidth / img.naturalHeight
  })
//===================================================================== Направление выходного вала =====================================================
  let shaft_direction_image: string = ''
  await axios
  .get(`${baseUrl.s3url}/dms/getBase64/${red.gear.gear_size.gear_type.shaft_direction_image}`)
  .then((response) => {
    shaft_direction_image = response.data
  })

  let shaft_direction_image_ratio: number = 1;
  getMeta(shaft_direction_image, (err: any, img: any) => {
    shaft_direction_image_ratio = img.naturalWidth / img.naturalHeight
  })
//====================================================================== Переходной адаптер ============================================================
  let adapter_image: string = ''
  await axios
  .get(`${baseUrl.s3url}/dms/getBase64/${red.flange_adapter.adapter_image.image}`)
  .then((response) => {
    adapter_image = response.data
  })

  let adapter_image_ratio: number = 1;
  getMeta(adapter_image, (err: any, img: any) => {
    adapter_image_ratio = img.naturalWidth / img.naturalHeight
  })
//======================================================================= Габаритные чертежи к техническому листу ======================================
let gear_type_image: string = ''
let gearTypeImageUrl: string = '';

switch (red.gear.gear_size.gear_type.id) {
  case 10: gearTypeImageUrl = red.mount_type.K_figure; break;
  case 20: gearTypeImageUrl = red.mount_type.C_figure; break;
  case 30: gearTypeImageUrl = red.mount_type.S_figure; break;
  case 40: gearTypeImageUrl = red.mount_type.F_figure; break;
}
await axios
.get(`${baseUrl.s3url}/dms/getBase64/${gearTypeImageUrl}`)
.then((response) => {
  gear_type_image = response.data
})

let gear_type_image_ratio: number = 1;
getMeta(gear_type_image, (err: any, img: any) => {
  gear_type_image_ratio = img.naturalWidth / img.naturalHeight
})
//======================================================================= Габариты адаптера =============================================================
let flangeDimentionImage = ''
let flangeDimentionImage2 = ''
let flangeDimentionImageRatio: number = 1;
let flangeDimentionImage2Ratio: number = 1;

if (flangeDimentionImages.value && flangeDimentionImages.value.data[0]?.image.length > 2) {
await axios
.get(`${baseUrl.s3url}/dms/getBase64/${flangeDimentionImages.value.data[0].image}`)
.then((response) => {
  flangeDimentionImage = response.data
})
getMeta(flangeDimentionImage, (err: any, img: any) => {
  flangeDimentionImageRatio = img.naturalWidth / img.naturalHeight
})
}

if (flangeDimentionImages.value && flangeDimentionImages.value.data[0]?.image2.length > 2) {
  await axios
  .get(`${baseUrl.s3url}/dms/getBase64/${flangeDimentionImages.value.data[0]?.image2}`)
  .then((response) => {
    flangeDimentionImage2 = response.data
  })
  getMeta(flangeDimentionImage2, (err: any, img: any) => {
    flangeDimentionImage2Ratio = img.naturalWidth / img.naturalHeight
  })
}
//======================================================================= Габариты вала ===============================================================
let shaft_type_image2 = ''
await axios
.get(`${baseUrl.s3url}/dms/getBase64/${red.shaft_type.image}`)
.then((response) => {
  shaft_type_image2 = response.data
})

let shaft_type_image2_ratio: number = 1;
getMeta(shaft_type_image2, (err: any, img: any) => {
  shaft_type_image2_ratio = img.naturalWidth / img.naturalHeight
})
//======================================================================= Габариты адаптера ===============================================================
let adapter_gabarit_image = ''
let adapter_gabarit_image2 = ''

await axios
.get(`${baseUrl.s3url}/dms/getBase64/${red.flange_adapter.adapter_image.image}`)
.then((response) => {
  adapter_gabarit_image = response.data
})
let adapter_gabarit_image_ratio: number = 1;
getMeta(adapter_gabarit_image, (err: any, img: any) => {
  adapter_gabarit_image_ratio = img.naturalWidth / img.naturalHeight
})

await axios
.get(`${baseUrl.s3url}/dms/getBase64/${adapterImage2.value.data[0].image}`)
.then((response) => {
  adapter_gabarit_image2 = response.data
})
let adapter_gabarit_image2_ratio: number = 1;
if (adapter_gabarit_image2)
  getMeta(adapter_gabarit_image2, (err: any, img: any) => {
    adapter_gabarit_image2_ratio = img.naturalWidth / img.naturalHeight
  })

  const reductor_table_header = ['Параметр', 'Значение']
  const reductor_table_body: Array<[string, string]> = []
  const reductor_table_gabarit_body: Array<[string, string]> = []
  const options_table_gabarit_body: Array<[string, string]> = []


//================================================================================================================================
//===================================== Данные редуктоа ==========================================================================
//================================================================================================================================

  reductor_table_body.push(['Тип оборудования', 'Редуктор с переходным фланцем'])
  reductor_table_body.push(['Тип редуктора', red.gear.gear_size.gear_type.description])
  reductor_table_body.push(['Габарит', red.gear.gear_size.gear_box_list_size_id])
  reductor_table_body.push(['Количество ступеней', red.gear.gear_size.gear_steps.steps])
  reductor_table_body.push([`Способ монтажа













    `, red.mount_type.description])

  if (flangeDimentionImages.value.data.length > 0)
    reductor_table_body.push([`Фланец выходного вала










      `, `m1` + flnageDimention.value.data[0].m + `
N1` + flnageDimention.value.data[0].n + `
P1` + flnageDimention.value.data[0].p + `
s1` + flnageDimention.value.data[0].s + `
f1` + flnageDimention.value.data[0].f]);
  else reductor_table_body.push([`Фланец выходного вала`, `Отсутствует`]);

  let info1: string = '';
  switch (red.shaft_type.id) {
    case 10: info1 = 'd6 x E7 = ' +  outputShaftSize.value?.SD6 + ' x ' +  outputShaftSize.value?.SE7; break;
    case 20: info1 = 'D' + outputShaftSize.value?.HD; break;
    case 30: info1 = 'D2' + outputShaftSize.value?.JD2; break;
    case 40: info1 = 'D5' + outputShaftSize.value?.LD5; break;
  }
  reductor_table_body.push([`Выходной вал`, red.shaft_type.description + `
` + info1])

  reductor_table_body.push(['Направление выходного вала', red.shaft_diirection.description + `








    `])
  reductor_table_body.push(['Скорость', `Входная: ` + red.user_input_speed + `
Выходная: ` + (red.user_input_speed / red.gear.ex_ratio).toFixed(2)]);

  reductor_table_body.push(['КПД', red.gear.gear_efficiency.gear_efficiency ])
  reductor_table_body.push(['Передаточное число', `Точное: ` + red.gear.ex_ratio + `
Код: ` + red.gear.ratio_code.ratio]);

  const from_user_power = red.user_power ? `
Исходя из данных двигателя: ` + ((9550 * Number(red.user_power)) / Number(red.user_input_speed / red.gear.ex_ratio)).toFixed(2) + ` Нм` : ``;

  reductor_table_body.push(['Момент', `Номинальный: ` + red.gear.t2n + ` Нм
Необходимый: ` + (red.user_torque > 0 ? red.user_torque + ` Нм`: `Не задано`) + from_user_power ])

  reductor_table_body.push(['Мощность', `Подключаемого двигателя: ` + red.user_power + ` кВт
Номинальная входная мощность редуктора: ` + nominal_power.value + ` кВт`]);

  reductor_table_body.push(['Сервис фактор', `Из мощности: ` + (red.user_power > 0 ? (nominal_power.value / red.user_power).toFixed(2) : 'Не задано<br>') + `
Из крутящего момента: ` + (red.user_torque > 0 ? red.gear.t2n / red.user_torque : 'Не задано') ]);

  reductor_table_body.push(['Необходимое кол-во масла', oilL.value.data[0].description + ` л`])
  reductor_table_body.push([`Положение редуктора в пространстве












    `, red.mount_position.code ])
  reductor_table_body.push(['Переходной адаптер', `Тип: ` + red.flange_type.flange_type_description + `
Код: ` + red.flange_adapter.code_adapter ])

  reductor_table_body.push(['Масса', `редуктора: ` + mass.value.data[0].mass + ` кг
адаптера: ` + red.flange_adapter.mass + ` кг`]);


  pdf.addFileToVFS('DejaVuSans-normal.ttf', dejavuFont)
  pdf.addFont('DejaVuSans-normal.ttf', 'DejaVuSans', 'normal')
  pdf.setFont('DejaVuSans', 'normal')

// -------- Предварительное ценовое предложение
  pdf.addImage(logo, 'PNG', 30, 20, 60, 36)
  pdf.setFontSize(6)
  pdf.text('ООО "АСПЕКТ". +7 (343) 204‐94‐50, info@ids‐drives.ru, ids‐drives.ru, mall.ids-drives.ru', 30, 65)


  const docNumber: string = red.full_order_number;//.substring(0, red.full_order_number.length-1)
  pdf.setFontSize(12)

  // const docNumber = moment(red.date).format('DD') + '/' + moment(red.date).format('MM') + moment(red.date).format('YY') + '-' + red.id!.toString();
  const docNumber2 = generateHash(red.id) + ' от ' + moment(red.date).format('DD.MM.YYYY HH:mm');

  autoTable(pdf, {
    head: [['Технико-коммерческое предложение № ' + docNumber2 ]],
    body: [[docNumber],[ numberWithSpaces(Math.round(totalPrice * (1 + red.discount / 100) * red.rate_rub_cny)) + ` ₽
` + numberWithSpaces(Math.round(Number(totalPrice * (1 + red.discount / 100)))) +  ` ¥`]],
    startY: 75,
    styles: { font: 'DejaVuSans', fontSize: 10, fontStyle: 'normal' },
  })

  autoTable(pdf, {
    head: [reductor_table_header],
    body: reductor_table_body,
    startY: 150,
    styles: { font: 'DejaVuSans', fontSize: 10, fontStyle: 'normal' },
    didDrawCell: (data) => {
      // Способ монтажа
      if (data.section === 'body' && data.column.index === 1 && data.row.index === 4)
        pdf.addImage(mounting_type_image, 'JPEG', data.cell.x + 2, data.cell.y + 20, 100, 100 / mountTypeImageRaio)

      // Выходной вал
      if (data.section === 'body' && data.column.index === 1 && data.row.index === 5)
        pdf.addImage(shaft_type_image, 'JPEG', data.cell.x + 2, data.cell.y + 50, 100, 100 / shaft_type_image_ratio)

      // Напревление выходного вала
      if (data.section === 'body' && data.column.index === 1 && data.row.index === 7)
        pdf.addImage(shaft_direction_image, 'JPEG', data.cell.x + 2, data.cell.y + 30, 100, 100 / shaft_direction_image_ratio)

      // Положение редуктора в пространстве
      if (data.section === 'body' && data.column.index === 1 && data.row.index === 15)
        pdf.addImage(mounting_position_image, 'JPEG', data.cell.x + 2, data.cell.y + 20, 100, 100 / mounting_position_ratio)

      // Переходной адаптер
      // if (data.section === 'body' && data.column.index === 0 && data.row.index === 16)
      //   pdf.addImage(adapter_image, 'JPEG', data.cell.x + 2, data.cell.y + 20, 100, 100 / adapter_image_ratio)

    },
  })



//================================================================================================================================
//===================================== Габаритные чертежи =======================================================================
//================================================================================================================================

  pdf.addPage()
  pdf.text('Габаритные чертежи редуктора ' + red.full_order_number, 30, 50)
  const gearDataPlainText = await getGearDataPlainText(red.gear.gear_size.gear_type.id, red.gear.gear_size.gear_box_list_size_id, mountData.value)

  reductor_table_gabarit_body.push([`Общий габарит корпуса
















Общие габариты корпуса изображены без учета направление и типа вала инаправления фланца`, gearDataPlainText.reduce((acc: string, val: any) => acc + val + `
`, '') ])

    if (flnageDimention.value.data.length > 0)
      reductor_table_gabarit_body.push([`Габариты фланца на выходном валу








`, `m1: ` + flnageDimention.value.data[0].m + `
N1: ` + flnageDimention.value.data[0].n + `
P1: ` + flnageDimention.value.data[0].p + `
s1: ` + flnageDimention.value.data[0].s + `
f1: ` + flnageDimention.value.data[0].f])

    else reductor_table_gabarit_body.push([`Габариты фланца на выходном валу`, `Отсутствуют`])


  let outputShaftSizeData = ''
  switch (red.shaft_type.id) {
    case 10: outputShaftSizeData = `d6 x E7 = ` + outputShaftSize.value?.SD6 + ` x ` + outputShaftSize.value?.SE7 + `
t9/b = ` + outputShaftSize.value?.St9 + '/' + outputShaftSize.value?.Sb; break;
    case 20: outputShaftSizeData = `D = ` + outputShaftSize.value?.HD + `
T/b = ` + outputShaftSize.value?.St9 + `/` + outputShaftSize.value?.Sb + `
Q/Q1/Q3 = ` + outputShaftSize.value?.HQ + `/` + outputShaftSize.value?.HQ1 + `/` + outputShaftSize.value?.HQ3; break;
    case 30: outputShaftSizeData = `D2/D3/d8 = ` + outputShaftSize.value?.JD2 + `/` + outputShaftSize.value?.JD3 + `/` + outputShaftSize.value?.Jd8 + `
W/W1/W2/W5 = ` + outputShaftSize.value?.JW + `/` + outputShaftSize.value?.JW1 + `/` + outputShaftSize.value?.JW2 + `/` + outputShaftSize.value?.JW5 + `
d8 = ` + outputShaftSize.value?.Jd8 + `
W5 = ` + outputShaftSize.value?.JW5; break;
    case 40: outputShaftSizeData = `D5 = ` + outputShaftSize.value?.LD5 + `
W6 = ` + outputShaftSize.value?.LW6 + `
Q/W3/W4/Q4/S6 = ` + outputShaftSize.value?.LQ + `/` + outputShaftSize.value?.LW3 + `/` + outputShaftSize.value?.LW4 + `/` + outputShaftSize.value?.LQ4 + `/` + outputShaftSize.value?.LS6; break;
  }
  reductor_table_gabarit_body.push([`Габариты выходного вала








    `, red.shaft_type.description + `
` + outputShaftSizeData])



  reductor_table_gabarit_body.push([`Габариты соединительного адаптера











    `, `Тип: ` + red.flange_type.designation_type + `
Код: ` + red.flange_adapter.code_adapter + `
Фланец P1/N1: ` + red.flange_adapter.flange_name_ref.p + `мм/` + red.flange_adapter.flange_name_ref.n + `мм (край/крепеж отв)
Подключаемый вал d1xL: ` + flangeSize.value!.SD6 + `x` + red.flange_adapter.L + `
L2: ` + red.flange_adapter.L + `
m1: ` + red.flange_adapter.flange_name_ref.m + `
N1: ` + red.flange_adapter.flange_name_ref.n + `
P1: ` + red.flange_adapter.flange_name_ref.p + `
s1: ` + red.flange_adapter.flange_name_ref.s + `
f1: ` + red.flange_adapter.flange_name_ref.f + `
L: ` + flangeSize.value!.SE7 + `
D1: ` + flangeSize.value!.SD6 + `
t1: ` + flangeSize.value!.St9 + `
b1: ` + flangeSize.value!.Sb])



autoTable(pdf, {
  head: [reductor_table_header],
  body: reductor_table_gabarit_body,
  startY: 60,
  styles: { font: 'DejaVuSans', fontSize: 10, fontStyle: 'normal' },
  didDrawCell: (data) => {
    if (data.section === 'body' && data.column.index === 0 && data.row.index === 0)
      pdf.addImage(gear_type_image, 'JPEG', data.cell.x + 2, data.cell.y + 30, 180, 180 / gear_type_image_ratio)
    // ==== Габариты фланца
    if (data.section === 'body' && data.column.index === 0 && data.row.index === 1) {
      pdf.addImage(flangeDimentionImage, 'JPEG', data.cell.x + 2, data.cell.y + 20, 100, 100 / flangeDimentionImageRatio)
      // pdf.addImage(flangeDimentionImage2, 'JPEG', data.cell.x + 2, data.cell.y + 70, 100, 100 / flangeDimentionImage2Ratio)
    }
    //======== Габариты вала
    if (data.section === 'body' && data.column.index === 0 && data.row.index === 2)
      pdf.addImage(shaft_type_image2, 'JPEG', data.cell.x + 2, data.cell.y + 20, 100, 100 / shaft_type_image2_ratio)

    //======== Габариты адаптера
    if (data.section === 'body' && data.column.index === 0 && data.row.index === 3) {
      pdf.addImage(adapter_gabarit_image, 'JPEG', data.cell.x + 2, data.cell.y + 20, 100, 100 / adapter_gabarit_image_ratio)
      pdf.addImage(adapter_gabarit_image2, 'JPEG', data.cell.x + 2, data.cell.y + 100, 80, 80 /adapter_gabarit_image2_ratio)
    }
  },
})

//================================================================================================================================
//================================================== Опции =======================================================================
//================================================================================================================================

  pdf.addPage()
  pdf.text('Цена и опции', 30, 50)

  pdf.setFontSize(8)
  pdf.text(`Сохраняем за собой право на внесение технических изменений.
Габаритные размеры кроме присоединительных могут отличатся от указанных.`, 30, 200)

  const red_options: string = gearOptionsSelected.value.reduce((acc: string, val: any) => acc + val.description + `
`, '')
  options_table_gabarit_body.push([`Опции редуктора`, red_options ])
  options_table_gabarit_body.push([`Опции масла`,options.value.oil_options.description + `, ` + options.value.oil_options.price + ' руб.'])
  options_table_gabarit_body.push([`Опции покраски`,options.value.color_options.description + `, ` + options.value.color_options.price + ' руб.'])
  options_table_gabarit_body.push([`Гарантия`,options.value.warranty_options.description])
  if (print_price) {
    options_table_gabarit_body.push([`Итоговая цена редуктора с опциями в Екатеринбурге`, numberWithSpaces(Math.round(totalPrice * (1 + red.discount / 100) * red.rate_rub_cny)) + ` ₽
` + numberWithSpaces(Math.round(Number(totalPrice * (1 + red.discount / 100)))) +  ` ¥`])
  }

  autoTable(pdf, {
    head: [reductor_table_header],
    body: options_table_gabarit_body,
    startY: 60,
    styles: { font: 'DejaVuSans', fontSize: 10, fontStyle: 'normal' },
  })

  pdf.save(`${filename} ${docNumber}.pdf`)
}
