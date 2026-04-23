import { Breadcrumb, Breadcrumbs } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

/**
 * ホーム > カテゴリ > 現在ページのように、ユーザーに現在位置を示す基本的なナビゲーション。
 *
 * @summary ユーザーに現在位置を示す基本的なナビゲーション
 */
export const Default: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumb href="/">Home</Breadcrumb>
      <Breadcrumb href="/products">Products</Breadcrumb>
      <Breadcrumb>Current Page</Breadcrumb>
    </Breadcrumbs>
  ),
}

/**
 * ECサイトの商品ページなど、4階層以上の深いサイト構造でのナビゲーション。
 *
 * @summary 深い階層構造でのナビゲーション
 */
export const ECommercePage: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumb href="/">ホーム</Breadcrumb>
      <Breadcrumb href="/categories">カテゴリ一覧</Breadcrumb>
      <Breadcrumb href="/categories/electronics">家電・PC</Breadcrumb>
      <Breadcrumb href="/categories/electronics/computers">パソコン</Breadcrumb>
      <Breadcrumb>ノートパソコン 15.6インチ</Breadcrumb>
    </Breadcrumbs>
  ),
}

/**
 * トップ > 現在ページのような浅い階層構造で使用。
 *
 * @summary 浅い階層構造でのナビゲーション
 */
export const TwoLevels: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumb href="/">ホーム</Breadcrumb>
      <Breadcrumb>お問い合わせ</Breadcrumb>
    </Breadcrumbs>
  ),
}

/**
 * ブログ記事ページでのパンくずリスト。
 */
export const BlogPost: Story = {
  tags: ['!manifest'],
  render: () => (
    <Breadcrumbs>
      <Breadcrumb href="/">ホーム</Breadcrumb>
      <Breadcrumb href="/blog">ブログ</Breadcrumb>
      <Breadcrumb href="/blog/2024">2024年</Breadcrumb>
      <Breadcrumb>Webデザインのトレンド</Breadcrumb>
    </Breadcrumbs>
  ),
}

/**
 * 管理画面の設定ページでのパンくずリスト。
 */
export const AdminSettings: Story = {
  tags: ['!manifest'],
  render: () => (
    <Breadcrumbs>
      <Breadcrumb href="/dashboard">ダッシュボード</Breadcrumb>
      <Breadcrumb href="/settings">設定</Breadcrumb>
      <Breadcrumb href="/settings/account">アカウント設定</Breadcrumb>
      <Breadcrumb>プロフィール編集</Breadcrumb>
    </Breadcrumbs>
  ),
}

/**
 * 単一項目のパンくずリスト。ルートページで使用。
 */
export const SingleItem: Story = {
  tags: ['!manifest'],
  render: () => (
    <Breadcrumbs>
      <Breadcrumb href="/">Home</Breadcrumb>
    </Breadcrumbs>
  ),
}
