import clsx from 'clsx'

import { responsiveClasses } from '../utils/responsiveClasses'

import type { ComponentProps } from 'react'
import type { Responsive } from '../types/responsive'

export type PaperPadding = 'none' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'

export interface PaperProps extends ComponentProps<'div'> {
  /** 影の強さ（0-6）。値が大きいほど浮き上がって見える */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** trueにするとボーダー表示になり影が無効化される */
  outlined?: boolean
  /** trueにすると角丸を無効化する */
  square?: boolean
  /** 面の内側の余白。レスポンシブ対応 */
  padding?: Responsive<PaperPadding>
}

export function Paper({
  elevation = 1,
  outlined = false,
  square = false,
  padding = 'l',
  className,
  ...props
}: PaperProps) {
  const effectiveElevation = outlined ? 0 : elevation
  const classes = clsx(
    'wip-paper',
    `wip-paper--elevation-${effectiveElevation}`,
    outlined && 'wip-paper--outlined',
    square && 'wip-paper--square',
    responsiveClasses('padding', padding, 'l'),
    className
  )

  return <div className={classes} {...props} />
}
