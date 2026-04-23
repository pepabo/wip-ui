export type Breakpoint = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'

export type Responsive<T> = T | Partial<Record<Breakpoint, T>>
