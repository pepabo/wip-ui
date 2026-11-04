// GAP-10: Tab が TabPanel を再エクスポートしていない
import { createContext, useContext } from 'react'
import { TabPanel } from 'react-aria-components'

import { AppBar, AppBarLeading, AppBarTrailing } from '../../AppBar'
import { Button } from '../../Button'
import { Container } from '../../Container'
import { Icon } from '../../Icon'
import { Menu, MenuDivider, MenuItem, MenuTrigger } from '../../Menu'
import { Paper } from '../../Paper'
import { SideNavigation, SideNavigationItem } from '../../SideNavigation'
import { Stack } from '../../Stack'
import { Tab, TabList, Tabs } from '../../Tab'
import { Typography } from '../../Typography'
import gamersLogo from './assets/gamers/gamers-logo.svg'
import { ServerDetailHeader, server } from './gameServer'
import { openStory, TemplateRouter } from './storyLink'

import type { ReactNode } from 'react'
import type { IconName } from '../../Icon'
import type { ServerStatus } from './gameServer'
import type { StoryRoute } from './storyLink'

/**
 * ゲーマーズ（apollo/frontend）の画面の枠。実物のレイアウトファイルの位置・順番・項目・文言を写している。
 *
 * - GamersShell: app/(application)/(private)/layout.tsx。GlobalHeader（ロゴ＋ユーザーメニュー）と main だけ。
 *   ホーム・アカウント・購入（servers/new）・更新（servers/(no_sidebar)/[id]/billing）はこの中に置く
 * - GamersServerShell: servers/[id]/layout.tsx。GlobalHeader の代わりに ServerListHeader（左にサーバー名の切り替え、
 *   右にユーザーメニュー）が出て、左に Sidebar（お知らせバナー → サーバー／バックアップ／支払い）
 * - ServerPageLayout: servers/[id]/(server)/layout.tsx（Container xl ＋ ServerDetailHeader）と
 *   ServerDetailTabPanels のタブ（詳細・ゲーム設定・MOD・ファイル管理）。バックアップは tab を渡さない（タブが無い）
 * - GamersPageContainer: 各 page.tsx の Container（maxWidth と上の余白）
 * - GamersPublicShell: app/(application)/(public)/layout.tsx。ロゴだけの GlobalHeader と main
 *
 * 画面を切り替える口: 各シェルの onNavigate、または枠を描かない GamersNavigationProvider。
 * onNavigate を渡さないシェルは外側のものを引き継ぐ。画面の中からは useGamersNavigate() で呼ぶ。
 * どこからも渡されない（App ストーリーの外で画面ごとのストーリーを開いた）ときは、
 * 行き先の画面のストーリーへ Storybook の中で移る（gamersStoryRoutes）。画面が無い行き先は何もしない。
 *
 * 行き先の名前 → 表示する画面（ストーリー）:
 * - 'home'                 ホーム（Templates/Gamers/Home Default）
 * - 'home-backups'         ホームのマイバックアップタブ（Home MyBackups。実物 /home?activeTab=myBackups）
 * - 'account'              アカウント（GamersAccount Default）
 * - 'account-update-email' メールアドレス変更（GamersAccount UpdateEmail）
 * - 'account-newsletter'   メール受信設定（GamersAccount NewsletterSettings）
 * - 'server'               サーバー画面の「詳細」タブ（Overview Default）
 * - 'server-game'          「ゲーム設定」タブ（GameSettings）
 * - 'server-mods'          「MOD」タブ（Mods Default）
 * - 'server-files'         「ファイル管理」タブ（FileManager Default）
 * - 'backup'               バックアップ（Backup Default）
 * - 'payment'              支払いの「詳細」タブ（GamersPayment Default）
 * - 'payment-history'      支払いの「履歴」タブ（GamersPayment History）
 * - 'payment-method-change' 支払い方法の変更ダイアログを開いた支払い（GamersPayment ChangePaymentMethod。実物 payment?payment_method_change_dialog=true）
 * - 'server-new'           申し込みのゲーム選択（Onboarding。実物 /servers/new/game-select）
 * - 'server-new-plan'      申し込みのプラン選択（/servers/new/plan-select）
 * - 'server-new-payment'   申し込みの支払い情報入力（/servers/new/payment-info）
 * - 'billing'              契約更新の購入（Renewal Default。実物 /servers/(no_sidebar)/[id]/billing）
 * - 'signup-complete'      アカウント作成完了（GamersAuth GamersSignupComplete）
 * - 'login' / 'login-authcode' / 'signup' / 'signup-authcode'  GamersAuth の各画面
 * - 'error'                エラー（GamersSystemPages GamersError）
 * - 'contact'              お問合せ（実物は Zendesk を別タブ）
 * - 'logout'               ログアウト（実物は /login へ）
 * - 'external'             サービスの外（ヘルプ記事・IdP・決済ページなど。別タブ）
 *
 * どの要素を押すとどこへ移るか:
 * - シェル: ユーザーメニュー「アカウント詳細」→ account、「お問合せ」→ contact、「ログアウト」→ logout /
 *   ServerListMenu のサーバー名 → server、「ホーム」→ home / Sidebar「サーバー」→ server、「バックアップ」→ backup、
 *   「支払い」→ payment / サーバー画面のタブ 詳細・ゲーム設定・MOD・ファイル管理 → server・server-game・server-mods・server-files
 * - Home: サーバーのカード（名前）→ server、「サーバーを追加」・契約が無いときの「申し込む」→ server-new
 *   （タブは画面の中の切り替え。鉛筆・バックアップ作成・復元・削除はダイアログ）
 * - Backup:「全てのゲームのバックアップを管理」→ home-backups（作成・復元・削除はダイアログ）
 * - Mods: MOD 追加の MOD 名・作者名 → external、MODパックの注意の「バックアップ」→ backup
 * - Overview・GameSettings・FileManager: 画面の外へ移る要素は無い（ダイアログか画面の中の操作）
 * - GamersPayment: タブ「詳細」→ payment、「履歴」→ payment-history（ほかはダイアログ）
 * - Onboarding: ゲームのカード → server-new-plan、「支払い情報入力へ」→ server-new-payment、
 *   注文内容の「変更」→ server-new-plan、「購入する」→ home（クーポン未適用のときは確認ダイアログ）、
 *   売り切れ「ホームへ」→ home、メンテナンス「お知らせへ」「トップ画面へ」→ external
 * - Renewal:「変更」→ payment-method-change、「購入する」→ external（PayPay）
 * - GamersAccount:「サーバー」→ home、メール「変更」→ account-update-email、受信設定「変更」→ account-newsletter、
 *   「連携」→ external、変更ページの「戻る」→ account（削除はダイアログ）
 * - GamersAuth: IdP ボタン → external、「ログインメールを送付する」→ login-authcode、外部アカウントのダイアログ「作成」→ signup-complete、
 *   「アカウント登録メールを送信」→ signup-authcode、新規登録の「ログイン」→ login、ログインの「認証」→ home、
 *   ログインの「メールを再送信」→ login、新規登録の「認証」→ signup-complete、新規登録の「メールを再送信」→ signup、
 *   「申し込み画面へ」→ server-new
 * - GamersSystemPages: エラー「お問い合わせ」→ external、「ホームへ」→ home、「サービストップへ」→ external、
 *   メンテナンス「トップへ」→ external
 *
 * 実物と違って残っている点:
 * - ヘッダーは実物では position='fixed'・地色 #1D2A40（紺）。ここでは relative の filled で、本文はその下に続く。
 *   地色はフレーバーの filled の色（lolipop では青）
 * - (public) の GMO グループのヘッダー（外部スクリプト、md 以上で高さ 28px）と PepaboFooter（外部スクリプト）は出していない
 * - Sidebar は実物では MUI の Drawer（幅 270px、md 未満ではハンバーガーから開く引き出し）。
 *   ここでは常設のみで、狭い幅では本文の上に積む。ハンバーガーも無い
 * - ServerListHeader の VESPY（AI アシスタント）のボタンとポッパーは出していない（フラグで出し分けている告知寄りの機能）
 * - ユーザーメニューの開くボタンは実物では MUI の Avatar（人のシルエット）。ここでは person のアイコンボタン
 * - お知らせバナーの「×」は実物では Card の右上（8px）に重ねて置かれる。ここでは題の行の右端に並ぶ。
 *   バナー全体がリンクではなく、地色（rgba(255,255,255,.05)）も無い。アイコンは LightbulbOutlined の代わりに info_on_circle
 * - Sidebar のアイコンは DnsOutlined / BackupOutlined / PaymentsOutlined の代わりに node / clock / bill。選択中の地色も実物（紫 16%）と違う
 * - ServerListMenu のボタンは実物では outlined・color inherit で、UnfoldMore の代わりに chevron_down。ほかのサーバーを選んでも行き先は同じ 'server'
 */

