'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
} from 'react-aria-components'
import clsx from 'clsx'

import { Typography } from '../Typography'
import './_index.scss'

interface CheckboxProps extends AriaCheckboxProps {
  children: ReactNode
}

const useCheckboxState = (ref: React.RefObject<HTMLLabelElement | null>) => {
  const [state, setState] = useState({
    isSelected: false,
    isIndeterminate: false,
    isDisabled: false,
    isHovered: false,
    isFocused: false,
  })

  useEffect(() => {
    const checkAttributes = () => {
      if (!ref.current) return

      setState({
        isSelected: ref.current.getAttribute('data-selected') === 'true',
        isIndeterminate: ref.current.getAttribute('data-indeterminate') === 'true',
        isDisabled: ref.current.getAttribute('data-disabled') === 'true',
        isHovered: ref.current.getAttribute('data-hovered') === 'true',
        isFocused: ref.current.getAttribute('data-focus-visible') === 'true',
      })
    }

    checkAttributes()

    const observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.type === 'attributes')) {
        checkAttributes()
      }
    })

    if (ref.current) {
      observer.observe(ref.current, { attributes: true })
    }

    return () => observer.disconnect()
  }, [ref])

  return state
}

/**
 * フォームでの複数選択に使用するチェックボックスコンポーネント。
 * 単一選択にはRadioを使用してください。
 *
 * @summary 複数選択用のチェックボックス
 */
const Checkbox = ({ children, ...props }: CheckboxProps) => {
  const ariaRef = useRef<HTMLLabelElement>(null)
  const { isSelected, isIndeterminate, isDisabled, isHovered, isFocused } =
    useCheckboxState(ariaRef)

  const checkboxClasses = clsx('wip-checkbox', {
    '--selected': isSelected,
    '--mixed': isIndeterminate,
    '--disabled': isDisabled,
    '--hover': isHovered,
    '--focused': isFocused,
  })

  const labelClasses = clsx('-label', {
    '--disabled': isDisabled,
  })

  return (
    <AriaCheckbox {...props} ref={ariaRef} className="aria-checkbox">
      <div className={checkboxClasses} />
      {children && (
        <Typography component="span" className={labelClasses}>
          {children}
        </Typography>
      )}
    </AriaCheckbox>
  )
}

export { Checkbox }
export type { CheckboxProps }
