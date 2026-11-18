import clsx from 'clsx'

import type { HTMLAttributes, ReactNode } from 'react'

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  /** 行の間に区切り線を引く */
  divider?: boolean
  /** ListItem */
  children: ReactNode
}

export const List = ({ divider = true, className, children, ...props }: ListProps) => {
  return (
    // list-style: none にした ul は、Safari の VoiceOver でリストとして読まれないため、role を明示する
    // biome-ignore lint/a11y/useSemanticElements: 上のコメントのとおり、意図して付けている
    // biome-ignore lint/a11y/noRedundantRoles: 同上
    <ul className={clsx('wip-list', divider && '-divider', className)} role="list" {...props}>
      {children}
    </ul>
  )
}