export type GamersDestination =
  // (private)
  | 'home'
  | 'home-backups'
  | 'account'
  | 'account-update-email'
  | 'account-newsletter'
  | 'contact'
  | 'logout'
  | 'server'
  | 'server-game'
  | 'server-mods'
  | 'server-files'
  | 'backup'
  | 'payment'
  | 'payment-history'
  | 'payment-method-change'
  | 'server-new'
  | 'server-new-plan'
  | 'server-new-payment'
  | 'billing'
  | 'signup-complete'
  // (public)
  | 'login'
  | 'login-authcode'
  | 'signup'
  | 'signup-authcode'
  | 'error'
  // 外部（別タブ。ヘルプ記事・サポートなど）
  | 'external'

type Navigate = (to: GamersDestination) => void

const GAMERS = 'Templates/Gamers'

/**
 * 行き先 → その画面のストーリー（title と export 名）。GamersApp もこの表で画面を切り替える。
 * 表に無い行き先（contact・external・logout）は画面が無い
 */
export const gamersStoryRoutes: Partial<Record<GamersDestination, StoryRoute>> = {
  // (public)
  login: { title: `${GAMERS}/Auth`, story: 'GamersLogin' },
  'login-authcode': { title: `${GAMERS}/Auth`, story: 'GamersLoginAuthcode' },
  signup: { title: `${GAMERS}/Auth`, story: 'GamersSignup' },
  'signup-authcode': { title: `${GAMERS}/Auth`, story: 'GamersSignupAuthcode' },
  error: { title: `${GAMERS}/SystemPages`, story: 'GamersError' },
  // (private)
  'signup-complete': { title: `${GAMERS}/Auth`, story: 'GamersSignupComplete' },
  home: { title: `${GAMERS}/Home`, story: 'Default' },
  'home-backups': { title: `${GAMERS}/Home`, story: 'MyBackups' },
  account: { title: `${GAMERS}/Account`, story: 'Default' },
  'account-update-email': { title: `${GAMERS}/Account`, story: 'UpdateEmail' },
  'account-newsletter': { title: `${GAMERS}/Account`, story: 'NewsletterSettings' },
  // servers/[id]
  server: { title: `${GAMERS}/Overview`, story: 'Default' },
  'server-game': { title: `${GAMERS}/GameSettings`, story: 'Default' },
  'server-mods': { title: `${GAMERS}/Mods`, story: 'Default' },
  'server-files': { title: `${GAMERS}/FileManager`, story: 'Default' },
  backup: { title: `${GAMERS}/Backup`, story: 'Default' },
  payment: { title: `${GAMERS}/Payment`, story: 'Default' },
  'payment-history': { title: `${GAMERS}/Payment`, story: 'History' },
  'payment-method-change': { title: `${GAMERS}/Payment`, story: 'ChangePaymentMethod' },
  // 購入・更新
  'server-new': { title: `${GAMERS}/Onboarding`, story: 'GameSelectStep' },
  'server-new-plan': { title: `${GAMERS}/Onboarding`, story: 'PlanSelectStep' },
  'server-new-payment': { title: `${GAMERS}/Onboarding`, story: 'PaymentInfoStep' },
  billing: { title: `${GAMERS}/Renewal`, story: 'Default' },
}

