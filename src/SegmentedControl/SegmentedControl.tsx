'use client'

import { Children, isValidElement, type ReactNode } from 'react'
import {
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
  type Key,
} from 'react-aria-components'
import clsx from 'clsx'

type SegmentedControlWidth = 'auto' | 'full'

export interface SegmentedControlProps
  extends Omit<
    AriaToggleButtonGroupProps,
    | 'selectionMode'
    | 'disallowEmptySelection'
    | 'selectedKeys'
    | 'defaultSelectedKeys'
    | 'onSelectionChange'
    | 'orientation'
    | 'children'
    | 'className'
    | 'style'
  > {
  /** 選ばれている SegmentedControlItem の id（制御する場合） */
  selectedKey?: Key
  /** 初期に選ばれている SegmentedControlItem の id。省略すると先頭の項目 */
  defaultSelectedKey?: Key
  /** 選ばれている項目が変わったときに、その id を受け取る */
  onSelectionChange?: (key: Key) => void
  /** 幅。full で親の幅いっぱいに広がる */
  width?: SegmentedControlWidth
  /** 追加するクラス */
  className?: string
  /** SegmentedControlItem */
  children: ReactNode
}

// 先頭の SegmentedControlItem の id。常にどれか 1 つが選ばれている状態にするための初期値に使う
const getFirstItemKey = (children: ReactNode): Key | undefined => {
  for (const child of Children.toArray(children)) {
    if (isValidElement<{ id?: Key }>(child) && child.props.id !== undefined) {
      return child.props.id
    }
  }
  return undefined
}

export const SegmentedControl = ({
  selectedKey,
  defaultSelectedKey,
  onSelectionChange,
  width = 'auto',
  className,
  children,
  ...props
}: SegmentedControlProps) => {
  const isControlled = selectedKey !== undefined
  const initialKey = defaultSelectedKey ?? getFirstItemKey(children)

  return (
    <AriaToggleButtonGroup
      className={clsx('wip-segmented-control', `-width-${width}`, className)}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={isControlled ? [selectedKey] : undefined}
      defaultSelectedKeys={!isControlled && initialKey !== undefined ? [initialKey] : undefined}
      onSelectionChange={(keys) => {
        // disallowEmptySelection のため、keys は常に 1 つの id を持つ
        const [key] = keys
        if (key !== undefined) onSelectionChange?.(key)
      }}
      {...props}
    >
      {children}
    </AriaToggleButtonGroup>
  )
}

export type { SegmentedControlWidth }
