import { createContext, useContext } from 'react'

import { AppBar, AppBarLeading, AppBarTrailing } from '../../AppBar'
import { Button, LinkButton } from '../../Button'
import { Callout } from '../../Callout'
import { Container } from '../../Container'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Menu, MenuDivider, MenuItem, MenuTrigger } from '../../Menu'
import { Paper } from '../../Paper'
import { SideNavigation, SideNavigationItem } from '../../SideNavigation'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Tab, TabList, Tabs } from '../../Tab'
import { Typography } from '../../Typography'
import deployNowLogo from './assets/deploy-now/logo.svg'
import { TextLink } from './parts'
import { openStory, TemplateRouter } from './storyLink'

import type { ReactNode } from 'react'
import type { StoryRoute } from './storyLink'

/**
 * デプロイナウ（hosting-deploy-now/frontend）の画面の枠。実物のレイアウトをそのまま写す。
 * デプロイナウにはサイドナビが無い。ヘッダー（AppBar）の下に、幅 1000px の本文が 1 列で置かれる。
 *
 * - DeployNowShell: app/(dashboard)/(application)/(private)/layout.tsx。ロゴ（左）と AccountMenu（右）の AppBar
 * - DeployNowStartShell: app/(dashboard)/(application)/start/layout.tsx。ログイン前のお試し。
 *   AppBar の右が「ドキュメント」「ログイン」「無料ではじめる」になる
 * - DeployNowBareShell: app/(dashboard)/layout.tsx と app/not-found.tsx。AppBar の無い画面
 *   （ログイン・新規登録・メンテナンス・404）
 * - ProjectDetailLayout: features/Project/index.tsx。パンくず・停止のお知らせ・ProjectHero・
 *   自動デプロイ停止のお知らせ・タブ（デプロイ / 環境変数 / ドメイン / 設定）
 * - DeveloperSettingsLayout: features/DeveloperSettings（index.tsx・components/SettingsNav）。
 *   見出し「デベロッパー設定」と左のメニュー（GitHub 連携 / セッション）
 *
 * 行き先の名前（onNavigate に渡す値）と、その画面のストーリー:
 * - projects: プロジェクト一覧 /projects（Projects/Default）
 * - project-deploys: プロジェクト詳細「デプロイ」タブ /projects/[id]（Deploys/Default）
 * - project-env: 「環境変数」タブ（SiteSettings/EnvVars）
 * - project-domains: 「ドメイン」タブ（Domains/Default）
 * - project-settings: 「設定」タブ（SiteSettings/Default）
 * - deploy-detail: デプロイ詳細 /projects/[id]/deploys/[deployId]（Deploys/DeployDetailSucceeded）
 * - new-project: プロジェクトを作成 /projects/new（NewProject/UploadProject）
 * - new-project-github: GitHub リポジトリをインポート /projects/new/github（NewProject/GitHubImport）
 * - project-deployment-new: 新しいバージョンをデプロイ /projects/[id]/deployment/new（NewProject/ProjectDeployment）
 * - developer-github: デベロッパー設定 /settings/developer（DeveloperSettings/Default）
 * - developer-sessions: /settings/developer/sessions（DeveloperSettings/Sessions）
 * - start: お試し /start（NewProject/Trial）
 * - login: ログイン /login（DeployNowAuth/DeployNowLogin。本番は lolipop のログイン入口へ転送される）
 * - signup: 新規登録 /signup（DeployNowAuth/DeployNowSignup）
 * - テンプレートに画面が無い行き先: account-settings（lolipop-user のアカウント画面）、docs / faq / info（別タブ）、
 *   logout（ログアウト後はログインへ）、github-installation（GitHub の App の設定・install 画面）、
 *   lolipop-signup（lolipop-www の申し込み入口）
 *
 * どの要素を押すとどこへ移るか:
 * - 枠: ロゴ → projects（/start ではロゴ → start）／アカウントメニュー: アカウント設定 → account-settings、
 *   デベロッパー設定 → developer-github、ドキュメント → docs、よくある質問 → faq、お知らせ → info、ログアウト → logout
 * - /start の AppBar: ドキュメント → docs、ログイン → login、無料ではじめる → signup
 * - ProjectDetailLayout: パンくず「プロジェクト」→ projects、タブ → project-deploys / project-env /
 *   project-domains / project-settings、ProjectHero の最終デプロイ・公開日時 → deploy-detail、
 *   プランをアップグレード（停止中）→ account-settings
 * - DeveloperSettingsLayout: GitHub 連携 → developer-github、セッション → developer-sessions
 * - Projects: 行（プロジェクト名）→ project-deploys、+ 新規作成・プロジェクトを作成 → new-project、
 *   プラン管理 → account-settings
 * - Deploys: 新しいバージョンをデプロイ → project-deployment-new、デプロイの行 → deploy-detail／
 *   デプロイ詳細: パンくず「プロジェクト」→ projects、パンくずのプロジェクト名・← プロジェクトに戻る → project-deploys、
 *   再デプロイ → 確認ダイアログ、ダイアログの再デプロイ → deploy-detail（新しいデプロイ）
 * - SiteSettings（設定）: 削除 → 確認ダイアログ、ダイアログの削除 → projects、
 *   リポジトリ接続ダイアログの「リポジトリの選択を変更」→ github-installation
 * - DeveloperSettings: GitHub と接続 → new-project-github（OAuth の往復のあと戻る先）、
 *   取り消す・削除・ログアウト → 確認ダイアログ、ダイアログのログアウトする → logout
 * - NewProject（作成）: GitHub と接続 → new-project-github、ファイル・フォルダ → 同じ画面でフォームに切り替え、
 *   キャンセル → 方法の選択に戻る、デプロイ → deploy-detail
 * - NewProject（GitHub）: インポート → 同じ画面でフォームに切り替え、別のリポジトリを選ぶ → 一覧に戻る、
 *   デプロイ → project-deploys、GitHub と接続 → new-project-github、
 *   リポジトリを追加・アカウント追加・リポジトリの選択を変更 → github-installation
 * - NewProject（お試し）: 無料ではじめる → signup、ログイン → login、ドロップ → 登録を促すダイアログ
 *   （ダイアログの無料ではじめる → signup）
 * - DeployNowAuth: Dex でログイン → projects、ロリポップ！ID で新規登録 → lolipop-signup、ログイン → login
 * - DeployNowSystemPages: トップページへ戻る・トップへ戻る → projects
 * - 呼ばないもの: 公開サイト・GitHub のリポジトリ／コミット・ムームードメイン・AI ゲートウェイ・コンテストなど
 *   本文中の外部リンク（別タブで開くだけで、管理画面の中は移らない）
 */

