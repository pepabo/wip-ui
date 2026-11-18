'use client'

import { Children, isValidElement, type ReactNode, useId, useState } from 'react'
import {
  Autocomplete as AriaAutocomplete,
  Button as AriaButton,
  Checkbox as AriaCheckbox,
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Input as AriaInput,
  Label as AriaLabel,
  ListBox as AriaListBox,
  Popover as AriaPopover,
  SearchField as AriaSearchField,
  type Key,
  type Selection,
  useFilter,
} from 'react-aria-components'
import clsx from 'clsx'

import { Icon } from '../Icon'
import { MultiSelectItem } from './MultiSelectItem'
import { MultiSelectSection } from './MultiSelectSection'

type MultiSelectSize = 's' | 'm' | 'l'

export interface MultiSelectProps {
  /** ラベルテキスト */
  label?: string
  /** ラベル下部の補足説明テキスト */
  caption?: string
  /** 未選択時のプレースホルダーテキスト */
  placeholder?: string
  /** 選ばれている MultiSelectItem の id（制御する場合） */
  selectedKeys?: Iterable<Key>
  /** 初期に選ばれている MultiSelectItem の id */
  defaultSelectedKeys?: Iterable<Key>
  /** 選ばれている項目が変わったときに、その id の集合を受け取る */
  onSelectionChange?: (keys: Set<Key>) => void
  /** 検索で表示中の選択肢をまとめて選ぶ「すべて選択」を出す */
  allowsSelectAll?: boolean
  /** 操作できない状態にする */
  isDisabled?: boolean
  /** フォームで送信するときの名前。選ばれた id ごとに hidden input になる */
  name?: string
  /** サイズ */
  size?: MultiSelectSize
  /** label を省略するときの、支援技術向けの名前 */
  'aria-label'?: string
  /** 追加するクラス */
  className?: string
  /** MultiSelectItem か MultiSelectSection */
  children: ReactNode
}

interface ItemEntry {
  id: Key
  label: string
}

// 選択肢の id とラベルを、セクションの中まで含めて並び順どおりに集める。
// 選ばれた項目の表示と「すべて選択」の対象の計算に使う
const collectItems = (children: ReactNode): ItemEntry[] => {
  const entries: ItemEntry[] = []
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) continue
    if (child.type === MultiSelectSection) {
      entries.push(...collectItems((child.props as { children?: ReactNode }).children))
      continue
    }
    if (child.type === MultiSelectItem) {
      const {
        id,
        textValue,
        children: label,
      } = child.props as {
        id: Key
        textValue?: string
        children?: ReactNode
      }
      entries.push({
        id,
        label: textValue ?? (typeof label === 'string' ? label : String(id)),
      })
    }
  }
  return entries
}

