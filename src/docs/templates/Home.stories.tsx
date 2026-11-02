import { useState } from 'react'
import { TabPanel } from 'react-aria-components'

import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Container } from '../../Container'
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Paper } from '../../Paper'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Tab, TabList, Tabs } from '../../Tab'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../Table'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import { AppShell } from './AppShell'
import { Card, Inset, PageHeader } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { IconName } from '../../Icon'
import type { StickerColor } from '../../Sticker'
import type { TypographyColor } from '../../Typography'

/**
 * ホーム。ゲーマーズのホーム（apollo/frontend の app/(application)/(private)/home）を主にし、
 * デプロイナウのプロジェクト一覧（hosting-deploy-now/frontend の features/Projects）を
 * 同じページの下に並べている。
 *
 * 文言・項目・状態は 2 つの実装から取っている。元にしたファイルは各部品のコメントに書いた。
 * 見出しは実物のものだけを使う。ゲーマーズはページ見出し「ホーム」の直下にタブ、デプロイナウは「使用量」と
 * 「プロジェクト」。階層だけは 1 ページにまとめるために変えている（実物は「ホーム」と「プロジェクト」がそれぞれ h1）。
 */

const meta = {
  title: 'Templates/Home',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// 削った状態（読み込み中・使用量の上限なし）にあった GAP の記録
// GAP-NEW: Skeleton が無い。実物はサーバーの状態（幅 120）と IP アドレス（幅 150）の取得までテキストの Skeleton を出す
// GAP-NEW: Stack の alignItems に baseline が無い。実物の使用量は上限が無いとき実数と単位を items-baseline で並べる

// ─── GAP の回避策（inline style はここに集める） ───

// GAP-18: 進捗バーが無い。Typography で色を継承させ、currentColor で塗っている。
// 高さ・角丸・トラックの不透明度はトークンに出典が無い暫定値。
const meterTrackStyle = { height: 6, borderRadius: 3, opacity: 0.15 }
const meterFillStyle = { height: 6, borderRadius: 3, marginTop: -6 }

const Meter = ({ ratio, tone }: { ratio: number; tone: TypographyColor }) => (
  <Typography component="div" color={tone}>
    <div style={{ ...meterTrackStyle, background: 'currentColor' }} />
    <div
      style={{
        ...meterFillStyle,
        width: `${Math.min(ratio, 1) * 100}%`,
        background: 'currentColor',
      }}
    />
  </Typography>
)

// GAP-1: 一覧の行。実物は px-6 py-3.5（行）と px-6 py-3（列見出し）。
const projectRowStyle = { paddingBlock: 14, paddingInline: 24 }
const projectHeaderStyle = { paddingBlock: 12, paddingInline: 24 }

// GAP-NEW: TabPanel と本文のあいだに間隔が無く、タブの下線に本文が接する。実物は Grid の mt={2}（16px）。
const panelStyle = { paddingTop: 16 }
const Panel = ({ children }: { children: ReactNode }) => <div style={panelStyle}>{children}</div>

// ─── データ：ゲームサーバー（形は apollo の API レスポンスに合わせ、値はダミー）───

// 表示名は backend/entity/game.go の GameDisplayNames
type GameId = 'minecraft-je' | 'palworld' | 'seven-days-to-die' | 'ark-se'
const gameNames: Record<GameId, string> = {
  'minecraft-je': 'Minecraft (Java版)',
  palworld: 'パルワールド',
  'seven-days-to-die': '7 Days to Die',
  'ark-se': 'ARK: Survival Evolved',
}

/** GetServerResponse_IntegratedStatus。UNKNOWN / BACKING_UP / RESTORING は ServerStatusView の default（準備中） */
type ServerStatus =
  | 'RUNNING'
  | 'STOPPED'
  | 'STARTING'
  | 'STOPPING'
  | 'FAILURE'
  | 'UNKNOWN'
  | 'BACKING_UP'
  | 'RESTORING'

type Server = {
  id: string
  name: string
  game: GameId
  ip: string
  /** subscriptionPlanDisplayName */
  plan: string
  status: ServerStatus
  /** 直近の請求の paymentStatus が FAILED */
  paymentFailed?: boolean
}

// IP アドレスは文書用のアドレス範囲（RFC 5737）
const servers: Server[] = [
  {
    id: 'sv-3f9a2c1e',
    name: 'LOLIPOP-GAMERS-SERVER',
    game: 'minecraft-je',
    ip: '203.0.113.24',
    plan: '8GBプラン',
    status: 'RUNNING',
  },
  {
    id: 'sv-a81e44b0',
    name: 'ARK 検証用',
    game: 'ark-se',
    ip: '203.0.113.61',
    plan: '16GBプラン',
    status: 'STARTING',
  },
  {
    id: 'sv-7b21d0a4',
    name: 'パル島',
    game: 'palworld',
    ip: '203.0.113.87',
    plan: '16GBプラン',
    status: 'STOPPED',
  },
  {
    id: 'sv-c05e9f13',
    name: '週末7dtd',
    game: 'seven-days-to-die',
    ip: '203.0.113.140',
    plan: '8GBプラン',
    status: 'STOPPED',
    paymentFailed: true,
  },
  {
    id: 'sv-e4d2b7a9',
    name: 'クラフト部',
    game: 'minecraft-je',
    ip: '203.0.113.152',
    plan: '4GBプラン',
    status: 'BACKING_UP',
  },
]

type Backup = {
  id: string
  name: string
  game: GameId
  size: string
  createdAt: string
  status: 'SUCCESS' | 'PENDING' | 'FAILED'
}

// 名前は CreateBackupDialog の既定値（サーバー名-yyyyMMdd-HHmm）、サイズと日時は formatBytes / formatCreatedAt と同じ形
const backups: Backup[] = [
  {
    id: 'bk-04',
    name: 'パル島-20261030-0912',
    game: 'palworld',
    size: '0.00B',
    createdAt: '2026-10-30 09:12',
    status: 'PENDING',
  },
  {
    id: 'bk-01',
    name: 'LOLIPOP-GAMERS-SERVER-20261028-0400',
    game: 'minecraft-je',
    size: '1.23GB',
    createdAt: '2026-10-28 04:00',
    status: 'SUCCESS',
  },
  {
    id: 'bk-02',
    name: 'LOLIPOP-GAMERS-SERVER-20261021-2214',
    game: 'minecraft-je',
    size: '1.17GB',
    createdAt: '2026-10-21 22:14',
    status: 'SUCCESS',
  },
  {
    id: 'bk-03',
    name: 'パル島-20261019-2301',
    game: 'palworld',
    size: '0.00B',
    createdAt: '2026-10-19 23:01',
    status: 'FAILED',
  },
]

/** MyBackupPaper/view.tsx の LIMIT_BYTES（50GB） */
const BACKUP_LIMIT_GB = 50

// ─── データ：サイト（hosting-deploy-now の ProjectListItem と同じ形。値はダミー）───

const ZONE = 'lolipop-now.app'

type ProjectStatus = '成功' | 'ビルド中' | '失敗' | 'キャンセル済み' | 'キャンセル中' | '未デプロイ'
type ServingStatus = '稼働中' | '未公開'

/** shared/lib/projectStatus.ts の PROJECT_STATUS_COLOR / SERVING_STATUS_COLOR */
const PROJECT_STATUS_COLOR: Record<ProjectStatus, StickerColor> = {
  成功: 'positive',
  ビルド中: 'notice',
  失敗: 'negative',
  キャンセル済み: 'neutral',
  キャンセル中: 'neutral',
  未デプロイ: 'neutral',
}
const SERVING_STATUS_COLOR: Record<ServingStatus, StickerColor> = {
  稼働中: 'positive',
  未公開: 'neutral',
}

type Project = {
  id: string
  name: string
  /** 空文字は「ドメイン未発行」 */
  domain: string
  servingStatus: ServingStatus
  githubRepositoryFullName?: string
  tags: string[]
  status: ProjectStatus
  /** toLastDeployedAt の結果（ビルド中は「進行中」、失敗と未デプロイは「—」） */
  lastDeployedAt: string
}

const projects: Project[] = [
  {
    id: 'p1',
    name: 'portfolio',
    domain: `portfolio.${ZONE}`,
    servingStatus: '稼働中',
    githubRepositoryFullName: 'example-inc/portfolio',
    tags: ['Next.js'],
    status: '成功',
    lastDeployedAt: '3分前',
  },
  {
    id: 'p2',
    name: 'shop-api',
    domain: `shop-api.${ZONE}`,
    servingStatus: '稼働中',
    githubRepositoryFullName: 'example-inc/shop-api',
    tags: ['production', 'OpenAI', 'stripe', 'beta'],
    status: 'ビルド中',
    lastDeployedAt: '進行中',
  },
  {
    id: 'p3',
    name: 'blog',
    domain: `blog.${ZONE}`,
    servingStatus: '稼働中',
    tags: [],
    status: '失敗',
    lastDeployedAt: '—',
  },
  {
    id: 'p4',
    name: 'landing-2026',
    domain: '',
    servingStatus: '未公開',
    tags: [],
    status: '未デプロイ',
    lastDeployedAt: '—',
  },
]

/** features/Projects/features/UsageSummary/model.ts の UsageMetricViewModel（ラベルは公開 docs のプラン表と同じ） */
type UsageMetric = { label: string; ratio: number }

const usageMetrics: UsageMetric[] = [
  { label: '月間リクエスト数', ratio: 0.42 },
  { label: '月間 CPU 実行時間', ratio: 0.78 },
  { label: 'CDN 帯域', ratio: 0.12 },
]

// ─── ゲームサーバー：部品 ───

/** components/ServerStatusView。決済失敗はステータスより優先して出す */
const statusView: Record<
  ServerStatus | 'paymentFailed',
  { label: string; color: TypographyColor; icon?: IconName }
> = {
  RUNNING: { label: '起動中', color: 'positive', icon: 'bullet_circle' },
  STOPPED: { label: '停止中', color: 'low_emphasis', icon: 'circle' },
  STARTING: { label: '起動中', color: 'high_emphasis' },
  STOPPING: { label: '停止中', color: 'high_emphasis' },
  FAILURE: { label: '起動失敗', color: 'negative', icon: 'exclamation_on_triangle' },
  UNKNOWN: { label: '準備中', color: 'high_emphasis' },
  BACKING_UP: { label: '準備中', color: 'high_emphasis' },
  RESTORING: { label: '準備中', color: 'high_emphasis' },
  paymentFailed: { label: '決済失敗', color: 'negative', icon: 'exclamation_on_triangle' },
}

const ServerStatusView = ({ server }: { server: Server }) => {
  const v = statusView[server.paymentFailed ? 'paymentFailed' : server.status]
  return (
    <Stack flexDirection="row" gap="xs" alignItems="center">
      {/* 色はアイコンにだけ付き、文字は本文色のまま。Icon の color は生の CSS 値しか取らないので Typography で継承させる */}
      <Typography component="span" size="s" color={v.color}>
        {v.icon ? <Icon name={v.icon} size="s" /> : <Loader size="s" />}
      </Typography>
      <Typography component="span" size="s">
        {v.label}
      </Typography>
    </Stack>
  )
}

/** home/_components/ServerCard の IP アドレス・プランの行（3:9） */
const ServerSpecRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <Grid spacing="s">
    <GridItem size={3}>
      <Typography size="s" color="medium_emphasis" component="span">
        {label}
      </Typography>
    </GridItem>
    <GridItem size={9}>{children}</GridItem>
  </Grid>
)

