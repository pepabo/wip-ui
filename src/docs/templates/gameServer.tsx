import { Button } from '../../Button'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Menu, MenuDivider, MenuItem, MenuTrigger } from '../../Menu'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Typography } from '../../Typography'
import sevenDaysImage from './assets/gamers/game/7days-to-die.webp'
import arkImage from './assets/gamers/game/ark_image.webp'
import corekeeperImage from './assets/gamers/game/corekeeper.webp'
import enshroudedImage from './assets/gamers/game/enshrouded.webp'
import fivemImage from './assets/gamers/game/fivem.webp'
import minecraftBeImage from './assets/gamers/game/minecraft_be_image.webp'
import minecraftJeImage from './assets/gamers/game/minecraft_je_image.webp'
import palworldImage from './assets/gamers/game/palworld_image.webp'
import projectzomboidImage from './assets/gamers/game/projectzomboid.webp'
import satisfactoryImage from './assets/gamers/game/satisfactory.webp'
import terrariaImage from './assets/gamers/game/terraria.webp'
import valheimImage from './assets/gamers/game/valheim.webp'

import type { ReactNode } from 'react'
import type { IconName } from '../../Icon'
import type { TypographyColor } from '../../Typography'

/**
 * ゲームサーバー（ゲーマーズ = apollo/frontend）の画面で共通の部品。
 * サーバー詳細・ゲーム設定・MOD 管理・ファイル管理・バックアップの 5 テンプレートが使う。
 * 実アプリでは servers/[id]/(server)/layout.tsx が ServerDetailHeader を (server) 配下の全ページ
 * （詳細の 4 タブと backup/page.tsx）の上に置いている。ここではタブの代わりに AppShell のサイドナビで切り替える。
 *
 * タブの表示条件（ServerDetailTabPanels）。AppShell のサイドナビは常に全項目を出すので、ここでは再現していない:
 * - ゲーム設定: 契約が ACTIVE でゲームが判明しているときだけ（設定画面の無いゲームは出ない）
 * - MOD: Minecraft (Java版) で、サーバーの種類が VANILLA / 未指定でなく、状態が UNKNOWN でないときだけ
 * - ファイル管理: メンテナンス中（isMaintenanceFileManager）は出ない
 * - バックアップ・支払いはタブではなく servers/[id]/layout.tsx のサイドバーの項目
 * 共通化の候補: AppShell のナビ項目に「出さない」を渡す口があれば、この条件をそのまま写せる。
 *
 * 共通化の候補: parts.tsx に寄せるなら、ServerStatusView・ConfigRow・CalloutBody は
 * ゲーム以外の画面でも使える形になっている。
 *
 * ダイアログの処理中・完了の段はテンプレートに入れていない。実アプリの完了は CheckCircle 80px ＋ 1 行
 * （GAP-NEW: アイコンの最大が l で 80px に届かない）、処理中は Alert variant='outlined' severity='warning'
 * の「アプリを閉じないようにご注意ください」と CircularProgress size=80。
 */

// ─── データ（形は apollo の GetServerResponse に合わせ、値はダミー）───

/**
 * GetServerResponse_IntegratedStatus。PREPARING は isServerPreparing が true になる状態
 * （RUNNING / STOPPED / STARTING / STOPPING / FAILURE 以外）をまとめたもの。
 * 「不明」（UNKNOWN / ERROR）もここに入る。実アプリでも UNKNOWN は ServerStatusView の default 節で
 * 「準備中」と表示され、ヘッダーからステータスと起動ボタンが消える（専用の「不明」表示は無い）
 */
export type ServerStatus =
  | 'RUNNING'
  | 'STOPPED'
  | 'STARTING'
  | 'STOPPING'
  | 'FAILURE'
  | 'PREPARING'
  | 'RESTORING'

export const isServerPreparing = (status: ServerStatus) =>
  status === 'PREPARING' || status === 'RESTORING'

// IP アドレスは文書用のアドレス範囲（RFC 5737）。ゲーム名は backend/entity/game.go の GameDisplayNames
export const server = {
  id: 'sv-3f9a2c1e',
  name: 'LOLIPOP-GAMERS-SERVER',
  game: 'Minecraft (Java版)',
  ip: '203.0.113.24',
  // MinecraftJavaInfo。mod は MOD とプラグインの両方を入れられる HYBRID のサーバー
  mod: 'mohist',
  version: '1.20.1',
} as const

