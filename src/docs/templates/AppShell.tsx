import { useState } from 'react'

import { AppBar, AppBarLeading, AppBarTrailing } from '../../AppBar'
import { Avatar } from '../../Avatar'
import { Button } from '../../Button'
import { Container } from '../../Container'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Paper } from '../../Paper'
import { Stack } from '../../Stack'
import { Typography } from '../../Typography'

import type { ReactNode } from 'react'
import type { AppBarProps } from '../../AppBar'
import type { IconName } from '../../Icon'

/**
 * ホスティング管理画面の共通シェル。
 * AppBar・サイドナビ・コンテンツ幅の 3 つを固定し、各画面はこの中身だけを書く。
 * トンマナを見直すときは、ここを変えれば全テンプレートに波及する。
 */

type NavId =
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
const navGroups: { label?: string; items: { id: NavId; label: string; icon: IconName }[] }[] = [
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

/**
 * GAP-9: Menu が無い。Backup の PseudoMenu と同じく、トリガーの直下に Paper を絶対配置で重ねている。
 * 外側のクリックや Esc で閉じない・矢印キーで項目を移れない・role="menu" にならない。
 */
const menuAnchorStyle = { position: 'relative' } as const // GAP-9
const menuPanelStyle = {
  position: 'absolute',
  top: '100%',
  right: 0,
  zIndex: 10,
  width: 200,
} as const // GAP-9

const AccountMenu = ({ onFilled, defaultOpen }: { onFilled: boolean; defaultOpen: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div style={menuAnchorStyle}>
      {/* トリガーはデプロイナウの AccountMenu（アバター＋「アカウント」＋下向きの山）。ゲーマーズはアバターのみ */}
      <Button
        appearance={onFilled ? 'white' : 'transparent'}
        size="s"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        leading={<Avatar src={avatarSrc} alt="" size="xs" />}
        trailing={<Icon name="chevron_down" size="s" />}
        onPress={() => setIsOpen((current) => !current)}
      >
        アカウント
      </Button>
      {isOpen && (
        <div style={menuPanelStyle}>
          <Paper elevation={3}>
            <Stack gap="xxs">
              {accountMenuGroups.map((group, index) => (
                <Stack key={group[0]} gap="xxs">
                  {index > 0 && <Divider />}
                  {group.map((label) => (
                    <Button
                      key={label}
                      appearance="transparent"
                      size="s"
                      width="full"
                      onPress={() => setIsOpen(false)}
                    >
                      {label}
                    </Button>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Paper>
        </div>
      )}
    </div>
  )
}

// GAP-13: Container の最大幅は xl（1440px）止まりで「幅制限なし」が無く、
// Stack にも padding が無い。ファイル管理のような全幅レイアウトは inline style で余白を作るしかない。
const wideStyle = { paddingInline: 24 }

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
  /** true にするとユーザーメニューを開いた状態で描画する。GAP-9 の代用で、開いた見た目を確かめる用 */
  defaultAccountMenuOpen?: boolean
  children: ReactNode
}) => (
  <Stack gap="l">
    {/* GAP-12: filled な AppBar の上でボタンを白くする知識が AppBar 側に無く、呼び出し側が持っている */}
    <AppBar appearance={appBar} position="relative">
      <AppBarLeading>
        <Stack flexDirection="row" gap="s" alignItems="center">
          <Icon name="pepapon" size="m" />
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
            {/* GAP-14: モバイル幅ではナビが全幅のボタン 7 個として縦に積まれる。
                実アプリなら Drawer に入れるが、wip-ui に Drawer / SideNavigation が無い。 */}
            <nav aria-label="メインメニュー">
              <Stack gap="m">
                {navGroups.map((group) => (
                  <Stack key={group.label ?? 'top'} gap="xxs">
                    {group.label && (
                      <Typography
                        size="xs"
                        fontWeight="bold"
                        color="medium_emphasis"
                        component="span"
                      >
                        {group.label}
                      </Typography>
                    )}
                    {group.items.map((item) => (
                      <Button
                        key={item.id}
                        appearance={item.id === active ? 'flat' : 'transparent'}
                        width="full"
                        leading={<Icon name={item.icon} size="s" />}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Stack>
                ))}
              </Stack>
            </nav>
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

const Main = ({ width, children }: { width: 'contained' | 'wide'; children: ReactNode }) =>
  width === 'wide' ? (
    <main style={wideStyle}>{children}</main>
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
          <Icon name="pepapon" size="m" />
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
