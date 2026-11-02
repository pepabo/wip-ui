import { Radio, RadioGroup } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Forms/Radio',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    'aria-label': 'Select an option',
    defaultValue: 'option1',
    isDisabled: false,
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="option1">Option 1</Radio>
      <Radio value="option2">Option 2</Radio>
      <Radio value="option3">Option 3</Radio>
    </RadioGroup>
  ),
  argTypes: {
    isDisabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const DefaultValue: Story = {
  name: 'defaultValue',
  args: {
    defaultValue: 'option2',
  },
}

export const IsDisabled: Story = {
  name: 'isDisabled',
  args: {
    isDisabled: true,
  },
}

export const RadioIsDisabled: Story = {
  name: 'Radio isDisabled',
  render: () => (
    <RadioGroup aria-label="Select an option" defaultValue="option1">
      <Radio value="option1">Option 1</Radio>
      <Radio value="option2" isDisabled>
        Option 2
      </Radio>
      <Radio value="option3">Option 3</Radio>
    </RadioGroup>
  ),
}
