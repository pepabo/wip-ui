import { Stack } from '../Stack'
import { Link } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Navigation/Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['neutral', 'white'],
    },
    target: {
      control: 'select',
      options: ['_self', '_blank'],
    },
    hideNewTabIcon: {
      control: 'boolean',
    },
    isDisabled: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Link',
    href: '#',
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    color: 'neutral',
    isDisabled: false,
  },
}

export const Color: Story = {
  name: 'color',
  render: () => (
    <Stack flexDirection="row" gap="m" alignItems="center">
      <Link href="#" color="neutral">
        neutral
      </Link>
      <div style={{ background: '#333', padding: '8px' }}>
        <Link href="#" color="white">
          white
        </Link>
      </div>
    </Stack>
  ),
}

export const Target: Story = {
  name: 'target',
  render: () => (
    <Stack flexDirection="row" gap="m">
      <Link href="#">_self</Link>
      <Link href="https://example.com" target="_blank">
        _blank
      </Link>
    </Stack>
  ),
}

export const HideNewTabIcon: Story = {
  name: 'hideNewTabIcon',
  render: () => (
    <Stack flexDirection="row" gap="m">
      <Link href="https://example.com" target="_blank">
        false
      </Link>
      <Link href="https://example.com" target="_blank" hideNewTabIcon>
        true
      </Link>
    </Stack>
  ),
}

export const IsDisabled: Story = {
  name: 'isDisabled',
  render: () => (
    <Stack flexDirection="row" gap="m">
      <Link href="#">false</Link>
      <Link href="#" isDisabled>
        true
      </Link>
    </Stack>
  ),
}
