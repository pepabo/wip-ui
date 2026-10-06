import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Divider } from '../../../Divider'
import { Grid, GridItem } from '../../../Grid'
import { Icon } from '../../../Icon'
import { Select, SelectItem } from '../../../Select'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../../Table'
import { Typography } from '../../../Typography'
import { AppShell } from './AppShell'
import { Card, PageHeader, SectionTitle } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { TypographyColor } from '../../../Typography'

const meta = {
  title: 'Templates/Hosting/Usage',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ ───

type Metric = {
  label: string
  value: string
  limit: string
  ratio: number
  note?: string
}

const metrics: Metric[] = [
  { label: '転送量', value: '182.4', limit: '/ 無制限 GB', ratio: 0.18, note: '先月 164.1 GB' },
  {
    label: 'ディスク使用量',
    value: '12.4',
    limit: '/ 400 GB',
    ratio: 0.031,
    note: '先月比 +0.8 GB',
  },
  {
    label: 'メール送信数',
    value: '3,842',
    limit: '/ 30,000 通',
    ratio: 0.128,
    note: '1 日あたり上限 1,000 通',
  },
  {
    label: 'データベース容量',
    value: '412',
    limit: '/ 1,024 MB',
    ratio: 0.402,
    note: '3 データベース',
  },
]

const metricsNearLimit: Metric[] = [
  { label: '転送量', value: '182.4', limit: '/ 無制限 GB', ratio: 0.18, note: '先月 164.1 GB' },
  {
    label: 'ディスク使用量',
    value: '381.6',
    limit: '/ 400 GB',
    ratio: 0.954,
    note: '残り 18.4 GB',
  },
  {
    label: 'メール送信数',
    value: '28,910',
    limit: '/ 30,000 通',
    ratio: 0.964,
    note: '残り 1,090 通',
  },
  {
    label: 'データベース容量',
    value: '874',
    limit: '/ 1,024 MB',
    ratio: 0.853,
    note: '3 データベース',
  },
]

// 日別の転送量（GB）。30 日分
const daily = [
  4.2, 5.1, 6.8, 5.4, 4.9, 3.2, 2.8, 5.6, 7.2, 8.1, 6.4, 5.9, 4.1, 3.4, 6.2, 7.8, 9.4, 11.2, 8.6,
  6.1, 5.2, 4.4, 6.9, 8.2, 7.1, 6.3, 5.8, 9.1, 10.4, 7.6,
]

const byDomain = [
  {
    domain: 'example.com',
    transfer: '104.2 GB',
    requests: '1,284,092',
    disk: '8.1 GB',
    share: 0.57,
  },
  {
    domain: 'blog.example.com',
    transfer: '61.8 GB',
    requests: '742,118',
    disk: '3.4 GB',
    share: 0.34,
  },
  {
    domain: 'shop.example.net',
    transfer: '14.1 GB',
    requests: '98,440',
    disk: '0.8 GB',
    share: 0.08,
  },
  {
    domain: 'user-0021934.hosting.example',
    transfer: '2.3 GB',
    requests: '12,007',
    disk: '0.1 GB',
    share: 0.01,
  },
]

// ─── 部品 ───

// GAP-18: 進捗バー / メーターが無い。Typography で色を継承させ、currentColor で塗っている。
// 高さ・角丸・トラックの不透明度はトークンに出典が無い暫定値。
const meterTrackStyle = { height: 6, borderRadius: 3, overflow: 'hidden', opacity: 0.15 }
const meterFillStyle = { height: 6, borderRadius: 3 }

const toneOf = (ratio: number): TypographyColor =>
  ratio >= 0.95 ? 'negative' : ratio >= 0.8 ? 'notice' : 'informative'

const Meter = ({ ratio }: { ratio: number }) => {
  const tone = toneOf(ratio)
  return (
    <Typography component="div" color={tone}>
      <div style={{ ...meterTrackStyle, background: 'currentColor' }} />
      <div
        style={{
          ...meterFillStyle,
          width: `${Math.min(ratio, 1) * 100}%`,
          background: 'currentColor',
          marginTop: -6,
        }}
      />
    </Typography>
  )
}

const MetricCard = ({ metric }: { metric: Metric }) => (
  <Card>
    <Stack gap="xs">
      <Stack flexDirection="row" gap="xs" alignItems="center" justifyContent="space-between">
        <Typography size="s" color="medium_emphasis" component="span">
          {metric.label}
        </Typography>
        {metric.ratio >= 0.8 && (
          <Sticker color={metric.ratio >= 0.95 ? 'negative' : 'attention'} size="s">
            {Math.round(metric.ratio * 100)}%
          </Sticker>
        )}
      </Stack>
      <Stack flexDirection="row" gap="xxs" alignItems="flex-end">
        <Typography size="xxxl" fontWeight="bold" component="span">
          {metric.value}
        </Typography>
        <Typography size="s" color="medium_emphasis" component="span">
          {metric.limit}
        </Typography>
      </Stack>
      <Meter ratio={metric.ratio} />
      {metric.note && (
        <Typography size="xs" color="low_emphasis">
          {metric.note}
        </Typography>
      )}
    </Stack>
  </Card>
)

// GAP-19: グラフの primitive が無い。棒を div で並べ、色は Typography から継承している。
const barGapStyle = { display: 'flex', alignItems: 'flex-end', gap: 2, height: 160 }
const barStyle = { flex: 1, borderRadius: 2, background: 'currentColor', minWidth: 3 }

const TransferChart = () => {
  const peak = Math.max(...daily)
  return (
    <Card>
      <Stack gap="m">
        <SectionTitle
          action={
            <Select aria-label="表示する指標" size="s" defaultSelectedKey="transfer">
              <SelectItem id="transfer">転送量</SelectItem>
              <SelectItem id="requests">リクエスト数</SelectItem>
              <SelectItem id="mail">メール送信数</SelectItem>
            </Select>
          }
        >
          日別の推移
        </SectionTitle>
        <Typography component="div" color="informative">
          <div style={barGapStyle}>
            {daily.map((value, index) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: 日付順の固定データ
                key={index}
                style={{ ...barStyle, height: `${(value / peak) * 100}%` }}
                aria-hidden="true"
              />
            ))}
          </div>
        </Typography>
        <Stack flexDirection="row" gap="m" justifyContent="space-between">
          <Typography size="xs" color="low_emphasis" component="span">
            9/1
          </Typography>
          <Typography size="xs" color="low_emphasis" component="span">
            ピーク {peak} GB（9/18）
          </Typography>
          <Typography size="xs" color="low_emphasis" component="span">
            9/30
          </Typography>
        </Stack>
      </Stack>
    </Card>
  )
}

