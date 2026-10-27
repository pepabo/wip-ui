import { Stack } from '../Stack'
import { Select, SelectItem } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Forms/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: null,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['s', 'm', 'l'],
    },
    width: {
      control: 'select',
      options: ['auto', 'full', 'half', 'third'],
    },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  <SelectItem key="option1" id="option1">
    Option 1
  </SelectItem>,
  <SelectItem key="option2" id="option2">
    Option 2
  </SelectItem>,
  <SelectItem key="option3" id="option3">
    Option 3
  </SelectItem>,
]

export const Playground: Story = {
  args: {
    label: 'Label',
    caption: 'Caption',
    placeholder: 'Choose...',
    size: 'm',
    width: 'auto',
    isDisabled: false,
    children: items,
  },
}

export const Caption: Story = {
  name: 'caption',
  render: () => (
    <Select label="Label" caption="Caption" placeholder="Choose...">
      {items}
    </Select>
  ),
}

export const Size: Story = {
  name: 'size',
  render: () => (
    <Stack flexDirection="row" gap="s" alignItems="flex-end">
      <Select label="s" size="s" placeholder="Choose...">
        {items}
      </Select>
      <Select label="m" size="m" placeholder="Choose...">
        {items}
      </Select>
      <Select label="l" size="l" placeholder="Choose...">
        {items}
      </Select>
    </Stack>
  ),
}

export const Width: Story = {
  name: 'width',
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <Stack gap="s">
      <Select label="auto" width="auto" placeholder="Choose...">
        {items}
      </Select>
      <Select label="third" width="third" placeholder="Choose...">
        {items}
      </Select>
      <Select label="half" width="half" placeholder="Choose...">
        {items}
      </Select>
      <Select label="full" width="full" placeholder="Choose...">
        {items}
      </Select>
    </Stack>
  ),
}

export const DefaultSelectedKey: Story = {
  name: 'defaultSelectedKey',
  render: () => (
    <Select label="Label" defaultSelectedKey="option2" placeholder="Choose...">
      {items}
    </Select>
  ),
}

export const IsDisabled: Story = {
  name: 'isDisabled',
  render: () => (
    <Select label="Label" isDisabled placeholder="Choose...">
      {items}
    </Select>
  ),
}
