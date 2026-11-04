import { createContext, useContext, useEffect, useState } from 'react'

import { Breadcrumb, Breadcrumbs } from '../../Breadcrumbs'
import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Checkbox } from '../../Checkbox'
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Menu, MenuItem, MenuTrigger } from '../../Menu'
import { Paper } from '../../Paper'
import { Stack } from '../../Stack'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../Table'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import { GamersServerShell, ServerPageLayout } from './gamersShell'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { Selection, SortDescriptor } from 'react-aria-components'
import type { IconName } from '../../Icon'

/**
 * ロリポップ！for Gamers（apollo/frontend）のファイル管理の再現。
 * 元: app/(application)/(private)/servers/[id]/(server)/_components/FileManager 以下。
 * 実アプリはサーバー画面（Sidebar の「サーバー」）のタブの 1 つ（詳細 / ゲーム設定 / MOD / ファイル管理）。
 * 枠は gamersShell.tsx の GamersServerShell ＋ ServerPageLayout（tab="fileManager"）。
 */

const meta = {
  title: 'Templates/Gamers/FileManager',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ（形は api/filemanager の Resource に合わせ、値はダミー）───

/** utils/getMediaType の分類。DIRECTORY はフォルダ */
type Kind = 'DIRECTORY' | 'text' | 'image' | 'audio' | 'video' | 'application' | 'other'

type Resource = {
  path: string
  name: string
  kind: Kind
  /** formatBytes の形。フォルダは '-' */
  size: string
  /** formatUpdateTime の形（2022-02-22 22:22） */
  updatedAt: string
}

// GAP-15: ファイル種別のアイコンが無い。components/MediaIcon の対応を汎用アイコンで代用している。
// 画像 → image、アプリ（zip / jar）→ clip、テキスト → note、音声 → mic、動画 → camera、その他 → note
const kindIcon: Record<Kind, IconName> = {
  DIRECTORY: 'folder',
  text: 'note',
  image: 'image',
  audio: 'mic',
  video: 'camera',
  application: 'clip',
  other: 'note',
}

const ROOT = '/opt'

const dir = (path: string, updatedAt: string): Resource => ({
  path,
  name: path.split('/').pop() ?? '',
  kind: 'DIRECTORY',
  size: '-',
  updatedAt,
})
const file = (path: string, kind: Kind, size: string, updatedAt: string): Resource => ({
  path,
  name: path.split('/').pop() ?? '',
  kind,
  size,
  updatedAt,
})

// Minecraft (Java版) の Paper サーバーの /opt を想定したダミー
const initialFs: Record<string, Resource[]> = {
  '/opt': [
    dir('/opt/logs', '2026-10-30 09:12'),
    dir('/opt/plugins', '2026-10-12 21:04'),
    dir('/opt/world', '2026-10-30 09:12'),
    dir('/opt/world_nether', '2026-10-30 09:12'),
    dir('/opt/world_the_end', '2026-10-30 09:12'),
    file('/opt/banned-ips.json', 'text', '2Bytes', '2026-10-02 18:44'),
    file('/opt/banned-players.json', 'text', '2Bytes', '2026-10-02 18:44'),
    file('/opt/bukkit.yml', 'text', '1.07KB', '2026-10-02 18:44'),
    file('/opt/eula.txt', 'text', '158Bytes', '2026-10-02 18:43'),
    file('/opt/ops.json', 'text', '108Bytes', '2026-10-02 18:44'),
    file('/opt/paper.jar', 'application', '46.21MB', '2026-10-02 18:43'),
    file('/opt/server-icon.png', 'image', '6.18KB', '2026-10-21 22:08'),
    file('/opt/server.properties', 'text', '1.42KB', '2026-10-21 22:10'),
    file('/opt/spigot.yml', 'text', '4.09KB', '2026-10-02 18:44'),
    file('/opt/whitelist.json', 'text', '312Bytes', '2026-10-21 22:10'),
  ],
  '/opt/logs': [
    file('/opt/logs/2026-10-28-1.log.gz', 'application', '3.12KB', '2026-10-28 23:59'),
    file('/opt/logs/2026-10-29-1.log.gz', 'application', '2.87KB', '2026-10-29 23:59'),
    file('/opt/logs/latest.log', 'text', '18.4KB', '2026-10-30 09:12'),
  ],
  '/opt/plugins': [
    dir('/opt/plugins/LuckPerms', '2026-10-12 21:04'),
    file('/opt/plugins/EssentialsX-2.20.1.jar', 'application', '3.4MB', '2026-10-12 21:02'),
    file('/opt/plugins/LuckPerms-Bukkit-5.4.141.jar', 'application', '2.1MB', '2026-10-12 21:02'),
  ],
  '/opt/plugins/LuckPerms': [
    dir('/opt/plugins/LuckPerms/translations', '2026-10-12 21:04'),
    file('/opt/plugins/LuckPerms/config.yml', 'text', '28.6KB', '2026-10-12 21:04'),
    file('/opt/plugins/LuckPerms/luckperms-h2-v2.mv.db', 'other', '120KB', '2026-10-30 09:12'),
  ],
  '/opt/plugins/LuckPerms/translations': [
    dir('/opt/plugins/LuckPerms/translations/repository', '2026-10-12 21:04'),
  ],
  '/opt/plugins/LuckPerms/translations/repository': [
    file(
      '/opt/plugins/LuckPerms/translations/repository/ja_JP.properties',
      'text',
      '21.3KB',
      '2026-10-12 21:04'
    ),
    file(
      '/opt/plugins/LuckPerms/translations/repository/status.json',
      'text',
      '4.02KB',
      '2026-10-12 21:04'
    ),
  ],
  '/opt/world': [
    dir('/opt/world/datapacks', '2026-10-02 18:44'),
    dir('/opt/world/playerdata', '2026-10-30 09:12'),
    dir('/opt/world/region', '2026-10-30 09:12'),
    file('/opt/world/level.dat', 'other', '2.01KB', '2026-10-30 09:12'),
    file('/opt/world/session.lock', 'other', '3Bytes', '2026-10-30 09:00'),
  ],
  '/opt/world/datapacks': [],
  '/opt/world/playerdata': [
    file(
      '/opt/world/playerdata/5f1c2a9e-7d43-4b1a-9c0e-2e8f6a3b1d74.dat',
      'other',
      '1.92KB',
      '2026-10-30 09:12'
    ),
  ],
  '/opt/world/region': [
    file('/opt/world/region/r.-1.0.mca', 'other', '4.47MB', '2026-10-30 09:12'),
    file('/opt/world/region/r.0.-1.mca', 'other', '3.86MB', '2026-10-30 09:12'),
    file('/opt/world/region/r.0.0.mca', 'other', '6.02MB', '2026-10-30 09:12'),
  ],
  '/opt/world_nether': [
    dir('/opt/world_nether/DIM-1', '2026-10-30 09:12'),
    file('/opt/world_nether/level.dat', 'other', '1.98KB', '2026-10-30 09:12'),
  ],
  '/opt/world_nether/DIM-1': [],
  '/opt/world_the_end': [
    dir('/opt/world_the_end/DIM1', '2026-10-30 09:12'),
    file('/opt/world_the_end/level.dat', 'other', '1.98KB', '2026-10-30 09:12'),
  ],
  '/opt/world_the_end/DIM1': [],
}

const serverProperties = `#Minecraft server properties
#Wed Oct 21 22:10:04 JST 2026
allow-flight=false
difficulty=normal
enable-command-block=false
gamemode=survival
hardcore=false
max-players=20
motd=A Minecraft Server
online-mode=true
pvp=true
server-port=25565
spawn-protection=16
view-distance=10
white-list=true`

/** MenuItems/hooks の判定。フォルダ・音声・動画・画像は編集できない */
const isEditable = (r: Resource) =>
  r.kind !== 'DIRECTORY' && r.kind !== 'audio' && r.kind !== 'video' && r.kind !== 'image'

const allResources = Object.values(initialFs).flat()

const nameOf = (path: string) => path.split('/').pop() ?? ''
const parentOf = (path: string) => path.split('/').slice(0, -1).join('/') || ROOT

/** MenuItems/hooks の targetResourceText。1 つなら「名前」、複数なら個数 */
const targetText = (paths: string[]) =>
  paths.length === 1 ? `「${nameOf(paths[0])}」` : `${paths.length}個のアイテム`

// ─── 部品 ───

/**
 * MUI のブレークポイント未満かどうか。実アプリは sx の display と useMediaQuery で出し分けている。
 * GAP-NEW: ブレークポイントで要素を出し分ける口（display のレスポンシブ指定）が無いので、
 * matchMedia で判定して描き分けている（Mods と同じ）
 */
const useBelow = (query: string) => {
  const [below, setBelow] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setBelow(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return below
}
/** MUI の lg（1200px）未満。ツリーを出さない */
const belowLg = '(max-width: 1199.95px)'
/** MUI の sm（600px）未満。パンくずの省略の仕方と文字の大きさが変わる */
const belowSm = '(max-width: 599.95px)'

// GAP-NEW: TreeView が無い（実アプリは MUI x-tree-view の RichTreeView）。
// 開閉の iconOnly ボタンとフォルダ名のボタンを並べ、階層の字下げを inline style で付けている。
// 字下げ 22px は実アプリの itemChildrenIndentation。
const treeIndent = (depth: number) => ({ paddingInlineStart: depth * 22 }) // GAP-NEW: TreeView が無い

/** FileManager/DirectoryTree。フォルダだけを出す。Root（/opt）は家のアイコン */
const DirectoryTree = ({
  activePath,
  onSelect,
  label,
}: {
  activePath: string
  onSelect: (path: string) => void
  label: string
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    // 現在地までの祖先を開いておく
    const set = new Set<string>([ROOT])
    const parts = activePath.split('/').filter(Boolean)
    for (let i = 1; i < parts.length; i++) set.add(`/${parts.slice(0, i + 1).join('/')}`)
    return set
  })
  const toggle = (path: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })

  const renderItem = (path: string, depth: number): ReactNode => {
    const children = (initialFs[path] ?? []).filter((r) => r.kind === 'DIRECTORY')
    const isOpen = expanded.has(path)
    const isRoot = path === ROOT
    return (
      <Stack key={path} gap="xxs">
        <div style={treeIndent(depth)}>
          <Stack flexDirection="row" gap="xxs" alignItems="center">
            <Button
              appearance="transparent"
              size="s"
              iconOnly
              aria-label={`${isRoot ? 'Root' : nameOf(path)}を${isOpen ? '閉じる' : '開く'}`}
              aria-expanded={isOpen}
              onPress={() => toggle(path)}
            >
              <Icon name={isOpen ? 'chevron_down' : 'chevron_right'} size="s" />
            </Button>
            <Button
              appearance={path === activePath ? 'flat' : 'transparent'}
              size="s"
              leading={<Icon name={isRoot ? 'home' : 'folder'} size="s" />}
              aria-label={isRoot ? 'Root' : undefined}
              onPress={() => {
                onSelect(path)
                setExpanded((prev) => new Set(prev).add(path))
              }}
            >
              {isRoot ? '' : nameOf(path)}
            </Button>
          </Stack>
        </div>
        {isOpen && children.map((c) => renderItem(c.path, depth + 1))}
      </Stack>
    )
  }

  return (
    <nav aria-label={label}>
      <Stack gap="xxs">{renderItem(ROOT, 0)}</Stack>
    </nav>
  )
}

