'use client'

import { Icon } from '../Icon'
import { useStepContext } from './Stepper'

import type { ReactNode } from 'react'

export interface StepperItemProps {
  /** ラベルの下に出す補足説明 */
  description?: string
  /** 入力に不備があるなど、そのステップにエラーがあることを示す */
  isInvalid?: boolean
  /** ステップのラベル */
  children: ReactNode
}

export const StepperItem = ({ description, isInvalid = false, children }: StepperItemProps) => {
  const { number, state } = useStepContext()

  // 現在地は aria-current で伝わるため、見た目だけで示している完了とエラーに読み上げ用の文字を添える
  const statusText = isInvalid ? 'エラー' : state === 'completed' ? '完了' : undefined

  return (
    <li
      className="_item"
      data-state={state}
      data-invalid={isInvalid || undefined}
      aria-current={state === 'current' ? 'step' : undefined}
    >
      <span className="_marker" aria-hidden="true">
        {isInvalid ? '!' : state === 'completed' ? <Icon name="check" size="s" /> : number}
      </span>
      <span className="_body">
        <span className="_label">
          {statusText && <span className="_status">{statusText}: </span>}
          {children}
        </span>
        {description && <span className="_description">{description}</span>}
      </span>
    </li>
  )
}
