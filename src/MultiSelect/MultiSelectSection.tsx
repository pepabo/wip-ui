'use client'

import { Header as AriaHeader, ListBoxSection as AriaListBoxSection } from 'react-aria-components'

import type { ReactNode } from 'react'

export interface MultiSelectSectionProps {
  /** グループの見出し */
  title: string
  /** MultiSelectItem */
  children: ReactNode
}

export const MultiSelectSection = ({ title, children }: MultiSelectSectionProps) => {
  return (
    <AriaListBoxSection className="_section">
      <AriaHeader className="_section-header">{title}</AriaHeader>
      {children}
    </AriaListBoxSection>
  )
}
