import { createContext, useContext, useState } from 'react'
import { RouterProvider } from 'react-aria-components'

import { Icon } from '../Icon'
import { Typography } from '../Typography'
import { SideNavigation, SideNavigationItem, SideNavigationSection } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

const pageTitles: Record<string, string> = {
  '#servers': 'サーバー',
  '#backups': 'バックアップ',
  '#billing': '支払い',
  '#members': 'メンバー',
  '#tokens': 'アクセストークン',
  '#settings': '設定',
}

const CurrentPageContext = createContext('#servers')

// 今表示しているページの href
const useCurrentPage = () => useContext(CurrentPageContext)

// 管理画面の左に置いたときの見え方にする。クリックした項目のページに切り替わったように見せる
const AppLayout = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState('#servers')

  return (
    <RouterProvider navigate={(href) => setCurrentPage(href)}>
      <CurrentPageContext.Provider value={currentPage}>
        <div style={{ display: 'flex', height: 480, background: '#ffffff' }}>
          <aside
            style={{
              width: 264,
              flexShrink: 0,
              padding: 8,
              boxSizing: 'border-box',
              borderRight: '1px solid #e3e5e8',
            }}
          >
            {children}
          </aside>
          <main style={{ flex: 1, padding: 24 }}>
            <Typography component="h1" size="l" fontWeight="bold">
              {pageTitles[currentPage]}
            </Typography>
          </main>
        </div>
      </CurrentPageContext.Provider>
    </RouterProvider>
  )
}

const meta = {
  title: 'Components/Navigation/SideNavigation',
  component: SideNavigation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AppLayout>
        <Story />
      </AppLayout>
    ),
  ],
  args: {
    'aria-label': 'メインナビゲーション',
    // 項目は、今表示しているページに合わせて各 Storybook の render で並べる
    children: null,
  },
} satisfies Meta<typeof SideNavigation>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => {
    const currentPage = useCurrentPage()

    return (
      <SideNavigation {...args}>
        <SideNavigationItem href="#servers" isCurrent={currentPage === '#servers'}>
          サーバー
        </SideNavigationItem>
        <SideNavigationItem href="#backups" isCurrent={currentPage === '#backups'}>
          バックアップ
        </SideNavigationItem>
        <SideNavigationItem href="#billing" isCurrent={currentPage === '#billing'}>
          支払い
        </SideNavigationItem>
      </SideNavigation>
    )
  },
}

export const ItemIsCurrent: Story = {
  name: 'SideNavigationItem isCurrent',
  render: (args) => {
    const currentPage = useCurrentPage()

    return (
      <SideNavigation {...args}>
        <SideNavigationItem href="#servers" isCurrent={currentPage === '#servers'}>
          サーバー
        </SideNavigationItem>
        <SideNavigationItem href="#backups" isCurrent={currentPage === '#backups'}>
          バックアップ
        </SideNavigationItem>
      </SideNavigation>
    )
  },
}

export const ItemLeadingAndTrailing: Story = {
  name: 'SideNavigationItem leading / trailing',
  render: (args) => {
    const currentPage = useCurrentPage()

    return (
      <SideNavigation {...args}>
        <SideNavigationItem
          href="#servers"
          leading={<Icon name="folder" />}
          isCurrent={currentPage === '#servers'}
        >
          サーバー
        </SideNavigationItem>
        <SideNavigationItem
          href="#members"
          leading={<Icon name="people" />}
          isCurrent={currentPage === '#members'}
        >
          メンバー
        </SideNavigationItem>
        <SideNavigationItem
          href="https://example.com"
          target="_blank"
          leading={<Icon name="question_on_circle" />}
          trailing={<Icon name="launch" />}
        >
          ヘルプ（新しいタブで開く）
        </SideNavigationItem>
      </SideNavigation>
    )
  },
}

export const Section: Story = {
  name: 'SideNavigationSection',
  render: (args) => {
    const currentPage = useCurrentPage()

    return (
      <SideNavigation {...args}>
        <SideNavigationItem
          href="#servers"
          leading={<Icon name="folder" />}
          isCurrent={currentPage === '#servers'}
        >
          サーバー
        </SideNavigationItem>
        <SideNavigationItem
          href="#billing"
          leading={<Icon name="bill" />}
          isCurrent={currentPage === '#billing'}
        >
          支払い
        </SideNavigationItem>
        <SideNavigationSection title="管理">
          <SideNavigationItem
            href="#members"
            leading={<Icon name="people" />}
            isCurrent={currentPage === '#members'}
          >
            メンバー
          </SideNavigationItem>
          <SideNavigationItem
            href="#tokens"
            leading={<Icon name="lock" />}
            isCurrent={currentPage === '#tokens'}
          >
            アクセストークン
          </SideNavigationItem>
          <SideNavigationItem
            href="#settings"
            leading={<Icon name="gear" />}
            isCurrent={currentPage === '#settings'}
          >
            設定
          </SideNavigationItem>
        </SideNavigationSection>
      </SideNavigation>
    )
  },
}
