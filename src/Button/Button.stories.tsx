import { Icon } from '../Icon'
import { Stack } from '../Stack'
import { Button } from './'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Actions/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['flat', 'outlined', 'transparent', 'white'],
    },
    color: {
      control: 'select',
      options: ['neutral', 'interactive', 'negative'],
    },
    size: {
      control: 'select',
      options: ['s', 'm', 'l'],
    },
    width: {
      control: 'select',
      options: ['auto', 'half', 'third', 'full'],
    },
    isDisabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    children: 'Button',
    appearance: 'flat',
    color: 'neutral',
    size: 'm',
    width: 'auto',
    isDisabled: false,
  },
}

export const Appearance: Story = {
  name: 'appearance',
  render: () => (
    <Stack flexDirection="row" gap="s" alignItems="center">
      <Button appearance="flat">flat</Button>
      <Button appearance="outlined">outlined</Button>
      <Button appearance="transparent">transparent</Button>
      <div style={{ background: '#333', padding: '8px' }}>
        <Button appearance="white">white</Button>
      </div>
    </Stack>
  ),
}

export const Color: Story = {
  name: 'color',
  render: () => (
    <Stack flexDirection="row" gap="s">
      <Button color="neutral">neutral</Button>
      <Button color="interactive">interactive</Button>
      <Button color="negative">negative</Button>
    </Stack>
  ),
}

export const Size: Story = {
  name: 'size',
  render: () => (
    <Stack flexDirection="row" gap="s" alignItems="center">
      <Button size="s">s</Button>
      <Button size="m">m</Button>
      <Button size="l">l</Button>
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
      <Button width="auto">auto</Button>
      <Button width="third">third</Button>
      <Button width="half">half</Button>
      <Button width="full">full</Button>
    </Stack>
  ),
}

export const IsDisabled: Story = {
  name: 'isDisabled',
  render: () => <Button isDisabled>Disabled</Button>,
}

export const LeadingAndTrailing: Story = {
  name: 'leading / trailing',
  render: () => (
    <Stack flexDirection="row" gap="s">
      <Button leading={<Icon name="download" aria-hidden="true" />}>leading</Button>
      <Button trailing={<Icon name="arrow_right" aria-hidden="true" />}>trailing</Button>
    </Stack>
  ),
}

export const IconOnly: Story = {
  name: 'iconOnly',
  render: () => (
    <Button iconOnly aria-label="検索">
      <Icon name="magnifying_glass" aria-hidden="true" />
    </Button>
  ),
}