/**
 * FileBrowser/Header/Breadcrumbs。先頭は家のアイコン。
 * PC では 5 階層以上で後ろ 2 つ、スマートフォン（sm 未満）では 4 階層以上で後ろ 1 つを残して、
 * 間を「…」にまとめる（実アプリは「…」でメニューが開く）。
 * 名前は PC で xxl、スマートフォンで xl の太字
 */
const PathBreadcrumbs = ({
  path,
  onNavigate,
}: {
  path: string
  onNavigate: (path: string) => void
}) => {
  const [showAll, setShowAll] = useState(false)
  const isMobile = useBelow(belowSm)
  const parts = path.split('/').filter(Boolean)
  const items = parts.map((label, i) => ({ label, path: `/${parts.slice(0, i + 1).join('/')}` }))
  const keep = isMobile ? 1 : 2
  const collapse = !showAll && items.length > (isMobile ? 3 : 4)
  const [first, ...rest] = items
  const middle = collapse ? rest.slice(0, -keep) : []
  const last = collapse ? rest.slice(-keep) : rest

  return (
    <Breadcrumbs>
      <Breadcrumb aria-label="Root" onPress={() => onNavigate(first.path)}>
        <Icon name="home" size="m" />
      </Breadcrumb>
      {middle.length > 0 && (
        // GAP-NEW: 実アプリは「…」で省略した階層のメニューが開く。Breadcrumb は中身を必ず Link で包み、
        // コレクションの項目なので MenuTrigger で包めない。メニューを置けないので全階層を展開する
        <Breadcrumb aria-label={`${middle.length}個の階層を表示`} onPress={() => setShowAll(true)}>
          …
        </Breadcrumb>
      )}
      {last.map((item) => (
        <Breadcrumb key={item.path} onPress={() => onNavigate(item.path)}>
          <Typography component="span" size={{ xxs: 'xl', s: 'xxl' }} fontWeight="bold">
            {item.label}
          </Typography>
        </Breadcrumb>
      ))}
    </Breadcrumbs>
  )
}

