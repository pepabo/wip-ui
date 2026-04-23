import { Stack } from './Stack'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Layout/Stack',
  component: Stack,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    flexDirection: {
      control: 'select',
      options: ['row', 'column'],
    },
    gap: {
      control: 'select',
      options: ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'],
    },
    alignItems: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'stretch'],
    },
    justifyContent: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between'],
    },
  },
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

const Box = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: '#e0e0e0',
      padding: '20px',
      borderRadius: '4px',
    }}
  >
    {children}
  </div>
)

/**
 * フォーム項目やセクションを縦に並べる、最も基本的なレイアウト。
 *
 * @summary 要素を縦に並べる基本レイアウト
 */
export const Default: Story = {
  render: () => (
    <Stack>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
}

/**
 * ボタングループやタグ一覧など、要素を横に並べたい場合に使用。
 *
 * @summary 要素を横に並べたい場合
 */
export const Row: Story = {
  render: () => (
    <Stack flexDirection="row">
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
}

/**
 * ラベルとヘルプテキストの間など、密に配置したい場合に使用。
 *
 * @summary 密に配置したい場合
 */
export const SmallGap: Story = {
  render: () => (
    <Stack gap="s">
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
}

/**
 * ページ内のセクション間など、大きな余白で視覚的に分離したい場合に使用。
 *
 * @summary 大きな余白で視覚的に分離したい場合
 */
export const LargeGap: Story = {
  render: () => (
    <Stack gap="xl">
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
}

/**
 * 異なる幅の要素を中央揃えで統一感を出したい場合に使用。
 *
 * @summary 異なる幅の要素を中央揃えにしたい場合
 */
export const AlignCenter: Story = {
  render: () => (
    <Stack alignItems="center">
      <Box>Short</Box>
      <Box>A bit longer item</Box>
      <Box>Long</Box>
    </Stack>
  ),
}

/**
 * ヘッダーのロゴとメニュー配置など、要素を両端に散らしたい場合に使用。
 *
 * @summary 要素を両端に散らしたい場合
 */
export const JustifySpaceBetween: Story = {
  render: () => (
    <Stack flexDirection="row" justifyContent="space-between">
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
}

/**
 * ページ中央にボタングループを配置するなど、横並び要素を中央寄せしたい場合に使用。
 *
 * @summary 横並び要素を中央寄せしたい場合
 */
export const RowCentered: Story = {
  render: () => (
    <Stack flexDirection="row" alignItems="center" justifyContent="center">
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
}

/**
 * ブレークポイントごとに方向を変更。モバイルでは縦、デスクトップでは横に並ぶ。
 *
 * @summary レスポンシブな方向変更
 */
export const ResponsiveDirection: Story = {
  render: () => (
    <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="m">
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
}

/**
 * ブレークポイントごとにスペースを変更。画面幅に応じた最適な余白を実現。
 *
 * @summary レスポンシブなスペース変更
 */
export const ResponsiveGap: Story = {
  render: () => (
    <Stack gap={{ xxs: 's', m: 'l', xl: 'xxl' }}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
}

/**
 * 方向とスペースの両方をレスポンシブに変更する組み合わせ例。
 *
 * @summary 方向とスペースのレスポンシブ設定
 */
export const ResponsiveDirectionAndGap: Story = {
  render: () => (
    <Stack
      flexDirection={{ xxs: 'column', m: 'row' }}
      gap={{ xxs: 's', m: 'l' }}
      alignItems="center"
    >
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
}