export const MultiSelect = ({
  label,
  caption,
  placeholder,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  allowsSelectAll = false,
  isDisabled = false,
  name,
  size = 'm',
  'aria-label': ariaLabel,
  className,
  children,
}: MultiSelectProps) => {
  const labelId = useId()
  const captionId = useId()
  const valueId = useId()
  const [inputValue, setInputValue] = useState('')
  const [internalKeys, setInternalKeys] = useState<Set<Key>>(
    () => new Set(defaultSelectedKeys ?? [])
  )
  const { contains } = useFilter({ sensitivity: 'base' })

  const items = collectItems(children)
  const selected = selectedKeys !== undefined ? new Set(selectedKeys) : internalKeys

  const updateSelection = (next: Set<Key>) => {
    if (selectedKeys === undefined) setInternalKeys(next)
    onSelectionChange?.(next)
  }

  // ListBox の Ctrl+A などで 'all' が渡ることがあるため、常に id の集合にそろえる
  const handleListSelection = (keys: Selection) => {
    updateSelection(keys === 'all' ? new Set(items.map((item) => item.id)) : new Set(keys))
  }

  // 検索で絞り込まれている間は、表示中の選択肢だけを「すべて選択」の対象にする
  const visibleItems = items.filter((item) => contains(item.label, inputValue))
  const visibleSelectedCount = visibleItems.filter((item) => selected.has(item.id)).length
  const allVisibleSelected = visibleItems.length > 0 && visibleSelectedCount === visibleItems.length

  const toggleVisible = (select: boolean) => {
    const next = new Set(selected)
    for (const item of visibleItems) {
      if (select) next.add(item.id)
      else next.delete(item.id)
    }
    updateSelection(next)
  }

  const selectedLabels = items.filter((item) => selected.has(item.id)).map((item) => item.label)

  const classNames = clsx('wip-multi-select', `-size-${size}`, isDisabled && '-disabled', className)
  const popoverClassNames = clsx('wip-multi-select-popover', `-size-${size}`)
  const labelledBy = label ? `${labelId} ${valueId}` : undefined

  return (
    <div className={classNames} data-disabled={isDisabled || undefined}>
      {(label || caption) && (
        <span className="_label-container">
          {label && (
            <AriaLabel id={labelId} className="_label">
              {label}
            </AriaLabel>
          )}
          {caption && (
            <span id={captionId} className="_caption">
              {caption}
            </span>
          )}
        </span>
      )}
      <AriaDialogTrigger onOpenChange={(isOpen) => !isOpen && setInputValue('')}>
        <AriaButton
          className="_select"
          isDisabled={isDisabled}
          aria-label={label ? undefined : ariaLabel}
          aria-labelledby={labelledBy}
          aria-describedby={caption ? captionId : undefined}
        >
          <span className="_value" data-placeholder={selectedLabels.length === 0 || undefined}>
            <span
              id={valueId}
              className="_value-text"
              title={selectedLabels.length > 0 ? selectedLabels.join('、') : undefined}
            >
              {selectedLabels.length > 0 ? selectedLabels.join('、') : placeholder}
            </span>
            {/* 親の幅が決まっていない場所でも選んだ数で幅が変わらないよう、プレースホルダーと選択肢の中でいちばん長いものを幅の基準にする */}
            <span aria-hidden="true" className="_value-sizer">
              {placeholder && <span>{placeholder}</span>}
              {items.map((item) => (
                <span key={String(item.id)}>{item.label}</span>
              ))}
            </span>
          </span>
          <span aria-hidden="true" className="_icon">
            ▼
          </span>
        </AriaButton>
        <AriaPopover className={popoverClassNames} placement="bottom start">
          <AriaDialog
            className="_dialog"
            aria-label={label ? undefined : ariaLabel}
            aria-labelledby={label ? labelId : undefined}
          >
            <AriaAutocomplete
              filter={contains}
              inputValue={inputValue}
              onInputChange={setInputValue}
            >
              {/* 開いたらすぐ検索と矢印キーの操作ができるよう、検索欄にフォーカスを置く */}
              <AriaSearchField className="_search" aria-label="選択肢を検索" autoFocus>
                <Icon name="magnifying_glass" size="s" aria-hidden className="_search-icon" />
                <AriaInput className="_search-input" placeholder="検索" />
              </AriaSearchField>
              {allowsSelectAll && (
                <div className="_select-all">
                  {/* 選択肢の行と同じ見た目にそろえる */}
                  <AriaCheckbox
                    className="_item"
                    isSelected={allVisibleSelected}
                    isIndeterminate={visibleSelectedCount > 0 && !allVisibleSelected}
                    isDisabled={visibleItems.length === 0}
                    onChange={toggleVisible}
                  >
                    {({ isSelected, isIndeterminate, isDisabled: isCheckboxDisabled }) => (
                      <>
                        <span
                          aria-hidden="true"
                          className={clsx('wip-checkbox', '_checkbox', {
                            '--selected': isSelected,
                            '--mixed': isIndeterminate,
                            '--disabled': isCheckboxDisabled,
                          })}
                        />
                        <span className="_item-label">すべて選択</span>
                      </>
                    )}
                  </AriaCheckbox>
                </div>
              )}
              <AriaListBox
                className="_listbox"
                selectionMode="multiple"
                selectedKeys={selected}
                onSelectionChange={handleListSelection}
                renderEmptyState={() => <div className="_empty">一致する選択肢はありません</div>}
              >
                {children}
              </AriaListBox>
            </AriaAutocomplete>
          </AriaDialog>
        </AriaPopover>
      </AriaDialogTrigger>
      {name &&
        [...selected].map((key) => (
          <input key={String(key)} type="hidden" name={name} value={String(key)} />
        ))}
    </div>
  )
}

export type { MultiSelectSize }