export type DeployNowDestination =
  | 'projects'
  | 'project-deploys'
  | 'project-env'
  | 'project-domains'
  | 'project-settings'
  | 'deploy-detail'
  | 'new-project'
  | 'new-project-github'
  | 'project-deployment-new'
  | 'developer-github'
  | 'developer-sessions'
  | 'account-settings'
  | 'docs'
  | 'faq'
  | 'info'
  | 'logout'
  | 'github-installation'
  | 'lolipop-signup'
  | 'start'
  | 'login'
  | 'signup'

type Navigate = (to: DeployNowDestination) => void

const DEPLOY_NOW = 'Templates/DeployNow'

/**
 * 行き先 → その画面のストーリー（title と export 名）。上のコメントの一覧と同じで、DeployNowApp もこの表で画面を切り替える。
 * 表に無い行き先は、テンプレートに画面が無い
 */
export const deployNowStoryRoutes: Partial<Record<DeployNowDestination, StoryRoute>> = {
  projects: { title: `${DEPLOY_NOW}/Projects`, story: 'Default' },
  'project-deploys': { title: `${DEPLOY_NOW}/Deploys`, story: 'Default' },
  'project-env': { title: `${DEPLOY_NOW}/SiteSettings`, story: 'EnvVars' },
  'project-domains': { title: `${DEPLOY_NOW}/Domains`, story: 'Default' },
  'project-settings': { title: `${DEPLOY_NOW}/SiteSettings`, story: 'Default' },
  'deploy-detail': { title: `${DEPLOY_NOW}/Deploys`, story: 'DeployDetailSucceeded' },
  'new-project': { title: `${DEPLOY_NOW}/NewProject`, story: 'UploadProject' },
  'new-project-github': { title: `${DEPLOY_NOW}/NewProject`, story: 'GitHubImport' },
  'project-deployment-new': { title: `${DEPLOY_NOW}/NewProject`, story: 'ProjectDeployment' },
  'developer-github': { title: `${DEPLOY_NOW}/DeveloperSettings`, story: 'Default' },
  'developer-sessions': { title: `${DEPLOY_NOW}/DeveloperSettings`, story: 'Sessions' },
  start: { title: `${DEPLOY_NOW}/NewProject`, story: 'Trial' },
  login: { title: `${DEPLOY_NOW}/Auth`, story: 'DeployNowLogin' },
  signup: { title: `${DEPLOY_NOW}/Auth`, story: 'DeployNowSignup' },
}

