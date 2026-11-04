import { useState } from 'react'

import { AppBar, AppBarLeading, AppBarTrailing } from '../../AppBar'
import { Button, LinkButton } from '../../Button'
import { Container } from '../../Container'
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Paper } from '../../Paper'
import { Select, SelectItem } from '../../Select'
import { Stack } from '../../Stack'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import { AppShell } from './AppShell'
import deployNowLogo from './assets/deploy-now/logo.svg'
import { Card } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

/**
 * デプロイナウ（hosting-deploy-now/frontend）の新規作成まわりを、ホスティング管理画面の中に写したもの。
 * プロジェクトの作成（/projects/new 系）はサイドナビの「プロジェクト」、既存プロジェクトへのデプロイは「デプロイ」に置く。
 * - プロジェクトを作成（/projects/new）: features/NewUploadProject（DeployMethodCards・DeployGuide・
 *   NewUploadProjectForm・SelectedFilesCard・PublicUrlField・AdvancedSettingsFields）
 * - GitHub リポジトリをインポート（/projects/new/github）: features/NewGitHubProject と
 *   features/GitHubRepositoryPicker
 * - 新しいバージョンをデプロイ（/projects/[id]/deployment/new）: features/NewProjectDeployment
 * - ログイン前のお試し（/start）: features/NewProjectTrial と app/(dashboard)/(application)/start/layout.tsx
 * - lolipop CLI スキル（/skills/lolipop-cli）: features/LolipopCliSkill
 * 作成・デプロイの後に移るプロジェクト詳細とデプロイ詳細は Deploys.stories.tsx にある。
 */

const meta = {
  title: 'Templates/NewProject',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const ZONE = 'lolipop-now.app'

const DEPLOY_PROMPT =
  'https://deploy.lolipop.jp/skills/lolipop-cli.md を読んで、公開までの手順を進めてください。'

// ─── GAP の回避策（inline style はここに集める） ───

// 面の余白は Paper の padding で付ける（GAP-1 は解消）。カードと CenteredNotice は既定の l、
// 面の中に置く値とコピーの面・ファイル一覧の面・インポート元の面（実物は p-4）とコード表示面は m、
// ドロップ領域（実物は px-8 py-16）は xxl。
// GAP-NEW: 行ごとに余白をとる部品が無い。一覧の行（実物は px-4 py-3 のリポジトリ・px-3 py-2 のファイル）は
//          面の余白の内側に並ぶので、区切り線が面の端まで届かない。
// GAP-NEW: 余白をとる部品が無い。読み込み中・取得失敗の案内（実物は px-6 py-16）の広い上下の余白。
//          inline style を当てない方針のため未対応。

// GAP-NEW: 文中のテキストリンクが無い。実物は native a / button + text-sky-700（または #0b3893）。
// LinkButton の transparent で代えるので、文字の前後に余白が付く。
const TextLink = ({ children }: { children: ReactNode }) => (
  <LinkButton appearance="transparent" color="interactive" size="s">
    {children}
  </LinkButton>
)

const LoadingBody = ({ message = '読み込み中' }: { message?: string }) => (
  <Stack alignItems="center">
    <Loader size="m" message={message} />
  </Stack>
)

/** 実物の `px-6 py-16 text-center` の 1 行（面を持たない）。 */
const CenteredMessage = ({ message }: { message: string }) => (
  <Stack alignItems="center">
    <Typography component="div" size="s" color="low_emphasis">
      {message}
    </Typography>
  </Stack>
)

/** 実物の CenteredNotice（Paper outlined + px-6 py-16 + 中央寄せ）。 */
const CenteredNotice = ({ message, children }: { message: string; children?: ReactNode }) => (
  <Paper elevation={0} outlined>
    <Stack gap="m" alignItems="center">
      <Typography component="div" size="s" color="low_emphasis">
        {message}
      </Typography>
      {children}
    </Stack>
  </Paper>
)

const PageTitle = ({ title, description }: { title: string; description?: string }) => (
  <Stack gap="xxs">
    <Typography component="h1" size="xl" fontWeight="bold">
      {title}
    </Typography>
    {description && (
      <Typography component="div" size="s" color="medium_emphasis">
        {description}
      </Typography>
    )}
  </Stack>
)

// GAP-NEW: TextField / Select のエラー文言スロットが react-aria のネイティブ検証前提で、
// 送信時の検査には使えない。実物も role="alert" の中に Typography xs negative を置いている。

// GAP-NEW: 箇条書き（ul / li）の部品が無い。実物は Typography component="li" + list-disc。
const Bullets = ({ items }: { items: string[] }) => (
  <Stack gap="xxs">
    {items.map((item) => (
      <Typography component="div" key={item} size="s" color="medium_emphasis">
        ・{item}
      </Typography>
    ))}
  </Stack>
)

// GAP-NEW: 値とコピー完了フィードバック（「コピーしました」を 2 秒）をまとめた部品が無い。
// 実物は DeployGuide / CliDeployCommand / NewProjectTrial で同じ処理を 3 回書いている。
// GAP-20: 等幅フォントが無く、実物の font-mono を再現できない。
const CopyBox = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false)
  return (
    // 実物は border + bg-neutral-50 + shadow-sm。GAP-NEW: Paper に地色の違う面が無い
    <Paper padding="m" elevation={1} outlined>
      <Stack flexDirection="row" gap="s" alignItems="center" justifyContent="space-between">
        <Typography size="s" color="medium_emphasis" component="span">
          {value}
        </Typography>
        <Button
          appearance="flat"
          color="neutral"
          size="s"
          onPress={() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
        >
          {copied ? 'コピーしました' : 'コピー'}
        </Button>
      </Stack>
    </Paper>
  )
}

