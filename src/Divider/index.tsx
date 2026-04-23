'use client'

import { forwardRef } from 'react'
import clsx from 'clsx'
import './_index.scss'

export type DividerOrientation = 'horizontal' | 'vertical'

export type DividerVariant = 'fullWidth' | 'inset' | 'middle'

export type OverridableStringUnion<T, U extends Record<PropertyKey, unknown>> = T | (string & U)

interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /**
   * Absolutely position the element.
   * @default false
   */
  absolute?: boolean
  /**
   * Additional CSS classes that can be applied to the component.
   */
  classes?: Partial<{
    root: string
  }>
  /**
   * If true, the divider will align itself as a flex item.
   * @default false
   */
  flexItem?: boolean
  /**
   * The component orientation.
   * @default 'horizontal'
   */
  orientation?: DividerOrientation
  /**
   * The variant to use.
   * @default 'fullWidth'
   */
  variant?: DividerVariant
}

export const Divider = forwardRef<HTMLHRElement, DividerProps>(function Divider(
  {
    absolute = false,
    classes,
    flexItem = false,
    orientation = 'horizontal',
    variant = 'fullWidth',
    className,
    ...props
  },
  ref
) {
  const classNames = clsx(
    'wip-divider',
    `-orientation-${orientation}`,
    `-variant-${variant}`,
    {
      '--absolute': absolute,
      '--flex-item': flexItem,
    },
    classes?.root,
    className
  )

  return <hr {...props} ref={ref} className={classNames} />
})

export type { DividerProps }
