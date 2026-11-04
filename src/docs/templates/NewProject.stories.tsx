import { useState } from 'react'

import { Button, LinkButton } from '../../Button'
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
import { DeployNowShell, DeployNowStartShell, useDeployNowNavigate } from './deployNowShell'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

/**
 * デプロイナウ（hosting-deploy-now/frontend）の新規作成まわりを、ホスティング管理画面の中に写したもの。
 * 枠は DeployNowShell（/start だけ DeployNowStartShell）。どの画面にもタブやパンくずは無い。
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
  title: 'Templates/DeployNow/NewProject',
  // テンプレートはロリポップのトンマナを確かめる場所なので、フレーバーを lolipop に固定する
  globals: { flavor: 'lolipop' },
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

// 面の余白は Paper の padding で付ける（GAP-1 は解消）。カードは既定の l、CenteredNotice（実物は px-6 py-16）は xxl、
// 面の中に置く値とコピーの面・ファイル一覧の面・インポート元の面（実物は p-4）とコード表示面は m、
// ドロップ領域（実物は px-8 py-16）は xxl。
// GAP-NEW: 行ごとに余白をとる部品が無い。一覧の行（実物は px-4 py-3 のリポジトリ・px-3 py-2 のファイル）は
//          面の余白の内側に並ぶので、区切り線が面の端まで届かない。
// GAP-NEW: 余白をとる部品が無い。面を持たない読み込み中・取得失敗の案内（実物は px-6 py-16）の広い上下の余白。
//          Stack の gap は要素の間にしか付かず、Paper は白い面になるので付けられない。

// GAP-NEW: 実物の Typography は既定の p（と明示の p）だが、Tailwind の preflight で margin が 0 になっている。
// wip-ui は p・h1 の既定の margin を消さないので、p の代わりに div で描いている（h1 は見出しのため残し、上下に margin が付く）。
// GAP-NEW: 文中のテキストリンク（ボタン）が無い。実物は native button + text-sm text-[#0b3893]、hover で下線。
// Button の transparent で代えるので、文字の前後に余白が付き、文字色は interactive になる。
const TextLink = ({
  children,
  onPress,
  'aria-label': ariaLabel,
}: {
  children: ReactNode
  onPress?: () => void
  'aria-label'?: string
}) => (
  <Button
    appearance="transparent"
    color="interactive"
    size="s"
    aria-label={ariaLabel}
    onPress={onPress}
  >
    {children}
  </Button>
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
  // 実物は px-6 py-16。padding は上下左右同じ値しか取れないので上下に合わせて xxl（48px）
  <Paper outlined padding="xxl">
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

// GAP-NEW: 箇条書き（ul / li）の部品が無い。実物は ul.list-disc.pl-5 の中に Typography component="li"。
// Typography で ul / li を描くと、ブラウザの既定の margin と padding（上下 16px・左 40px）が残るので、
// 行頭の点を文字で書いた div を並べている。実物の li の間は 0 だが、Stack の gap の最小の xxs（4px）
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
// GAP-NEW: 実物の文字色は text-neutral-700。近い medium_emphasis にしている。
// 実物は sm 以上で 1 行に truncate する。Typography に truncate の指定が無く折り返す。
const CopyBox = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false)
  return (
    // 実物は border + bg-neutral-50 + shadow-sm の div。GAP-NEW: Paper に地色の違う面が無く、
    // outlined にすると影が消えるため shadow-sm も出せない
    <Paper padding="m" outlined>
      <Stack flexDirection="row" gap="s" alignItems="center" justifyContent="space-between">
        <Typography size="s" color="medium_emphasis" component="code">
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
// 実物は px-8 py-16。padding は上下左右同じ値しか取れないので上下に合わせて xxl（48px）
const DropArea = ({ onSelect }: { onSelect?: () => void }) => (
  <Paper padding="xxl" outlined>
    <Stack gap="xs" alignItems="center">
      <Typography component="div" size="m">
        アプリのフォルダやファイルをここにドロップ
      </Typography>
      {/* 実物は 1 つの Typography（p）の中に文と native button を並べている。Button を文中に置くと
          縦の位置が文字とずれるので、Stack の row で並べている（間に gap xxs が付く） */}
      <Stack flexDirection="row" gap="xxs" alignItems="center">
        <Typography component="span" size="s" color="medium_emphasis">
          または
        </Typography>
        <TextLink aria-label="ファイルを選択" onPress={onSelect}>
          ファイル
        </TextLink>
        <Typography component="span" size="s" color="medium_emphasis">
          か
        </Typography>
        <TextLink aria-label="フォルダを選択" onPress={onSelect}>
          フォルダ
        </TextLink>
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
  // 実物は Paper ではなく border + bg-neutral-50 + p-4 の div
  <Paper padding="m" outlined>
    {/* 一覧の上の mt-3（12px） */}
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
      {/* 実物は ul + rounded border + bg-white、行は li の px-3 py-2。
          padding は上下左右同じ値しか取れないので左右に合わせて s（12px）、行の上下は gap xs（8px） */}
      <Paper padding="s" outlined>
        <Stack gap="xs">
          {selectedFiles.map((file, i) => (
            <Stack key={file.path} gap="xs">
              {i > 0 && <Divider />}
              <Stack
                flexDirection="row"
                gap="xs"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography component="span" size="xs">
                  {file.path}
                </Typography>
                <Typography component="span" size="xs" color="medium_emphasis">
                  {file.size}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
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

const UploadProjectScreen = ({
  hasSelection: initialSelection = false,
}: {
  hasSelection?: boolean
}) => (
  <DeployNowShell>
    <UploadProjectContent initialSelection={initialSelection} />
  </DeployNowShell>
)

const UploadProjectContent = ({ initialSelection }: { initialSelection: boolean }) => {
  const navigate = useDeployNowNavigate()
  // ファイルかフォルダを選ぶとフォームに切り替わり、キャンセルで方法の選択に戻る（URL は変わらない）
  const [hasSelection, setHasSelection] = useState(initialSelection)
  const [domain, setDomain] = useState(hasSelection ? SUGGESTED_DOMAIN : '')
  const [frameworkId, setFrameworkId] = useState(DETECTED_FRAMEWORK)
  const [advanced, setAdvanced] = useState(false)
  const framework = frameworks.find((f) => f.id === frameworkId)

  return (
    // GAP-NEW: 実物は mx-auto w-full max-w-[920px]。Container に 920px の幅が無く、枠の幅のまま
    <Stack gap="l">
      <PageTitle
        title="プロジェクトを作成"
        description="プロジェクトを作成してデプロイする方法を選んでください。"
      />
      {hasSelection ? (
        <Paper outlined>
          <Stack gap="l">
            <SelectedFilesCard />
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
            <Stack gap="xxs">
              <TextField
                label="公開URL"
                placeholder="my-app"
                size="s"
                value={domain}
                onChange={setDomain}
                width="full"
                color="neutral"
                caption="あとから変更できません。"
                autoComplete="off"
                spellCheck="false"
              />
              <Typography component="div" size="xxs" color="medium_emphasis">
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
            {/* 実物は fragment で、親の Stack gap l にそのまま並ぶ */}
            {advanced && (
              <Stack gap="l">
                <TextField
                  label="プロジェクト名"
                  placeholder={domain.trim() === '' ? 'my-app' : domain}
                  size="s"
                  width="full"
                  color="neutral"
                  caption="未入力の場合は公開URLと同じ名前になります。"
                  autoComplete="off"
                  spellCheck="false"
                />
                {/* 静的サイトはビルド工程が無いので、ビルド設定欄を出さない */}
                {framework?.name !== 'static' && (
                  <>
                    <TextField
                      label="インストールコマンド"
                      placeholder={framework?.install}
                      size="s"
                      width="full"
                      autoComplete="off"
                      spellCheck="false"
                    />
                    <TextField
                      label="ビルドコマンド"
                      placeholder={framework?.build}
                      size="s"
                      width="full"
                      autoComplete="off"
                      spellCheck="false"
                    />
                    <TextField
                      label="出力ディレクトリ"
                      placeholder={framework?.out}
                      size="s"
                      width="full"
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </>
                )}
              </Stack>
            )}
            <Stack flexDirection="row" gap="xs" justifyContent="flex-end">
              <Button
                appearance="outlined"
                color="neutral"
                size="s"
                onPress={() => setHasSelection(false)}
              >
                キャンセル
              </Button>
              {/* 実物は作成とアップロードが済むと、そのデプロイの詳細へ移る */}
              <Button
                appearance="flat"
                color="neutral"
                size="s"
                isDisabled={domain.trim() === ''}
                onPress={() => navigate('deploy-detail')}
              >
                デプロイ
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ) : (
        <>
          <Paper outlined>
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
                <LinkButton href="#" onPress={() => navigate('new-project-github')}>
                  GitHub と接続
                </LinkButton>
              </Stack>
            </Stack>
          </Paper>
          <Paper outlined>
            <Stack gap="m">
              <Typography component="div" size="m" fontWeight="bold">
                AI エージェントでデプロイ
              </Typography>
              <Typography component="div" size="s" color="medium_emphasis">
                お使いの AI エージェント (Claude / Codex / Cursor など)
                に次のプロンプトを貼り付けると、デプロイ手順を読み取り、そのまま公開まで案内します。
              </Typography>
              <CopyBox value={DEPLOY_PROMPT} />
            </Stack>
          </Paper>
          <Paper outlined>
            <Stack gap="m">
              <Typography component="div" size="m" fontWeight="bold">
                フォルダやファイルをアップロードしてデプロイ
              </Typography>
              <DropArea onSelect={() => setHasSelection(true)} />
            </Stack>
          </Paper>
        </>
      )}
    </Stack>
  )
}

// ─── 新しいバージョンをデプロイ（features/NewProjectDeployment） ───

const ProjectDeploymentScreen = () => (
  <DeployNowShell>
    <Stack gap="l">
      <PageTitle
        title="新しいバージョンをデプロイ"
        description="CLI、またはフォルダのアップロードで「portfolio」の新しいバージョンをデプロイできます。"
      />
      <Paper outlined>
        <Stack gap="m">
          <Typography component="div" size="m" fontWeight="bold">
            CLI でデプロイ
          </Typography>
          <Typography component="div" size="s" color="medium_emphasis">
            アプリのフォルダで次のコマンドを実行すると、このプロジェクトにデプロイされます。
          </Typography>
          <CopyBox value="lolipop deploy --project 01JQ8Z5M3K7XW2N4V6B9C0D1EF" />
        </Stack>
      </Paper>
      <Paper outlined>
        <Stack gap="m">
          <Typography component="div" size="m" fontWeight="bold">
            フォルダやファイルをアップロードしてデプロイ
          </Typography>
          <DropArea />
        </Stack>
      </Paper>
    </Stack>
  </DeployNowShell>
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

const RepositoryPicker = ({
  accountsEmpty = false,
  onSelect,
}: {
  accountsEmpty?: boolean
  onSelect: (repository: Repository, account: GitHubAccount) => void
}) => {
  const navigate = useDeployNowNavigate()
  const [installationId, setInstallationId] = useState(githubAccounts[0].installationId)
  const [query, setQuery] = useState('')
  const account =
    githubAccounts.find((a) => a.installationId === installationId) ?? githubAccounts[0]

  if (accountsEmpty) {
    return (
      <CenteredNotice message="デプロイできるリポジトリがまだありません。GitHub でデプロイしたいリポジトリへのアクセスを許可してください。">
        <LinkButton href="#" onPress={() => navigate('github-installation')}>
          リポジトリを追加
        </LinkButton>
      </CenteredNotice>
    )
  }

  const all = repositoriesByAccount[account.installationId]
  const matched = all.filter((r) => r.name.toLowerCase().includes(query.trim().toLowerCase()))
  const visible = matched.slice(0, MAX_VISIBLE_REPOSITORIES)

  return (
    <Stack gap="m">
      {/* 実物は flex-col gap-3 sm:flex-row で、アカウントが sm:w-2/5・検索が sm:flex-1。
          Grid の 12 分割に 2/5 が無く 5/12 にしている */}
      <Grid spacing="s">
        <GridItem size={{ xxs: 12, s: 5 }}>
          <Select
            aria-label="アカウント"
            width="full"
            selectedKey={installationId}
            onSelectionChange={(key) => {
              // 実物は「アカウント追加」で GitHub の install 画面へフルページ遷移する
              if (key === INSTALL_ACCOUNT_KEY) {
                navigate('github-installation')
                return
              }
              if (key === null) return
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
        // 実物は py-8 text-center。padding は上下左右同じ値しか取れないので上下に合わせて xl（32px）
        <Paper outlined padding="xl">
          <Stack alignItems="center">
            <Typography component="div" size="s" color="low_emphasis">
              {`「${query}」に一致するリポジトリがありません。`}
            </Typography>
          </Stack>
        </Paper>
      ) : (
        // 実物は Paper outlined の中の ul.divide-y で、行は li の px-4 py-3。
        // padding は上下左右同じ値しか取れないので左右に合わせて m（16px）、行の上下は gap s（12px）
        <Paper outlined padding="m">
          <Stack gap="s">
            {visible.map((r, i) => (
              <Stack key={r.id} gap="s">
                {i > 0 && <Divider />}
                <Stack
                  flexDirection="row"
                  gap="m"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack flexDirection="row" gap="xs" alignItems="center">
                    <Typography component="span" size="m" fontWeight="bold">
                      {r.name}
                    </Typography>
                    {r.private && <Icon name="lock" size="s" aria-label="非公開リポジトリ" />}
                  </Stack>
                  <Button
                    size="s"
                    aria-label={`${r.name} をインポート`}
                    onPress={() => onSelect(r, account)}
                  >
                    インポート
                  </Button>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Paper>
      )}
      {/* GAP-NEW: Stack に折り返し（flex-wrap）の指定が無い */}
      <Stack flexDirection="row" gap="xs" alignItems="center">
        <Typography component="div" size="s" color="medium_emphasis">
          目的のリポジトリがありませんか？
        </Typography>
        <LinkButton
          href="#"
          appearance="transparent"
          size="s"
          onPress={() => navigate('github-installation')}
        >
          リポジトリの選択を変更
        </LinkButton>
      </Stack>
    </Stack>
  )
}

// ─── 新しいプロジェクトのフォーム（features/NewGitHubProject の NewProjectSection + CreateForm） ───

const NewProjectSection = ({
  repository,
  onBack,
}: {
  repository: { fullName: string; name: string; defaultBranch: string }
  onBack: () => void
}) => {
  const navigate = useDeployNowNavigate()
  // 実物はリポジトリを選んだ直後、フレームワークを未選択（EMPTY_FORM の frameworkId: ''）にする
  const [frameworkId, setFrameworkId] = useState('')
  const [advanced, setAdvanced] = useState(false)
  const fw = frameworks.find((f) => f.id === frameworkId)

  return (
    <Paper outlined>
      <Stack gap="l">
        {/* GAP-NEW: Paper に地色の違う面（bg-neutral-100・枠なし）が無い。実物はインポート元を
            rounded-lg bg-neutral-100 p-4 の div に置く。面が見えるよう outlined で代えている */}
        <Paper padding="m" outlined>
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
            color="neutral"
            autoComplete="off"
            spellCheck="false"
            defaultValue={repository.name}
          />
          <TextField
            label="サブドメイン"
            caption={`公開 URL (<サブドメイン>.${ZONE}) になります。`}
            size="s"
            width="full"
            color="neutral"
            autoComplete="off"
            spellCheck="false"
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
            color="neutral"
            autoComplete="off"
            spellCheck="false"
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
              <TextField
                label="ルートディレクトリ"
                size="s"
                width="full"
                color="neutral"
                autoComplete="off"
                spellCheck="false"
              />
              <TextField
                label="インストールコマンド"
                placeholder={fw?.install}
                size="s"
                width="full"
                color="neutral"
                autoComplete="off"
                spellCheck="false"
              />
              <TextField
                label="ビルドコマンド"
                placeholder={fw?.build}
                size="s"
                width="full"
                color="neutral"
                autoComplete="off"
                spellCheck="false"
              />
              <TextField
                label="出力ディレクトリ"
                placeholder={fw?.out}
                size="s"
                width="full"
                color="neutral"
                autoComplete="off"
                spellCheck="false"
              />
            </Stack>
          )}
          {/* 実物は作成に成功すると、そのプロジェクトの詳細（デプロイのタブ）へ移る */}
          <Stack flexDirection="row">
            <Button onPress={() => navigate('project-deploys')}>デプロイ</Button>
          </Stack>
        </Stack>
        <Stack flexDirection="row">
          <Button appearance="transparent" color="neutral" size="s" onPress={onBack}>
            別のリポジトリを選ぶ
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}

// ─── GitHub リポジトリをインポート（features/NewGitHubProject） ───

type AuthorizationState = 'connected' | 'loading' | 'error' | 'not-connected'

const portfolioRepository = {
  fullName: 'example-inc/portfolio',
  name: 'portfolio',
  defaultBranch: 'main',
}

type SelectedRepository = { fullName: string; name: string; defaultBranch: string }

const GitHubImportScreen = (props: {
  authorization?: AuthorizationState
  accountsEmpty?: boolean
  repository?: SelectedRepository | null
}) => (
  <DeployNowShell>
    <GitHubImportContent {...props} />
  </DeployNowShell>
)

const GitHubImportContent = ({
  authorization = 'connected',
  accountsEmpty,
  repository: initialRepository = null,
}: {
  authorization?: AuthorizationState
  accountsEmpty?: boolean
  repository?: SelectedRepository | null
}) => {
  const navigate = useDeployNowNavigate()
  // 「インポート」でフォームに切り替わり、「別のリポジトリを選ぶ」で一覧に戻る（URL は変わらない）
  const [repository, setRepository] = useState(initialRepository)
  return (
    // GAP-NEW: 実物は mx-auto w-full max-w-[920px]。Container に 920px の幅が無く、枠の幅のまま
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
          <LinkButton href="#" onPress={() => navigate('new-project-github')}>
            GitHub と接続
          </LinkButton>
        </CenteredNotice>
      ) : repository === null ? (
        <RepositoryPicker
          accountsEmpty={accountsEmpty}
          onSelect={(r, account) =>
            setRepository({
              fullName: `${account.login}/${r.name}`,
              name: r.name,
              defaultBranch: r.defaultBranch,
            })
          }
        />
      ) : (
        <NewProjectSection repository={repository} onBack={() => setRepository(null)} />
      )}
    </Stack>
  )
}

// ─── ログイン前のお試し（features/NewProjectTrial + start/layout.tsx） ───

const SignupPromptDialog = ({ onClose }: { onClose: () => void }) => {
  const navigate = useDeployNowNavigate()
  return (
    <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
      {/* GAP-NEW: Dialog に幅の指定が無い。実物は w-[472px] に固定している */}
      <DialogHeader>
        <DialogTitle>無料登録してデプロイ</DialogTitle>
      </DialogHeader>
      <Stack gap="xs">
        <Typography component="div" size="s">
          デプロイには無料の会員登録が必要です。登録後、フォルダをドロップするだけで公開できます。
        </Typography>
        <Typography component="div" size="xs" color="medium_emphasis">
          ファイルはまだアップロードされていません。登録後にもう一度ドロップしてください。
        </Typography>
      </Stack>
      <DialogFooter>
        <Button appearance="outlined" color="neutral" size="s" onPress={onClose}>
          閉じる
        </Button>
        <LinkButton
          href="#"
          appearance="flat"
          color="neutral"
          size="s"
          onPress={() => navigate('signup')}
        >
          無料ではじめる
        </LinkButton>
      </DialogFooter>
    </Dialog>
  )
}

const TrialScreen = ({ dropped = false }: { dropped?: boolean }) => (
  <DeployNowStartShell>
    <TrialContent dropped={dropped} />
  </DeployNowStartShell>
)

const TrialContent = ({ dropped }: { dropped: boolean }) => {
  const navigate = useDeployNowNavigate()
  const [dropAttempted] = useState(dropped)
  const [dialogOpen, setDialogOpen] = useState(dropped)
  return (
    // GAP-NEW: 実物は mx-auto w-full max-w-[920px]。Container に 920px の幅が無く、枠の幅のまま
    <Stack gap="l">
      {dialogOpen && <SignupPromptDialog onClose={() => setDialogOpen(false)} />}
      <PageTitle
        title="プロジェクトを作成"
        description="AI エージェントへの指示、またはフォルダのアップロードでプロジェクトを作成し、デプロイできます。"
      />
      <Paper outlined>
        <Stack gap="m">
          <Typography component="div" size="m" fontWeight="bold">
            AI エージェントでデプロイ
          </Typography>
          <Typography component="div" size="s" color="medium_emphasis">
            お使いの AI エージェント (Claude / Codex / Cursor など)
            に次のプロンプトを貼り付けると、デプロイ手順を読み取り、そのまま公開まで案内します。
          </Typography>
          <CopyBox value={DEPLOY_PROMPT} />
        </Stack>
      </Paper>
      <Paper outlined>
        <Stack gap="m">
          <Typography component="div" size="m" fontWeight="bold">
            フォルダをアップロードしてデプロイ
          </Typography>
          {/* GAP-NEW: ドロップゾーンが無い（DropArea と同じ）。ドロップ後に枠の色を濃くする表現もできない */}
          {/* 実物は px-8 py-16。padding は上下左右同じ値しか取れないので上下に合わせて xxl（48px） */}
          <Paper padding="xxl" outlined>
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
                <LinkButton
                  href="#"
                  appearance="flat"
                  color="neutral"
                  size="s"
                  onPress={() => navigate('signup')}
                >
                  無料ではじめる
                </LinkButton>
                <LinkButton
                  href="#"
                  appearance="outlined"
                  color="neutral"
                  size="s"
                  onPress={() => navigate('login')}
                >
                  ログイン
                </LinkButton>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Paper>
    </Stack>
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
    <DeployNowShell>
      <Stack gap="l">
        <Stack gap="xs">
          {/* 実物は Typography の既定（p）のままで、見出しの要素になっていない */}
          <Typography component="div" size="xl" fontWeight="bold">
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
            <Typography component="div" size="s" color="positive">
              コピーしました
            </Typography>
          )}
        </Stack>
        {/* GAP-20: 等幅フォントが無い。実物は pre + font-mono + whitespace-pre-wrap。
          GAP-NEW: 高さを決めてスクロールさせる面が無い。実物は max-h-[60vh] overflow-auto。
          GAP-NEW: Paper に地色の違う面（bg-neutral-50）が無い。実物は rounded-md border p-4 text-sm の pre */}
        <Paper padding="m" outlined>
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
      </Stack>
    </DeployNowShell>
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
      <DeployNowShell>
        <LoadingBody />
      </DeployNowShell>
      <DeployNowShell>
        <CenteredMessage message="プロジェクトが見つかりません。" />
      </DeployNowShell>
      <DeployNowShell>
        <CenteredMessage message="プロジェクトの取得に失敗しました。時間をおいて再度お試しください。" />
      </DeployNowShell>
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
      <DeployNowShell>
        <LoadingBody />
      </DeployNowShell>
      <DeployNowShell>
        <CenteredMessage message="skill の取得に失敗しました。時間をおいて再度お試しください。" />
      </DeployNowShell>
    </Stack>
  ),
}