/** 列見出しでの並べ替え。実アプリの DataGrid と同じく、既定では並べ替えない */
const sortRows = (rows: Resource[], sort?: SortDescriptor) => {
  if (!sort?.column) return rows
  const key = sort.column as 'name' | 'size' | 'updatedAt'
  const sorted = [...rows].sort((a, b) => a[key].localeCompare(b[key], 'ja', { numeric: true }))
  return sort.direction === 'descending' ? sorted.reverse() : sorted
}

// ─── ダイアログ ───
// ボタンの見た目は lib/dialog.ts に合わせる。キャンセル = 文字だけ、確定 = 枠線、削除の確定 = 赤の枠線。

// GAP-NEW: Dialog に幅の prop（MUI の fullWidth・最大 600px）が無い。inline style を当てない方針のため未対応で、
// ダイアログは中身の幅で縮む。

/** 開いているダイアログを閉じる。メニューから開いたダイアログを、キャンセル・確定・外側のクリックで閉じる */
const CloseDialogContext = createContext<() => void>(() => {})

/** 開いた状態の Dialog。閉じる操作は CloseDialogContext から受け取る */
const OpenDialog = ({
  children,
  role,
}: {
  children: ReactNode
  role?: 'dialog' | 'alertdialog'
}) => {
  const close = useContext(CloseDialogContext)
  return (
    <Dialog isOpen role={role} onOpenChange={(open) => !open && close()}>
      {children}
    </Dialog>
  )
}