/** home/_components/ServerCard。実アプリはカード全体がサーバー詳細へのリンク（CardActionArea） */
const ServerCard = ({ server, onRename }: { server: Server; onRename: () => void }) => (
  <Card>
    <Stack gap="m">
      <Stack flexDirection="row" gap="s" alignItems="flex-start" justifyContent="space-between">
        {/* components/Sticker の spec='game-title' */}
        <Sticker color="informative" size="s">
          {gameNames[server.game]}
        </Sticker>
        <Button
          appearance="transparent"
          size="s"
          iconOnly
          aria-label="サーバーネーム変更"
          onPress={onRename}
        >
          <Icon name="pencil" size="m" />
        </Button>
      </Stack>
      {/* GAP-3: 実物はカード全体がサーバー詳細へのリンク（CardActionArea）。押せる面にできないので名前は文字のまま。
          GAP-NEW: 1 行で省略（text-overflow: ellipsis）する指定が無く、長い名前は折り返す */}
      <Typography size="xxl" fontWeight="bold" component="h3">
        {server.name}
      </Typography>
      <ServerStatusView server={server} />
      <Stack gap="xs">
        <ServerSpecRow label="IPアドレス">
          <Typography size="s" component="span">
            {server.ip}
          </Typography>
        </ServerSpecRow>
        <ServerSpecRow label="プラン">
          <Typography size="s" component="span">
            {server.plan}
          </Typography>
        </ServerSpecRow>
      </Stack>
    </Stack>
  </Card>
)

