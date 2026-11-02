'use client'

import { forwardRef } from 'react'
import clsx from 'clsx'
import './_index.scss'

export type DividerOrientation = 'horizontal' | 'vertical'

export type DividerVariant = 'fullWidth' | 'inset' | 'middle'

export type OverridableStringUnion<T, U extends Record<PropertyKey, unknown>> = T | (string & U)

interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /**
   * 要素を絶対配置にする
   * @default false
   */
  absolute?: boolean
  /**
   * コンポーネントに追加する CSS クラス
   */
  classes?: Partial<{
    root: string
  }>
  /**
   * Flexbox の子要素として、親の高さに合わせて伸ばす
   * @default false
   */
  flexItem?: boolean
  /**
   * 区切り線の向き
   * @default 'horizontal'
   */
  orientation?: DividerOrientation
  /**
   * 区切り線の表示範囲
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
