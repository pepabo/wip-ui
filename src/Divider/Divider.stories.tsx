import { Stack } from '../Stack'
import { Divider } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Data Display/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['fullWidth', 'inset', 'middle'],
    },
    absolute: {
      control: 'boolean',
    },
    flexItem: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'fullWidth',
    absolute: false,
    flexItem: false,
  },
}

export const Orientation: Story = {
  name: 'orientation',
  render: () => (
    <Stack gap="s">
      <div>
        <div style={{ padding: '10px' }}>上のコンテンツ</div>
        <Divider orientation="horizontal" />
        <div style={{ padding: '10px' }}>下のコンテンツ</div>
      </div>
      <Stack flexDirection="row" gap="s">
        <div style={{ padding: '10px' }}>左のコンテンツ</div>
        <Divider orientation="vertical" flexItem aria-orientation="vertical" />
        <div style={{ padding: '10px' }}>右のコンテンツ</div>
      </Stack>
    </Stack>
  ),
}

export const Variant: Story = {
  name: 'variant',
  render: () => (
    <Stack gap="s">
      <div>
        <div style={{ padding: '10px' }}>fullWidth</div>
        <Divider variant="fullWidth" />
      </div>
      <div>
        <div style={{ padding: '10px' }}>inset</div>
        <Divider variant="inset" />
      </div>
      <div>
        <div style={{ padding: '10px' }}>middle</div>
        <Divider variant="middle" />
      </div>
    </Stack>
  ),
}