/** ログアウトするとログインの画面へ戻る */
export const resolveDeployNowDestination = (to: DeployNowDestination): DeployNowDestination =>
  to === 'logout' ? 'login' : to

// App ストーリーの外（画面ごとのストーリー）では、行き先の画面のストーリーへ Storybook の中で移る
const navigateToStory: Navigate = (to) =>
  openStory(deployNowStoryRoutes[resolveDeployNowDestination(to)])

/**
 * 画面を切り替える口。シェルの onNavigate を、シェルの中のレイアウト（タブ・左メニューなど）へ渡す。
 * App ストーリーからは、シェルの onNavigate か、この Provider のどちらで渡してもよい。
 * どちらも無い（画面ごとのストーリー）ときは、行き先の画面のストーリーへ移る
 */
export const DeployNowNavigationContext = createContext<Navigate | null>(navigateToStory)

export const useDeployNowNavigate = (): Navigate => {
  const navigate = useContext(DeployNowNavigationContext)
  return (to) => navigate?.(to)
}

const NavigationScope = ({
  onNavigate,
  children,
}: {
  onNavigate?: Navigate
  children: ReactNode
}) => {
  const outer = useContext(DeployNowNavigationContext)
  return (
    <DeployNowNavigationContext.Provider value={onNavigate ?? outer}>
      <TemplateRouter>{children}</TemplateRouter>
    </DeployNowNavigationContext.Provider>
  )
}

// 実物のロゴは /logo.svg（390×54）を h-8 md:h-12（/start は h-7 md:h-12）・w-auto で出す。
// alt は (private) が「LOLIPOP! デプロイナウ」、/start が「ロリポップ！デプロイナウ」で、実物どおりに分ける。
// GAP-NEW: 画像の部品（Image）が無い。素の img で、高さを md（768px）の境で切り替える（clamp で 2 段階にしている）
const logoStyle = (small: number) =>
  ({
    display: 'block',
    width: 'auto',
    height: `clamp(${small}px, calc((100vw - 767px) * 9999), 48px)`,
  }) as const
const Logo = ({ alt, small }: { alt: string; small: number }) => (
  <img src={deployNowLogo} alt={alt} width={390} height={54} style={logoStyle(small)} />
)

// 本文の枠。実物は mx-auto max-w-[1000px] px-5 py-6 md:px-10 md:py-10。
// GAP: Container に 1000px の幅が無く、m（960px）を使う。左右の余白は Container が画面幅に応じて決めるので、
//      実物の px-5 md:px-10（20px / 40px）とは一致しない（狭い幅では 4px）。上の余白は AppBar との gap で取り、
//      下の余白は付けられない
const Main = ({ children }: { children: ReactNode }) => (
  <Container size="m" component="main">
    {children}
  </Container>
)

// ─── AccountMenu（app/(dashboard)/(application)/(private)/AccountMenu.tsx）───

