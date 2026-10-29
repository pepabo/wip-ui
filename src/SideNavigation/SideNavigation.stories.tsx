import { Icon } from '../Icon'
import { Typography } from '../Typography'
import { SideNavigation, SideNavigationItem, SideNavigationSection } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Navigation/SideNavigation',
  component: SideNavigation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  // 管理画面の左に置いたときの見え方にする
  decorators: [
    (Story) => (
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
          <Story />
        </aside>
        <main style={{ flex: 1, padding: 24 }}>
          <Typography component="h1" size="l" fontWeight="bold">
            ページの内容
          </Typography>
        </main>
      </div>
    ),
  ],
  args: {
    'aria-label': 'メインナビゲーション',
    children: (
      <>
        <SideNavigationItem href="#servers" isCurrent>
          サーバー
        </SideNavigationItem>
        <SideNavigationItem href="#backups">バックアップ</SideNavigationItem>
        <SideNavigationItem href="#billing">支払い</SideNavigationItem>
      </>
    ),
  },
} satisfies Meta<typeof SideNavigation>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ItemIsCurrent: Story = {
  name: 'SideNavigationItem isCurrent',
  render: (args) => (
    <SideNavigation {...args}>
      <SideNavigationItem href="#servers" isCurrent>
        isCurrent
      </SideNavigationItem>
      <SideNavigationItem href="#backups">なし</SideNavigationItem>
    </SideNavigation>
  ),
}

export const ItemLeadingAndTrailing: Story = {
  name: 'SideNavigationItem leading / trailing',
  render: (args) => (
    <SideNavigation {...args}>
      <SideNavigationItem href="#servers" leading={<Icon name="folder" />} isCurrent>
        サーバー
      </SideNavigationItem>
      <SideNavigationItem href="#members" leading={<Icon name="people" />}>
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
  ),
}

export const Section: Story = {
  name: 'SideNavigationSection',
  render: (args) => (
    <SideNavigation {...args}>
      <SideNavigationItem href="#servers" leading={<Icon name="folder" />} isCurrent>
        サーバー
      </SideNavigationItem>
      <SideNavigationItem href="#billing" leading={<Icon name="bill" />}>
        支払い
      </SideNavigationItem>
      <SideNavigationSection title="管理">
        <SideNavigationItem href="#members" leading={<Icon name="people" />}>
          メンバー
        </SideNavigationItem>
        <SideNavigationItem href="#tokens" leading={<Icon name="lock" />}>
          アクセストークン
        </SideNavigationItem>
        <SideNavigationItem href="#settings" leading={<Icon name="gear" />}>
          設定
        </SideNavigationItem>
      </SideNavigationSection>
    </SideNavigation>
  ),
}