/** home/_components/HomeServerCardsList の最後の「サーバーを追加」 */
const AddServerCard = () => (
  // GAP-3: 実アプリは紫の破線（3px dashed）＋薄紫の地のカード全体が /servers/new/game-select へのリンク。
  // GAP-NEW: 破線の枠が無いので outlined で代用。最小の高さ（280px）も指定できない
  <Card outlined elevation={0}>
    <Stack gap="m" alignItems="center" justifyContent="center">
      <Typography component="span" color="informative">
        <Icon name="plus" size="l" />
      </Typography>
      <Button appearance="transparent" color="interactive">
        <Typography size="xxl" fontWeight="bold" component="span">
          サーバーを追加
        </Typography>
      </Button>
    </Stack>
  </Card>
)

/** home/_components/HomeServerCardsList（xs 12 / sm 4 の 3 カラム） */
const ServerCardsList = ({
  items,
  onRename,
}: {
  items: Server[]
  onRename: (server: Server) => void
}) => (
  <Grid spacing="m">
    {items.map((server) => (
      <GridItem key={server.id} size={{ xxs: 12, s: 4 }}>
        <ServerCard server={server} onRename={() => onRename(server)} />
      </GridItem>
    ))}
    <GridItem size={{ xxs: 12, s: 4 }}>
      <AddServerCard />
    </GridItem>
  </Grid>
)

