import { Tab, TabList, Tabs } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    defaultSelectedKey: 'profile',
    isDisabled: false,
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList>
        <Tab id="profile">プロフィール</Tab>
        <Tab id="security">セキュリティ</Tab>
        <Tab id="notification">通知</Tab>
      </TabList>
    </Tabs>
  ),
  argTypes: {
    defaultSelectedKey: {
      control: 'select',
      options: ['profile', 'security', 'notification'],
    },
    isDisabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const DefaultSelectedKey: Story = {
  name: 'defaultSelectedKey',
  args: {
    defaultSelectedKey: 'security',
  },
}

export const IsDisabled: Story = {
  name: 'isDisabled',
  render: () => (
    <Tabs>
      <TabList>
        <Tab id="profile">プロフィール</Tab>
        <Tab id="security" isDisabled>
          セキュリティ
        </Tab>
        <Tab id="notification">通知</Tab>
      </TabList>
    </Tabs>
  ),
}
