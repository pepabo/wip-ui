import { useContext, useState } from 'react'

import { Breadcrumb, Breadcrumbs } from '../../Breadcrumbs'
import { Button, LinkButton } from '../../Button'
import { Callout } from '../../Callout'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Paper } from '../../Paper'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Typography } from '../../Typography'
import { AppNavigationContext, AppShell } from './AppShell'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { StickerColor } from '../../Sticker'
import type { TypographyColor } from '../../Typography'

/**
 * デプロイナウ（hosting-deploy-now/frontend）のデプロイまわりを、ホスティング管理画面の中に写したもの。
 * - デプロイ一覧: features/Project/index.tsx（パンくず・読み込み中・取得失敗・ProjectHero）
 *   と features/Project/features/ProjectDeploys
 * - デプロイ詳細: features/Project/features/ProjectDeploy（model.ts の段階の出し分け・DeployGitLine・
 *   BuildLogTerminal・RedeployDialog）
 * 新規作成（/projects/new・/projects/new/github・/projects/[id]/deployment/new）は NewProject.stories.tsx にある。
 * 実物はプロジェクト詳細のタブ（デプロイ / 環境変数 / ドメイン / 設定）で切り替えるが、
 * ここではタブを AppShell のサイドナビ（デプロイ / ドメイン / 設定）に置き換えている。
 */

const meta = {
  title: 'Templates/Deploys',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── GAP の回避策（inline style はここに集める） ───

// 面の余白は Paper の padding で付ける（GAP-1 は解消）。一覧の面は none にして区切り線を面の端まで通し、
// 行・列見出し・段階の行はそれぞれ padding="m" の入れ子の Paper で余白を付ける。ビルドログの面も m。
// GAP-NEW: Paper の padding は上下左右で同じ値しか取れない。実物の行は px-6 py-4（列見出しは px-6 py-2、
//          段階の行は pl-6 pr-5 min-h-[52px]）で、ここは 4 辺とも m（16px）になり左右が 8px 狭い。
// GAP-NEW: 余白をとる部品が無い。読み込み中・取得失敗の案内（実物は px-6 py-16）の余白。
//          inline style を当てない方針のため未対応。

// GAP-NEW: 行全体をリンクにする一覧（stretched link / GridList）が無い。
// 実物は行ごと next/link で包み hover で bg-neutral-50 にしている。Paper に role="link" を付けて代える。
const RowLink = ({
  label,
  onOpen,
  children,
}: {
  label: string
  onOpen: () => void
  children: ReactNode
}) => (
  <Paper
    padding="m"
    elevation={0}
    role="link"
    tabIndex={0}
    aria-label={label}
    onClick={onOpen}
    onKeyDown={(e) => {
      if (e.key === 'Enter') onOpen()
    }}
  >
    {children}
  </Paper>
)

const DOT_COLOR: Record<StickerColor, TypographyColor> = {
  positive: 'positive',
  negative: 'negative',
  notice: 'notice',
  informative: 'informative',
  neutral: 'low_emphasis',
  attention: 'notice',
}

// GAP-NEW: StatusIndicator（色ドット + ラベル）が無い。実物は shared/ui/StatusIndicator で
// 色を hex で持っている。Icon の circle を Typography の色で塗って代える。
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

// GAP-NEW: 文中のテキストリンクが無い。実物は native a + text-sky-700。
// LinkButton の transparent で代えるので、文字の前後に余白が付いて左端がそろわない。
const TextLink = ({
  children,
  href,
  external = false,
  onPress,
}: {
  children: ReactNode
  href?: string
  external?: boolean
  onPress?: () => void
}) => (
  <LinkButton
    appearance="transparent"
    color="interactive"
    size="s"
    href={href}
    onPress={onPress}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    trailing={external ? <Icon name="launch" size="s" /> : undefined}
  >
    {children}
  </LinkButton>
)

const MetaRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <Stack gap="xxs">
    <Typography size="xs" color="medium_emphasis" component="span">
      {label}
    </Typography>
    {children}
  </Stack>
)

