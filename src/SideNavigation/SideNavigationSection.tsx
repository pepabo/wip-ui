'use client'

import { useId } from 'react'

import type { ReactNode } from 'react'

export interface SideNavigationSectionProps {
  /** まとまりの見出し */
  title: string
  /** SideNavigationItem */
  children: ReactNode
}

export const SideNavigationSection = ({ title, children }: SideNavigationSectionProps) => {
  const titleId = useId()
  return (
    <li className="wip-side-navigation-section">
      <span id={titleId} className="_title">
        {title}
      </span>
      <ul className="_list" aria-labelledby={titleId}>
        {children}
      </ul>
    </li>
  )
}