/** ログアウトはログイン画面へ移る（実物は signOut のあと /login へ replace） */
export const resolveGamersDestination = (to: GamersDestination): GamersDestination =>
  to === 'logout' ? 'login' : to

// App ストーリーの外（画面ごとのストーリー）では、行き先の画面のストーリーへ Storybook の中で移る
const navigateToStory: Navigate = (to) => openStory(gamersStoryRoutes[resolveGamersDestination(to)])

const NavigateContext = createContext<Navigate | undefined>(navigateToStory)
const useNavigate = () => useContext(NavigateContext)

// onNavigate を渡さなかったシェルは、外側（GamersNavigationProvider や外のシェル）の onNavigate を引き継ぐ
const NavigateScope = ({
  onNavigate,
  children,
}: {
  onNavigate?: Navigate
  children: ReactNode
}) => {
  const outer = useNavigate()
  return (
    <NavigateContext.Provider value={onNavigate ?? outer}>
      <TemplateRouter>{children}</TemplateRouter>
    </NavigateContext.Provider>
  )
}

/**
 * 画面の中から onNavigate を呼ぶための口。シェルの外（App ストーリーの外）では、行き先のストーリーへ移る関数を返す
 */
export const useGamersNavigate = (): Navigate => {
  const navigate = useNavigate()
  return (to) => navigate?.(to)
}

