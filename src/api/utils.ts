import type {
  IInvOptionDiscount,
  IInvSerieDiscount,
  ISimpleDictionary,
  IUserDiscount,
  ICompany,
  IInvOption,
  IInvSerie,
  IUser,
} from '@/Interfaces/invertors'
import { getValueFromDictionary } from './getValueFromDictionary'
import type { IRedShaftDirection, IRedShaftType } from '@/Interfaces/reductors'

export function cutLastSymbol(inputString: string): string {
  return inputString.substring(0, inputString.length - 1)
}

export function getDiscountSerie(serie_id: number, serieDiscounts: IInvSerieDiscount[]): string {
  if (serieDiscounts) {
    const serieDiscount = serieDiscounts.find(
      (item: IInvSerieDiscount) => item.serie_id === serie_id,
    )
    let discount: number = 0
    if (serieDiscount) {
      discount = serieDiscount.discount
      return Number(discount).toFixed().toString()
    }
  }
  return ''
}

export function getDiscountOption(
  option_id: number,
  optionDiscounts: IInvOptionDiscount[],
): string {
  if (optionDiscounts) {
    const optionDiscount = optionDiscounts.find(
      (item: IInvOptionDiscount) => item.option_id === option_id,
    )
    let discount: number = 0
    if (optionDiscount) {
      discount = optionDiscount.discount
      return Number(discount).toFixed().toString()
    }
  }
  return ''
}

export function getInvPrice(
  price: number,
  serie_id: number,
  serieDiscounts: IInvSerieDiscount[],
): number {
  if (serieDiscounts) {
    const serieDiscount = serieDiscounts.find(
      (item: IInvSerieDiscount) => item.serie_id === serie_id,
    )!.discount
    return (price * (100 - serieDiscount)) / 100
  } else {
    return 0
  }
}

export function getOptionPrice(
  price: number,
  option_id: number,
  optionDiscounts: IInvOptionDiscount[],
): number {
  if (optionDiscounts) {
    const optionDiscount = optionDiscounts.find(
      (item: IInvOptionDiscount) => item.option_id === option_id,
    )!.discount
    return (price * (100 - optionDiscount)) / 100
  } else {
    return 0
  }
}

export function getDiscountGroupNameByUserId(
  discountGroups: ISimpleDictionary[],
  IUserDiscountData: IUserDiscount[],
  userId: number,
) {
  const discountGroup = IUserDiscountData.find((item: IUserDiscount) => item.user_id === userId)
  if (discountGroup) {
    const groupName = discountGroups.find((item) => item.id === discountGroup.group_id)
    if (groupName) {
      return groupName.name
    }
  }

  return ''
}
// ---------------------------------------------------------------------  Возвращает список серий через заяптую по набору id серий ---------------------------------------------------
export function getSerieNames(series: IInvSerie[], seriesStr: string) {
  let seriesNames: string = ''
  let temp = []
  temp = seriesStr.split(',')
  for (let i = 0; i < temp.length; i++) {
    seriesNames += getValueFromDictionary(series, Number(temp[i])) + ', '
  }
  seriesNames = seriesNames.substring(0, seriesNames.length - 2)
  return seriesNames
}
// ---------------------------------------------------------------------  Возвращает список серий через заяптую по набору id серий ---------------------------------------------------
export function getShaftDirectionNames(directions: IRedShaftDirection[], directiontStr: string) {
  let shaftDirections: string = ''
  let temp = []
  temp = directiontStr.split(',')
  for (let i = 0; i < temp.length; i++) {
    shaftDirections += getValueFromDictionary(directions, Number(temp[i]), 'description') + ', '
  }
  shaftDirections = shaftDirections.substring(0, shaftDirections.length - 2)
  return shaftDirections
}
export function getShaftNames(shafts: IRedShaftType[], shaftStr: string) {
  let shaftNames: string = ''
  let temp = []
  temp = shaftStr.split(',')
  for (let i = 0; i < temp.length; i++) {
    shaftNames += getValueFromDictionary(shafts, Number(temp[i]), 'description') + ', '
  }
  shaftNames = shaftNames.substring(0, shaftNames.length - 2)
  return shaftNames
}
// ---------------------------------------------------------------------  Возвращает название организации  ---------------------------------------------------
export function getCompanyName(
  companiesList: ICompany[],
  userList: IUser[],
  userId: number,
  extra: boolean = false,
) {
  const user: IUser = userList.find((item: IUser) => item.id == userId)!
  const company: ICompany = companiesList.find((item: ICompany) => item.id == user.companyId)!

  if (company && user)
    return extra
      ? '<a class="font-bold">' +
          company.name +
          '</a><p>' +
          company.phone +
          '</p>' +
          user.first_name +
          ' ' +
          user.last_name
      : company.name
  else return ''
}

export function getOptionNames(options: IInvOption[], selectedOptions: string) {
  let result: string = ''
  if (selectedOptions.length > 2) {
    const optionDict = JSON.parse(selectedOptions)
    optionDict.map((item: string) => {
      result = result + getValueFromDictionary(options, Number(item)) + '<br/>'
    })
  }
  return result
}

//   export function getCompanyName(userId: number) {
//     const record = companyUsers.value.data.filter(item => item.user === userId)
//     const user = users.value.data.filter (item => item.id === userId)
//     if (record.length > 0) {
//       const company = companies.value.data.filter(item => item.id === record[0].company)
//       return '<a class="font-bold">' + company[0].name + '</a><p>' + user[0].first_name + '</p><p>' + company[0].phone + '</p>'
//     }
//     return ''
//   }
