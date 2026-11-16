import { Stack } from '../Stack'
import { StatusIndicator } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Data Display/StatusIndicator',
  component: StatusIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['neutral', 'informative', 'positive', 'negative', 'notice'],
    },
  },
  args: {
    label: '稼働中',
  },
} satisfies Meta<typeof StatusIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    color: 'positive',
    isPending: false,
  },
}

export const Color: Story = {
  name: 'color',
  render: () => (
    <Stack gap="s">
      <StatusIndicator color="neutral" label="neutral" />
      <StatusIndicator color="informative" label="informative" />
      <StatusIndicator color="positive" label="positive" />
      <StatusIndicator color="negative" label="negative" />
      <StatusIndicator color="notice" label="notice" />
    </Stack>
  ),
}

export const IsPending: Story = {
  name: 'isPending',
  render: () => (
    <Stack gap="s">
      <StatusIndicator color="informative" label="false" />
      <StatusIndicator color="informative" isPending label="true" />
    </Stack>
  ),
}

export const Label: Story = {
  name: 'label',
  render: () => (
    <Stack gap="s">
      <StatusIndicator color="positive" label="稼働中" />
      <StatusIndicator color="positive" aria-label="稼働中" />
    </Stack>
  ),
}
