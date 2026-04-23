'use client'

import {
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
} from 'react-aria-components'
import clsx from 'clsx'

export type RadioGroupProps = AriaRadioGroupProps

/**
 * Radioをグループ化するコンテナコンポーネント。
 * 選択値の管理とアクセシビリティを提供する。
 *
 * @summary ラジオボタンのグループコンテナ
 */
export const RadioGroup = ({ className, ...props }: RadioGroupProps) => {
  return <AriaRadioGroup className={clsx('wip-radio-group', className)} {...props} />
}
