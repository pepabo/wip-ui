import { useState } from 'react'
import { TabPanel } from 'react-aria-components'

import { AppBar, AppBarLeading, AppBarTrailing } from '../../../AppBar'
import { Breadcrumb, Breadcrumbs } from '../../../Breadcrumbs'
import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Checkbox } from '../../../Checkbox'
import { Container } from '../../../Container'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../Dialog'
import { Divider } from '../../../Divider'
import { Grid, GridItem } from '../../../Grid'
import { Icon } from '../../../Icon'
import { Paper } from '../../../Paper'
import { Select, SelectItem } from '../../../Select'
import { SnackBar, SnackBarQueue } from '../../../SnackBar'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { Switch } from '../../../Switch'
import { Tab, TabList, Tabs } from '../../../Tab'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../../Table'
import { TextField } from '../../../TextField'
import { Typography } from '../../../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { IconName } from '../../../Icon'

/**
 * ロリポップ！AIゲートウェイ（octane / hosting-ai-gateway の admin-ui）の再現。
 * 既に wip-ui 0.1.6 を使っている実利用者で、不足分を 7,000 行の CSS モジュールで補っている。
 */

const meta = {
  title: 'Templates/AiGateway/App',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const queue = new SnackBarQueue()

// GAP-1 の回避策（Paper に padding が無い）
const insetStyle = { padding: 24 }
const Card = ({ children, outlined = false }: { children: ReactNode; outlined?: boolean }) => (
  <Paper elevation={outlined ? 0 : 1} outlined={outlined}>
    <div style={insetStyle}>{children}</div>
  </Paper>
)

// ─── データ ───

const projects = [
  {
    id: 'pr-01',
    name: 'customer-support-bot',
    keys: 3,
    spend: '¥12,480',
    budget: '¥50,000',
    ratio: 0.25,
  },
  { id: 'pr-02', name: 'docs-search', keys: 1, spend: '¥3,210', budget: '¥10,000', ratio: 0.32 },
  {
    id: 'pr-03',
    name: 'internal-playground',
    keys: 5,
    spend: '¥48,900',
    budget: '¥50,000',
    ratio: 0.978,
  },
]

const initialKeys = [
  {
    id: 'k-01',
    name: 'production',
    prefix: 'sk-oct-...a81f',
    models: '4 モデル',
    budget: '¥30,000',
    state: '有効',
  },
  {
    id: 'k-02',
    name: 'staging',
    prefix: 'sk-oct-...c20b',
    models: '2 モデル',
    budget: '¥10,000',
    state: '有効',
  },
  {
    id: 'k-03',
    name: 'batch-2026-09',
    prefix: 'sk-oct-...7fd3',
    models: '1 モデル',
    budget: '¥5,000',
    state: '無効',
  },
]

const models = [
  { id: 'claude-fable-5-1', label: 'Claude Fable 5.1', vendor: 'Anthropic', allowed: true },
  { id: 'claude-opus-5', label: 'Claude Opus 5', vendor: 'Anthropic', allowed: true },
  { id: 'claude-sonnet-5', label: 'Claude Sonnet 5', vendor: 'Anthropic', allowed: true },
  { id: 'gpt-5', label: 'GPT-5', vendor: 'OpenAI', allowed: false },
]

const initialMembers = [
  { name: '山田 太郎', email: 'taro@example.com', role: '管理者' },
  { name: '佐藤 花子', email: 'hanako@example.com', role: 'メンバー' },
  { name: '鈴木 一郎', email: 'ichiro@example.com', role: '閲覧のみ' },
]

const usageByModel = [
  { model: 'Claude Fable 5.1', requests: '128,402', tokens: '41.2M', cost: '¥38,210' },
  { model: 'Claude Sonnet 5', requests: '94,118', tokens: '22.8M', cost: '¥18,940' },
  { model: 'Claude Opus 5', requests: '12,007', tokens: '8.1M', cost: '¥7,440' },
]

const daily = [
  3.2, 4.8, 6.1, 5.2, 4.4, 2.1, 1.8, 5.5, 7.2, 8.4, 6.9, 5.1, 3.8, 2.9, 6.4, 8.8, 10.2, 12.4, 9.1,
  6.6,
]

// ─── ルーティング ───

type Route =
  | { name: 'projects' }
  | { name: 'project'; id: string; tab: 'overview' | 'keys' | 'usage' | 'settings' }
  | { name: 'key'; projectId: string; keyId: string; tab: 'models' | 'limits' | 'guardrails' }
  | { name: 'members' }
  | { name: 'billing' }
  | { name: 'models' }
  | { name: 'playground'; projectId: string }

// ─── 共通の枠 ───

type NavItem = { id: string; label: string; icon: IconName }

const orgNav: NavItem[] = [
  { id: 'projects', label: 'プロジェクト', icon: 'folder' },
  { id: 'models', label: 'モデル', icon: 'node' },
  { id: 'members', label: 'メンバー', icon: 'people' },
  { id: 'billing', label: '請求', icon: 'bill' },
]

const Layout = ({
  route,
  onNavigate,
  children,
}: {
  route: Route
  onNavigate: (r: Route) => void
  children: ReactNode
}) => {
  const activeOrg =
    route.name === 'members'
      ? 'members'
      : route.name === 'billing'
        ? 'billing'
        : route.name === 'models'
          ? 'models'
          : 'projects'
  return (
    <Stack gap="l">
      <AppBar appearance="white" position="relative">
        <AppBarLeading>
          <Stack flexDirection="row" gap="s" alignItems="center">
            <Icon name="node" size="m" />
            <Typography size="l" fontWeight="bold" component="span">
              AIゲートウェイ
            </Typography>
            <Sticker color="neutral" size="s">
              ペパボ開発部
            </Sticker>
          </Stack>
        </AppBarLeading>
        <AppBarTrailing>
          <Stack flexDirection="row" gap="xs" alignItems="center">
            <Button appearance="transparent" size="s" trailing={<Icon name="launch" size="s" />}>
              ドキュメント
            </Button>
            <Button appearance="transparent" size="s" iconOnly aria-label="アカウント">
              <Icon name="person" size="m" />
            </Button>
          </Stack>
        </AppBarTrailing>
      </AppBar>
      <Container size="xl" component="main">
        <Grid spacing="l">
          <GridItem size={{ xxs: 12, m: 3, l: 2 }}>
            {/* GAP-14: SideNavigation が無い。実装は自前の Sidebar 247 行 + モバイル用ドロワー */}
            <Stack gap="m">
              <nav aria-label="組織ナビゲーション">
                <Stack gap="xxs">
                  <Typography size="xs" color="low_emphasis">
                    組織
                  </Typography>
                  {orgNav.map((item) => (
                    <Button
                      key={item.id}
                      appearance={item.id === activeOrg ? 'flat' : 'transparent'}
                      width="full"
                      leading={<Icon name={item.icon} size="s" />}
                      onPress={() => {
                        if (item.id === 'projects') onNavigate({ name: 'projects' })
                        if (item.id === 'models') onNavigate({ name: 'models' })
                        if (item.id === 'members') onNavigate({ name: 'members' })
                        if (item.id === 'billing') onNavigate({ name: 'billing' })
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Stack>
              </nav>
            </Stack>
          </GridItem>
          <GridItem size={{ xxs: 12, m: 9, l: 10 }}>
            <Stack gap="l">{children}</Stack>
          </GridItem>
        </Grid>
      </Container>
    </Stack>
  )
}

// GAP: 進捗バーが無いので Typography の色を継承した div で代用
const Meter = ({ ratio }: { ratio: number }) => (
  <Typography
    component="div"
    color={ratio >= 0.95 ? 'negative' : ratio >= 0.8 ? 'notice' : 'informative'}
  >
    <div style={{ height: 4, borderRadius: 2, background: 'currentColor', opacity: 0.15 }} />
    <div
      style={{
        height: 4,
        borderRadius: 2,
        marginTop: -4,
        width: `${Math.min(ratio, 1) * 100}%`,
        background: 'currentColor',
      }}
    />
  </Typography>
)

// ─── プロジェクト一覧 ───

const ProjectsScreen = ({ onOpen }: { onOpen: (id: string) => void }) => (
  <Stack gap="l">
    <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="m" justifyContent="space-between">
      <Stack gap="xxs">
        <Typography size="xxl" fontWeight="bold" component="h1">
          プロジェクト
        </Typography>
        <Typography size="s" color="medium_emphasis">
          プロジェクトごとに API キーと利用できるモデル、上限を分けて管理します。
        </Typography>
      </Stack>
      <Button color="interactive" leading={<Icon name="plus" size="s" />}>
        プロジェクトを作成
      </Button>
    </Stack>
    <Grid spacing="m">
      {projects.map((p) => (
        <GridItem key={p.id} size={{ xxs: 12, m: 6, l: 4 }}>
          <Card>
            <Stack gap="m">
              <Stack gap="xxs">
                <Typography size="l" fontWeight="bold" component="h3">
                  {p.name}
                </Typography>
                <Typography size="xs" color="low_emphasis">
                  APIキー {p.keys} 件
                </Typography>
              </Stack>
              <Stack gap="xxs">
                <Stack flexDirection="row" justifyContent="space-between" alignItems="flex-end">
                  <Typography size="s" color="medium_emphasis" component="span">
                    今月の利用
                  </Typography>
                  <Typography size="s" fontWeight="bold" component="span">
                    {p.spend} / {p.budget}
                  </Typography>
                </Stack>
                <Meter ratio={p.ratio} />
                {p.ratio >= 0.95 && (
                  <Typography size="xs" color="negative">
                    予算の上限に達しそうです
                  </Typography>
                )}
              </Stack>
              <Button
                appearance="outlined"
                width="full"
                onPress={() => onOpen(p.id)}
                trailing={<Icon name="chevron_right" size="s" />}
              >
                開く
              </Button>
            </Stack>
          </Card>
        </GridItem>
      ))}
    </Grid>
  </Stack>
)

// ─── プロジェクト詳細 ───

const ProjectScreen = ({
  project,
  tab,
  onTab,
  onBack,
  onOpenKey,
  onCreateKey,
  onPlayground,
  keys,
}: {
  project: (typeof projects)[number]
  keys: typeof initialKeys
  tab: 'overview' | 'keys' | 'usage' | 'settings'
  onTab: (t: 'overview' | 'keys' | 'usage' | 'settings') => void
  onBack: () => void
  onOpenKey: (id: string) => void
  onCreateKey: () => void
  onPlayground: () => void
}) => (
  <Stack gap="l">
    <Breadcrumbs>
      <Breadcrumb href="#" onPress={onBack}>
        プロジェクト
      </Breadcrumb>
      <Breadcrumb>{project.name}</Breadcrumb>
    </Breadcrumbs>
    <Stack gap="xxs">
      <Typography size="xxl" fontWeight="bold" component="h1">
        {project.name}
      </Typography>
      <Typography size="s" color="medium_emphasis">
        このプロジェクトの利用状況と、利用開始に必要な情報
      </Typography>
    </Stack>

    <Tabs selectedKey={tab} onSelectionChange={(k) => onTab(k as typeof tab)}>
      <TabList aria-label="プロジェクト">
        <Tab id="overview">概要</Tab>
        <Tab id="keys">APIキー</Tab>
        <Tab id="usage">使用状況</Tab>
        <Tab id="settings">設定</Tab>
      </TabList>

      <TabPanel id="overview">
        <Stack gap="l">
          <Card>
            <Stack gap="m">
              <Typography size="l" fontWeight="bold" component="h2">
                クイックスタート
              </Typography>
              <Typography size="s" color="medium_emphasis">
                発行した API キーを Authorization ヘッダに載せて、下記のエンドポイントに送ります。
              </Typography>
              {/* GAP: 等幅フォントのトークンが無い */}
              <Paper elevation={0} outlined>
                <div style={{ padding: 16 }}>
                  <Stack gap="xxs">
                    {[
                      'curl https://ai-gateway.lolipop.jp/v1/chat/completions \\',
                      '  -H "Authorization: Bearer $OCTANE_API_KEY" \\',
                      '  -H "Content-Type: application/json" \\',
                      '  -d \'{"model":"claude-fable-5-1","messages":[...]}\'',
                    ].map((line) => (
                      <Typography
                        key={line}
                        size="xs"
                        density="dense"
                        color="medium_emphasis"
                        component="span"
                      >
                        {line}
                      </Typography>
                    ))}
                  </Stack>
                </div>
              </Paper>
              <Stack flexDirection="row" gap="s">
                <Button
                  appearance="outlined"
                  size="s"
                  leading={<Icon name="copy" size="s" />}
                  onPress={() => queue.add({ message: 'コピーしました' })}
                >
                  コピー
                </Button>
                <Button
                  appearance="transparent"
                  size="s"
                  trailing={<Icon name="launch" size="s" />}
                >
                  ドキュメント
                </Button>
                <Button appearance="outlined" size="s" onPress={onPlayground}>
                  プレイグラウンドで試す
                </Button>
              </Stack>
            </Stack>
          </Card>
          <Grid spacing="m">
            {[
              { label: '今月の利用', value: project.spend, unit: `/ ${project.budget}` },
              { label: 'APIキー', value: String(project.keys), unit: '件' },
              { label: '利用できるモデル', value: '3', unit: '/ 4' },
            ].map((s) => (
              <GridItem key={s.label} size={{ xxs: 12, m: 4 }}>
                <Card>
                  <Stack gap="xxs">
                    <Typography size="s" color="medium_emphasis" component="span">
                      {s.label}
                    </Typography>
                    <Stack flexDirection="row" gap="xxs" alignItems="flex-end">
                      <Typography size="xxxl" fontWeight="bold" component="span">
                        {s.value}
                      </Typography>
                      <Typography size="s" color="medium_emphasis" component="span">
                        {s.unit}
                      </Typography>
                    </Stack>
                  </Stack>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </Stack>
      </TabPanel>

      <TabPanel id="keys">
        <Card>
          <Stack gap="m">
            <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
              <Typography size="l" fontWeight="bold" component="h2">
                APIキー
              </Typography>
              <Button
                color="interactive"
                size="s"
                leading={<Icon name="plus" size="s" />}
                onPress={onCreateKey}
              >
                キーを発行
              </Button>
            </Stack>
            {/* 行を押すとキーの詳細に入る */}
            <Table aria-label="APIキー" onRowAction={(k) => onOpenKey(String(k))}>
              <TableHeader>
                <Column isRowHeader>名前</Column>
                <Column>キー</Column>
                <Column>モデル</Column>
                <Column>予算</Column>
                <Column>状態</Column>
              </TableHeader>
              <TableBody>
                {keys.map((k) => (
                  <Row key={k.id} id={k.id}>
                    <Cell>{k.name}</Cell>
                    <Cell>{k.prefix}</Cell>
                    <Cell>{k.models}</Cell>
                    <Cell>{k.budget}</Cell>
                    <Cell>
                      <Sticker color={k.state === '有効' ? 'positive' : 'neutral'} size="s">
                        {k.state}
                      </Sticker>
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
            <Typography size="xs" color="low_emphasis">
              行を押すとキーごとのモデル・上限・ガードレールを設定できます。
            </Typography>
          </Stack>
        </Card>
      </TabPanel>

      <TabPanel id="usage">
        <Stack gap="l">
          <Card>
            <Stack gap="m">
              <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
                <Typography size="l" fontWeight="bold" component="h2">
                  日別の利用額
                </Typography>
                <Select aria-label="集計期間" size="s" defaultSelectedKey="this-month">
                  <SelectItem id="this-month">今月</SelectItem>
                  <SelectItem id="last-month">先月</SelectItem>
                </Select>
              </Stack>
              {/* GAP: グラフの primitive が無い。実装は UsageCharts を 261 行の自前 CSS で書いている */}
              <Typography component="div" color="informative">
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 140 }}>
                  {daily.map((v, i) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: 日付順の固定データ
                      key={i}
                      aria-hidden="true"
                      style={{
                        flex: 1,
                        minWidth: 4,
                        borderRadius: 2,
                        background: 'currentColor',
                        height: `${(v / Math.max(...daily)) * 100}%`,
                      }}
                    />
                  ))}
                </div>
              </Typography>
            </Stack>
          </Card>
          <Card>
            <Stack gap="m">
              <Typography size="l" fontWeight="bold" component="h2">
                モデル別
              </Typography>
              <Table aria-label="モデル別の利用">
                <TableHeader>
                  <Column isRowHeader>モデル</Column>
                  <Column>リクエスト数</Column>
                  <Column>トークン</Column>
                  <Column>金額</Column>
                </TableHeader>
                <TableBody>
                  {usageByModel.map((u) => (
                    <Row key={u.model}>
                      <Cell>{u.model}</Cell>
                      <Cell>{u.requests}</Cell>
                      <Cell>{u.tokens}</Cell>
                      <Cell>{u.cost}</Cell>
                    </Row>
                  ))}
                </TableBody>
              </Table>
            </Stack>
          </Card>
        </Stack>
      </TabPanel>

      <TabPanel id="settings">
        <Stack gap="l">
          <Card>
            <Stack gap="m">
              <Typography size="l" fontWeight="bold" component="h2">
                基本設定
              </Typography>
              <TextField label="プロジェクト名" defaultValue={project.name} width="full" />
              <TextField
                label="月間予算"
                caption="上限に達すると新しいリクエストが拒否されます"
                defaultValue={project.budget}
                width="half"
              />
              <Divider />
              <Switch label="予算の 80% で通知する" color="interactive" defaultSelected />
              <Switch label="上限に達したらキーを自動で無効化する" color="interactive" />
            </Stack>
          </Card>
          <Card outlined>
            <Stack gap="m">
              <Typography size="l" fontWeight="bold" component="h2">
                プロジェクトの削除
              </Typography>
              <Callout color="negative" appearance="outline">
                削除すると、このプロジェクトの API
                キーがすべて失効し、使用履歴も参照できなくなります。
              </Callout>
            </Stack>
          </Card>
        </Stack>
      </TabPanel>
    </Tabs>
  </Stack>
)

// ─── キー詳細 ───

const KeyScreen = ({
  project,
  keys,
  keyId,
  tab,
  onTab,
  onBack,
  onProject,
}: {
  project: (typeof projects)[number]
  keys: typeof initialKeys
  keyId: string
  tab: 'models' | 'limits' | 'guardrails'
  onTab: (t: 'models' | 'limits' | 'guardrails') => void
  onBack: () => void
  onProject: () => void
}) => {
  const k = keys.find((x) => x.id === keyId) ?? keys[0]
  return (
    <Stack gap="l">
      <Breadcrumbs>
        <Breadcrumb href="#" onPress={onBack}>
          プロジェクト
        </Breadcrumb>
        <Breadcrumb href="#" onPress={onProject}>
          {project.name}
        </Breadcrumb>
        <Breadcrumb>{k.name}</Breadcrumb>
      </Breadcrumbs>
      <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="m" justifyContent="space-between">
        <Stack gap="xxs">
          <Typography size="xxl" fontWeight="bold" component="h1">
            {k.name}
          </Typography>
          <Stack flexDirection="row" gap="xs" alignItems="center">
            <Typography size="s" color="medium_emphasis" component="span">
              {k.prefix}
            </Typography>
            <Button appearance="transparent" size="s" iconOnly aria-label="キーをコピー">
              <Icon name="copy" size="s" />
            </Button>
            <Sticker color={k.state === '有効' ? 'positive' : 'neutral'} size="s">
              {k.state}
            </Sticker>
          </Stack>
        </Stack>
        <Stack flexDirection="row" gap="s">
          <Button appearance="outlined">無効にする</Button>
          <Button appearance="outlined" color="negative">
            失効させる
          </Button>
        </Stack>
      </Stack>

      <Tabs selectedKey={tab} onSelectionChange={(t) => onTab(t as typeof tab)}>
        <TabList aria-label="APIキーの設定">
          <Tab id="models">モデル</Tab>
          <Tab id="limits">上限</Tab>
          <Tab id="guardrails">ガードレール</Tab>
        </TabList>

        <TabPanel id="models">
          <Card>
            <Stack gap="m">
              <Typography size="l" fontWeight="bold" component="h2">
                このキーで使えるモデル
              </Typography>
              <Typography size="s" color="medium_emphasis">
                プロジェクトで許可されているモデルの範囲内で選べます。
              </Typography>
              <Stack gap="xs">
                {models.map((m) => (
                  <Stack
                    key={m.id}
                    flexDirection="row"
                    gap="m"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack gap="xxs">
                      <Stack flexDirection="row" gap="xs" alignItems="center">
                        <Typography component="span">{m.label}</Typography>
                        <Sticker color="neutral" size="s">
                          {m.vendor}
                        </Sticker>
                      </Stack>
                      <Typography size="xs" color="low_emphasis">
                        {m.id}
                      </Typography>
                    </Stack>
                    <Switch
                      aria-label={`${m.label} を許可`}
                      color="interactive"
                      defaultSelected={m.allowed}
                      isDisabled={!m.allowed}
                    />
                  </Stack>
                ))}
              </Stack>
              <Typography size="xs" color="low_emphasis">
                プロジェクトで許可されていないモデルは切り替えられません。
              </Typography>
            </Stack>
          </Card>
        </TabPanel>

        <TabPanel id="limits">
          <Card>
            <Stack gap="m">
              <Typography size="l" fontWeight="bold" component="h2">
                上限
              </Typography>
              <Grid spacing="m">
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <TextField
                    label="月間予算"
                    caption="空欄にするとプロジェクトの上限を継承します"
                    defaultValue={k.budget}
                    width="full"
                  />
                </GridItem>
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <TextField label="1 分あたりのリクエスト数" defaultValue="600" width="full" />
                </GridItem>
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <TextField label="1 分あたりのトークン数" defaultValue="150,000" width="full" />
                </GridItem>
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <Select label="上限に達したときの動作" width="full" defaultSelectedKey="reject">
                    <SelectItem id="reject">リクエストを拒否する</SelectItem>
                    <SelectItem id="queue">キューに入れる</SelectItem>
                  </Select>
                </GridItem>
              </Grid>
              <Divider />
              <Stack gap="xxs">
                <Stack flexDirection="row" justifyContent="space-between" alignItems="flex-end">
                  <Typography size="s" color="medium_emphasis" component="span">
                    今月の利用
                  </Typography>
                  <Typography size="s" fontWeight="bold" component="span">
                    ¥22,410 / {k.budget}
                  </Typography>
                </Stack>
                <Meter ratio={0.74} />
              </Stack>
              <Stack flexDirection="row" gap="s" justifyContent="flex-end">
                <Button appearance="outlined">変更を破棄</Button>
                <Button
                  color="interactive"
                  onPress={() => queue.add({ message: '上限を保存しました' })}
                >
                  保存する
                </Button>
              </Stack>
            </Stack>
          </Card>
        </TabPanel>

        <TabPanel id="guardrails">
          <Card>
            <Stack gap="m">
              <Typography size="l" fontWeight="bold" component="h2">
                ガードレール
              </Typography>
              <Switch label="個人情報の検出をブロックする" color="interactive" defaultSelected />
              <Switch
                label="プロンプトインジェクションの検出"
                color="interactive"
                defaultSelected
              />
              <Switch label="出力に機密パターンが含まれたら遮断する" color="interactive" />
              <Divider />
              <TextField
                label="禁止パターン"
                caption="1 行に 1 つ、正規表現で指定します"
                component="textarea"
                defaultValue={'(?i)password\\s*[:=]\\n(?i)secret_key'}
                width="full"
              />
              <Callout color="informative">
                ガードレールに引っかかったリクエストは使用量には計上されますが、モデルには送信されません。
              </Callout>
            </Stack>
          </Card>
        </TabPanel>
      </Tabs>
    </Stack>
  )
}

// ─── モデル一覧 ───

const allModels = [
  {
    id: 'claude-fable-5-1',
    label: 'Claude Fable 5.1',
    vendor: 'Anthropic',
    ctx: '1M',
    inPrice: '¥0.45',
    outPrice: '¥2.25',
    allowed: true,
  },
  {
    id: 'claude-opus-5',
    label: 'Claude Opus 5',
    vendor: 'Anthropic',
    ctx: '500K',
    inPrice: '¥0.75',
    outPrice: '¥3.75',
    allowed: true,
  },
  {
    id: 'claude-sonnet-5',
    label: 'Claude Sonnet 5',
    vendor: 'Anthropic',
    ctx: '500K',
    inPrice: '¥0.15',
    outPrice: '¥0.75',
    allowed: true,
  },
  {
    id: 'claude-haiku-4-5',
    label: 'Claude Haiku 4.5',
    vendor: 'Anthropic',
    ctx: '200K',
    inPrice: '¥0.04',
    outPrice: '¥0.20',
    allowed: true,
  },
  {
    id: 'gpt-5',
    label: 'GPT-5',
    vendor: 'OpenAI',
    ctx: '400K',
    inPrice: '¥0.38',
    outPrice: '¥1.90',
    allowed: false,
  },
]

const ModelsScreen = () => (
  <Stack gap="l">
    <Stack gap="xxs">
      <Typography size="xxl" fontWeight="bold" component="h1">
        モデル
      </Typography>
      <Typography size="s" color="medium_emphasis">
        組織で利用できるモデルと単価。プロジェクトごとに使えるモデルを絞り込めます。
      </Typography>
    </Stack>
    <Card>
      <Table aria-label="モデル一覧">
        <TableHeader>
          <Column isRowHeader>モデル</Column>
          <Column>提供元</Column>
          <Column>コンテキスト</Column>
          <Column>入力 / 1K</Column>
          <Column>出力 / 1K</Column>
          <Column>組織での利用</Column>
        </TableHeader>
        <TableBody>
          {allModels.map((m) => (
            <Row key={m.id}>
              <Cell>
                <Stack gap="xxs">
                  <Typography component="span">{m.label}</Typography>
                  <Typography size="xs" color="low_emphasis">
                    {m.id}
                  </Typography>
                </Stack>
              </Cell>
              <Cell>{m.vendor}</Cell>
              <Cell>{m.ctx}</Cell>
              <Cell>{m.inPrice}</Cell>
              <Cell>{m.outPrice}</Cell>
              <Cell>
                <Switch
                  aria-label={`${m.label} を許可`}
                  size="s"
                  color="interactive"
                  defaultSelected={m.allowed}
                />
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </Card>
    <Callout color="informative">
      組織で無効にしたモデルは、どのプロジェクトからも呼び出せなくなります。
    </Callout>
  </Stack>
)

// ─── プレイグラウンド ───

const PlaygroundScreen = ({
  project,
  keys,
  onBack,
}: {
  project: (typeof projects)[number]
  keys: typeof initialKeys
  onBack: () => void
}) => {
  const [prompt, setPrompt] = useState('')
  const [log, setLog] = useState<{ role: 'user' | 'assistant'; text: string }[]>([])
  const [running, setRunning] = useState(false)

  const send = () => {
    if (!prompt) return
    const text = prompt
    setLog((l) => [...l, { role: 'user', text }])
    setPrompt('')
    setRunning(true)
    setTimeout(() => {
      setLog((l) => [
        ...l,
        {
          role: 'assistant',
          text: 'これはプレイグラウンドの応答例です。実際にはモデルからの出力が入ります。',
        },
      ])
      setRunning(false)
    }, 1200)
  }

  return (
    <Stack gap="l">
      <Breadcrumbs>
        <Breadcrumb href="#" onPress={onBack}>
          プロジェクト
        </Breadcrumb>
        <Breadcrumb>{project.name}</Breadcrumb>
        <Breadcrumb>プレイグラウンド</Breadcrumb>
      </Breadcrumbs>
      <Typography size="xxl" fontWeight="bold" component="h1">
        プレイグラウンド
      </Typography>
      <Grid spacing="l">
        <GridItem size={{ xxs: 12, l: 8 }}>
          <Card>
            <Stack gap="m">
              <Stack gap="s">
                {log.length === 0 ? (
                  <Typography size="s" color="medium_emphasis">
                    プロンプトを入力して実行すると、ここに応答が表示されます。
                  </Typography>
                ) : (
                  log.map((m, i) => (
                    <Paper
                      // biome-ignore lint/suspicious/noArrayIndexKey: 追記のみの会話ログ
                      key={i}
                      elevation={0}
                      outlined={m.role === 'user'}
                    >
                      <div style={{ padding: 16 }}>
                        <Stack gap="xxs">
                          <Typography size="xs" color="low_emphasis">
                            {m.role === 'user' ? 'あなた' : 'Claude Fable 5.1'}
                          </Typography>
                          <Typography size="s">{m.text}</Typography>
                        </Stack>
                      </div>
                    </Paper>
                  ))
                )}
                {running && (
                  <Stack flexDirection="row" gap="xs" alignItems="center">
                    <Icon name="ellipsis_horizontal" size="s" />
                    <Typography size="s" color="medium_emphasis" component="span">
                      生成しています…
                    </Typography>
                  </Stack>
                )}
              </Stack>
              <Divider />
              <TextField
                aria-label="プロンプト"
                placeholder="プロンプトを入力"
                component="textarea"
                width="full"
                value={prompt}
                onChange={setPrompt}
              />
              <Stack flexDirection="row" gap="s" justifyContent="flex-end">
                <Button appearance="outlined" onPress={() => setLog([])}>
                  クリア
                </Button>
                <Button color="interactive" isDisabled={running || !prompt} onPress={send}>
                  実行
                </Button>
              </Stack>
            </Stack>
          </Card>
        </GridItem>
        <GridItem size={{ xxs: 12, l: 4 }}>
          <Card>
            <Stack gap="m">
              <Typography size="l" fontWeight="bold" component="h2">
                設定
              </Typography>
              <Select label="モデル" width="full" defaultSelectedKey="claude-fable-5-1">
                {allModels
                  .filter((m) => m.allowed)
                  .map((m) => (
                    <SelectItem key={m.id} id={m.id}>
                      {m.label}
                    </SelectItem>
                  ))}
              </Select>
              <Select label="APIキー" width="full" defaultSelectedKey="k-02">
                {keys.map((k) => (
                  <SelectItem key={k.id} id={k.id}>
                    {k.name}
                  </SelectItem>
                ))}
              </Select>
              <TextField label="最大トークン数" defaultValue="4096" width="full" />
              <Divider />
              <Callout color="notice">
                プレイグラウンドでの実行も使用量と請求に計上されます。
              </Callout>
            </Stack>
          </Card>
        </GridItem>
      </Grid>
    </Stack>
  )
}

// ─── メンバー ───

const MembersScreen = ({
  members,
  onInvite,
  onRemove,
}: {
  members: typeof initialMembers
  onInvite: () => void
  onRemove: (email: string) => void
}) => (
  <Stack gap="l">
    <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="m" justifyContent="space-between">
      <Typography size="xxl" fontWeight="bold" component="h1">
        メンバー
      </Typography>
      <Button color="interactive" leading={<Icon name="person_plus" size="s" />} onPress={onInvite}>
        メンバーを招待
      </Button>
    </Stack>
    <Card>
      <Table aria-label="メンバー">
        <TableHeader>
          <Column isRowHeader>名前</Column>
          <Column>メールアドレス</Column>
          <Column>権限</Column>
          <Column>操作</Column>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <Row key={m.email}>
              <Cell>{m.name}</Cell>
              <Cell>{m.email}</Cell>
              <Cell>
                <Sticker color={m.role === '管理者' ? 'informative' : 'neutral'} size="s">
                  {m.role}
                </Sticker>
              </Cell>
              <Cell>
                <Button
                  appearance="transparent"
                  size="s"
                  isDisabled={m.role === '管理者'}
                  onPress={() => onRemove(m.email)}
                >
                  削除
                </Button>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </Card>
  </Stack>
)

// ─── 請求 ───

const BillingScreen = () => (
  <Stack gap="l">
    <Typography size="xxl" fontWeight="bold" component="h1">
      請求
    </Typography>
    <Grid spacing="m">
      {[
        { label: '今月の利用額', value: '¥64,590', unit: '（税込）' },
        { label: '先月', value: '¥58,120', unit: '（税込）' },
        { label: '支払い方法', value: '**** 4242', unit: 'Visa' },
      ].map((s) => (
        <GridItem key={s.label} size={{ xxs: 12, m: 4 }}>
          <Card>
            <Stack gap="xxs">
              <Typography size="s" color="medium_emphasis" component="span">
                {s.label}
              </Typography>
              <Stack flexDirection="row" gap="xxs" alignItems="flex-end">
                <Typography size="xxl" fontWeight="bold" component="span">
                  {s.value}
                </Typography>
                <Typography size="s" color="medium_emphasis" component="span">
                  {s.unit}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </GridItem>
      ))}
    </Grid>
    <Card>
      <Stack gap="m">
        <Typography size="l" fontWeight="bold" component="h2">
          プロジェクト別の内訳
        </Typography>
        <Table aria-label="プロジェクト別の内訳">
          <TableHeader>
            <Column isRowHeader>プロジェクト</Column>
            <Column>今月の利用額</Column>
            <Column>予算</Column>
            <Column>消化率</Column>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <Row key={p.id}>
                <Cell>{p.name}</Cell>
                <Cell>{p.spend}</Cell>
                <Cell>{p.budget}</Cell>
                <Cell>
                  <Stack gap="xxs">
                    <Typography size="s" component="span">
                      {Math.round(p.ratio * 100)}%
                    </Typography>
                    <Meter ratio={p.ratio} />
                  </Stack>
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </Stack>
    </Card>
  </Stack>
)

// ─── アプリ本体 ───

const App = () => {
  const [route, setRoute] = useState<Route>({ name: 'projects' })
  const [keys, setKeys] = useState(initialKeys)
  const [members, setMembers] = useState(initialMembers)
  const [keyDialog, setKeyDialog] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [inviteDialog, setInviteDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  const projectId =
    route.name === 'project'
      ? route.id
      : route.name === 'key' || route.name === 'playground'
        ? route.projectId
        : projects[0].id
  const project = projects.find((p) => p.id === projectId) ?? projects[0]

  return (
    <>
      <Layout route={route} onNavigate={setRoute}>
        {route.name === 'projects' && (
          <ProjectsScreen onOpen={(id) => setRoute({ name: 'project', id, tab: 'overview' })} />
        )}
        {route.name === 'project' && (
          <ProjectScreen
            project={project}
            tab={route.tab}
            onTab={(tab) => setRoute({ name: 'project', id: project.id, tab })}
            onBack={() => setRoute({ name: 'projects' })}
            onOpenKey={(keyId) =>
              setRoute({ name: 'key', projectId: project.id, keyId, tab: 'models' })
            }
            onCreateKey={() => setKeyDialog(true)}
            onPlayground={() => setRoute({ name: 'playground', projectId: project.id })}
            keys={keys}
          />
        )}
        {route.name === 'key' && (
          <KeyScreen
            project={project}
            keys={keys}
            keyId={route.keyId}
            tab={route.tab}
            onTab={(tab) =>
              setRoute({ name: 'key', projectId: project.id, keyId: route.keyId, tab })
            }
            onBack={() => setRoute({ name: 'projects' })}
            onProject={() => setRoute({ name: 'project', id: project.id, tab: 'keys' })}
          />
        )}
        {route.name === 'playground' && (
          <PlaygroundScreen
            project={project}
            keys={keys}
            onBack={() => setRoute({ name: 'projects' })}
          />
        )}
        {route.name === 'models' && <ModelsScreen />}
        {route.name === 'members' && (
          <MembersScreen
            members={members}
            onInvite={() => setInviteDialog(true)}
            onRemove={(email) => {
              setMembers((prev) => prev.filter((m) => m.email !== email))
              queue.add({ message: `${email} を削除しました`, state: 'neutral' })
            }}
          />
        )}
        {route.name === 'billing' && <BillingScreen />}
      </Layout>

      <Dialog isOpen={keyDialog} onOpenChange={setKeyDialog}>
        <DialogHeader>
          <DialogTitle>APIキーを発行</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          発行したキーは一度だけ表示されます。安全な場所に保存してください。
        </DialogDescription>
        <Stack gap="m">
          <TextField
            label="名前"
            placeholder="production"
            width="full"
            isRequired
            value={keyName}
            onChange={setKeyName}
          />
          <TextField
            label="月間予算"
            caption="空欄にするとプロジェクトの上限を継承します"
            width="half"
          />
          <Checkbox defaultSelected>
            プロジェクトで許可されているモデルをすべて使えるようにする
          </Checkbox>
        </Stack>
        <DialogFooter>
          <Button appearance="outlined" onPress={() => setKeyDialog(false)}>
            キャンセル
          </Button>
          <Button
            color="interactive"
            isDisabled={!keyName}
            onPress={() => {
              const suffix = Math.random().toString(16).slice(2, 6)
              setKeys((prev) => [
                ...prev,
                {
                  id: `k-${Date.now()}`,
                  name: keyName,
                  prefix: `sk-oct-...${suffix}`,
                  models: '3 モデル',
                  budget: '継承',
                  state: '有効',
                },
              ])
              setKeyName('')
              setKeyDialog(false)
              queue.add({ message: 'APIキーを発行しました' })
            }}
          >
            発行する
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog isOpen={inviteDialog} onOpenChange={setInviteDialog}>
        <DialogHeader>
          <DialogTitle>メンバーを招待</DialogTitle>
        </DialogHeader>
        <DialogDescription>招待メールのリンクから参加できます。</DialogDescription>
        <Stack gap="m">
          <TextField
            label="メールアドレス"
            placeholder="name@example.com"
            type="email"
            width="full"
            isRequired
          />
          <Select label="権限" width="full" defaultSelectedKey="member">
            <SelectItem id="admin">管理者</SelectItem>
            <SelectItem id="member">メンバー</SelectItem>
            <SelectItem id="viewer">閲覧のみ</SelectItem>
          </Select>
        </Stack>
        <DialogFooter>
          <Button appearance="outlined" onPress={() => setInviteDialog(false)}>
            キャンセル
          </Button>
          <Button
            color="interactive"
            isDisabled={!inviteEmail}
            onPress={() => {
              setMembers((prev) => [
                ...prev,
                { name: inviteEmail.split('@')[0], email: inviteEmail, role: 'メンバー' },
              ])
              setInviteEmail('')
              setInviteDialog(false)
              queue.add({ message: '招待メールを送信しました' })
            }}
          >
            招待する
          </Button>
        </DialogFooter>
      </Dialog>
      <SnackBar queue={queue} />
    </>
  )
}

// ─── ストーリー ───

/**
 * AIゲートウェイの管理画面。実際に押して遷移する。
 *
 * - プロジェクトのカードの「開く」で詳細に入る
 * - APIキーのタブで行を押すとキーの詳細（モデル・上限・ガードレール）に入る
 * - 概要タブの「プレイグラウンドで試す」でプロンプトを実行できる画面に入る
 * - 左のメニューでプロジェクト・モデル・メンバー・請求を行き来する
 * - 「キーを発行」「メンバーを招待」でダイアログが開き、スナックバーが出る
 * - internal-playground は予算の 97.8% まで使っていて、メーターが赤くなる
 *
 * @summary AIゲートウェイ（操作できる）
 */
export const Default: Story = {
  render: () => <App />,
}
