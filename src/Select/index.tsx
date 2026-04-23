'use client'

import {
  Button as AriaButton,
  FieldError as AriaFieldError,
  Label as AriaLabel,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Popover as AriaPopover,
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  SelectValue as AriaSelectValue,
  Text as AriaText,
} from 'react-aria-components'
import clsx from 'clsx'

import type { FC } from 'react'
import './_index.scss'

type SelectSize = 's' | 'm' | 'l'
type SelectWidth = 'auto' | 'full' | 'half' | 'third'

interface Props<T extends object> extends Omit<AriaSelectProps<T>, 'children'> {
  /** セレクトのラベルテキスト */
  label?: string
  /** ラベル下部の補足説明テキスト */
  caption?: string
  /** 未選択時のプレースホルダーテキスト */
  placeholder?: string
  /** セレクトのサイズ */
  size?: SelectSize
  /** セレクトの幅 */
  width?: SelectWidth
  children: React.ReactNode
}

/**
 * ドロップダウン形式の選択コンポーネント。
 * 複数の選択肢から1つを選ぶフォーム要素。
 *
 * @summary ドロップダウン形式の選択フォーム
 */
export const Select = <T extends object>(props: Props<T>) => {
  const {
    label,
    caption,
    placeholder,
    size = 'm',
    width = 'auto',
    className,
    children,
    ...ariaProps
  } = props

  const classNames = clsx('wip-select', `-size-${size}`, `-width-${width}`, className)

  const popoverClassNames = clsx('wip-select-popover', `-size-${size}`)

  return (
    <AriaSelect className={classNames} {...ariaProps}>
      {(label || caption) && (
        <span className="_label-container">
          {label && <AriaLabel className="_label">{label}</AriaLabel>}
          {caption && (
            <AriaText slot="description" className="_caption">
              {caption}
            </AriaText>
          )}
        </span>
      )}
      <AriaButton className="_select">
        <AriaSelectValue className="_value">
          {({ isPlaceholder }) => (isPlaceholder ? placeholder : null)}
        </AriaSelectValue>
        <span aria-hidden="true" className="_icon">
          ▼
        </span>
      </AriaButton>
      <AriaFieldError />
      <AriaPopover className={popoverClassNames}>
        <AriaListBox className="_listbox">{children}</AriaListBox>
      </AriaPopover>
    </AriaSelect>
  )
}

export const SelectItem: FC<React.ComponentProps<typeof AriaListBoxItem>> = (props) => {
  return <AriaListBoxItem className="_item" {...props} />
}

export type { Props as SelectProps, SelectSize, SelectWidth }
