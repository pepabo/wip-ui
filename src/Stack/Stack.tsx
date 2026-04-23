'use client'

import clsx from 'clsx'

import { responsiveClasses } from '../utils/responsiveClasses'

import type { FC, ReactNode } from 'react'
import type { Responsive } from '../types/responsive'
import './_index.scss'

export type StackFlexDirection = 'row' | 'column'
export type StackAlignItems = 'flex-start' | 'center' | 'flex-end' | 'stretch'
export type StackJustifyContent = 'flex-start' | 'center' | 'flex-end' | 'space-between'
export type StackGapSize = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'

export interface Props {
  children?: ReactNode
  /** 子要素の並び方向。レスポンシブ対応 */
  flexDirection?: Responsive<StackFlexDirection>
  /** 子要素間のスペース。レスポンシブ対応 */
  gap?: Responsive<StackGapSize>
  /** 交差軸方向の配置 */
  alignItems?: StackAlignItems
  /** 主軸方向の配置 */
  justifyContent?: StackJustifyContent
  className?: string
}

/**
 * Flexboxベースのレイアウトコンポーネント。
 * 子要素を縦または横方向に等間隔で並べる。
 *
 * @summary Flexboxベースの等間隔レイアウト
 */
export const Stack: FC<Props> = ({
  children,
  flexDirection = 'column',
  gap = 'm',
  alignItems = 'normal',
  justifyContent = 'normal',
  className,
}) => {
  const classNames = clsx(
    'wip-stack',
    responsiveClasses('direction', flexDirection, 'column'),
    `-align-${alignItems}`,
    `-justify-${justifyContent}`,
    responsiveClasses('gap', gap, 'm'),
    className
  )

  return <div className={classNames}>{children}</div>
}

export type { Props as StackProps }
