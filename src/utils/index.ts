export function isNumber(input: unknown): boolean {
  return typeof input === 'number' && Number.isFinite(input)
}

export function isString(input: unknown): input is string {
  return typeof input === 'string'
}

export function isObject(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null
    && Object.getPrototypeOf(input) === Object.prototype
}

export function isArray(arr: any[]): boolean {
  return Array.isArray(arr)
}

export function isEmptyObject(input: unknown): boolean {
  return isObject(input) && Object.keys(input).length === 0
}

export function isEmptyArray(arr: any[]): boolean {
  return Array.isArray(arr) && arr.length === 0
}

export function isEmptySet(set: Set<any>): boolean {
  return set.size === 0
}

export function setCssVar(el: HTMLElement, varName: string, varValue: any) {
  el.style.setProperty(`--${varName}`, String(varValue))
}

export function removeCssVar(el: HTMLElement, varName: string) {
  el.style.removeProperty(`--${varName}`)
}

export function isMobile() {
  return /Mobi/.test(navigator.userAgent)
}

export function makeNegative(num: number): number {
  return -Math.abs(num)
}

/**
 * Returns a random number within the given range.
 *
 * @param {number} range - Range of numbers
 * @returns {number} - Random number
 */
export function getRandomNum(range: number): number {
  return Math.floor(Math.random() * range)
}

/**
 * Returns the current timestamp in milliseconds.
 *
 * @returns {number} - Current timestamp
 */
export function getTimestamp(): number {
  return new Date().getTime()
}

/**
 * Returns the difference between two timestamps in minutes and seconds.
 *
 * @param {number} timestamp1 - First timestamp
 * @param {number} timestamp2 - Second timestamp
 * @returns {{ minutes: number, seconds: number }} - Time difference
 */
export function logTimeDifference(
  timestamp1: number,
  timestamp2: number,
): { minutes: number, seconds: number } {
  const timeDifference = timestamp2 - timestamp1

  return {
    minutes: Math.floor(timeDifference / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  }
}

/**
 * Creates a time delay in milliseconds.
 * Returns a promise that resolves after a given time.
 *
 * @param {number} ms - Time in milliseconds
 * @returns {Promise<void>} - Resolved promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Creates a CSS variable string:
 *
 * E.g:a
 *
 * ```
 * If name="my-var" > `--my-var`.
 * If name="my-var" & value="123" > `--my-var: 123`.
 * If name="my-var" & wrapInVar=true > `var(--my-var)`.
 * If name="my-var" & value="123" & wrapInVar=true > `var(--my-var)`. // value is ignored.
 * ```
 *
 * @param {string} name - The name of the CSS variable.
 * @param {string} [value] - (optional) The value to assign to the CSS variable.
 * @param {boolean} [wrapInVar] - (optional) Wether to wrap the variable in a `var()` delcaration.
 * @returns {string} - The CSS variable string in the format `--name`, `--name: value` or `var(--name)`.
 */
export function createCssVar(
  name: string,
  value: string = '',
  wrapInVar: boolean = false,
): string {
  const varName = value
    ? `--${name}: ${value}`
    : `--${name}`

  return wrapInVar && !value
    ? `var(${varName})`
    : varName
}