const DomainTable = () => (
  <Card>
    <Stack gap="m">
      <SectionTitle
        action={
          <Button appearance="outlined" size="s" leading={<Icon name="download" size="s" />}>
            CSV でダウンロード
          </Button>
        }
      >
        ドメイン別の内訳
      </SectionTitle>
      <Table aria-label="ドメイン別の使用量">
        <TableHeader>
          <Column isRowHeader>ドメイン</Column>
          <Column>転送量</Column>
          <Column>リクエスト数</Column>
          <Column>ディスク</Column>
          <Column>割合</Column>
        </TableHeader>
        <TableBody>
          {byDomain.map((row) => (
            <Row key={row.domain}>
              <Cell>{row.domain}</Cell>
              <Cell>{row.transfer}</Cell>
              <Cell>{row.requests}</Cell>
              <Cell>{row.disk}</Cell>
              <Cell>
                <Stack gap="xxs">
                  <Typography size="s" component="span">
                    {Math.round(row.share * 100)}%
                  </Typography>
                  <Meter ratio={row.share} />
                </Stack>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </Stack>
  </Card>
)

const Header = () => (
  <PageHeader
    breadcrumbs={[{ label: 'サーバー概要', href: '#' }, { label: '使用量' }]}
    title="使用量"
    description="スタンダードプラン ／ 2026年9月（1日〜30日）"
    actions={
      <Select aria-label="集計期間" defaultSelectedKey="2026-09">
        <SelectItem id="2026-09">2026年9月</SelectItem>
        <SelectItem id="2026-08">2026年8月</SelectItem>
        <SelectItem id="2026-07">2026年7月</SelectItem>
        <SelectItem id="last-3">過去 3 か月</SelectItem>
      </Select>
    }
  />
)

const UsageScreen = ({ nearLimit = false }: { nearLimit?: boolean }) => (
  <AppShell active="usage">
    <Header />
    {nearLimit ? (
      <Callout
        color="negative"
        action={
          <Button appearance="outlined" color="negative" size="s">
            プランを変更
          </Button>
        }
      >
        ディスク使用量が上限の 95%
        を超えました。上限に達すると新しいファイルの書き込みとメールの受信が停止します。
      </Callout>
    ) : (
      <Typography size="xs" color="low_emphasis">
        上限に達すると、ディスクは書き込みが、メールは送信が停止します。転送量に上限はありません。
      </Typography>
    )}
    <Grid spacing="m">
      {(nearLimit ? metricsNearLimit : metrics).map((metric) => (
        <GridItem key={metric.label} size={{ xxs: 12, s: 6, l: 3 }}>
          <MetricCard metric={metric} />
        </GridItem>
      ))}
    </Grid>
    <Grid spacing="l">
      <GridItem size={{ xxs: 12, l: 8 }}>
        <TransferChart />
      </GridItem>
      <GridItem size={{ xxs: 12, l: 4 }}>
        <Card>
          <Stack gap="m">
            <SectionTitle>今月の請求見込み</SectionTitle>
            <Stack flexDirection="row" gap="xxs" alignItems="flex-end">
              <Typography size="xxxl" fontWeight="bold" component="span">
                ¥990
              </Typography>
              <Typography size="s" color="medium_emphasis" component="span">
                （税込）
              </Typography>
            </Stack>
            <Typography size="xs" color="medium_emphasis">
              超過料金は発生していません。10 月 1 日に登録済みのカードへ請求します。
            </Typography>
            <Divider />
            <Stack gap="xs">
              <Stack flexDirection="row" justifyContent="space-between">
                <Typography size="s" color="medium_emphasis" component="span">
                  スタンダードプラン
                </Typography>
                <Typography size="s" component="span">
                  ¥990
                </Typography>
              </Stack>
              <Stack flexDirection="row" justifyContent="space-between">
                <Typography size="s" color="medium_emphasis" component="span">
                  超過分
                </Typography>
                <Typography size="s" component="span">
                  ¥0
                </Typography>
              </Stack>
            </Stack>
            <Button
              appearance="outlined"
              width="full"
              trailing={<Icon name="chevron_right" size="s" />}
            >
              請求の詳細
            </Button>
          </Stack>
        </Card>
      </GridItem>
    </Grid>
    <DomainTable />
  </AppShell>
)

// ─── ストーリー ───

/**
 * 使用量とその上限を 1 画面にまとめたページ。hosting-deploy-now と hosting-ai-gateway の
 * どちらにも存在し、テンプレート層に無かった唯一の共通画面。
 *
 * 進捗バーと棒グラフは wip-ui に無いため、Typography で色を継承した div で代用している
 * （GAP-18 / GAP-19）。実消費側は Tailwind の bg-sky-500 を直書きしていてフレーバーに
 * 追従していないため、ここのトンマナを決めると 2 サービスが同時に直る。
 *
 * @summary 使用量とその上限
 */
export const Default: Story = {
  render: () => <UsageScreen />,
}

/**
 * 複数の指標が上限に近づいている状態。
 * メーターが informative から notice、negative に変わる境目（80% / 95%）と、
 * Sticker・Callout が同時に出たときの強さの配分を確認する。
 *
 * @summary 上限が近づいている状態
 */
export const NearLimit: Story = {
  render: () => <UsageScreen nearLimit />,
}

/**
 * スマートフォン幅で見た状態。メーターカードが 1 カラムに落ちたときの縦のリズムと、
 * 30 本の棒グラフが狭い幅で潰れないかを確認する。
 *
 * @summary スマートフォン幅での使用量
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'iphone14' } },
  render: () => <UsageScreen />,
}
