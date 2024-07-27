export const useUseFormatCurrency = (number: number, currency?:string) => new Intl.NumberFormat('en-GH', {
  style: 'currency',
  currency: currency ?? 'GHS'
}).format(number)