const accountMenuGroups: { label: string; to: DeployNowDestination }[][] = [
  [
    { label: 'アカウント設定', to: 'account-settings' },
    { label: 'デベロッパー設定', to: 'developer-github' },
  ],
  [
    { label: 'ドキュメント', to: 'docs' },
    { label: 'よくある質問', to: 'faq' },
    { label: 'お知らせ', to: 'info' },
  ],
  [{ label: 'ログアウト', to: 'logout' }],
]

const AccountMenu = ({ defaultOpen }: { defaultOpen: boolean }) => {
  const navigate = useDeployNowNavigate()
  return (
    <MenuTrigger defaultOpen={defaultOpen}>
      {/* 実物のトリガーは native button。灰色の丸（bg-neutral-200・28px）に person のアイコン、
          太字の「アカウント」（Typography s bold）、下向きの山（Icon s currentColor）を gap-2 で並べる。
          GAP: Avatar が img 専用で、灰色の丸にアイコンを入れられない。アイコンだけを leading に置く。
          GAP: 実物は sm 未満で「アカウント」を隠す（hidden sm:inline）。表示/非表示のレスポンシブ指定が無く常に出す */}
      <Button
        appearance="transparent"
        size="s"
        aria-label="アカウント"
        leading={<Icon name="person" size="s" />}
        trailing={<Icon name="chevron_down" size="s" color="currentColor" />}
      >
        <Typography component="span" size="s" fontWeight="bold">
          アカウント
        </Typography>
      </Button>
      <Menu placement="bottom end">
        {accountMenuGroups.flatMap((group, index) => [
          ...(index > 0 ? [<MenuDivider key={`divider-${group[0].label}`} />] : []),
          ...group.map((item) => (
            <MenuItem key={item.label} onAction={() => navigate(item.to)}>
              {item.label}
            </MenuItem>
          )),
        ])}
      </Menu>
    </MenuTrigger>
  )
}

/** ログイン後の画面の枠（(private)/layout.tsx） */
export const DeployNowShell = ({
  onNavigate,
  defaultAccountMenuOpen = false,
  children,
}: {
  onNavigate?: Navigate
  /** true にするとアカウントメニューを開いた状態で描画する */
  defaultAccountMenuOpen?: boolean
  children: ReactNode
}) => (
  <NavigationScope onNavigate={onNavigate}>
    {/* 本文の上の余白は実物の py-6 md:py-10（24px / 40px）。md 以上の 40px は段階に無く xl（32px） */}
    <Stack gap={{ xxs: 'l', m: 'xl' }}>
      {/* 実物は sticky top-0 z-20 の div で包む */}
      <AppBar appearance="white">
        <AppBarLeading>
          <LogoLink to="projects" alt="LOLIPOP! デプロイナウ" small={32} />
        </AppBarLeading>
        <AppBarTrailing>
          <AccountMenu defaultOpen={defaultAccountMenuOpen} />
        </AppBarTrailing>
      </AppBar>
      <Main>{children}</Main>
    </Stack>
  </NavigationScope>
)

const LogoLink = ({ to, alt, small }: { to: DeployNowDestination; alt: string; small: number }) => {
  const navigate = useDeployNowNavigate()
  return (
    // 実物は next/link（flex items-center）でロゴを包む。GAP-NEW: 画像だけのリンクの部品が無く、素の a で包む
    <a
      href={to === 'start' ? '/start' : '/projects'}
      style={logoLinkStyle}
      onClick={(event) => {
        event.preventDefault()
        navigate(to)
      }}
    >
      <Logo alt={alt} small={small} />
    </a>
  )
}

const logoLinkStyle = { display: 'flex', alignItems: 'center' } as const

/** ログイン前のお試しの枠（start/layout.tsx） */
export const DeployNowStartShell = ({
  onNavigate,
  children,
}: {
  onNavigate?: Navigate
  children: ReactNode
}) => (
  <NavigationScope onNavigate={onNavigate}>
    {/* 本文の上の余白は実物の py-6 md:py-10（24px / 40px）。md 以上の 40px は段階に無く xl（32px） */}
    <Stack gap={{ xxs: 'l', m: 'xl' }}>
      <AppBar appearance="white">
        <AppBarLeading>
          <LogoLink to="start" alt="ロリポップ！デプロイナウ" small={28} />
        </AppBarLeading>
        <AppBarTrailing>
          <StartActions />
        </AppBarTrailing>
      </AppBar>
      <Main>{children}</Main>
    </Stack>
  </NavigationScope>
)