/** home/_components/EmptyServersView（home/not-found.tsx）。契約が 0 件のときはタブごとこれに置き換わる */
const EmptyServersView = () => (
  <Container size="s">
    <Card elevation={0}>
      <Stack gap="l">
        {/* GAP-NEW: 画像の枠が無い。実アプリは buy.svg（購入のイラスト）を 12em 角で置いている */}
        <Stack alignItems="center">
          <Icon name="cart" size="l" />
        </Stack>
        <Stack gap="xs">
          <Typography>契約中のサーバーがありません</Typography>
          <Typography>契約してゲームを楽しみましょう！！</Typography>
        </Stack>
        <Button color="interactive" size="l" width="full">
          申し込む
        </Button>
      </Stack>
    </Card>
  </Container>
)

/** components/BackupUsage */
const BackupUsage = ({ usageGb }: { usageGb: number }) => (
  <Stack gap="s">
    <Typography size="l" fontWeight="bold" component="h4">
      容量使用状況
    </Typography>
    <Grid spacing="s">
      <GridItem size={{ xxs: 12, m: 5 }}>
        <Meter
          ratio={usageGb / BACKUP_LIMIT_GB}
          tone={usageGb >= BACKUP_LIMIT_GB * 0.9 ? 'negative' : 'informative'}
        />
      </GridItem>
      <GridItem size={{ xxs: 12, m: 7 }}>
        <Typography size="s" component="span">
          {usageGb.toFixed(2)}GB / {BACKUP_LIMIT_GB}GB ({(BACKUP_LIMIT_GB - usageGb).toFixed(2)}GB
          空き)
        </Typography>
      </GridItem>
    </Grid>
  </Stack>
)

/** components/BackupListTable（マイバックアップでは「ゲーム」列が出る） */
const BackupListTable = ({ items }: { items: Backup[] }) => (
  <Table aria-label="マイバックアップ">
    <TableHeader>
      <Column isRowHeader>名前</Column>
      <Column>サイズ</Column>
      <Column>作成日時</Column>
      <Column>ゲーム</Column>
      <Column aria-label="操作"> </Column>
    </TableHeader>
    <TableBody
      renderEmptyState={() => (
        <Typography size="s" color="medium_emphasis">
          バックアップがありません
        </Typography>
      )}
    >
      {items.map((b) => (
        <Row key={b.id} id={b.id}>
          <Cell>
            <Stack flexDirection="row" gap="xs" alignItems="center">
              <Typography component="span" color="informative">
                <Icon name="person" size="m" />
              </Typography>
              <Typography component="span" size="s">
                {b.name}
              </Typography>
              {b.status === 'PENDING' && (
                <Sticker color="notice" size="s">
                  作成中
                </Sticker>
              )}
              {b.status === 'FAILED' && (
                <Sticker color="negative" size="s">
                  失敗
                </Sticker>
              )}
            </Stack>
          </Cell>
          <Cell>{b.size}</Cell>
          <Cell>{b.createdAt}</Cell>
          <Cell>{gameNames[b.game]}</Cell>
          <Cell>
            {/* BackupListTable/MenuCell。成功は「復元」＋メニュー、失敗は × だけ、作成中はスピナー */}
            {b.status === 'SUCCESS' && (
              <Stack flexDirection="row" gap="xs" alignItems="center">
                {/* GAP-NEW: Replay（↺）に当たるアイコンが無いので arrow_order で代用 */}
                <Button
                  appearance="outlined"
                  size="s"
                  leading={<Icon name="arrow_order" size="s" />}
                >
                  復元
                </Button>
                {/* GAP-9: 実アプリは ⋮ で「削除」1 項目のメニューが開く */}
                <Button
                  appearance="transparent"
                  size="s"
                  iconOnly
                  aria-label={`${b.name}のメニュー`}
                >
                  <Icon name="ellipsis_vertical" size="m" />
                </Button>
              </Stack>
            )}
            {b.status === 'FAILED' && (
              <Button appearance="transparent" size="s" iconOnly aria-label={`${b.name}を削除`}>
                <Icon name="cross" size="m" />
              </Button>
            )}
            {b.status === 'PENDING' && <Loader size="m" />}
          </Cell>
        </Row>
      ))}
    </TableBody>
  </Table>
)

