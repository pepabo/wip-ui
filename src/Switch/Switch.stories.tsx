import { useState } from 'react'

import { Switch } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Forms/Switch',
  component: Switch,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['s', 'm', 'l'],
    },
    color: {
      control: 'select',
      options: ['neutral', 'interactive', 'negative'],
    },
    isDisabled: {
      control: 'boolean',
    },
    isSelected: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 通知のON/OFFなど、二者択一の設定を切り替える場面で使用。複数選択には Checkbox を使用する。
 *
 * @summary 二者択一の設定を切り替える場面向け
 */
export const Default: Story = {
  args: {
    label: 'Switch Label',
    size: 'm',
    color: 'neutral',
  },
}

/**
 * 設定が有効化された状態。編集フォームで既存の有効設定を表示する場合に該当。
 *
 * @summary 設定が有効化された状態
 */
export const Selected: Story = {
  args: {
    label: 'Switch (On)',
    size: 'm',
    isSelected: true,
  },
}

/**
 * 配置場所のスペースに応じてサイズを選択する際のリファレンス。
 *
 * @summary 配置場所に応じたサイズ選択のリファレンス
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Switch size="s" label="Small" />
      <Switch size="m" label="Medium" />
      <Switch size="l" label="Large" />
    </div>
  ),
}

/**
 * 機能の種類や重要度に応じたカラー選択のリファレンス。
 *
 * @summary 機能の種類に応じたカラー選択のリファレンス
 */
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Switch color="neutral" label="Neutral" />
      <Switch color="interactive" label="Interactive" />
      <Switch color="negative" label="Negative" />
      <Switch color="neutral" isSelected label="Neutral (On)" />
      <Switch color="interactive" isSelected label="Interactive (On)" />
      <Switch color="negative" isSelected label="Negative (On)" />
    </div>
  ),
}

/**
 * 全状態の組み合わせを一覧表示。デザインレビューや動作確認のリファレンス。
 *
 * @summary 全状態のデザインレビュー用リファレンス
 */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>All States</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Switch label="Off" />
          <Switch isSelected label="On" />
          <Switch isDisabled label="Disabled Off" />
          <Switch isSelected isDisabled label="Disabled On" />
        </div>
      </div>
    </div>
  ),
}

/**
 * テーブル行内など、外部のラベルで意味が明示されている場面で使用。別途 aria-label の付与を推奨。
 *
 * @summary 外部ラベルで意味が明示されている場面向け
 */
export const WithoutLabel: Story = {
  args: {
    size: 'm',
  },
}

/**
 * React の useState で制御する実装パターン。フォームの状態管理に使用。
 *
 * @summary useState による制御の実装パターン
 */
export const WithUseState = () => {
  const [isSelected, setIsSelected] = useState(false)
  return (
    <Switch
      isSelected={isSelected}
      onChange={() => setIsSelected(!isSelected)}
      label={isSelected ? 'On' : 'Off'}
    />
  )
}

/**
 * onChange で切り替えを検知し、API 呼び出しなど副作用を実行する実装パターン。
 *
 * @summary onChange で副作用を実行する実装パターン
 */
export const withOnChange = () => {
  const handleChange = () => {
    alert('Switch is changed')
  }
  return <Switch onChange={handleChange} label="Switch" />
}
