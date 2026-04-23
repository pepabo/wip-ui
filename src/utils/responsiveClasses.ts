import type { Responsive } from '../types/responsive'

const BASE_BREAKPOINT = 'xxs'

export function responsiveClasses<T extends string | number>(
  prefix: string,
  value: Responsive<T> | undefined,
  defaultValue?: T
): string[] {
  if (value === undefined || value === null) return []

  if (typeof value !== 'object') {
    return [`-${prefix}-${value}`]
  }

  const entries = { ...value }
  if (entries.xxs === undefined && defaultValue !== undefined) {
    entries.xxs = defaultValue
  }

  return Object.entries(entries)
    .filter(([, v]) => v !== undefined)
    .map(([bp, v]) => (bp === BASE_BREAKPOINT ? `-${prefix}-${v}` : `-${prefix}-${bp}-${v}`))
}