// GAP-NEW: ファイルのドロップゾーン（DropZone / FileTrigger）が無い。
// 実物は破線枠 + bg-neutral-100 の領域と、文中リンク風の「ファイル」「フォルダ」ボタン。
const DropArea = () => (
  <Paper padding="xxl" elevation={0} outlined>
    <Stack gap="xs" alignItems="center">
      <Typography component="div" size="m">
        アプリのフォルダやファイルをここにドロップ
      </Typography>
      <Stack flexDirection="row" gap="xxs" alignItems="center">
        <Typography component="span" size="s" color="medium_emphasis">
          または
        </Typography>
        <TextLink>ファイル</TextLink>
        <Typography component="span" size="s" color="medium_emphasis">
          か
        </Typography>
        <TextLink>フォルダ</TextLink>
        <Typography component="span" size="s" color="medium_emphasis">
          を選択
        </Typography>
      </Stack>
    </Stack>
  </Paper>
)

// ─── 選んだファイル（features/NewUploadProject/components/SelectedFilesCard） ───

const selectedFiles = [
  { path: 'index.html', size: '4.2 KB' },
  { path: 'about.html', size: '3.1 KB' },
  { path: 'assets/style.css', size: '12.8 KB' },
  { path: 'assets/app.js', size: '48.0 KB' },
  { path: 'images/hero.webp', size: '182.4 KB' },
]

