import { useState } from 'react'

import { Button } from '../../Button'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Paper } from '../../Paper'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Typography } from '../../Typography'
import contestBanner from './assets/deploy-now/contest-banner.webp'
import { DeployNowShell, useDeployNowNavigate } from './deployNowShell'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { StickerColor } from '../../Sticker'
import type { TypographyColor } from '../../Typography'

/**
 * プロジェクト一覧。デプロイナウ（hosting-deploy-now/frontend）の /projects を写したもの。
 * - app/(dashboard)/(application)/(private)/projects/page.tsx → features/Projects（index.tsx・view.tsx・model.ts）
 * - 上から ContestNotice（features/ContestNotice）・使用量（features/UsageSummary）・見出し「プロジェクト」と
 *   「+ 新規作成」・一覧（Paper）・ページ送り（components/Pager）
 * 見出しは実物のまま。「使用量」が h2、その下の「プロジェクト」が h1 で、パンくずは無い。
 * デプロイナウの使用量は実アプリではこの画面にしか無いので、Usage（AI ゲートウェイの使用状況）には置かない。
 * 枠は DeployNowShell（(private)/layout.tsx）。本文は実物の ProjectsView と同じく Stack の gap m で積む。
 */

const meta = {
  title: 'Templates/DeployNow/Projects',
  // テンプレートはロリポップのトンマナを確かめる場所なので、フレーバーを lolipop に固定する
  globals: { flavor: 'lolipop' },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ（features/Projects/model.ts の ProjectListItem と同じ形。値はダミー）───

const ZONE = 'lolipop-now.app'

type ProjectStatus = '成功' | 'ビルド中' | '失敗' | 'キャンセル済み' | 'キャンセル中' | '未デプロイ'
type ServingStatus = '稼働中' | '未公開'

/** shared/lib/projectStatus.ts の PROJECT_STATUS_COLOR / SERVING_STATUS_COLOR */
const PROJECT_STATUS_COLOR: Record<ProjectStatus, StickerColor> = {
  成功: 'positive',
  ビルド中: 'notice',
  失敗: 'negative',
  キャンセル済み: 'neutral',
  キャンセル中: 'neutral',
  未デプロイ: 'neutral',
}
const SERVING_STATUS_COLOR: Record<ServingStatus, StickerColor> = {
  稼働中: 'positive',
  未公開: 'neutral',
}

type Project = {
  id: string
  name: string
  /** 空文字は「ドメイン未発行」 */
  domain: string
  status: ProjectStatus
  servingStatus: ServingStatus
  /** toLastDeployedAt の結果（ビルド中は「進行中」、失敗と未デプロイは「—」） */
  lastDeployedAt: string
  tags: string[]
  githubRepositoryFullName?: string
}

const projects: Project[] = [
  {
    id: 'p1',
    name: 'portfolio',
    domain: `portfolio.${ZONE}`,
    status: '成功',
    servingStatus: '稼働中',
    lastDeployedAt: '3分前',
    tags: ['Next.js'],
    githubRepositoryFullName: 'example-inc/portfolio',
  },
  {
    id: 'p2',
    name: 'shop-api',
    domain: `shop-api.${ZONE}`,
    status: 'ビルド中',
    servingStatus: '稼働中',
    lastDeployedAt: '進行中',
    tags: ['beta', 'OpenAI', 'production', 'stripe'],
    githubRepositoryFullName: 'example-inc/shop-api',
  },
  {
    id: 'p3',
    name: 'blog',
    domain: `blog.${ZONE}`,
    status: '失敗',
    servingStatus: '稼働中',
    lastDeployedAt: '—',
    tags: [],
  },
  {
    id: 'p4',
    name: 'landing-2026',
    domain: '',
    status: '未デプロイ',
    servingStatus: '未公開',
    lastDeployedAt: '—',
    tags: [],
  },
]

/** features/UsageSummary/model.ts の UsageMetricViewModel（上限があるときの形） */
type UsageMetric = { label: string; ratio: number }

// ラベルは toUsageViewModel と同じ（公開 docs のプラン表の言葉）
const usageMetrics: UsageMetric[] = [
  { label: '月間リクエスト数', ratio: 0.42 },
  { label: '月間 CPU 実行時間', ratio: 0.78 },
  { label: 'CDN 帯域', ratio: 0.12 },
]

// ─── wip-ui に無い部品（inline style はここに集める）───

// GAP-18: 進捗バーが無い。Typography で色を継承させ、currentColor で塗っている。
// 実物は高さ h-1.5・角丸 full・トラック bg-neutral-200。トラックの不透明度は出典の無い暫定値。
const meterTrackStyle = { height: 6, borderRadius: 3, opacity: 0.15, background: 'currentColor' }
const meterFillStyle = { height: 6, borderRadius: 3, marginTop: -6, background: 'currentColor' }

// 実物の barColorClass：0.9 以上 red-600、0.75 以上 amber-500、それ未満 neutral-800
const meterTone = (ratio: number): TypographyColor =>
  ratio >= 0.9 ? 'negative' : ratio >= 0.75 ? 'notice' : 'high_emphasis'

const Meter = ({ ratio }: { ratio: number }) => (
  <Typography component="div" color={meterTone(ratio)}>
    <div style={meterTrackStyle} />
    <div style={{ ...meterFillStyle, width: `${Math.round(Math.min(1, ratio) * 100)}%` }} />
  </Typography>
)

const DOT_COLOR: Record<StickerColor, TypographyColor> = {
  positive: 'positive',
  negative: 'negative',
  notice: 'notice',
  informative: 'informative',
  neutral: 'low_emphasis',
  attention: 'notice',
}

// GAP-NEW: 色ドット + ラベル（shared/ui/StatusIndicator）が無い。実物は lolipop の solid 色を hex で持つ。
// ここは Icon の circle を Typography の色で塗って代える。
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

// GAP-NEW: ラベルの無いドット（shared/ui/StatusDot）も無い。文言は aria-label でのみ補う
const StatusDot = ({ color, label }: { color: StickerColor; label: string }) => (
  <Typography component="span" color={DOT_COLOR[color]}>
    <Icon name="circle" size="s" color="currentColor" role="img" aria-label={label} />
  </Typography>
)

// GAP-NEW: 画面の右下に浮かせるお知らせ（フローティングのバナー）が無い。位置だけ inline style で決める。
// 実物は xl（1280px）以上で fixed right-6 bottom-6 w-60、xl 未満は本文の上の暗い 1 行のバー
// 「🏆 コンテスト開催中！グランプリ賞金100万円」に切り替わる。表示の出し分けができないので PC の形だけを写している。
const floatingStyle = { position: 'fixed', right: 24, bottom: 24, width: 240, zIndex: 20 } as const
const closeButtonStyle = { position: 'absolute', left: 8, top: 8 } as const

/** features/Projects/features/ContestNotice。応募締切（2026-12-08 23:59 JST）までで、閉じると出なくなる */
const ContestNotice = () => {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div style={floatingStyle}>
      {/* LP は別タブ。alt はリンクのアクセシブルネームを兼ねる */}
      <a href="https://lolipop.jp/deploy-now/contest/" target="_blank" rel="noopener noreferrer">
        <Paper elevation={3} padding="none">
          <img
            src={contestBanner}
            alt="デプロイナウコンテスト グランプリ賞金100万円 応募締切：2026.12.8（火）まで"
            width={240}
            height={151}
          />
        </Paper>
      </a>
      <div style={closeButtonStyle}>
        <Button
          iconOnly
          appearance="white"
          color="neutral"
          size="s"
          aria-label="お知らせを閉じる"
          onPress={() => setDismissed(true)}
        >
          <Icon name="cross" size="s" color="currentColor" />
        </Button>
      </div>
    </div>
  )
}

