import type { ColorOptionsView, GearOptionsView, IRedGearView, OilOptionsView } from "@/Interfaces/reductors"

const getA4 = (id: number) => {
  switch (id) {
    case 10: return 'S';
    case 20: return 'H';
    case 30: return 'J';
    case 40: return 'L';
    case 50: return 'MOTORSHAFT';
  }
}

const getA5 = (id: number) => {
  switch (id) {
    case 10: return 'A';
    case 20: return 'B';
    case 30: return 'S';
    case 40: return 'A';
    case 50: return 'B';
  }
}

const getA6 = (id: number) => {
  switch (id) {
    case 10: return 'M1';
    case 20: return 'M2';
    case 30: return 'M3';
    case 40: return 'M4';
    case 50: return 'M5';
    case 60: return 'M6';
  }
}

export function getFullOrderName(red: IRedGearView,
                                 adapter_name: string,
                                 mountTypeName: string,
                                 shaft_type: number,
                                 direction_shaft: number,
                                 mountPosition: number,
                                 oil_options: OilOptionsView | null,
                                 color_options: ColorOptionsView | null,
                                 gear_options: GearOptionsView[],
                                 mode: string = 'full'
                                ) {

  const a1 = red.code_aspect;
  const a2 = '-' + adapter_name;
  const a3 = '-' + mountTypeName.substring(0,1);
  const a4 = getA4(shaft_type) ? '-' + getA4(shaft_type) : '';
  const a5 = getA5(direction_shaft) ? '-' + getA5(direction_shaft) : '';
  const a6 = getA6(mountPosition) ? '-' + getA6(mountPosition) : '';

  let a7 = '';
  let a8 = '';

  // Опции редуктора
  const a9 = gear_options.length > 0 ? '-' + gear_options.map((item) => item.sign).join("-") : '';

  if (oil_options)
    a7 = '-' + oil_options.sign;

  if (color_options)
    a8 = '-' + color_options.sign;

  if (mode == 'full')
    return a1 + a3 +  a4  + a5 + a6 + a2 + '-Z' + a7 + a8 + a9;
  else
    return a1 +  a2 + '-Z-';
}
