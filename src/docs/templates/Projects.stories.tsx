import { Fragment, useState } from 'react'

import { Button, LinkButton } from '../../Button'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Meter } from '../../Meter'
import { Paper } from '../../Paper'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Typography } from '../../Typography'
import contestBanner from './assets/deploy-now/contest-banner.webp'
import { DeployNowShell, useDeployNowNavigate } from './deployNowShell'
import { TextLink } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { MeterColor } from '../../Meter'
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

// 実物の Typography は component を省いた p が多いが、実物は Tailwind の preflight で p の margin が 0 になる。
// この Storybook では p の既定の margin（上下 1em）が残るため、p を div（行内は span）にしている。

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

// 実物の barColorClass：0.9 以上 red-600、0.75 以上 amber-500、それ未満 neutral-800
const meterColor = (ratio: number): MeterColor =>
  ratio >= 0.9 ? 'negative' : ratio >= 0.75 ? 'notice' : 'neutral'

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

// GAP-NEW: 行全体をリンクにする一覧（stretched link）が無い。実物と同じく、行を relative にし、
// 行全体を覆う a（absolute inset-0、aria-label「{name} の詳細」）を敷き、ドメインのリンクだけ前面（z-10）に出す
const rowStyle = { position: 'relative' } as const
const stretchedLinkStyle = { position: 'absolute', inset: 0 } as const
const frontStyle = { position: 'relative', zIndex: 10, alignSelf: 'flex-start' } as const

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
    <Meter
      label={metric.label}
      value={usedPercent}
      description={`残り ${Math.max(0, 100 - usedPercent)}%`}
      color={meterColor(ratio)}
    />
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
      {/* GAP-NEW: Paper の padding は 4 辺同じ値しか取れない。実物は px-3 py-6 で、見出しの行はさらに px-5、
          各セルは p-5。ここは既定の l（24px）にし、セルの余白の分を Stack の gap と Grid の spacing で近づけている */}
      <Paper outlined>
        <Stack gap="l">
          {/* 実物は flex-wrap items-center justify-between gap-x-3 gap-y-2。
              GAP-NEW: Stack に折り返し（flex-wrap）が無いので、m 未満は縦積みに切り替えている */}
          <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="s" justifyContent="space-between">
            {/* 実物は flex-wrap items-center gap-x-3 gap-y-0.5 */}
            <Stack flexDirection="row" gap="s" alignItems="center">
              <Typography component="div" size="l">
                利用中のプラン：Free
              </Typography>
              <Typography component="div" size="s" color="medium_emphasis">
                （2026/10/01 ~ 2026/10/31 ご利用分）
              </Typography>
            </Stack>
            {/* 遷移先は lolipop-user のアカウント画面（課金タブ）で別タブ。実物は launch のアイコンを
                trailing ではなく children の中に inline-flex gap-1 で並べている */}
            <Stack flexDirection="row">
              <LinkButton
                href="#"
                appearance="outlined"
                color="neutral"
                size="s"
                onPress={() => navigate('account-settings')}
              >
                <Stack flexDirection="row" gap="xxs" alignItems="center">
                  プラン管理
                  <Icon name="launch" size="s" />
                </Stack>
              </LinkButton>
            </Stack>
          </Stack>
          {/* GAP-NEW: Grid に罫線の指定が無い。実物は md 以上 3 カラム + 縦罫線（divide-x）、md 未満は横罫線で、
              セルどうしの間は罫線の両側の p-5（計 40px）。spacing は xl（32px）にしている */}
          <Grid spacing="xl">
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
    // GAP-NEW: 実物は行に hover:bg-neutral-50 を付ける。行の面の hover が無い
    <div style={rowStyle}>
      {/* 実物の px-6 py-3.5。GAP-NEW: Paper の padding は 4 辺同じ値なので m（16px） */}
      <Paper padding="m" elevation={0}>
        {/* GAP-NEW: Grid に alignItems が無く、右 2 列を名前ブロックの縦中央にそろえられない
        実物は grid-cols-[1fr_auto_auto]（右 2 列は w-24）で、gap-y-2、md 以上は gap-x-8 gap-y-0 */}
        <Grid spacing={{ xxs: 'xs', m: 'xl' }}>
          <GridItem size={{ xxs: 12, m: 8 }}>
            {/* 実物は名前・ドメインの間に余白が無く、リポジトリは mt-0.5、タグは mt-1。
            GAP-NEW: 子ごとの余白が無いので一律 xxs（4px）にしている */}
            <Stack gap="xxs">
              <Stack flexDirection="row" gap="xs" alignItems="center">
                <Typography size="m" fontWeight="bold" component="div">
                  {project.name}
                </Typography>
                {/* サイトが今見えているか。右の「デプロイ状態」とは別の軸 */}
                <StatusDot
                  color={SERVING_STATUS_COLOR[project.servingStatus]}
                  label={project.servingStatus}
                />
              </Stack>
              {project.domain ? (
                // 実物は native a + text-sm text-[#0b3893] + launch（s）で公開サイトを別タブで開く。
                // 文中リンクの GAP は parts.tsx の TextLink に書いている
                <div style={frontStyle}>
                  <TextLink href={`https://${project.domain}`} external>
                    {project.domain}
                  </TextLink>
                </div>
              ) : (
                <Typography component="div" size="s" color="low_emphasis">
                  ドメイン未発行
                </Typography>
              )}
              {project.githubRepositoryFullName && (
                // 接続リポジトリはリンクにしない（前面で押せるものをドメインだけにする）。
                // 実物は 1 つの Typography xs medium_emphasis（span）の中にアイコンと文字を gap-1.5（6px）で並べる。
                // GAP-NEW: Typography に flex の並びが無いので Stack で並べ、gap は xxs（4px）にしている
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
                <Stack flexDirection="row" gap="xs" alignItems="center">
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
            {/* GAP-17: 実物は md 以上だけ右寄せ（md:text-right）。md 未満は行の右端に置く（justify-between）ので結果は同じ */}
            <Stack alignItems="flex-end">
              <Typography component="div" size="s" color="medium_emphasis">
                {project.lastDeployedAt}
              </Typography>
            </Stack>
          </GridItem>
        </Grid>
      </Paper>
      {/* biome-ignore lint/a11y/useAnchorContent lint/a11y/useValidAnchor: 実物の stretched link（Next の Link）と同じく、遷移は onClick で行い、名前は aria-label で付け、面は行全体を覆うだけにする */}
      <a
        href="#"
        aria-label={`${project.name} の詳細`}
        style={stretchedLinkStyle}
        onClick={(e) => {
          e.preventDefault()
          navigate('project-deploys')
        }}
      />
    </div>
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
        <Typography component="div" size="s" color="low_emphasis">
          プロジェクトの取得に失敗しました。時間をおいて再度お試しください。
        </Typography>
      </Stack>
    )
  }
  if (items.length === 0) {
    return (
      // 実物は flex-col items-center gap-5 p-12 text-center。GAP-NEW: gap-5（20px）は段階に無く m（16px）にしている
      <Stack gap="m" alignItems="center">
        <Stack gap="xs" alignItems="center">
          <Typography component="div" size="m" fontWeight="bold">
            まだプロジェクトがありません
          </Typography>
          <Typography component="div" size="s" color="medium_emphasis">
            プロジェクトを作成し、アプリケーションをデプロイ
          </Typography>
        </Stack>
        <LinkButton
          href="#"
          appearance="flat"
          color="neutral"
          size="s"
          onPress={() => navigate('new-project')}
        >
          プロジェクトを作成
        </LinkButton>
      </Stack>
    )
  }
  // 列見出し・区切り線・行は Stack に入れず、外側の Paper の中に直接積む（Stack の gap の初期値 m で区切り線の上下が空くため）
  return (
    <>
      {/* GAP-NEW: 表示/非表示のレスポンシブ指定が無い。実物は md 未満で列見出しを隠す */}
      <Paper padding="m" elevation={0}>
        <Grid spacing={{ xxs: 'xs', m: 'xl' }}>
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
        <Fragment key={p.id}>
          <Divider />
          <ProjectRow project={p} />
        </Fragment>
      ))}
    </>
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
          <LinkButton
            href="#"
            appearance="flat"
            color="neutral"
            size="s"
            onPress={() => navigate('new-project')}
          >
            + 新規作成
          </LinkButton>
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
