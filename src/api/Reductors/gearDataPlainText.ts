import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type { IMainDimentionGear } from '@/Interfaces/reductors'

const mainGearDimentionData = ref<IDocument<IMainDimentionGear>>({
  data: [],
  error: null,
  loading: true,
})

const getParams = (data: string):string[] | null => {
  if (data)
    return data.split(',');
  else
    return null;
}

const getValue = (element: string) => {
  const v =  Object.values(mainGearDimentionData.value.data[0]);
  const k =  Object.keys(mainGearDimentionData.value.data[0]);

  const i = k.indexOf(element);
  if (i>-1)
    return v[i]
  else
    return 'Не определено'
}


export async function getGearDataPlainText(gearTypeId: number, gearSizeId: number, data: string): Promise<string[]> {
  mainGearDimentionData.value = await useFetch(
    `/data/MainDimentionGears?gear_type_id=${gearTypeId}&gear_size_id=${gearSizeId}`,
    'reductors',
  )

  const result: string[] = []
  const params = getParams(data)

  if (params)
    for (const element of params) {
      result.push(element + `: ` + getValue(element))
    }

  return result;
}

