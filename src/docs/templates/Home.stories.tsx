import { useState } from 'react'
import { TabPanel } from 'react-aria-components'

import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Container } from '../../Container'
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Menu, MenuItem, MenuTrigger } from '../../Menu'
import { Meter } from '../../Meter'
import { Select, SelectItem } from '../../Select'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Tab, TabList, Tabs } from '../../Tab'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../Table'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import buyImage from './assets/gamers/buy.svg'
import { GamersPageContainer, GamersShell, useGamersNavigate } from './gamersShell'
import { Card } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { IconName } from '../../Icon'
import type { TypographyColor } from '../../Typography'

/**
 * ホーム。ゲーマーズのホーム（apollo/frontend の app/(application)/(private)/home）の再現。
 * ページ見出し「ホーム」の直下に「サーバー」「マイバックアップ」のタブ。元にしたファイルは各部品のコメントに書いた。
 * デプロイナウのプロジェクト一覧は Templates/DeployNow/Projects にある。
 */

const meta = {
  title: 'Templates/Gamers/Home',
  // テンプレートはロリポップのトンマナを確かめる場所なので、フレーバーを lolipop に固定する
  globals: { flavor: 'lolipop' },
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
  /** バイト数。0 のとき一覧は '-' */
  sizeBytes: number
  /** formatCreatedAt の形（2022-02-22 22:22） */
  createdAt: string
  status: 'SUCCESS' | 'PENDING' | 'FAILED'
}

const GB = 1024 ** 3

/** MyBackupPaper/view.tsx の LIMIT_BYTES（50GB） */
const LIMIT_BYTES = 50 * GB

/** utils/formatBytes */
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0Bytes'
  const i = Math.max(0, Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 4))
  const units = [bytes === 1 ? 'Byte' : 'Bytes', 'KB', 'MB', 'GB', 'TB']
  return `${Number.parseFloat((bytes / 1024 ** i).toFixed(2))}${units[i]}`
}