/** ゲームのキービジュアル（services/Game.ts の findGameImg）。キーは GameDisplayNames の表示名 */
export const gameImages: Record<string, string> = {
  'Minecraft (Java版)': minecraftJeImage,
  'Minecraft (統合版)': minecraftBeImage,
  パルワールド: palworldImage,
  '7 Days to Die': sevenDaysImage,
  'ARK: Survival Evolved': arkImage,
  Satisfactory: satisfactoryImage,
  'FiveM(GTA V)': fivemImage,
  Terraria: terrariaImage,
  'Core Keeper': corekeeperImage,
  Valheim: valheimImage,
  'Project Zomboid': projectzomboidImage,
  Enshrouded: enshroudedImage,
}

// ─── 表示の部品 ───

/** components/ServerStatusView。色はアイコンにだけ付き、文字は本文色のまま */
const statusView: Record<ServerStatus, { label: string; color: TypographyColor; icon?: IconName }> =
  {
    RUNNING: { label: '起動中', color: 'positive', icon: 'bullet_circle' },
    STOPPED: { label: '停止中', color: 'low_emphasis', icon: 'circle' },
    STARTING: { label: '起動中', color: 'high_emphasis' },
    STOPPING: { label: '停止中', color: 'high_emphasis' },
    FAILURE: { label: '起動失敗', color: 'negative', icon: 'exclamation_on_triangle' },
    PREPARING: { label: '準備中', color: 'high_emphasis' },
    RESTORING: { label: '準備中', color: 'high_emphasis' },
  }

export const ServerStatusView = ({ status }: { status: ServerStatus }) => {
  const v = statusView[status]
  return (
    <Stack flexDirection="row" gap="xs" alignItems="center">
      {/* Icon の color は生の CSS 値しか取らないので、Typography の色を継承させる */}
      <Typography component="span" size="s" color={v.color}>
        {v.icon ? <Icon name={v.icon} size="s" /> : <Loader size="s" />}
      </Typography>
      <Typography component="span" size="s">
        {v.label}
      </Typography>
    </Stack>
  )
}

/** 各 Paper の見出し。実アプリは variant='xxl' の太字（設定の中の小見出しは 'l'） */
export const PaperTitle = ({
  children,
  size = 'xxl',
  action,
}: {
  children: ReactNode
  size?: 'l' | 'xxl'
  action?: ReactNode
}) => (
  <Stack
    flexDirection={{ xxs: 'column', s: 'row' }}
    gap="s"
    alignItems="flex-start"
    justifyContent="space-between"
  >
    <Typography size={size} fontWeight="bold" component="h2">
      {children}
    </Typography>
    {action}
  </Stack>
)

/** components/ConfigRow。項目名（太字）の下に値 */
export const ConfigRow = ({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: ReactNode
}) => (
  <Stack gap="xxs">
    <Typography size="s" fontWeight="bold" component="span">
      {label}
    </Typography>
    {description && (
      <Typography size="xs" color="medium_emphasis" component="span">
        {description}
      </Typography>
    )}
    <Typography size="s" component="span">
      {children}
    </Typography>
  </Stack>
)

/** MUI の AlertTitle ＋本文。GAP-NEW: Callout にタイトルの枠が無い */
export const CalloutBody = ({ title, children }: { title: string; children?: ReactNode }) => (
  <Stack gap="xxs">
    <Typography size="s" fontWeight="bold" component="span">
      {title}
    </Typography>
    {children && (
      <Typography size="s" component="span">
        {children}
      </Typography>
    )}
  </Stack>
)

/**
 * 「😴 サーバー停止中のため…」の置き換え表示（ServerStatusPaper / ServerDetailTabPanels）。
 * ServerStatusPaper は 2 行に折る xs、ゲーム設定タブは 1 行の s
 */
export const EmptyNotice = ({
  size = 'xs',
  children,
}: {
  size?: 'xs' | 's'
  children: ReactNode
}) => (
  <Stack alignItems="center">
    <Typography size={size}>{children}</Typography>
  </Stack>
)

// ─── ヘッダー ───

/**
 * (server)/_components/ServerSwitch。分岐は実アプリのまま（再起動の処理中の「再起動中」は省いた）。
 * FAILURE のときの再起動だけは実アプリの default 節に落ちて「読込中」になる。
 * GAP-NEW: PlayArrow / StopCircleOutlined / RestartAlt に当たるアイコンが無い
 */