/** Alert の AlertTitle ＋本文。GAP-NEW: Callout にタイトルの枠が無い */
const CalloutBody = ({ title, children }: { title: string; children: ReactNode }) => (
  <Stack gap="xxs">
    <Typography size="s" fontWeight="bold" component="span">
      {title}
    </Typography>
    <Typography size="s" component="span">
      {children}
    </Typography>
  </Stack>
)

/** home/_components/MyBackupPaper */
const MyBackupPaper = ({ items }: { items: Backup[] }) => {
  const usageGb = items.reduce((sum, b) => sum + (Number.parseFloat(b.size) || 0), 0)
  const isFull = usageGb >= BACKUP_LIMIT_GB
  return (
    <Card>
      <Stack gap="l">
        <Stack
          flexDirection={{ xxs: 'column', s: 'row' }}
          gap="s"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Typography size="xxl" fontWeight="bold" component="h3">
            マイバックアップ
          </Typography>
          {/* GAP-NEW: BackupOutlined（雲）に当たるアイコンが無いので upload で代用 */}
          <Button
            appearance="outlined"
            leading={<Icon name="upload" size="s" />}
            isDisabled={isFull}
          >
            バックアップ作成
          </Button>
        </Stack>
        {isFull && (
          <Callout color="notice">
            <CalloutBody title="空き容量がありません">
              バックアップを作成するには不要なバックアップを削除してください。
            </CalloutBody>
          </Callout>
        )}
        <BackupUsage usageGb={usageGb} />
        <BackupListTable items={items} />
      </Stack>
    </Card>
  )
}

