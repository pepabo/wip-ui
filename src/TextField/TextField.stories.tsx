import { TextField } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Forms/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['s', 'm', 'l'],
    },
    width: {
      control: 'select',
      options: ['auto', 'full', 'half', 'third'],
    },
    color: {
      control: 'select',
      options: ['neutral', 'negative'],
    },
    component: {
      control: 'select',
      options: ['input', 'textarea'],
    },
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

/**
 * ユーザーにテキストを自由入力させる場合の基本形。定義済みの選択肢から選ばせる場合は Select を使用する。
 *
 * @summary テキストを自由入力させる場合の基本形
 */
export const Default: Story = {
  args: {
    label: 'Label',
    placeholder: 'Enter text...',
  },
}

/**
 * 入力形式の例や文字数制限など、入力ルールをユーザーに伝えたい場合に使用。
 *
 * @summary 入力ルールをユーザーに伝えたい場合
 */
export const WithCaption: Story = {
  args: {
    label: 'Email',
    caption: 'Please enter your email address',
    placeholder: 'email@example.com',
  },
}

/**
 * テーブル内やフィルターなど、スペースが限られる場面で使用。
 *
 * @summary スペースが限られる場面向け
 */
export const Small: Story = {
  args: {
    label: 'Small TextField',
    size: 's',
    placeholder: 'Enter text...',
  },
}

/**
 * 検索フォームやランディングページなど、入力欄を目立たせたい場面で使用。
 *
 * @summary 入力欄を目立たせたい場面向け
 */
export const Large: Story = {
  args: {
    label: 'Large TextField',
    size: 'l',
    placeholder: 'Enter text...',
  },
}

/**
 * フォームレイアウトで他の要素と幅を揃えたい場合に使用。
 *
 * @summary フォーム内で幅を揃えたい場合
 */
export const FullWidth: Story = {
  args: {
    label: 'Full Width',
    width: 'full',
    placeholder: 'Enter text...',
  },
  parameters: {
    layout: 'padded',
  },
}

/**
 * バリデーションエラーが発生した際に、入力に問題があることをユーザーに伝える場合に使用。
 *
 * @summary バリデーションエラーをユーザーに伝える場合
 */
export const Negative: Story = {
  args: {
    label: 'Error Field',
    color: 'negative',
    placeholder: 'Enter text...',
  },
}

/**
 * 権限不足や条件未達により編集できない状態を示す。
 *
 * @summary 編集できない状態を示す場合
 */
export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    isDisabled: true,
    placeholder: 'Cannot edit...',
  },
}

/**
 * フォーム送信に必須の項目であることをユーザーに明示する場合に使用。
 *
 * @summary 必須項目であることを明示する場合
 */
export const Required: Story = {
  args: {
    label: 'Required Field',
    isRequired: true,
    placeholder: 'Enter text...',
  },
}

/**
 * 編集フォームで既存データを表示する場合や、デフォルト値を設定する場合に使用。
 *
 * @summary 既存データやデフォルト値を表示する場合
 */
export const WithValue: Story = {
  args: {
    label: 'Field with value',
    defaultValue: 'Pre-filled value',
  },
}

/**
 * 説明文、コメント、問い合わせ内容など、複数行の長文入力が必要な場合に使用。
 *
 * @summary 複数行の長文入力が必要な場合
 */
export const Textarea: Story = {
  args: {
    label: 'Textarea',
    component: 'textarea',
    placeholder: 'Enter multiple lines...',
  },
}

/**
 * 長文入力欄に入力ルールや文字数制限を補足したい場合に使用。
 *
 * @summary 長文入力欄に入力ルールを補足する場合
 */
export const TextareaWithCaption: Story = {
  args: {
    label: 'Description',
    caption: 'Please provide a detailed description',
    component: 'textarea',
    placeholder: 'Enter description...',
  },
}