const CancelButton = () => (
  <Button appearance="transparent" onPress={useContext(CloseDialogContext)}>
    キャンセル
  </Button>
)

const DialogActions = ({ confirm, negative = false }: { confirm: string; negative?: boolean }) => (
  <DialogFooter>
    <CancelButton />
    <Button
      appearance="outlined"
      color={negative ? 'negative' : 'neutral'}
      onPress={useContext(CloseDialogContext)}
    >
      {confirm}
    </Button>
  </DialogFooter>
)

/** CreateResourceDialog。新規フォルダは見出しとラベルが「フォルダ」になるだけ */
const CreateResourceDialog = ({ folder = false }: { folder?: boolean }) => (
  <OpenDialog>
    <DialogHeader>
      <DialogTitle>{folder ? '新規フォルダ作成' : '新規ファイル作成'}</DialogTitle>
    </DialogHeader>
    <TextField label={folder ? 'フォルダ名' : 'ファイル名'} width="full" />
    <DialogActions confirm="作成" />
  </OpenDialog>
)

/** ChangeNameDialog。今の名前が入った状態で開く */
const ChangeNameDialog = ({ current }: { current: string }) => (
  <OpenDialog>
    <DialogHeader>
      <DialogTitle>名前変更</DialogTitle>
    </DialogHeader>
    <TextField label="名前" width="full" defaultValue={current} />
    <DialogActions confirm="保存" />
  </OpenDialog>
)

/** UpdateResourceDialog */
const UpdateResourceDialog = ({ name }: { name: string }) => (
  <OpenDialog>
    <DialogHeader>
      <DialogTitle>「{name}」を編集</DialogTitle>
    </DialogHeader>
    {/* GAP-NEW: TextField の textarea に行数（rows）を渡す口が無く、実アプリの 25 行の高さにできない。
        折り返さない（white-space: nowrap）指定もできない。 */}
    <TextField
      aria-label={`「${name}」の内容`}
      component="textarea"
      width="full"
      defaultValue={serverProperties}
    />
    <DialogActions confirm="保存" />
  </OpenDialog>
)

