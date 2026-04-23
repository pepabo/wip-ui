import { Radio, RadioGroup } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Forms/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 複数の選択肢から1つだけを選ばせたい場合に使用。複数選択には Checkbox を使用する。
 *
 * @summary 排他的に1つだけ選ばせたい場合
 */
export const Default: Story = {
  args: {
    value: 'option1',
  },
  render: () => (
    <RadioGroup>
      <Radio value="option1">Option 1</Radio>
      <Radio value="option2">Option 2</Radio>
      <Radio value="option3">Option 3</Radio>
    </RadioGroup>
  ),
}

/**
 * スクリーンリーダー向けにグループの意味を伝えるため、aria-label の付与を推奨。
 *
 * @summary アクセシビリティのためのラベル付与
 */
export const WithLabel: Story = {
  args: {
    value: 'option1',
  },
  render: () => (
    <RadioGroup aria-label="Select an option">
      <Radio value="option1">Option 1</Radio>
      <Radio value="option2">Option 2</Radio>
      <Radio value="option3">Option 3</Radio>
    </RadioGroup>
  ),
}

/**
 * 編集フォームで既存値を表示する場合や、推奨選択肢をあらかじめ選んでおく場合に使用。
 *
 * @summary 既存値の表示や推奨選択肢の事前選択
 */
export const WithDefaultValue: Story = {
  args: {
    value: 'option2',
  },
  render: () => (
    <RadioGroup defaultValue="option2">
      <Radio value="option1">Option 1</Radio>
      <Radio value="option2">Option 2 (Default)</Radio>
      <Radio value="option3">Option 3</Radio>
    </RadioGroup>
  ),
}

/**
 * プランの制限や権限不足により、特定の選択肢を選べないようにする場合に使用。
 *
 * @summary 特定の選択肢を選べないようにする場合
 */
export const Disabled: Story = {
  args: {
    value: 'option1',
  },
  render: () => (
    <RadioGroup>
      <Radio value="option1">Option 1</Radio>
      <Radio value="option2" isDisabled>
        Option 2 (Disabled)
      </Radio>
      <Radio value="option3">Option 3</Radio>
    </RadioGroup>
  ),
}

/**
 * フォーム送信中や権限不足など、すべての選択肢を一時的に操作禁止にする場合に使用。
 *
 * @summary すべての選択肢を操作禁止にする場合
 */
export const DisabledGroup: Story = {
  args: {
    value: 'option1',
  },
  render: () => (
    <RadioGroup isDisabled>
      <Radio value="option1">Option 1</Radio>
      <Radio value="option2">Option 2</Radio>
      <Radio value="option3">Option 3</Radio>
    </RadioGroup>
  ),
}
