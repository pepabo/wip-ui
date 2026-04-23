import { TabPanel } from 'react-aria-components'

import { Tab, TabList, Tabs } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Navigation/Tab',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 関連するコンテンツをカテゴリ別に切り替えて表示したい場合に使用。
 *
 * @summary カテゴリ別にコンテンツを切り替える場合
 */
export const Default: Story = {
  render: () => (
    <Tabs>
      <TabList>
        <Tab id="tab1">Tab 1</Tab>
        <Tab id="tab2">Tab 2</Tab>
        <Tab id="tab3">Tab 3</Tab>
      </TabList>
      <TabPanel id="tab1">
        <div style={{ padding: '20px' }}>Content for Tab 1</div>
      </TabPanel>
      <TabPanel id="tab2">
        <div style={{ padding: '20px' }}>Content for Tab 2</div>
      </TabPanel>
      <TabPanel id="tab3">
        <div style={{ padding: '20px' }}>Content for Tab 3</div>
      </TabPanel>
    </Tabs>
  ),
}

/**
 * URL パラメータやユーザーの前回選択に基づいて、特定のタブを初期表示する場合に使用。
 *
 * @summary 特定のタブを初期表示する場合
 */
export const WithDefaultTab: Story = {
  render: () => (
    <Tabs defaultSelectedKey="tab2">
      <TabList>
        <Tab id="tab1">Tab 1</Tab>
        <Tab id="tab2">Tab 2 (Default)</Tab>
        <Tab id="tab3">Tab 3</Tab>
      </TabList>
      <TabPanel id="tab1">
        <div style={{ padding: '20px' }}>Content for Tab 1</div>
      </TabPanel>
      <TabPanel id="tab2">
        <div style={{ padding: '20px' }}>Content for Tab 2</div>
      </TabPanel>
      <TabPanel id="tab3">
        <div style={{ padding: '20px' }}>Content for Tab 3</div>
      </TabPanel>
    </Tabs>
  ),
}

/**
 * カテゴリが多い場面でのタブの折り返しやスクロール挙動の確認。
 *
 * @summary カテゴリが多い場面でのレイアウト確認
 */
export const ManyTabs: Story = {
  render: () => (
    <Tabs>
      <TabList>
        <Tab id="tab1">Tab 1</Tab>
        <Tab id="tab2">Tab 2</Tab>
        <Tab id="tab3">Tab 3</Tab>
        <Tab id="tab4">Tab 4</Tab>
        <Tab id="tab5">Tab 5</Tab>
      </TabList>
      <TabPanel id="tab1">
        <div style={{ padding: '20px' }}>Content for Tab 1</div>
      </TabPanel>
      <TabPanel id="tab2">
        <div style={{ padding: '20px' }}>Content for Tab 2</div>
      </TabPanel>
      <TabPanel id="tab3">
        <div style={{ padding: '20px' }}>Content for Tab 3</div>
      </TabPanel>
      <TabPanel id="tab4">
        <div style={{ padding: '20px' }}>Content for Tab 4</div>
      </TabPanel>
      <TabPanel id="tab5">
        <div style={{ padding: '20px' }}>Content for Tab 5</div>
      </TabPanel>
    </Tabs>
  ),
}

/**
 * 権限不足や未公開コンテンツなど、特定のカテゴリを一時的に利用不可にする場合に使用。
 *
 * @summary 特定のカテゴリを利用不可にする場合
 */
export const DisabledTab: Story = {
  render: () => (
    <Tabs>
      <TabList>
        <Tab id="tab1">Tab 1</Tab>
        <Tab id="tab2" isDisabled>
          Tab 2 (Disabled)
        </Tab>
        <Tab id="tab3">Tab 3</Tab>
      </TabList>
      <TabPanel id="tab1">
        <div style={{ padding: '20px' }}>Content for Tab 1</div>
      </TabPanel>
      <TabPanel id="tab2">
        <div style={{ padding: '20px' }}>Content for Tab 2</div>
      </TabPanel>
      <TabPanel id="tab3">
        <div style={{ padding: '20px' }}>Content for Tab 3</div>
      </TabPanel>
    </Tabs>
  ),
}
