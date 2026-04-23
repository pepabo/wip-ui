'use client'

import { useEffect, useState } from 'react'
import { Tab as AriaTab, type TabProps } from 'react-aria-components'
import clsx from 'clsx'

interface Props extends TabProps {
  ref?: React.Ref<HTMLDivElement>
}

const useTabState = () => {
  const [state, setState] = useState({
    isActivated: false,
  })
  const [element, setElement] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!element) return

    const checkAttributes = () => {
      const isSelected = element.getAttribute('data-selected') === 'true'
      setState({
        isActivated: isSelected,
      })
    }

    checkAttributes()

    const observer = new MutationObserver(() => {
      checkAttributes()
    })

    observer.observe(element, {
      attributes: true,
      attributeFilter: ['data-selected'],
    })

    return () => observer.disconnect()
  }, [element])

  return { state, setElement }
}

/**
 * タブの個別項目。TabList内に配置し、対応するTabPanelと連動する。
 *
 * @summary タブの個別項目
 */
export const Tab = ({ children, ref, ...props }: Props) => {
  const { state, setElement } = useTabState()
  const { isActivated } = state

  const tabClasses = clsx('_item', {
    '--activated': isActivated,
  })

  return (
    <AriaTab
      className={tabClasses}
      ref={(el: HTMLDivElement | null) => {
        setElement(el)
        if (typeof ref === 'function') {
          ref(el)
        }
      }}
      {...props}
    >
      {(renderProps) => (
        <span className="_body">
          {typeof children === 'function' ? children(renderProps) : children}
        </span>
      )}
    </AriaTab>
  )
}

export type { Props as TabProps }
