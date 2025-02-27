export function isNumber(input: unknown): boolean {
  return typeof input === 'number' && Number.isFinite(input);
}

export function isString(input: unknown): input is string {
  return typeof input === 'string';
}

export function isObject(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null &&
    Object.getPrototypeOf(input) === Object.prototype;
}

export function isArray(arr: any[]): boolean {
  return Array.isArray(arr);
}

export function isEmptyObject(input: unknown): boolean {
  return isObject(input) && Object.keys(input).length === 0;
}

export function isEmptyArray(arr: any[]): boolean {
  return Array.isArray(arr) && arr.length === 0;
}

export function isEmptySet(set: Set<any>): boolean {
  return set.size === 0;
}

export function findInSet(set: Set<any>, id: string): any {
  for (const item of set) {
    if (item.id === id) return item;
  }
  return null;
}

export function setCssVar(el: HTMLElement, varName: string, varValue: any) {
  el.style.setProperty(`--${varName}`, String(varValue));
}

export function removeCssVar(el: HTMLElement, varName: string) {
  el.style.removeProperty(`--${varName}`);
}

export function isMobile() {
  return /Mobi/.test(navigator.userAgent)
}

export const makeNegative = (num: number): number => {
  return -Math.abs(num)
}