/** UploadResourceDialog。ドロップゾーンと、ファイル・フォルダの選択ボタン */
const UploadResourceDialog = () => (
  <OpenDialog>
    <DialogHeader>
      <DialogTitle>アップロード</DialogTitle>
    </DialogHeader>
    {/* GAP-NEW: ドロップゾーン（DropZone / FileTrigger）が無い。実物と同じ elevation 0 の Paper で面だけ作っている。
        実物は高さ 360px で中央寄せ、アイコンは 64px */}
    <Paper elevation={0}>
      <Stack gap="m" alignItems="center">
        <Typography component="span" color="medium_emphasis">
          <Icon name="upload" size="l" />
        </Typography>
        <Stack gap="xs" alignItems="center">
          <Typography size="s">アップロードするファイルかフォルダをドラッグ＆ドロップ</Typography>
          <Typography size="s">または</Typography>
        </Stack>
        <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap={{ xxs: 'xs', m: 'l' }}>
          {/* GAP-NEW: UploadFile / DriveFolderUpload に当たるアイコンが無い */}
          <Button appearance="outlined" leading={<Icon name="note" size="s" />}>
            ファイルを選択
          </Button>
          <Button appearance="outlined" leading={<Icon name="folder" size="s" />}>
            フォルダを選択
          </Button>
        </Stack>
        <Typography size="xs">名前が同じ場合は上書きされます。</Typography>
      </Stack>
    </Paper>
    <DialogFooter>
      <CancelButton />
    </DialogFooter>
  </OpenDialog>
)

/** MoveResourceDialog。現在の場所と、移動先を選ぶディレクトリツリー */
const MoveResourceDialog = ({ targets }: { targets: string[] }) => {
  const from = parentOf(targets[0])
  const [to, setTo] = useState(from)
  return (
    <OpenDialog>
      <DialogHeader>
        <DialogTitle>{targetText(targets)}を移動</DialogTitle>
      </DialogHeader>
      <Stack gap="l">
        <Stack flexDirection="row" gap="xxs" alignItems="center">
          <Typography component="span" size="s">
            現在の場所：
          </Typography>
          <Icon name="folder" size="s" />
          <Typography component="span" size="s">
            {from}
          </Typography>
        </Stack>
        <Stack gap="xs">
          <Typography component="span" size="s" fontWeight="bold">
            移動先
          </Typography>
          {/* 実アプリは高さ 332px で中をスクロールする */}
          <Paper padding="m">
            <DirectoryTree activePath={to} onSelect={setTo} label="移動先のフォルダ" />
          </Paper>
        </Stack>
      </Stack>
      <DialogActions confirm="移動" />
    </OpenDialog>
  )
}

/** DeleteResourceDialog */
const DeleteResourceDialog = ({ targets }: { targets: string[] }) => (
  <OpenDialog role="alertdialog">
    <DialogHeader>
      <DialogTitle>{targetText(targets)}を削除しますか？</DialogTitle>
    </DialogHeader>
    <Stack gap="l">
      <Typography size="s">サーバーから{targetText(targets)}を完全に削除します。</Typography>
      <Callout color="notice" appearance="outline">
        削除されたデータは元に戻せないためご注意ください。
      </Callout>
    </Stack>
    <DialogActions confirm="削除" negative />
  </OpenDialog>
)

// ─── 画面 ───

