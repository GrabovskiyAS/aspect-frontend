import type {
  OutputAdapter,
  IShaftDimentionData,
  IFlangeDimention,
  IFlangeData,
  IShaftData,
} from '@/Interfaces/reductors'

export const getAdapterShaftData = (
  flangeAdapters: OutputAdapter[],
  shaftDimentionData: IShaftDimentionData[],
  adapter_id: number,
): IShaftData | null => {
  const outputAdapter = flangeAdapters.find((item: OutputAdapter) => item.id === adapter_id)
  if (outputAdapter) {
    const shaftDimention = shaftDimentionData.find(
      (item: IShaftDimentionData) => item.id === outputAdapter.shaft_dimention_id,
    )
    if (shaftDimention) {
      const data: IShaftData = {
        SE7: shaftDimention.SE7,
        SD6: shaftDimention.SD6,
        St9: shaftDimention.St9,
        Sb: shaftDimention.Sb,
      }
      // console.log('Подключаемый вал.')
      // console.log('adapter_id: ', adapter_id)
      // console.log('shaft_id: ', outputAdapter.shaft_dimention_id)
      // console.log('data: ', data)
      return data
    }
  }
  // console.log('Подключаемый вал.')
  // console.log('adapter_id: ', adapter_id)
  // console.log('Данные не найдены')
  return null
}

export const getAdapterFlangeData = (
  flangeAdapters: OutputAdapter[],
  flangeDimentions: IFlangeDimention[],
  adapter_id: number,
): IFlangeData | null => {
  const outputAdapter = flangeAdapters.find((item: OutputAdapter) => item.id === adapter_id)
  if (outputAdapter) {
    const flangeDimention = flangeDimentions.find(
      (item: IFlangeDimention) => item.name === outputAdapter.flange_name,
    )
    if (flangeDimention) {
      const data: IFlangeData = {
        m: flangeDimention.m,
        n: flangeDimention.n,
        p: flangeDimention.p,
        s: flangeDimention.s,
      }
      // console.log('Фланец.')
      // console.log('adapter_id: ', adapter_id)
      // console.log('flange_name: ', outputAdapter.flange_name)
      // console.log('data: ', data)
      return data
    }
  }
  // console.log('Фланец.')
  // console.log('adapter_id: ', adapter_id)
  // console.log('Данные не найдены')
  return null
}
