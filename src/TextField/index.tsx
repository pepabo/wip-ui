'use client'

import {
  FieldError as AriaFieldError,
  Input as AriaInput,
  Label as AriaLabel,
  Text as AriaText,
  TextArea as AriaTextArea,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components'

import type { FC } from 'react'
import './_index.scss'

type TextFieldSize = 's' | 'm' | 'l'
type TextFieldWidth = 'auto' | 'full' | 'half' | 'third'
type TextFieldColor = 'neutral' | 'negative'
type TextFieldElementType = 'input' | 'textarea'

interface Props extends Omit<AriaTextFieldProps, 'children'> {
  /** 入力フィールドのラベルテキスト */
  label?: string
  /** ラベル下部の補足説明テキスト */
  caption?: string
  /** 未入力時のプレースホルダーテキスト */
  placeholder?: string
  /** 入力フィールドのサイズ */
  size?: TextFieldSize
  /** 入力フィールドの幅 */
  width?: TextFieldWidth
  /** 入力フィールドの色テーマ。negativeでエラー状態を表現 */
  color?: TextFieldColor
  /** 入力要素の種類。textareaで複数行入力に対応 */
  component?: TextFieldElementType
}

/**
 * テキスト入力のためのフォームコンポーネント。
 * 単一行入力とテキストエリア（複数行）の両方に対応。
 *
 * @summary テキスト入力フォーム
 */
export const TextField: FC<Props> = (props) => {
  const {
    label,
    caption,
    placeholder,
    size = 'm',
    width = 'auto',
    color = 'neutral',
    component = 'input',
    className,
    ...ariaProps
  } = props

  const classNames = [
    'wip-textfield',
    '-appearance-outlined',
    `-size-${size}`,
    `-width-${width}`,
    `-color-${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <AriaTextField className={classNames} {...ariaProps}>
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
      {component === 'input' ? (
        <AriaInput className="_input" placeholder={placeholder} />
      ) : (
        <AriaTextArea className="_input" placeholder={placeholder} />
      )}
      <AriaFieldError />
    </AriaTextField>
  )
}

export type {
  TextFieldColor,
  TextFieldElementType,
  Props as TextFieldProps,
  TextFieldSize,
  TextFieldWidth,
}
