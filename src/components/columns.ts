
export const columns = ['reserveRatio', 'stable', 'reserve'] as const

export type ColumnTypes = typeof columns[number];

export const columnTitles = {
  reserveRatio: 'Reserve Ratio (%)',
  stable: 'SigmaUSD Ratio ($)',
  reserve: 'SigmaRSV Ratio',
} as const;

export const columnFormatter = {
  reserveRatio: (v: string) => `${v} %`,
  stable: (v: string) => `$${v}`,
  reserve: (v: string) => v,
} as const;
