import { Button } from '../Button/Button'
import { Stack } from '../Stack'
import { SnackBar, SnackBarQueue } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { SnackBarContent } from './index'

const playgroundQueue = new SnackBarQueue()
const stateQueue = new SnackBarQueue()

const meta = {
  title: 'Components/Feedback/SnackBar',
  component: SnackBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SnackBar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: StoryObj<SnackBarContent> = {
  args: {
    message: '保存しました',
    state: 'positive',
  },
  argTypes: {
    message: {
      control: 'text',
    },
    state: {
      control: 'select',
      options: ['positive', 'negative', 'notice', 'neutral'],
    },
  },
  render: ({ message, state }) => (
    <>
      <Button onPress={() => playgroundQueue.add({ message, state })}>表示</Button>
      <SnackBar queue={playgroundQueue} />
    </>
  ),
}

export const State: Story = {
  name: 'state',
  args: {
    queue: stateQueue,
  },
  render: () => (
    <>
      <Stack flexDirection="row" gap="s">
        <Button onPress={() => stateQueue.add({ message: '保存しました', state: 'positive' })}>
          positive
        </Button>
        <Button
          onPress={() => stateQueue.add({ message: '保存できませんでした', state: 'negative' })}
        >
          negative
        </Button>
        <Button
          onPress={() =>
            stateQueue.add({ message: '一部のファイルをスキップしました', state: 'notice' })
          }
        >
          notice
        </Button>
        <Button
          onPress={() =>
            stateQueue.add({ message: 'クリップボードにコピーしました', state: 'neutral' })
          }
        >
          neutral
        </Button>
      </Stack>
      <SnackBar queue={stateQueue} />
    </>
  ),
}
