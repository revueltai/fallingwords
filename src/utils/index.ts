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

/**
 * Removes a CSS variable from an element's inline styles.
 *
 * @param {HTMLElement} el - The element to remove the CSS variable from.
 * @param {string} varName - The name of the CSS variable (without the "--" prefix).
 */
export function removeCssVar(el: HTMLElement, varName: string) {
  el.style.removeProperty(`--${varName}`)
}

/**
 * Checks if the current device is a mobile device.
 *
 * @returns {boolean} True if the device is mobile, otherwise false.
 */
export function isMobile(): boolean {
  return /Mobi/.test(navigator.userAgent)
}

/**
 * Converts a number to its negative form.
 *
 * @param {number} num - The number to make negative.
 * @returns {number} The negative value of the number.
 */
export function makeNegative(num: number): number {
  return -Math.abs(num)
}

/**
 * Creates a random string of lowercase letters.
 *
 * @param {number} [length] - The length of the random string.
 * @returns {string} A random string of the specified length.
 */
export function createRandomString(length: number = 4): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

/**
 * Creates a unique identifier (UID).
 *
 * @param {string} [value] - An optional value to append to the UID.
 * @returns {string} A unique identifier string.
 */
export function createUID(value: string = ''): string {
  let sanitizedValue = createRandomString()

  if (value) {
    sanitizedValue = value.split(' ').join('-')
  }

  return `${Date.now()}-${sanitizedValue}`
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
 * @returns {RoundTimeDuration} - Time difference
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

/**
 * Capitalizes a string.
 *
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized String
 */
export function capitalize(str: string): string {
  if (!str) {
    return str
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Converts a round percentage into an array of star indicators.
 *
 * @param roundPercentage - The percentage score of the round (0-100)
 * @returns An array of 3 strings, either 'StarFull' or 'StarEmpty', representing achievement levels:
 *          - First star is always full
 *          - Second star is full if percentage > 50
 *          - Third star is full if percentage > 80
 */
export function getRoundStars(roundPercentage: number): ('StarFull' | 'StarEmpty')[] {
  return [
    'StarFull',
    roundPercentage > 50 ? 'StarFull' : 'StarEmpty',
    roundPercentage > 80 ? 'StarFull' : 'StarEmpty',
  ]
}