const ServerSwitch = ({ status }: { status: ServerStatus }) => {
  const busy = (label: string) => (
    <Button size="l" isDisabled leading={<Loader size="s" />}>
      {label}
    </Button>
  )
  const start =
    status === 'STOPPING' ? (
      busy('停止中')
    ) : status === 'STARTING' ? (
      busy('起動中')
    ) : status === 'RUNNING' ? (
      <Button color="interactive" size="l" leading={<Icon name="minus_on_circle" size="m" />}>
        停止
      </Button>
    ) : status === 'STOPPED' || status === 'FAILURE' ? (
      <Button color="interactive" size="l" leading={<Icon name="arrow_right" size="m" />}>
        起動
      </Button>
    ) : (
      busy('読込中')
    )
  const restartButton = (isDisabled: boolean) => (
    <Button
      color="interactive"
      size="l"
      isDisabled={isDisabled}
      leading={<Icon name="arrow_order" size="m" />}
    >
      再起動
    </Button>
  )
  const restart =
    status === 'STOPPING' || status === 'STARTING'
      ? restartButton(true)
      : status === 'RUNNING' || status === 'STOPPED'
        ? restartButton(false)
        : busy('読込中')
  return (
    <Stack flexDirection="row" gap="s" alignItems="flex-start">
      {start}
      {restart}
    </Stack>
  )
}

/** ServerListMenu に並ぶ契約中のサーバー（ゲーマーズの画面に合わせたダミー） */
const serverList = [
  { id: server.id, name: server.name },
  { id: 'sv-7b21d0a4', name: 'パル島' },
  { id: 'sv-c05e9f13', name: '週末7dtd' },
]

/**
 * servers/[id]/_components/ServerListMenu。サーバー名＋UnfoldMore のボタンで Menu を開き、
 * 契約中のサーバー・区切り線・「ホーム」を並べる。実アプリは AppBar の左端にある。
 * AppShell の AppBar は編集できないので、ヘッダーの上に置いている（共通化の候補: AppShell に AppBar 左端の差し込み口）。
 * 同じ AppBar の VESPY（AI アシスタント）とサイドバーのオンボーディングバナーは告知・広告の性格が強いので省いた
 */
const ServerListMenu = () => (
  <MenuTrigger>
    {/* GAP-NEW: UnfoldMore（上下の山）に当たるアイコンが無いので chevron_down で代用 */}
    <Button appearance="outlined" size="s" trailing={<Icon name="chevron_down" size="s" />}>
      {server.name}
    </Button>
    <Menu>
      {serverList.map((s) => (
        <MenuItem key={s.id} id={s.id}>
          {s.name}
        </MenuItem>
      ))}
      <MenuDivider />
      <MenuItem id="home">ホーム</MenuItem>
    </Menu>
  </MenuTrigger>
)

/** サイドナビの現在地。表示には使わない（実アプリにパンくずや現在タブ名の表示は無い） */
type ServerDetailTab = '詳細' | 'ゲーム設定' | 'MOD' | 'ファイル管理' | 'バックアップ'

type ServerDetailHeaderProps = {
  status: ServerStatus
  tab: ServerDetailTab
}

/**
 * (server)/_components/ServerDetailHeader。サーバー名（xxxl）の下にステータスとゲーム、右に ServerSwitch。
 * 準備中・復元中はステータスと起動ボタンを出さない
 */
export const ServerDetailHeader = ({ status }: ServerDetailHeaderProps) => (
  <Stack gap="m">
    <Stack flexDirection="row">
      <ServerListMenu />
    </Stack>
    <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="l" justifyContent="space-between">
      <Stack gap="s">
        <Typography size="xxxl" fontWeight="bold" component="h1">
          {server.name}
        </Typography>
        <Stack flexDirection="row" gap="s" alignItems="center">
          {!isServerPreparing(status) && <ServerStatusView status={status} />}
          {/* components/Sticker の spec='game-title' */}
          <Sticker color="informative" size="s">
            {server.game}
          </Sticker>
        </Stack>
      </Stack>
      {!isServerPreparing(status) && <ServerSwitch status={status} />}
    </Stack>
  </Stack>
)
