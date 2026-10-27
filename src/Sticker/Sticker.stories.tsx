import { Stack } from '../Stack'
import { Sticker } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Data Display/Sticker',
  component: Sticker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['neutral', 'informative', 'positive', 'negative', 'notice', 'attention'],
    },
    size: {
      control: 'select',
      options: ['s', 'm'],
    },
  },
  args: {
    children: 'Sticker',
  },
} satisfies Meta<typeof Sticker>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    color: 'neutral',
    size: 'm',
  },
}

export const Color: Story = {
  name: 'color',
  render: () => (
    <Stack flexDirection="row" gap="s">
      <Sticker color="neutral">neutral</Sticker>
      <Sticker color="informative">informative</Sticker>
      <Sticker color="positive">positive</Sticker>
      <Sticker color="negative">negative</Sticker>
      <Sticker color="notice">notice</Sticker>
      <Sticker color="attention">attention</Sticker>
    </Stack>
  ),
}

export const Size: Story = {
  name: 'size',
  render: () => (
    <Stack flexDirection="row" gap="s" alignItems="center">
      <Sticker size="s">s</Sticker>
      <Sticker size="m">m</Sticker>
    </Stack>
  ),
}
