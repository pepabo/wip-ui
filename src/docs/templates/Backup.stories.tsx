import { useState } from 'react'
import { TabPanel } from 'react-aria-components'

import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Paper } from '../../Paper'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Tab, TabList, Tabs } from '../../Tab'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../Table'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import { AppShell } from './AppShell'
import { ServerDetailHeader } from './gameServer'
import { Card } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { IconName } from '../../Icon'

/**
 * ロリポップ！for Gamers（apollo/frontend）のバックアップの再現。
 * - サーバーのバックアップ: app/(application)/(private)/servers/[id]/(server)/backup
 * - マイバックアップ（全ゲーム）: app/(application)/(private)/home の「マイバックアップ」タブ
 * - 共通の部品: components/BackupListTable・BackupUsage・CreateBackupDialog・DeleteBackupDialog
 *
 * 実アプリに自動バックアップの設定は無い（手動作成のみ）ので、ここにも置いていない。
 */

const meta = {
  title: 'Templates/Backup',
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
  status: 'SUCCESS' | 'FAILED'
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
 * GAP-9: Menu が無い。トリガーの直下に Paper を絶対配置で重ね、項目を transparent ボタンで並べている。
 * 外側のクリックや Esc で閉じない・矢印キーで項目を移れない・role="menu" にならない。
 */
const menuAnchorStyle = { position: 'relative', display: 'inline-block' } as const // GAP-9
const menuPanelStyle = {
  position: 'absolute',
  top: '100%',
  right: 0,
  zIndex: 10,
  width: 220,
} as const // GAP-9

type MenuItem = { label: string; icon: IconName }

const PseudoMenu = ({
  isOpen,
  onOpenChange,
  trigger,
  items,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trigger: (toggle: () => void) => ReactNode
  items: MenuItem[]
}) => (
  <div style={menuAnchorStyle}>
    {trigger(() => onOpenChange(!isOpen))}
    {isOpen && (
      <div style={menuPanelStyle}>
        <Paper elevation={3}>
          <Stack gap="xxs">
            {items.map((item) => (
              <Button
                key={item.label}
                appearance="transparent"
                size="s"
                width="full"
                leading={<Icon name={item.icon} size="s" />}
                onPress={() => onOpenChange(false)}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Paper>
      </div>
    )}
  </div>
)

// GAP-18: 進捗バー / メーターが無い。Typography で色を継承させ、currentColor で塗っている。
// 高さ・角丸・トラックの不透明度はトークンに出典が無い暫定値。90% 以上で赤（実アプリは pink[700]）。
const meterTrackStyle = { height: 20, borderRadius: 8, opacity: 0.15, background: 'currentColor' } // GAP-18
const meterFillStyle = { height: 20, borderRadius: 8, marginTop: -20, background: 'currentColor' } // GAP-18

// GAP-18: 役割（meter）も持てないので、数値は隣の文言で読ませる
const Meter = ({ ratio }: { ratio: number }) => (
  <Typography component="div" color={ratio >= 0.9 ? 'negative' : 'informative'}>
    <div style={meterTrackStyle} />
    <div style={{ ...meterFillStyle, width: `${Math.min(ratio, 1) * 100}%` }} />
  </Typography>
)

/** 各 Paper の見出しと右のボタン。実アプリは variant='xxl' の太字で、狭い幅ではボタンが下に回る */
const PaperTitle = ({ children, action }: { children: ReactNode; action: ReactNode }) => (
  <Stack
    flexDirection={{ xxs: 'column', s: 'row' }}
    gap="s"
    alignItems="flex-start"
    justifyContent="space-between"
  >
    <Typography size="xxl" fontWeight="bold" component="h2">
      {children}
    </Typography>
    {action}
  </Stack>
)

/** components/BackupUsage */
const BackupUsage = ({ usageBytes }: { usageBytes: number }) => (
  <Stack gap="s">
    <Typography size="l" fontWeight="bold" component="h3">
      容量使用状況
    </Typography>
    <Grid spacing="s">
      {/* 実アプリのバーは最大 400px */}
      <GridItem size={{ xxs: 12, m: 5 }}>
        <Meter ratio={usageBytes / LIMIT_BYTES} />
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

/** components/BackupListTable。サーバーのバックアップでは「ゲーム」列が無い */
const BackupListTable = ({
  backups,
  isServerBackup = false,
}: {
  backups: Backup[]
  isServerBackup?: boolean
}) => {
  const [menu, setMenu] = useState<string | null>(null)
  return (
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
          <Typography size="s" color="medium_emphasis">
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
                {b.status === 'FAILED' && (
                  <Sticker color="negative" size="s">
                    失敗
                  </Sticker>
                )}
              </Stack>
            </Cell>
            <Cell>{b.sizeBytes > 0 ? formatBytes(b.sizeBytes) : '-'}</Cell>
            <Cell>{b.createdAt}</Cell>
            {isServerBackup ? null : <Cell>{gameName[b.game]}</Cell>}
            <Cell>
              {/* BackupListTable/MenuCell。成功は「復元」と ⋮、失敗は × だけ */}
              {b.status === 'SUCCESS' ? (
                <Stack flexDirection="row" gap="xs" alignItems="center">
                  {/* GAP-NEW: Replay（↺）に当たるアイコンが無いので arrow_order で代用 */}
                  <Button
                    appearance="outlined"
                    size="s"
                    leading={<Icon name="arrow_order" size="s" />}
                  >
                    復元
                  </Button>
                  <PseudoMenu
                    isOpen={menu === b.id}
                    onOpenChange={(open) => setMenu(open ? b.id : null)}
                    trigger={(toggle) => (
                      <Button
                        appearance="transparent"
                        size="s"
                        iconOnly
                        aria-label={`${b.name}の操作`}
                        aria-expanded={menu === b.id}
                        onPress={toggle}
                      >
                        <Icon name="ellipsis_vertical" size="m" />
                      </Button>
                    )}
                    items={[{ label: '削除', icon: 'garbage_can' }]}
                  />
                </Stack>
              ) : (
                // 失敗したバックアップは確認なしですぐ消える（handleClickDeleteNow）
                <Button appearance="transparent" size="s" iconOnly aria-label={`${b.name}を削除`}>
                  <Icon name="cross" size="m" />
                </Button>
              )}
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  )
}

// ─── ダイアログ ───
// ボタンの見た目は lib/dialog.ts に合わせる。キャンセル = 文字だけ、確定 = 枠線、削除の確定 = 赤の枠線。

// GAP-NEW: Dialog に幅の指定が無く、中身の幅で縮む。実アプリは MUI の fullWidth（最大 600px）。
// 中身を 1 枚の div で包んで幅を持たせている。552px は 600px から Dialog の左右の padding を引いた値。
const dialogWidthStyle = { width: 552, maxWidth: '100%' } // GAP-NEW: Dialog に幅が無い

const FullWidthDialog = ({
  children,
  role,
}: {
  children: ReactNode
  role?: 'dialog' | 'alertdialog'
}) => (
  <Dialog isOpen role={role}>
    <div style={dialogWidthStyle}>{children}</div>
  </Dialog>
)

const DialogActions = ({ confirm, negative = false }: { confirm: string; negative?: boolean }) => (
  <DialogFooter>
    <Button appearance="transparent">キャンセル</Button>
    <Button appearance="outlined" color={negative ? 'negative' : 'neutral'}>
      {confirm}
    </Button>
  </DialogFooter>
)

/** 項目名（太字）と値。CreateBackupDialog の「ゲーム」 */
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

/** components/CreateBackupDialog（サーバーのバックアップから開いたとき） */
const CreateBackupDialog = () => (
  <FullWidthDialog>
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
    <DialogActions confirm="作成" />
  </FullWidthDialog>
)

/** (server)/backup/_components/RestoreBackupDialog */
const RestoreBackupDialog = ({ backup }: { backup: Backup }) => (
  <FullWidthDialog>
    <DialogHeader>
      <DialogTitle>「{backup.name}」を復元しますか？</DialogTitle>
    </DialogHeader>
    <Stack gap="l">
      <Typography size="s">
        「{backup.name}」作成日時：{backup.createdAtLocale} サイズ：
        {formatBytes(backup.sizeBytes)} を復元します。
      </Typography>
      <Callout color="notice" appearance="outline">
        バックアップ復元中はサーバーが停止状態になります。
        <br />
        復元したデータは元に戻せないためご注意ください。
      </Callout>
    </Stack>
    <DialogActions confirm="復元" />
  </FullWidthDialog>
)

/** components/DeleteBackupDialog。注意文は実アプリの文言のまま（「復元したデータは」） */
const DeleteBackupDialog = ({ backup }: { backup: Backup }) => (
  <FullWidthDialog role="alertdialog">
    <DialogHeader>
      <DialogTitle>「{backup.name}」を削除しますか？</DialogTitle>
    </DialogHeader>
    <Stack gap="l">
      <Typography size="s">
        「{backup.name}」作成日時：{backup.createdAtLocale} サイズ：
        {formatBytes(backup.sizeBytes)} を完全に削除します。
      </Typography>
      <Callout color="notice" appearance="outline">
        復元したデータは元に戻せないためご注意ください。
      </Callout>
    </Stack>
    <DialogActions confirm="削除" negative />
  </FullWidthDialog>
)

const usageOf = (backups: Backup[]) => backups.reduce((sum, b) => sum + b.sizeBytes, 0)

// ─── サーバーのバックアップ（servers/[id]/(server)/backup/page.tsx）───

const ServerBackupScreen = ({
  backups = minecraftBackups,
  dialog,
}: {
  backups?: Backup[]
  dialog?: ReactNode
}) => (
  <AppShell active="backup">
    {/* (server)/layout.tsx の ServerDetailHeader（サーバー詳細と共通。gameServer.tsx） */}
    <ServerDetailHeader status="RUNNING" tab="バックアップ" />
    {/* backup/_components/BackupListPaper */}
    <Card>
      <Stack gap="l">
        {/* GAP-NEW: BackupOutlined（雲に上矢印）に当たるアイコンが無いので upload で代用 */}
        <PaperTitle
          action={
            <Button appearance="outlined" leading={<Icon name="upload" size="s" />}>
              バックアップ作成
            </Button>
          }
        >
          Minecraft (Java版)のバックアップ
        </PaperTitle>
        <BackupListTable backups={backups} isServerBackup />
      </Stack>
    </Card>
    {/* backup/_components/MyBackupPaper。容量はマイバックアップ全体（他のゲームを含む） */}
    <Card>
      <Stack gap="l">
        {/* GAP-NEW: ManageAccountsOutlined に当たるアイコンが無いので person で代用 */}
        <PaperTitle
          action={
            <Button appearance="outlined" leading={<Icon name="person" size="s" />}>
              全てのゲームのバックアップを管理
            </Button>
          }
        >
          マイバックアップ
        </PaperTitle>
        <BackupUsage usageBytes={usageOf(backups) + usageOf(palworldBackups)} />
      </Stack>
    </Card>
    {dialog}
  </AppShell>
)

// ─── マイバックアップ（home/page.tsx の「マイバックアップ」タブ）───

const MyBackupsScreen = () => {
  const backups = [...minecraftBackups, ...palworldBackups]
  return (
    <AppShell active="backup">
      {/* home/_components/Tabs。GAP-10: TabPanel は react-aria-components から直接 import している */}
      {/* GAP-NEW: DnsOutlined に当たるアイコンが無いので node で代用 */}
      <Tabs defaultSelectedKey="myBackups">
        <TabList aria-label="ホーム">
          <Tab id="servers">
            <Stack flexDirection="row" gap="xs" alignItems="center">
              <Icon name="node" size="s" />
              サーバー
            </Stack>
          </Tab>
          <Tab id="myBackups">
            <Stack flexDirection="row" gap="xs" alignItems="center">
              <Icon name="person" size="s" />
              マイバックアップ
            </Stack>
          </Tab>
        </TabList>
        <TabPanel id="servers" />
        <TabPanel id="myBackups">
          {/* home/_components/MyBackupPaper */}
          <Card>
            <Stack gap="xl">
              <PaperTitle
                action={
                  <Button appearance="outlined" leading={<Icon name="upload" size="s" />}>
                    バックアップ作成
                  </Button>
                }
              >
                マイバックアップ
              </PaperTitle>
              <BackupUsage usageBytes={usageOf(backups)} />
              <BackupListTable backups={backups} />
            </Stack>
          </Card>
        </TabPanel>
      </Tabs>
    </AppShell>
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
  render: () => <ServerBackupScreen dialog={<CreateBackupDialog />} />,
}

/**
 * 「復元」を押した直後の確認。復元中はサーバーが止まり、元に戻せないことを伝える。
 *
 * @summary 復元の確認
 */
export const RestoreDialog: Story = {
  render: () => (
    <ServerBackupScreen dialog={<RestoreBackupDialog backup={minecraftBackups[0]} />} />
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
 * ホームの「マイバックアップ」タブ。全ゲームのバックアップを 1 つの表に出し、「ゲーム」列が加わる。
 *
 * @summary マイバックアップ（全ゲーム）
 */
export const MyBackups: Story = {
  render: () => <MyBackupsScreen />,
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
