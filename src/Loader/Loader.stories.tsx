import { Stack } from '../Stack'
import { Loader } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Feedback/Loader',
  component: Loader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['s', 'm', 'l', 'xl', 'xxl'],
    },
    message: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Loader>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    size: 'm',
    message: '読み込み中...',
    role: 'status',
  },
}

export const Size: Story = {
  name: 'size',
  render: () => (
    <Stack flexDirection="row" gap="s" alignItems="center">
      <Loader size="s" role="status" aria-label="読み込み中" />
      <Loader size="m" role="status" aria-label="読み込み中" />
      <Loader size="l" role="status" aria-label="読み込み中" />
      <Loader size="xl" role="status" aria-label="読み込み中" />
      <Loader size="xxl" role="status" aria-label="読み込み中" />
    </Stack>
  ),
}

export const Message: Story = {
  name: 'message',
  render: () => <Loader message="読み込み中..." role="status" />,
}
