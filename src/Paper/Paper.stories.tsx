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
    padding: {
      control: 'select',
      options: ['none', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'],
    },
  },
} satisfies Meta<typeof Paper>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    children: 'Paper',
    elevation: 1,
    outlined: false,
    square: false,
    padding: 'l',
  },
}

export const Elevation: Story = {
  name: 'elevation',
  render: () => (
    <Stack flexDirection="row" gap="s">
      {([0, 1, 2, 3, 4, 5, 6] as const).map((elevation) => (
        <Paper key={elevation} elevation={elevation}>
          {elevation}
        </Paper>
      ))}
    </Stack>
  ),
}

export const Outlined: Story = {
  name: 'outlined',
  render: () => <Paper outlined>outlined</Paper>,
}

export const Square: Story = {
  name: 'square',
  render: () => <Paper square>square</Paper>,
}

export const Padding: Story = {
  name: 'padding',
  render: () => (
    <Stack flexDirection="row" gap="s" alignItems="flex-start">
      {(['none', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'] as const).map((padding) => (
        <Paper key={padding} outlined padding={padding}>
          {padding}
        </Paper>
      ))}
    </Stack>
  ),
}