// ─── 使用量（features/UsageSummary/view.tsx）───

const UsageMetricCard = ({ metric }: { metric: UsageMetric }) => {
  const { ratio } = metric
  // model.ts：使用率は floor、残りは 100 - 使用率（0 未満にしない）
  const usedPercent = Math.floor(ratio * 100)
  return (
    <Stack gap="xs">
      {/* 実物は md の 3 カラムだけラベルと「残り n%」を縦積みにし、lg 以上で横並びに戻す */}
      <Stack
        flexDirection={{ xxs: 'row', m: 'column', l: 'row' }}
        gap="xs"
        justifyContent="space-between"
      >
        <Typography component="div" size="m" color="medium_emphasis">
          {metric.label}
        </Typography>
        {/* GAP-NEW: 数字の桁をそろえる指定（tabular-nums）が無い */}
        <Typography component="div" size="xs" color={ratio >= 0.9 ? 'negative' : 'medium_emphasis'}>
          残り {Math.max(0, 100 - usedPercent)}%
        </Typography>
      </Stack>
      <Typography component="div" size="xl" fontWeight="bold">
        {usedPercent}%
      </Typography>
      <Meter ratio={ratio} />
    </Stack>
  )
}

/** 使用量は取得できたときだけ出る（読み込み中・失敗・契約なしはカードごと出さない） */
const UsageSummary = () => {
  const navigate = useDeployNowNavigate()
  return (
    <Stack gap="s">
      <Typography component="h2" size="xxl">
        使用量
      </Typography>
      <Paper outlined>
        <Stack gap="m">
          <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="s" justifyContent="space-between">
            <Stack flexDirection="row" gap="s" alignItems="center">
              <Typography component="div" size="l">
                利用中のプラン：Free
              </Typography>
              <Typography component="div" size="s" color="medium_emphasis">
                （2026/10/01 ~ 2026/10/31 ご利用分）
              </Typography>
            </Stack>
            {/* 遷移先は lolipop-user のアカウント画面（課金タブ）で別タブ */}
            <Stack flexDirection="row">
              <Button
                appearance="outlined"
                color="neutral"
                size="s"
                trailing={<Icon name="launch" size="s" />}
                onPress={() => navigate('account-settings')}
              >
                プラン管理
              </Button>
            </Stack>
          </Stack>
          {/* GAP-NEW: Grid に罫線の指定が無い。実物は md 以上 3 カラム + 縦罫線（divide-x）、md 未満は横罫線 */}
          <Grid spacing="l">
            {usageMetrics.map((metric) => (
              <GridItem key={metric.label} size={{ xxs: 12, m: 4 }}>
                <UsageMetricCard metric={metric} />
              </GridItem>
            ))}
          </Grid>
        </Stack>
      </Paper>
      {/* GAP-17: 実物は md 以上で右寄せ（md:text-right）。alignItems がレスポンシブにできないので常に右寄せ */}
      <Stack alignItems="flex-end">
        <Typography component="div" size="xs" color="medium_emphasis">
          ※上限に達すると、すべてのプロジェクトが一時停止されます。
        </Typography>
      </Stack>
    </Stack>
  )
}

