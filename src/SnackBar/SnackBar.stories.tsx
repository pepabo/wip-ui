import { Button } from '../Button/Button'
import { SnackBar, SnackBarQueue } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const queue = new SnackBarQueue()

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

/**
 * 操作結果を一時的にフィードバックする場合に使用。数秒後に自動で消える。永続的な通知には Callout を使用する。
 *
 * @summary 操作結果を一時的にフィードバックする場合
 */
export const Default: Story = {
  args: {
    queue,
  },
  render: () => (
    <div>
      <Button onPress={() => queue.add({ message: 'This is a snackbar message' })}>
        Show Snackbar
      </Button>
      <SnackBar queue={queue} />
    </div>
  ),
}

/**
 * 保存完了や送信成功など、操作が正常に完了したことをフィードバックする場合に使用。
 *
 * @summary 操作が正常に完了した場合のフィードバック
 */
export const Positive: Story = {
  args: {
    queue,
  },
  render: () => (
    <div>
      <Button
        onPress={() =>
          queue.add({
            message: 'Operation completed successfully!',
            state: 'positive',
          })
        }
      >
        Show Positive Snackbar
      </Button>
      <SnackBar queue={queue} />
    </div>
  ),
}

/**
 * 保存失敗や通信エラーなど、操作が失敗したことをフィードバックする場合に使用。
 *
 * @summary 操作が失敗した場合のフィードバック
 */
export const Negative: Story = {
  args: {
    queue,
  },
  render: () => (
    <div>
      <Button onPress={() => queue.add({ message: 'An error occurred', state: 'negative' })}>
        Show Negative Snackbar
      </Button>
      <SnackBar queue={queue} />
    </div>
  ),
}

/**
 * 一部の処理がスキップされた場合など、注意が必要な結果をフィードバックする場合に使用。
 *
 * @summary 注意が必要な結果をフィードバックする場合
 */
export const Notice: Story = {
  args: {
    queue,
  },
  render: () => (
    <div>
      <Button
        onPress={() =>
          queue.add({
            message: 'Warning: Please check your input',
            state: 'notice',
          })
        }
      >
        Show Notice Snackbar
      </Button>
      <SnackBar queue={queue} />
    </div>
  ),
}

/**
 * 「クリップボードにコピーしました」など、ステータスを持たないシンプルな通知に使用。
 *
 * @summary ステータスを持たないシンプルな通知
 */
export const Neutral: Story = {
  args: {
    queue,
  },
  render: () => (
    <div>
      <Button onPress={() => queue.add({ message: 'Neutral information', state: 'neutral' })}>
        Show Neutral Snackbar
      </Button>
      <SnackBar queue={queue} />
    </div>
  ),
}

/**
 * 一括操作など複数の通知が発生する場面での表示確認。キューで管理され順番に表示される。
 *
 * @summary 複数の通知が連続で発生する場面
 */
export const Multiple: Story = {
  args: {
    queue,
  },
  render: () => (
    <div>
      <Button
        onPress={() => {
          queue.add({ message: 'First message', state: 'positive' })
          queue.add({ message: 'Second message', state: 'negative' })
          queue.add({ message: 'Third message', state: 'notice' })
        }}
      >
        Show Multiple Snackbars
      </Button>
      <SnackBar queue={queue} />
    </div>
  ),
}
