import { Stack } from '../Stack'
import { SegmentedControl, SegmentedControlItem } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Navigation/SegmentedControl',
  component: SegmentedControl,
  subcomponents: { SegmentedControlItem },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'select',
      options: ['auto', 'full'],
    },
  },
  args: {
    'aria-label': '並び順',
    children: null,
  },
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    width: 'auto',
    isDisabled: false,
  },
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControlItem id="newest">新着順</SegmentedControlItem>
      <SegmentedControlItem id="name">名前順</SegmentedControlItem>
      <SegmentedControlItem id="updated">更新順</SegmentedControlItem>
    </SegmentedControl>
  ),
}

export const Width: Story = {
  name: 'width',
  render: () => (
    <div style={{ width: 400 }}>
      <Stack gap="m">
        <SegmentedControl aria-label="期間" width="auto">
          <SegmentedControlItem id="day">日</SegmentedControlItem>
          <SegmentedControlItem id="week">週</SegmentedControlItem>
          <SegmentedControlItem id="month">月</SegmentedControlItem>
        </SegmentedControl>
        <SegmentedControl aria-label="期間" width="full">
          <SegmentedControlItem id="day">日</SegmentedControlItem>
          <SegmentedControlItem id="week">週</SegmentedControlItem>
          <SegmentedControlItem id="month">月</SegmentedControlItem>
        </SegmentedControl>
      </Stack>
    </div>
  ),
}

export const DefaultSelectedKey: Story = {
  name: 'defaultSelectedKey',
  render: () => (
    <SegmentedControl aria-label="期間" defaultSelectedKey="month">
      <SegmentedControlItem id="day">日</SegmentedControlItem>
      <SegmentedControlItem id="week">週</SegmentedControlItem>
      <SegmentedControlItem id="month">月</SegmentedControlItem>
    </SegmentedControl>
  ),
}

export const IsDisabled: Story = {
  name: 'isDisabled',
  render: () => (
    <SegmentedControl aria-label="期間" isDisabled>
      <SegmentedControlItem id="day">日</SegmentedControlItem>
      <SegmentedControlItem id="week">週</SegmentedControlItem>
      <SegmentedControlItem id="month">月</SegmentedControlItem>
    </SegmentedControl>
  ),
}

export const SegmentedControlItemIsDisabled: Story = {
  name: 'SegmentedControlItem isDisabled',
  render: () => (
    <SegmentedControl aria-label="期間">
      <SegmentedControlItem id="day">日</SegmentedControlItem>
      <SegmentedControlItem id="week">週</SegmentedControlItem>
      <SegmentedControlItem id="month" isDisabled>
        月
      </SegmentedControlItem>
    </SegmentedControl>
  ),
}