const StartActions = () => {
  const navigate = useDeployNowNavigate()
  return (
    // 実物は flex gap-1。sm 未満は「ドキュメント」「ログイン」を隠す。
    // GAP: 表示/非表示のレスポンシブ指定が無く、常に出す。そのため 390px 幅では AppBar が 2 段に折り返す
    <Stack flexDirection="row" gap="xxs" alignItems="center">
      <LinkButton
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        appearance="transparent"
        size="s"
        onPress={() => navigate('docs')}
      >
        {/* 実物は trailing を使わず、children の span（flex items-center gap-0.5）に文字と Icon を並べる。
            GAP: Stack の gap に 2px（gap-0.5）が無く、xxs（4px）にしている */}
        <Stack flexDirection="row" gap="xxs" alignItems="center">
          ドキュメント
          <Icon name="launch" size="s" color="currentColor" />
        </Stack>
      </LinkButton>
      <LinkButton href="#" appearance="transparent" size="s" onPress={() => navigate('login')}>
        ログイン
      </LinkButton>
      <LinkButton
        href="#"
        appearance="flat"
        color="neutral"
        size="s"
        onPress={() => navigate('signup')}
      >
        無料ではじめる
      </LinkButton>
    </Stack>
  )
}

/**
 * AppBar の無い画面の枠（ログイン・新規登録・メンテナンス・404）。
 * 実物のカードの画面は main に min-h-[calc(100vh-3rem)] の中央寄せ・px-4 py-10 で、中に w-full max-w-sm（384px）の
 * カードを置く。404（app/not-found.tsx）は main に min-height: 100dvh・中央寄せ・padding 2.5rem 1rem を inline style で当てる。
 * GAP-NEW: 画面の高さに合わせて中身を縦横の中央に置く枠が無い。素の main と div に style を当てている
 */
const bareMainStyle = (kind: 'card' | 'not-found') =>
  ({
    minHeight: kind === 'card' ? 'calc(100vh - 3rem)' : '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: kind === 'card' ? '40px 16px' : '2.5rem 1rem',
  }) as const
const cardColumnStyle = { width: '100%', maxWidth: 384 } as const

export const DeployNowBareShell = ({
  onNavigate,
  kind = 'card',
  children,
}: {
  onNavigate?: Navigate
  /** card: ログイン・新規登録・メンテナンスのカードの画面。not-found: 404 */
  kind?: 'card' | 'not-found'
  children: ReactNode
}) => (
  <NavigationScope onNavigate={onNavigate}>
    <main style={bareMainStyle(kind)}>
      {kind === 'card' ? <div style={cardColumnStyle}>{children}</div> : children}
    </main>
  </NavigationScope>
)

/**
 * features/Auth・Signup・Maintenance のカード（rounded-lg border border-neutral-200 bg-white p-8 shadow-sm）。
 * GAP: Paper は outlined にすると影が消えるので、枠線を選ぶ。枠線の色は実物の border-neutral-200 より濃い
 */
export const DeployNowCard = ({ children }: { children: ReactNode }) => (
  <Paper outlined padding="xl">
    <Stack gap="m" alignItems="center">
      {children}
    </Stack>
  </Paper>
)

// ─── プロジェクト詳細（features/Project/index.tsx）───

export type ProjectTab = 'deploys' | 'env' | 'domains' | 'settings'

const TABS: { key: ProjectTab; label: string }[] = [
  { key: 'deploys', label: 'デプロイ' },
  { key: 'env', label: '環境変数' },
  { key: 'domains', label: 'ドメイン' },
  { key: 'settings', label: '設定' },
]

