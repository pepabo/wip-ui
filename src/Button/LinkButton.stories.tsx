import { Icon } from '../Icon'
import { Stack } from '../Stack'
import { LinkButton } from './'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Actions/LinkButton',
  component: LinkButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LinkButton>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    href: '#',
    children: 'LinkButton',
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
      <LinkButton href="#" appearance="flat">
        flat
      </LinkButton>
      <LinkButton href="#" appearance="outlined">
        outlined
      </LinkButton>
      <LinkButton href="#" appearance="transparent">
        transparent
      </LinkButton>
      <div style={{ background: '#333', padding: '8px' }}>
        <LinkButton href="#" appearance="white">
          white
        </LinkButton>
      </div>
    </Stack>
  ),
}

export const Color: Story = {
  name: 'color',
  render: () => (
    <Stack flexDirection="row" gap="s">
      <LinkButton href="#" color="neutral">
        neutral
      </LinkButton>
      <LinkButton href="#" color="interactive">
        interactive
      </LinkButton>
      <LinkButton href="#" color="negative">
        negative
      </LinkButton>
    </Stack>
  ),
}

export const Size: Story = {
  name: 'size',
  render: () => (
    <Stack flexDirection="row" gap="s" alignItems="center">
      <LinkButton href="#" size="s">
        s
      </LinkButton>
      <LinkButton href="#" size="m">
        m
      </LinkButton>
      <LinkButton href="#" size="l">
        l
      </LinkButton>
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
      <LinkButton href="#" width="auto">
        auto
      </LinkButton>
      <LinkButton href="#" width="third">
        third
      </LinkButton>
      <LinkButton href="#" width="half">
        half
      </LinkButton>
      <LinkButton href="#" width="full">
        full
      </LinkButton>
    </Stack>
  ),
}

export const LeadingAndTrailing: Story = {
  name: 'leading / trailing',
  render: () => (
    <Stack flexDirection="row" gap="s">
      <LinkButton href="#" leading={<Icon name="download" aria-hidden="true" />}>
        leading
      </LinkButton>
      <LinkButton
        href="#"
        target="_blank"
        trailing={<Icon name="arrow_cross" aria-hidden="true" />}
      >
        trailing
      </LinkButton>
    </Stack>
  ),
}

export const IconOnly: Story = {
  name: 'iconOnly',
  render: () => (
    <LinkButton href="#" iconOnly aria-label="検索">
      <Icon name="magnifying_glass" aria-hidden="true" />
    </LinkButton>
  ),
}
