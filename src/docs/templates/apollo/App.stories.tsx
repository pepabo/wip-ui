import { useState } from 'react'
import { TabPanel } from 'react-aria-components'

import { AppBar, AppBarLeading, AppBarTrailing } from '../../../AppBar'
import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Checkbox } from '../../../Checkbox'
import { Container } from '../../../Container'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../Dialog'
import { Divider } from '../../../Divider'
import { Grid, GridItem } from '../../../Grid'
import { Icon } from '../../../Icon'
import { Loader } from '../../../Loader'
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
import type { StickerColor } from '../../../Sticker'
import type { TypographyColor } from '../../../Typography'

/**
 * ロリポップ！for Gamers（apollo/frontend）の再現。
 * 状態ごとにストーリーを分けず、実際に押して遷移する 1 つのアプリとして組んでいる。
 *
 * 文言・画面構成は apollo/frontend の実装から取っている。
 */

const meta = {
  title: 'Templates/Apollo/App',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const queue = new SnackBarQueue()

// ─── GAP-1 の回避策（Paper に padding が無い）───
const insetStyle = { padding: 24 }
const Card = ({ children, outlined = false }: { children: ReactNode; outlined?: boolean }) => (
  <Paper elevation={1} outlined={outlined}>
    <div style={insetStyle}>{children}</div>
  </Paper>
)

// ─── データ ───

type ServerStatus = 'RUNNING' | 'STOPPED' | 'STARTING' | 'STOPPING' | 'FAILURE' | 'paymentFailed'

const statusView: Record<
  ServerStatus,
  { label: string; color: TypographyColor; icon?: IconName; spinner?: boolean }
> = {
  RUNNING: { label: '起動中', color: 'positive', icon: 'bullet_circle' },
  STOPPED: { label: '停止中', color: 'medium_emphasis', icon: 'circle' },
  STARTING: { label: '起動中', color: 'medium_emphasis', spinner: true },
  STOPPING: { label: '停止中', color: 'medium_emphasis', spinner: true },
  FAILURE: { label: '起動失敗', color: 'negative', icon: 'exclamation_on_triangle' },
  paymentFailed: { label: '決済失敗', color: 'negative', icon: 'exclamation_on_triangle' },
}

type Server = {
  id: string
  name: string
  game: string
  ip: string
  plan: string
  status: ServerStatus
  suspended?: boolean
}

const initialServers: Server[] = [
  {
    id: 'sv-8f21',
    name: 'みんなのサバイバル',
    game: 'Minecraft（Java版）',
    ip: '133.130.108.42',
    plan: '8GB',
    status: 'RUNNING',
  },
  {
    id: 'sv-9a02',
    name: '週末パルワールド',
    game: 'Palworld',
    ip: '133.130.108.77',
    plan: '16GB',
    status: 'STOPPED',
  },
  {
    id: 'sv-b7c3',
    name: 'ARK 検証用',
    game: 'ARK: Survival Ascended',
    ip: '133.130.109.10',
    plan: '4GB',
    status: 'paymentFailed',
    suspended: true,
  },
]

type Backup = {
  id: string
  name: string
  size: string
  createdAt: string
  game: string
  state: 'SUCCESS' | 'PENDING' | 'FAILED'
}

const initialBackups: Backup[] = [
  {
    id: 'bk-01',
    name: 'みんなのサバイバル-20260918-0400',
    size: '1.2 GB',
    createdAt: '2026/09/18 04:00',
    game: 'Minecraft（Java版）',
    state: 'SUCCESS',
  },
  {
    id: 'bk-02',
    name: 'みんなのサバイバル-20260916-2114',
    size: '1.1 GB',
    createdAt: '2026/09/16 21:14',
    game: 'Minecraft（Java版）',
    state: 'SUCCESS',
  },
  {
    id: 'bk-03',
    name: 'みんなのサバイバル-20260915-0400',
    size: '—',
    createdAt: '2026/09/15 04:00',
    game: 'Minecraft（Java版）',
    state: 'FAILED',
  },
]

const games = [
  'Minecraft（Java版）',
  'Minecraft（統合版）',
  'Palworld',
  'ARK: Survival Ascended',
  'Valheim',
]

const gamePlans = [
  { id: '4GB', memory: '4GB', cpu: '2Core', price: 1980, note: '目安 1~5人' },
  { id: '8GB', memory: '8GB', cpu: '4Core', price: 3300, note: '目安 6~10人、Mod使用' },
  { id: '16GB', memory: '16GB', cpu: '4Core', price: 6600, note: '目安 11人~、Mod使用' },
]

const terms = [
  { id: '1', label: '1ヶ月', discount: 0 },
  { id: '3', label: '3ヶ月', discount: 5 },
  { id: '6', label: '6ヶ月', discount: 10 },
  { id: '12', label: '12ヶ月', discount: 15 },
]

const yen = (n: number) => `${n.toLocaleString('ja-JP')}円`

const openPorts = [
  { protocol: 'TCP', port: '25565' },
  { protocol: 'UDP', port: '19132' },
]

const schedules = [
  { name: '毎朝の再起動', action: '再起動', frequency: '毎日 05:00', enabled: true },
  { name: '深夜に停止', action: '停止', frequency: '毎日 03:00', enabled: false },
]

const paymentHistory = [
  { date: '2026/09/01', amount: '3,300円', term: '2026/09/01 - 2026/09/30', status: '成功' },
  { date: '2026/08/01', amount: '3,300円', term: '2026/08/01 - 2026/08/31', status: '成功' },
  { date: '2026/07/01', amount: '3,300円', term: '2026/07/01 - 2026/07/31', status: '失敗' },
]

// ─── ルーティング ───

type Route =
  | { name: 'home'; tab: 'servers' | 'myBackups' }
  | { name: 'server'; id: string; tab: 'detail' | 'gameManager' | 'modManager' | 'fileManager' }
  | { name: 'backup'; id: string }
  | { name: 'payment'; id: string; tab: 'detail' | 'history' }
  | { name: 'account' }

type DialogName =
  | 'renameServer'
  | 'createBackup'
  | 'restoreBackup'
  | 'deleteBackup'
  | 'initServer'
  | 'cancelAutoRenew'
  | 'leaveAccount'
  | null

// ─── 共通の枠 ───

const ServerStatusView = ({ status, size = 's' }: { status: ServerStatus; size?: 's' | 'm' }) => {
  const v = statusView[status]
  return (
    <Stack flexDirection="row" gap="xs" alignItems="center">
      {v.spinner ? <Loader size="s" /> : v.icon && <Icon name={v.icon} size="s" />}
      <Typography component="span" size={size} color={v.color} fontWeight="bold">
        {v.label}
      </Typography>
    </Stack>
  )
}

const GlobalHeader = ({ onAccount, onHome }: { onAccount: () => void; onHome: () => void }) => (
  <AppBar appearance="white" position="relative">
    <AppBarLeading>
      <Button appearance="transparent" onPress={onHome}>
        <Stack flexDirection="row" gap="s" alignItems="center">
          <Icon name="pepapon" size="m" />
          <Typography size="l" fontWeight="bold" component="span">
            ロリポップ！for Gamers
          </Typography>
        </Stack>
      </Button>
    </AppBarLeading>
    <AppBarTrailing>
      <Button
        appearance="transparent"
        size="s"
        onPress={onAccount}
        leading={<Icon name="person" size="m" />}
      >
        アカウント詳細
      </Button>
    </AppBarTrailing>
  </AppBar>
)

/** サーバー配下の共通シェル。サイドバーは サーバー / バックアップ / 支払い の 3 つだけ */
const ServerShell = ({
  server,
  servers,
  active,
  onNavigate,
  onSwitchServer,
  onHome,
  onAccount,
  children,
}: {
  server: Server
  servers: Server[]
  active: 'server' | 'backup' | 'payment'
  onNavigate: (to: 'server' | 'backup' | 'payment') => void
  onSwitchServer: (id: string) => void
  onHome: () => void
  onAccount: () => void
  children: ReactNode
}) => (
  <Stack gap="l">
    <AppBar appearance="white" position="relative">
      <AppBarLeading>
        {/* GAP-9: Menu が無いため、サーバー切り替えを Select で代用している（実アプリは UnfoldMore のメニュー） */}
        <Select
          aria-label="サーバーを切り替える"
          size="s"
          selectedKey={server.id}
          onSelectionChange={(k) => onSwitchServer(String(k))}
        >
          {servers.map((s) => (
            <SelectItem key={s.id} id={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </Select>
      </AppBarLeading>
      <AppBarTrailing>
        <Stack flexDirection="row" gap="xs" alignItems="center">
          <Button appearance="transparent" size="s" onPress={onHome}>
            ホーム
          </Button>
          <Button
            appearance="transparent"
            size="s"
            iconOnly
            aria-label="アカウント詳細"
            onPress={onAccount}
          >
            <Icon name="person" size="m" />
          </Button>
        </Stack>
      </AppBarTrailing>
    </AppBar>
    <Container size="xl" component="main">
      <Grid spacing="l">
        <GridItem size={{ xxs: 12, m: 3 }}>
          {/* GAP-14: SideNavigation が無いので Button を縦に積んでいる */}
          <nav aria-label="サーバーメニュー">
            <Stack gap="xxs">
              {(
                [
                  { id: 'server', label: 'サーバー', icon: 'node' },
                  { id: 'backup', label: 'バックアップ', icon: 'clock' },
                  { id: 'payment', label: '支払い', icon: 'bill' },
                ] as const
              ).map((item) => (
                <Button
                  key={item.id}
                  appearance={item.id === active ? 'flat' : 'transparent'}
                  width="full"
                  leading={<Icon name={item.icon} size="s" />}
                  onPress={() => onNavigate(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </nav>
        </GridItem>
        <GridItem size={{ xxs: 12, m: 9 }}>
          <Stack gap="l">{children}</Stack>
        </GridItem>
      </Grid>
    </Container>
  </Stack>
)

// ─── ホーム ───

const ServerCard = ({
  server,
  onOpen,
  onRename,
}: {
  server: Server
  onOpen: () => void
  onRename: () => void
}) => (
  <Card>
    <Stack gap="m">
      <Stack flexDirection="row" gap="s" alignItems="flex-start" justifyContent="space-between">
        <Stack gap="xxs">
          <Sticker color="informative" size="s">
            {server.game}
          </Sticker>
          <Typography size="l" fontWeight="bold" component="h3">
            {server.name}
          </Typography>
        </Stack>
        <Button
          appearance="transparent"
          size="s"
          iconOnly
          aria-label="サーバーネーム変更"
          onPress={onRename}
        >
          <Icon name="pencil" size="s" />
        </Button>
      </Stack>
      <ServerStatusView status={server.status} />
      <Stack gap="xxs">
        <Stack flexDirection="row" justifyContent="space-between">
          <Typography size="s" color="medium_emphasis" component="span">
            IPアドレス
          </Typography>
          <Typography size="s" component="span">
            {server.ip}
          </Typography>
        </Stack>
        <Stack flexDirection="row" justifyContent="space-between">
          <Typography size="s" color="medium_emphasis" component="span">
            プラン
          </Typography>
          <Typography size="s" component="span">
            {server.plan}
          </Typography>
        </Stack>
      </Stack>
      <Button
        appearance="outlined"
        width="full"
        onPress={onOpen}
        trailing={<Icon name="chevron_right" size="s" />}
      >
        管理画面へ
      </Button>
    </Stack>
  </Card>
)

const HomeScreen = ({
  servers,
  backups,
  tab,
  onTab,
  onOpenServer,
  onRename,
  onCreateBackup,
  onRestore,
  onDeleteBackup,
}: {
  servers: Server[]
  backups: Backup[]
  tab: 'servers' | 'myBackups'
  onTab: (t: 'servers' | 'myBackups') => void
  onOpenServer: (id: string) => void
  onRename: (id: string) => void
  onCreateBackup: () => void
  onRestore: (id: string) => void
  onDeleteBackup: (id: string) => void
}) => (
  <Container size="xl" component="main">
    <Stack gap="l">
      <Typography size="xxxl" fontWeight="bold" component="h1">
        ホーム
      </Typography>
      <Tabs selectedKey={tab} onSelectionChange={(k) => onTab(k as 'servers' | 'myBackups')}>
        <TabList aria-label="ホーム">
          <Tab id="servers">
            <Stack flexDirection="row" gap="xxs" alignItems="center">
              <Icon name="node" size="s" />
              サーバー
            </Stack>
          </Tab>
          <Tab id="myBackups">
            <Stack flexDirection="row" gap="xxs" alignItems="center">
              <Icon name="person" size="s" />
              マイバックアップ
            </Stack>
          </Tab>
        </TabList>

        <TabPanel id="servers">
          {servers.length === 0 ? (
            <Card outlined>
              <Stack gap="m" alignItems="center">
                <Icon name="pepapon" size="l" />
                <Typography size="l" fontWeight="bold">
                  契約中のサーバーがありません
                </Typography>
                <Typography size="s" color="medium_emphasis">
                  契約してゲームを楽しみましょう！！
                </Typography>
                <Button color="interactive">申し込む</Button>
              </Stack>
            </Card>
          ) : (
            <Grid spacing="m">
              {servers.map((server) => (
                <GridItem key={server.id} size={{ xxs: 12, s: 6, l: 4 }}>
                  <ServerCard
                    server={server}
                    onOpen={() => onOpenServer(server.id)}
                    onRename={() => onRename(server.id)}
                  />
                </GridItem>
              ))}
              <GridItem size={{ xxs: 12, s: 6, l: 4 }}>
                <Card outlined>
                  <Stack gap="m" alignItems="center" justifyContent="center">
                    <Icon name="plus_on_circle" size="l" />
                    <Typography fontWeight="bold">サーバーを追加</Typography>
                    <Button appearance="outlined" color="interactive" size="s">
                      申し込む
                    </Button>
                  </Stack>
                </Card>
              </GridItem>
            </Grid>
          )}
        </TabPanel>

        <TabPanel id="myBackups">
          <Stack gap="m">
            <Card>
              <Stack gap="m">
                <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
                  <Typography size="l" fontWeight="bold" component="h2">
                    マイバックアップ
                  </Typography>
                  <Button color="interactive" size="s" onPress={onCreateBackup}>
                    バックアップ作成
                  </Button>
                </Stack>
                <Stack gap="xxs">
                  <Typography size="s" color="medium_emphasis">
                    容量使用状況
                  </Typography>
                  <Typography fontWeight="bold" component="span">
                    2.3 GB / 50 GB（47.7 GB 空き）
                  </Typography>
                </Stack>
                <BackupTable
                  backups={backups}
                  showGame
                  onRestore={onRestore}
                  onDelete={onDeleteBackup}
                />
              </Stack>
            </Card>
          </Stack>
        </TabPanel>
      </Tabs>
    </Stack>
  </Container>
)

// ─── バックアップ表 ───

const backupStateSticker: Record<Backup['state'], { label: string; color: StickerColor } | null> = {
  SUCCESS: null,
  PENDING: { label: '作成中', color: 'notice' },
  FAILED: { label: '失敗', color: 'negative' },
}

const BackupTable = ({
  backups,
  showGame = false,
  onRestore,
  onDelete,
}: {
  backups: Backup[]
  showGame?: boolean
  onRestore: (id: string) => void
  onDelete: (id: string) => void
}) =>
  backups.length === 0 ? (
    <Typography size="s" color="medium_emphasis">
      バックアップがありません
    </Typography>
  ) : (
    <Table aria-label="バックアップ">
      <TableHeader>
        <Column isRowHeader>名前</Column>
        <Column>サイズ</Column>
        <Column>作成日時</Column>
        {showGame ? <Column>ゲーム</Column> : null}
        <Column>操作</Column>
      </TableHeader>
      <TableBody>
        {backups.map((b) => {
          const sticker = backupStateSticker[b.state]
          return (
            <Row key={b.id} id={b.id}>
              <Cell>
                <Stack flexDirection="row" gap="xs" alignItems="center">
                  <Typography component="span">{b.name}</Typography>
                  {sticker && (
                    <Sticker color={sticker.color} size="s">
                      {sticker.label}
                    </Sticker>
                  )}
                </Stack>
              </Cell>
              <Cell>{b.size}</Cell>
              <Cell>{b.createdAt}</Cell>
              {showGame ? <Cell>{b.game}</Cell> : null}
              <Cell>
                <Stack flexDirection="row" gap="xxs">
                  <Button
                    appearance="transparent"
                    size="s"
                    isDisabled={b.state !== 'SUCCESS'}
                    onPress={() => onRestore(b.id)}
                  >
                    復元
                  </Button>
                  <Button
                    appearance="transparent"
                    size="s"
                    iconOnly
                    aria-label={`${b.name} を削除`}
                    onPress={() => onDelete(b.id)}
                  >
                    <Icon name="garbage_can" size="s" />
                  </Button>
                </Stack>
              </Cell>
            </Row>
          )
        })}
      </TableBody>
    </Table>
  )

// ─── サーバー詳細 ───

// GAP: 円形ゲージ（MUI x-charts の Gauge 相当）が無い。
// 進捗バーも無いため、Typography の色を継承した div で代用している。
const ResourceGauge = ({
  label,
  ratio,
  free,
  hint,
}: {
  label: string
  ratio: number
  free: string
  hint: string
}) => {
  const tone = ratio >= 0.9 ? 'negative' : ratio >= 0.7 ? 'notice' : 'positive'
  return (
    <Stack gap="xs">
      <Typography size="s" color="medium_emphasis" component="span">
        {label}
      </Typography>
      <Stack flexDirection="row" gap="xxs" alignItems="flex-end">
        <Typography size="xxl" fontWeight="bold" component="span">
          {Math.round(ratio * 100)}
        </Typography>
        <Typography size="s" color="medium_emphasis" component="span">
          %
        </Typography>
      </Stack>
      <Typography component="div" color={tone}>
        <div style={{ height: 6, borderRadius: 3, background: 'currentColor', opacity: 0.15 }} />
        <div
          style={{
            height: 6,
            borderRadius: 3,
            marginTop: -6,
            width: `${Math.min(ratio, 1) * 100}%`,
            background: 'currentColor',
          }}
        />
      </Typography>
      <Typography size="xs" color="low_emphasis">
        {free}
      </Typography>
      {/* GAP: Tooltip が無いため、実アプリではホバーで出る文言を常時表示している */}
      <Typography size="xxs" color="low_emphasis">
        {hint}
      </Typography>
    </Stack>
  )
}

/**
 * 契約中のゲーム・プラン。「変更」を押すと選択 UI が開く。
 * GAP-3: 「選択できるカード」が無いので Paper + Button で組んでいる。
 */
const PlanSection = ({ server }: { server: Server }) => {
  const [editing, setEditing] = useState(false)
  const [game, setGame] = useState(server.game)
  const [plan, setPlan] = useState(server.plan)
  const [term, setTerm] = useState('1')

  const save = () => {
    setEditing(false)
    queue.add({
      message:
        'プランの変更を受け付けました。サーバーへの反映と再起動に少し時間がかかる場合があります。',
    })
  }

  return (
    <Card>
      <Stack gap="m">
        <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
          <Typography size="l" fontWeight="bold" component="h2">
            契約中のゲーム・プラン
          </Typography>
          {!editing && (
            <Button appearance="outlined" size="s" onPress={() => setEditing(true)}>
              変更
            </Button>
          )}
        </Stack>

        {!editing ? (
          <Stack gap="s">
            <Stack flexDirection="row" justifyContent="space-between">
              <Typography size="s" color="medium_emphasis" component="span">
                ゲーム
              </Typography>
              <Typography component="span">{server.game}</Typography>
            </Stack>
            <Divider />
            <Stack flexDirection="row" justifyContent="space-between">
              <Typography size="s" color="medium_emphasis" component="span">
                プラン
              </Typography>
              <Typography component="span">{server.plan}</Typography>
            </Stack>
            <Divider />
            <Stack flexDirection="row" justifyContent="space-between">
              <Typography size="s" color="medium_emphasis" component="span">
                期間
              </Typography>
              <Typography component="span">1ヶ月（自動更新）</Typography>
            </Stack>
          </Stack>
        ) : (
          <Stack gap="l">
            <Stack gap="s">
              <Typography size="s" fontWeight="bold">
                ゲーム
              </Typography>
              <Stack gap="xxs">
                {games.map((g) => (
                  <Paper key={g} elevation={0} outlined={g !== game}>
                    <div style={{ padding: 12 }}>
                      <Button
                        appearance="transparent"
                        width="full"
                        onPress={() => setGame(g)}
                        leading={g === game ? <Icon name="check" size="s" /> : undefined}
                      >
                        <Stack flexDirection="row" gap="s" alignItems="center">
                          <Typography component="span">{g}</Typography>
                          {g === server.game && (
                            <Sticker color="neutral" size="s">
                              現在
                            </Sticker>
                          )}
                        </Stack>
                      </Button>
                    </div>
                  </Paper>
                ))}
              </Stack>
            </Stack>

            <Stack gap="s">
              <Typography size="s" fontWeight="bold">
                プラン
              </Typography>
              <Grid spacing="s">
                {gamePlans.map((pl) => (
                  <GridItem key={pl.id} size={{ xxs: 12, m: 4 }}>
                    <Paper elevation={pl.id === plan ? 3 : 0} outlined={pl.id !== plan}>
                      <div style={{ padding: 16 }}>
                        <Stack gap="s">
                          <Stack flexDirection="row" gap="xs" alignItems="center">
                            <Typography size="l" fontWeight="bold" component="h3">
                              {pl.id}
                            </Typography>
                            {pl.id === server.plan && (
                              <Sticker color="neutral" size="s">
                                現在
                              </Sticker>
                            )}
                          </Stack>
                          <Typography size="xs" color="medium_emphasis">
                            メモリー {pl.memory} / CPU {pl.cpu}
                          </Typography>
                          <Typography size="xs" color="low_emphasis">
                            {pl.note}
                          </Typography>
                          <Typography fontWeight="bold" component="span">
                            月額 {yen(pl.price)}
                          </Typography>
                          <Button
                            appearance={pl.id === plan ? 'flat' : 'outlined'}
                            color={pl.id === plan ? 'interactive' : 'neutral'}
                            width="full"
                            size="s"
                            onPress={() => setPlan(pl.id)}
                          >
                            {pl.id === plan ? '選択中' : '選ぶ'}
                          </Button>
                        </Stack>
                      </div>
                    </Paper>
                  </GridItem>
                ))}
              </Grid>
            </Stack>

            <Stack gap="s">
              <Typography size="s" fontWeight="bold">
                期間
              </Typography>
              <Grid spacing="s">
                {terms.map((t) => {
                  const base = gamePlans.find((x) => x.id === plan)?.price ?? 0
                  const discounted = Math.round(base * (1 - t.discount / 100))
                  return (
                    <GridItem key={t.id} size={{ xxs: 6, m: 3 }}>
                      <Paper elevation={t.id === term ? 2 : 0} outlined={t.id !== term}>
                        <div style={{ padding: 12 }}>
                          <Stack gap="xxs">
                            <Stack flexDirection="row" gap="xs" alignItems="center">
                              <Typography fontWeight="bold" component="span">
                                {t.label}
                              </Typography>
                              {t.discount > 0 && (
                                <Sticker color="positive" size="s">
                                  {t.discount}%オフ
                                </Sticker>
                              )}
                            </Stack>
                            <Typography size="xs" color="medium_emphasis">
                              月額 {yen(discounted)}
                            </Typography>
                            <Button
                              appearance={t.id === term ? 'flat' : 'outlined'}
                              color={t.id === term ? 'interactive' : 'neutral'}
                              width="full"
                              size="s"
                              onPress={() => setTerm(t.id)}
                            >
                              {t.id === term ? '選択中' : '選ぶ'}
                            </Button>
                          </Stack>
                        </div>
                      </Paper>
                    </GridItem>
                  )
                })}
              </Grid>
            </Stack>

            {plan !== server.plan &&
              gamePlans.findIndex((x) => x.id === plan) <
                gamePlans.findIndex((x) => x.id === server.plan) && (
                <Callout color="notice">下位プランへの変更は次回更新日より適用されます。</Callout>
              )}

            <Stack flexDirection="row" gap="s" justifyContent="flex-end">
              <Button appearance="outlined" onPress={() => setEditing(false)}>
                キャンセル
              </Button>
              <Button color="interactive" onPress={save}>
                保存
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Card>
  )
}

const ServerDetail = ({
  server,
  tab,
  onTab,
  onToggle,
  onInit,
  onPayment,
}: {
  server: Server
  tab: 'detail' | 'gameManager' | 'modManager' | 'fileManager'
  onTab: (t: 'detail' | 'gameManager' | 'modManager' | 'fileManager') => void
  onToggle: () => void
  onInit: () => void
  onPayment: () => void
}) => {
  const running = server.status === 'RUNNING'
  const busy = server.status === 'STARTING' || server.status === 'STOPPING'
  return (
    <Stack gap="l">
      <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="m" justifyContent="space-between">
        <Stack gap="xs">
          <Typography size="xxl" fontWeight="bold" component="h1">
            {server.name}
          </Typography>
          <Stack flexDirection="row" gap="s" alignItems="center">
            <ServerStatusView status={server.status} size="m" />
            <Sticker color="informative" size="s">
              {server.game}
            </Sticker>
          </Stack>
        </Stack>
        <Stack flexDirection="row" gap="s" alignItems="center">
          {/* GAP: アイコンセットに再生・停止が無いため矢印とマイナスで代用 */}
          <Button
            color="interactive"
            isDisabled={busy}
            onPress={onToggle}
            leading={
              busy ? (
                <Loader size="s" />
              ) : (
                <Icon name={running ? 'minus_on_circle' : 'arrow_right'} size="s" />
              )
            }
          >
            {busy ? statusView[server.status].label : running ? '停止' : '起動'}
          </Button>
          <Button appearance="outlined" isDisabled={busy}>
            再起動
          </Button>
        </Stack>
      </Stack>

      {server.suspended && (
        <Callout
          color="negative"
          action={
            <Button appearance="outlined" color="negative" size="s" onPress={onPayment}>
              支払いページ
            </Button>
          }
        >
          ご登録されている支払い方法にて、お支払いが確認できなかったためサーバーを停止しています。契約を継続したい場合には支払い方法をご確認の上、支払いページより再決済を行ってください。
        </Callout>
      )}

      <Tabs selectedKey={tab} onSelectionChange={(k) => onTab(k as typeof tab)}>
        <TabList aria-label="サーバー詳細">
          <Tab id="detail">詳細</Tab>
          <Tab id="gameManager">ゲーム設定</Tab>
          <Tab id="modManager">MOD</Tab>
          <Tab id="fileManager">ファイル管理</Tab>
        </TabList>

        <TabPanel id="detail">
          <Stack gap="l">
            <Card>
              <Stack gap="m">
                <Typography size="l" fontWeight="bold" component="h2">
                  ステータス
                </Typography>
                {running ? (
                  <Grid spacing="m">
                    <GridItem size={{ xxs: 12, s: 4 }}>
                      <ResourceGauge
                        label="CPU使用率"
                        ratio={0.32}
                        free="68% 空き / 4Core"
                        hint="😄 問題ありません。"
                      />
                    </GridItem>
                    <GridItem size={{ xxs: 12, s: 4 }}>
                      <ResourceGauge
                        label="メモリ使用量"
                        ratio={0.64}
                        free="2.9GB 空き / 8GB"
                        hint="😄 問題ありません。"
                      />
                    </GridItem>
                    <GridItem size={{ xxs: 12, s: 4 }}>
                      <ResourceGauge
                        label="ディスク使用量"
                        ratio={0.92}
                        free="4.0GB 空き / 50GB"
                        hint="💦 使用量が高まっています。データの削除をおすすめします。"
                      />
                    </GridItem>
                  </Grid>
                ) : (
                  <Typography size="s" color="medium_emphasis">
                    😴
                    サーバー停止中のため非表示になっています。サーバーを起動後、最大30秒程度で表示されます。
                  </Typography>
                )}
              </Stack>
            </Card>

            <Card>
              <Stack gap="m">
                <Typography size="l" fontWeight="bold" component="h2">
                  詳細情報
                </Typography>
                <Stack gap="s">
                  <Stack
                    flexDirection="row"
                    gap="s"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography size="s" color="medium_emphasis" component="span">
                      IPアドレス
                    </Typography>
                    <Stack flexDirection="row" gap="xs" alignItems="center">
                      <Typography component="span">{server.ip}</Typography>
                      <Button
                        appearance="outlined"
                        size="s"
                        onPress={() => queue.add({ message: 'アドレスをコピーしました' })}
                      >
                        アドレスをコピー
                      </Button>
                    </Stack>
                  </Stack>
                  <Divider />
                  <Stack
                    flexDirection="row"
                    gap="s"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography size="s" color="medium_emphasis" component="span">
                      SSH Key
                    </Typography>
                    <Button appearance="outlined" size="s" isDisabled={!running}>
                      秘密鍵を再作成
                    </Button>
                  </Stack>
                  <Divider />
                  <Stack flexDirection="row" justifyContent="space-between">
                    <Typography size="s" color="medium_emphasis" component="span">
                      SSH ユーザー名
                    </Typography>
                    <Typography component="span">admin</Typography>
                  </Stack>
                  <Divider />
                  <Stack flexDirection="row" justifyContent="space-between">
                    <Typography size="s" color="medium_emphasis" component="span">
                      サーバーID
                    </Typography>
                    <Typography component="span">{server.id}</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Card>

            <PlanSection server={server} />

            <Card>
              <Stack gap="m">
                <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
                  <Typography size="l" fontWeight="bold" component="h2">
                    ポート開放
                  </Typography>
                </Stack>
                <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="s">
                  <Select label="プロトコル" size="s" defaultSelectedKey="tcp">
                    <SelectItem id="tcp">TCP</SelectItem>
                    <SelectItem id="udp">UDP</SelectItem>
                    <SelectItem id="both">TCP/UDP</SelectItem>
                  </Select>
                  <TextField label="ポート番号" size="s" placeholder="25565" />
                  <Button
                    appearance="outlined"
                    onPress={() => queue.add({ message: '「TCP 25565」のポートを開放しました' })}
                  >
                    開放
                  </Button>
                </Stack>
                <Table aria-label="開放済ポート">
                  <TableHeader>
                    <Column isRowHeader>プロトコル</Column>
                    <Column>ポート番号</Column>
                    <Column>操作</Column>
                  </TableHeader>
                  <TableBody>
                    {openPorts.map((p) => (
                      <Row key={`${p.protocol}-${p.port}`}>
                        <Cell>{p.protocol}</Cell>
                        <Cell>{p.port}</Cell>
                        <Cell>
                          <Button appearance="transparent" size="s">
                            閉鎖
                          </Button>
                        </Cell>
                      </Row>
                    ))}
                  </TableBody>
                </Table>
              </Stack>
            </Card>

            <Card>
              <Stack gap="m">
                <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
                  <Typography size="l" fontWeight="bold" component="h2">
                    定期スケジュール
                  </Typography>
                  <Button appearance="outlined" size="s" leading={<Icon name="plus" size="s" />}>
                    追加
                  </Button>
                </Stack>
                <Table aria-label="定期スケジュール">
                  <TableHeader>
                    <Column isRowHeader>名前</Column>
                    <Column>アクション</Column>
                    <Column>頻度</Column>
                    <Column>実行</Column>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((s) => (
                      <Row key={s.name}>
                        <Cell>{s.name}</Cell>
                        <Cell>{s.action}</Cell>
                        <Cell>{s.frequency}</Cell>
                        <Cell>
                          <Switch
                            aria-label={`${s.name} の実行`}
                            size="s"
                            defaultSelected={s.enabled}
                          />
                        </Cell>
                      </Row>
                    ))}
                  </TableBody>
                </Table>
              </Stack>
            </Card>

            <Card outlined>
              <Stack gap="m">
                <Typography size="l" fontWeight="bold" component="h2">
                  サーバーの初期化
                </Typography>
                <Typography size="s" color="medium_emphasis">
                  サーバーの再作成を行い、すべてのサーバーデータを初期化します。現在のサーバーデータは削除されるため、バックアップをしてから初期化を行ってください。
                </Typography>
                <Stack flexDirection="row" justifyContent="flex-end">
                  <Button appearance="outlined" color="negative" onPress={onInit}>
                    初期化
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </TabPanel>

        <TabPanel id="gameManager">
          {running ? (
            <Stack gap="l">
              <Card>
                <Stack gap="m">
                  <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
                    <Typography size="l" fontWeight="bold" component="h2">
                      バージョン
                    </Typography>
                    <Button appearance="outlined" size="s">
                      変更
                    </Button>
                  </Stack>
                  <Stack flexDirection="row" justifyContent="space-between">
                    <Typography size="s" color="medium_emphasis" component="span">
                      サーバーの種類
                    </Typography>
                    <Typography component="span">Paper</Typography>
                  </Stack>
                  <Divider />
                  <Stack flexDirection="row" justifyContent="space-between">
                    <Typography size="s" color="medium_emphasis" component="span">
                      バージョン
                    </Typography>
                    <Typography component="span">1.21.4</Typography>
                  </Stack>
                </Stack>
              </Card>
              <Card>
                <Stack gap="m">
                  <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
                    <Typography size="l" fontWeight="bold" component="h2">
                      設定
                    </Typography>
                    <Stack flexDirection="row" gap="s">
                      <Button appearance="outlined" size="s">
                        リセット
                      </Button>
                      <Button appearance="outlined" size="s">
                        変更
                      </Button>
                    </Stack>
                  </Stack>
                  <Stack gap="xs">
                    <Switch label="ホワイトリスト" color="interactive" defaultSelected />
                    <Switch label="PVP" color="interactive" defaultSelected />
                    <Switch label="コマンドブロック" color="interactive" />
                  </Stack>
                </Stack>
              </Card>
              <Card outlined>
                <Stack gap="m">
                  <Typography size="l" fontWeight="bold" component="h2">
                    ワールドの再生成
                  </Typography>
                  <Typography size="s" color="medium_emphasis">
                    現在の設定でワールドを再生成することができます。再生成すると現在のワールドのデータが変更されます。
                  </Typography>
                  <Stack flexDirection="row" justifyContent="flex-end">
                    <Button appearance="outlined" color="negative">
                      再生成
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            </Stack>
          ) : (
            <Card>
              <Stack alignItems="center">
                <Typography size="s" color="medium_emphasis">
                  😴
                  サーバー停止中のため非表示になっています。サーバーを起動後、最大30秒程度で表示されます。
                </Typography>
              </Stack>
            </Card>
          )}
        </TabPanel>

        <TabPanel id="modManager">
          <Card>
            <Stack gap="m">
              <Stack
                flexDirection={{ xxs: 'column', m: 'row' }}
                gap="s"
                justifyContent="space-between"
              >
                <Typography size="l" fontWeight="bold" component="h2">
                  インストール済MOD
                </Typography>
                <Stack flexDirection="row" gap="s" alignItems="center">
                  <TextField aria-label="MODを検索" placeholder="検索" size="s" />
                  <Button color="interactive" size="s" leading={<Icon name="plus" size="s" />}>
                    追加
                  </Button>
                </Stack>
              </Stack>
              <Table aria-label="インストール済MOD" selectionMode="multiple">
                <TableHeader>
                  <Column isRowHeader>名前</Column>
                  <Column>タイプ</Column>
                  <Column>サイズ</Column>
                  <Column>インストール日</Column>
                </TableHeader>
                <TableBody>
                  <Row id="m1">
                    <Cell>WorldEdit</Cell>
                    <Cell>プラグイン</Cell>
                    <Cell>2.1 MB</Cell>
                    <Cell>2026/09/12</Cell>
                  </Row>
                  <Row id="m2">
                    <Cell>Dynmap</Cell>
                    <Cell>プラグイン</Cell>
                    <Cell>8.4 MB</Cell>
                    <Cell>2026/09/10</Cell>
                  </Row>
                </TableBody>
              </Table>
            </Stack>
          </Card>
        </TabPanel>

        <TabPanel id="fileManager">
          <Card>
            <Stack gap="m">
              <Stack flexDirection="row" gap="s" justifyContent="space-between" alignItems="center">
                <Typography size="s" color="medium_emphasis">
                  /minecraft
                </Typography>
                <Button appearance="outlined" size="s" leading={<Icon name="plus" size="s" />}>
                  追加
                </Button>
              </Stack>
              <Table aria-label="ファイル一覧" selectionMode="multiple">
                <TableHeader>
                  <Column isRowHeader>ファイル名</Column>
                  <Column>サイズ</Column>
                  <Column>最終更新日時</Column>
                </TableHeader>
                <TableBody>
                  <Row id="f1">
                    <Cell>
                      <Stack flexDirection="row" gap="xs" alignItems="center">
                        <Icon name="folder" size="s" />
                        plugins
                      </Stack>
                    </Cell>
                    <Cell>—</Cell>
                    <Cell>2026/09/12 10:02</Cell>
                  </Row>
                  <Row id="f2">
                    <Cell>
                      <Stack flexDirection="row" gap="xs" alignItems="center">
                        <Icon name="note" size="s" />
                        server.properties
                      </Stack>
                    </Cell>
                    <Cell>1.4 KB</Cell>
                    <Cell>2026/09/18 04:12</Cell>
                  </Row>
                </TableBody>
              </Table>
            </Stack>
          </Card>
        </TabPanel>
      </Tabs>
    </Stack>
  )
}

// ─── バックアップ画面 ───

const BackupScreen = ({
  server,
  backups,
  onCreate,
  onRestore,
  onDelete,
  onMyBackups,
}: {
  server: Server
  backups: Backup[]
  onCreate: () => void
  onRestore: (id: string) => void
  onDelete: (id: string) => void
  onMyBackups: () => void
}) => (
  <Stack gap="l">
    <Card>
      <Stack gap="m">
        <Stack flexDirection="row" gap="s" alignItems="center" justifyContent="space-between">
          <Typography size="l" fontWeight="bold" component="h1">
            {server.game}のバックアップ
          </Typography>
          <Button color="interactive" size="s" onPress={onCreate}>
            バックアップ作成
          </Button>
        </Stack>
        <BackupTable backups={backups} onRestore={onRestore} onDelete={onDelete} />
      </Stack>
    </Card>
    <Card>
      <Stack gap="m">
        <Stack flexDirection="row" gap="s" alignItems="center" justifyContent="space-between">
          <Typography size="l" fontWeight="bold" component="h2">
            マイバックアップ
          </Typography>
          <Button
            appearance="outlined"
            size="s"
            onPress={onMyBackups}
            trailing={<Icon name="chevron_right" size="s" />}
          >
            全てのゲームのバックアップを管理
          </Button>
        </Stack>
        <Stack gap="xxs">
          <Typography size="s" color="medium_emphasis">
            容量使用状況
          </Typography>
          <Typography fontWeight="bold" component="span">
            2.3 GB / 50 GB（47.7 GB 空き）
          </Typography>
        </Stack>
      </Stack>
    </Card>
  </Stack>
)

// ─── 支払い画面 ───

const PaymentScreen = ({
  server,
  tab,
  onTab,
  onCancelAutoRenew,
}: {
  server: Server
  tab: 'detail' | 'history'
  onTab: (t: 'detail' | 'history') => void
  onCancelAutoRenew: () => void
}) => (
  <Stack gap="l">
    <Typography size="xxl" fontWeight="bold" component="h1">
      支払い
    </Typography>
    <Tabs selectedKey={tab} onSelectionChange={(k) => onTab(k as 'detail' | 'history')}>
      <TabList aria-label="支払い">
        <Tab id="detail">詳細</Tab>
        <Tab id="history">履歴</Tab>
      </TabList>

      <TabPanel id="detail">
        <Stack gap="l">
          <Card>
            <Stack gap="m">
              <Typography size="l" fontWeight="bold" component="h2">
                最近の支払い
              </Typography>
              {server.suspended ? (
                <Callout
                  color="negative"
                  action={
                    <Button appearance="outlined" color="negative" size="s">
                      再決済
                    </Button>
                  }
                >
                  決済に問題が発生しました。ご登録されている支払い方法にて、決済がうまく行えませんでした。契約を継続したい場合には支払い方法をご確認の上、再決済を行ってください。
                </Callout>
              ) : (
                <Stack gap="s">
                  <Typography component="span">
                    2026/09/01：3,300円（1ヶ月分）を支払い済み
                  </Typography>
                  <Typography size="xs" color="low_emphasis">
                    前回の自動更新
                  </Typography>
                  <Divider />
                  <Typography component="span">
                    2026/10/01：3,300円（1ヶ月分）を支払い予定
                  </Typography>
                </Stack>
              )}
              <Divider />
              <Stack flexDirection="row" gap="s" justifyContent="flex-end">
                <Button appearance="outlined" color="negative" onPress={onCancelAutoRenew}>
                  自動更新の停止
                </Button>
              </Stack>
            </Stack>
          </Card>
          <Card>
            <Stack gap="m">
              <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
                <Typography size="l" fontWeight="bold" component="h2">
                  決済手段
                </Typography>
                <Button appearance="outlined" size="s">
                  変更
                </Button>
              </Stack>
              <Stack gap="xxs">
                <Typography component="span">**** **** **** 4242</Typography>
                <Typography size="s" color="medium_emphasis">
                  有効期限 : 28/12
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </TabPanel>

      <TabPanel id="history">
        <Card>
          <Stack gap="m">
            <Typography size="l" fontWeight="bold" component="h2">
              支払い履歴
            </Typography>
            <Table aria-label="支払い履歴">
              <TableHeader>
                <Column isRowHeader>決済日</Column>
                <Column>金額</Column>
                <Column>契約期間</Column>
                <Column>ステータス</Column>
                <Column>操作</Column>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((h) => (
                  <Row key={h.date}>
                    <Cell>{h.date}</Cell>
                    <Cell>{h.amount}</Cell>
                    <Cell>{h.term}</Cell>
                    <Cell>
                      <Sticker color={h.status === '失敗' ? 'negative' : 'positive'} size="s">
                        {h.status}
                      </Sticker>
                    </Cell>
                    <Cell>
                      <Button appearance="transparent" size="s">
                        {h.status === '失敗' ? '再決済' : '領収書'}
                      </Button>
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          </Stack>
        </Card>
      </TabPanel>
    </Tabs>
  </Stack>
)

// ─── アカウント ───

const providers: { id: string; label: string; linked: boolean }[] = [
  { id: 'google', label: 'Google', linked: true },
  { id: 'discord', label: 'Discord', linked: false },
  { id: 'twitch', label: 'Twitch', linked: false },
]

const AccountScreen = ({ onBack, onLeave }: { onBack: () => void; onLeave: () => void }) => (
  <Container size="m" component="main">
    <Stack gap="l">
      <Stack flexDirection="row" gap="s" alignItems="center">
        <Button
          appearance="transparent"
          size="s"
          leading={<Icon name="arrow_left" size="s" />}
          onPress={onBack}
        >
          サーバー
        </Button>
      </Stack>
      <Typography size="xxl" fontWeight="bold" component="h1">
        アカウント
      </Typography>
      <Card>
        <Stack gap="m">
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography size="s" color="medium_emphasis" component="span">
              アカウントID
            </Typography>
            <Typography component="span">acct_7f3a9c21</Typography>
          </Stack>
          <Divider />
          <Stack flexDirection="row" gap="s" alignItems="center" justifyContent="space-between">
            <Typography size="s" color="medium_emphasis" component="span">
              メールアドレス
            </Typography>
            <Stack flexDirection="row" gap="s" alignItems="center">
              <Typography component="span">you@example.com</Typography>
              <Button appearance="outlined" size="s">
                変更
              </Button>
            </Stack>
          </Stack>
          <Divider />
          <Stack gap="xs">
            <Typography size="s" color="medium_emphasis" component="span">
              外部アカウント連携
            </Typography>
            {providers.map((p) => (
              <Stack
                key={p.id}
                flexDirection="row"
                gap="s"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack flexDirection="row" gap="xs" alignItems="center">
                  <Typography component="span">{p.label}</Typography>
                  {!p.linked && (
                    <Typography size="xs" color="low_emphasis" component="span">
                      未連携
                    </Typography>
                  )}
                </Stack>
                <Button appearance="outlined" size="s">
                  {p.linked ? '解除' : '連携'}
                </Button>
              </Stack>
            ))}
          </Stack>
          <Divider />
          <Stack flexDirection="row" gap="s" alignItems="center" justifyContent="space-between">
            <Typography size="s" color="medium_emphasis" component="span">
              メール受信設定
            </Typography>
            <Stack flexDirection="row" gap="s" alignItems="center">
              <Typography component="span">受信する</Typography>
              <Button appearance="outlined" size="s">
                変更
              </Button>
            </Stack>
          </Stack>
          <Divider />
          <Stack flexDirection="row" gap="s" alignItems="center" justifyContent="space-between">
            <Typography size="s" color="medium_emphasis" component="span">
              アカウント削除
            </Typography>
            <Button appearance="outlined" color="negative" size="s" onPress={onLeave}>
              削除
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  </Container>
)

// ─── ダイアログ ───

const RenameDialog = ({
  isOpen,
  current,
  onClose,
  onRename,
}: {
  isOpen: boolean
  current: string
  onClose: () => void
  onRename: (next: string) => void
}) => {
  const [value, setValue] = useState(current)
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (open) setValue(current)
        else onClose()
      }}
    >
      <DialogHeader>
        <DialogTitle>サーバーネーム変更</DialogTitle>
      </DialogHeader>
      <TextField label="サーバーネーム" width="full" value={value} onChange={setValue} />
      <DialogFooter>
        <Button appearance="outlined" onPress={onClose}>
          閉じる
        </Button>
        <Button
          color="interactive"
          isDisabled={!value}
          onPress={() => {
            onRename(value)
            queue.add({ message: 'サーバーネームを変更しました' })
            onClose()
          }}
        >
          変更
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

const Dialogs = ({
  name,
  server,
  backup,
  onClose,
  onRename,
  onCreateBackup,
  onDeleteBackup,
}: {
  name: DialogName
  server?: Server
  backup?: Backup
  onClose: () => void
  onRename: (next: string) => void
  onCreateBackup: (label: string) => void
  onDeleteBackup: (id: string) => void
}) => (
  <>
    <RenameDialog
      isOpen={name === 'renameServer'}
      current={server?.name ?? ''}
      onClose={onClose}
      onRename={onRename}
    />

    <Dialog isOpen={name === 'createBackup'} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>バックアップ作成</DialogTitle>
      </DialogHeader>
      <Stack gap="m">
        <Select label="サーバー" width="full" defaultSelectedKey={server?.id}>
          {initialServers.map((s) => (
            <SelectItem key={s.id} id={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </Select>
        <TextField label="名前" defaultValue={`${server?.name}-20260930-1200`} width="full" />
        <Callout color="notice">
          バックアップ作成中はサーバーが停止状態になります。保存期間はアカウントにサーバーのご契約がある間は無期限、ご契約がない場合は契約終了日から90日間です。
        </Callout>
      </Stack>
      <DialogFooter>
        <Button appearance="outlined" onPress={onClose}>
          キャンセル
        </Button>
        <Button
          color="interactive"
          onPress={() => {
            onCreateBackup(`${server?.name}-20260930-1200`)
            queue.add({
              message: `${server?.name}のバックアップ作成を開始しました。一覧に表示されるまでしばらくお待ちください。`,
            })
            onClose()
          }}
        >
          作成
        </Button>
      </DialogFooter>
    </Dialog>

    <Dialog
      isOpen={name === 'restoreBackup'}
      onOpenChange={onClose}
      isDismissable={false}
      role="alertdialog"
    >
      <DialogHeader>
        <DialogTitle>「{backup?.name}」を復元しますか？</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        「{backup?.name}」作成日時：{backup?.createdAt} サイズ：{backup?.size}{' '}
        を復元します。復元するサーバーを選択してください。
      </DialogDescription>
      <Stack gap="m">
        <Select label="サーバー" width="full" defaultSelectedKey={server?.id}>
          {initialServers.map((s) => (
            <SelectItem key={s.id} id={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </Select>
        <Callout color="negative">
          バックアップ復元中はサーバーが停止状態になります。復元したデータは元に戻せないためご注意ください。
        </Callout>
      </Stack>
      <DialogFooter>
        <Button appearance="outlined" onPress={onClose}>
          キャンセル
        </Button>
        <Button
          color="negative"
          onPress={() => {
            queue.add({ message: `${backup?.name}のバックアップ復元を開始します。` })
            onClose()
          }}
        >
          復元
        </Button>
      </DialogFooter>
    </Dialog>

    <Dialog
      isOpen={name === 'deleteBackup'}
      onOpenChange={onClose}
      isDismissable={false}
      role="alertdialog"
    >
      <DialogHeader>
        <DialogTitle>「{backup?.name}」を削除しますか？</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        「{backup?.name}」作成日時：{backup?.createdAt} サイズ：{backup?.size} を完全に削除します。
      </DialogDescription>
      <Callout color="negative">復元したデータは元に戻せないためご注意ください。</Callout>
      <DialogFooter>
        <Button appearance="outlined" onPress={onClose}>
          キャンセル
        </Button>
        <Button
          color="negative"
          onPress={() => {
            if (backup) onDeleteBackup(backup.id)
            queue.add({
              message: `${backup?.name}のバックアップ削除が完了しました。`,
              state: 'neutral',
            })
            onClose()
          }}
        >
          削除
        </Button>
      </DialogFooter>
    </Dialog>

    <Dialog
      isOpen={name === 'initServer'}
      onOpenChange={onClose}
      isDismissable={false}
      role="alertdialog"
    >
      <DialogHeader>
        <DialogTitle>サーバーの初期化をしますか？</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        初期化すると現在のサーバーデータはすべて削除されます。必ず現在のサーバーデータのバックアップをしてから初期化してください。
      </DialogDescription>
      <DialogFooter>
        <Button appearance="outlined" onPress={onClose}>
          キャンセル
        </Button>
        <Button color="negative" onPress={onClose}>
          初期化
        </Button>
      </DialogFooter>
    </Dialog>

    <Dialog
      isOpen={name === 'cancelAutoRenew'}
      onOpenChange={onClose}
      isDismissable={false}
      role="alertdialog"
    >
      <DialogHeader>
        <DialogTitle>自動更新の停止</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        {server?.plan}プランの自動更新を停止します。自動更新停止後も2026/10/31までご利用可能です。
      </DialogDescription>
      <DialogFooter>
        <Button appearance="outlined" onPress={onClose}>
          閉じる
        </Button>
        <Button
          color="negative"
          onPress={() => {
            queue.add({ message: 'プランを解約しました', state: 'neutral' })
            onClose()
          }}
        >
          停止
        </Button>
      </DialogFooter>
    </Dialog>

    <Dialog
      isOpen={name === 'leaveAccount'}
      onOpenChange={onClose}
      isDismissable={false}
      role="alertdialog"
    >
      <DialogHeader>
        <DialogTitle>アカウント削除</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        誤操作を防止するためご利用のメールアドレスをご入力ください
      </DialogDescription>
      <Stack gap="m">
        <TextField label="ご利用のメールアドレス" placeholder="you@example.com" width="full" />
        <Checkbox>アカウントを削除すると元に戻せないことを理解しました</Checkbox>
      </Stack>
      <DialogFooter>
        <Button appearance="outlined" onPress={onClose}>
          閉じる
        </Button>
        <Button appearance="outlined" color="negative" onPress={onClose}>
          削除
        </Button>
      </DialogFooter>
    </Dialog>
  </>
)

// ─── アプリ本体 ───

const App = () => {
  const [servers, setServers] = useState(initialServers)
  const [backups, setBackups] = useState(initialBackups)
  const [route, setRoute] = useState<Route>({ name: 'home', tab: 'servers' })
  const [dialog, setDialog] = useState<DialogName>(null)
  const [targetBackup, setTargetBackup] = useState<Backup | undefined>()

  const currentId = 'id' in route ? route.id : servers[0]?.id
  const server = servers.find((s) => s.id === currentId) ?? servers[0]
  const closeDialog = () => setDialog(null)

  /** 起動・停止を押すと STARTING / STOPPING を挟んで状態が変わる */
  const toggleServer = () => {
    const next: ServerStatus = server.status === 'RUNNING' ? 'STOPPING' : 'STARTING'
    const settled: ServerStatus = server.status === 'RUNNING' ? 'STOPPED' : 'RUNNING'
    setServers((prev) => prev.map((s) => (s.id === server.id ? { ...s, status: next } : s)))
    queue.add({
      message:
        next === 'STARTING'
          ? 'ゲームを起動中です。完了までこのページを閉じずにお待ちください。'
          : 'ゲームを停止しています。完了までこのページを閉じずにお待ちください。',
      state: 'neutral',
    })
    setTimeout(() => {
      setServers((prev) => prev.map((s) => (s.id === server.id ? { ...s, status: settled } : s)))
      queue.add({
        message: settled === 'RUNNING' ? 'ゲームが起動されました' : 'ゲームが停止されました',
      })
    }, 1600)
  }

  const openRestore = (id: string) => {
    setTargetBackup(backups.find((b) => b.id === id))
    setDialog('restoreBackup')
  }
  const openDelete = (id: string) => {
    setTargetBackup(backups.find((b) => b.id === id))
    setDialog('deleteBackup')
  }

  const dialogs = (
    <Dialogs
      name={dialog}
      server={server}
      backup={targetBackup}
      onClose={closeDialog}
      onRename={(next) =>
        setServers((prev) => prev.map((s) => (s.id === server.id ? { ...s, name: next } : s)))
      }
      onCreateBackup={(label) => {
        const id = `bk-${Date.now()}`
        setBackups((prev) => [
          {
            id,
            name: label,
            size: '—',
            createdAt: '2026/09/30 12:00',
            game: server.game,
            state: 'PENDING',
          },
          ...prev,
        ])
        // 作成中の行が一定時間後に完了に変わる
        setTimeout(() => {
          setBackups((prev) =>
            prev.map((b) => (b.id === id ? { ...b, size: '1.2 GB', state: 'SUCCESS' } : b))
          )
          queue.add({ message: `${label} のバックアップ作成が完了しました` })
        }, 2000)
      }}
      onDeleteBackup={(id) => setBackups((prev) => prev.filter((b) => b.id !== id))}
    />
  )

  if (route.name === 'home') {
    return (
      <Stack gap="l">
        <GlobalHeader
          onAccount={() => setRoute({ name: 'account' })}
          onHome={() => setRoute({ name: 'home', tab: 'servers' })}
        />
        <HomeScreen
          servers={servers}
          backups={backups}
          tab={route.tab}
          onTab={(tab) => setRoute({ name: 'home', tab })}
          onOpenServer={(id) => setRoute({ name: 'server', id, tab: 'detail' })}
          onRename={(id) => {
            setRoute({ name: 'server', id, tab: 'detail' })
            setDialog('renameServer')
          }}
          onCreateBackup={() => setDialog('createBackup')}
          onRestore={openRestore}
          onDeleteBackup={openDelete}
        />
        <SnackBar queue={queue} />
        {dialogs}
      </Stack>
    )
  }

  if (route.name === 'account') {
    return (
      <Stack gap="l">
        <GlobalHeader
          onAccount={() => setRoute({ name: 'account' })}
          onHome={() => setRoute({ name: 'home', tab: 'servers' })}
        />
        <AccountScreen
          onBack={() => setRoute({ name: 'home', tab: 'servers' })}
          onLeave={() => setDialog('leaveAccount')}
        />
        <SnackBar queue={queue} />
        {dialogs}
      </Stack>
    )
  }

  const active = route.name === 'server' ? 'server' : route.name === 'backup' ? 'backup' : 'payment'

  return (
    <>
      <ServerShell
        server={server}
        servers={servers}
        active={active}
        onNavigate={(to) => {
          if (to === 'server') setRoute({ name: 'server', id: server.id, tab: 'detail' })
          if (to === 'backup') setRoute({ name: 'backup', id: server.id })
          if (to === 'payment') setRoute({ name: 'payment', id: server.id, tab: 'detail' })
        }}
        onSwitchServer={(id) => setRoute({ name: 'server', id, tab: 'detail' })}
        onHome={() => setRoute({ name: 'home', tab: 'servers' })}
        onAccount={() => setRoute({ name: 'account' })}
      >
        {route.name === 'server' && (
          <ServerDetail
            server={server}
            tab={route.tab}
            onTab={(tab) => setRoute({ name: 'server', id: server.id, tab })}
            onToggle={toggleServer}
            onInit={() => setDialog('initServer')}
            onPayment={() => setRoute({ name: 'payment', id: server.id, tab: 'detail' })}
          />
        )}
        {route.name === 'backup' && (
          <BackupScreen
            server={server}
            backups={backups}
            onCreate={() => setDialog('createBackup')}
            onRestore={openRestore}
            onDelete={openDelete}
            onMyBackups={() => setRoute({ name: 'home', tab: 'myBackups' })}
          />
        )}
        {route.name === 'payment' && (
          <PaymentScreen
            server={server}
            tab={route.tab}
            onTab={(tab) => setRoute({ name: 'payment', id: server.id, tab })}
            onCancelAutoRenew={() => setDialog('cancelAutoRenew')}
          />
        )}
      </ServerShell>
      <SnackBar queue={queue} />
      {dialogs}
    </>
  )
}

// ─── ストーリー ───

/**
 * ロリポップ！for Gamers の管理画面。状態ごとに分けず、実際に押して遷移する 1 つのアプリ。
 *
 * - ホームのカードの「管理画面へ」でサーバー詳細に入る
 * - 左のメニューで サーバー / バックアップ / 支払い を行き来する
 * - 「起動」「停止」を押すと処理中を挟んで状態が変わり、スナックバーが出る
 * - 鉛筆・バックアップ作成・復元・削除・初期化・自動更新の停止・アカウント削除はダイアログが開く
 * - ヘッダーのセレクトで別のサーバーに切り替わる（決済失敗のサーバーを選ぶと警告が出る）
 *
 * 画面構成と文言は apollo/frontend の実装から取っている。
 *
 * @summary for Gamers の管理画面（操作できる）
 */
export const Default: Story = {
  render: () => <App />,
}
