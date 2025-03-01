export function getShaftDimentionValues(data: any) {
  if (data.id >= 0 && data.id <= 610)
    return [
      { name: 'SE7', value: data.SE7 },
      { name: 'SD6', value: data.SD6 },
      { name: 'St9', value: data.St9 },
      { name: 'Sb', value: data.Sb },
    ]

  if (data.id >= 620 && data.id <= 730)
    return [
      { name: 'Sb', value: data.sb },
      { name: 'HD', value: data.HD },
      { name: 'Hd9', value: data.Hd9 },
      { name: 'HQ', value: data.HQ },
      { name: 'HQ1', value: data.HQ1 },
      { name: 'HQ3', value: data.HQ3 },
    ]

  if (data.id >= 1000 && data.id <= 1160)
    return [
      { name: 'JD2', value: data.JD2 },
      { name: 'JD3', value: data.JD3 },
      { name: 'Jd8', value: data.Jd8 },
      { name: 'Jd10', value: data.Jd10 },
      { name: 'JW', value: data.JW },
      { name: 'JW1', value: data.JW1 },
      { name: 'JW2', value: data.JW2 },
      { name: 'JW5', value: data.JW5 },
    ]

  if (data.id >= 1000 && data.id <= 1160)
    return [
      { name: 'LD5', value: data.LD5 },
      { name: 'LQ4', value: data.LQ4 },
      { name: 'LS6', value: data.LS6 },
      { name: 'LW3', value: data.LW3 },
      { name: 'LW4', value: data.LW4 },
      { name: 'LW6', value: data.LW6 },
      { name: 'Lmod', value: data.Lmod },
    ]
}
