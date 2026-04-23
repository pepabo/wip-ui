import { Select, SelectItem } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Forms/Select',
  component: Select,
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
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 定義済みの選択肢から1つを選ばせる場合に使用する基本形。自由入力が必要な場合は TextField を使用する。
 *
 * @summary 定義済みの選択肢から1つを選ばせる基本形
 */
export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Select label="Select an option" placeholder="Choose...">
      <SelectItem id="option1">Option 1</SelectItem>
      <SelectItem id="option2">Option 2</SelectItem>
      <SelectItem id="option3">Option 3</SelectItem>
    </Select>
  ),
}

/**
 * 選択基準や注意事項をユーザーに伝えたい場合に補足説明を表示。
 *
 * @summary 選択基準や注意事項を補足する場合
 */
export const WithCaption: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Select
      label="Select an option"
      caption="Please select one of the options below"
      placeholder="Choose..."
    >
      <SelectItem id="option1">Option 1</SelectItem>
      <SelectItem id="option2">Option 2</SelectItem>
      <SelectItem id="option3">Option 3</SelectItem>
    </Select>
  ),
}

/**
 * テーブル内やインラインなど、スペースが限られる場面で使用。
 *
 * @summary スペースが限られる場面向けの小サイズ
 */
export const Small: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Select label="Small Select" size="s" placeholder="Choose...">
      <SelectItem id="option1">Option 1</SelectItem>
      <SelectItem id="option2">Option 2</SelectItem>
      <SelectItem id="option3">Option 3</SelectItem>
    </Select>
  ),
}

/**
 * 重要な選択やランディングページのフォームなど、目立たせたい場面で使用。
 *
 * @summary 重要な選択を目立たせたい場面向け
 */
export const Large: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Select label="Large Select" size="l" placeholder="Choose...">
      <SelectItem id="option1">Option 1</SelectItem>
      <SelectItem id="option2">Option 2</SelectItem>
      <SelectItem id="option3">Option 3</SelectItem>
    </Select>
  ),
}

/**
 * フォームレイアウトで他の入力要素と幅を揃えたい場合に使用。
 *
 * @summary フォーム内で幅を揃えたい場合
 */
export const FullWidth: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div style={{ width: '400px' }}>
      <Select label="Full Width Select" width="full" placeholder="Choose...">
        <SelectItem id="option1">Option 1</SelectItem>
        <SelectItem id="option2">Option 2</SelectItem>
        <SelectItem id="option3">Option 3</SelectItem>
      </Select>
    </div>
  ),
}

/**
 * 編集フォームで既存の選択値を表示する場合や、推奨値をあらかじめ設定する場合に使用。
 *
 * @summary 既存値の表示や推奨値の事前設定
 */
export const WithDefaultValue: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Select label="Select with default" defaultSelectedKey="option2" placeholder="Choose...">
      <SelectItem id="option1">Option 1</SelectItem>
      <SelectItem id="option2">Option 2 (Default)</SelectItem>
      <SelectItem id="option3">Option 3</SelectItem>
    </Select>
  ),
}

/**
 * 権限不足や他の選択に依存して変更できない場合に使用。
 *
 * @summary 条件により変更できない場合
 */
export const Disabled: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Select label="Disabled Select" isDisabled placeholder="Choose...">
      <SelectItem id="option1">Option 1</SelectItem>
      <SelectItem id="option2">Option 2</SelectItem>
      <SelectItem id="option3">Option 3</SelectItem>
    </Select>
  ),
}

/**
 * 都道府県や国名など選択肢が多い場合の表示。スクロール可能なドロップダウンで対応。
 *
 * @summary 選択肢が多数ある場合の表示確認
 */
export const ManyOptions: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Select label="Select with many options" placeholder="Choose...">
      {Array.from({ length: 20 }, (_, i) => (
        <SelectItem key={`option${i + 1}`} id={`option${i + 1}`}>
          Option {i + 1}
        </SelectItem>
      ))}
    </Select>
  ),
}