const tabDestination: Record<ProjectTab, DeployNowDestination> = {
  deploys: 'project-deploys',
  env: 'project-env',
  domains: 'project-domains',
  settings: 'project-settings',
}

/** ProjectHero に出す値（features/Project/model.ts の ProjectDetail のうち、見出しに使うもの） */
export type ProjectHeroData = {
  name: string
  /** 停止中のときは見出しのピルが「停止中」になり、上に停止のお知らせが出る */
  suspension?: { title: string; description: string }
  /** 未発行は undefined（「ドメイン未発行」） */
  domain?: string
  /** 最終デプロイの日時。デプロイが無いときは「—」で、リンクにならない */
  lastDeployedAt: string
  latestDeployId?: string
  githubRepository?: string
  /** 今配信しているデプロイ。無いときは見出しのピルが「未公開」 */
  serving?: {
    deployId: string
    deployedAt: string
    source:
      | { kind: 'upload' }
      | { kind: 'git'; branch: string; shortSha: string; commitMessage: string }
  }
}

/** Deploys・Domains・SiteSettings で共通に使う portfolio（値はダミー） */
export const portfolioHero: ProjectHeroData = {
  name: 'portfolio',
  domain: 'portfolio.lolipop-now.app',
  lastDeployedAt: '3分前',
  latestDeployId: 'd1',
  githubRepository: 'example-inc/portfolio',
  serving: {
    deployId: 'd1',
    deployedAt: '3分前',
    source: {
      kind: 'git',
      branch: 'main',
      shortSha: '8f21a3c',
      commitMessage: '画像の遅延読み込みを有効にする',
    },
  },
}

const MetaRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <Stack gap="xxs">
    <Typography size="xs" color="medium_emphasis" component="span">
      {label}
    </Typography>
    {children}
  </Stack>
)

const heroStatus = (
  hero: ProjectHeroData
): { label: string; color: 'negative' | 'positive' | 'neutral' } => {
  if (hero.suspension) return { label: '停止中', color: 'negative' }
  if (hero.serving) return { label: '稼働中', color: 'positive' }
  return { label: '未公開', color: 'neutral' }
}

/** components/ProjectHero。カード枠を持たず地に直接置く */
const ProjectHero = ({
  hero,
  onOpenDeploy,
}: {
  hero: ProjectHeroData
  onOpenDeploy: (deployId: string) => void
}) => {
  const status = heroStatus(hero)
  const latestDeployId = hero.latestDeployId
  return (
    <Stack gap="m">
      <Stack gap="xs">
        <Stack flexDirection="row" gap="s" alignItems="center">
          <Typography size="xxl" fontWeight="bold" component="h1">
            {hero.name}
          </Typography>
          <Sticker color={status.color} size="s">
            {status.label}
          </Sticker>
        </Stack>
        {hero.domain ? (
          <TextLink href={`https://${hero.domain}`} external>
            {hero.domain}
          </TextLink>
        ) : (
          <Typography component="div" size="s" color="low_emphasis">
            ドメイン未発行
          </Typography>
        )}
      </Stack>
      <Stack gap="m">
        <MetaRow label="最終デプロイ">
          {latestDeployId ? (
            <TextLink
              href={`/projects/${hero.name}/deploys/${latestDeployId}`}
              onPress={() => onOpenDeploy(latestDeployId)}
            >
              {hero.lastDeployedAt}
            </TextLink>
          ) : (
            <Typography component="div" size="s">
              {hero.lastDeployedAt}
            </Typography>
          )}
        </MetaRow>
        {hero.githubRepository && (
          <MetaRow label="GitHub リポジトリ">
            <TextLink href={`https://github.com/${hero.githubRepository}`} external>
              {hero.githubRepository}
            </TextLink>
          </MetaRow>
        )}
        {hero.serving && (
          <>
            <MetaRow label="公開日時">
              <TextLink
                href={`/projects/${hero.name}/deploys/${hero.serving.deployId}`}
                onPress={() => onOpenDeploy(hero.serving?.deployId ?? '')}
              >
                {hero.serving.deployedAt}
              </TextLink>
            </MetaRow>
            <MetaRow label="ソース">
              <ServingSourceLine source={hero.serving.source} repository={hero.githubRepository} />
            </MetaRow>
          </>
        )}
      </Stack>
    </Stack>
  )
}

