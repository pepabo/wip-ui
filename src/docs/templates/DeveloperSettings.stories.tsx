import { useState } from 'react'

import { Button, LinkButton } from '../../Button'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Paper } from '../../Paper'
import { SideNavigation, SideNavigationItem } from '../../SideNavigation'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Typography } from '../../Typography'
import { AppShell } from './AppShell'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { StickerColor } from '../../Sticker'
import type { TypographyColor } from '../../Typography'

/**
 * デプロイナウ（hosting-deploy-now/frontend）のデベロッパー設定を、ホスティング管理画面の中に写したもの。
 * - GitHub 連携（/settings/developer）: features/DeveloperSettings（index.tsx・model.ts・
 *   components/SettingsNav・components/GitHubDisconnectDialog）
 * - セッション（/settings/developer/sessions）: features/DeveloperSettings/features/SessionSettings
 *   （index.tsx・model.ts・SessionDeleteDialog・SessionLogoutDialog）
 * 実物はアカウントメニューの「デベロッパー設定」から入る。ここでは AppShell の「アカウント」に置いている。
 */

const meta = {
  title: 'Templates/DeveloperSettings',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── GAP の回避策（inline style はここに集める） ───

// 節の面（実物は px-6 py-4）の余白は Paper の既定の padding（l）で付く（GAP-1 は解消）。
// GAP-NEW: 余白をとる部品が無い。面の中の読み込み中・取得失敗・空（実物は px-6 py-16）と、
//          未連携の案内（px-6 py-10）の広い上下の余白。inline style を当てない方針のため未対応。
// セッションの行（実物は py-3）の上下は、一覧の Stack の gap で付けている。

const DOT_COLOR: Record<StickerColor, TypographyColor> = {
  positive: 'positive',
  negative: 'negative',
  notice: 'notice',
  informative: 'informative',
  neutral: 'low_emphasis',
  attention: 'notice',
}

// GAP-NEW: StatusIndicator（色ドット + ラベル）が無い。Deploys.stories.tsx と同じ代用。
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

const LoadingBody = () => (
  <Stack alignItems="center">
    <Loader size="m" message="読み込み中" />
  </Stack>
)

const CenteredMessage = ({ message }: { message: string }) => (
  <Stack alignItems="center">
    <Typography component="div" size="s" color="low_emphasis">
      {message}
    </Typography>
  </Stack>
)

// GAP-NEW: 箇条書き（ul / li）の部品が無い。実物は ul.list-disc の中に Typography s。
const Bullets = ({ items }: { items: string[] }) => (
  <Stack gap="xxs">
    {items.map((item) => (
      <Typography component="div" key={item} size="s">
        ・{item}
      </Typography>
    ))}
  </Stack>
)

/** 項目名（xs）と値（s）を横に並べる行。実物は flex-wrap items-baseline gap-x-4。 */
const InlineFields = ({ fields }: { fields: { label: string; value: string }[] }) => (
  <Stack flexDirection="row" gap="m" alignItems="center">
    {fields.map((f) => (
      <Stack key={f.label} flexDirection="row" gap="m" alignItems="center">
        <Typography component="span" size="xs" color="medium_emphasis">
          {f.label}
        </Typography>
        <Typography component="span" size="s">
          {f.value}
        </Typography>
      </Stack>
    ))}
  </Stack>
)

// ─── 画面の枠（DeveloperSettings / SessionSettings の見出し + SettingsNav） ───

type SettingsPage = 'github' | 'sessions'

const NAV_ITEMS: { page: SettingsPage; label: string }[] = [
  { page: 'github', label: 'GitHub 連携' },
  { page: 'sessions', label: 'セッション' },
]

const SettingsLayout = ({
  current,
  onNavigate,
  children,
}: {
  current: SettingsPage
  onNavigate: (page: SettingsPage) => void
  children: ReactNode
}) => (
  <Stack gap="l">
    <Typography component="h1" size="xl" fontWeight="bold">
      デベロッパー設定
    </Typography>
    <Grid spacing="l">
      <GridItem size={{ xxs: 12, m: 3 }}>
        {/* components/SettingsNav。実物は next/link で各ページへ移動する */}
        <SideNavigation aria-label="デベロッパー設定">
          {NAV_ITEMS.map((item) => (
            <SideNavigationItem
              key={item.page}
              href="#"
              isCurrent={item.page === current}
              onPress={() => onNavigate(item.page)}
            >
              {item.label}
            </SideNavigationItem>
          ))}
        </SideNavigation>
      </GridItem>
      <GridItem size={{ xxs: 12, m: 9 }}>{children}</GridItem>
    </Grid>
  </Stack>
)

// ─── GitHub 連携（features/DeveloperSettings） ───

type Authorization = {
  githubUserLogin: string
  expiresAtLabel: string
}

type GitHubQueryState = 'ok' | 'loading' | 'unimplemented' | 'error'

const authorization: Authorization = {
  githubUserLogin: 'taro-dev',
  expiresAtLabel: '2026/11/02 18:30',
}

const GitHubConnectionBody = ({
  query,
  authorization,
  onDisconnect,
}: {
  query: GitHubQueryState
  authorization: Authorization | null
  onDisconnect: () => void
}) => {
  if (query === 'loading') return <LoadingBody />
  if (query === 'unimplemented')
    return <CenteredMessage message="GitHub 連携は現在利用できません。" />
  if (query === 'error') {
    return (
      <CenteredMessage message="GitHub 連携の取得に失敗しました。時間をおいて再度お試しください。" />
    )
  }
  if (authorization === null) {
    return (
      <Stack gap="s" alignItems="center">
        <Stack gap="xxs" alignItems="center">
          <Typography component="div" size="m" fontWeight="bold">
            連携している GitHub アカウントはありません。
          </Typography>
          <Typography component="div" size="s" color="medium_emphasis">
            GitHub と接続すると、リポジトリからプロジェクトを作成できます。
          </Typography>
        </Stack>
        <LinkButton href="#">GitHub と接続</LinkButton>
      </Stack>
    )
  }
  return (
    <Stack gap="s">
      <Stack flexDirection="row" gap="s" alignItems="center" justifyContent="space-between">
        <Stack gap="xxs">
          <Typography component="span" size="s" fontWeight="bold">
            {authorization.githubUserLogin}
          </Typography>
          <StatusIndicator color="positive">有効</StatusIndicator>
        </Stack>
        <Button appearance="transparent" color="negative" size="s" onPress={onDisconnect}>
          取り消す
        </Button>
      </Stack>
      <InlineFields fields={[{ label: '有効期限', value: authorization.expiresAtLabel }]} />
    </Stack>
  )
}

const GitHubDisconnectDialog = ({
  githubUserLogin,
  onClose,
}: {
  githubUserLogin: string
  onClose: () => void
}) => (
  <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
    {/* GAP-NEW: Dialog に幅の指定が無い。実物は w-[360px] に固定している */}
    <DialogHeader>
      {/* 実物は見出しの前に ⚠️ の絵文字（aria-hidden）を置いている。アイコンで代える */}
      <DialogTitle>
        <Stack flexDirection="row" gap="xs" alignItems="center">
          <Icon name="exclamation_on_triangle" aria-hidden />
          GitHub へのアクセスを取り消しますか？
        </Stack>
      </DialogTitle>
    </DialogHeader>
    <Stack gap="m">
      <DialogDescription>
        {`ロリポップ！デプロイナウが ${githubUserLogin} として GitHub にアクセスできなくなります。`}
      </DialogDescription>
      <Stack gap="xs">
        <Typography component="div" size="s" fontWeight="bold">
          できなくなること
        </Typography>
        <Bullets
          items={['リポジトリの一覧表示と、新しいリポジトリの接続', 'デプロイするブランチの変更']}
        />
        <Typography component="div" size="s" fontWeight="bold">
          変わらないこと
        </Typography>
        <Bullets items={['接続済みリポジトリの自動デプロイ', '公開中のサイト']} />
      </Stack>
      <Typography component="div" size="s" color="medium_emphasis">
        もう一度使うときは、あらためて GitHub と接続します。
      </Typography>
    </Stack>
    <DialogFooter>
      <Button appearance="outlined" color="neutral" size="m" onPress={onClose}>
        キャンセル
      </Button>
      <Button appearance="flat" color="negative" size="m" onPress={onClose}>
        アクセスを取り消す
      </Button>
    </DialogFooter>
  </Dialog>
)

const GitHubSettings = ({
  query,
  authorization,
  initialDialogOpen,
}: {
  query: GitHubQueryState
  authorization: Authorization | null
  initialDialogOpen: boolean
}) => {
  const [dialogOpen, setDialogOpen] = useState(initialDialogOpen)
  return (
    <>
      <Paper elevation={0} outlined>
        <Stack gap="m">
          <Typography component="h2" size="m" fontWeight="bold">
            GitHub 連携
          </Typography>
          <GitHubConnectionBody
            query={query}
            authorization={authorization}
            onDisconnect={() => setDialogOpen(true)}
          />
        </Stack>
      </Paper>
      {dialogOpen && authorization && (
        <GitHubDisconnectDialog
          githubUserLogin={authorization.githubUserLogin}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  )
}

// ─── セッション（features/DeveloperSettings/features/SessionSettings） ───

type Session = {
  id: string
  kindLabel: 'ブラウザ' | 'lolipop CLI' | '不明'
  current: boolean
  createdAtLabel: string
  expiresAtLabel: string
}

const sessionsData: Session[] = [
  {
    id: 's1',
    kindLabel: 'ブラウザ',
    current: true,
    createdAtLabel: '2026/11/02 09:41',
    expiresAtLabel: '2026/12/02 09:41',
  },
  {
    id: 's2',
    kindLabel: 'lolipop CLI',
    current: false,
    createdAtLabel: '2026/10/28 14:05',
    expiresAtLabel: '2027/01/26 14:05',
  },
  {
    id: 's3',
    kindLabel: 'ブラウザ',
    current: false,
    createdAtLabel: '2026/10/15 21:17',
    expiresAtLabel: '2026/11/14 21:17',
  },
]

type SessionsQueryState = 'ok' | 'loading' | 'error' | 'empty'

type SessionDialog = { kind: 'none' } | { kind: 'delete'; session: Session } | { kind: 'logout' }

const SessionDeleteDialog = ({ session, onClose }: { session: Session; onClose: () => void }) => (
  <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
    {/* GAP-NEW: Dialog に幅の指定が無い。実物は w-[360px] に固定している */}
    <DialogHeader>
      <DialogTitle>セッションを削除しますか？</DialogTitle>
    </DialogHeader>
    <DialogDescription>
      {`${session.kindLabel} のセッション（作成: ${session.createdAtLabel}）が失効し、その端末からのアクセスには再ログインが必要になります。`}
    </DialogDescription>
    <DialogFooter>
      <Button appearance="outlined" color="neutral" size="m" onPress={onClose}>
        キャンセル
      </Button>
      <Button appearance="flat" color="negative" size="m" onPress={onClose}>
        セッションを削除
      </Button>
    </DialogFooter>
  </Dialog>
)

const SessionLogoutDialog = ({ onClose }: { onClose: () => void }) => (
  <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
    <DialogHeader>
      <DialogTitle>ログアウトしますか？</DialogTitle>
    </DialogHeader>
    <DialogDescription>現在のセッションを失効させ、ログイン画面に戻ります。</DialogDescription>
    <DialogFooter>
      <Button appearance="outlined" color="neutral" size="m" onPress={onClose}>
        キャンセル
      </Button>
      {/* 実物は form POST（/api/auth/logout）でログイン画面へ戻る */}
      <Button appearance="flat" color="negative" size="m" onPress={onClose}>
        ログアウトする
      </Button>
    </DialogFooter>
  </Dialog>
)

const SessionRow = ({
  session,
  onDelete,
  onLogout,
}: {
  session: Session
  onDelete: () => void
  onLogout: () => void
}) => (
  <Stack flexDirection="row" gap="s" alignItems="center" justifyContent="space-between">
    <Stack gap="xxs">
      <Stack flexDirection="row" gap="xs" alignItems="center">
        <Typography component="span" size="s" fontWeight="bold">
          {session.kindLabel}
        </Typography>
        {session.current && (
          <Sticker color="informative" size="s">
            現在のセッション
          </Sticker>
        )}
      </Stack>
      <InlineFields
        fields={[
          { label: '作成', value: session.createdAtLabel },
          { label: '有効期限', value: session.expiresAtLabel },
        ]}
      />
    </Stack>
    {session.current ? (
      <Button appearance="transparent" color="negative" size="s" onPress={onLogout}>
        ログアウト
      </Button>
    ) : (
      <Button appearance="transparent" color="negative" size="s" onPress={onDelete}>
        削除
      </Button>
    )}
  </Stack>
)

const SessionSettings = ({
  query,
  initialDialog,
}: {
  query: SessionsQueryState
  initialDialog: SessionDialog
}) => {
  const sessions = query === 'empty' ? [] : sessionsData
  const [dialog, setDialog] = useState<SessionDialog>(initialDialog)
  return (
    <>
      <Paper elevation={0} outlined>
        <Stack gap="m">
          <Stack gap="xxs">
            <Typography component="h2" size="m" fontWeight="bold">
              セッション
            </Typography>
            <Typography component="div" size="s" color="medium_emphasis">
              ログイン中のブラウザと lolipop CLI
              の一覧です。心当たりのないセッションや使わなくなった端末のセッションは削除できます。
            </Typography>
          </Stack>
          {query === 'loading' ? (
            <LoadingBody />
          ) : query === 'error' ? (
            <CenteredMessage message="セッションの取得に失敗しました。時間をおいて再度お試しください。" />
          ) : sessions.length === 0 ? (
            <CenteredMessage message="有効なセッションはありません。" />
          ) : (
            <Stack gap="s">
              {sessions.map((s, i) => (
                <Stack key={s.id} gap="s">
                  {i > 0 && <Divider />}
                  <SessionRow
                    session={s}
                    onDelete={() => setDialog({ kind: 'delete', session: s })}
                    onLogout={() => setDialog({ kind: 'logout' })}
                  />
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>
      {dialog.kind === 'delete' && (
        <SessionDeleteDialog session={dialog.session} onClose={() => setDialog({ kind: 'none' })} />
      )}
      {dialog.kind === 'logout' && (
        <SessionLogoutDialog onClose={() => setDialog({ kind: 'none' })} />
      )}
    </>
  )
}

// ─── 画面 ───

const DeveloperSettingsScreen = ({
  initialPage = 'github',
  githubQuery = 'ok',
  connected = true,
  githubDialogOpen = false,
  sessionsQuery = 'ok',
  sessionDialog = { kind: 'none' },
}: {
  initialPage?: SettingsPage
  githubQuery?: GitHubQueryState
  connected?: boolean
  githubDialogOpen?: boolean
  sessionsQuery?: SessionsQueryState
  sessionDialog?: SessionDialog
}) => {
  const [page, setPage] = useState(initialPage)
  // ストーリーで指定したダイアログの段は最初の表示だけに使い、ページを行き来したら閉じた状態にする
  const [navigated, setNavigated] = useState(false)
  const navigate = (next: SettingsPage) => {
    setNavigated(true)
    setPage(next)
  }
  return (
    <AppShell active="account">
      <SettingsLayout current={page} onNavigate={navigate}>
        {page === 'github' ? (
          <GitHubSettings
            query={githubQuery}
            authorization={connected ? authorization : null}
            initialDialogOpen={!navigated && githubDialogOpen}
          />
        ) : (
          <SessionSettings
            query={sessionsQuery}
            initialDialog={navigated ? { kind: 'none' } : sessionDialog}
          />
        )}
      </SettingsLayout>
    </AppShell>
  )
}

// ─── ストーリー ───

/**
 * デベロッパー設定の GitHub 連携。連携中の GitHub アカウント・状態・有効期限と「取り消す」を出す。
 * 「取り消す」で確認ダイアログが開く。
 *
 * @summary GitHub 連携
 */
export const Default: Story = {
  render: () => <DeveloperSettingsScreen />,
}

/**
 * GitHub と連携していないとき。接続の導線を出す。
 *
 * @summary GitHub 未連携
 */
export const GitHubNotConnected: Story = {
  render: () => <DeveloperSettingsScreen connected={false} />,
}

/**
 * GitHub 連携の読み込み中、利用できない環境、取得失敗。
 *
 * @summary GitHub 連携の読み込み中・利用不可・取得失敗
 */
export const GitHubLoadingAndError: Story = {
  render: () => (
    <Stack gap="xxl">
      <DeveloperSettingsScreen githubQuery="loading" />
      <DeveloperSettingsScreen githubQuery="unimplemented" />
      <DeveloperSettingsScreen githubQuery="error" />
    </Stack>
  ),
}

/**
 * アクセスを取り消す確認ダイアログ。できなくなることと、変わらないことを分けて書く。
 *
 * @summary アクセスの取り消しの確認
 */
export const GitHubDisconnectConfirm: Story = {
  render: () => <DeveloperSettingsScreen githubDialogOpen />,
}

/**
 * セッションの一覧。ログイン中のブラウザと lolipop CLI を並べ、今のセッションには「現在のセッション」を付ける。
 * 今のセッションは「ログアウト」、ほかは「削除」。
 *
 * @summary セッション
 */
export const Sessions: Story = {
  render: () => <DeveloperSettingsScreen initialPage="sessions" />,
}

/**
 * セッションの読み込み中、取得失敗、有効なセッションが無いとき。
 *
 * @summary セッションの読み込み中・取得失敗・空
 */
export const SessionsLoadingErrorEmpty: Story = {
  render: () => (
    <Stack gap="xxl">
      <DeveloperSettingsScreen initialPage="sessions" sessionsQuery="loading" />
      <DeveloperSettingsScreen initialPage="sessions" sessionsQuery="error" />
      <DeveloperSettingsScreen initialPage="sessions" sessionsQuery="empty" />
    </Stack>
  ),
}

/**
 * セッションを削除する確認ダイアログ。どの端末のセッションかを種類と作成日時で示す。
 *
 * @summary セッションの削除の確認
 */
export const SessionDeleteConfirm: Story = {
  render: () => (
    <DeveloperSettingsScreen
      initialPage="sessions"
      sessionDialog={{ kind: 'delete', session: sessionsData[1] }}
    />
  ),
}

/**
 * 今のセッションの「ログアウト」を押したときの確認ダイアログ。
 *
 * @summary ログアウトの確認
 */
export const SessionLogout: Story = {
  render: () => (
    <DeveloperSettingsScreen initialPage="sessions" sessionDialog={{ kind: 'logout' }} />
  ),
}