const SelectedFilesCard = () => (
  // GAP-NEW: Paper に地色の違う面（bg-neutral-50）が無い。実物はファイル一覧を薄い灰色の面に置く
  // GAP-NEW: 高さを決めてスクロールさせる面が無い。実物の一覧は max-h-48 overflow-y-auto
  <Paper padding="m" elevation={0} outlined>
    <Stack gap="s">
      <Stack gap="xxs">
        <Stack flexDirection="row" gap="xs" alignItems="center">
          <Icon name="folder" />
          <Typography component="div" size="m" fontWeight="bold">
            {`${selectedFiles.length} ファイル (250.5 KB)`}
          </Typography>
        </Stack>
        <Typography component="div" size="xxs" color="medium_emphasis">
          .git / node_modules / .env.local は除外され、送信されません。
        </Typography>
      </Stack>
      <Paper padding="m" elevation={0} outlined>
        {selectedFiles.map((file, i) => (
          <Stack key={file.path}>
            {i > 0 && <Divider />}
            <Stack flexDirection="row" gap="xs" justifyContent="space-between">
              <Typography component="span" size="xs">
                {file.path}
              </Typography>
              <Typography component="span" size="xs" color="medium_emphasis">
                {file.size}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Paper>
    </Stack>
  </Paper>
)

// ─── プロジェクトを作成（features/NewUploadProject） ───

// backend/sql/seed.sql の frameworks（ListFrameworks は ORDER BY id で返す）
const frameworks = [
  {
    id: 'next',
    name: 'next',
    displayName: 'Next.js',
    install: 'npm ci --ignore-scripts',
    build: 'npm run build',
    out: '.next/standalone',
  },
  {
    id: 'nuxt',
    name: 'nuxt',
    displayName: 'Nuxt',
    install: 'npm ci --ignore-scripts',
    build: 'npm run build',
    out: '.output',
  },
  { id: 'static', name: 'static', displayName: '静的サイト', install: '', build: '', out: '.' },
  {
    id: 'astro',
    name: 'astro',
    displayName: 'Astro',
    install: 'npm ci --ignore-scripts',
    build: 'npm run build',
    out: 'dist',
  },
]

// フォルダ名（portfolio-site）から提案した公開URL と、内容から判定したフレームワーク
const SUGGESTED_DOMAIN = 'portfolio-site'
const DETECTED_FRAMEWORK = 'static'

const UploadProjectScreen = ({ hasSelection = false }: { hasSelection?: boolean }) => {
  const [domain, setDomain] = useState(hasSelection ? SUGGESTED_DOMAIN : '')
  const [frameworkId, setFrameworkId] = useState(DETECTED_FRAMEWORK)
  const [advanced, setAdvanced] = useState(false)
  const framework = frameworks.find((f) => f.id === frameworkId)

  return (
    <AppShell active="projects">
      <PageTitle
        title="プロジェクトを作成"
        description="プロジェクトを作成してデプロイする方法を選んでください。"
      />
      {hasSelection ? (
        <Card outlined elevation={0}>
          <Stack gap="l">
            <SelectedFilesCard />
            <Stack gap="xxs">
              <Select
                label="フレームワーク"
                size="s"
                width="full"
                caption={
                  frameworkId === DETECTED_FRAMEWORK
                    ? 'フォルダの内容から自動で判定しました。違う場合は選び直してください。'
                    : undefined
                }
                selectedKey={frameworkId}
                onSelectionChange={(key) => setFrameworkId(String(key))}
              >
                {frameworks.map((f) => (
                  <SelectItem key={f.id} id={f.id}>
                    {f.displayName}
                  </SelectItem>
                ))}
              </Select>
            </Stack>
            <Stack gap="xxs">
              <TextField
                label="公開URL"
                placeholder="my-app"
                size="s"
                width="full"
                caption="あとから変更できません。"
                value={domain}
                onChange={setDomain}
              />
              <Typography component="p" size="xxs" color="medium_emphasis">
                公開URL: https://
                <Typography component="span" size="xxs" fontWeight="bold">
                  {domain.trim() === '' ? 'my-app' : domain}
                </Typography>
                .{ZONE}
              </Typography>
            </Stack>
            {/* GAP-NEW: Accordion / Disclosure が無い。実物は Button + aria-expanded で開閉している */}
            <Stack flexDirection="row">
              <Button
                appearance="transparent"
                color="neutral"
                size="s"
                aria-expanded={advanced}
                leading={<Icon name={advanced ? 'chevron_up' : 'chevron_down'} size="s" />}
                onPress={() => setAdvanced(!advanced)}
              >
                詳細設定
              </Button>
            </Stack>
            {advanced && (
              <Stack gap="l">
                <TextField
                  label="プロジェクト名"
                  placeholder={domain.trim() === '' ? 'my-app' : domain}
                  size="s"
                  width="full"
                  caption="未入力の場合は公開URLと同じ名前になります。"
                />
                {/* 静的サイトはビルド工程が無いので、ビルド設定欄を出さない */}
                {framework?.name !== 'static' && (
                  <>
                    <TextField
                      label="インストールコマンド"
                      placeholder={framework?.install}
                      size="s"
                      width="full"
                    />
                    <TextField
                      label="ビルドコマンド"
                      placeholder={framework?.build}
                      size="s"
                      width="full"
                    />
                    <TextField
                      label="出力ディレクトリ"
                      placeholder={framework?.out}
                      size="s"
                      width="full"
                    />
                  </>
                )}
              </Stack>
            )}
            <Stack flexDirection="row" gap="xs" justifyContent="flex-end">
              <Button appearance="outlined" color="neutral" size="s">
                キャンセル
              </Button>
              <Button appearance="flat" color="neutral" size="s" isDisabled={domain.trim() === ''}>
                デプロイ
              </Button>
            </Stack>
          </Stack>
        </Card>
      ) : (
        <>
          <Card outlined elevation={0}>
            <Stack gap="m">
              <Typography component="div" size="m" fontWeight="bold">
                GitHub のリポジトリからデプロイ
              </Typography>
              <Stack gap="xs">
                <Typography component="div" size="s" color="medium_emphasis">
                  リポジトリを接続すると、次のようにデプロイできます。
                </Typography>
                <Bullets
                  items={[
                    '本番ブランチに push すると、自動で本番にデプロイされます。',
                    'プルリクエストを作ると、本番とは別の URL でプレビューを公開できます。',
                  ]}
                />
                <Typography component="div" size="s" color="medium_emphasis">
                  デプロイに使うリポジトリは接続時に選択できます。
                </Typography>
              </Stack>
              <Stack flexDirection="row">
                {/* 実物は OAuth の往復のあと /projects/new/github に戻る（GitHubImport ストーリー） */}
                <LinkButton href="#">GitHub と接続</LinkButton>
              </Stack>
            </Stack>
          </Card>
          <Card outlined elevation={0}>
            <Stack gap="m">
              <Typography component="div" size="m" fontWeight="bold">
                AI エージェントでデプロイ
              </Typography>
              <Typography component="p" size="s" color="medium_emphasis">
                お使いの AI エージェント (Claude / Codex / Cursor など)
                に次のプロンプトを貼り付けると、デプロイ手順を読み取り、そのまま公開まで案内します。
              </Typography>
              <CopyBox value={DEPLOY_PROMPT} />
            </Stack>
          </Card>
          <Card outlined elevation={0}>
            <Stack gap="m">
              <Typography component="div" size="m" fontWeight="bold">
                フォルダやファイルをアップロードしてデプロイ
              </Typography>
              <DropArea />
            </Stack>
          </Card>
        </>
      )}
    </AppShell>
  )
}

// ─── 新しいバージョンをデプロイ（features/NewProjectDeployment） ───

const ProjectDeploymentScreen = () => (
  <AppShell active="deploys">
    <PageTitle
      title="新しいバージョンをデプロイ"
      description="CLI、またはフォルダのアップロードで「portfolio」の新しいバージョンをデプロイできます。"
    />
    <Card outlined elevation={0}>
      <Stack gap="m">
        <Typography component="div" size="m" fontWeight="bold">
          CLI でデプロイ
        </Typography>
        <Typography component="p" size="s" color="medium_emphasis">
          アプリのフォルダで次のコマンドを実行すると、このプロジェクトにデプロイされます。
        </Typography>
        <CopyBox value="lolipop deploy --project 01JQ8Z5M3K7XW2N4V6B9C0D1EF" />
      </Stack>
    </Card>
    <Card outlined elevation={0}>
      <Stack gap="m">
        <Typography component="div" size="m" fontWeight="bold">
          フォルダやファイルをアップロードしてデプロイ
        </Typography>
        <DropArea />
      </Stack>
    </Card>
  </AppShell>
)

// ─── GitHub リポジトリをインポート（features/GitHubRepositoryPicker） ───

type GitHubAccount = { installationId: string; login: string; isOrganization: boolean }
type Repository = { id: string; name: string; private: boolean; defaultBranch: string }

const githubAccounts: GitHubAccount[] = [
  { installationId: '1001', login: 'example-inc', isOrganization: true },
  { installationId: '1002', login: 'taro-dev', isOrganization: false },
]

const repositoriesByAccount: Record<string, Repository[]> = {
  '1001': [
    { id: 'r1', name: 'portfolio', private: false, defaultBranch: 'main' },
    { id: 'r2', name: 'shop-api', private: true, defaultBranch: 'main' },
    { id: 'r3', name: 'docs-site', private: false, defaultBranch: 'main' },
    { id: 'r4', name: 'internal-dashboard', private: true, defaultBranch: 'develop' },
  ],
  '1002': [
    { id: 'r5', name: 'blog', private: false, defaultBranch: 'main' },
    { id: 'r6', name: 'dotfiles', private: true, defaultBranch: 'master' },
  ],
}

const MAX_VISIBLE_REPOSITORIES = 10
const INSTALL_ACCOUNT_KEY = 'install-new-account'

const RepositoryPicker = ({ accountsEmpty = false }: { accountsEmpty?: boolean }) => {
  const [installationId, setInstallationId] = useState(githubAccounts[0].installationId)
  const [query, setQuery] = useState('')
  const account =
    githubAccounts.find((a) => a.installationId === installationId) ?? githubAccounts[0]

  if (accountsEmpty) {
    return (
      <CenteredNotice message="デプロイできるリポジトリがまだありません。GitHub でデプロイしたいリポジトリへのアクセスを許可してください。">
        <LinkButton href="#">リポジトリを追加</LinkButton>
      </CenteredNotice>
    )
  }

  const all = repositoriesByAccount[account.installationId]
  const matched = all.filter((r) => r.name.toLowerCase().includes(query.trim().toLowerCase()))
  const visible = matched.slice(0, MAX_VISIBLE_REPOSITORIES)

  return (
    <Stack gap="m">
      <Grid spacing="s">
        <GridItem size={{ xxs: 12, s: 5 }}>
          <Select
            aria-label="アカウント"
            width="full"
            selectedKey={installationId}
            onSelectionChange={(key) => {
              // 実物は「アカウント追加」で GitHub の install 画面へフルページ遷移する
              if (key === INSTALL_ACCOUNT_KEY || key === null) return
              setInstallationId(String(key))
              setQuery('')
            }}
          >
            {[
              ...githubAccounts.map((a) => (
                <SelectItem key={a.installationId} id={a.installationId} textValue={a.login}>
                  <Stack flexDirection="row" gap="xs" alignItems="center">
                    <Icon name="github" size="s" />
                    {a.login}
                    {a.isOrganization && (
                      <Typography component="span" size="xs" color="medium_emphasis">
                        Organization
                      </Typography>
                    )}
                  </Stack>
                </SelectItem>
              )),
              <SelectItem
                key={INSTALL_ACCOUNT_KEY}
                id={INSTALL_ACCOUNT_KEY}
                textValue="アカウント追加"
              >
                <Stack flexDirection="row" gap="xs" alignItems="center">
                  <Icon name="plus" size="s" />
                  アカウント追加
                </Stack>
              </SelectItem>,
            ]}
          </Select>
        </GridItem>
        <GridItem size={{ xxs: 12, s: 7 }}>
          {/* GAP-NEW: TextField に虫眼鏡のアイコンを差せない */}
          <TextField
            aria-label="リポジトリを検索"
            type="search"
            placeholder="リポジトリを検索"
            width="full"
            autoComplete="off"
            value={query}
            onChange={setQuery}
          />
        </GridItem>
      </Grid>
      {visible.length === 0 ? (
        <Paper elevation={0} outlined>
          <Stack alignItems="center">
            <Typography component="div" size="s" color="low_emphasis">
              {`「${query}」に一致するリポジトリがありません。`}
            </Typography>
          </Stack>
        </Paper>
      ) : (
        <Paper elevation={0} outlined>
          {visible.map((r, i) => (
            <Stack key={r.id}>
              {i > 0 && <Divider />}
              <Stack flexDirection="row" gap="m" alignItems="center" justifyContent="space-between">
                <Stack flexDirection="row" gap="xs" alignItems="center">
                  <Typography component="span" size="m" fontWeight="bold">
                    {r.name}
                  </Typography>
                  {r.private && <Icon name="lock" size="s" aria-label="非公開リポジトリ" />}
                </Stack>
                <Button size="s" aria-label={`${r.name} をインポート`}>
                  インポート
                </Button>
              </Stack>
            </Stack>
          ))}
        </Paper>
      )}
      <Stack flexDirection="row" gap="xs" alignItems="center">
        <Typography component="div" size="s" color="medium_emphasis">
          目的のリポジトリがありませんか？
        </Typography>
        <LinkButton href="#" appearance="transparent" size="s">
          リポジトリの選択を変更
        </LinkButton>
      </Stack>
    </Stack>
  )
}

// ─── 新しいプロジェクトのフォーム（features/NewGitHubProject の NewProjectSection + CreateForm） ───

const NewProjectSection = ({
  repository,
}: {
  repository: { fullName: string; name: string; defaultBranch: string }
}) => {
  // 実物はリポジトリを選んだ直後、フレームワークを未選択（EMPTY_FORM の frameworkId: ''）にする
  const [frameworkId, setFrameworkId] = useState('')
  const [advanced, setAdvanced] = useState(false)
  const fw = frameworks.find((f) => f.id === frameworkId)

  return (
    <Card outlined elevation={0}>
      <Stack gap="l">
        {/* GAP-NEW: Paper に地色の違う面（bg-neutral-100・枠なし）が無い。実物はインポート元を灰色の面に置く */}
        <Paper padding="m" elevation={0} outlined>
          <Stack gap="xxs">
            <Typography component="div" size="xs" color="medium_emphasis">
              GitHub からインポート
            </Typography>
            <Stack flexDirection="row" gap="xs" alignItems="center">
              <Icon name="github" size="s" />
              <Typography component="div" size="m" fontWeight="bold">
                {repository.fullName}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
        <Stack gap="l">
          <TextField
            label="プロジェクト名"
            size="s"
            width="full"
            autoComplete="off"
            defaultValue={repository.name}
          />
          <TextField
            label="サブドメイン"
            caption={`公開 URL (<サブドメイン>.${ZONE}) になります。`}
            size="s"
            width="full"
            autoComplete="off"
            defaultValue={repository.name}
          />
          {/* GAP-NEW: Select に color="negative" が無く、未選択のエラーで枠を赤くできない（実物も同じ） */}
          <Select
            label="フレームワーク"
            placeholder="フレームワークを選択"
            size="s"
            width="full"
            selectedKey={frameworkId || null}
            onSelectionChange={(key) => setFrameworkId(key === null ? '' : String(key))}
          >
            {frameworks.map((f) => (
              <SelectItem key={f.id} id={f.id}>
                {f.displayName}
              </SelectItem>
            ))}
          </Select>
          <TextField
            label="デプロイするブランチ"
            size="s"
            width="full"
            autoComplete="off"
            defaultValue={repository.defaultBranch}
          />
          {/* GAP-NEW: Accordion / Disclosure が無い。実物は Button + aria-expanded で開閉している */}
          <Stack flexDirection="row">
            <Button
              appearance="transparent"
              color="neutral"
              size="s"
              aria-expanded={advanced}
              leading={<Icon name={advanced ? 'chevron_up' : 'chevron_down'} size="s" />}
              onPress={() => setAdvanced(!advanced)}
            >
              詳細設定
            </Button>
          </Stack>
          {advanced && (
            <Stack gap="l">
              <TextField label="ルートディレクトリ" size="s" width="full" autoComplete="off" />
              <TextField
                label="インストールコマンド"
                placeholder={fw?.install}
                size="s"
                width="full"
                autoComplete="off"
              />
              <TextField
                label="ビルドコマンド"
                placeholder={fw?.build}
                size="s"
                width="full"
                autoComplete="off"
              />
              <TextField
                label="出力ディレクトリ"
                placeholder={fw?.out}
                size="s"
                width="full"
                autoComplete="off"
              />
            </Stack>
          )}
          <Stack flexDirection="row">
            <Button>デプロイ</Button>
          </Stack>
        </Stack>
        <Stack flexDirection="row">
          <Button appearance="transparent" color="neutral" size="s">
            別のリポジトリを選ぶ
          </Button>
        </Stack>
      </Stack>
    </Card>
  )
}

// ─── GitHub リポジトリをインポート（features/NewGitHubProject） ───

type AuthorizationState = 'connected' | 'loading' | 'error' | 'not-connected'

const portfolioRepository = {
  fullName: 'example-inc/portfolio',
  name: 'portfolio',
  defaultBranch: 'main',
}

const GitHubImportScreen = ({
  authorization = 'connected',
  accountsEmpty,
  repository = null,
}: {
  authorization?: AuthorizationState
  accountsEmpty?: boolean
  repository?: { fullName: string; name: string; defaultBranch: string } | null
}) => (
  <AppShell active="projects">
    <Stack gap="m">
      <Typography size="xl" fontWeight="bold" component="h1">
        {repository === null ? 'GitHub リポジトリをインポート' : '新しいプロジェクト'}
      </Typography>
      {authorization === 'loading' ? (
        <LoadingBody />
      ) : authorization === 'error' ? (
        <CenteredNotice message="GitHub 連携の状態の取得に失敗しました。時間をおいて再度お試しください。" />
      ) : authorization === 'not-connected' ? (
        <CenteredNotice message="GitHub と接続すると、リポジトリを選ぶだけでデプロイできます。">
          <LinkButton href="#">GitHub と接続</LinkButton>
        </CenteredNotice>
      ) : repository === null ? (
        <RepositoryPicker accountsEmpty={accountsEmpty} />
      ) : (
        <NewProjectSection repository={repository} />
      )}
    </Stack>
  </AppShell>
)

// ─── ログイン前のお試し（features/NewProjectTrial + start/layout.tsx） ───

/**
 * /start の chrome。ログイン後の AppBar の右側を「ドキュメント / ログイン / 無料ではじめる」に差し替えたもの。
 * サイドナビは持たない。実物の本文は最大 1000px。
 */
const TrialShell = ({ children }: { children: ReactNode }) => (
  <Stack gap="l">
    <AppBar appearance="white" position="relative">
      <AppBarLeading>
        {/* GAP-NEW: 画像の枠（Image）が無い。実物は h-7 w-auto（md 以上 h-12）に縮めて出す */}
        <a href="/start">
          <img src={deployNowLogo} alt="ロリポップ！デプロイナウ" width={390} height={54} />
        </a>
      </AppBarLeading>
      <AppBarTrailing>
        {/* GAP-NEW: 表示/非表示のレスポンシブ指定が無い。実物は sm 未満で「ドキュメント」「ログイン」を隠す */}
        <Stack flexDirection="row" gap="xxs" alignItems="center">
          <LinkButton
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            appearance="transparent"
            size="s"
            trailing={<Icon name="launch" size="s" />}
          >
            ドキュメント
          </LinkButton>
          <LinkButton href="#" appearance="transparent" size="s">
            ログイン
          </LinkButton>
          <LinkButton href="#" appearance="flat" color="neutral" size="s">
            無料ではじめる
          </LinkButton>
        </Stack>
      </AppBarTrailing>
    </AppBar>
    <Container size="m" component="main">
      <Stack gap="l">{children}</Stack>
    </Container>
  </Stack>
)

const SignupPromptDialog = ({ onClose }: { onClose: () => void }) => (
  <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
    {/* GAP-NEW: Dialog に幅の指定が無い。実物は w-[472px] に固定している */}
    <DialogHeader>
      <DialogTitle>無料登録してデプロイ</DialogTitle>
    </DialogHeader>
    <Stack gap="xs">
      <Typography component="p" size="s">
        デプロイには無料の会員登録が必要です。登録後、フォルダをドロップするだけで公開できます。
      </Typography>
      <Typography component="p" size="xs" color="medium_emphasis">
        ファイルはまだアップロードされていません。登録後にもう一度ドロップしてください。
      </Typography>
    </Stack>
    <DialogFooter>
      <Button appearance="outlined" color="neutral" size="s" onPress={onClose}>
        閉じる
      </Button>
      <LinkButton href="#" appearance="flat" color="neutral" size="s">
        無料ではじめる
      </LinkButton>
    </DialogFooter>
  </Dialog>
)

const TrialScreen = ({ dropped = false }: { dropped?: boolean }) => {
  const [dropAttempted] = useState(dropped)
  const [dialogOpen, setDialogOpen] = useState(dropped)
  return (
    <TrialShell>
      {dialogOpen && <SignupPromptDialog onClose={() => setDialogOpen(false)} />}
      <PageTitle
        title="プロジェクトを作成"
        description="AI エージェントへの指示、またはフォルダのアップロードでプロジェクトを作成し、デプロイできます。"
      />
      <Card outlined elevation={0}>
        <Stack gap="m">
          <Typography component="div" size="m" fontWeight="bold">
            AI エージェントでデプロイ
          </Typography>
          <Typography component="p" size="s" color="medium_emphasis">
            お使いの AI エージェント (Claude / Codex / Cursor など)
            に次のプロンプトを貼り付けると、デプロイ手順を読み取り、そのまま公開まで案内します。
          </Typography>
          <CopyBox value={DEPLOY_PROMPT} />
        </Stack>
      </Card>
      <Card outlined elevation={0}>
        <Stack gap="m">
          <Typography component="div" size="m" fontWeight="bold">
            フォルダをアップロードしてデプロイ
          </Typography>
          {/* GAP-NEW: ドロップゾーンが無い（DropArea と同じ）。ドロップ後に枠の色を濃くする表現もできない */}
          <Paper padding="xxl" elevation={0} outlined>
            <Stack gap="s" alignItems="center">
              <Icon name="upload" />
              <Stack gap="xxs" alignItems="center">
                <Typography component="div" size="m">
                  アプリのフォルダをドロップするだけでデプロイできます
                </Typography>
                <Typography component="div" size="xs" color="medium_emphasis">
                  {dropAttempted
                    ? 'デプロイには無料登録が必要です。登録後にもう一度ドロップしてください。'
                    : 'ご利用には無料登録が必要です。登録後、フォルダをドロップするだけで公開できます。'}
                </Typography>
              </Stack>
              <Stack flexDirection="row" gap="xs" alignItems="center">
                <LinkButton href="#" appearance="flat" color="neutral" size="s">
                  無料ではじめる
                </LinkButton>
                <LinkButton href="#" appearance="outlined" color="neutral" size="s">
                  ログイン
                </LinkButton>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Card>
    </TrialShell>
  )
}

// ─── lolipop CLI スキル（features/LolipopCliSkill） ───

// 実物は public/skills/lolipop-cli.md を取得して全文をそのまま出す（ここでは先頭のみ）
const SKILL_MARKDOWN = `---
name: lolipop-cli
description: ロリポップ！デプロイナウの lolipop CLI でアプリをデプロイする手順。CLI の準備 → login → プロジェクト作成 → deploy までを通す。「lolipop でデプロイ」「デプロイナウにデプロイ」「lolipop CLI を使いたい」等で使う。
---

# lolipop CLI でデプロイする

ロリポップ！デプロイナウのコマンドラインツール \`lolipop\` で、ローカルのアプリを公開する手順。

このスキルに無い詳細は Markdown で取得できるドキュメントを参照する:

- https://deploy.lolipop.jp/docs.md — ロリポップ！デプロイナウのドキュメント全体
- https://deploy.lolipop.jp/docs/cli.md — CLI リファレンス (全コマンド・オプションの詳細)

## 1. CLI を入れる

\`\`\`bash
npm install -g lolipop
\`\`\`

実行には Node.js 22.12.0 以上が必要。導入できたら稼働確認する:

\`\`\`bash
lolipop health   # Operational と出れば OK
\`\`\`

## 2. デプロイする

アプリのディレクトリで \`lolipop deploy\` を実行するだけで、ログイン → プロジェクト作成 → デプロイまで通る。

\`\`\`bash
cd <アプリのディレクトリ>
lolipop deploy
\`\`\``

const CliSkillScreen = () => {
  const [copied, setCopied] = useState(false)
  return (
    <AppShell active="deploys">
      <Stack gap="xs">
        {/* 実物は Typography の既定（p）で見出しになっていない。ページの見出しなので h1 にしている */}
        <Typography component="h1" size="xl" fontWeight="bold">
          lolipop CLI スキル
        </Typography>
        <Typography component="div" size="s" color="medium_emphasis">
          お使いのコーディングエージェント (Claude / Codex / Cursor) の SKILL.md
          にこの内容を貼り付けると、lolipop CLI でのデプロイ手順を渡せます。
        </Typography>
      </Stack>
      <Stack flexDirection="row" gap="s" alignItems="center">
        <Button
          appearance="flat"
          color="interactive"
          size="s"
          onPress={() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
        >
          コピー
        </Button>
        {copied && (
          <Typography component="span" size="s" color="positive">
            コピーしました
          </Typography>
        )}
      </Stack>
      {/* GAP-20: 等幅フォントが無い。実物は pre + font-mono + whitespace-pre-wrap。
          GAP-NEW: 高さを決めてスクロールさせる面が無い。実物は max-h-[60vh] overflow-auto。
          GAP-NEW: Paper に地色の違う面（bg-neutral-50）が無い */}
      <Paper padding="m" elevation={0} outlined>
        <Stack>
          {SKILL_MARKDOWN.split('\n').map((line, i) => (
            <Typography
              component="div"
              // biome-ignore lint/suspicious/noArrayIndexKey: 同じ行（空行や ```）が繰り返し出るため行番号を key にする
              key={i}
              size="s"
              density="dense"
            >
              {line || ' '}
            </Typography>
          ))}
        </Stack>
      </Paper>
    </AppShell>
  )
}

// ─── ストーリー ───

/**
 * プロジェクトを作成する入口（/projects/new）。GitHub・AI エージェント・アップロードの 3 つの方法を
 * 優先度の順にカードで縦に並べる。
 *
 * @summary プロジェクトを作成
 */
export const UploadProject: Story = {
  render: () => <UploadProjectScreen />,
}

/**
 * フォルダを選んだあとのフォーム。フォルダ名から公開URL を、内容からフレームワークを自動で入れる。
 *
 * @summary アップロードのフォーム
 */
export const UploadProjectForm: Story = {
  render: () => <UploadProjectScreen hasSelection />,
}

/**
 * 既存のプロジェクトに新しいバージョンをデプロイする入口（/projects/[id]/deployment/new）。
 * CLI のコマンドを先に、アップロードを 2 番目に置く。
 *
 * @summary 新しいバージョンをデプロイ
 */
export const ProjectDeployment: Story = {
  render: () => <ProjectDeploymentScreen />,
}

/**
 * 新しいバージョンをデプロイする画面の読み込み中、プロジェクトが見つからないとき、取得に失敗したとき。
 *
 * @summary 新しいバージョンの読み込み中・見つからない・取得失敗
 */
export const ProjectDeploymentLoadingAndError: Story = {
  render: () => (
    <Stack gap="xxl">
      <AppShell active="deploys">
        <LoadingBody />
      </AppShell>
      <AppShell active="deploys">
        <CenteredMessage message="プロジェクトが見つかりません。" />
      </AppShell>
      <AppShell active="deploys">
        <CenteredMessage message="プロジェクトの取得に失敗しました。時間をおいて再度お試しください。" />
      </AppShell>
    </Stack>
  ),
}

/**
 * GitHub リポジトリから新しいプロジェクトを作る入口（/projects/new/github）。アカウントを選び、
 * リポジトリを検索して「インポート」する。
 *
 * @summary GitHub リポジトリを選ぶ
 */
export const GitHubImport: Story = {
  render: () => <GitHubImportScreen />,
}

/**
 * GitHub 連携の状態を読み込んでいる間と、取得に失敗したとき。
 * 一時的な障害なので、接続のやり直しには誘導しない。
 *
 * @summary GitHub の読み込み中・取得失敗
 */
export const GitHubImportLoadingAndError: Story = {
  render: () => (
    <Stack gap="xxl">
      <GitHubImportScreen authorization="loading" />
      <GitHubImportScreen authorization="error" />
    </Stack>
  ),
}

/**
 * デプロイできるリポジトリが無いとき。「リポジトリを追加」で GitHub へ送る。
 *
 * @summary リポジトリが 0 件
 */
export const GitHubImportEmpty: Story = {
  render: () => <GitHubImportScreen accountsEmpty />,
}

/**
 * GitHub とまだ接続していないとき。リポジトリ一覧の代わりに接続の導線を出す。
 *
 * @summary GitHub 未接続
 */
export const GitHubNotConnected: Story = {
  render: () => <GitHubImportScreen authorization="not-connected" />,
}

/**
 * リポジトリを選んだあとのフォーム。プロジェクト名とサブドメインはリポジトリ名から、
 * ブランチはデフォルトブランチから入る。フレームワークは未選択から選ぶ。
 *
 * @summary 新しいプロジェクトのフォーム
 */
export const GitHubImportForm: Story = {
  render: () => <GitHubImportScreen repository={portfolioRepository} />,
}

/**
 * ログイン前のお試しページ（/start）。プロジェクトを作成と同じ見た目で、AI エージェントとアップロードの
 * 2 つだけを置き、アップロードは登録へ送る。サイドナビは無く、AppBar の右に登録とログインを置く。
 *
 * @summary お試し（ログイン前）
 */
export const Trial: Story = {
  render: () => <TrialScreen />,
}

/**
 * お試しページでフォルダをドロップしたとき。ファイルには触れず、登録を促すダイアログを開く。
 * ダイアログを閉じると、ドロップ領域の文言が「登録後にもう一度ドロップしてください」に変わっている。
 *
 * @summary 無料登録してデプロイ
 */
export const TrialSignupDialog: Story = {
  render: () => <TrialScreen dropped />,
}

/**
 * lolipop CLI のスキル（/skills/lolipop-cli）。コーディングエージェントに渡す手順の全文と、コピーのボタン。
 *
 * @summary lolipop CLI スキル
 */
export const CliSkill: Story = {
  render: () => <CliSkillScreen />,
}

/**
 * スキルの読み込み中と取得失敗。
 *
 * @summary lolipop CLI スキルの読み込み中・取得失敗
 */
export const CliSkillLoadingAndError: Story = {
  render: () => (
    <Stack gap="xxl">
      <AppShell active="deploys">
        <LoadingBody />
      </AppShell>
      <AppShell active="deploys">
        <CenteredMessage message="skill の取得に失敗しました。時間をおいて再度お試しください。" />
      </AppShell>
    </Stack>
  ),
}