// 名前は CreateBackupDialog の既定値（サーバー名-yyyyMMdd-HHmm）。作成中・失敗はサイズが 0
const backups: Backup[] = [
  {
    id: 'bk-04',
    name: 'パル島-20261030-0912',
    game: 'palworld',
    sizeBytes: 0,
    createdAt: '2026-10-30 09:12',
    status: 'PENDING',
  },
  {
    id: 'bk-01',
    name: 'LOLIPOP-GAMERS-SERVER-20261028-0400',
    game: 'minecraft-je',
    sizeBytes: 1.23 * GB,
    createdAt: '2026-10-28 04:00',
    status: 'SUCCESS',
  },
  {
    id: 'bk-02',
    name: 'LOLIPOP-GAMERS-SERVER-20261021-2214',
    game: 'minecraft-je',
    sizeBytes: 1.17 * GB,
    createdAt: '2026-10-21 22:14',
    status: 'SUCCESS',
  },
  {
    id: 'bk-03',
    name: 'パル島-20261019-2301',
    game: 'palworld',
    sizeBytes: 0,
    createdAt: '2026-10-19 23:01',
    status: 'FAILED',
  },
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
const ServerCard = ({ server, onRename }: { server: Server; onRename: () => void }) => {
  const navigate = useGamersNavigate()
  return (
    <Card padding="m">
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
        {/* GAP-3: 実物はカード全体がサーバー詳細（/servers/{id}）へのリンク（CardActionArea）。
          押せる面にできないので、名前をボタンにしてそこから移る。
          GAP-NEW: 1 行で省略（text-overflow: ellipsis）する指定が無く、長い名前は折り返す */}
        <Stack flexDirection="row">
          <Button appearance="transparent" onPress={() => navigate('server')}>
            <Typography size="xxl" fontWeight="bold" component="span">
              {server.name}
            </Typography>
          </Button>
        </Stack>
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
}

/** home/_components/HomeServerCardsList の最後の「サーバーを追加」 */
const AddServerCard = () => {
  const navigate = useGamersNavigate()
  return (
    // GAP-3: 実アプリは紫の破線（3px dashed）＋薄紫の地のカード全体が /servers/new/game-select へのリンク。
    // GAP-NEW: 破線の枠が無いので outlined で代用。最小の高さ（280px）も指定できない
    <Card padding="m" outlined elevation={0}>
      <Stack gap="m" alignItems="center" justifyContent="center">
        <Typography component="span" color="informative">
          <Icon name="plus" size="l" />
        </Typography>
        <Button appearance="transparent" color="interactive" onPress={() => navigate('server-new')}>
          <Typography size="xxl" fontWeight="bold" component="span">
            サーバーを追加
          </Typography>
        </Button>
      </Stack>
    </Card>
  )
}

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

/** home/_components/EmptyServersView（home/not-found.tsx）。実物は Paper の高さ 400px・p={8}（GAP-NEW: 高さの指定が無い） */
const EmptyServersView = () => {
  const navigate = useGamersNavigate()
  return (
    <Container size="s">
      <Card elevation={0}>
        <Stack gap="l">
          {/* GAP-NEW: 画像の枠（Image）が無い。実アプリは buy.svg を 12em 角（192px）で置いている */}
          <Stack alignItems="center">
            <img src={buyImage} alt="購入のイラスト" width={192} height={192} />
          </Stack>
          <Stack gap="xs">
            <Typography>契約中のサーバーがありません</Typography>
            <Typography>契約してゲームを楽しみましょう！！</Typography>
          </Stack>
          {/* 実物は href='/servers/new/game-select' */}
          <Button color="interactive" size="l" width="full" onPress={() => navigate('server-new')}>
            申し込む
          </Button>
        </Stack>
      </Card>
    </Container>
  )
}

/** components/BackupUsage */
const BackupUsage = ({ usageBytes }: { usageBytes: number }) => (
  <Stack gap="s">
    <Typography size="l" fontWeight="bold" component="h3">
      容量使用状況
    </Typography>
    <Grid spacing="s">
      {/* 実アプリのバーは最大 400px で、md 以上は文言と横に並ぶ */}
      <GridItem size={{ xxs: 12, m: 5 }}>
        <Meter
          aria-label="容量使用状況"
          value={usageBytes}
          maxValue={LIMIT_BYTES}
          valueLabel={`${formatBytes(usageBytes)} / ${formatBytes(LIMIT_BYTES)}`}
          color={usageBytes / LIMIT_BYTES >= 0.9 ? 'negative' : 'neutral'}
        />
      </GridItem>
      <GridItem size={{ xxs: 12, m: 7 }}>
        <Typography size="s" component="span">
          {formatBytes(usageBytes)} / {formatBytes(LIMIT_BYTES)} (
          {formatBytes(Math.max(LIMIT_BYTES - usageBytes, 0))} 空き)
        </Typography>
      </GridItem>
    </Grid>
  </Stack>
)

/** components/BackupListTable（マイバックアップでは「ゲーム」列が出る） */
const BackupListTable = ({
  items,
  onRestore,
  onDelete,
}: {
  items: Backup[]
  onRestore: (backup: Backup) => void
  onDelete: (backup: Backup) => void
}) => (
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
              {/* 失敗したバックアップは確認なしですぐ消える（MenuCell の onClickDeleteNow） */}
              {b.status === 'FAILED' && (
                <Sticker color="negative" size="s">
                  失敗
                </Sticker>
              )}
            </Stack>
          </Cell>
          <Cell>{b.sizeBytes > 0 ? formatBytes(b.sizeBytes) : '-'}</Cell>
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
                  onPress={() => onRestore(b)}
                >
                  復元
                </Button>
                <MenuTrigger>
                  <Button
                    appearance="transparent"
                    size="s"
                    iconOnly
                    aria-label={`${b.name}のメニュー`}
                  >
                    <Icon name="ellipsis_vertical" size="m" aria-hidden="true" />
                  </Button>
                  <Menu placement="bottom end">
                    {/* 実物の削除は色を付けない（DeleteOutline color='secondary'） */}
                    <MenuItem
                      leading={<Icon name="garbage_can" size="s" />}
                      onAction={() => onDelete(b)}
                    >
                      削除
                    </MenuItem>
                  </Menu>
                </MenuTrigger>
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
  const usageBytes = items.reduce((sum, b) => sum + b.sizeBytes, 0)
  const isFull = usageBytes >= LIMIT_BYTES
  const [dialog, setDialog] = useState<
    { type: 'create' } | { type: 'restore' | 'delete'; backup: Backup } | null
  >(null)
  const close = () => setDialog(null)
  return (
    <>
      {/* 実アプリの Paper は p={{ xs: 3, md: 6 }}・中身の間隔は spacing={4} */}
      <Card>
        <Stack gap="xl">
          <Stack
            flexDirection={{ xxs: 'column', s: 'row' }}
            gap="s"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            {/* サーバーのバックアップ画面の見出しと違い、ここは太字にしていない */}
            <Typography size="xxl" component="h2">
              マイバックアップ
            </Typography>
            {/* GAP-NEW: BackupOutlined（雲）に当たるアイコンが無いので upload で代用 */}
            <Button
              appearance="outlined"
              leading={<Icon name="upload" size="s" />}
              isDisabled={isFull}
              onPress={() => setDialog({ type: 'create' })}
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
          <BackupUsage usageBytes={usageBytes} />
          <BackupListTable
            items={items}
            onRestore={(backup) => setDialog({ type: 'restore', backup })}
            onDelete={(backup) => setDialog({ type: 'delete', backup })}
          />
        </Stack>
      </Card>
      {dialog?.type === 'create' && <CreateBackupDialog onClose={close} />}
      {dialog?.type === 'restore' && <RestoreBackupDialog backup={dialog.backup} onClose={close} />}
      {dialog?.type === 'delete' && <DeleteBackupDialog backup={dialog.backup} onClose={close} />}
    </>
  )
}

// ─── マイバックアップのダイアログ ───
// ボタンの見た目は lib/dialog.ts（キャンセル = 文字だけ、確定 = 枠線、削除の確定 = 赤の枠線）。
// GAP-NEW: Dialog に幅の prop（MUI の fullWidth・最大 600px）が無く、ダイアログは中身の幅で縮む。

/** CreateBackupDialog の timestamp()（yyyyMMdd-HHmm）。ストーリーでは固定 */
const TIMESTAMP = '20261030-1200'

/** formatCreatedAt の値を Date#toLocaleString（ja-JP）の形にする */
const toLocale = (createdAt: string) => {
  const [date, time] = createdAt.split(' ')
  const [y, m, d] = date.split('-').map(Number)
  const [h, min] = time.split(':')
  return `${y}/${m}/${d} ${Number(h)}:${min}:00`
}

/** Stack spacing 1 の「項目名（太字）＋値」 */
const DialogRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <Stack gap="xs">
    <Typography size="s" fontWeight="bold" component="span">
      {label}
    </Typography>
    <Typography size="s" component="span">
      {children}
    </Typography>
  </Stack>
)

const DialogActions = ({
  confirm,
  negative = false,
  onClose,
}: {
  confirm: string
  negative?: boolean
  onClose: () => void
}) => (
  <DialogFooter>
    <Button appearance="transparent" onPress={onClose}>
      キャンセル
    </Button>
    <Button appearance="outlined" color={negative ? 'negative' : 'neutral'} onPress={onClose}>
      {confirm}
    </Button>
  </DialogFooter>
)

/** 「サーバー」の Select。ホームから開くと契約中のサーバー（先頭が既定）から選ぶ */
const ServerSelect = ({ value, onChange }: { value: Server; onChange: (s: Server) => void }) => (
  <Select
    label="サーバー"
    size="s"
    width="full"
    selectedKey={value.id}
    onSelectionChange={(key) => {
      const next = servers.find((s) => s.id === key)
      if (next) onChange(next)
    }}
  >
    {servers.map((s) => (
      <SelectItem key={s.id} id={s.id}>
        {s.name}
      </SelectItem>
    ))}
  </Select>
)

/**
 * components/CreateBackupDialog（ホームから開いたとき）。servers を渡すので
 * サーバー → 名前 → ゲーム → 注意 の順。名前はサーバーを選び直すと「サーバー名-日時」に戻る
 */
const CreateBackupDialog = ({ onClose }: { onClose: () => void }) => {
  const [selected, setSelected] = useState<Server>(servers[0])
  const [name, setName] = useState(`${servers[0].name}-${TIMESTAMP}`)
  return (
    <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
      <DialogHeader>
        <DialogTitle>バックアップ作成</DialogTitle>
      </DialogHeader>
      <Stack gap="l">
        <ServerSelect
          value={selected}
          onChange={(s) => {
            setSelected(s)
            setName(`${s.name}-${TIMESTAMP}`)
          }}
        />
        <TextField label="名前" width="full" value={name} onChange={setName} />
        <DialogRow label="ゲーム">{gameNames[selected.game]}</DialogRow>
        <Callout color="notice" appearance="outline">
          バックアップ作成中はサーバーが停止状態になります。
          <br />
          保存期間はアカウントにサーバーのご契約がある間は無期限、ご契約がない場合は契約終了日から90日間です。
        </Callout>
      </Stack>
      <DialogActions confirm="作成" onClose={onClose} />
    </Dialog>
  )
}

/** home/_components/RestoreBackupDialog。復元先のサーバーを選ぶ（先頭が既定） */
const RestoreBackupDialog = ({ backup, onClose }: { backup: Backup; onClose: () => void }) => {
  const [selected, setSelected] = useState<Server>(servers[0])
  return (
    <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
      <DialogHeader>
        <DialogTitle>「{backup.name}」を復元しますか？</DialogTitle>
      </DialogHeader>
      <Stack gap="l">
        <Typography size="s">
          「{backup.name}」作成日時：{toLocale(backup.createdAt)} サイズ：
          {formatBytes(backup.sizeBytes)} を復元します。
          <br />
          復元するサーバーを選択してください。
        </Typography>
        <ServerSelect value={selected} onChange={setSelected} />
        <DialogRow label="ゲーム">{gameNames[selected.game]}</DialogRow>
        <Callout color="notice" appearance="outline">
          バックアップ復元中はサーバーが停止状態になります。
          <br />
          復元したデータは元に戻せないためご注意ください。
        </Callout>
      </Stack>
      <DialogActions confirm="復元" onClose={onClose} />
    </Dialog>
  )
}

/** components/DeleteBackupDialog */
const DeleteBackupDialog = ({ backup, onClose }: { backup: Backup; onClose: () => void }) => (
  <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
    <DialogHeader>
      <DialogTitle>「{backup.name}」を削除しますか？</DialogTitle>
    </DialogHeader>
    <Stack gap="l">
      <Typography size="s">
        「{backup.name}」作成日時：{toLocale(backup.createdAt)} サイズ：
        {formatBytes(backup.sizeBytes)} を完全に削除します。
      </Typography>
      <Callout color="notice" appearance="outline">
        復元したデータは元に戻せないためご注意ください。
      </Callout>
    </Stack>
    <DialogActions confirm="削除" negative onClose={onClose} />
  </Dialog>
)

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

/** home/_components/HomeContents ＋ Tabs ＋ ChangeServerNameModal */
const HomeContents = ({
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
    <>
      <Tabs defaultSelectedKey={defaultTab}>
        {/* タブと本文の間は実物の Grid mt={2}（16px） */}
        <Stack gap="m">
          {/* 実物の aria-label は 'basic tabs example' のまま。ここでは内容に合わせる */}
          <TabList aria-label="ホーム">
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
            <ServerCardsList items={items} onRename={setRenaming} />
          </TabPanel>
          <TabPanel id="myBackups">
            <MyBackupPaper items={backups} />
          </TabPanel>
        </Stack>
      </Tabs>
      {/* key で開くたびに入力欄を現在の名前に戻す */}
      <RenameDialog
        key={renaming?.id ?? 'none'}
        server={renaming}
        onClose={() => setRenaming(null)}
      />
    </>
  )
}

// ─── 画面 ───

/**
 * home/page.tsx。(private)/layout.tsx の GlobalHeader の下に Container maxWidth='xl'。
 * 見出し「ホーム」（HomeHeader）の直下にタブ。パンくずもサイドナビも無い。
 * 契約が 0 件のときは notFound() で home/not-found.tsx（EmptyServersView）に置き換わり、
 * page.tsx の Container と見出しごと消える（EmptyServersView が自分の Container maxWidth='sm' を持つ）
 */
const HomeScreen = ({
  serverItems = servers,
  defaultTab,
  renaming,
  accountMenuOpen,
}: {
  serverItems?: Server[]
  defaultTab?: HomeTab
  renaming?: Server
  accountMenuOpen?: boolean
}) => (
  <GamersShell defaultUserMenuOpen={accountMenuOpen}>
    {serverItems.length === 0 ? (
      <EmptyServersView />
    ) : (
      <GamersPageContainer maxWidth="xl">
        <Stack gap="m">
          {/* HomeHeader。実物は variant='xxxl_comfort' の太字・白、mb 2。component の指定は無い */}
          <Typography size="xxxl" fontWeight="bold" component="h1">
            ホーム
          </Typography>
          <HomeContents items={serverItems} defaultTab={defaultTab} initialRenaming={renaming} />
        </Stack>
      </GamersPageContainer>
    )}
  </GamersShell>
)

// ─── ストーリー ───

/**
 * ログイン直後のホーム。契約中のサーバーのカードを並べる。
 *
 * - サーバーのカードは 起動中・起動処理中・停止中・決済失敗・準備中（バックアップ中など）の 5 状態。最後に「サーバーを追加」のカード
 * - 鉛筆のボタンでサーバーネーム変更のダイアログが開く
 *
 * @summary 契約中のゲームサーバーの一覧
 */
export const Default: Story = {
  render: () => <HomeScreen />,
}

/**
 * ヘッダー右のアバターから開くユーザーメニュー（components/GlobalHeader）。
 * 項目は アカウント詳細 / お問合せ / ログアウト の 3 つで、区切りは無い。
 *
 * @summary ユーザーメニューを開いた状態
 */
export const AccountMenuOpen: Story = {
  render: () => <HomeScreen accountMenuOpen />,
}

/**
 * 「マイバックアップ」タブ。サーバーをまたいだバックアップの一覧と、容量 50GB の使用状況。
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
 * 契約が 1 つも無い状態（home/not-found.tsx）。見出しとタブごと EmptyServersView に置き換わる。
 *
 * @summary 契約中のサーバーが無い状態
 */
export const Empty: Story = {
  render: () => <HomeScreen serverItems={[]} />,
}

/**
 * スマートフォン幅。サーバーのカードは 1 カラムに落ちる。ホームにはサイドナビが無い。
 *
 * @summary スマートフォン幅でのホーム
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'iphone14' } },
  render: () => <HomeScreen />,
}