/** 実物の `flex justify-center py-16` + Loader。 */
const LoadingBody = () => (
  <Stack alignItems="center">
    <Loader size="m" message="読み込み中" />
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

// ─── データ（実物の proto の状態と同じ区分。値はダミー） ───

// deploynow/v1/deployment_pb の DeploymentStatus / BuildStatus
type DeploymentStatus =
  | 'QUEUED'
  | 'BUILDING'
  | 'DEPLOYING'
  | 'READY'
  | 'ERROR'
  | 'CANCELLING'
  | 'CANCELLED'
type BuildStatus = 'RUNNING' | 'SUCCESS' | 'FAILED'

type Deploy = {
  id: string
  status: DeploymentStatus
  startedAt: string
  // build 未作成（キュー入り直後）は undefined
  build?: { status: BuildStatus; seconds?: number }
  git?: { commitMessage: string; branch: string; shortSha: string }
  preview?: { pullRequestNumber: number }
  log?: string[]
}

type Project = {
  id: string
  name: string
  // 未発行は undefined（ヘッダーに「ドメイン未発行」）
  domain?: string
  repository?: string
  autoDeployEnabled: boolean
  servingDeployId?: string
  deploys: Deploy[]
}

// ProjectDeploy/model.ts の toStatusLabel（一覧の toDeployStatus と同じ区分）
const statusLabel = (status: DeploymentStatus) => {
  switch (status) {
    case 'READY':
      return '成功'
    case 'QUEUED':
    case 'BUILDING':
    case 'DEPLOYING':
      return 'ビルド中'
    case 'CANCELLED':
      return 'キャンセル済み'
    case 'CANCELLING':
      return 'キャンセル中'
    default:
      return '失敗'
  }
}

// ProjectDeploy/model.ts の toStatusColor
const statusColor = (status: DeploymentStatus): StickerColor => {
  switch (status) {
    case 'READY':
      return 'positive'
    case 'QUEUED':
    case 'BUILDING':
    case 'DEPLOYING':
      return 'notice'
    case 'CANCELLED':
    case 'CANCELLING':
      return 'neutral'
    default:
      return 'negative'
  }
}

const ZONE = 'lolipop-now.app'

const buildLogOk = [
  'Cloning github.com/example-inc/portfolio (branch: main, commit: 8f21a3c)',
  'Detected framework: Next.js',
  'Running "npm install"',
  'added 412 packages in 18s',
  'Running "npm run build"',
  '  ▲ Next.js 15.5.4',
  '  Creating an optimized production build ...',
  ' ✓ Compiled successfully in 21.4s',
  ' ✓ Generating static pages (12/12)',
  'Build completed in 42s',
]

const buildLogFailed = [
  'Cloning github.com/example-inc/portfolio (branch: main, commit: 1a2b3c4)',
  'Detected framework: Next.js',
  'Running "npm install"',
  'added 418 packages in 19s',
  'Running "npm run build"',
  'Failed to compile.',
  './src/app/page.tsx:12:7',
  'Type error: Property "title" does not exist on type "Props".',
  '  12 |   <h1>{props.title}</h1>',
  '     |              ^',
  'Error: Command "npm run build" exited with 1',
]

const portfolio: Project = {
  id: 'p1',
  name: 'portfolio',
  domain: `portfolio.${ZONE}`,
  repository: 'example-inc/portfolio',
  autoDeployEnabled: true,
  servingDeployId: 'd1',
  deploys: [
    {
      id: 'd1',
      status: 'READY',
      startedAt: '3分前',
      build: { status: 'SUCCESS', seconds: 42 },
      git: { commitMessage: '画像の遅延読み込みを有効にする', branch: 'main', shortSha: '8f21a3c' },
      log: buildLogOk,
    },
    {
      id: 'd2',
      status: 'READY',
      startedAt: '1日前',
      build: { status: 'SUCCESS', seconds: 39 },
      git: {
        commitMessage: 'お問い合わせフォームを追加',
        branch: 'feature/contact',
        shortSha: '4c90b11',
      },
      preview: { pullRequestNumber: 42 },
      log: buildLogOk,
    },
    {
      id: 'd3',
      status: 'ERROR',
      startedAt: '2日前',
      build: { status: 'FAILED', seconds: 17 },
      git: { commitMessage: '依存パッケージを更新', branch: 'main', shortSha: '1a2b3c4' },
      log: buildLogFailed,
    },
    // 続けてデプロイしたため、ビルドの前に取り消されたアップロード
    { id: 'd4', status: 'CANCELLED', startedAt: '4日前' },
    { id: 'd5', status: 'READY', startedAt: '1週間前', build: { status: 'SUCCESS', seconds: 8 } },
  ],
}

const landing: Project = {
  id: 'p4',
  name: 'landing-2026',
  domain: `landing-2026.${ZONE}`,
  autoDeployEnabled: false,
  deploys: [],
}

const servingOf = (p: Project) => p.deploys.find((d) => d.id === p.servingDeployId)

// ─── ヘッダー（features/Project/index.tsx のパンくず + ProjectHero） ───

/** ProjectHero の ServingSourceLine。ブランチと短縮 SHA を「·」でつなぎ、コミット件名をリンクにする。 */
const ServingSourceLine = ({ deploy }: { deploy: Deploy }) =>
  deploy.git ? (
    <Stack flexDirection="row" gap="xs" alignItems="center">
      <Typography component="span" size="s" color="medium_emphasis">
        <Icon name="github" size="s" color="currentColor" aria-hidden />
      </Typography>
      <Typography component="span" size="s" color="medium_emphasis">
        {`${deploy.git.branch} · ${deploy.git.shortSha}`}
      </Typography>
      <TextLink href="#" external>
        {deploy.git.commitMessage || deploy.git.shortSha}
      </TextLink>
    </Stack>
  ) : (
    <UploadSource />
  )

const UploadSource = () => (
  <Stack flexDirection="row" gap="xxs" alignItems="center">
    <Icon name="upload" size="s" aria-hidden />
    <Typography component="span" size="s">
      アップロード
    </Typography>
  </Stack>
)

const ProjectHero = ({
  project,
  onOpenDeploy,
}: {
  project: Project
  onOpenDeploy: (id: string) => void
}) => {
  const latest = project.deploys[0]
  const serving = servingOf(project)
  return (
    // 実物（Figma 準拠）: hero はカード枠を持たず地に直接置く
    <Stack gap="m">
      <Stack gap="xs">
        <Stack flexDirection="row" gap="s" alignItems="center">
          <Typography size="xxl" fontWeight="bold" component="h1">
            {project.name}
          </Typography>
          <Sticker color={serving ? 'positive' : 'neutral'} size="s">
            {serving ? '稼働中' : '未公開'}
          </Sticker>
        </Stack>
        {project.domain ? (
          <Stack flexDirection="row">
            <TextLink href={`https://${project.domain}`} external>
              {project.domain}
            </TextLink>
          </Stack>
        ) : (
          <Typography component="div" size="s" color="low_emphasis">
            ドメイン未発行
          </Typography>
        )}
      </Stack>
      <Stack gap="m">
        <MetaRow label="最終デプロイ">
          {latest ? (
            <Stack flexDirection="row">
              <TextLink onPress={() => onOpenDeploy(latest.id)}>{latest.startedAt}</TextLink>
            </Stack>
          ) : (
            <Typography component="div" size="s">
              —
            </Typography>
          )}
        </MetaRow>
        {project.repository && (
          <MetaRow label="GitHub リポジトリ">
            <Stack flexDirection="row">
              <TextLink href="#" external>
                {project.repository}
              </TextLink>
            </Stack>
          </MetaRow>
        )}
        {serving && (
          <>
            <MetaRow label="公開日時">
              <Stack flexDirection="row">
                <TextLink onPress={() => onOpenDeploy(serving.id)}>{serving.startedAt}</TextLink>
              </Stack>
            </MetaRow>
            <MetaRow label="ソース">
              <ServingSourceLine deploy={serving} />
            </MetaRow>
          </>
        )}
      </Stack>
    </Stack>
  )
}

// ─── デプロイ一覧（features/Project/features/ProjectDeploys） ───

const DeployRowSummary = ({ deploy }: { deploy: Deploy }) => {
  if (!deploy.git) {
    return (
      <Stack flexDirection="row" gap="xxs" alignItems="center">
        <Icon name="upload" size="s" aria-hidden />
        <Typography component="span" size="s">
          {deploy.preview ? `プレビュー PR #${deploy.preview.pullRequestNumber}` : 'アップロード'}
        </Typography>
      </Stack>
    )
  }
  const meta = [
    ...(deploy.preview ? [`プレビュー PR #${deploy.preview.pullRequestNumber}`] : []),
    deploy.git.branch,
    deploy.git.shortSha,
  ]
  return (
    <Stack gap="xxs">
      <Typography component="div" size="s">
        {deploy.git.commitMessage || deploy.git.shortSha}
      </Typography>
      <Stack flexDirection="row" gap="xxs" alignItems="center">
        <Typography component="span" size="xs" color="medium_emphasis">
          <Icon name="github" size="s" color="currentColor" aria-hidden />
        </Typography>
        <Typography component="span" size="xs" color="medium_emphasis">
          {meta.join(' · ')}
        </Typography>
      </Stack>
    </Stack>
  )
}

const DeployList = ({
  project,
  onOpenDeploy,
}: {
  project: Project
  onOpenDeploy: (id: string) => void
}) => (
  <Stack gap="s">
    <Stack alignItems="flex-end">
      {/* 遷移先は /projects/[id]/deployment/new。NewProject.stories.tsx の ProjectDeployment ストーリーにあたる */}
      <LinkButton href="#" appearance="flat" color="neutral" size="s">
        新しいバージョンをデプロイ
      </LinkButton>
    </Stack>
    {project.deploys.length === 0 ? (
      <Paper elevation={0} outlined>
        <Stack gap="xxs" alignItems="center">
          <Typography component="div" size="m" fontWeight="bold">
            デプロイはまだありません
          </Typography>
          <Typography component="div" size="s" color="medium_emphasis">
            <Typography component="span" size="s" fontWeight="bold">
              lolipop deploy
            </Typography>{' '}
            を実行すると、ここにデプロイ履歴が表示されます
          </Typography>
        </Stack>
      </Paper>
    ) : (
      <Paper padding="none" elevation={0} outlined>
        {/* GAP-NEW: 表示/非表示のレスポンシブ指定が無い。実物は md 未満で列見出しを隠す */}
        <Paper padding="m" elevation={0}>
          <Grid spacing="s">
            <GridItem size={{ xxs: 8, m: 9 }}>
              <Typography component="span" size="xs" color="medium_emphasis">
                デプロイ
              </Typography>
            </GridItem>
            <GridItem size={{ xxs: 4, m: 3 }}>
              <Stack flexDirection="row" justifyContent="space-between">
                <Typography component="span" size="xs" color="medium_emphasis">
                  状態
                </Typography>
                <Typography component="span" size="xs" color="medium_emphasis">
                  最終デプロイ
                </Typography>
              </Stack>
            </GridItem>
          </Grid>
        </Paper>
        {project.deploys.map((d) => (
          <Stack key={d.id}>
            <Divider />
            <RowLink
              label={`${d.git?.commitMessage ?? 'アップロード'} の詳細`}
              onOpen={() => onOpenDeploy(d.id)}
            >
              {/* GAP-NEW: Grid に alignItems が無く、右列を左列の縦中央にそろえられない */}
              <Grid spacing="s" alignContent="center">
                <GridItem size={{ xxs: 8, m: 9 }}>
                  <DeployRowSummary deploy={d} />
                </GridItem>
                <GridItem size={{ xxs: 4, m: 3 }}>
                  {/* GAP-17: 実物は md 未満で右寄せの縦積み、md 以上で横並び。alignItems がレスポンシブにできない */}
                  <Stack
                    flexDirection={{ xxs: 'column', m: 'row' }}
                    gap="xxs"
                    justifyContent="space-between"
                  >
                    <StatusIndicator color={statusColor(d.status)}>
                      {statusLabel(d.status)}
                    </StatusIndicator>
                    <Typography component="div" size="s" color="medium_emphasis">
                      {d.startedAt}
                    </Typography>
                  </Stack>
                </GridItem>
              </Grid>
            </RowLink>
          </Stack>
        ))}
      </Paper>
    )}
  </Stack>
)

// ─── デプロイ詳細（features/Project/features/ProjectDeploy） ───

type StageState = 'success' | 'failed' | 'pending' | 'in_progress'
type Stage = {
  key: 'queued' | 'build' | 'deploy' | 'public'
  label: string
  state: StageState
  detail: string
}

// 実物の model.ts（queuedStage / buildStage / finalStage）と同じ段階の出し分け
const queuedStage = (d: Deploy): Stage => {
  const waiting = d.status === 'QUEUED'
  return {
    key: 'queued',
    label: 'キュー入り',
    state: waiting ? 'pending' : 'success',
    detail: waiting ? '待機中' : '完了',
  }
}

const buildStage = (d: Deploy): Stage => {
  const seconds = d.build?.seconds
  if (d.status === 'ERROR' || d.build?.status === 'FAILED') {
    return {
      key: 'build',
      label: 'ビルド失敗',
      state: 'failed',
      detail: seconds !== undefined ? `${seconds}秒で停止` : '失敗',
    }
  }
  if (d.status === 'READY' || d.status === 'DEPLOYING' || d.build?.status === 'SUCCESS') {
    return {
      key: 'build',
      label: 'ビルド',
      state: 'success',
      detail: seconds !== undefined ? `${seconds}秒で完了` : '完了',
    }
  }
  const running = d.status === 'BUILDING' || d.build?.status === 'RUNNING'
  return {
    key: 'build',
    label: 'ビルド',
    state: running ? 'in_progress' : 'pending',
    detail: running ? 'ビルド中' : '待機中',
  }
}

const finalStage = (key: 'deploy' | 'public', label: string, d: Deploy): Stage => {
  if (d.status === 'READY') {
    return { key, label, state: 'success', detail: key === 'public' ? '公開中' : '完了' }
  }
  if (d.status === 'DEPLOYING' && key === 'deploy') {
    return { key, label, state: 'in_progress', detail: 'デプロイ中' }
  }
  return { key, label, state: 'pending', detail: d.status === 'ERROR' ? '未実行' : '待機中' }
}

const stagesOf = (d: Deploy): Stage[] => [
  queuedStage(d),
  buildStage(d),
  finalStage('deploy', 'デプロイ', d),
  finalStage('public', '公開完了', d),
]

const StageGlyph = ({ state }: { state: StageState }) =>
  state === 'in_progress' ? (
    // 実物は Loader が inline の行に合わないとして自前のスピナー（18px）を置いている
    <Loader size="s" />
  ) : (
    // 実物は Icon に #109570 / #db4247 / #d9d9d9 を直書きし、font-size で 20px にしている
    <Typography
      component="span"
      color={state === 'success' ? 'positive' : state === 'failed' ? 'negative' : 'low_emphasis'}
    >
      <Icon
        name={
          state === 'success'
            ? 'check_on_circle'
            : state === 'failed'
              ? 'cross_on_circle'
              : 'circle'
        }
        color="currentColor"
        aria-hidden
      />
    </Typography>
  )

const isErrorLine = (line: string) =>
  ['Failed', 'Error:', 'Type error', '> 42', './src'].some((prefix) => line.startsWith(prefix)) ||
  line.trimStart().startsWith('|')

// GAP-20 + GAP-NEW: 等幅・暗色のコード表示面が無い。実物の BuildLogTerminal は bg-[#10131c] の上に
// font-mono / text-xs / leading-5 でログを出し、エラー行を #ff7373 にしている。
// ここは明るい面の上に、Typography の xs と negative 色で代えている。
const BuildLog = ({ lines }: { lines: string[] }) => {
  const [copied, setCopied] = useState(false)
  return (
    <Paper padding="m" elevation={0} outlined>
      <Stack gap="xs">
        <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
          <Typography component="span" size="xs" color="low_emphasis">
            {`${lines.length} lines`}
          </Typography>
          <Button
            appearance="flat"
            color="neutral"
            size="s"
            iconOnly
            aria-label={copied ? 'コピーしました' : 'ビルドログをコピー'}
            onPress={() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
          >
            <Icon name={copied ? 'check' : 'copy'} size="s" />
          </Button>
        </Stack>
        <Divider />
        <Stack>
          {lines.map((line, i) => (
            <Typography
              component="div"
              // biome-ignore lint/suspicious/noArrayIndexKey: ログは同じ行が繰り返し出るため行番号を key にする
              key={i}
              size="xs"
              density="dense"
              color={isErrorLine(line) ? 'negative' : 'medium_emphasis'}
            >
              {line || ' '}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </Paper>
  )
}

/** ProjectDeploy の DeployGitLine。リポジトリ・ブランチ・短縮 SHA を区切り記号なしで間隔だけで並べる。 */
const DeployGitLine = ({ deploy, repo }: { deploy: Deploy; repo?: string }) =>
  deploy.git ? (
    <Stack flexDirection="row" gap="xs" alignItems="center">
      <Typography component="span" size="s" color="medium_emphasis">
        <Icon name="github" size="s" color="currentColor" aria-hidden />
      </Typography>
      {repo && (
        <Typography component="span" size="s" color="medium_emphasis">
          {repo}
        </Typography>
      )}
      <Typography component="span" size="s" color="medium_emphasis">
        {deploy.git.branch}
      </Typography>
      <TextLink href="#" external>
        {deploy.git.shortSha}
      </TextLink>
      {deploy.preview && (
        <TextLink href="#" external>
          {`PR #${deploy.preview.pullRequestNumber}`}
        </TextLink>
      )}
    </Stack>
  ) : (
    <UploadSource />
  )

const RedeployDialog = ({
  willStopAutoDeploy,
  onClose,
}: {
  willStopAutoDeploy: boolean
  onClose: () => void
}) => (
  <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
    {/* GAP-NEW: Dialog に幅の指定が無い。実物は w-[360px] に固定している */}
    <DialogHeader>
      <DialogTitle>このデプロイを再デプロイしますか？</DialogTitle>
    </DialogHeader>
    <Stack gap="m">
      <DialogDescription>
        このデプロイと同じ内容で新しいデプロイを作成し、ビルドを開始します。現在のデプロイは変更されません。
      </DialogDescription>
      {willStopAutoDeploy && (
        <Callout color="notice">
          再デプロイすると、GitHub への push による自動デプロイを停止します。
        </Callout>
      )}
    </Stack>
    <DialogFooter>
      <Button appearance="outlined" color="neutral" size="m" onPress={onClose}>
        キャンセル
      </Button>
      <Button appearance="flat" color="interactive" size="m" onPress={onClose}>
        再デプロイ
      </Button>
    </DialogFooter>
  </Dialog>
)

const DeployDetail = ({
  project,
  deployId,
  initialDialogOpen,
  onBack,
}: {
  project: Project
  deployId: string
  initialDialogOpen: boolean
  onBack: () => void
}) => {
  const [dialogOpen, setDialogOpen] = useState(initialDialogOpen)
  const navigate = useContext(AppNavigationContext)
  const d = project.deploys.find((x) => x.id === deployId)
  if (!d) {
    return <DeployNotFound message="デプロイが見つかりません" onBack={onBack} />
  }
  const previewHost =
    d.preview && project.domain ? `pr-${d.preview.pullRequestNumber}-${project.domain}` : undefined
  const publicHost = previewHost ?? project.domain
  return (
    <Stack gap="l">
      <Breadcrumbs>
        <Breadcrumb href="#" onPress={() => navigate?.('projects')}>
          プロジェクト
        </Breadcrumb>
        <Breadcrumb href="#" onPress={onBack}>
          {project.name}
        </Breadcrumb>
        <Breadcrumb>デプロイ詳細</Breadcrumb>
      </Breadcrumbs>

      <Stack flexDirection={{ xxs: 'column', s: 'row' }} gap="m" justifyContent="space-between">
        <Stack gap="xs">
          <Typography size="xxl" fontWeight="bold" component="h1">
            {d.git?.commitMessage || 'デプロイ詳細'}
          </Typography>
          {previewHost && (
            <Stack flexDirection="row">
              <TextLink href={`https://${previewHost}`} external>
                {previewHost}
              </TextLink>
            </Stack>
          )}
        </Stack>
        <Stack flexDirection="row" gap="s" alignItems="center">
          {!d.preview && (
            <Button
              appearance="outlined"
              color="neutral"
              size="s"
              onPress={() => setDialogOpen(true)}
            >
              再デプロイ
            </Button>
          )}
          {d.status === 'READY' && publicHost && (
            <LinkButton
              href={`https://${publicHost}`}
              target="_blank"
              rel="noopener noreferrer"
              appearance="flat"
              color="neutral"
              size="s"
              trailing={<Icon name="launch" size="s" />}
            >
              公開URLを開く
            </LinkButton>
          )}
        </Stack>
      </Stack>

      <Stack gap="m">
        <MetaRow label="状態">
          <StatusIndicator color={statusColor(d.status)}>{statusLabel(d.status)}</StatusIndicator>
        </MetaRow>
        <MetaRow label="デプロイ日時">
          <Typography component="div" size="s">
            {d.startedAt}
          </Typography>
        </MetaRow>
        <MetaRow label="ソース">
          <DeployGitLine deploy={d} repo={project.repository} />
        </MetaRow>
      </Stack>

      <Paper padding="none" elevation={0} outlined>
        {stagesOf(d).map((stage, i) => (
          <Stack key={stage.key}>
            {i > 0 && <Divider />}
            <Paper padding="m" elevation={0}>
              <Stack gap="s">
                <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
                  <Stack flexDirection="row" gap="xs" alignItems="center">
                    <StageGlyph state={stage.state} />
                    <Typography
                      component="span"
                      size="s"
                      color={stage.state === 'pending' ? 'low_emphasis' : 'high_emphasis'}
                    >
                      {stage.label}
                    </Typography>
                  </Stack>
                  <Typography
                    component="span"
                    size="s"
                    color={stage.state === 'pending' ? 'low_emphasis' : 'high_emphasis'}
                  >
                    {stage.detail}
                  </Typography>
                </Stack>
                {stage.key === 'build' && d.log && <BuildLog lines={d.log} />}
              </Stack>
            </Paper>
          </Stack>
        ))}
      </Paper>

      {dialogOpen && (
        <RedeployDialog
          willStopAutoDeploy={project.autoDeployEnabled}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </Stack>
  )
}

const DeployNotFound = ({ message, onBack }: { message: string; onBack?: () => void }) => (
  <Stack gap="m">
    <Typography size="xl" fontWeight="bold" component="h1">
      {message}
    </Typography>
    <Stack flexDirection="row">
      <TextLink href={onBack ? undefined : '#'} onPress={onBack}>
        ← プロジェクトに戻る
      </TextLink>
    </Stack>
  </Stack>
)

// ─── 画面 ───

type Route = { name: 'list' } | { name: 'deploy'; deployId: string }

const DeploysScreen = ({
  project = portfolio,
  initialRoute = { name: 'list' },
  initialDialogOpen = false,
}: {
  project?: Project
  initialRoute?: Route
  initialDialogOpen?: boolean
}) => {
  const [route, setRoute] = useState<Route>(initialRoute)
  const navigate = useContext(AppNavigationContext)
  const openDeploy = (deployId: string) => setRoute({ name: 'deploy', deployId })

  return (
    <AppShell active="deploys">
      {route.name === 'deploy' ? (
        <DeployDetail
          key={route.deployId}
          project={project}
          deployId={route.deployId}
          initialDialogOpen={route === initialRoute && initialDialogOpen}
          onBack={() => setRoute({ name: 'list' })}
        />
      ) : (
        <Stack gap="l">
          <Breadcrumbs>
            <Breadcrumb href="#" onPress={() => navigate?.('projects')}>
              プロジェクト
            </Breadcrumb>
            <Breadcrumb>{project.name}</Breadcrumb>
          </Breadcrumbs>
          <ProjectHero project={project} onOpenDeploy={openDeploy} />
          <DeployList project={project} onOpenDeploy={openDeploy} />
        </Stack>
      )}
    </AppShell>
  )
}

// ─── ストーリー ───

/**
 * プロジェクトのデプロイ一覧。公開 URL・最終デプロイ・公開中のソースをヘッダーに置き、
 * その下にデプロイ履歴（コミット・ブランチ・状態のドット・日時）を並べる。
 * 行を押すとデプロイ詳細に入る。
 *
 * @summary デプロイ一覧
 */
export const Default: Story = {
  render: () => <DeploysScreen />,
}

/**
 * まだ 1 回もデプロイしていないプロジェクト。ヘッダーのバッジが「未公開」、最終デプロイが「—」になり、
 * 一覧の代わりに CLI での始め方を案内する。
 *
 * @summary デプロイがまだ無いとき
 */
export const Empty: Story = {
  render: () => <DeploysScreen project={landing} />,
}

/**
 * プロジェクト詳細の読み込み中、プロジェクトが見つからないとき、取得に失敗したとき。
 * 実物はパンくずもヘッダーも出さず、文言だけを中央に置く。
 *
 * @summary プロジェクトの読み込み中・見つからない・取得失敗
 */
export const ProjectLoadingAndError: Story = {
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
 * 成功したデプロイの詳細。キュー入り → ビルド → デプロイ → 公開完了の 4 段階がすべて完了し、
 * ビルドの段階の下にビルドログが開いている。
 *
 * @summary デプロイ詳細
 */
export const DeployDetailSucceeded: Story = {
  render: () => <DeploysScreen initialRoute={{ name: 'deploy', deployId: 'd1' }} />,
}

/**
 * 再デプロイの確認ダイアログ。自動デプロイが有効なプロジェクトでは、自動デプロイが止まることを Callout で知らせる。
 *
 * @summary 再デプロイの確認
 */
export const RedeployConfirm: Story = {
  render: () => (
    <DeploysScreen initialRoute={{ name: 'deploy', deployId: 'd1' }} initialDialogOpen />
  ),
}

/**
 * デプロイ詳細の読み込み中、デプロイが見つからないとき、取得に失敗したとき。
 *
 * @summary デプロイ詳細の読み込み中・見つからない・取得失敗
 */
export const DeployLoadingAndError: Story = {
  render: () => (
    <Stack gap="xxl">
      <AppShell active="deploys">
        <LoadingBody />
      </AppShell>
      <AppShell active="deploys">
        <DeployNotFound message="デプロイが見つかりません" />
      </AppShell>
      <AppShell active="deploys">
        <DeployNotFound message="デプロイの取得に失敗しました。時間をおいて再度お試しください。" />
      </AppShell>
    </Stack>
  ),
}