/** MenuItems の項目。複数選択では編集・名前変更・パスのコピーが消え、編集できない種類では編集が消える */
const ResourceMenu = ({
  targets,
  onOpenDialog,
}: {
  targets: string[]
  onOpenDialog: (dialog: ReactNode) => void
}) => {
  const one = targets.length === 1 ? allResources.find((r) => r.path === targets[0]) : undefined
  // GAP-NEW: DriveFileMove / DriveFileRenameOutline / CopyAll に当たるアイコンが無い
  return (
    <Menu placement="bottom end">
      <MenuItem leading={<Icon name="download" size="s" />}>ダウンロード</MenuItem>
      <MenuItem leading={<Icon name="copy" size="s" />}>複製</MenuItem>
      <MenuItem
        leading={<Icon name="arrow_right" size="s" />}
        onAction={() => onOpenDialog(<MoveResourceDialog targets={targets} />)}
      >
        移動
      </MenuItem>
      {one && isEditable(one) ? (
        <MenuItem
          leading={<Icon name="pencil" size="s" />}
          onAction={() => onOpenDialog(<UpdateResourceDialog name={one.name} />)}
        >
          編集
        </MenuItem>
      ) : null}
      {one ? (
        <MenuItem
          leading={<Icon name="note" size="s" />}
          onAction={() => onOpenDialog(<ChangeNameDialog current={one.name} />)}
        >
          名前変更
        </MenuItem>
      ) : null}
      {one ? <MenuItem leading={<Icon name="clip" size="s" />}>パスのコピー</MenuItem> : null}
      {/* 実アプリの削除は他の項目と同じ色（赤くしない） */}
      <MenuItem
        leading={<Icon name="garbage_can" size="s" />}
        onAction={() => onOpenDialog(<DeleteResourceDialog targets={targets} />)}
      >
        削除
      </MenuItem>
    </Menu>
  )
}

const bulkActions = [
  ['ダウンロード', 'download'],
  ['複製', 'copy'],
  ['移動', 'arrow_right'],
  ['削除', 'garbage_can'],
] as const

