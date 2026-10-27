import { Stack } from '../Stack'
import { Checkbox } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    children: null,
  },
  argTypes: {
    isDisabled: {
      control: 'boolean',
    },
    isIndeterminate: {
      control: 'boolean',
    },
    isSelected: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    children: 'Checkbox',
    isIndeterminate: false,
    isDisabled: false,
  },
}

export const IsSelected: Story = {
  name: 'isSelected',
  render: () => (
    <Stack flexDirection="row" gap="s">
      <Checkbox>Unselected</Checkbox>
      <Checkbox isSelected>Selected</Checkbox>
    </Stack>
  ),
}

export const IsIndeterminate: Story = {
  name: 'isIndeterminate',
  render: () => <Checkbox isIndeterminate>Select all</Checkbox>,
}

export const IsDisabled: Story = {
  name: 'isDisabled',
  render: () => (
    <Stack flexDirection="row" gap="s">
      <Checkbox isDisabled>Disabled</Checkbox>
      <Checkbox isDisabled isSelected>
        Disabled
      </Checkbox>
    </Stack>
  ),
}

export const AriaLabel: Story = {
  name: 'aria-label',
  args: {
    children: null,
    'aria-label': 'Select row',
  },
}
