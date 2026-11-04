import { useState } from 'react'

import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Menu, MenuItem, MenuTrigger } from '../../Menu'
import { Meter } from '../../Meter'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../Table'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import { GamersServerShell, ServerPageLayout, useGamersNavigate } from './gamersShell'
import { Card } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

/**
 * ロリポップ！for Gamers（apollo/frontend）のバックアップの再現。
 * - サーバーのバックアップ: app/(application)/(private)/servers/[id]/(server)/backup
 * - マイバックアップ（全ゲーム）はホームのタブなので Templates/Gamers/Home の MyBackups にある
 * - 共通の部品: components/BackupListTable・BackupUsage・CreateBackupDialog・DeleteBackupDialog
 *
 * 実アプリに自動バックアップの設定は無い（手動作成のみ）ので、ここにも置いていない。
 */

const meta = {
  title: 'Templates/Gamers/Backup',
  // テンプレートはロリポップのトンマナを確かめる場所なので、フレーバーを lolipop に固定する
  globals: { flavor: 'lolipop' },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ（形は ListGameDataBackupsResponse に合わせ、値はダミー）───

type GameId = 'minecraft-je' | 'palworld'

const gameName: Record<GameId, string> = {
  'minecraft-je': 'Minecraft (Java版)',
  palworld: 'パルワールド',
}

type Backup = {
  id: string
  name: string
  game: GameId
  /** バイト数。0 のとき一覧は '-' */
  sizeBytes: number
  /** formatCreatedAt の形（2022-02-22 22:22） */
  createdAt: string
  /** ダイアログの本文で使う toLocaleString() の形 */
  createdAtLocale: string
  status: 'SUCCESS' | 'FAILED' | 'PENDING'
  /** MenuCell の「削除」を押せるか（isDeletable） */
  isDeletable?: boolean
}

const GB = 1024 ** 3
const LIMIT_BYTES = 50 * GB

/** utils/formatBytes */
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0Bytes'
  const i = Math.max(0, Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 4))
  const units = [bytes === 1 ? 'Byte' : 'Bytes', 'KB', 'MB', 'GB', 'TB']
  return `${Number.parseFloat((bytes / 1024 ** i).toFixed(2))}${units[i]}`
}

// 名前は CreateBackupDialog の既定値（サーバー名-yyyyMMdd-HHmm）
const minecraftBackups: Backup[] = [
  {
    id: 'bk-01',
    name: 'LOLIPOP-GAMERS-SERVER-20261028-0400',
    game: 'minecraft-je',
    sizeBytes: 1.23 * GB,
    createdAt: '2026-10-28 04:00',
    createdAtLocale: '2026/10/28 4:00:12',
    status: 'SUCCESS',
  },
  {
    id: 'bk-02',
    name: 'LOLIPOP-GAMERS-SERVER-20261021-2214',
    game: 'minecraft-je',
    sizeBytes: 1.17 * GB,
    createdAt: '2026-10-21 22:14',
    createdAtLocale: '2026/10/21 22:14:40',
    status: 'SUCCESS',
  },
  {
    id: 'bk-03',
    name: 'LOLIPOP-GAMERS-SERVER-20261014-0400',
    game: 'minecraft-je',
    sizeBytes: 0,
    createdAt: '2026-10-14 04:00',
    createdAtLocale: '2026/10/14 4:00:03',
    status: 'FAILED',
  },
]

const palworldBackups: Backup[] = [
  {
    id: 'bk-04',
    name: 'パル島-20261002-1930',
    game: 'palworld',
    sizeBytes: 3.08 * GB,
    createdAt: '2026-10-02 19:30',
    createdAtLocale: '2026/10/2 19:30:21',
    status: 'SUCCESS',
  },
]

// ─── 部品 ───

/**
 * 各 Paper の見出しと右のボタン。実アプリは variant='xxl' の太字で、狭い幅ではボタンが下に回る（gap 2）。
 * 実物は sm 以上で縦の中央にそろえる（alignItems が xs: flex-start / sm: center）。Stack の alignItems が
 * レスポンシブにならないので flex-start のまま（GAP-17）
 */
const PaperTitle = ({ children, action }: { children: ReactNode; action: ReactNode }) => (
  <Stack
    flexDirection={{ xxs: 'column', s: 'row' }}
    gap="m"
    alignItems="flex-start"
    justifyContent="space-between"
  >
    <Typography size="xxl" fontWeight="bold" component="h2">
      {children}
    </Typography>
    {action}
  </Stack>
)