// ─── 一覧（features/Projects/view.tsx）───

const MAX_VISIBLE_TAGS = 3

const ProjectRow = ({ project }: { project: Project }) => {
  const navigate = useDeployNowNavigate()
  const visibleTags = project.tags.slice(0, MAX_VISIBLE_TAGS)
  const hiddenTagCount = project.tags.length - visibleTags.length
  return (
    // GAP-NEW: 行全体をリンクにする一覧（stretched link）が無い。実物は行全体を覆う
    // <Link aria-label="{name} の詳細" className="absolute inset-0"> を敷き、ドメインだけ前面に出している。
    // ここでは行の面は押せず、プロジェクト名をボタンにしている。
    // GAP-NEW: Grid に alignItems が無く、右 2 列を名前ブロックの縦中央にそろえられない
    <Grid spacing="s">
      <GridItem size={{ xxs: 12, m: 8 }}>
        <Stack gap="xxs">
          <Stack flexDirection="row" gap="xs" alignItems="center">
            <Button
              appearance="transparent"
              size="s"
              aria-label={`${project.name} の詳細`}
              onPress={() => navigate('project-deploys')}
            >
              <Typography size="m" fontWeight="bold" component="span">
                {project.name}
              </Typography>
            </Button>
            {/* サイトが今見えているか。右の「デプロイ状態」とは別の軸 */}
            <StatusDot
              color={SERVING_STATUS_COLOR[project.servingStatus]}
              label={project.servingStatus}
            />
          </Stack>
          {project.domain ? (
            // GAP-NEW: 文中のテキストリンクが無い。実物は native a + text-[#0b3893] で公開サイトを別タブで開く
            <Stack flexDirection="row">
              <Button
                appearance="transparent"
                color="interactive"
                size="s"
                trailing={<Icon name="launch" size="s" />}
              >
                {project.domain}
              </Button>
            </Stack>
          ) : (
            <Typography size="s" color="low_emphasis">
              ドメイン未発行
            </Typography>
          )}
          {project.githubRepositoryFullName && (
            // 接続リポジトリはリンクにしない（前面で押せるものをドメインだけにする）
            <Stack flexDirection="row" gap="xxs" alignItems="center">
              <Typography component="span" size="xs" color="medium_emphasis">
                <Icon name="github" size="s" color="currentColor" aria-hidden />
              </Typography>
              <Typography component="span" size="xs" color="medium_emphasis">
                {project.githubRepositoryFullName}
              </Typography>
            </Stack>
          )}
          {visibleTags.length > 0 && (
            <Stack flexDirection="row" gap="xs">
              {visibleTags.map((tag) => (
                <Sticker key={tag} color="neutral" size="s">
                  {tag}
                </Sticker>
              ))}
              {hiddenTagCount > 0 && (
                <Sticker color="neutral" size="s">
                  {`+${hiddenTagCount}`}
                </Sticker>
              )}
            </Stack>
          )}
        </Stack>
      </GridItem>
      <GridItem size={{ xxs: 6, m: 2 }}>
        <StatusIndicator color={PROJECT_STATUS_COLOR[project.status]}>
          {project.status}
        </StatusIndicator>
      </GridItem>
      <GridItem size={{ xxs: 6, m: 2 }}>
        <Stack alignItems="flex-end">
          <Typography component="div" size="s" color="medium_emphasis">
            {project.lastDeployedAt}
          </Typography>
        </Stack>
      </GridItem>
    </Grid>
  )
}

