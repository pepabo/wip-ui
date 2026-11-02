import { Stack } from './Stack'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

const gaps = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'] as const
const alignItemsValues = ['flex-start', 'center', 'flex-end', 'stretch'] as const
const justifyContentValues = ['flex-start', 'center', 'flex-end', 'space-between'] as const

const meta = {
  title: 'Components/Layout/Stack',
  component: Stack,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    flexDirection: {
      control: 'select',
      options: ['row', 'column'],
    },
    gap: {
      control: 'select',
      options: gaps,
    },
    alignItems: {
      control: 'select',
      options: alignItemsValues,
    },
    justifyContent: {
      control: 'select',
      options: justifyContentValues,
    },
  },
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

const Box = ({ children, height }: { children: ReactNode; height?: string }) => (
  <div
    style={{
      background: '#e0e0e0',
      padding: '20px',
      borderRadius: '4px',
      height,
    }}
  >
    {children}
  </div>
)

const Frame = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <div style={{ marginBottom: '4px', fontSize: '12px' }}>{label}</div>
    <div style={{ border: '1px dashed #999', padding: '8px' }}>{children}</div>
  </div>
)

export const Playground: Story = {
  args: {
    flexDirection: 'column',
    gap: 'm',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    children: (
      <>
        <Box>Item 1</Box>
        <Box>Item 2</Box>
        <Box>Item 3</Box>
      </>
    ),
  },
}

export const FlexDirection: Story = {
  name: 'flexDirection',
  render: () => (
    <Stack gap="l">
      <Frame label="column">
        <Stack flexDirection="column" gap="s">
          <Box>Item 1</Box>
          <Box>Item 2</Box>
          <Box>Item 3</Box>
        </Stack>
      </Frame>
      <Frame label="row">
        <Stack flexDirection="row" gap="s">
          <Box>Item 1</Box>
          <Box>Item 2</Box>
          <Box>Item 3</Box>
        </Stack>
      </Frame>
    </Stack>
  ),
}

export const FlexDirectionResponsive: Story = {
  name: 'flexDirection (responsive)',
  render: () => (
    <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="s">
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
}

export const Gap: Story = {
  name: 'gap',
  render: () => (
    <Stack gap="l">
      {gaps.map((gap) => (
        <Frame key={gap} label={gap}>
          <Stack flexDirection="row" gap={gap}>
            <Box>Item 1</Box>
            <Box>Item 2</Box>
            <Box>Item 3</Box>
          </Stack>
        </Frame>
      ))}
    </Stack>
  ),
}

export const GapResponsive: Story = {
  name: 'gap (responsive)',
  render: () => (
    <Stack gap={{ xxs: 's', m: 'l', xl: 'xxl' }}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
}

export const AlignItems: Story = {
  name: 'alignItems',
  render: () => (
    <Stack gap="l">
      {alignItemsValues.map((alignItems) => (
        <Frame key={alignItems} label={alignItems}>
          <Stack flexDirection="row" gap="s" alignItems={alignItems}>
            <Box>Item 1</Box>
            <Box height="80px">Item 2</Box>
            <Box>Item 3</Box>
          </Stack>
        </Frame>
      ))}
    </Stack>
  ),
}

export const JustifyContent: Story = {
  name: 'justifyContent',
  render: () => (
    <Stack gap="l">
      {justifyContentValues.map((justifyContent) => (
        <Frame key={justifyContent} label={justifyContent}>
          <Stack flexDirection="row" gap="s" justifyContent={justifyContent}>
            <Box>Item 1</Box>
            <Box>Item 2</Box>
            <Box>Item 3</Box>
          </Stack>
        </Frame>
      ))}
    </Stack>
  ),
}
