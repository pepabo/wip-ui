import { createContext, useContext } from 'react'

import { AppBar, AppBarLeading, AppBarTrailing } from '../../AppBar'
import { Avatar } from '../../Avatar'
import { Button } from '../../Button'
import { Container } from '../../Container'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Menu, MenuDivider, MenuItem, MenuTrigger } from '../../Menu'
import { SideNavigation, SideNavigationItem, SideNavigationSection } from '../../SideNavigation'
import { Stack } from '../../Stack'
import { Typography } from '../../Typography'
import lolipopMark from './assets/ai-gateway/providers/lolipop.svg'

import type { ReactNode } from 'react'
import type { AppBarProps } from '../../AppBar'
import type { IconName } from '../../Icon'

/**
 * ホスティング管理画面の共通シェル。
 * AppBar・サイドナビ・コンテンツ幅の 3 つを固定し、各画面はこの中身だけを書く。
 * トンマナを見直すときは、ここを変えれば全テンプレートに波及する。
 */

export type NavId =
  | 'home'
  | 'overview'
  | 'game'
  | 'mods'
  | 'files'
  | 'backup'
  | 'deploys'
  | 'domains'
  | 'site'
  | 'apikeys'
  | 'usage'
  | 'billing'
  | 'account'

// 実アプリのメニューを 1 つの管理画面にまとめている。
// ゲームサーバー（ゲーマーズ）、サイト（デプロイナウ）、開発者（AI ゲートウェイ）、契約の 4 群。
type NavGroup = { label?: string; items: { id: NavId; label: string; icon: IconName }[] }

const navGroups: NavGroup[] = [
  { items: [{ id: 'home', label: 'ホーム', icon: 'home' }] },
  {
    label: 'ゲームサーバー',
    items: [
      { id: 'overview', label: 'サーバー詳細', icon: 'node' },
      { id: 'game', label: 'ゲーム設定', icon: 'parameters' },
      { id: 'mods', label: 'MOD 管理', icon: 'plus_on_circle' },
      { id: 'files', label: 'ファイル管理', icon: 'folder' },
      { id: 'backup', label: 'バックアップ', icon: 'clock' },
    ],
  },
  {
    label: 'サイト',
    items: [
      { id: 'deploys', label: 'デプロイ', icon: 'upload' },
      { id: 'domains', label: 'ドメイン', icon: 'launch' },
      { id: 'site', label: '設定', icon: 'gear' },
    ],
  },
  {
    label: '開発者',
    items: [
      { id: 'apikeys', label: 'APIキー', icon: 'lock' },
      { id: 'usage', label: '使用状況', icon: 'bill' },
    ],
  },
  {
    label: '契約',
    items: [
      { id: 'billing', label: 'お支払い', icon: 'receipt' },
      { id: 'account', label: 'アカウント', icon: 'person' },
    ],
  },
]

// ヘッダーのロゴ。統合コンソールはゲーマーズ・デプロイナウ・AI ゲートウェイの 3 つのサービスをまとめるので、
// どれか 1 つのサービスのロゴ（gamers-logo.svg「LOLIPOP! for Gamers」、deploy-now/logo.svg「デプロイナウ」、
// ai-gateway/logo.svg「AIゲートウェイ」）にすると、ほかの 2 つの画面にも特定のサービスの名前が出てしまう。
// そこで 3 つに共通するロリポップ！のマーク（AI ゲートウェイの providers/lolipop.svg。ProviderIcon の auto で
// 実際に使っている素材）を置き、隣に管理画面の名前「サーバー管理」を文字で出す。
// ほかの候補を選ばなかった理由：
// - gamers/logo-white.svg と gamers/lolipop-logo.svg は「LOLIPOP!」のロゴだが、白い文字を含む暗い地向けで、
//   白・透明の AppBar では文字が消える。実アプリのコードからも参照されていない
// - ai-gateway/footer のロゴは「レンタルサーバー」という別のサービス名が入る
// マークは白い顔を赤のグラデーションで囲む図柄なので、white / transparent / filled（濃紺）のどの AppBar にも載る。
// 大きさは AI ゲートウェイのヘッダーのロゴ（高さ 24px）に合わせる。
const Logo = () => <img src={lolipopMark} alt="ロリポップ！" width={24} height={24} />