type Status = 'pending' | 'error' | 'success'

// 一覧の面は padding="none" にして区切り線を面の端まで通し、列見出しと行は padding="m" の入れ子の Paper で余白を付ける
// （Deploys の一覧と同じ組み方）。
// GAP-NEW: Paper の padding は上下左右で同じ値しか取れない。実物は列見出しが px-6 py-3、行が px-6 py-3.5 で、
// ここは 4 辺とも m（16px）になり左右が 8px 狭い。読み込み中・取得失敗（py-16）、空（p-12）は面の padding を xxl にする。
const ProjectsBody = ({ status, items }: { status: Status; items: Project[] }) => {
  const navigate = useDeployNowNavigate()
  if (status === 'pending') {
    return (
      <Stack alignItems="center">
        <Loader size="m" message="読み込み中" />
      </Stack>
    )
  }
  if (status === 'error') {
    return (
      <Stack alignItems="center">
        <Typography size="s" color="low_emphasis">
          プロジェクトの取得に失敗しました。時間をおいて再度お試しください。
        </Typography>
      </Stack>
    )
  }
  if (items.length === 0) {
    return (
      <Stack gap="m" alignItems="center">
        <Stack gap="xs" alignItems="center">
          <Typography size="m" fontWeight="bold">
            まだプロジェクトがありません
          </Typography>
          <Typography size="s" color="medium_emphasis">
            プロジェクトを作成し、アプリケーションをデプロイ
          </Typography>
        </Stack>
        <Button appearance="flat" color="neutral" size="s" onPress={() => navigate('new-project')}>
          プロジェクトを作成
        </Button>
      </Stack>
    )
  }
  return (
    <Stack>
      {/* GAP-NEW: 表示/非表示のレスポンシブ指定が無い。実物は md 未満で列見出しを隠す */}
      <Paper padding="m" elevation={0}>
        <Grid spacing="s">
          <GridItem size={{ xxs: 12, m: 8 }}>
            <Typography component="span" size="xs" color="medium_emphasis">
              プロジェクト名
            </Typography>
          </GridItem>
          <GridItem size={{ xxs: 6, m: 2 }}>
            <Typography component="span" size="xs" color="medium_emphasis">
              デプロイ状態
            </Typography>
          </GridItem>
          <GridItem size={{ xxs: 6, m: 2 }}>
            <Stack alignItems="flex-end">
              <Typography component="span" size="xs" color="medium_emphasis">
                最終デプロイ
              </Typography>
            </Stack>
          </GridItem>
        </Grid>
      </Paper>
      {items.map((p) => (
        <Stack key={p.id}>
          <Divider />
          <Paper padding="m" elevation={0}>
            <ProjectRow project={p} />
          </Paper>
        </Stack>
      ))}
    </Stack>
  )
}

