'use client'

import {
  TabList as AriaTabList,
  type TabListProps as AriaTabListProps,
} from 'react-aria-components'

interface Props extends AriaTabListProps<object> {
  ref?: React.Ref<HTMLDivElement>
}

/**
 * Tab項目を横並びに配置するコンテナ。Tabs内で使用する。
 *
 * @summary タブ項目のコンテナ
 */
export const TabList = ({ ref, children, ...props }: Props) => {
  return (
    <AriaTabList className="_list" ref={ref} {...props}>
      {children}
    </AriaTabList>
  )
}

export type { Props as TabListProps }
