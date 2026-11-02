import { Stack } from '../Stack'
import { Switch } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Forms/Switch',
  component: Switch,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['s', 'm', 'l'],
    },
    color: {
      control: 'select',
      options: ['neutral', 'interactive', 'negative'],
    },
    isDisabled: {
      control: 'boolean',
    },
    isSelected: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    label: 'Switch',
    size: 'm',
    color: 'neutral',
    isDisabled: false,
  },
}

export const Label: Story = {
  name: 'label',
  render: () => (
    <Stack flexDirection="row" gap="s" alignItems="center">
      <Switch label="Email notifications" />
      <Switch aria-label="Email notifications" />
    </Stack>
  ),
}

export const Size: Story = {
  name: 'size',
  render: () => (
    <Stack flexDirection="row" gap="s" alignItems="center">
      <Switch size="s" label="s" />
      <Switch size="m" label="m" />
      <Switch size="l" label="l" />
    </Stack>
  ),
}

export const Color: Story = {
  name: 'color',
  render: () => (
    <Stack flexDirection="row" gap="s">
      <Switch color="neutral" defaultSelected label="neutral" />
      <Switch color="interactive" defaultSelected label="interactive" />
      <Switch color="negative" defaultSelected label="negative" />
    </Stack>
  ),
}

export const IsSelected: Story = {
  name: 'isSelected',
  render: () => (
    <Stack flexDirection="row" gap="s">
      <Switch label="Email notifications" />
      <Switch label="Email notifications" isSelected />
    </Stack>
  ),
}

export const IsDisabled: Story = {
  name: 'isDisabled',
  render: () => (
    <Stack flexDirection="row" gap="s">
      <Switch label="Disabled" isDisabled />
      <Switch label="Disabled" isDisabled isSelected />
    </Stack>
  ),
}