/**
 * components/Pager。backend が cursor ページングなので、番号は読み込み済みのページだけ。
 * 未読込のページがあるときは「…」を出す。
 * GAP-16: Pagination が無い。実物も同じ形を手組みしている。
 */
const Pager = () => {
  const [page, setPage] = useState(1)
  const [loadedPageCount, setLoadedPageCount] = useState(1)
  // ダミー：3 ページ目まで読むと続きが無くなる
  const hasMore = loadedPageCount < 3
  const isOnLastLoaded = page >= loadedPageCount
  return (
    <Stack flexDirection="row" gap="xs" alignItems="center" justifyContent="center">
      <Button
        iconOnly
        appearance="outlined"
        size="s"
        aria-label="前のページ"
        isDisabled={page === 1}
        onPress={() => setPage(Math.max(1, page - 1))}
      >
        <Icon name="chevron_left" size="s" color="currentColor" />
      </Button>
      {Array.from({ length: loadedPageCount }, (_, i) => i + 1).map((n) => (
        <Button
          key={n}
          appearance={n === page ? 'flat' : 'outlined'}
          size="s"
          onPress={() => setPage(n)}
        >
          {n}
        </Button>
      ))}
      {hasMore && (
        <Typography component="span" size="s" color="low_emphasis">
          …
        </Typography>
      )}
      <Button
        iconOnly
        appearance="outlined"
        size="s"
        aria-label="次のページ"
        isDisabled={isOnLastLoaded && !hasMore}
        onPress={() => {
          if (isOnLastLoaded) setLoadedPageCount(loadedPageCount + 1)
          setPage(page + 1)
        }}
      >
        <Icon name="chevron_right" size="s" color="currentColor" />
      </Button>
    </Stack>
  )
}

// ─── 画面 ───

const ProjectsScreen = ({
  status = 'success',
  items = projects,
  contestNotice = true,
}: {
  status?: Status
  items?: Project[]
  contestNotice?: boolean
}) => (
  <DeployNowShell>
    <ProjectsContent status={status} items={items} contestNotice={contestNotice} />
  </DeployNowShell>
)

const ProjectsContent = ({
  status,
  items,
  contestNotice,
}: {
  status: Status
  items: Project[]
  contestNotice: boolean
}) => {
  const navigate = useDeployNowNavigate()
  // 0 件のときは empty state の「プロジェクトを作成」だけを導線にする（同じ遷移先のボタンを 2 つ並べない）
  const showCreateButton = !(status === 'success' && items.length === 0)
  // ページ送りは成功していて、2 ページ目以降があるときだけ（ダミーは 1 ページ目の先がある）
  const showPager = status === 'success' && items.length > 0
  return (
    <Stack gap="m">
      {contestNotice && <ContestNotice />}
      {/* 使用量は一覧とは別の取得。ここでは一覧が成功したときだけ取得できた体にしている */}
      {status === 'success' && <UsageSummary />}
      <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
        <Typography size="xxl" component="h1">
          プロジェクト
        </Typography>
        {showCreateButton && (
          <Button
            appearance="flat"
            color="neutral"
            size="s"
            onPress={() => navigate('new-project')}
          >
            + 新規作成
          </Button>
        )}
      </Stack>
      <Paper outlined padding={status === 'success' && items.length > 0 ? 'none' : 'xxl'}>
        <ProjectsBody status={status} items={items} />
      </Paper>
      {showPager && <Pager />}
    </Stack>
  )
}

// ─── ストーリー ───

export const Default: Story = {
  render: () => <ProjectsScreen />,
}

export const Empty: Story = {
  render: () => <ProjectsScreen items={[]} />,
}

export const LoadingAndError: Story = {
  render: () => (
    <Stack gap="xxl">
      <ProjectsScreen status="pending" />
      <ProjectsScreen status="error" contestNotice={false} />
    </Stack>
  ),
}