/** ProjectHero の ServingSourceLine。ブランチと短縮 SHA を「·」でつなぎ、コミット件名をリンクにする */
const ServingSourceLine = ({
  source,
  repository,
}: {
  source: NonNullable<ProjectHeroData['serving']>['source']
  repository?: string
}) =>
  source.kind === 'upload' ? (
    // 実物は Typography s（span・flex gap-1.5）の中に Icon（currentColor）と文字を並べる。
    // GAP: Stack の gap に 6px（gap-1.5）が無く、xs（8px）にしている
    <Stack flexDirection="row" gap="xs" alignItems="center">
      <Typography component="span" size="s">
        <Icon name="upload" size="s" color="currentColor" aria-hidden />
      </Typography>
      <Typography component="span" size="s">
        アップロード
      </Typography>
    </Stack>
  ) : (
    // 実物は Typography s medium_emphasis（span・flex-wrap gap-x-2 gap-y-1）。
    // GAP: Stack に折り返しの指定が無く、狭い幅でも 1 行のまま。コミット件名の line-clamp-1 も無い
    <Stack flexDirection="row" gap="xs" alignItems="center">
      <Typography component="span" size="s" color="medium_emphasis">
        <Icon name="github" size="s" color="currentColor" aria-hidden />
      </Typography>
      <Typography component="span" size="s" color="medium_emphasis">
        {`${source.branch} · ${source.shortSha}`}
      </Typography>
      <TextLink href={`https://github.com/${repository}/commit/${source.shortSha}`} external>
        {source.commitMessage || source.shortSha}
      </TextLink>
    </Stack>
  )

// 素の a の下線を消す（実物は Tailwind の preflight で下線が無い）
const plainLinkStyle = { textDecoration: 'none' } as const

/**
 * プロジェクト詳細の枠。上からパンくず・停止のお知らせ（停止中のみ）・ProjectHero・
 * 自動デプロイ停止のお知らせ（止めているときのみ）・タブ・タブの中身を、gap l で積む。
 */