/**
 * 枠を描かずに onNavigate だけを渡す口。実物で fullScreen の Dialog（MOD 追加・ゲーム設定の編集など）が
 * ヘッダーとサイドバーごと画面を覆う画面で、枠の外から画面遷移を呼ぶときに使う
 */
export const GamersNavigationProvider = ({
  onNavigate,
  children,
}: {
  onNavigate?: Navigate
  children: ReactNode
}) => <NavigateScope onNavigate={onNavigate}>{children}</NavigateScope>

// ─── ヘッダー ───

/** components/GlobalHeader の Image（/gamers-logo.svg、230×60） */
const Logo = () => <img src={gamersLogo} alt="LOLIPOP! for Gamers" width={230} height={60} />

/** GlobalHeader・ServerListHeader のユーザーメニュー。項目は 3 つで区切りは無い */
const UserMenu = ({ defaultOpen = false }: { defaultOpen?: boolean }) => {
  const navigate = useNavigate()
  return (
    <MenuTrigger defaultOpen={defaultOpen}>
      {/* 実物の aria-label は 'account of current user' */}
      <Button appearance="white" iconOnly aria-label="アカウントメニュー">
        <Icon name="person" size="m" />
      </Button>
      <Menu placement="bottom end">
        <MenuItem onAction={() => navigate?.('account')}>アカウント詳細</MenuItem>
        <MenuItem onAction={() => navigate?.('contact')}>お問合せ</MenuItem>
        <MenuItem onAction={() => navigate?.('logout')}>ログアウト</MenuItem>
      </Menu>
    </MenuTrigger>
  )
}

/** components/GlobalHeader。左にロゴ、ログイン後は右にユーザーメニュー */
const GlobalHeader = ({
  isLogin,
  defaultUserMenuOpen,
}: {
  isLogin: boolean
  defaultUserMenuOpen?: boolean
}) => (
  <AppBar appearance="filled" position="relative">
    <AppBarLeading>
      <Logo />
    </AppBarLeading>
    {isLogin && (
      <AppBarTrailing>
        <UserMenu defaultOpen={defaultUserMenuOpen} />
      </AppBarTrailing>
    )}
  </AppBar>
)

