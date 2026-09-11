import { useState } from 'react'
import { TabPanel } from 'react-aria-components'

import { AppBar, AppBarLeading, AppBarTrailing } from '../../AppBar'
import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Checkbox } from '../../Checkbox'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Paper } from '../../Paper'
import { Radio, RadioGroup } from '../../Radio'
import { Select, SelectItem } from '../../Select'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Switch } from '../../Switch'
import { Tab, TabList, Tabs } from '../../Tab'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../Table'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { IconName } from '../../Icon'
import type { StickerColor } from '../../Sticker'

const meta = {
  title: 'Templates/Dashboard',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

type PageId = 'dashboard' | 'products' | 'notifications' | 'settings'

const navItems: { id: PageId; icon: IconName; label: string; badge?: number }[] = [
  { id: 'dashboard', icon: 'home', label: 'ダッシュボード' },
  { id: 'products', icon: 'note', label: '商品管理' },
  { id: 'notifications', icon: 'bell', label: '通知', badge: 4 },
  { id: 'settings', icon: 'gear', label: '設定' },
]

// ─── Shared helpers ───

const InitialAvatar = ({ initial, bg }: { initial: string; bg: string }) => (
  <div
    className="wip-avatar -size-xs"
    style={{
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Typography size="xxs" fontWeight="bold">
      {initial}
    </Typography>
  </div>
)

const SectionCard = ({
  title,
  description,
  children,
  action,
}: {
  title: string
  description?: string
  children: React.ReactNode
  action?: React.ReactNode
}) => (
  <Paper elevation={1}>
    <div style={{ padding: '24px' }}>
      <Stack gap="m">
        <Stack flexDirection="row" justifyContent="space-between" alignItems="flex-start">
          <Stack gap="xs">
            <Typography size="l" fontWeight="bold">
              {title}
            </Typography>
            {description && (
              <Typography size="s" color="medium_emphasis">
                {description}
              </Typography>
            )}
          </Stack>
          {action}
        </Stack>
        <Divider />
        {children}
      </Stack>
    </div>
  </Paper>
)

const ToggleRow = ({
  title,
  description,
  defaultOn = false,
}: {
  title: string
  description: string
  defaultOn?: boolean
}) => (
  <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
    <Stack gap="xxs">
      <Typography size="m" fontWeight="bold">
        {title}
      </Typography>
      <Typography size="s" color="medium_emphasis">
        {description}
      </Typography>
    </Stack>
    <Switch label="" defaultSelected={defaultOn} />
  </Stack>
)

// ─── Dashboard page data ───

const StatCard = ({
  icon,
  label,
  value,
  change,
  positive,
  sublabel,
}: {
  icon: IconName
  label: string
  value: string
  change: string
  positive: boolean
  sublabel: string
}) => (
  <Paper elevation={1}>
    <div style={{ padding: '20px' }}>
      <Stack gap="s">
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Typography size="s" color="medium_emphasis">
            {label}
          </Typography>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--wip-color-surface-interactive)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={icon} size="s" />
          </div>
        </Stack>
        <Typography size="xxl" fontWeight="bold">
          {value}
        </Typography>
        <Stack flexDirection="row" gap="xs" alignItems="center">
          <Sticker color={positive ? 'positive' : 'negative'} size="s">
            {change}
          </Sticker>
          <Typography size="xs" color="medium_emphasis">
            {sublabel}
          </Typography>
        </Stack>
      </Stack>
    </div>
  </Paper>
)

const weeklyData = [
  { day: '月', value: 65 },
  { day: '火', value: 80 },
  { day: '水', value: 45 },
  { day: '木', value: 90 },
  { day: '金', value: 72 },
  { day: '土', value: 100 },
  { day: '日', value: 58 },
]

const SalesChart = () => (
  <Paper elevation={1}>
    <div style={{ padding: '20px' }}>
      <Stack gap="m">
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Stack gap="xxs">
            <Typography size="m" fontWeight="bold">
              週間売上推移
            </Typography>
            <Typography size="xs" color="medium_emphasis">
              直近7日間の売上データ
            </Typography>
          </Stack>
          <Typography size="l" fontWeight="bold">
            ¥487,200
          </Typography>
        </Stack>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '12px',
            height: '160px',
            paddingTop: '16px',
          }}
        >
          {weeklyData.map((d) => (
            <div
              key={d.day}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: `${d.value * 1.4}px`,
                  background: 'var(--wip-color-surface-interactive)',
                  borderRadius: '4px 4px 0 0',
                  minHeight: '8px',
                }}
              />
              <Typography size="xxs" color="medium_emphasis">
                {d.day}
              </Typography>
            </div>
          ))}
        </div>
      </Stack>
    </div>
  </Paper>
)

const activityItems = [
  {
    icon: 'cart' as IconName,
    text: '田中太郎さんが注文 #ORD-2401 を完了',
    time: '5分前',
    color: 'positive' as const,
  },
  {
    icon: 'star' as IconName,
    text: '「ハンドメイドマグカップ」に★5のレビュー',
    time: '23分前',
    color: 'informative' as const,
  },
  {
    icon: 'person_plus' as IconName,
    text: '新規顧客: 高橋健太さんがアカウント作成',
    time: '1時間前',
    color: 'informative' as const,
  },
  {
    icon: 'note' as IconName,
    text: '「刺繍トートバッグ」の在庫が残り3点',
    time: '2時間前',
    color: 'notice' as const,
  },
  {
    icon: 'cart' as IconName,
    text: '佐藤一郎さんが注文 #ORD-2399 を確定',
    time: '3時間前',
    color: 'positive' as const,
  },
]

