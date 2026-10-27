import { Stack } from '../Stack'
import { Paper } from './Paper'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Surfaces/Paper',
  component: Paper,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    elevation: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6],
    },
    outlined: {
      control: 'boolean',
    },
    square: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Paper>

export default meta
type Story = StoryObj<typeof meta>

const content = (label: string) => <div style={{ padding: '20px' }}>{label}</div>

export const Playground: Story = {
  args: {
    children: content('Paper'),
    elevation: 1,
    outlined: false,
    square: false,
  },
}

export const Elevation: Story = {
  name: 'elevation',
  render: () => (
    <Stack flexDirection="row" gap="s">
      {([0, 1, 2, 3, 4, 5, 6] as const).map((elevation) => (
        <Paper key={elevation} elevation={elevation}>
          {content(String(elevation))}
        </Paper>
      ))}
    </Stack>
  ),
}

export const Outlined: Story = {
  name: 'outlined',
  render: () => <Paper outlined>{content('outlined')}</Paper>,
}

export const Square: Story = {
  name: 'square',
  render: () => <Paper square>{content('square')}</Paper>,
}