// GAP-6: Avatar が img 専用のため、頭文字を SVG のデータ URI にして渡す。
// この 2 色だけはトークンではなく生の hex で、テンプレート層で唯一の例外。
const initialAvatar = (initial: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#c7cbd3"/><text x="20" y="25" font-family="sans-serif" font-size="16" text-anchor="middle" fill="#393c41">${initial}</text></svg>`
  )}`

const avatarSrc = initialAvatar('山')

// ユーザーメニュー。2 つの実アプリの和集合にしている。
// - ゲーマーズ components/GlobalHeader: アカウント詳細 / お問合せ / ログアウト
// - デプロイナウ (private)/AccountMenu: アカウント設定 / デベロッパー設定 | ドキュメント / よくある質問 / お知らせ | ログアウト
// 統合コンソールでは両方の行き先が要る（デベロッパー設定やドキュメントはゲーマーズに無く、
// お問合せはデプロイナウに無い）ので、どちらかに寄せると行き先が消える。和集合にし、
// 区切りと並びはデプロイナウ（wip-ui で組まれている方）に合わせた。
// 「アカウント詳細」と「アカウント設定」は同じ役割（アカウント画面へ）なので 1 つにまとめ、デプロイナウの名前を使う。
// お問合せはヘルプ系の群（ドキュメント / よくある質問 / お知らせ）の末尾に置く。文言はゲーマーズのまま。
const accountMenuGroups: string[][] = [
  ['アカウント設定', 'デベロッパー設定'],
  ['ドキュメント', 'よくある質問', 'お知らせ', 'お問合せ'],
  ['ログアウト'],
]

/** 移動先。サイドナビの項目と、ユーザーメニューから行けるデベロッパー設定 */
export type AppDestination = NavId | 'developer'

/**
 * Templates/App で画面を切り替えるための口。
 * 置かれていない（各画面のストーリーを単体で開いた）ときは、押しても何もしない
 */
export const AppNavigationContext = createContext<((to: AppDestination) => void) | null>(null)

// ユーザーメニューの項目のうち、テンプレートに画面があるもの
const accountMenuDestinations: Record<string, AppDestination> = {
  アカウント設定: 'account',
  デベロッパー設定: 'developer',
}

const AccountMenu = ({ onFilled, defaultOpen }: { onFilled: boolean; defaultOpen: boolean }) => {
  const navigate = useContext(AppNavigationContext)
  return (
    <MenuTrigger defaultOpen={defaultOpen}>
      {/* トリガーはデプロイナウの AccountMenu（アバター＋「アカウント」＋下向きの山）。ゲーマーズはアバターのみ */}
      <Button
        appearance={onFilled ? 'white' : 'transparent'}
        size="s"
        leading={<Avatar src={avatarSrc} alt="" size="xs" />}
        trailing={<Icon name="chevron_down" size="s" />}
      >
        アカウント
      </Button>
      <Menu placement="bottom end">
        {accountMenuGroups.flatMap((group, index) => [
          ...(index > 0 ? [<MenuDivider key={`divider-${group[0]}`} />] : []),
          ...group.map((label) => (
            <MenuItem
              key={label}
              onAction={() => {
                const to = accountMenuDestinations[label]
                if (to) navigate?.(to)
              }}
            >
              {label}
            </MenuItem>
          )),
        ])}
      </Menu>
    </MenuTrigger>
  )
}

export const AppShell = ({
  active,
  appBar = 'white',
  nav = true,
  width = 'contained',
  defaultAccountMenuOpen = false,
  children,
}: {
  active: NavId
  /** AppBar の外観。filled のときは右側のボタンを white にして地色に乗せる */
  appBar?: AppBarProps['appearance']
  /** false にするとサイドナビを出さない。申し込みウィザードなど離脱させたくない画面向け */
  nav?: boolean
  /** wide は最大幅を外す。一覧やファイル管理など画面いっぱいに使う画面向け */
  width?: 'contained' | 'wide'
  /** true にするとユーザーメニューを開いた状態で描画する。開いた見た目を確かめる用 */
  defaultAccountMenuOpen?: boolean
  children: ReactNode
}) => (
  <Stack gap="l">
    {/* GAP-12: filled な AppBar の上でボタンを白くする知識が AppBar 側に無く、呼び出し側が持っている */}
    <AppBar appearance={appBar} position="relative">
      <AppBarLeading>
        <Stack flexDirection="row" gap="s" alignItems="center">
          <Logo />
          <Typography size="l" fontWeight="bold" component="span">
            サーバー管理
          </Typography>
        </Stack>
      </AppBarLeading>
      <AppBarTrailing>
        <AccountMenu onFilled={appBar === 'filled'} defaultOpen={defaultAccountMenuOpen} />
      </AppBarTrailing>
    </AppBar>

    <Main width={width}>
      {nav ? (
        <Grid spacing="l">
          <GridItem size={{ xxs: 12, m: 3, l: 2 }}>
            {/* GAP-14: SideNavigation に狭い画面での切り替えが無いので、モバイル幅では本文の上に積まれる。
                実アプリなら Drawer に入れるが、wip-ui に Drawer が無い。 */}
            <SideNavigation aria-label="メインナビゲーション">
              {navGroups.map((group) =>
                group.label ? (
                  <SideNavigationSection key={group.label} title={group.label}>
                    {group.items.map((item) => (
                      <NavItem key={item.id} item={item} active={active} />
                    ))}
                  </SideNavigationSection>
                ) : (
                  group.items.map((item) => <NavItem key={item.id} item={item} active={active} />)
                )
              )}
            </SideNavigation>
          </GridItem>
          <GridItem size={{ xxs: 12, m: 9, l: 10 }}>
            <Stack gap="l">{children}</Stack>
          </GridItem>
        </Grid>
      ) : (
        <Stack gap="l">{children}</Stack>
      )}
    </Main>
  </Stack>
)

const NavItem = ({ item, active }: { item: NavGroup['items'][number]; active: NavId }) => {
  const navigate = useContext(AppNavigationContext)
  return (
    <SideNavigationItem
      href="#"
      onPress={() => navigate?.(item.id)}
      isCurrent={item.id === active}
      leading={<Icon name={item.icon} size="s" />}
    >
      {item.label}
    </SideNavigationItem>
  )
}

const Main = ({ width, children }: { width: 'contained' | 'wide'; children: ReactNode }) =>
  width === 'wide' ? (
    // GAP-13: Container の「幅制限なし」と Stack の padding。inline style を当てない方針のため未対応で、本文が画面の端に接する。
    <main>{children}</main>
  ) : (
    <Container size="xl" component="main">
      {children}
    </Container>
  )

/**
 * ログイン前の画面用シェル。サイドナビを持たず、透明な AppBar と幅の狭い Container だけで構成する。
 * AppBar はロゴだけ。ゲーマーズの GlobalHeader（isLogin=false）はロゴのみで、デプロイナウのログイン前の画面には AppBar が無い。
 */
export const AuthShell = ({ children }: { children: ReactNode }) => (
  <Stack gap="xl">
    <AppBar appearance="transparent" position="relative">
      <AppBarLeading>
        <Stack flexDirection="row" gap="s" alignItems="center">
          <Logo />
          <Typography size="l" fontWeight="bold" component="span">
            サーバー管理
          </Typography>
        </Stack>
      </AppBarLeading>
    </AppBar>
    <Container size="xs" component="main">
      <Stack gap="l">{children}</Stack>
    </Container>
  </Stack>
)
