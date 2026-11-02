import { Stack } from '../Stack'
import { Container } from './Container'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

const meta = {
  title: 'Components/Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 's', 'm', 'l', 'xl'],
    },
    isGapless: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

const Box = ({ children }: { children: ReactNode }) => (
  <div style={{ background: '#e0e0e0', padding: '20px' }}>{children}</div>
)

export const Playground: Story = {
  args: {
    size: 'l',
    isGapless: false,
    children: <Box>Container</Box>,
  },
}

export const Size: Story = {
  name: 'size',
  render: () => (
    <Stack gap="s">
      <Container size="xs">
        <Box>xs</Box>
      </Container>
      <Container size="s">
        <Box>s</Box>
      </Container>
      <Container size="m">
        <Box>m</Box>
      </Container>
      <Container size="l">
        <Box>l</Box>
      </Container>
      <Container size="xl">
        <Box>xl</Box>
      </Container>
    </Stack>
  ),
}

export const IsGapless: Story = {
  name: 'isGapless',
  render: () => (
    <Stack gap="s">
      <Container>
        <Box>false</Box>
      </Container>
      <Container isGapless>
        <Box>true</Box>
      </Container>
    </Stack>
  ),
}

export const ComponentProp: Story = {
  name: 'component',
  render: () => (
    <Container component="main">
      <Box>main</Box>
    </Container>
  ),
}
