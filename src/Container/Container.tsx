'use client'

import clsx from 'clsx'

import type { ElementType, FC, ReactNode } from 'react'

export type Size = 'xs' | 's' | 'm' | 'l' | 'xl'

export interface Props {
  children?: ReactNode
  /** trueにすると左右のパディングを0にする */
  isGapless?: boolean
  /** コンテナの最大幅 */
  size?: Size
  /** レンダリングするHTML要素 */
  component?: ElementType
  className?: string
}

/**
 * コンテンツの最大幅を制限し、中央に配置するレイアウトコンポーネント。
 * ページ全体やセクションのラッパーとして使用。
 *
 * @summary コンテンツの幅制限と中央配置
 */
export const Container: FC<Props> = ({
  children,
  isGapless = false,
  size = 'l',
  component: Component = 'div',
  className,
  ...props
}) => {
  const classNames = clsx(
    'wip-container',
    size && `-size-${size}`,
    isGapless && '-is-gapless',
    className
  )

  return (
    <Component className={classNames} {...props}>
      {children}
    </Component>
  )
}

export type { Props as ContainerProps }