const FileManager = ({
  initialPath = ROOT,
  initialSelected = [],
  dialog,
}: {
  initialPath?: string
  initialSelected?: string[]
  dialog?: ReactNode
}) => {
  const [path, setPath] = useState(initialPath)
  const [selected, setSelected] = useState<string[]>(initialSelected)
  const [openDialog, setOpenDialog] = useState<ReactNode>(dialog)
  const [sort, setSort] = useState<SortDescriptor>()

  const rows = sortRows(initialFs[path] ?? [], sort)

  const navigate = (next: string) => {
    setPath(next)
    setSelected([])
  }

  const noSelection = selected.length === 0
  const hideTree = useBelow(belowLg)

  return (
    <GamersServerShell active="server">
      <ServerPageLayout status="RUNNING" tab="fileManager">
        <Paper padding="none" elevation={1}>
          <Grid gapless>
            {/* 実アプリは lg（1200px）未満でツリーを出さない。ツリーの幅は 230px の固定
              GAP-NEW: GridItem に境界線を付けられず、ツリーと一覧の間の縦罫（borderRight）が無い */}
            {!hideTree && (
              <GridItem size={3}>
                <Paper padding="m" elevation={0}>
                  <DirectoryTree activePath={path} onSelect={navigate} label="フォルダ" />
                </Paper>
              </GridItem>
            )}
            <GridItem size={hideTree ? 12 : 9}>
              <Stack>
                {/* FileBrowser/Header */}
                <Paper padding="m" elevation={0}>
                  <Stack
                    flexDirection="row"
                    gap="s"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <PathBreadcrumbs key={path} path={path} onNavigate={navigate} />
                    {/* FileBrowser/Header/SingleActionButton */}
                    <MenuTrigger>
                      <Button
                        appearance="outlined"
                        leading={<Icon name="plus" size="s" />}
                        trailing={<Icon name="chevron_down" size="s" />}
                      >
                        追加
                      </Button>
                      <Menu placement="bottom end">
                        <MenuItem
                          leading={<Icon name="upload" size="s" />}
                          onAction={() => setOpenDialog(<UploadResourceDialog />)}
                        >
                          アップロード
                        </MenuItem>
                        <MenuItem
                          leading={<Icon name="note" size="s" />}
                          onAction={() => setOpenDialog(<CreateResourceDialog />)}
                        >
                          新規ファイル
                        </MenuItem>
                        <MenuItem
                          leading={<Icon name="folder" size="s" />}
                          onAction={() => setOpenDialog(<CreateResourceDialog folder />)}
                        >
                          新規フォルダ
                        </MenuItem>
                      </Menu>
                    </MenuTrigger>
                  </Stack>
                </Paper>
                <Divider />
                {/* FileBrowser/MultiActionSection */}
                <Paper padding="m" elevation={0}>
                  <Stack
                    flexDirection={{ xxs: 'column', m: 'row' }}
                    gap="s"
                    justifyContent="space-between"
                  >
                    <Typography size="s" component="span">
                      {noSelection ? '未選択' : `${selected.length}個選択中`}
                    </Typography>
                    {/* 実アプリは flexWrap で折り返す。Stack に折り返しが無いので、狭い幅では 2 つずつ 2 行に分けている */}
                    <Stack flexDirection={{ xxs: 'column', s: 'row' }} gap="m">
                      {[bulkActions.slice(0, 2), bulkActions.slice(2)].map((group) => (
                        <Stack key={group[0][0]} flexDirection="row" gap="m">
                          {group.map(([label, icon]) => (
                            <Button
                              key={label}
                              appearance="outlined"
                              leading={<Icon name={icon} size="s" />}
                              isDisabled={noSelection}
                            >
                              {label}
                            </Button>
                          ))}
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Paper>
                <Divider />
                {/* FileBrowser/ResourcesTable。行を押すとフォルダが開く（実アプリは PC ではダブルクリック、
                  タッチ端末では 1 回のタップ。ファイルのダブルクリックで編集が開く操作は入れていない） */}
                <Table
                  aria-label="ファイル一覧"
                  selectionMode="multiple"
                  selectedKeys={new Set(selected)}
                  onSelectionChange={(keys: Selection) =>
                    setSelected(keys === 'all' ? rows.map((r) => r.path) : ([...keys] as string[]))
                  }
                  sortDescriptor={sort}
                  onSortChange={setSort}
                >
                  <TableHeader>
                    <Column>
                      <Checkbox slot="selection" aria-label="すべて選択">
                        {null}
                      </Checkbox>
                    </Column>
                    <Column id="name" isRowHeader allowsSorting>
                      ファイル名
                    </Column>
                    <Column id="size" allowsSorting>
                      サイズ
                    </Column>
                    <Column id="updatedAt" allowsSorting>
                      最終更新日時
                    </Column>
                    <Column aria-label="操作"> </Column>
                  </TableHeader>
                  <TableBody
                    renderEmptyState={() => (
                      <Typography size="s" color="medium_emphasis">
                        このフォルダにはファイルがありません
                      </Typography>
                    )}
                  >
                    {rows.map((r) => (
                      <Row
                        key={r.path}
                        id={r.path}
                        onAction={r.kind === 'DIRECTORY' ? () => navigate(r.path) : undefined}
                      >
                        <Cell>
                          <Checkbox slot="selection" aria-label={`${r.name}を選択`}>
                            {null}
                          </Checkbox>
                        </Cell>
                        <Cell>
                          <Stack flexDirection="row" gap="xxs" alignItems="center">
                            <Typography component="span" color="medium_emphasis">
                              <Icon name={kindIcon[r.kind]} size="s" />
                            </Typography>
                            <Typography component="span" size="s">
                              {r.name}
                            </Typography>
                          </Stack>
                        </Cell>
                        <Cell>{r.size}</Cell>
                        <Cell>{r.updatedAt}</Cell>
                        <Cell>
                          {/* FileBrowser/ResourcesTable/MenuCell。⋮ を押した行だけを選び直してメニューを開く */}
                          <MenuTrigger
                            onOpenChange={(open) => {
                              if (open && !(selected.includes(r.path) && selected.length > 1)) {
                                setSelected([r.path])
                              }
                            }}
                          >
                            <Button
                              appearance="transparent"
                              size="s"
                              iconOnly
                              aria-label={`${r.name}の操作`}
                            >
                              <Icon name="ellipsis_vertical" size="m" aria-hidden="true" />
                            </Button>
                            <ResourceMenu
                              targets={
                                selected.includes(r.path) && selected.length > 1
                                  ? selected
                                  : [r.path]
                              }
                              onOpenDialog={setOpenDialog}
                            />
                          </MenuTrigger>
                        </Cell>
                      </Row>
                    ))}
                  </TableBody>
                </Table>
              </Stack>
            </GridItem>
          </Grid>
        </Paper>
        <CloseDialogContext.Provider value={() => setOpenDialog(null)}>
          {openDialog}
        </CloseDialogContext.Provider>
      </ServerPageLayout>
    </GamersServerShell>
  )
}

/** FileManager/index.tsx の初期化中（実アプリは高さ 550px の Skeleton）と、初期化の失敗 */
const InitState = ({ state }: { state: 'loading' | 'error' }) => (
  <GamersServerShell active="server">
    <ServerPageLayout status="RUNNING" tab="fileManager">
      {state === 'loading' ? (
        // GAP-NEW: Skeleton が無い。面の中央に Loader を置いて代用している
        <Paper elevation={1}>
          <Stack alignItems="center">
            <Loader size="l" aria-label="読み込み中" />
          </Stack>
        </Paper>
      ) : (
        <Callout color="negative">
          {/* GAP-NEW: Callout にタイトルの枠が無い（実アプリは AlertTitle） */}
          <Stack gap="xxs">
            <Typography size="s" fontWeight="bold" component="span">
              ファイル管理機能の初期化に失敗しました。
            </Typography>
            <Typography size="s" component="span">
              画面を更新して再読み込みしてください。
            </Typography>
          </Stack>
        </Callout>
      )}
    </ServerPageLayout>
  </GamersServerShell>
)

// ─── ストーリー ───

/**
 * ゲームサーバーのファイル管理。左にフォルダのツリー（Root = /opt）、右にパンくず・一括操作・ファイル一覧を置く。
 *
 * @summary ツリーとファイル一覧
 */
export const Default: Story = {
  render: () => <FileManager />,
}

/**
 * 中身が空のフォルダ。表の見出しは残したまま「このフォルダにはファイルがありません」を出す。
 *
 * @summary 空のフォルダ
 */
export const EmptyFolder: Story = {
  render: () => <FileManager initialPath="/opt/world/datapacks" />,
}

/**
 * アップロードのダイアログ。ドラッグ＆ドロップの面と、ファイル・フォルダの選択ボタンを置く。
 *
 * @summary アップロードのダイアログ
 */
export const UploadDialog: Story = {
  render: () => <FileManager dialog={<UploadResourceDialog />} />,
}

/**
 * 新規ファイル作成のダイアログ。
 *
 * @summary 新規ファイル作成
 */
export const NewFileDialog: Story = {
  render: () => <FileManager dialog={<CreateResourceDialog />} />,
}

/**
 * 名前変更のダイアログ。
 *
 * @summary 名前変更
 */
export const RenameDialog: Story = {
  render: () => (
    <FileManager
      initialSelected={['/opt/whitelist.json']}
      dialog={<ChangeNameDialog current="whitelist.json" />}
    />
  ),
}

/**
 * テキストファイルの編集ダイアログ。
 *
 * @summary テキストの編集
 */
export const EditDialog: Story = {
  render: () => (
    <FileManager
      initialSelected={['/opt/server.properties']}
      dialog={<UpdateResourceDialog name="server.properties" />}
    />
  ),
}

/**
 * 移動のダイアログ。現在の場所と、移動先を選ぶツリーを出す。
 *
 * @summary 移動先の選択
 */
export const MoveDialog: Story = {
  render: () => {
    const targets = ['/opt/plugins/EssentialsX-2.20.1.jar']
    return (
      <FileManager
        initialPath="/opt/plugins"
        initialSelected={targets}
        dialog={<MoveResourceDialog targets={targets} />}
      />
    )
  },
}

/**
 * 削除の確認。複数選んでいるときは「n個のアイテム」と書く。
 *
 * @summary 削除の確認
 */
export const DeleteDialog: Story = {
  render: () => {
    const targets = ['/opt/logs/2026-10-28-1.log.gz', '/opt/logs/2026-10-29-1.log.gz']
    return (
      <FileManager
        initialPath="/opt/logs"
        initialSelected={targets}
        dialog={<DeleteResourceDialog targets={targets} />}
      />
    )
  },
}

/**
 * ファイル管理の初期化中。
 *
 * @summary 初期化中
 */
export const Loading: Story = {
  render: () => <InitState state="loading" />,
}

/**
 * ファイル管理の初期化に失敗した状態。一覧の代わりにエラーを出す。
 *
 * @summary 初期化の失敗
 */
export const InitError: Story = {
  render: () => <InitState state="error" />,
}

/**
 * スマートフォン幅。ツリーは隠れ、パンくずは 4 階層以上で後ろ 1 つを残して省略する。
 *
 * @summary スマートフォン幅
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'iphone14' } },
  render: () => <FileManager />,
}