/** components/BackupUsage（Stack spacing 2） */
const BackupUsage = ({ usageBytes }: { usageBytes: number }) => (
  // 実アプリのバーは最大 400px
  <Grid>
    <GridItem size={{ xxs: 12, m: 5 }}>
      <Meter
        label="容量使用状況"
        value={usageBytes}
        maxValue={LIMIT_BYTES}
        valueLabel={`${formatBytes(usageBytes)} / ${formatBytes(LIMIT_BYTES)}`}
        description={`${formatBytes(Math.max(LIMIT_BYTES - usageBytes, 0))} 空き`}
        color={usageBytes / LIMIT_BYTES >= 0.9 ? 'negative' : 'neutral'}
      />
    </GridItem>
  </Grid>
)

/** components/BackupListTable。サーバーのバックアップでは「ゲーム」列が無い */
const BackupListTable = ({
  backups,
  isServerBackup = false,
  onRestore,
}: {
  backups: Backup[]
  isServerBackup?: boolean
  /** 「復元」を押したとき（RestoreBackupDialog を開く） */
  onRestore: (backup: Backup) => void
}) => {
  const [deleting, setDeleting] = useState<Backup | null>(null)
  return (
    <>
      <Table aria-label="バックアップ">
        <TableHeader>
          <Column isRowHeader>名前</Column>
          <Column>サイズ</Column>
          <Column>作成日時</Column>
          {isServerBackup ? null : <Column>ゲーム</Column>}
          <Column aria-label="操作"> </Column>
        </TableHeader>
        {/* DataGrid の noRowsLabel と同じく、0 件でも見出しは残す */}
        <TableBody
          renderEmptyState={() => (
            <Typography size="s" color="medium_emphasis" component="div">
              バックアップがありません
            </Typography>
          )}
        >
          {backups.map((b) => (
            <Row key={b.id} id={b.id}>
              <Cell>
                <Stack flexDirection="row" gap="xs" alignItems="center">
                  {/* GAP-NEW: Icon の color は生の CSS 値しか取らないので Typography で色を継承させている */}
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
              {/* DataGrid のセルの文字は body2（14px） */}
              <Cell>
                <Typography size="s" component="span">
                  {b.sizeBytes > 0 ? formatBytes(b.sizeBytes) : '-'}
                </Typography>
              </Cell>
              <Cell>
                <Typography size="s" component="span">
                  {b.createdAt}
                </Typography>
              </Cell>
              {isServerBackup ? null : (
                <Cell>
                  <Typography size="s" component="span">
                    {gameName[b.game]}
                  </Typography>
                </Cell>
              )}
              <Cell>
                {/* BackupListTable/MenuCell。成功は「復元」と ⋮、失敗は × だけ、作成中はスピナー */}
                {b.status === 'PENDING' ? (
                  <Loader size="l" />
                ) : b.status === 'SUCCESS' ? (
                  <Stack flexDirection="row" gap="xs" alignItems="center">
                    {/* GAP-NEW: Replay（↺）に当たるアイコンが無いので arrow_order で代用 */}
                    <Button
                      onPress={() => onRestore(b)}
                      appearance="outlined"
                      size="s"
                      leading={<Icon name="arrow_order" size="s" />}
                    >
                      復元
                    </Button>
                    <MenuTrigger>
                      <Button appearance="transparent" iconOnly aria-label={`${b.name}の操作`}>
                        <Icon name="ellipsis_vertical" size="m" aria-hidden="true" />
                      </Button>
                      {/* 実物の項目は「削除」1 つだけ（ダウンロードはコメントアウトされている）。色は付いていない */}
                      <Menu placement="bottom end">
                        <MenuItem
                          isDisabled={b.isDeletable === false}
                          leading={<Icon name="garbage_can" size="s" />}
                          onAction={() => setDeleting(b)}
                        >
                          削除
                        </MenuItem>
                      </Menu>
                    </MenuTrigger>
                  </Stack>
                ) : (
                  // 失敗したバックアップは確認なしですぐ消える（handleClickDeleteNow）
                  <Button appearance="transparent" iconOnly aria-label={`${b.name}を削除`}>
                    <Icon name="cross" size="m" />
                  </Button>
                )}
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
      {deleting && <DeleteBackupDialog backup={deleting} onClose={() => setDeleting(null)} />}
    </>
  )
}

// ─── ダイアログ ───
// ボタンの見た目は lib/dialog.ts に合わせる。キャンセル = 文字だけ、確定 = 枠線、削除の確定 = 赤の枠線。

// GAP-NEW: Dialog に幅の prop（MUI の fullWidth・最大 600px）が無い。inline style を当てない方針のため未対応で、
// ダイアログは中身の幅で縮む。

/** 開いた状態の Dialog。閉じる操作を onClose に渡す */
const OpenDialog = ({
  children,
  role,
  onClose,
}: {
  children: ReactNode
  role?: 'dialog' | 'alertdialog'
  onClose?: () => void
}) => (
  <Dialog isOpen role={role} onOpenChange={(open) => !open && onClose?.()}>
    {children}
  </Dialog>
)

const DialogActions = ({
  confirm,
  negative = false,
  onClose,
}: {
  confirm: string
  negative?: boolean
  onClose?: () => void
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

/** 項目名（太字）と値。CreateBackupDialog の「ゲーム」（Stack spacing 1） */
const ConfigRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <Stack gap="xs">
    <Typography size="s" fontWeight="bold" component="span">
      {label}
    </Typography>
    <Typography size="s" component="span">
      {children}
    </Typography>
  </Stack>
)

/**
 * components/CreateBackupDialog（サーバーのバックアップから開いたとき）。
 * servers を渡さないので「サーバー」の Select は出ず、名前 → ゲーム → 注意の順
 */
const CreateBackupDialog = ({ onClose }: { onClose?: () => void }) => (
  <OpenDialog onClose={onClose}>
    <DialogHeader>
      <DialogTitle>バックアップ作成</DialogTitle>
    </DialogHeader>
    <Stack gap="l">
      <TextField label="名前" width="full" defaultValue="LOLIPOP-GAMERS-SERVER-20261030-1200" />
      <ConfigRow label="ゲーム">{gameName['minecraft-je']}</ConfigRow>
      <Callout color="notice" appearance="outline">
        バックアップ作成中はサーバーが停止状態になります。
        <br />
        保存期間はアカウントにサーバーのご契約がある間は無期限、ご契約がない場合は契約終了日から90日間です。
      </Callout>
    </Stack>
    <DialogActions confirm="作成" onClose={onClose} />
  </OpenDialog>
)

/** (server)/backup/_components/RestoreBackupDialog */
const RestoreBackupDialog = ({ backup, onClose }: { backup: Backup; onClose?: () => void }) => (
  <OpenDialog onClose={onClose}>
    <DialogHeader>
      <DialogTitle>「{backup.name}」を復元しますか？</DialogTitle>
    </DialogHeader>
    <Stack gap="l">
      <Typography size="s" component="div">
        「{backup.name}」作成日時：{backup.createdAtLocale} サイズ：
        {formatBytes(backup.sizeBytes)} を復元します。
      </Typography>
      <Callout color="notice" appearance="outline">
        バックアップ復元中はサーバーが停止状態になります。
        <br />
        復元したデータは元に戻せないためご注意ください。
      </Callout>
    </Stack>
    <DialogActions confirm="復元" onClose={onClose} />
  </OpenDialog>
)

/** components/DeleteBackupDialog。注意文は実アプリの文言のまま（「復元したデータは」） */
const DeleteBackupDialog = ({ backup, onClose }: { backup: Backup; onClose?: () => void }) => (
  <OpenDialog onClose={onClose}>
    <DialogHeader>
      <DialogTitle>「{backup.name}」を削除しますか？</DialogTitle>
    </DialogHeader>
    <Stack gap="l">
      <Typography size="s" component="div">
        「{backup.name}」作成日時：{backup.createdAtLocale} サイズ：
        {formatBytes(backup.sizeBytes)} を完全に削除します。
      </Typography>
      <Callout color="notice" appearance="outline">
        復元したデータは元に戻せないためご注意ください。
      </Callout>
    </Stack>
    <DialogActions confirm="削除" negative onClose={onClose} />
  </OpenDialog>
)

const usageOf = (backups: Backup[]) => backups.reduce((sum, b) => sum + b.sizeBytes, 0)

// ─── サーバーのバックアップ（servers/[id]/(server)/backup/page.tsx）───

/** MyBackupPaper の「全てのゲームのバックアップを管理」。実物は href='/home?activeTab=myBackups' */
const ManageAllBackupsButton = () => {
  const navigate = useGamersNavigate()
  return (
    <Button
      appearance="outlined"
      leading={<Icon name="person" size="s" />}
      onPress={() => navigate('home-backups')}
    >
      全てのゲームのバックアップを管理
    </Button>
  )
}

type OpenedDialog = { kind: 'create' } | { kind: 'restore'; backup: Backup } | null

const ServerBackupScreen = ({
  backups = minecraftBackups,
  initialDialog = null,
  dialog,
}: {
  backups?: Backup[]
  /** 開いた状態から始めるダイアログ（作成・復元） */
  initialDialog?: OpenedDialog
  /** そのほかに重ねて出すダイアログ */
  dialog?: ReactNode
}) => {
  const [opened, setOpened] = useState<OpenedDialog>(initialDialog)
  const close = () => setOpened(null)
  const usageBytes = usageOf(backups) + usageOf(palworldBackups)
  return (
    // servers/[id]/layout.tsx の Sidebar で「バックアップ」。(server)/layout.tsx の ServerDetailHeader の下にタブは無い
    <GamersServerShell active="backup">
      <ServerPageLayout status="RUNNING">
        {/* backup/_components/BackupListPaper（Paper の p は xs: 3 / md: 6） */}
        <Card padding={{ xxs: 'l', m: 'xxl' }}>
          <Stack gap="l">
            {/* GAP-NEW: BackupOutlined（雲に上矢印）に当たるアイコンが無いので upload で代用 */}
            <PaperTitle
              action={
                <Button
                  appearance="outlined"
                  isDisabled={usageBytes >= LIMIT_BYTES}
                  leading={<Icon name="upload" size="s" />}
                  onPress={() => setOpened({ kind: 'create' })}
                >
                  バックアップ作成
                </Button>
              }
            >
              Minecraft (Java版)のバックアップ
            </PaperTitle>
            <BackupListTable
              backups={backups}
              isServerBackup
              onRestore={(backup) => setOpened({ kind: 'restore', backup })}
            />
          </Stack>
        </Card>
        {/* backup/_components/MyBackupPaper。容量はマイバックアップ全体（他のゲームを含む） */}
        <Card padding={{ xxs: 'l', m: 'xxl' }}>
          <Stack gap="l">
            {/* GAP-NEW: ManageAccountsOutlined に当たるアイコンが無いので person で代用 */}
            <PaperTitle action={<ManageAllBackupsButton />}>マイバックアップ</PaperTitle>
            {usageBytes >= LIMIT_BYTES && (
              <Callout color="notice">
                <Stack gap="xxs">
                  <Typography size="s" fontWeight="bold" component="span">
                    空き容量がありません
                  </Typography>
                  <Typography size="s" component="span">
                    バックアップを作成するには不要なバックアップを削除してください。
                  </Typography>
                </Stack>
              </Callout>
            )}
            <BackupUsage usageBytes={usageBytes} />
          </Stack>
        </Card>
      </ServerPageLayout>
      {opened?.kind === 'create' && <CreateBackupDialog onClose={close} />}
      {opened?.kind === 'restore' && <RestoreBackupDialog backup={opened.backup} onClose={close} />}
      {dialog}
    </GamersServerShell>
  )
}

// ─── ストーリー ───

/**
 * サーバーのバックアップ。上にこのゲームのバックアップ一覧、下にマイバックアップ全体の容量。
 * 成功した行は「復元」と ⋮（削除）、失敗した行は × だけ。
 *
 * @summary サーバーのバックアップ一覧
 */
export const Default: Story = {
  render: () => <ServerBackupScreen />,
}

/**
 * バックアップが 1 件も無い状態。表の見出しは残したまま「バックアップがありません」を出す。
 *
 * @summary バックアップが無い状態
 */
export const Empty: Story = {
  render: () => <ServerBackupScreen backups={[]} />,
}

/**
 * 「バックアップ作成」のダイアログ。名前の既定値は「サーバー名-日付-時刻」。
 *
 * @summary 作成のダイアログ
 */
export const CreateDialog: Story = {
  render: () => <ServerBackupScreen initialDialog={{ kind: 'create' }} />,
}

/**
 * 「復元」を押した直後の確認。復元中はサーバーが止まり、元に戻せないことを伝える。
 *
 * @summary 復元の確認
 */
export const RestoreDialog: Story = {
  render: () => (
    <ServerBackupScreen initialDialog={{ kind: 'restore', backup: minecraftBackups[0] }} />
  ),
}

/**
 * ⋮ の「削除」を押した直後の確認。
 *
 * @summary 削除の確認
 */
export const DeleteDialog: Story = {
  render: () => <ServerBackupScreen dialog={<DeleteBackupDialog backup={minecraftBackups[1]} />} />,
}

/**
 * スマートフォン幅。見出しの右のボタンが見出しの下に回る。
 *
 * @summary スマートフォン幅
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'iphone14' } },
  render: () => <ServerBackupScreen />,
}
