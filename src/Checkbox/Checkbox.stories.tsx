import { Checkbox } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    isDisabled: {
      control: 'boolean',
    },
    isIndeterminate: {
      control: 'boolean',
    },
    isSelected: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/**
 * フォームで選択肢を提示する際の初期状態。ユーザーがまだ何も選んでいない場面で使用。
 *
 * @summary ユーザーが未操作の初期状態
 */
export const Default: Story = {
  args: {
    children: 'Checkbox Label',
  },
}

/**
 * ユーザーが項目を選択した後の状態。編集フォームで既存の選択値を表示する場合にも使用。
 *
 * @summary 項目を選択済みの状態
 */
export const Checked: Story = {
  args: {
    children: 'Checked Checkbox',
    isSelected: true,
  },
}

/**
 * 「全選択」チェックボックスで子項目の一部のみが選択されている場合に使用。
 *
 * @summary 子項目が部分的に選択されている場合
 */
export const Indeterminate: Story = {
  args: {
    children: 'Indeterminate Checkbox',
    isIndeterminate: true,
  },
}

/**
 * 権限不足や条件未達により選択を変更できない状態を示す。
 *
 * @summary 選択を変更できない場合
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled Checkbox',
    isDisabled: true,
  },
}

/**
 * 変更不可の設定値やシステムで強制されたオプションの表示に使用。
 *
 * @summary 変更不可の設定値を表示する場合
 */
export const DisabledChecked: Story = {
  args: {
    children: 'Disabled Checked',
    isSelected: true,
    isDisabled: true,
  },
}

/**
 * テーブル行の選択など、コンテキストからチェックボックスの意味が自明な場面で使用。別途 aria-label の付与を推奨。
 *
 * @summary コンテキストから意味が自明な場面向け
 */
export const WithoutLabel: Story = {
  args: {
    children: undefined,
  },
}

/**
 * 複数のチェックボックスを縦に並べたグループ。同意確認やオプション選択に使用。
 *
 * @summary チェックボックスグループ
 */
export const MultipleCheckboxes: Story = {
  args: {
    children: undefined,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Checkbox>利用規約に同意する</Checkbox>
      <Checkbox>プライバシーポリシーに同意する</Checkbox>
      <Checkbox>メールマガジンを受け取る</Checkbox>
    </div>
  ),
}

/**
 * フォーム内でのチェックボックス使用例。興味のある分野の選択など。
 *
 * @summary フォーム内での使用例
 */
export const InForm: Story = {
  args: {
    children: undefined,
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '400px',
      }}
    >
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 'bold' }}>
          興味のある分野を選択してください
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Checkbox>Web開発</Checkbox>
          <Checkbox>モバイルアプリ開発</Checkbox>
          <Checkbox>UI/UXデザイン</Checkbox>
          <Checkbox>データサイエンス</Checkbox>
        </div>
      </div>
    </div>
  ),
}
