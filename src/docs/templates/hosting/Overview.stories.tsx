import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Grid, GridItem } from '../../../Grid'
import { Icon } from '../../../Icon'
import { Loader } from '../../../Loader'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../../Table'
import { Typography } from '../../../Typography'
import { AppShell } from './AppShell'
import {
  Card,
  CopyableValue,
  DefinitionRow,
  PageHeader,
  SectionTitle,
  Stat,
  StatusSticker,
} from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { ServiceStatus } from './parts'

const meta = {
  title: 'Templates/Hosting/Overview',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ ───

const activities: { at: string; action: string; target: string; status: ServiceStatus }[] = [
  { at: '2026-09-18 09:12', action: 'SSL 証明書を更新', target: 'example.com', status: 'active' },
  { at: '2026-09-17 23:00', action: '自動バックアップ', target: 'サーバー全体', status: 'active' },
  {
    at: '2026-09-17 15:41',
    action: 'PHP バージョン変更',
    target: 'blog.example.com',
    status: 'active',
  },
  {
    at: '2026-09-16 10:03',
    action: 'ドメインを追加',
    target: 'shop.example.net',
    status: 'pending',
  },
  {
    at: '2026-09-15 08:20',
    action: 'メールアカウント作成',
    target: 'info@example.com',
    status: 'active',
  },
]

const usage: { label: string; value: string; unit: string; caption: ReactNode }[] = [
  {
    label: 'ディスク使用量',
    value: '12.4',
    unit: 'GB / 400 GB',
    caption: (
      <Typography size="xs" color="medium_emphasis">
        先月比 +0.8 GB
      </Typography>
    ),
  },
  {
    label: 'ドメイン',
    value: '3',
    unit: '件',
    caption: (
      <Typography size="xs" color="medium_emphasis">
        独自 2 件 ／ 初期 1 件
      </Typography>
    ),
  },
  {
    label: 'SSL 証明書',
    value: '2 / 3',
    unit: '有効',
    caption: (
      <Typography size="xs" color="negative">
        shop.example.net が未設定
      </Typography>
    ),
  },
  {
    label: 'メールアカウント',
    value: '8',
    unit: '/ 無制限',
    caption: (
      <Typography size="xs" color="medium_emphasis">
        転送設定 2 件
      </Typography>
    ),
  },
]

const serverFields: { label: string; value: string; copyable?: boolean }[] = [
  { label: 'サーバー名', value: 'web12.hosting.example', copyable: true },
  { label: 'IP アドレス', value: '203.0.113.42', copyable: true },
  { label: 'PHP バージョン', value: '8.3（推奨）' },
  { label: 'データベース', value: 'MySQL 8.0 ／ 3 データベース' },
]

// ─── 部品 ───

const Header = () => (
  <PageHeader
    breadcrumbs={[{ label: 'サーバー概要' }]}
    title="サーバー概要"
    badge={
      <Sticker color="informative" size="s">
        スタンダードプラン
      </Sticker>
    }
    description="契約 ID: hp-0021934 ／ サーバー: web12.hosting.example ／ 次回更新日: 2027-03-31"
    actions={
      <>
        <Button appearance="outlined" leading={<Icon name="download" size="s" />}>
          バックアップを作成
        </Button>
        <Button color="interactive" leading={<Icon name="plus" size="s" />}>
          サイトを追加
        </Button>
      </>
    }
  />
)

const UsageCards = ({ loading = false }: { loading?: boolean }) => (
  <Grid spacing="m">
    {usage.map((item) => (
      <GridItem key={item.label} size={{ xxs: 12, s: 6, l: 3 }}>
        <Card>{loading ? <Loader size="m" /> : <Stat {...item} />}</Card>
      </GridItem>
    ))}
  </Grid>
)

const ServerInfo = () => (
  <Card>
    <Stack gap="m">
      <SectionTitle>サーバー情報</SectionTitle>
      <Grid spacing="m">
        {serverFields.map((field) => (
          <GridItem key={field.label} size={{ xxs: 12, m: 6 }}>
            <DefinitionRow term={field.label} direction="stacked">
              {field.copyable ? (
                <CopyableValue value={field.value} label={field.label} />
              ) : (
                <Typography component="span">{field.value}</Typography>
              )}
            </DefinitionRow>
          </GridItem>
        ))}
      </Grid>
    </Stack>
  </Card>
)

const ActivityTable = () => (
  <Card>
    <Stack gap="m">
      <SectionTitle
        action={
          <Button
            appearance="transparent"
            size="s"
            trailing={<Icon name="chevron_right" size="s" />}
          >
            すべて表示
          </Button>
        }
      >
        最近のアクティビティ
      </SectionTitle>
      <Table aria-label="最近のアクティビティ">
        <TableHeader>
          <Column isRowHeader>日時</Column>
          <Column>操作</Column>
          <Column>対象</Column>
          <Column>結果</Column>
        </TableHeader>
        <TableBody>
          {activities.map((row) => (
            <Row key={`${row.at}-${row.target}`}>
              <Cell>{row.at}</Cell>
              <Cell>{row.action}</Cell>
              <Cell>{row.target}</Cell>
              <Cell>
                <StatusSticker status={row.status} />
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </Stack>
  </Card>
)

// ─── ストーリー ───

/**
 * ログイン直後に最初に開く画面。契約状態・リソース使用量・直近の操作が一目で分かることを確認する。
 * 面（Paper）、数値の強調（Typography）、状態表示（Sticker）、一覧（Table）の組み合わせが
 * このサービスのトンマナの基準になる。
 *
 * @summary ログイン直後のサーバー概要
 */
export const Default: Story = {
  render: () => (
    <AppShell active="overview">
      <Header />
      <UsageCards />
      <ServerInfo />
      <ActivityTable />
    </AppShell>
  ),
}

/**
 * メンテナンス予告や障害など、運営からの重要なお知らせがある状態。
 * Callout がページ全体の中でどの程度目立つか、通常の Callout との使い分けを確認する。
 *
 * @summary 運営からのお知らせが表示されている状態
 */
export const WithNotice: Story = {
  render: () => (
    <AppShell active="overview">
      <Header />
      <Callout
        color="notice"
        action={
          <Button appearance="outlined" size="s">
            詳細
          </Button>
        }
      >
        2026-09-25 02:00〜05:00
        にサーバーメンテナンスを実施します。この間、サイトの表示とメールの送受信が断続的に停止します。
      </Callout>
      <UsageCards />
      <ServerInfo />
      <ActivityTable />
    </AppShell>
  ),
}

/**
 * 使用量の集計が終わっていない読み込み中の状態。
 * カードの高さが確定していない状態でも、レイアウトが崩れないことを確認する。
 *
 * @summary 使用量を読み込み中の状態
 */
export const Loading: Story = {
  render: () => (
    <AppShell active="overview">
      <Header />
      <UsageCards loading />
      <ServerInfo />
      <ActivityTable />
    </AppShell>
  ),
}
