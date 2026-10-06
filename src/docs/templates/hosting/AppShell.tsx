import { AppBar, AppBarLeading, AppBarTrailing } from '../../../AppBar'
import { Avatar } from '../../../Avatar'
import { Button } from '../../../Button'
import { Container } from '../../../Container'
import { Grid, GridItem } from '../../../Grid'
import { Icon } from '../../../Icon'
import { Stack } from '../../../Stack'
import { Typography } from '../../../Typography'

import type { ReactNode } from 'react'
import type { AppBarProps } from '../../../AppBar'
import type { IconName } from '../../../Icon'

/**
 * ホスティング管理画面の共通シェル。
 * AppBar・サイドナビ・コンテンツ幅の 3 つを固定し、各画面はこの中身だけを書く。
 * トンマナを見直すときは、ここを変えれば全テンプレートに波及する。
 */

export type NavId =
  | 'home'
  | 'overview'
  | 'domains'
  | 'site'
  | 'files'
  | 'usage'
  | 'backup'
  | 'billing'
  | 'account'

const navItems: { id: NavId; label: string; icon: IconName }[] = [
  { id: 'home', label: 'ホーム', icon: 'home' },
  { id: 'overview', label: 'サーバー概要', icon: 'node' },
  { id: 'domains', label: 'ドメイン・SSL', icon: 'launch' },
  { id: 'site', label: 'サイト設定', icon: 'gear' },
  { id: 'files', label: 'ファイル管理', icon: 'folder' },
  { id: 'usage', label: '使用量', icon: 'parameters' },
  { id: 'backup', label: 'バックアップ', icon: 'clock' },
  { id: 'billing', label: '契約・お支払い', icon: 'bill' },
  { id: 'account', label: 'アカウント', icon: 'person' },
]

// GAP-6: Avatar が img 専用のため、頭文字を SVG のデータ URI にして渡す。
// この 2 色だけはトークンではなく生の hex で、テンプレート層で唯一の例外。
export const initialAvatar = (initial: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#c7cbd3"/><text x="20" y="25" font-family="sans-serif" font-size="16" text-anchor="middle" fill="#393c41">${initial}</text></svg>`
  )}`

export const avatarSrc = initialAvatar('山')

const appBarActions: { label: string; icon: IconName }[] = [
  { label: 'お知らせ', icon: 'bell' },
  { label: 'ヘルプ', icon: 'question_on_circle' },
]

// GAP-13: Container の最大幅は xl（1440px）止まりで「幅制限なし」が無く、
// Stack にも padding が無い。ファイル管理のような全幅レイアウトは inline style で余白を作るしかない。
const wideStyle = { paddingInline: 24 }

export const AppShell = ({
  active,
  appBar = 'white',
  nav = true,
  width = 'contained',
  children,
}: {
  active: NavId
  /** AppBar の外観。filled のときは右側のボタンを white にして地色に乗せる */
  appBar?: AppBarProps['appearance']
  /** false にするとサイドナビを出さない。申し込みウィザードなど離脱させたくない画面向け */
  nav?: boolean
  /** wide は最大幅を外す。一覧やファイル管理など画面いっぱいに使う画面向け */
  width?: 'contained' | 'wide'
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
        <Stack flexDirection="row" gap="xs" alignItems="center">
          {appBarActions.map((action) => (
            <Button
              key={action.label}
              appearance={appBar === 'filled' ? 'white' : 'transparent'}
              size="s"
              iconOnly
              aria-label={action.label}
            >
              <Icon name={action.icon} size="m" />
            </Button>
          ))}
          <Avatar src={avatarSrc} alt="山田 太郎" size="s" />
        </Stack>
      </AppBarTrailing>
    </AppBar>

    <Main width={width}>
      {nav ? (
        <Grid spacing="l">
          <GridItem size={{ xxs: 12, m: 3, l: 2 }}>
            {/* GAP-14: モバイル幅ではナビが全幅のボタン 7 個として縦に積まれる。
                実アプリなら Drawer に入れるが、wip-ui に Drawer / SideNavigation が無い。 */}
            <nav aria-label="メインメニュー">
              <Stack gap="xxs">
                {navItems.map((item) => (
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
      <AppBarTrailing>
        <Button appearance="transparent" size="s" trailing={<Icon name="launch" size="s" />}>
          ヘルプ
        </Button>
      </AppBarTrailing>
    </AppBar>
    <Container size="xs" component="main">
      <Stack gap="l">{children}</Stack>
    </Container>
  </Stack>
)