/** ServerListMenu に並ぶ契約中のサーバー（ダミー） */
const serverList = [
  { id: server.id, name: server.name },
  { id: 'sv-7b21d0a4', name: 'パル島' },
  { id: 'sv-c05e9f13', name: '週末7dtd' },
]

/**
 * servers/[id]/_components/ServerListMenu。今のサーバー名＋UnfoldMore のボタンで開き、
 * 契約中のサーバー → 区切り線 → 「ホーム」
 */
const ServerListMenu = ({ defaultOpen = false }: { defaultOpen?: boolean }) => {
  const navigate = useNavigate()
  return (
    <MenuTrigger defaultOpen={defaultOpen}>
      {/* 実物は variant='outlined' color='inherit' size='medium'。UnfoldMore に当たるアイコンが無いので chevron_down */}
      <Button appearance="white" trailing={<Icon name="chevron_down" size="s" />}>
        {server.name}
      </Button>
      <Menu placement="bottom start">
        {serverList.map((s) => (
          <MenuItem key={s.id} id={s.id} onAction={() => navigate?.('server')}>
            {s.name}
          </MenuItem>
        ))}
        <MenuDivider />
        <MenuItem id="home" onAction={() => navigate?.('home')}>
          ホーム
        </MenuItem>
      </Menu>
    </MenuTrigger>
  )
}

/** servers/[id]/_components/ServerListHeader。ロゴは無く、左端がサーバー名の切り替え */
const ServerListHeader = ({
  defaultServerMenuOpen,
  defaultUserMenuOpen,
}: {
  defaultServerMenuOpen?: boolean
  defaultUserMenuOpen?: boolean
}) => (
  <AppBar appearance="filled" position="relative">
    <AppBarLeading>
      <ServerListMenu defaultOpen={defaultServerMenuOpen} />
    </AppBarLeading>
    <AppBarTrailing>
      <UserMenu defaultOpen={defaultUserMenuOpen} />
    </AppBarTrailing>
  </AppBar>
)

// ─── (private) ───

/** (private)/layout.tsx。GlobalHeader の下に main */
export const GamersShell = ({
  onNavigate,
  defaultUserMenuOpen,
  children,
}: {
  onNavigate?: Navigate
  /** ユーザーメニューを開いた状態で描画する */
  defaultUserMenuOpen?: boolean
  children: ReactNode
}) => (
  <NavigateScope onNavigate={onNavigate}>
    <Stack gap="l">
      <GlobalHeader isLogin defaultUserMenuOpen={defaultUserMenuOpen} />
      <main>{children}</main>
    </Stack>
  </NavigateScope>
)

/**
 * 各 page.tsx の Container。MUI の maxWidth を Container の size に寄せている
 * - home/page.tsx: maxWidth='xl'、mt 2 → xl
 * - account/page.tsx: maxWidth='md'、mt 5 → m
 * - servers/new/layout.tsx・(no_sidebar)/[id]/billing: maxWidth 既定（lg）、mt 3 → l
 * - account/update-email など: maxWidth='sm' → s
 */
export const GamersPageContainer = ({
  maxWidth,
  children,
}: {
  maxWidth: 'xl' | 'lg' | 'md' | 'sm'
  children: ReactNode
}) => (
  <Container size={{ xl: 'xl', lg: 'l', md: 'm', sm: 's' }[maxWidth] as 'xl' | 'l' | 'm' | 's'}>
    {children}
  </Container>
)

// ─── servers/[id] ───

export type ServerSection = 'server' | 'backup' | 'payment'

/** servers/[id]/layout.tsx の menuItems */
const menuItems: { id: ServerSection; text: string; icon: IconName }[] = [
  // 実物のアイコンは DnsOutlined / BackupOutlined / PaymentsOutlined。当たるものが無いので近いもの
  { id: 'server', text: 'サーバー', icon: 'node' },
  { id: 'backup', text: 'バックアップ', icon: 'clock' },
  { id: 'payment', text: '支払い', icon: 'bill' },
]