export const ProjectDetailLayout = ({
  hero = portfolioHero,
  activeTab,
  autoDeployStopped = false,
  onOpenDeploy,
  children,
}: {
  hero?: ProjectHeroData
  activeTab: ProjectTab
  /** true のとき、ProjectAutoDeployNotice（GitHub への push による自動デプロイを停止しています）を出す */
  autoDeployStopped?: boolean
  /** ProjectHero の日時を押したとき。省略すると deploy-detail へ移動する */
  onOpenDeploy?: (deployId: string) => void
  children: ReactNode
}) => {
  const navigate = useDeployNowNavigate()
  const openDeploy = onOpenDeploy ?? (() => navigate('deploy-detail'))
  return (
    <Stack gap="l">
      {/* 実物は Breadcrumbs を使わず、nav（aria-label="パンくずリスト"・flex items-center gap-2）に
          Link > Typography s medium_emphasis、「/」（Typography s low_emphasis）、現在地（Typography s）を手で並べている。
          GAP-NEW: 文中のリンクが無いので素の a。実物の hover の下線は無い */}
      <nav aria-label="パンくずリスト">
        <Stack flexDirection="row" gap="xs" alignItems="center">
          <a
            href="/projects"
            style={plainLinkStyle}
            onClick={(event) => {
              event.preventDefault()
              navigate('projects')
            }}
          >
            <Typography component="span" size="s" color="medium_emphasis">
              プロジェクト
            </Typography>
          </a>
          <span aria-hidden>
            <Typography component="span" size="s" color="low_emphasis">
              /
            </Typography>
          </span>
          <Typography component="span" size="s">
            {hero.name}
          </Typography>
        </Stack>
      </nav>

      {/* components/ProjectSuspensionNotice */}
      {hero.suspension && (
        <Callout
          color="negative"
          action={
            <LinkButton
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              appearance="outlined"
              color="negative"
              size="s"
            >
              プランをアップグレード
            </LinkButton>
          }
        >
          {/* 実物は div（flex-col gap-1）に span.font-bold と span を並べ、文字の色と大きさは Callout から継ぐ。
              GAP: Typography に色を継ぐ指定が無い。太字の見出しは Typography にするしかなく、
              色が Callout の negative の文字色ではなく high_emphasis になる。説明は素の文字で Callout から継ぐ */}
          <Stack gap="xxs">
            <Typography component="span" size="s" fontWeight="bold">
              {hero.suspension.title}
            </Typography>
            {hero.suspension.description}
          </Stack>
        </Callout>
      )}

      <ProjectHero hero={hero} onOpenDeploy={openDeploy} />

      {/* components/ProjectAutoDeployNotice */}
      {autoDeployStopped && (
        <Callout
          color="notice"
          action={
            <Button appearance="outlined" color="neutral" size="s" aria-label="自動デプロイを再開">
              再開
            </Button>
          }
        >
          GitHub への push による自動デプロイを停止しています。
        </Callout>
      )}

      {/* 実物は role="tablist"（aria-label="プロジェクト詳細タブ"・gap-6）の中に next/link を並べ、
          タブごとに URL（?tab=）を変える。下線は border-b の全幅の線と、選んだタブの 2px の線（neutral-900）。
          GAP: Tabs に size が無く、文字が m（16px）・全タブ太字になる。実物は text-sm（14px）で、
          選んだタブだけ太字（neutral-900）、ほかは通常の太さの neutral-500。選んだタブの線は interactive の色 */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => navigate(tabDestination[key as ProjectTab])}
      >
        <TabList aria-label="プロジェクト詳細タブ">
          {TABS.map((tab) => (
            <Tab key={tab.key} id={tab.key}>
              {tab.label}
            </Tab>
          ))}
        </TabList>
      </Tabs>

      {children}
    </Stack>
  )
}

// ─── デベロッパー設定（features/DeveloperSettings）───

export type DeveloperSettingsPage = 'github' | 'sessions'

const SETTINGS_NAV: { page: DeveloperSettingsPage; label: string; to: DeployNowDestination }[] = [
  { page: 'github', label: 'GitHub 連携', to: 'developer-github' },
  { page: 'sessions', label: 'セッション', to: 'developer-sessions' },
]

/**
 * 見出し「デベロッパー設定」（xl）と、左のメニュー（components/SettingsNav）・右の本文。
 * 実物は md 以上で横並び（gap-10）、メニューの幅は md:w-44（176px）。md 未満は縦に積む（gap-6）。
 * GAP: SideNavigation の幅は置いた場所で決まり、176px 固定にできないので Grid の 3/12 に置く。
 *      Grid の spacing は md 未満が l（24px・実物の gap-6）、md 以上が xl（32px）。実物の gap-10（40px）は段階に無い。
 *      項目は実物と同じ s（14px）・現在地は太字だが、現在地の地色は実物の bg-neutral-100 ではなく青の薄い面
 */
export const DeveloperSettingsLayout = ({
  current,
  onSelectPage,
  children,
}: {
  current: DeveloperSettingsPage
  /** メニューを押したとき。省略すると developer-github / developer-sessions へ移動する */
  onSelectPage?: (page: DeveloperSettingsPage) => void
  children: ReactNode
}) => {
  const navigate = useDeployNowNavigate()
  return (
    <Stack gap="l">
      <Typography component="h1" size="xl" fontWeight="bold">
        デベロッパー設定
      </Typography>
      <Grid spacing={{ xxs: 'l', m: 'xl' }}>
        <GridItem size={{ xxs: 12, m: 3 }}>
          <SideNavigation aria-label="デベロッパー設定">
            {SETTINGS_NAV.map((item) => (
              <SideNavigationItem
                key={item.page}
                href="#"
                isCurrent={item.page === current}
                onPress={() => (onSelectPage ? onSelectPage(item.page) : navigate(item.to))}
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
}
