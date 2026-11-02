import { Button } from '../Button'
import { Icon } from '../Icon'
import { Stack } from '../Stack'
import { AppBar, AppBarLeading, AppBarTrailing } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Navigation/AppBar',
  component: AppBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['filled', 'white', 'transparent'],
    },
    position: {
      control: 'select',
      options: ['relative', 'fixed'],
    },
    children: {
      control: false,
    },
  },
} satisfies Meta<typeof AppBar>

export default meta
type Story = StoryObj<typeof meta>

const logoSrc = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="32"><rect width="120" height="32" rx="4" fill="#888"/></svg>'
)}`

const children = (
  <>
    <AppBarLeading>
      <a href="/">
        <img src={logoSrc} alt="サービス名" />
      </a>
    </AppBarLeading>
    <AppBarTrailing>
      <Button iconOnly appearance="transparent" aria-label="メニュー">
        <Icon name="menu" aria-hidden="true" />
      </Button>
    </AppBarTrailing>
  </>
)

export const Playground: Story = {
  args: {
    appearance: 'white',
    position: 'relative',
    children,
  },
}

export const Appearance: Story = {
  name: 'appearance',
  render: () => (
    <Stack gap="s">
      <AppBar appearance="filled">{children}</AppBar>
      <AppBar appearance="white">{children}</AppBar>
      <div style={{ background: '#333' }}>
        <AppBar appearance="transparent">{children}</AppBar>
      </div>
    </Stack>
  ),
}

export const Position: Story = {
  name: 'position',
  render: () => (
    <Stack gap="s">
      <div style={{ transform: 'translateZ(0)', height: '160px', overflow: 'auto' }}>
        <AppBar position="relative">{children}</AppBar>
        <div style={{ height: '400px', padding: '16px' }}>relative</div>
      </div>
      <div style={{ transform: 'translateZ(0)', height: '160px', overflow: 'auto' }}>
        <AppBar position="fixed">{children}</AppBar>
        <div style={{ height: '400px', padding: '16px', paddingTop: '80px' }}>fixed</div>
      </div>
    </Stack>
  ),
}
