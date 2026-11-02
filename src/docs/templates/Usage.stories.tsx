import { useState } from 'react'

import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Paper } from '../../Paper'
import { Select, SelectItem } from '../../Select'
import { Stack } from '../../Stack'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../Table'
import { Typography } from '../../Typography'
import { AppShell } from './AppShell'
import { Card, Inset, PageHeader } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { SortDescriptor } from 'react-aria-components'
import type { TypographyColor } from '../../Typography'

/**
 * 使用状況。2 つの実画面を 1 ページに置いている。
 * - AI ゲートウェイの組織の「使用状況」：octane/admin-ui/src/features/AccountUsage と
 *   shared/ui/UsageCharts・UsagePeriodFilter・RetryCallout。ページ見出し「使用状況」と説明・期間・CSV は実物のまま
 * - その下にデプロイナウの「使用量」：hosting-deploy-now/frontend/features/Projects/features/UsageSummary（view.tsx・model.ts）
 * - 内訳の表の行を押すと、AI ゲートウェイのプロジェクトの「使用状況」（features/ProjectUsage）に切り替わる
 *
 * 見出しは実物のものだけを使う。どちらのアプリも「使用状況」「使用量」をページの見出しにしている。
 */

const meta = {
  title: 'Templates/Usage',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// 削った状態（読み込み中・CSV の失敗など）にあった GAP の記録
// GAP-NEW: Skeleton が無い。実装は読み込み中にグラフの骨格（SkeletonRegion）と列見出しだけの表の骨格（SkeletonTable）を出す

/**
 * AccountUsage の ViewState のうち、画面の見た目が大きく変わるもの。
 * empty は success の中の場合（期間内の利用が無い）
 */
type ViewState = 'success' | 'empty' | 'error'

// ─── デプロイナウ：使用量（UsageSummary）───

// ラベルは model.ts の toUsageViewModel と同じ。使用率は floor、残りは 100 - 使用率
const deployMetrics = [
  { label: '月間リクエスト数', ratio: 0.42 },
  { label: '月間 CPU 実行時間', ratio: 0.78 },
  { label: 'CDN 帯域', ratio: 0.12 },
]

// GAP-18: 進捗バーが無い。Typography の色を継承した div で代用している。
// 実物は Tailwind の bg-neutral-800 / bg-amber-500 / bg-red-600 を直書きし、閾値は 75% / 90%。
const meterTrackStyle = { height: 6, borderRadius: 3, background: 'currentColor', opacity: 0.15 }
const DeployMeter = ({ ratio }: { ratio: number }) => {
  const tone: TypographyColor =
    ratio >= 0.9 ? 'negative' : ratio >= 0.75 ? 'notice' : 'high_emphasis'
  return (
    <Typography component="div" color={tone}>
      <div style={meterTrackStyle} />
      <div
        style={{
          height: 6,
          borderRadius: 3,
          marginTop: -6,
          width: `${Math.min(ratio, 1) * 100}%`,
          background: 'currentColor',
        }}
      />
    </Typography>
  )
}

const DeployUsageSummary = () => (
  <Stack gap="s">
    <Typography component="h2" size="xxl">
      使用量
    </Typography>
    <Card outlined elevation={0}>
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
          {/* 実物は lolipop-user の課金タブへの LinkButton（別タブ） */}
          <Button
            appearance="outlined"
            color="neutral"
            size="s"
            trailing={<Icon name="launch" size="s" aria-hidden="true" />}
          >
            プラン管理
          </Button>
        </Stack>
        {/* 実物は md 以上 3 カラム + 縦罫線、md 未満は横罫線。GAP-NEW: Grid に罫線（divide）の指定が無い */}
        <Grid spacing="l">
          {deployMetrics.map((metric) => {
            const usedPercent = Math.floor(metric.ratio * 100)
            return (
              <GridItem key={metric.label} size={{ xxs: 12, m: 4 }}>
                <Stack gap="xs">
                  <Stack flexDirection="row" gap="xs" justifyContent="space-between">
                    <Typography component="div" size="m" color="medium_emphasis">
                      {metric.label}
                    </Typography>
                    <Typography
                      component="div"
                      size="xs"
                      color={metric.ratio >= 0.9 ? 'negative' : 'medium_emphasis'}
                    >
                      残り {100 - usedPercent}%
                    </Typography>
                  </Stack>
                  {/* GAP-NEW: 数字の桁をそろえる指定（tabular-nums）が無い */}
                  <Typography component="div" size="xl" fontWeight="bold">
                    {usedPercent}%
                  </Typography>
                  <DeployMeter ratio={metric.ratio} />
                </Stack>
              </GridItem>
            )
          })}
        </Grid>
      </Stack>
    </Card>
    {/* GAP-17: 実物は md 以上で右寄せ（md:text-right）。alignItems がレスポンシブにできない */}
    <Stack alignItems="flex-end">
      <Typography component="div" size="xs" color="medium_emphasis">
        ※上限に達すると、すべてのプロジェクトが一時停止されます。
      </Typography>
    </Stack>
  </Stack>
)

// ─── AI ゲートウェイ：データ（形は shared/lib/usageDashboard の UsageTotals。値はダミー）───

const days = ['10/24', '10/25', '10/26', '10/27', '10/28', '10/29', '10/30']
/** 日ごとの重み。期間の合計を日に割り振るのに使う */
const dayWeights = [0.8, 0.7, 1.4, 1.6, 1.3, 1.2, 1.1]
const weightSum = dayWeights.reduce((a, w) => a + w, 0)

type Totals = {
  requests: number
  fallback: number
  guardrail: number
  input: number
  cacheRead: number
  cacheCreation: number
  output: number
  text: number
  image: number
  byok: number
}

const orgTotals: Totals = {
  requests: 18204,
  fallback: 212,
  guardrail: 37,
  input: 35402564,
  cacheRead: 12080440,
  cacheCreation: 1920006,
  output: 7515766,
  text: 4612,
  image: 0,
  byok: 0,
}

const scale = (share: number, extra: Partial<Totals> = {}): Totals => ({
  requests: Math.round(orgTotals.requests * share),
  fallback: Math.round(orgTotals.fallback * share),
  guardrail: Math.round(orgTotals.guardrail * share),
  input: Math.round(orgTotals.input * share),
  cacheRead: Math.round(orgTotals.cacheRead * share),
  cacheCreation: Math.round(orgTotals.cacheCreation * share),
  output: Math.round(orgTotals.output * share),
  text: Math.round(orgTotals.text * share),
  image: 0,
  byok: 0,
  ...extra,
})

type Entry = { key: string; label: string; totals: Totals }

/** usageDashboard の accountScopeLabel。プロジェクトに属さない利用で、行を押しても移らない */
const ACCOUNT_SCOPE = 'アカウント直下'

const projectEntries: Entry[] = [
  { key: 'p-production', label: 'production', totals: scale(0.52) },
  { key: 'p-staging', label: 'staging', totals: scale(0.14) },
  { key: 'p-deploy', label: 'デプロイ用', totals: scale(0.08) },
  { key: 'p-chatbot', label: '社内チャットbot', totals: scale(0.06) },
  { key: 'p-search', label: '検索の試作', totals: scale(0.05) },
  { key: 'p-image', label: '画像生成デモ', totals: scale(0.04, { image: 318 }) },
  { key: 'p-campaign', label: '夏のキャンペーン', totals: scale(0.03) },
  { key: 'p-minutes', label: '議事録要約', totals: scale(0.025) },
  { key: 'p-support', label: 'サポート返信案', totals: scale(0.02) },
  { key: 'p-translate', label: '翻訳バッチ', totals: scale(0.015) },
  { key: 'p-report', label: '分析レポート', totals: scale(0.01) },
  { key: 'p-migrate', label: '旧API移行', totals: scale(0.005) },
  { key: 'account', label: ACCOUNT_SCOPE, totals: scale(0.01) },
]

const modelEntries: Entry[] = [
  { key: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6', totals: scale(0.45) },
  { key: 'gpt-5.6', label: 'GPT-5.6', totals: scale(0.25) },
  { key: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', totals: scale(0.15, { image: 318 }) },
  { key: 'claude-haiku-4-5', label: 'Claude Haiku 4.5', totals: scale(0.1) },
  { key: 'gpt-5.6-mini', label: 'GPT-5.6 mini', totals: scale(0.05) },
]

/** プロジェクトの APIキー別内訳。名前の無いキーは「キー未特定」、一覧に無いキーは「削除されたキー」で、どちらも押せない */
const keyEntries: (Entry & { disabled?: boolean })[] = [
  { key: 'k-main', label: 'production-main', totals: scale(0.3) },
  { key: 'k-worker', label: 'batch-worker', totals: scale(0.14) },
  { key: 'k-ci', label: 'ci', totals: scale(0.05) },
  { key: 'k-removed', label: '削除されたキー', totals: scale(0.02), disabled: true },
  { key: '__unnamed__', label: 'キー未特定', totals: scale(0.01), disabled: true },
]

const zeroTotals: Totals = scale(0)

const count = (n: number) => Math.round(n).toLocaleString('ja-JP')
const jpy = (n: number) => `¥${Math.round(n).toLocaleString('ja-JP')}`
const charge = (t: Totals) => jpy(t.text + t.image)
const normalInput = (t: Totals) => t.input - t.cacheRead - t.cacheCreation
const hitRate = (t: Totals) =>
  `${t.input === 0 ? '0.0' : ((t.cacheRead / t.input) * 100).toFixed(1)}%`

// ─── AI ゲートウェイ：グラフ（shared/ui/UsageCharts）───

type SeriesKey = 'jpy' | 'requests' | 'tokens'

type Series = {
  key: SeriesKey
  title: string
  valueOf: (t: Totals) => number
  format: (n: number) => string
}

/** seriesFor。金額の見出しは前払いが「利用額」 */
const series: Series[] = [
  { key: 'jpy', title: '利用額', valueOf: (t) => t.text + t.image, format: jpy },
  { key: 'requests', title: 'リクエスト数', valueOf: (t) => t.requests, format: count },
  { key: 'tokens', title: 'トークン数', valueOf: (t) => t.input + t.output, format: count },
]

/** 棒を積む上位の数（shownEntries）。残りは「その他」として 1 段にまとめる */
const SHOWN_ENTRIES = 3

// GAP-NEW: グラフの系列に使うカテゴリ色のトークンが無い。実装は styles.module.css に 4 段ぶんの色を持つ。
// ここでは Typography の色を 4 つ流用している
const segmentTones: TypographyColor[] = ['informative', 'positive', 'notice', 'low_emphasis']

// GAP-19: グラフの primitive が無い。日ごとの列に段を積み上げた div を置いている。
// 実装の UsageCharts は SVG のパス・ホバーのポップオーバー（ChartPopover）を持つ
const PLOT_HEIGHT = 96
const plotStyle = { display: 'flex', alignItems: 'flex-end', gap: 6, height: PLOT_HEIGHT }
const columnStyle = { flex: 1, display: 'flex', flexDirection: 'column-reverse' as const, gap: 1 }

const UsageChart = ({ series, entries }: { series: Series; entries: Entry[] }) => {
  const ranked = [...entries].sort((a, b) => series.valueOf(b.totals) - series.valueOf(a.totals))
  const top = ranked.slice(0, SHOWN_ENTRIES)
  const periodValue = entries.reduce((sum, e) => sum + series.valueOf(e.totals), 0)
  const sumOf = (pick: (t: Totals) => number) => entries.reduce((n, e) => n + pick(e.totals), 0)
  const all: Totals = {
    ...zeroTotals,
    input: sumOf((t) => t.input),
    cacheRead: sumOf((t) => t.cacheRead),
    cacheCreation: sumOf((t) => t.cacheCreation),
    output: sumOf((t) => t.output),
  }
  // トークン数だけは内訳の軸に関わらず種別（通常入力・キャッシュ読み取り・キャッシュ作成・出力）で積む
  const parts =
    series.key === 'tokens'
      ? [normalInput(all), all.cacheRead, all.cacheCreation, all.output]
      : [
          ...top.map((e) => series.valueOf(e.totals)),
          periodValue - top.reduce((sum, e) => sum + series.valueOf(e.totals), 0),
        ]
  const peak = Math.max(...dayWeights) / weightSum
  return (
    <Card outlined elevation={0}>
      <Stack gap="s">
        <Typography size="xs" color="medium_emphasis" fontWeight="bold" component="div">
          {series.title}
        </Typography>
        {/* GAP-NEW: Money（小数部を小さく薄くする）が無い */}
        <Typography size="xxl" fontWeight="bold" component="div">
          {series.format(periodValue)}
        </Typography>
        {periodValue === 0 ? (
          <Stack alignItems="center" justifyContent="center">
            <Typography size="xs" color="medium_emphasis" component="span">
              この期間の{series.title}はありません
            </Typography>
          </Stack>
        ) : (
          <div style={plotStyle} aria-hidden="true">
            {dayWeights.map((w, di) => (
              <div key={days[di]} style={columnStyle}>
                {parts.map((part, pi) =>
                  part <= 0 ? null : (
                    <Typography
                      // biome-ignore lint/suspicious/noArrayIndexKey: 段の順は固定
                      key={pi}
                      component="div"
                      color={segmentTones[pi]}
                    >
                      <div
                        style={{
                          height: ((part / periodValue) * (w / weightSum) * PLOT_HEIGHT) / peak,
                          borderRadius: 2,
                          background: 'currentColor',
                        }}
                      />
                    </Typography>
                  )
                )}
              </div>
            ))}
          </div>
        )}
        <Stack flexDirection="row" justifyContent="space-between">
          {days.map((d) => (
            <Typography key={d} size="xxs" color="low_emphasis" component="span">
              {d}
            </Typography>
          ))}
        </Stack>
        {/* Breakdown：上位 3 件の名前と値。期間の値が 0 のときは出さない */}
        {periodValue > 0 && (
          <>
            <Divider />
            <Stack gap="xxs">
              {top.map((e) => (
                <Stack key={e.key} flexDirection="row" justifyContent="space-between" gap="s">
                  {/* GAP-NEW: モデルの提供元アイコン（ProviderIcon）と説明の InfoTip が無い */}
                  <Typography size="xs" component="span">
                    {e.label}
                  </Typography>
                  <Typography size="xs" fontWeight="bold" component="span">
                    {series.format(series.valueOf(e.totals))}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Card>
  )
}

// GAP-NEW: SegmentedControl が無い（shared/ui/SegmentedControl）。選択中を flat、ほかを outlined にして並べる
const Segmented = <T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) => (
  <Stack flexDirection="row" gap="xxs" alignItems="center">
    {options.map((o) => (
      <Button
        key={o.id}
        size="s"
        appearance={o.id === value ? 'flat' : 'outlined'}
        aria-label={`${label}: ${o.label}`}
        onPress={() => onChange(o.id)}
      >
        {o.label}
      </Button>
    ))}
  </Stack>
)

/** shared/ui/RetryCallout */
const RetryCallout = ({ message }: { message: string }) => (
  <Callout
    color="negative"
    action={
      <Button appearance="transparent" color="neutral" size="s">
        再読み込みする
      </Button>
    }
  >
    {message}
  </Callout>
)

/** h2 の見出しと右のコントロール（sectionHead） */
const SectionHead = ({ title, action }: { title: string; action?: ReactNode }) => (
  <Stack flexDirection="row" gap="m" alignItems="center" justifyContent="space-between">
    <Typography component="h2" size="xl" fontWeight="bold">
      {title}
    </Typography>
    {action}
  </Stack>
)

/** shared/ui/UsageCharts の DailyChartsSection */
const DailyChartsSection = ({
  modelBreakdown,
  projectBreakdown,
}: {
  modelBreakdown: Entry[]
  /** 渡したときだけ「モデル別 / プロジェクト別」が出る。プロジェクトが 0 件の組織とプロジェクトの画面では渡さない */
  projectBreakdown?: Entry[]
}) => {
  const [axis, setAxis] = useState<'model' | 'project'>('model')
  const entries = axis === 'project' && projectBreakdown ? projectBreakdown : modelBreakdown
  return (
    <Stack gap="m">
      <SectionHead
        title="使用状況の推移"
        action={
          projectBreakdown && (
            <Segmented
              label="内訳"
              options={[
                { id: 'model', label: 'モデル別' },
                { id: 'project', label: 'プロジェクト別' },
              ]}
              value={axis}
              onChange={setAxis}
            />
          )
        }
      />
      <Grid spacing="m">
        {series.map((s) => (
          <GridItem key={s.key} size={{ xxs: 12, l: 4 }}>
            <UsageChart series={s} entries={entries} />
          </GridItem>
        ))}
      </Grid>
    </Stack>
  )
}

// GAP-NEW: Table のセルに 2 段目の補足（DataTableText tone="secondary"）を置く型が無く、
// 数値の右寄せ（align="end"）も無い。Stack で縦に積み、右寄せにしている。列見出しは左寄せのまま
const Lines = ({ primary, secondary = [] }: { primary: string; secondary?: string[] }) => (
  <Stack gap="xxs" alignItems="flex-end">
    <Typography size="s" component="span">
      {primary}
    </Typography>
    {secondary.map((line) => (
      <Typography key={line} size="xs" color="medium_emphasis" component="span">
        {line}
      </Typography>
    ))}
  </Stack>
)

type SortColumn =
  | 'name'
  | 'requests'
  | 'fallback'
  | 'guardrail'
  | 'input'
  | 'output'
  | 'byok'
  | 'text'
  | 'image'
  | 'charge'

const sortValue = (t: Totals, column: SortColumn): number => {
  switch (column) {
    case 'requests':
      return t.requests
    case 'fallback':
      return t.fallback
    case 'guardrail':
      return t.guardrail
    case 'input':
      return t.input
    case 'output':
      return t.output
    case 'byok':
      return t.byok
    case 'text':
      return t.text
    case 'image':
      return t.image
    default:
      return t.text + t.image
  }
}

const sortEntries = <T extends Entry>(entries: T[], sort: SortDescriptor): T[] => {
  const column = String(sort.column) as SortColumn
  const sign = sort.direction === 'ascending' ? 1 : -1
  return [...entries].sort((a, b) => {
    const byName = a.label.localeCompare(b.label, 'ja')
    if (column === 'name') return sign * byName
    const d = sortValue(a.totals, column) - sortValue(b.totals, column)
    return d === 0 ? byName : sign * d
  })
}

/** 上位だけ出す件数（shownProjects） */
const SHOWN_PROJECTS = 10

// 実装の DataTable は角丸の枠と横スクロールを持つ
const TableFrame = ({ children }: { children: ReactNode }) => (
  <Paper elevation={0} outlined>
    {children}
  </Paper>
)

/** features/AccountUsage の BreakdownSection */
const ProjectBreakdownSection = ({
  entries,
  onOpenProject,
}: {
  entries: Entry[]
  onOpenProject: (entry: Entry) => void
}) => {
  const [sort, setSort] = useState<SortDescriptor>({ column: 'charge', direction: 'descending' })
  const [expanded, setExpanded] = useState(false)
  const sorted = sortEntries(entries, sort)
  const shown = expanded ? sorted : sorted.slice(0, SHOWN_PROJECTS)
  const hidden = sorted.length - shown.length
  return (
    <Stack gap="m">
      <SectionHead title="プロジェクト別内訳" />
      <TableFrame>
        {/* GAP-NEW: 並べ替えの印（sortable の矢印）と先頭列の固定が無い。並べ替え自体は効く */}
        <Table
          aria-label="プロジェクト別内訳"
          sortDescriptor={sort}
          onSortChange={setSort}
          onRowAction={(key) => {
            const entry = entries.find((e) => e.key === key)
            if (entry && entry.label !== ACCOUNT_SCOPE) onOpenProject(entry)
          }}
        >
          <TableHeader>
            <Column id="name" isRowHeader allowsSorting>
              プロジェクト
            </Column>
            <Column id="requests" allowsSorting>
              リクエスト
            </Column>
            <Column id="input" allowsSorting>
              入力トークン
            </Column>
            <Column id="output" allowsSorting>
              出力トークン
            </Column>
            <Column id="cache">キャッシュ</Column>
            <Column id="byok" allowsSorting>
              BYOK目安額
            </Column>
            <Column id="text" allowsSorting>
              テキスト生成
            </Column>
            <Column id="image" allowsSorting>
              画像生成
            </Column>
            <Column id="charge" allowsSorting>
              利用額
            </Column>
          </TableHeader>
          {/* GAP-NEW: EmptyState（DataTableEmpty）が無い */}
          <TableBody
            renderEmptyState={() => (
              <Inset>
                <Typography size="s" fontWeight="bold" component="h3">
                  この期間の使用状況はありません
                </Typography>
              </Inset>
            )}
          >
            {shown.map((e) => (
              <Row key={e.key} id={e.key}>
                <Cell>{e.label}</Cell>
                <Cell>
                  <Lines
                    primary={count(e.totals.requests)}
                    secondary={[
                      `フォールバック ${count(e.totals.fallback)}`,
                      `ガードレール ${count(e.totals.guardrail)}`,
                    ]}
                  />
                </Cell>
                <Cell>
                  <Lines
                    primary={count(e.totals.input)}
                    secondary={[`通常 ${count(normalInput(e.totals))}`]}
                  />
                </Cell>
                <Cell>
                  <Lines primary={count(e.totals.output)} />
                </Cell>
                <Cell>
                  <Lines
                    primary={`読み取り ${count(e.totals.cacheRead)}`}
                    secondary={[
                      `作成 ${count(e.totals.cacheCreation)}`,
                      `ヒット率 ${hitRate(e.totals)}`,
                    ]}
                  />
                </Cell>
                <Cell>
                  <Lines primary={jpy(e.totals.byok)} />
                </Cell>
                <Cell>
                  <Lines primary={jpy(e.totals.text)} />
                </Cell>
                <Cell>
                  <Lines primary={jpy(e.totals.image)} />
                </Cell>
                <Cell>
                  <Lines primary={charge(e.totals)} />
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
        {/* DataTable の footer */}
        {(hidden > 0 || expanded) && (
          <Inset>
            <Stack alignItems="center">
              <Button
                appearance="transparent"
                color="neutral"
                size="s"
                onPress={() => setExpanded(!expanded)}
              >
                {expanded ? `上位${SHOWN_PROJECTS}件だけ表示する` : `残り${hidden}件を表示する`}
              </Button>
            </Stack>
          </Inset>
        )}
      </TableFrame>
    </Stack>
  )
}

/** features/ProjectUsage の KeyBreakdownSection */
const KeyBreakdownSection = ({ entries }: { entries: typeof keyEntries }) => {
  const [sort, setSort] = useState<SortDescriptor>({ column: 'charge', direction: 'descending' })
  const sorted = sortEntries(entries, sort)
  return (
    <Stack gap="m">
      <SectionHead title="APIキー別内訳" />
      <TableFrame>
        {/* GAP-NEW: 並べ替えの印と先頭列の固定（stickyFirstColumn）が無い。行を押すと API キーの詳細に移る */}
        <Table
          aria-label="APIキー別内訳"
          sortDescriptor={sort}
          onSortChange={setSort}
          onRowAction={() => {}}
        >
          <TableHeader>
            <Column id="name" isRowHeader allowsSorting>
              APIキー
            </Column>
            <Column id="requests" allowsSorting>
              リクエスト
            </Column>
            <Column id="fallback" allowsSorting>
              フォールバック
            </Column>
            <Column id="guardrail" allowsSorting>
              ガードレール
            </Column>
            <Column id="input" allowsSorting>
              入力トークン
            </Column>
            <Column id="output" allowsSorting>
              出力トークン
            </Column>
            <Column id="text" allowsSorting>
              テキスト生成
            </Column>
            <Column id="image" allowsSorting>
              画像生成
            </Column>
            <Column id="charge" allowsSorting>
              利用額
            </Column>
          </TableHeader>
          <TableBody>
            {sorted.map((e) => (
              <Row key={e.key} id={e.key} isDisabled={e.disabled}>
                {/* GAP-20: 実物はキー名を等幅（styles.keyName）で出す */}
                <Cell>{e.label}</Cell>
                <Cell>
                  <Lines primary={count(e.totals.requests)} />
                </Cell>
                <Cell>
                  <Lines primary={count(e.totals.fallback)} />
                </Cell>
                <Cell>
                  <Lines primary={count(e.totals.guardrail)} />
                </Cell>
                <Cell>
                  <Lines primary={count(e.totals.input)} />
                </Cell>
                <Cell>
                  <Lines primary={count(e.totals.output)} />
                </Cell>
                <Cell>
                  <Lines primary={jpy(e.totals.text)} />
                </Cell>
                <Cell>
                  <Lines primary={jpy(e.totals.image)} />
                </Cell>
                <Cell>
                  <Lines primary={charge(e.totals)} />
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </TableFrame>
    </Stack>
  )
}

/** 期間（shared/ui/UsagePeriodFilter。既定は 7日） */
const UsagePeriodFilter = () => (
  // GAP-NEW: 実物は暦のアイコン付きのメニュー（ListFilterMenu）。Menu が無いので Select で代用し、アイコンも差せない
  <Select aria-label="期間" size="s" defaultSelectedKey="7d">
    <SelectItem id="24h">24時間</SelectItem>
    <SelectItem id="7d">7日</SelectItem>
    <SelectItem id="14d">14日</SelectItem>
    <SelectItem id="30d">30日</SelectItem>
  </Select>
)

/** features/AccountUsage。読み込みに失敗すると、グラフも表も出さずに RetryCallout だけになる */
const AccountUsage = ({
  view,
  onOpenProject,
}: {
  view: ViewState
  onOpenProject: (entry: Entry) => void
}) => {
  const empty = view === 'empty'
  const loaded = view !== 'error'
  const projects = empty ? [] : projectEntries
  const models = empty ? [] : modelEntries
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'ホーム', href: '#' }, { label: '使用状況' }]}
        title="使用状況"
        description="組織全体の利用の推移とプロジェクト別の内訳を確認します"
        actions={
          <>
            <UsagePeriodFilter />
            {loaded && (
              <Button
                appearance="outlined"
                color="neutral"
                size="s"
                leading={<Icon name="download" size="s" aria-hidden="true" />}
              >
                CSVをダウンロードする
              </Button>
            )}
          </>
        }
      />
      {loaded ? (
        <>
          <DailyChartsSection
            modelBreakdown={models}
            projectBreakdown={projects.length > 0 ? projects : undefined}
          />
          <ProjectBreakdownSection entries={projects} onOpenProject={onOpenProject} />
        </>
      ) : (
        <RetryCallout message="使用状況を読み込めませんでした。" />
      )}
    </>
  )
}

/** features/ProjectUsage。期間はあるが、CSV と「モデル別 / プロジェクト別」は無い */
const ProjectUsage = ({ project }: { project: Entry }) => {
  // モデル別の割合は組織と同じにして、プロジェクトの量に縮める
  const projectShare = project.totals.requests / orgTotals.requests
  const models = modelEntries.map((m) => ({
    ...m,
    totals: scale(projectShare * (m.totals.requests / orgTotals.requests)),
  }))
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: 'ホーム', href: '#' },
          { label: '使用状況', href: '#' },
          { label: project.label },
        ]}
        title="使用状況"
        description="このプロジェクトの利用の推移とAPIキー別の内訳を確認します"
        actions={<UsagePeriodFilter />}
      />
      <DailyChartsSection modelBreakdown={models} />
      <KeyBreakdownSection entries={keyEntries} />
    </>
  )
}

// ─── 画面 ───

const UsageScreen = ({
  view = 'success',
  initialProject,
}: {
  view?: ViewState
  /** プロジェクトの使用状況から始める */
  initialProject?: Entry
}) => {
  const [project, setProject] = useState<Entry | undefined>(initialProject)
  return (
    <AppShell active="usage">
      {project ? (
        <ProjectUsage project={project} />
      ) : (
        <>
          <AccountUsage view={view} onOpenProject={setProject} />
          <Divider />
          {/* デプロイナウの使用量は別の取得で、取得できたときだけ出る（Home の UsageError を参照） */}
          <DeployUsageSummary />
        </>
      )}
    </AppShell>
  )
}

// ─── ストーリー ───

/**
 * AI ゲートウェイの組織の使用状況（期間・CSV・推移・プロジェクト別内訳）と、その下にデプロイナウの今月の使用量。
 *
 * - 推移の「モデル別 / プロジェクト別」で棒の積み方とカード下の上位 3 件が切り替わる。トークン数だけは常に種別で積む
 * - 内訳の表は利用額の多い順に上位 10 件で、「残りn件を表示する」で全部出る。列見出しを押すと並べ替わる
 * - 行を押すとそのプロジェクトの使用状況に移る（アカウント直下の行は移らない）
 *
 * 進捗バーと積み上げ棒グラフは wip-ui に無いため、Typography で色を継承した div で代用している
 * （GAP-18 / GAP-19）。
 *
 * @summary AI ゲートウェイとサイトの使用状況
 */
export const Default: Story = {
  render: () => <UsageScreen />,
}

/**
 * プロジェクトの使用状況（features/ProjectUsage）。組織の画面から行を押すとここに来る。
 * 推移は「モデル別 / プロジェクト別」の切り替えが無く、表は APIキー別。
 * 名前の無いキー（キー未特定）と、一覧から消えたキー（削除されたキー）の行は押せない。
 *
 * @summary プロジェクトの使用状況
 */
export const ProjectUsageStory: Story = {
  name: 'ProjectUsage',
  render: () => <UsageScreen initialProject={projectEntries[0]} />,
}

/**
 * 選んだ期間に AI ゲートウェイの利用が無いとき。推移は各グラフに「この期間の〜はありません」、
 * 内訳は表の中に一行を出す。プロジェクトが無いので「モデル別 / プロジェクト別」も消える。
 *
 * @summary 利用が無い期間
 */
export const Empty: Story = {
  render: () => <UsageScreen view="empty" />,
}

/**
 * AI ゲートウェイの使用状況を読み込めなかったとき。グラフも表も出さず、RetryCallout だけになる。
 *
 * @summary 使用状況の読み込みエラー
 */
export const LoadError: Story = {
  render: () => <UsageScreen view="error" />,
}
