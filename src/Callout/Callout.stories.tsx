import { Button } from '../Button'
import { Icon } from '../Icon'
import { Callout } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Feedback/Callout',
  component: Callout,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['informative', 'neutral', 'negative', 'notice', 'positive'],
    },
    appearance: {
      control: 'select',
      options: ['flat', 'outline'],
    },
    action: {
      description: 'The action to display in the callout.',
    },
  },
} satisfies Meta<typeof Callout>

export default meta
type Story = StoryObj<typeof meta>

/**
 * ヘルプや案内など、ユーザーに情報を伝えたい場合に使用する基本形。
 *
 * @summary ユーザーに情報を伝えたい場合の基本形
 */
export const Default: Story = {
  args: {
    children: 'This is an informative callout message.',
  },
}

/**
 * 操作手順の説明や仕様の補足など、参考情報を提示したい場合に使用。
 *
 * @summary 参考情報を提示したい場合
 */
export const Informative: Story = {
  args: {
    color: 'informative',
    children: 'This is an informative callout with important information.',
  },
}

/**
 * 設定完了や登録成功など、操作が正常に完了したことをユーザーに伝える場合に使用。
 *
 * @summary 操作が正常に完了した場合
 */
export const Positive: Story = {
  args: {
    color: 'positive',
    children: 'Operation completed successfully!',
  },
}

/**
 * バリデーションエラーやシステムエラーなど、問題が発生したことをユーザーに伝える場合に使用。
 *
 * @summary 問題が発生したことを伝える場合
 */
export const Negative: Story = {
  args: {
    color: 'negative',
    children: 'An error occurred. Please try again.',
  },
}

/**
 * メンテナンス予告や非推奨機能の告知など、注意喚起が必要な場合に使用。
 *
 * @summary 注意喚起が必要な場合
 */
export const Notice: Story = {
  args: {
    color: 'notice',
    children: 'Warning: This action cannot be undone.',
  },
}

/**
 * 特定のステータスを持たない補足情報や注釈を表示したい場合に使用。
 *
 * @summary ステータスを持たない補足情報向け
 */
export const Neutral: Story = {
  args: {
    color: 'neutral',
    children: 'This is a neutral callout message.',
  },
}

/**
 * flat スタイルでは目立ちすぎる場面で、控えめに情報を提示したい場合に使用。
 *
 * @summary 控えめに情報を提示したい場合
 */
export const Outline: Story = {
  args: {
    appearance: 'outline',
    children: 'This is an outlined callout.',
  },
}

/**
 * 「詳細を見る」「設定する」など、ユーザーに次のアクションを促したい場合に使用。
 *
 * @summary 次のアクションを促したい場合
 */
export const WithAction: Story = {
  args: {
    color: 'informative',
    children: 'This callout has an action button on the right.',
    action: (
      <Button size="s" color="interactive">
        Action
      </Button>
    ),
  },
}

/**
 * エラーメッセージとリトライボタンの組み合わせ。エラーからの復帰操作を提供。
 *
 * @summary エラー時のリトライアクション付き
 */
export const WithActionNegativeOutlined: Story = {
  args: {
    color: 'negative',
    children: 'An error occurred. Please try again.',
    action: (
      <Button appearance="outlined" color="negative">
        Retry
      </Button>
    ),
  },
}

/**
 * 閉じるアイコン付きのコールアウト。ユーザーが非表示にできるメッセージに使用。
 *
 * @summary 閉じるアイコン付きコールアウト
 */
export const WithActionIcon: Story = {
  args: {
    color: 'informative',
    children: 'This callout has an action button on the right.',
    action: <Icon name="cross" />,
  },
}

/**
 * エラーのアウトラインスタイル。
 */
export const OutlineNegative: Story = {
  tags: ['!manifest'],
  args: {
    color: 'negative',
    appearance: 'outline',
    children: 'This is an outlined negative callout.',
  },
}