/**
 * components/OnboardingBanner。Sidebar の一番上（リストの上）に 1 つだけ出る。
 * 実物は上から順に、閉じていない最初のもの:「{ゲーム名}を始めよう」→「MODかんたんインストール機能の紹介」
 */
const OnboardingBanner = ({ gameName }: { gameName: string }) => (
  // 実物は Card（mt 2, mx 2）の CardActionArea（p 1）。全体がヘルプ記事へのリンク（別タブ）
  <Paper padding="s">
    <Stack gap="xs">
      <Stack flexDirection="row" gap="s" alignItems="flex-start" justifyContent="space-between">
        <Stack flexDirection="row" gap="s" alignItems="center">
          {/* 実物は LightbulbOutlined。当たるアイコンが無いので info_on_circle */}
          <Icon name="info_on_circle" size="m" />
          <Typography size="s" fontWeight="bold" component="span">
            {`${gameName}を始めよう`}
          </Typography>
        </Stack>
        <Button appearance="transparent" size="s" iconOnly aria-label="閉じる">
          <Icon name="cross" size="s" />
        </Button>
      </Stack>
      <Typography size="s" component="span">
        サーバーを起動して接続までの方法をチェック👀 <Icon name="launch" size="s" />
      </Typography>
    </Stack>
  </Paper>
)

/** servers/[id]/_components/Sidebar */
const Sidebar = ({ active, gameName }: { active: ServerSection; gameName: string }) => {
  const navigate = useNavigate()
  return (
    <Stack gap="m">
      <OnboardingBanner gameName={gameName} />
      <SideNavigation aria-label="サーバーのメニュー">
        {menuItems.map((item) => (
          <SideNavigationItem
            key={item.id}
            href="#"
            onPress={() => navigate?.(item.id)}
            isCurrent={item.id === active}
            leading={<Icon name={item.icon} size="m" />}
          >
            {item.text}
          </SideNavigationItem>
        ))}
      </SideNavigation>
    </Stack>
  )
}

/**
 * servers/[id]/layout.tsx。ServerListHeader の下に、左 Sidebar（幅 270px）・右 main（px 3, py 3）
 */
export const GamersServerShell = ({
  active,
  game = server.game,
  onNavigate,
  defaultServerMenuOpen,
  defaultUserMenuOpen,
  children,
}: {
  /** Sidebar の現在地 */
  active: ServerSection
  /** お知らせバナーに出すゲームの表示名 */
  game?: string
  onNavigate?: Navigate
  /** サーバー名の切り替えメニューを開いた状態で描画する */
  defaultServerMenuOpen?: boolean
  /** ユーザーメニューを開いた状態で描画する */
  defaultUserMenuOpen?: boolean
  children: ReactNode
}) => (
  <NavigateScope onNavigate={onNavigate}>
    <Stack gap="l">
      <ServerListHeader
        defaultServerMenuOpen={defaultServerMenuOpen}
        defaultUserMenuOpen={defaultUserMenuOpen}
      />
      <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="l">
        <SidebarFrame>
          <Sidebar active={active} gameName={game} />
        </SidebarFrame>
        <MainFrame>{children}</MainFrame>
      </Stack>
    </Stack>
  </NavigateScope>
)

// 実物の Drawer の紙面（幅 270px）。固定幅の段組みが wip-ui に無いので、ここだけ div で幅を決める。
// 紙面の地色・右の境界線は出していない
const SidebarFrame = ({ children }: { children: ReactNode }) => (
  <div style={{ flex: '0 0 270px', maxWidth: '100%' }}>{children}</div>
)

// 実物の main（flexGrow 1）。残りの幅を埋める段組みが wip-ui に無いので div で伸ばす
const MainFrame = ({ children }: { children: ReactNode }) => (
  <main style={{ flex: '1 1 0', minWidth: 0 }}>{children}</main>
)

// ─── servers/[id]/(server) ───

