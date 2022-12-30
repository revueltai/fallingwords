export const isMobile = (): boolean => {
  return /Mobi/.test(navigator.userAgent)
}

export const isNumber = (input: any): boolean => {
  return typeof input === 'number' && isFinite(input)
}

export const isString = (input: any): boolean => {
  return Object.prototype.toString.call(input) === '[object String]'
}

export const makeNegative = (num: number): number => {
  return -Math.abs(num)
}