const ActivityFeed = () => (
  <Paper elevation={1}>
    <div style={{ padding: '20px' }}>
      <Stack gap="m">
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Typography size="m" fontWeight="bold">
            最近のアクティビティ
          </Typography>
          <Button appearance="transparent" size="s">
            <Typography size="xs" color="informative">
              すべて見る
            </Typography>
          </Button>
        </Stack>
        <Stack gap="s">
          {activityItems.map((item, i) => (
            <div key={item.text}>
              <Stack flexDirection="row" gap="s" alignItems="flex-start">
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: `var(--wip-color-surface-${item.color})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon name={item.icon} size="s" />
                </div>
                <Stack gap="xxs">
                  <Typography size="s">{item.text}</Typography>
                  <Typography size="xxs" color="low_emphasis">
                    {item.time}
                  </Typography>
                </Stack>
              </Stack>
              {i < activityItems.length - 1 && (
                <div style={{ paddingLeft: '44px', paddingTop: '8px' }}>
                  <Divider />
                </div>
              )}
            </div>
          ))}
        </Stack>
      </Stack>
    </div>
  </Paper>
)

const orderRows = [
  {
    id: '#ORD-2401',
    name: '田中太郎',
    initial: '田',
    bg: 'var(--wip-color-surface-interactive)',
    product: 'ハンドメイドマグカップ',
    price: '¥3,200',
    status: '発送済',
    statusColor: 'positive' as const,
    date: '2026-08-31',
  },
  {
    id: '#ORD-2400',
    name: '鈴木花子',
    initial: '鈴',
    bg: 'var(--wip-color-surface-notice)',
    product: 'レザーキーケース',
    price: '¥5,800',
    status: '準備中',
    statusColor: 'informative' as const,
    date: '2026-08-31',
  },
  {
    id: '#ORD-2399',
    name: '佐藤一郎',
    initial: '佐',
    bg: 'var(--wip-color-surface-negative)',
    product: 'シルバーリング',
    price: '¥12,000',
    status: '入金待ち',
    statusColor: 'notice' as const,
    date: '2026-08-30',
  },
  {
    id: '#ORD-2398',
    name: '山田美咲',
    initial: '山',
    bg: 'var(--wip-color-surface-positive)',
    product: '刺繍トートバッグ',
    price: '¥4,500',
    status: '発送済',
    statusColor: 'positive' as const,
    date: '2026-08-30',
  },
  {
    id: '#ORD-2397',
    name: '高橋健太',
    initial: '高',
    bg: 'var(--wip-color-surface-informative)',
    product: '木製スマホスタンド',
    price: '¥2,800',
    status: '発送済',
    statusColor: 'positive' as const,
    date: '2026-08-29',
  },
  {
    id: '#ORD-2396',
    name: '伊藤めぐみ',
    initial: '伊',
    bg: 'var(--wip-color-surface-interactive)',
    product: 'ドライフラワーリース',
    price: '¥6,200',
    status: '発送済',
    statusColor: 'positive' as const,
    date: '2026-08-29',
  },
]

const OrderTable = () => (
  <Table aria-label="最近の注文">
    <TableHeader>
      <Column>注文ID</Column>
      <Column>顧客</Column>
      <Column>商品</Column>
      <Column>金額</Column>
      <Column>日付</Column>
      <Column>ステータス</Column>
    </TableHeader>
    <TableBody>
      {orderRows.map((row) => (
        <Row key={row.id}>
          <Cell>
            <Typography size="s" fontWeight="bold">
              {row.id}
            </Typography>
          </Cell>
          <Cell>
            <Stack flexDirection="row" gap="xs" alignItems="center">
              <InitialAvatar initial={row.initial} bg={row.bg} />
              <Typography size="s">{row.name}</Typography>
            </Stack>
          </Cell>
          <Cell>
            <Typography size="s">{row.product}</Typography>
          </Cell>
          <Cell>
            <Typography size="s">{row.price}</Typography>
          </Cell>
          <Cell>
            <Typography size="s" color="medium_emphasis">
              {row.date}
            </Typography>
          </Cell>
          <Cell>
            <Sticker color={row.statusColor} size="s">
              {row.status}
            </Sticker>
          </Cell>
        </Row>
      ))}
    </TableBody>
  </Table>
)

// ─── Products page data ───

const products = [
  {
    id: 'P-001',
    name: 'ハンドメイドマグカップ',
    category: '食器',
    price: '¥3,200',
    stock: 24,
    status: '公開中',
    statusColor: 'positive' as StickerColor,
    sales: 156,
  },
  {
    id: 'P-002',
    name: 'レザーキーケース',
    category: 'アクセサリー',
    price: '¥5,800',
    stock: 8,
    status: '公開中',
    statusColor: 'positive' as StickerColor,
    sales: 89,
  },
  {
    id: 'P-003',
    name: 'シルバーリング',
    category: 'アクセサリー',
    price: '¥12,000',
    stock: 3,
    status: '残りわずか',
    statusColor: 'notice' as StickerColor,
    sales: 234,
  },
  {
    id: 'P-004',
    name: '刺繍トートバッグ',
    category: 'バッグ',
    price: '¥4,500',
    stock: 15,
    status: '公開中',
    statusColor: 'positive' as StickerColor,
    sales: 67,
  },
  {
    id: 'P-005',
    name: '木製スマホスタンド',
    category: 'インテリア',
    price: '¥2,800',
    stock: 42,
    status: '公開中',
    statusColor: 'positive' as StickerColor,
    sales: 312,
  },
  {
    id: 'P-006',
    name: 'ドライフラワーリース',
    category: 'インテリア',
    price: '¥6,200',
    stock: 0,
    status: '売り切れ',
    statusColor: 'negative' as StickerColor,
    sales: 45,
  },
  {
    id: 'P-007',
    name: '手編みニット帽',
    category: 'ファッション',
    price: '¥3,500',
    stock: 19,
    status: '下書き',
    statusColor: 'neutral' as StickerColor,
    sales: 0,
  },
  {
    id: 'P-008',
    name: 'ステンドグラスランプ',
    category: 'インテリア',
    price: '¥18,000',
    stock: 5,
    status: '公開中',
    statusColor: 'positive' as StickerColor,
    sales: 28,
  },
  {
    id: 'P-009',
    name: '革製ブックカバー',
    category: 'アクセサリー',
    price: '¥4,200',
    stock: 31,
    status: '公開中',
    statusColor: 'positive' as StickerColor,
    sales: 178,
  },
  {
    id: 'P-010',
    name: '陶器の箸置きセット',
    category: '食器',
    price: '¥1,800',
    stock: 56,
    status: '公開中',
    statusColor: 'positive' as StickerColor,
    sales: 423,
  },
]

const ProductImage = () => (
  <div
    style={{
      width: '40px',
      height: '40px',
      borderRadius: '6px',
      background: 'var(--wip-color-surface-container)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <Icon name="image" size="s" />
  </div>
)

// ─── Notifications page data ───

type Notification = {
  id: string
  icon: IconName
  title: string
  body: string
  time: string
  read: boolean
  category: string
  categoryColor: StickerColor
}

const notifications: Notification[] = [
  {
    id: '1',
    icon: 'cart',
    title: '新しい注文が入りました',
    body: '田中太郎さんから「ハンドメイドマグカップ」の注文（#ORD-2401）が入りました。',
    time: '5分前',
    read: false,
    category: '注文',
    categoryColor: 'positive',
  },
  {
    id: '2',
    icon: 'star',
    title: '新しいレビューが投稿されました',
    body: '「レザーキーケース」に★4のレビューが投稿されました。「質感がとても良く、プレゼントにも最適です」',
    time: '30分前',
    read: false,
    category: 'レビュー',
    categoryColor: 'informative',
  },
  {
    id: '3',
    icon: 'exclamation_on_triangle',
    title: '在庫が残りわずかです',
    body: '「シルバーリング」の在庫が残り3点です。補充の検討をおすすめします。',
    time: '1時間前',
    read: false,
    category: '在庫',
    categoryColor: 'notice',
  },
  {
    id: '4',
    icon: 'cross_on_circle',
    title: '決済エラーが発生しました',
    body: '注文 #ORD-2395 の決済処理に失敗しました。顧客に連絡してください。',
    time: '2時間前',
    read: false,
    category: 'エラー',
    categoryColor: 'negative',
  },
  {
    id: '5',
    icon: 'person_plus',
    title: '新規フォロワー',
    body: '佐藤花子さんがあなたのショップをフォローしました。',
    time: '3時間前',
    read: true,
    category: 'ソーシャル',
    categoryColor: 'informative',
  },
  {
    id: '6',
    icon: 'info_on_circle',
    title: 'システムメンテナンスのお知らせ',
    body: '9月5日 02:00-06:00 にシステムメンテナンスを実施します。この間サービスをご利用いただけません。',
    time: '5時間前',
    read: true,
    category: 'お知らせ',
    categoryColor: 'neutral',
  },
  {
    id: '7',
    icon: 'check_on_circle',
    title: '出金処理が完了しました',
    body: '8月分の売上 ¥128,500 の出金処理が完了しました。3営業日以内に口座に反映されます。',
    time: '1日前',
    read: true,
    category: '入出金',
    categoryColor: 'positive',
  },
  {
    id: '8',
    icon: 'mail',
    title: 'お問い合わせを受信しました',
    body: '山田太郎さんから「刺繍トートバッグのカスタムオーダーについて」のお問い合わせが届きました。',
    time: '1日前',
    read: true,
    category: 'お問い合わせ',
    categoryColor: 'informative',
  },
  {
    id: '9',
    icon: 'exclamation_on_triangle',
    title: 'セキュリティアラート',
    body: '新しいデバイス（iPhone, Safari）からのログインが検出されました。心当たりがない場合はパスワードを変更してください。',
    time: '2日前',
    read: true,
    category: 'セキュリティ',
    categoryColor: 'attention',
  },
  {
    id: '10',
    icon: 'note',
    title: '商品が非公開になりました',
    body: '「ドライフラワーリース」が在庫切れのため自動的に非公開になりました。',
    time: '3日前',
    read: true,
    category: '商品',
    categoryColor: 'neutral',
  },
]

const colorToBg: Record<string, string> = {
  positive: 'var(--wip-color-surface-positive, #e8f5e9)',
  negative: 'var(--wip-color-surface-negative, #fce4ec)',
  notice: 'var(--wip-color-surface-notice, #fff3e0)',
  informative: 'var(--wip-color-surface-informative, #e3f2fd)',
  neutral: 'var(--wip-color-surface-container, #f5f5f5)',
  attention: 'var(--wip-color-surface-notice, #fff3e0)',
}

// ─── Page content components ───

const DashboardContent = ({
  period,
  setPeriod,
}: {
  period: string
  setPeriod: (v: string) => void
}) => (
  <Stack gap="l">
    <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
      <Stack gap="xs">
        <Typography size="xl" fontWeight="bold">
          ダッシュボード
        </Typography>
        <Typography size="s" color="medium_emphasis">
          おかえりなさい。ショップの概況です。
        </Typography>
      </Stack>
      <Stack flexDirection="row" gap="s" alignItems="center">
        <Select
          label=""
          aria-label="期間"
          selectedKey={period}
          onSelectionChange={(key) => setPeriod(key as string)}
          size="s"
        >
          <SelectItem id="week">今週</SelectItem>
          <SelectItem id="month">今月</SelectItem>
          <SelectItem id="year">今年</SelectItem>
        </Select>
        <Button appearance="outlined" size="s" leading={<Icon name="download" size="s" />}>
          エクスポート
        </Button>
      </Stack>
    </Stack>

    <Callout
      color="informative"
      action={
        <Button appearance="transparent" size="s">
          詳細
        </Button>
      }
    >
      <Typography size="s">
        新機能: 商品レビューの一括管理機能がリリースされました。設定ページから有効にできます。
      </Typography>
    </Callout>

    <Grid spacing="m">
      <GridItem size={{ xxs: 12, s: 6, l: 3 }}>
        <StatCard
          icon="cart"
          label="売上"
          value="¥1,234,567"
          change="+12.5%"
          positive
          sublabel="先月比"
        />
      </GridItem>
      <GridItem size={{ xxs: 12, s: 6, l: 3 }}>
        <StatCard
          icon="note"
          label="注文数"
          value="342件"
          change="+8.2%"
          positive
          sublabel="先月比"
        />
      </GridItem>
      <GridItem size={{ xxs: 12, s: 6, l: 3 }}>
        <StatCard
          icon="people"
          label="新規顧客"
          value="89人"
          change="-3.1%"
          positive={false}
          sublabel="先月比"
        />
      </GridItem>
      <GridItem size={{ xxs: 12, s: 6, l: 3 }}>
        <StatCard
          icon="star"
          label="平均評価"
          value="4.8"
          change="+0.3"
          positive
          sublabel="先月比"
        />
      </GridItem>
    </Grid>

    <Grid spacing="m">
      <GridItem size={{ xxs: 12, l: 8 }}>
        <SalesChart />
      </GridItem>
      <GridItem size={{ xxs: 12, l: 4 }}>
        <ActivityFeed />
      </GridItem>
    </Grid>

    <Grid spacing="m">
      <GridItem size={{ xxs: 12, s: 6, m: 3 }}>
        <Paper elevation={1}>
          <div style={{ padding: '16px', cursor: 'pointer' }}>
            <Stack flexDirection="row" gap="s" alignItems="center">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'var(--wip-color-surface-interactive)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon name="plus" size="s" />
              </div>
              <Stack gap="xxs">
                <Typography size="s" fontWeight="bold">
                  商品を追加
                </Typography>
                <Typography size="xxs" color="medium_emphasis">
                  新しい商品を出品
                </Typography>
              </Stack>
            </Stack>
          </div>
        </Paper>
      </GridItem>
      <GridItem size={{ xxs: 12, s: 6, m: 3 }}>
        <Paper elevation={1}>
          <div style={{ padding: '16px', cursor: 'pointer' }}>
            <Stack flexDirection="row" gap="s" alignItems="center">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'var(--wip-color-surface-positive)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon name="cart" size="s" />
              </div>
              <Stack gap="xxs">
                <Typography size="s" fontWeight="bold">
                  注文を処理
                </Typography>
                <Typography size="xxs" color="medium_emphasis">
                  未処理の注文を確認
                </Typography>
              </Stack>
            </Stack>
          </div>
        </Paper>
      </GridItem>
      <GridItem size={{ xxs: 12, s: 6, m: 3 }}>
        <Paper elevation={1}>
          <div style={{ padding: '16px', cursor: 'pointer' }}>
            <Stack flexDirection="row" gap="s" alignItems="center">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'var(--wip-color-surface-notice)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon name="mail" size="s" />
              </div>
              <Stack gap="xxs">
                <Typography size="s" fontWeight="bold">
                  お問い合わせ
                </Typography>
                <Typography size="xxs" color="medium_emphasis">
                  2件の未対応
                </Typography>
              </Stack>
            </Stack>
          </div>
        </Paper>
      </GridItem>
      <GridItem size={{ xxs: 12, s: 6, m: 3 }}>
        <Paper elevation={1}>
          <div style={{ padding: '16px', cursor: 'pointer' }}>
            <Stack flexDirection="row" gap="s" alignItems="center">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'var(--wip-color-surface-informative)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon name="funnel" size="s" />
              </div>
              <Stack gap="xxs">
                <Typography size="s" fontWeight="bold">
                  分析を見る
                </Typography>
                <Typography size="xxs" color="medium_emphasis">
                  売上レポート
                </Typography>
              </Stack>
            </Stack>
          </div>
        </Paper>
      </GridItem>
    </Grid>

    <Grid spacing="m">
      <GridItem size={{ xxs: 12, l: 4 }}>
        <Paper elevation={1}>
          <div style={{ padding: '20px' }}>
            <Stack gap="m">
              <Typography size="m" fontWeight="bold">
                人気商品ランキング
              </Typography>
              <Divider />
              {[
                {
                  rank: 1,
                  name: '陶器の箸置きセット',
                  sales: 423,
                  trend: '+15%',
                  trendPositive: true,
                },
                {
                  rank: 2,
                  name: '木製スマホスタンド',
                  sales: 312,
                  trend: '+8%',
                  trendPositive: true,
                },
                { rank: 3, name: 'シルバーリング', sales: 234, trend: '+22%', trendPositive: true },
                {
                  rank: 4,
                  name: '革製ブックカバー',
                  sales: 178,
                  trend: '-5%',
                  trendPositive: false,
                },
                {
                  rank: 5,
                  name: 'ハンドメイドマグカップ',
                  sales: 156,
                  trend: '+3%',
                  trendPositive: true,
                },
              ].map((item, i) => (
                <div key={item.rank}>
                  <Stack flexDirection="row" gap="s" alignItems="center">
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background:
                          i < 3
                            ? 'var(--wip-color-surface-interactive)'
                            : 'var(--wip-color-surface-container)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Typography size="xxs" fontWeight="bold">
                        {item.rank}
                      </Typography>
                    </div>
                    <Stack gap="xxs">
                      <Typography size="s" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Stack flexDirection="row" gap="xs" alignItems="center">
                        <Typography size="xxs" color="medium_emphasis">
                          {item.sales}件
                        </Typography>
                        <Sticker color={item.trendPositive ? 'positive' : 'negative'} size="s">
                          {item.trend}
                        </Sticker>
                      </Stack>
                    </Stack>
                  </Stack>
                  {i < 4 && (
                    <div style={{ paddingLeft: '40px', paddingTop: '12px' }}>
                      <Divider />
                    </div>
                  )}
                </div>
              ))}
            </Stack>
          </div>
        </Paper>
      </GridItem>

      <GridItem size={{ xxs: 12, l: 8 }}>
        <Paper elevation={1}>
          <div style={{ padding: '20px' }}>
            <Stack gap="m">
              <Tabs>
                <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                  <TabList>
                    <Tab id="recent">最近の注文</Tab>
                    <Tab id="pending">未処理</Tab>
                    <Tab id="completed">完了済み</Tab>
                  </TabList>
                  <Stack flexDirection="row" gap="s" alignItems="center">
                    <TextField aria-label="注文を検索" placeholder="注文を検索..." size="s" />
                    <Button
                      appearance="outlined"
                      size="s"
                      leading={<Icon name="funnel" size="s" />}
                    >
                      フィルター
                    </Button>
                  </Stack>
                </Stack>
                <Divider />
                <TabPanel id="recent">
                  <OrderTable />
                </TabPanel>
                <TabPanel id="pending">
                  <div style={{ padding: '48px', textAlign: 'center' }}>
                    <Stack gap="m" alignItems="center">
                      <div
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          background: 'var(--wip-color-surface-positive)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon name="check_on_circle" size="l" />
                      </div>
                      <Typography size="m" fontWeight="bold">
                        未処理の注文はありません
                      </Typography>
                      <Typography size="s" color="medium_emphasis">
                        すべての注文が処理済みです。新しい注文が入ると、ここに表示されます。
                      </Typography>
                    </Stack>
                  </div>
                </TabPanel>
                <TabPanel id="completed">
                  <OrderTable />
                </TabPanel>
              </Tabs>
            </Stack>
          </div>
        </Paper>
      </GridItem>
    </Grid>
  </Stack>
)

const ProductsContent = ({ onDeleteOpen }: { onDeleteOpen: () => void }) => (
  <Stack gap="l">
    <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
      <Stack gap="xs">
        <Typography size="xl" fontWeight="bold">
          商品管理
        </Typography>
        <Typography size="s" color="medium_emphasis">
          {products.length}件の商品を管理中
        </Typography>
      </Stack>
      <Stack flexDirection="row" gap="s">
        <Button appearance="outlined" size="s" leading={<Icon name="upload" size="s" />}>
          CSVインポート
        </Button>
        <Button appearance="outlined" size="s" leading={<Icon name="download" size="s" />}>
          CSVエクスポート
        </Button>
        <Button color="interactive" size="s" leading={<Icon name="plus" size="s" />}>
          商品を追加
        </Button>
      </Stack>
    </Stack>

    <Grid spacing="m">
      <GridItem size={{ xxs: 6, m: 3 }}>
        <Paper elevation={0} outlined>
          <div style={{ padding: '16px' }}>
            <Stack gap="xs">
              <Stack flexDirection="row" gap="xs" alignItems="center">
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--wip-color-surface-positive)',
                  }}
                />
                <Typography size="xs" color="medium_emphasis">
                  公開中
                </Typography>
              </Stack>
              <Typography size="l" fontWeight="bold">
                7
              </Typography>
            </Stack>
          </div>
        </Paper>
      </GridItem>
      <GridItem size={{ xxs: 6, m: 3 }}>
        <Paper elevation={0} outlined>
          <div style={{ padding: '16px' }}>
            <Stack gap="xs">
              <Stack flexDirection="row" gap="xs" alignItems="center">
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--wip-color-surface-notice)',
                  }}
                />
                <Typography size="xs" color="medium_emphasis">
                  残りわずか
                </Typography>
              </Stack>
              <Typography size="l" fontWeight="bold" color="notice">
                1
              </Typography>
            </Stack>
          </div>
        </Paper>
      </GridItem>
      <GridItem size={{ xxs: 6, m: 3 }}>
        <Paper elevation={0} outlined>
          <div style={{ padding: '16px' }}>
            <Stack gap="xs">
              <Stack flexDirection="row" gap="xs" alignItems="center">
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--wip-color-surface-negative)',
                  }}
                />
                <Typography size="xs" color="medium_emphasis">
                  売り切れ
                </Typography>
              </Stack>
              <Typography size="l" fontWeight="bold" color="negative">
                1
              </Typography>
            </Stack>
          </div>
        </Paper>
      </GridItem>
      <GridItem size={{ xxs: 6, m: 3 }}>
        <Paper elevation={0} outlined>
          <div style={{ padding: '16px' }}>
            <Stack gap="xs">
              <Stack flexDirection="row" gap="xs" alignItems="center">
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--wip-color-surface-container)',
                  }}
                />
                <Typography size="xs" color="medium_emphasis">
                  下書き
                </Typography>
              </Stack>
              <Typography size="l" fontWeight="bold">
                1
              </Typography>
            </Stack>
          </div>
        </Paper>
      </GridItem>
    </Grid>

    <Callout
      color="notice"
      action={
        <Button appearance="transparent" size="s">
          在庫を確認
        </Button>
      }
    >
      <Typography size="s">
        「シルバーリング」の在庫が残り3点です。「ドライフラワーリース」は在庫切れです。
      </Typography>
    </Callout>

    <Paper elevation={1}>
      <div style={{ padding: '20px' }}>
        <Stack gap="m">
          <Stack flexDirection="row" gap="s" alignItems="flex-end">
            <div style={{ flex: 1 }}>
              <TextField
                aria-label="商品を検索"
                placeholder="商品名、ID で検索..."
                width="full"
                size="s"
              />
            </div>
            <Select label="" aria-label="カテゴリ" placeholder="カテゴリ" size="s">
              <SelectItem id="all">すべて</SelectItem>
              <SelectItem id="tableware">食器</SelectItem>
              <SelectItem id="accessory">アクセサリー</SelectItem>
              <SelectItem id="bag">バッグ</SelectItem>
              <SelectItem id="interior">インテリア</SelectItem>
              <SelectItem id="fashion">ファッション</SelectItem>
            </Select>
            <Select label="" aria-label="ステータス" placeholder="ステータス" size="s">
              <SelectItem id="all">すべて</SelectItem>
              <SelectItem id="published">公開中</SelectItem>
              <SelectItem id="draft">下書き</SelectItem>
              <SelectItem id="soldout">売り切れ</SelectItem>
            </Select>
            <Select label="" aria-label="並び替え" placeholder="並び替え" size="s">
              <SelectItem id="newest">新しい順</SelectItem>
              <SelectItem id="sales">売上順</SelectItem>
              <SelectItem id="price-asc">価格: 安い順</SelectItem>
              <SelectItem id="price-desc">価格: 高い順</SelectItem>
              <SelectItem id="stock">在庫少ない順</SelectItem>
            </Select>
          </Stack>

          <div
            style={{
              padding: '8px 12px',
              background: 'var(--wip-color-surface-container)',
              borderRadius: '8px',
            }}
          >
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
              <Stack flexDirection="row" gap="s" alignItems="center">
                <Checkbox>すべて選択</Checkbox>
                <Typography size="xs" color="medium_emphasis">
                  0件選択中
                </Typography>
              </Stack>
              <Stack flexDirection="row" gap="xs">
                <Button appearance="transparent" size="s" color="negative" onPress={onDeleteOpen}>
                  削除
                </Button>
                <Button appearance="transparent" size="s">
                  非公開にする
                </Button>
              </Stack>
            </Stack>
          </div>

          <Divider />

          <Table aria-label="商品一覧" selectionMode="multiple">
            <TableHeader>
              <Column>商品</Column>
              <Column>カテゴリ</Column>
              <Column>価格</Column>
              <Column>在庫</Column>
              <Column>販売数</Column>
              <Column>ステータス</Column>
              <Column>操作</Column>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <Row key={product.id}>
                  <Cell>
                    <Stack flexDirection="row" gap="s" alignItems="center">
                      <ProductImage />
                      <Stack gap="xxs">
                        <Typography size="s" fontWeight="bold">
                          {product.name}
                        </Typography>
                        <Typography size="xxs" color="low_emphasis">
                          {product.id}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Cell>
                  <Cell>
                    <Typography size="s">{product.category}</Typography>
                  </Cell>
                  <Cell>
                    <Typography size="s" fontWeight="bold">
                      {product.price}
                    </Typography>
                  </Cell>
                  <Cell>
                    <Typography
                      size="s"
                      color={
                        product.stock === 0
                          ? 'negative'
                          : product.stock <= 5
                            ? 'notice'
                            : 'high_emphasis'
                      }
                    >
                      {product.stock}
                    </Typography>
                  </Cell>
                  <Cell>
                    <Typography size="s">{product.sales}</Typography>
                  </Cell>
                  <Cell>
                    <Sticker color={product.statusColor} size="s">
                      {product.status}
                    </Sticker>
                  </Cell>
                  <Cell>
                    <Stack flexDirection="row" gap="xs">
                      <Button appearance="transparent" iconOnly size="s" aria-label="編集">
                        <Icon name="pencil" size="s" />
                      </Button>
                      <Button appearance="transparent" iconOnly size="s" aria-label="その他">
                        <Icon name="ellipsis_horizontal" size="s" />
                      </Button>
                    </Stack>
                  </Cell>
                </Row>
              ))}
            </TableBody>
          </Table>

          <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
            <Typography size="xs" color="medium_emphasis">
              1-10 / 全{products.length}件
            </Typography>
            <Stack flexDirection="row" gap="xs">
              <Button appearance="outlined" size="s" iconOnly aria-label="前のページ">
                <Icon name="chevron_left" size="s" />
              </Button>
              <Button appearance="flat" size="s" iconOnly aria-label="ページ1">
                <Typography size="xs" fontWeight="bold">
                  1
                </Typography>
              </Button>
              <Button appearance="outlined" size="s" iconOnly aria-label="次のページ">
                <Icon name="chevron_right" size="s" />
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </div>
    </Paper>
  </Stack>
)

const NotificationsContent = () => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const displayed = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Stack gap="l">
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
        <Stack gap="xs">
          <Stack flexDirection="row" gap="s" alignItems="center">
            <Typography size="xl" fontWeight="bold">
              通知
            </Typography>
            {unreadCount > 0 && (
              <Sticker color="negative" size="s">
                {unreadCount}件の未読
              </Sticker>
            )}
          </Stack>
          <Typography size="s" color="medium_emphasis">
            ショップに関するすべての通知を確認できます
          </Typography>
        </Stack>
        <Button appearance="transparent" size="s">
          すべて既読にする
        </Button>
      </Stack>

      <Callout color="positive">
        <Typography size="s">今月の売上が先月を上回りました。好調です！</Typography>
      </Callout>

      <Stack flexDirection="row" gap="s">
        <Button
          appearance={filter === 'all' ? 'flat' : 'outlined'}
          size="s"
          onPress={() => setFilter('all')}
        >
          すべて ({notifications.length})
        </Button>
        <Button
          appearance={filter === 'unread' ? 'flat' : 'outlined'}
          size="s"
          onPress={() => setFilter('unread')}
        >
          未読 ({unreadCount})
        </Button>
      </Stack>

      <Paper elevation={1}>
        <Stack gap="xxs">
          {displayed.map((notification, i) => (
            <div key={notification.id}>
              <div
                style={{
                  padding: '16px 20px',
                  background: notification.read
                    ? 'transparent'
                    : 'var(--wip-color-surface-container)',
                  cursor: 'pointer',
                }}
              >
                <Stack flexDirection="row" gap="m" alignItems="flex-start">
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: colorToBg[notification.categoryColor] || colorToBg.neutral,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Icon name={notification.icon} size="s" />
                  </div>
                  <Stack gap="xs">
                    <Stack flexDirection="row" gap="s" alignItems="center">
                      <Typography size="m" fontWeight={notification.read ? 'normal' : 'bold'}>
                        {notification.title}
                      </Typography>
                      <Sticker color={notification.categoryColor} size="s">
                        {notification.category}
                      </Sticker>
                    </Stack>
                    <Typography size="s" color="medium_emphasis">
                      {notification.body}
                    </Typography>
                    <Typography size="xs" color="low_emphasis">
                      {notification.time}
                    </Typography>
                  </Stack>
                  {!notification.read && (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--wip-color-surface-interactive)',
                        flexShrink: 0,
                        marginTop: '8px',
                      }}
                    />
                  )}
                </Stack>
              </div>
              {i < displayed.length - 1 && <Divider />}
            </div>
          ))}
        </Stack>
      </Paper>

      <Stack gap="xs">
        <Typography size="m" fontWeight="bold">
          通知バナーのカラーバリエーション
        </Typography>
        <Typography size="s" color="medium_emphasis">
          Callout コンポーネントの全カラー × 全外観
        </Typography>
      </Stack>

      <Stack gap="s">
        <Callout color="informative">
          <Typography size="s">Informative (flat): 情報の提示に使用します</Typography>
        </Callout>
        <Callout color="positive">
          <Typography size="s">Positive (flat): 成功や完了の通知に使用します</Typography>
        </Callout>
        <Callout color="notice">
          <Typography size="s">Notice (flat): 注意が必要な情報に使用します</Typography>
        </Callout>
        <Callout color="negative">
          <Typography size="s">Negative (flat): エラーや問題の通知に使用します</Typography>
        </Callout>
        <Callout color="neutral">
          <Typography size="s">Neutral (flat): 汎用的な補足情報に使用します</Typography>
        </Callout>
      </Stack>

      <Stack gap="s">
        <Callout color="informative" appearance="outline">
          <Typography size="s">Informative (outline): 控えめな情報表示</Typography>
        </Callout>
        <Callout color="positive" appearance="outline">
          <Typography size="s">Positive (outline): 控えめな成功表示</Typography>
        </Callout>
        <Callout color="notice" appearance="outline">
          <Typography size="s">Notice (outline): 控えめな注意表示</Typography>
        </Callout>
        <Callout color="negative" appearance="outline">
          <Typography size="s">Negative (outline): 控えめなエラー表示</Typography>
        </Callout>
        <Callout color="neutral" appearance="outline">
          <Typography size="s">Neutral (outline): 控えめな補足表示</Typography>
        </Callout>
      </Stack>
    </Stack>
  )
}

const SettingsContent = ({ onConfirmOpen }: { onConfirmOpen: () => void }) => (
  <Stack gap="l">
    <Stack gap="xs">
      <Typography size="xl" fontWeight="bold">
        設定
      </Typography>
      <Typography size="s" color="medium_emphasis">
        ショップの設定を管理します
      </Typography>
    </Stack>

    <Tabs>
      <TabList>
        <Tab id="profile">プロフィール</Tab>
        <Tab id="notifications">通知</Tab>
        <Tab id="appearance">外観</Tab>
        <Tab id="security">セキュリティ</Tab>
      </TabList>

      <TabPanel id="profile">
        <div style={{ paddingTop: '24px' }}>
          <Stack gap="l">
            <SectionCard title="プロフィール画像">
              <Stack flexDirection="row" gap="l" alignItems="center">
                <div
                  className="wip-avatar -size-l"
                  style={{
                    background: 'var(--wip-color-surface-interactive)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon name="person" size="l" />
                </div>
                <Stack gap="s">
                  <Typography size="s" color="medium_emphasis">
                    JPG、PNG、GIF 形式。最大 2MB。
                  </Typography>
                  <Stack flexDirection="row" gap="s">
                    <Button
                      appearance="outlined"
                      size="s"
                      leading={<Icon name="upload" size="s" />}
                    >
                      画像をアップロード
                    </Button>
                    <Button appearance="transparent" size="s" color="negative">
                      削除
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </SectionCard>

            <SectionCard title="基本情報" description="ショップの基本的な情報を設定します">
              <Grid spacing="m">
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <TextField label="ショップ名" placeholder="My Shop" width="full" />
                </GridItem>
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <TextField
                    label="ショップURL"
                    placeholder="my-shop"
                    caption="https://example.com/shops/"
                    width="full"
                  />
                </GridItem>
                <GridItem size={12}>
                  <TextField
                    label="ショップ説明"
                    placeholder="あなたのショップの紹介文を入力..."
                    caption="最大500文字"
                    component="textarea"
                    width="full"
                  />
                </GridItem>
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <Select label="カテゴリ" placeholder="選択してください" width="full">
                    <SelectItem id="handmade">ハンドメイド</SelectItem>
                    <SelectItem id="fashion">ファッション</SelectItem>
                    <SelectItem id="interior">インテリア</SelectItem>
                    <SelectItem id="food">フード</SelectItem>
                    <SelectItem id="accessory">アクセサリー</SelectItem>
                  </Select>
                </GridItem>
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <Select label="地域" placeholder="選択してください" width="full">
                    <SelectItem id="tokyo">東京都</SelectItem>
                    <SelectItem id="osaka">大阪府</SelectItem>
                    <SelectItem id="kyoto">京都府</SelectItem>
                    <SelectItem id="fukuoka">福岡県</SelectItem>
                    <SelectItem id="hokkaido">北海道</SelectItem>
                  </Select>
                </GridItem>
              </Grid>
            </SectionCard>

            <SectionCard title="連絡先" description="お問い合わせ用の連絡先を設定します">
              <Grid spacing="m">
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <TextField label="メールアドレス" placeholder="shop@example.com" width="full" />
                </GridItem>
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <TextField label="電話番号" placeholder="03-1234-5678" width="full" />
                </GridItem>
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <TextField label="住所" placeholder="東京都渋谷区..." width="full" />
                </GridItem>
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <TextField
                    label="ウェブサイト"
                    placeholder="https://"
                    caption="任意"
                    width="full"
                  />
                </GridItem>
              </Grid>
            </SectionCard>

            <Stack flexDirection="row" justifyContent="flex-end" gap="s">
              <Button appearance="outlined">キャンセル</Button>
              <Button color="interactive">変更を保存</Button>
            </Stack>
          </Stack>
        </div>
      </TabPanel>

      <TabPanel id="notifications">
        <div style={{ paddingTop: '24px' }}>
          <Stack gap="l">
            <SectionCard title="メール通知" description="メールで受け取る通知を設定します">
              <Stack gap="m">
                <ToggleRow
                  title="注文通知"
                  description="新しい注文が入った時にメールで通知"
                  defaultOn
                />
                <Divider />
                <ToggleRow
                  title="レビュー通知"
                  description="商品にレビューが投稿された時にメールで通知"
                  defaultOn
                />
                <Divider />
                <ToggleRow
                  title="お問い合わせ通知"
                  description="顧客からのお問い合わせを受信した時にメールで通知"
                />
                <Divider />
                <ToggleRow
                  title="売上レポート"
                  description="週次・月次の売上レポートをメールで受信"
                  defaultOn
                />
                <Divider />
                <ToggleRow
                  title="在庫アラート"
                  description="商品の在庫が設定した閾値を下回った時に通知"
                  defaultOn
                />
              </Stack>
            </SectionCard>

            <SectionCard title="通知頻度" description="まとめて通知を受け取る頻度を選択します">
              <RadioGroup defaultValue="realtime" aria-label="通知頻度">
                <Radio value="realtime">リアルタイム</Radio>
                <Radio value="hourly">1時間ごとにまとめて</Radio>
                <Radio value="daily">1日1回まとめて</Radio>
                <Radio value="weekly">週1回まとめて</Radio>
              </RadioGroup>
            </SectionCard>

            <SectionCard title="プッシュ通知" description="ブラウザのプッシュ通知を設定します">
              <Stack gap="m">
                <ToggleRow
                  title="ブラウザ通知を有効にする"
                  description="デスクトップにプッシュ通知を表示します"
                />
                <Callout color="informative" appearance="outline">
                  <Typography size="xs">
                    ブラウザの通知許可が必要です。ブロックされている場合はブラウザの設定から許可してください。
                  </Typography>
                </Callout>
              </Stack>
            </SectionCard>

            <Stack flexDirection="row" justifyContent="flex-end" gap="s">
              <Button appearance="outlined">キャンセル</Button>
              <Button color="interactive">変更を保存</Button>
            </Stack>
          </Stack>
        </div>
      </TabPanel>

      <TabPanel id="appearance">
        <div style={{ paddingTop: '24px' }}>
          <Stack gap="l">
            <SectionCard title="テーマ" description="ショップページの配色テーマを設定します">
              <Stack gap="m">
                <RadioGroup defaultValue="default" aria-label="テーマ">
                  <Radio value="default">デフォルト</Radio>
                  <Radio value="warm">ウォーム</Radio>
                  <Radio value="cool">クール</Radio>
                  <Radio value="custom">カスタム</Radio>
                </RadioGroup>
                <Callout color="informative" appearance="outline">
                  <Typography size="xs">
                    テーマの変更はショップページにリアルタイムで反映されます。
                  </Typography>
                </Callout>
              </Stack>
            </SectionCard>

            <SectionCard title="レイアウト" description="商品一覧ページの表示形式を設定します">
              <Stack gap="m">
                <Grid spacing="m">
                  <GridItem size={{ xxs: 12, m: 6 }}>
                    <Select label="一覧表示形式" width="full">
                      <SelectItem id="grid">グリッド表示</SelectItem>
                      <SelectItem id="list">リスト表示</SelectItem>
                    </Select>
                  </GridItem>
                  <GridItem size={{ xxs: 12, m: 6 }}>
                    <Select label="1ページあたりの表示数" width="full">
                      <SelectItem id="12">12件</SelectItem>
                      <SelectItem id="24">24件</SelectItem>
                      <SelectItem id="48">48件</SelectItem>
                    </Select>
                  </GridItem>
                </Grid>
                <ToggleRow
                  title="商品画像のズーム"
                  description="ホバー時に商品画像を拡大表示"
                  defaultOn
                />
                <Divider />
                <ToggleRow
                  title="在庫数の表示"
                  description="残り少ない場合に在庫数を表示"
                  defaultOn
                />
                <Divider />
                <ToggleRow
                  title="SOLD OUT表示"
                  description="売り切れ商品をグレーアウトして表示"
                  defaultOn
                />
              </Stack>
            </SectionCard>

            <SectionCard title="SNSリンク" description="ショップページに表示するSNSリンク">
              <Grid spacing="m">
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <TextField label="X (Twitter)" placeholder="@username" width="full" />
                </GridItem>
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <TextField label="Instagram" placeholder="@username" width="full" />
                </GridItem>
              </Grid>
            </SectionCard>

            <Stack flexDirection="row" justifyContent="flex-end" gap="s">
              <Button appearance="outlined">キャンセル</Button>
              <Button color="interactive">変更を保存</Button>
            </Stack>
          </Stack>
        </div>
      </TabPanel>

      <TabPanel id="security">
        <div style={{ paddingTop: '24px' }}>
          <Stack gap="l">
            <Callout color="notice">
              <Typography size="s">
                セキュリティの設定変更は即時反映されます。変更後は再ログインが必要な場合があります。
              </Typography>
            </Callout>

            <SectionCard title="パスワード変更" description="定期的なパスワード変更を推奨します">
              <Stack gap="m">
                <Grid spacing="m">
                  <GridItem size={{ xxs: 12, m: 6 }}>
                    <TextField label="現在のパスワード" placeholder="••••••••" width="full" />
                  </GridItem>
                  <GridItem size={12}>
                    <Divider />
                  </GridItem>
                  <GridItem size={{ xxs: 12, m: 6 }}>
                    <TextField label="新しいパスワード" placeholder="••••••••" width="full" />
                  </GridItem>
                  <GridItem size={{ xxs: 12, m: 6 }}>
                    <TextField
                      label="新しいパスワード（確認）"
                      placeholder="••••••••"
                      width="full"
                    />
                  </GridItem>
                </Grid>
                <div>
                  <Button color="interactive" size="s">
                    パスワードを変更
                  </Button>
                </div>
              </Stack>
            </SectionCard>

            <SectionCard title="二要素認証" description="アカウントのセキュリティを強化します">
              <ToggleRow
                title="二要素認証を有効にする"
                description="ログイン時に認証コードの入力が必要になります"
              />
            </SectionCard>

            <SectionCard
              title="ログインセッション"
              description="現在ログイン中のデバイス"
              action={
                <Button appearance="transparent" size="s" color="negative">
                  すべてログアウト
                </Button>
              }
            >
              <Stack gap="m">
                <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Stack flexDirection="row" gap="s" alignItems="center">
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'var(--wip-color-surface-interactive)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon name="launch" size="s" />
                    </div>
                    <Stack gap="xxs">
                      <Stack flexDirection="row" gap="xs" alignItems="center">
                        <Typography size="s" fontWeight="bold">
                          Chrome — macOS
                        </Typography>
                        <Sticker color="positive" size="s">
                          現在のセッション
                        </Sticker>
                      </Stack>
                      <Typography size="xs" color="medium_emphasis">
                        東京, 日本 · 最終アクセス: たった今
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
                <Divider />
                <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Stack flexDirection="row" gap="s" alignItems="center">
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'var(--wip-color-surface-container)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon name="launch" size="s" />
                    </div>
                    <Stack gap="xxs">
                      <Typography size="s" fontWeight="bold">
                        Safari — iPhone
                      </Typography>
                      <Typography size="xs" color="medium_emphasis">
                        東京, 日本 · 最終アクセス: 2時間前
                      </Typography>
                    </Stack>
                  </Stack>
                  <Button appearance="transparent" size="s" color="negative">
                    ログアウト
                  </Button>
                </Stack>
              </Stack>
            </SectionCard>

            <SectionCard title="アカウント削除">
              <Stack gap="m">
                <Callout color="negative" appearance="outline">
                  <Typography size="s">
                    アカウントを削除すると、ショップ、商品、注文履歴、顧客データなどすべてのデータが完全に削除されます。この操作は取り消せません。
                  </Typography>
                </Callout>
                <Checkbox>上記の内容を理解し、データの削除に同意します</Checkbox>
                <div>
                  <Button color="negative" size="s" onPress={onConfirmOpen}>
                    アカウントを削除
                  </Button>
                </div>
              </Stack>
            </SectionCard>
          </Stack>
        </div>
      </TabPanel>
    </Tabs>
  </Stack>
)

// ─── Main app shell ───

/**
 * EC管理画面のアプリシェル。サイドバーナビゲーションで
 * ダッシュボード・商品管理・通知・設定の各ページを切り替えられる。
 * 統計カード、売上チャート、注文テーブル、商品一覧CRUD、
 * 通知フィード（全 Sticker / Callout カラー）、フォーム設定など
 * WIP-UI の主要コンポーネントを網羅的に組み合わせた本格的な管理画面。
 * Flavor を切り替えて各サービスでの見た目を確認できる。
 *
 * @summary EC管理画面アプリシェル
 */
export const Default: Story = {
  render: () => {
    const [activePage, setActivePage] = useState<PageId>('dashboard')
    const [period, setPeriod] = useState('month')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

    return (
      <div style={{ minHeight: '100vh', background: 'var(--wip-color-surface-base)' }}>
        <AppBar>
          <AppBarLeading>
            <Stack flexDirection="row" gap="s" alignItems="center">
              <Icon name="home" size="m" />
              <Typography size="m" fontWeight="bold">
                ショップ管理
              </Typography>
            </Stack>
          </AppBarLeading>
          <AppBarTrailing>
            <Stack flexDirection="row" gap="s" alignItems="center">
              <Button appearance="transparent" iconOnly aria-label="検索">
                <Icon name="magnifying_glass" size="m" />
              </Button>
              <Button
                appearance="transparent"
                iconOnly
                aria-label="通知"
                onPress={() => setActivePage('notifications')}
              >
                <Icon name="bell" size="m" />
              </Button>
              <div
                className="wip-avatar -size-s"
                style={{
                  background: 'var(--wip-color-surface-base)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="person" size="s" />
              </div>
            </Stack>
          </AppBarTrailing>
        </AppBar>

        <div style={{ display: 'flex' }}>
          {/* Sidebar */}
          <nav
            style={{
              width: '240px',
              minHeight: 'calc(100vh - 56px)',
              borderRight: '1px solid var(--wip-color-border-low_emphasis)',
              background: 'var(--wip-color-surface-container)',
              flexShrink: 0,
            }}
          >
            <div style={{ padding: '16px 12px' }}>
              <Stack gap="xs">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivePage(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background:
                        activePage === item.id
                          ? 'var(--wip-color-surface-interactive)'
                          : 'transparent',
                      border: 'none',
                      width: '100%',
                      textAlign: 'left',
                      font: 'inherit',
                      color: 'inherit',
                    }}
                  >
                    <Icon name={item.icon} size="s" />
                    <Typography size="s" fontWeight={activePage === item.id ? 'bold' : 'normal'}>
                      {item.label}
                    </Typography>
                    {item.badge && (
                      <div style={{ marginLeft: 'auto' }}>
                        <Sticker color="negative" size="s">
                          {item.badge}
                        </Sticker>
                      </div>
                    )}
                  </button>
                ))}
              </Stack>
            </div>
          </nav>

          {/* Content area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ padding: '24px 32px' }}>
              {activePage === 'dashboard' && (
                <DashboardContent period={period} setPeriod={setPeriod} />
              )}
              {activePage === 'products' && (
                <ProductsContent onDeleteOpen={() => setDeleteDialogOpen(true)} />
              )}
              {activePage === 'notifications' && <NotificationsContent />}
              {activePage === 'settings' && (
                <SettingsContent onConfirmOpen={() => setConfirmDialogOpen(true)} />
              )}
            </div>
          </div>
        </div>

        {/* Dialogs */}
        <Dialog isOpen={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogHeader>
            <DialogTitle>商品の削除</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            選択した商品を削除しますか？削除された商品は復元できません。関連する注文データは保持されます。
          </DialogDescription>
          <DialogFooter>
            <Button appearance="outlined" onPress={() => setDeleteDialogOpen(false)}>
              キャンセル
            </Button>
            <Button color="negative" onPress={() => setDeleteDialogOpen(false)}>
              削除する
            </Button>
          </DialogFooter>
        </Dialog>

        <Dialog isOpen={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogHeader>
            <DialogTitle>アカウント削除の確認</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            本当にアカウントを削除しますか？ショップと関連するすべてのデータが完全に削除されます。この操作は取り消せません。
          </DialogDescription>
          <DialogFooter>
            <Button appearance="outlined" onPress={() => setConfirmDialogOpen(false)}>
              キャンセル
            </Button>
            <Button color="negative" onPress={() => setConfirmDialogOpen(false)}>
              削除する
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    )
  },
}