/** ServerDetailTabPanels のタブ（ActiveTab） */
export type ServerTab = 'detail' | 'gameManager' | 'modManager' | 'fileManager'

const tabDestination: Record<ServerTab, GamersDestination> = {
  detail: 'server',
  gameManager: 'server-game',
  modManager: 'server-mods',
  fileManager: 'server-files',
}

/**
 * (server)/_components/ServerDetailTabPanels のタブの並び。表示条件は実物のまま:
 * - ゲーム設定: 契約が ACTIVE で、ゲームが判明しているとき
 * - MOD: Minecraft (Java版) で、サーバーの種類が VANILLA / 未指定でなく、状態が UNKNOWN でなく、フラグが ON のとき
 * - ファイル管理: メンテナンス中（gamers_file-manager-maintenance）でないとき
 */
const ServerDetailTabs = ({
  tab,
  showGameManager,
  showModManager,
  showFileManager,
  children,
}: {
  tab: ServerTab
  showGameManager: boolean
  showModManager: boolean
  showFileManager: boolean
  children: ReactNode
}) => {
  const navigate = useNavigate()
  return (
    <Tabs
      selectedKey={tab}
      onSelectionChange={(key) => navigate?.(tabDestination[key as ServerTab])}
    >
      {/* 各タブの中身は Box mt 2 ＋ Stack spacing 3 */}
      <Stack gap="m">
        {/* 実物の aria-label は 'basic tabs example' */}
        <TabList aria-label="サーバー">
          <Tab id="detail">詳細</Tab>
          {showGameManager && <Tab id="gameManager">ゲーム設定</Tab>}
          {showModManager && <Tab id="modManager">MOD</Tab>}
          {showFileManager && <Tab id="fileManager">ファイル管理</Tab>}
        </TabList>
        <TabPanel id={tab}>
          <Stack gap="l">{children}</Stack>
        </TabPanel>
      </Stack>
    </Tabs>
  )
}

/**
 * (server)/layout.tsx（Container maxWidth='xl' ＋ ServerDetailHeader）と、その下のタブ。
 * tab を渡さないとタブを出さない（backup/page.tsx。Stack mt 4 gap 4）。
 * 復元中（RESTORING）は page.tsx がタブごと Alert に置き換えるので、タブを出さず children だけを出す
 */
export const ServerPageLayout = ({
  status,
  game = server.game,
  tab,
  showGameManager = true,
  showModManager = game === 'Minecraft (Java版)',
  showFileManager = true,
  children,
}: {
  status: ServerStatus
  /** ゲームの表示名（GameDisplayNames） */
  game?: string
  /** 表示中のタブ。省略するとタブを出さない */
  tab?: ServerTab
  /** ゲーム設定のタブを出す */
  showGameManager?: boolean
  /** MOD のタブを出す。既定は Minecraft (Java版) のとき */
  showModManager?: boolean
  /** ファイル管理のタブを出す */
  showFileManager?: boolean
  children: ReactNode
}) => (
  <Container size="xl">
    <Stack gap={tab ? 'm' : 'xl'}>
      <ServerDetailHeader status={status} game={game} />
      {tab && status !== 'RESTORING' ? (
        <ServerDetailTabs
          tab={tab}
          showGameManager={showGameManager}
          showModManager={showModManager}
          showFileManager={showFileManager}
        >
          {children}
        </ServerDetailTabs>
      ) : (
        <Stack gap="xl">{children}</Stack>
      )}
    </Stack>
  </Container>
)

// ─── (public) ───

/** (public)/layout.tsx。ロゴだけの GlobalHeader と main（pb 6〜8） */
export const GamersPublicShell = ({
  onNavigate,
  children,
}: {
  onNavigate?: Navigate
  children: ReactNode
}) => (
  <NavigateScope onNavigate={onNavigate}>
    <Stack gap="l">
      <GlobalHeader isLogin={false} />
      <main>{children}</main>
    </Stack>
  </NavigateScope>
)