/** home/_components/ChangeServerNameModal。ボタンの見た目は lib/dialog.ts（閉じる = 文字だけ、確定 = 枠線） */
const RenameDialog = ({ server, onClose }: { server: Server | null; onClose: () => void }) => {
  const [value, setValue] = useState(server?.name ?? '')
  return (
    <Dialog
      isOpen={server !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogHeader>
        <DialogTitle>サーバーネーム変更</DialogTitle>
      </DialogHeader>
      <TextField
        aria-label="サーバーネーム"
        width="full"
        maxLength={255}
        value={value}
        onChange={setValue}
      />
      <DialogFooter>
        <Button appearance="transparent" onPress={onClose}>
          閉じる
        </Button>
        <Button appearance="outlined" isDisabled={!value} onPress={onClose}>
          変更
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

type HomeTab = 'servers' | 'myBackups'

/** home/_components/HomeContents ＋ Tabs */
const GameServersSection = ({
  items,
  defaultTab = 'servers',
  initialRenaming = null,
}: {
  items: Server[]
  defaultTab?: HomeTab
  initialRenaming?: Server | null
}) => {
  const [renaming, setRenaming] = useState<Server | null>(initialRenaming)
  return (
    <Stack gap="m">
      {/* 実物（ゲーマーズ）のページ見出しは「ホーム」だけで、その直下にタブが来る */}
      {items.length === 0 ? (
        <EmptyServersView />
      ) : (
        <Tabs defaultSelectedKey={defaultTab}>
          {/* 実物の aria-label は 'basic tabs example' のまま。ここでは内容に合わせる */}
          <TabList aria-label="ゲームサーバー">
            <Tab id="servers">
              <Stack flexDirection="row" gap="xs" alignItems="center">
                {/* GAP-NEW: DnsOutlined（ラックのサーバー）に当たるアイコンが無いので node で代用 */}
                <Icon name="node" size="m" />
                サーバー
              </Stack>
            </Tab>
            <Tab id="myBackups">
              <Stack flexDirection="row" gap="xs" alignItems="center">
                <Icon name="person" size="m" />
                マイバックアップ
              </Stack>
            </Tab>
          </TabList>
          {/* GAP-10: TabPanel は react-aria-components から直接 import している */}
          <TabPanel id="servers">
            <Panel>
              <ServerCardsList items={items} onRename={setRenaming} />
            </Panel>
          </TabPanel>
          <TabPanel id="myBackups">
            <Panel>
              <MyBackupPaper items={backups} />
            </Panel>
          </TabPanel>
        </Tabs>
      )}
      {/* key で開くたびに入力欄を現在の名前に戻す */}
      <RenameDialog
        key={renaming?.id ?? 'none'}
        server={renaming}
        onClose={() => setRenaming(null)}
      />
    </Stack>
  )
}

// ─── サイト：部品 ───

const DOT_COLOR: Record<StickerColor, TypographyColor> = {
  positive: 'positive',
  negative: 'negative',
  notice: 'notice',
  informative: 'informative',
  neutral: 'low_emphasis',
  attention: 'notice',
}

// GAP-NEW: StatusIndicator（色ドット + ラベル）が無い。実物は shared/ui/StatusIndicator で
// lolipop の solid 色を hex で持っている。ここは Icon の circle を Typography の色で塗って代える。
const StatusIndicator = ({ color, children }: { color: StickerColor; children: ReactNode }) => (
  <Stack flexDirection="row" gap="xxs" alignItems="center">
    <Typography component="span" size="xs" color={DOT_COLOR[color]}>
      <Icon name="circle" size="s" color="currentColor" aria-hidden />
    </Typography>
    <Typography component="span" size="s" color="medium_emphasis">
      {children}
    </Typography>
  </Stack>
)

/** features/Projects/features/UsageSummary/view.tsx の UsageMetricCard */
const UsageMetricCard = ({ metric }: { metric: UsageMetric }) => {
  const { ratio } = metric
  const isCritical = ratio >= 0.9
  // model.ts：使用率は floor、残りは 100 - 使用率（0 未満にしない）
  const usedPercent = Math.floor(ratio * 100)
  return (
    <Stack gap="xs">
      <Stack flexDirection="row" gap="xs" justifyContent="space-between">
        <Typography component="div" size="m" color="medium_emphasis">
          {metric.label}
        </Typography>
        <Typography component="div" size="xs" color={isCritical ? 'negative' : 'medium_emphasis'}>
          残り {Math.max(0, 100 - usedPercent)}%
        </Typography>
      </Stack>
      <Typography component="div" size="xl" fontWeight="bold">
        {usedPercent}%
      </Typography>
      {/* 実物の barColorClass：0.9 以上 red-600、0.75 以上 amber-500、それ未満 neutral-800 */}
      <Meter
        ratio={ratio}
        tone={isCritical ? 'negative' : ratio >= 0.75 ? 'notice' : 'high_emphasis'}
      />
    </Stack>
  )
}

/** features/Projects/features/UsageSummary/view.tsx */
const UsageSummary = ({ metrics }: { metrics: UsageMetric[] }) => (
  <Stack gap="s">
    <Typography component="h2" size="xxl">
      使用量
    </Typography>
    <Card outlined elevation={0}>
      <Stack gap="m">
        <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="s" justifyContent="space-between">
          <Stack flexDirection="row" gap="s" alignItems="center">
            <Typography component="div" size="l">
              利用中のプラン：Free
            </Typography>
            <Typography component="div" size="s" color="medium_emphasis">
              （2026/10/01 ~ 2026/10/31 ご利用分）
            </Typography>
          </Stack>
          {/* 遷移先は lolipop-user のアカウント画面（課金タブ）で別タブ */}
          <Button
            appearance="outlined"
            color="neutral"
            size="s"
            trailing={<Icon name="launch" size="s" />}
          >
            プラン管理
          </Button>
        </Stack>
        {/* GAP-NEW: Grid に罫線の指定が無い。実物は md 以上 3 カラム + 縦罫線（divide-x）、md 未満は横罫線 */}
        <Grid spacing="l">
          {metrics.map((metric) => (
            <GridItem key={metric.label} size={{ xxs: 12, m: 4 }}>
              <UsageMetricCard metric={metric} />
            </GridItem>
          ))}
        </Grid>
      </Stack>
    </Card>
    {/* GAP-17: 実物は md 以上で右寄せ（md:text-right）。alignItems がレスポンシブにできない */}
    <Stack alignItems="flex-end">
      <Typography component="div" size="xs" color="medium_emphasis">
        ※上限に達すると、すべてのプロジェクトが一時停止されます。
      </Typography>
    </Stack>
  </Stack>
)

const MAX_VISIBLE_TAGS = 3

/** features/Projects/view.tsx の ProjectRow */
const ProjectRow = ({ project }: { project: Project }) => {
  const visibleTags = project.tags.slice(0, MAX_VISIBLE_TAGS)
  const hidden = project.tags.length - visibleTags.length
  return (
    // GAP-NEW: 行全体をリンクにする一覧（stretched link / GridList）が無い。
    // 実物は行全体を覆う <Link className="absolute inset-0"> を敷き、ドメインだけ z-10 で前面に出している。
    // ここでは行の面は押せず、プロジェクト名をボタンにしている。
    <div style={projectRowStyle}>
      {/* GAP-NEW: Grid に alignItems が無く、右 2 列を名前ブロックの縦中央にそろえられない */}
      <Grid spacing="s">
        <GridItem size={{ xxs: 12, m: 8 }}>
          <Stack gap="xxs">
            <Stack flexDirection="row" gap="xs" alignItems="center">
              <Button appearance="transparent" size="s" aria-label={`${project.name} の詳細`}>
                <Typography size="m" fontWeight="bold" component="span">
                  {project.name}
                </Typography>
              </Button>
              {/* GAP-NEW: ラベルの無いドット（StatusDot）も無い。aria-label で状態を補う */}
              <Typography
                component="span"
                color={DOT_COLOR[SERVING_STATUS_COLOR[project.servingStatus]]}
              >
                <Icon
                  name="circle"
                  size="s"
                  color="currentColor"
                  role="img"
                  aria-label={project.servingStatus}
                />
              </Typography>
            </Stack>
            {project.domain ? (
              // GAP-NEW: 文中のテキストリンクが無い。実物は native a + text-[#0b3893]（別タブ）
              <Stack flexDirection="row">
                <Button
                  appearance="transparent"
                  color="interactive"
                  size="s"
                  trailing={<Icon name="launch" size="s" />}
                >
                  {project.domain}
                </Button>
              </Stack>
            ) : (
              <Typography size="s" color="low_emphasis">
                ドメイン未発行
              </Typography>
            )}
            {project.githubRepositoryFullName && (
              <Stack flexDirection="row" gap="xxs" alignItems="center">
                <Typography component="span" size="xs" color="medium_emphasis">
                  <Icon name="github" size="s" color="currentColor" aria-hidden />
                </Typography>
                <Typography component="span" size="xs" color="medium_emphasis">
                  {project.githubRepositoryFullName}
                </Typography>
              </Stack>
            )}
            {visibleTags.length > 0 && (
              <Stack flexDirection="row" gap="xs">
                {visibleTags.map((tag) => (
                  <Sticker key={tag} color="neutral" size="s">
                    {tag}
                  </Sticker>
                ))}
                {hidden > 0 && (
                  <Sticker color="neutral" size="s">
                    {`+${hidden}`}
                  </Sticker>
                )}
              </Stack>
            )}
          </Stack>
        </GridItem>
        <GridItem size={{ xxs: 6, m: 2 }}>
          <StatusIndicator color={PROJECT_STATUS_COLOR[project.status]}>
            {project.status}
          </StatusIndicator>
        </GridItem>
        <GridItem size={{ xxs: 6, m: 2 }}>
          <Stack alignItems="flex-end">
            <Typography component="div" size="s" color="medium_emphasis">
              {project.lastDeployedAt}
            </Typography>
          </Stack>
        </GridItem>
      </Grid>
    </div>
  )
}

/** features/Projects/view.tsx の ProjectsBody */
const ProjectsBody = ({ items }: { items: Project[] }) => {
  if (items.length === 0) {
    return (
      <Inset>
        <Stack gap="m" alignItems="center">
          <Stack gap="xs" alignItems="center">
            <Typography size="m" fontWeight="bold">
              まだプロジェクトがありません
            </Typography>
            <Typography size="s" color="medium_emphasis">
              プロジェクトを作成し、アプリケーションをデプロイ
            </Typography>
          </Stack>
          <Button appearance="flat" color="neutral" size="s">
            プロジェクトを作成
          </Button>
        </Stack>
      </Inset>
    )
  }
  return (
    <Stack gap="xxs">
      {/* GAP-NEW: 表示/非表示のレスポンシブ指定が無い。実物は md 未満で列見出しを隠す */}
      <div style={projectHeaderStyle}>
        <Grid spacing="s">
          <GridItem size={{ xxs: 12, m: 8 }}>
            <Typography component="span" size="xs" color="medium_emphasis">
              プロジェクト名
            </Typography>
          </GridItem>
          <GridItem size={{ xxs: 6, m: 2 }}>
            <Typography component="span" size="xs" color="medium_emphasis">
              デプロイ状態
            </Typography>
          </GridItem>
          <GridItem size={{ xxs: 6, m: 2 }}>
            <Stack alignItems="flex-end">
              <Typography component="span" size="xs" color="medium_emphasis">
                最終デプロイ
              </Typography>
            </Stack>
          </GridItem>
        </Grid>
      </div>
      {items.map((p) => (
        <Stack key={p.id} gap="xxs">
          <Divider />
          <ProjectRow project={p} />
        </Stack>
      ))}
    </Stack>
  )
}

/**
 * features/Projects/components/Pager。backend が cursor ページングなので、番号は読み込み済みのページだけ。
 * GAP-16: Pagination が無い。実物も同じ形を手組みしている。
 */
const Pager = () => {
  const [page, setPage] = useState(1)
  const loadedPageCount = 2
  return (
    <Stack flexDirection="row" gap="xs" alignItems="center" justifyContent="center">
      <Button
        appearance="outlined"
        size="s"
        iconOnly
        aria-label="前のページ"
        isDisabled={page === 1}
        onPress={() => setPage(page - 1)}
      >
        <Icon name="chevron_left" size="s" />
      </Button>
      {Array.from({ length: loadedPageCount }, (_, i) => i + 1).map((n) => (
        <Button
          key={n}
          appearance={n === page ? 'flat' : 'outlined'}
          size="s"
          onPress={() => setPage(n)}
        >
          {n}
        </Button>
      ))}
      {/* hasMore のときだけ出る */}
      <Typography component="span" size="s" color="low_emphasis">
        …
      </Typography>
      <Button
        appearance="outlined"
        size="s"
        iconOnly
        aria-label="次のページ"
        onPress={() => setPage(page + 1)}
      >
        <Icon name="chevron_right" size="s" />
      </Button>
    </Stack>
  )
}

/** features/Projects/view.tsx の ProjectsView */
const SitesSection = ({ items }: { items: Project[] }) => {
  // 0 件のときは empty state の「プロジェクトを作成」だけを導線にする（同じ遷移先のボタンを 2 つ並べない）
  const showCreate = items.length > 0
  return (
    <Stack gap="m">
      {/* 実物はこの上に期間限定のコンテスト告知（ContestNotice）が出る。期間外は出ないので省略 */}
      <UsageSummary metrics={usageMetrics} />
      <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
        {/* 実物はこの「プロジェクト」がページの h1。ここではホームの h1 の下に置くので h2 にしている */}
        <Typography size="xxl" component="h2">
          プロジェクト
        </Typography>
        {showCreate && (
          <Button appearance="flat" color="neutral" size="s">
            + 新規作成
          </Button>
        )}
      </Stack>
      <Paper elevation={0} outlined>
        <ProjectsBody items={items} />
      </Paper>
      {items.length > 0 && <Pager />}
    </Stack>
  )
}

// ─── 画面 ───

const HomeScreen = ({
  serverItems = servers,
  projectItems = projects,
  defaultTab,
  renaming,
  accountMenuOpen,
}: {
  serverItems?: Server[]
  projectItems?: Project[]
  defaultTab?: HomeTab
  renaming?: Server
  accountMenuOpen?: boolean
}) => (
  <AppShell active="home" defaultAccountMenuOpen={accountMenuOpen}>
    <PageHeader breadcrumbs={[{ label: 'ホーム' }]} title="ホーム" />
    <GameServersSection items={serverItems} defaultTab={defaultTab} initialRenaming={renaming} />
    <Divider />
    <SitesSection items={projectItems} />
  </AppShell>
)

// ─── ストーリー ───

/**
 * ログイン直後のホーム。上がゲームサーバー、下がサイト（デプロイナウのプロジェクト）。
 *
 * - サーバーのカードは 起動中・起動処理中・停止中・決済失敗・準備中（バックアップ中など）の 5 状態。最後に「サーバーを追加」のカード
 * - 鉛筆のボタンでサーバーネーム変更のダイアログが開く
 * - サイトは使用量のカードとプロジェクトの一覧。名前の横の稼働状態のドットと「デプロイ状態」は別の軸
 * - 読み込み済みのページより先があるときはページ送りに「…」が出る
 *
 * @summary ゲームサーバーとサイトの一覧
 */
export const Default: Story = {
  render: () => <HomeScreen />,
}

/**
 * ヘッダー右のアカウントから開くユーザーメニュー。
 * 項目はゲーマーズとデプロイナウのメニューを合わせたもの（理由は AppShell のコメント）。
 *
 * @summary ユーザーメニューを開いた状態
 */
export const AccountMenuOpen: Story = {
  render: () => <HomeScreen accountMenuOpen />,
}

/**
 * ゲームサーバーの「マイバックアップ」タブ。サーバーをまたいだバックアップの一覧と、容量 50GB の使用状況。
 * 作成中はスピナー、失敗は × だけが出る。
 *
 * @summary マイバックアップのタブ
 */
export const MyBackups: Story = {
  render: () => <HomeScreen defaultTab="myBackups" />,
}

/**
 * サーバーネーム変更のダイアログを開いた状態（home/_components/ChangeServerNameModal）。
 *
 * @summary サーバーネーム変更
 */
export const RenameServer: Story = {
  render: () => <HomeScreen renaming={servers[0]} />,
}

/**
 * 契約が 1 つも無い状態。ゲームサーバーはタブごと EmptyServersView に置き換わり、
 * サイトは見出し脇の「+ 新規作成」が消えて empty state の「プロジェクトを作成」だけが導線になる。
 *
 * @summary サーバーもプロジェクトも無い状態
 */
export const Empty: Story = {
  render: () => <HomeScreen serverItems={[]} projectItems={[]} />,
}

/**
 * ホームをスマートフォン幅で見た状態。サーバーのカードは 1 カラムに落ち、
 * プロジェクトの行は状態と最終デプロイが名前の下の 1 行に並ぶ。
 * サイドナビが全幅ボタンとして縦に積まれる問題（GAP-14）もここで見える。
 *
 * @summary スマートフォン幅でのホーム
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'iphone14' } },
  render: () => <HomeScreen />,
}
