import { useState } from 'react'

import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Menu, MenuItem, MenuTrigger } from '../../Menu'
import { Paper } from '../../Paper'
import { Stack } from '../../Stack'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../Table'
import { Typography } from '../../Typography'
import {
  AiGatewayShell,
  navigateToAiGatewayStory,
  PageContainer,
  PageHeader,
} from './aiGatewayShell'
import claudeLogo from './assets/ai-gateway/providers/claude.svg'
import geminiLogo from './assets/ai-gateway/providers/gemini.svg'
import openaiLogo from './assets/ai-gateway/providers/openai.svg'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { SortDescriptor } from 'react-aria-components'

/**
 * 使用状況。AI ゲートウェイの実画面を写している。
 * - 組織の「使用状況」：octane/admin-ui/src/features/AccountUsage と
 *   shared/ui/UsageCharts・UsagePeriodFilter・RetryCallout。ページ見出し「使用状況」と説明・期間・CSV は実物のまま
 * - 内訳の表の行を押すと、プロジェクトの「使用状況」（features/ProjectUsage）に切り替わる
 *
 * デプロイナウの「使用量」（features/Projects/features/UsageSummary）は、実アプリではプロジェクト一覧の
 * 上にしか無いので、Projects.stories.tsx に置いている。
 */

const meta = {
  title: 'Templates/AiGateway/Usage',
  // テンプレートはロリポップのトンマナを確かめる場所なので、フレーバーを lolipop に固定する
  globals: { flavor: 'lolipop' },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
  // 画面の部品は Templates/AiGateway/App から使うために export している。ストーリーとしては数えない
  excludeStories: /Screen$|^productionUsage$/,
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

// ─── AI ゲートウェイ：データ（形は shared/lib/usageDashboard の UsageTotals。値はダミー）───

/** 7日の期間の各日（usagePeriodBuckets）。軸の目盛りは bucketLabel のとおり日だけで、月の 1 日だけ「月/日」 */
const days = ['29', '30', '31', '11/1', '2', '3', '4']
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

/** logo はモデル別の内訳で名前の前に出す提供元のロゴ（ProviderIcon） */
type Entry = { key: string; label: string; totals: Totals; logo?: string }

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
  { key: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6', totals: scale(0.45), logo: claudeLogo },
  { key: 'gpt-5.6', label: 'GPT-5.6', totals: scale(0.25), logo: openaiLogo },
  {
    key: 'gemini-2.5-pro',
    label: 'Gemini 2.5 Pro',
    totals: scale(0.15, { image: 318 }),
    logo: geminiLogo,
  },
  { key: 'claude-haiku-4-5', label: 'Claude Haiku 4.5', totals: scale(0.1), logo: claudeLogo },
  { key: 'gpt-5.6-mini', label: 'GPT-5.6 mini', totals: scale(0.05), logo: openaiLogo },
]

/** プロジェクトの APIキー別内訳。名前の無いキーは「キー未特定」、一覧に無いキーは「削除されたキー」で、どちらも押せない */
const keyEntries: (Entry & { disabled?: boolean })[] = [
  { key: 'k-main', label: 'production-main', totals: scale(0.3) },
  { key: 'k-worker', label: 'batch-worker', totals: scale(0.14) },
  { key: 'k-ci', label: 'ci', totals: scale(0.05) },
  { key: 'k-removed', label: '削除されたキー', totals: scale(0.02), disabled: true },
  { key: '__unnamed__', label: 'キー未特定', totals: scale(0.01), disabled: true },
]

/** Templates/AiGateway/App でプロジェクトの使用状況を開くときの production */
export const productionUsage = projectEntries[0]

const zeroTotals: Totals = scale(0)

const count = (n: number) => Math.round(n).toLocaleString('ja-JP')
/** formatUsageJpy（Intl の ja-JP・JPY。¥1 以上は整数） */
const jpy = (n: number) =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(Math.round(n))
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

// GAP-NEW: グラフの系列に使うカテゴリ色のトークンが無い。実装の styles.module.css の 4 段ぶんの色
// （barCacheNormal・barCacheRead・barCacheCreation・barCacheOutput）を、グラフの部品の中だけで生の値で持つ
const segmentFills = [
  '#0f78c6', // lolipopColors.blue[600]
  '#3da7f9', // lolipopColors.blue[400]
  '#00835f', // lolipopColors.green[600]
  '#6ec0a1', // lolipopColors.green[300]
]

// GAP-19: グラフの primitive が無い。日ごとの列に段を積み上げた div を置いている。
// 実装の UsageCharts は SVG のパス（棒 28px・間 12px を幅いっぱいに伸ばす）・ホバーのポップオーバー（ChartPopover）を持つ
const PLOT_HEIGHT = 96
const plotStyle = { display: 'flex', alignItems: 'flex-end', gap: '4.3%', height: PLOT_HEIGHT }
const columnStyle = { flex: 1, display: 'flex', flexDirection: 'column-reverse' as const }
// chartAxis：日ごとに等分した列の中央に目盛り（11px・gray[600]）
const axisStyle = { display: 'flex' }
const tickStyle = { flex: 1, textAlign: 'center' as const }

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
    // .chartCard（Paper outlined・padding 16px）。GAP: 枠の色は実物では gray[200]（#c4c9d8）。Paper の outlined の色のまま
    <Paper outlined padding="m">
      <Stack gap="s">
        {/* 見出しと値の間は実物では 2px（.chartTotal の margin-top）。Stack の最小の xxs（4px）で詰める */}
        <Stack gap="xxs">
          <Typography size="xs" color="medium_emphasis" fontWeight="bold" component="div">
            {series.title}
          </Typography>
          {/* GAP-NEW: Money（小数部を小さく薄くする）が無い */}
          <Typography size="xxl" fontWeight="bold" component="div">
            {series.format(periodValue)}
          </Typography>
        </Stack>
        {/* グラフと目盛りの間は 4px（.chartAxis の margin-top） */}
        <Stack gap="xxs">
          {periodValue === 0 ? (
            // GAP: 実物の .chartEmpty は高さ 96px の中央に置く。Stack に高さの口が無い
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
                      <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: 段の順は固定
                        key={pi}
                        style={{
                          height: ((part / periodValue) * (w / weightSum) * PLOT_HEIGHT) / peak,
                          background: segmentFills[pi],
                        }}
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          )}
          <div style={axisStyle}>
            {days.map((d) => (
              <div key={d} style={tickStyle}>
                <Typography size="xxs" color="medium_emphasis" component="span">
                  {d}
                </Typography>
              </div>
            ))}
          </div>
        </Stack>
        {/* Breakdown：上位 3 件の名前と値。期間の値が 0 のときは出さない。
            3 件に満たないときも 3 行ぶんの高さを取る（空の行を置く） */}
        {periodValue > 0 && (
          <>
            <Divider />
            {/* 行の間は実物では 6px（.modelList の gap）。Stack の xs（8px） */}
            <Stack gap="xs">
              {Array.from({ length: SHOWN_ENTRIES }, (_, i) => top[i]).map((e, i) =>
                e === undefined ? (
                  // biome-ignore lint/suspicious/noArrayIndexKey: 空の行は位置で決まる
                  <Typography key={`blank-${i}`} size="xs" component="span" aria-hidden="true">
                    {'\u00a0'}
                  </Typography>
                ) : (
                  <Stack
                    key={e.key}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap="s"
                  >
                    {/* 実物は DeepSeek のモデルにだけ、名前の右に InfoTip（現在の提供モデル）を出す。ここのモデルには無い */}
                    <Stack flexDirection="row" gap="xs" alignItems="center">
                      {/* GAP-NEW: 画像の枠（Image）が無い。実物は object-fit: contain で縮めず収める */}
                      {e.logo && <img src={e.logo} alt="" width={16} height={16} />}
                      <Typography size="xs" component="span">
                        {e.label}
                      </Typography>
                    </Stack>
                    <Typography size="xs" fontWeight="bold" component="span">
                      {series.format(series.valueOf(e.totals))}
                    </Typography>
                  </Stack>
                )
              )}
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  )
}

// GAP-NEW: SegmentedControl が無い（shared/ui/SegmentedControl）。実物は白い地に gray[200] の枠のトラックの中に、
// 16px・gray[600] の項目を並べ、選択中は gray[100] の地と太字。ここでは選択中を neutral の outlined、ほかを neutral の transparent にして並べる
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
        color="neutral"
        appearance={o.id === value ? 'outlined' : 'transparent'}
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
  <Stack flexDirection="row" gap="s" alignItems="center" justifyContent="space-between">
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
    // .section（gap 12px）。カードの間は chartGrid の 16px
    <Stack gap="s">
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
          // chartGrid: 600px 未満は 1 列、600px 以上は 2 列、900px 以上は 3 列
          <GridItem key={s.key} size={{ xxs: 12, s: 6, m: 4 }}>
            <UsageChart series={s} entries={entries} />
          </GridItem>
        ))}
      </Grid>
    </Stack>
  )
}

// GAP-NEW: Table のセルに 2 段目の補足（DataTableText tone="secondary"）を置く型が無く、
// 数値の右寄せ（align="end"）も無い。Stack で縦に積み、右寄せにしている。列見出しは左寄せのまま。
// 1 段目は DataTableText の既定（16px）、2 段目は tone="secondary"（14px・行の高さ 20px）。
// GAP: secondary の色は実物では gray[700]（#3d455b）。Typography の medium_emphasis で写している
const Lines = ({ primary, secondary = [] }: { primary: string; secondary?: string[] }) => (
  <Stack gap="xxs" alignItems="flex-end">
    <Typography component="span">{primary}</Typography>
    {secondary.map((line) => (
      <Typography key={line} size="s" density="dense" color="medium_emphasis" component="span">
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
  <Paper padding="none" outlined>
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
    <Stack gap="s">
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
              <Typography size="s" fontWeight="bold" component="h3">
                この期間の使用状況はありません
              </Typography>
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
        {/* DataTable の footer：罫線の下、左寄せ。GAP: 実物の footer の padding 2px 8px は無い */}
        {(hidden > 0 || expanded) && (
          <>
            <Divider />
            <Stack alignItems="flex-start">
              <Button
                appearance="transparent"
                color="neutral"
                size="s"
                onPress={() => setExpanded(!expanded)}
              >
                {expanded ? `上位${SHOWN_PROJECTS}件だけ表示する` : `残り${hidden}件を表示する`}
              </Button>
            </Stack>
          </>
        )}
      </TableFrame>
    </Stack>
  )
}

/** features/ProjectUsage の KeyBreakdownSection */
const KeyBreakdownSection = ({
  entries,
  onOpenKey,
}: {
  entries: typeof keyEntries
  onOpenKey: () => void
}) => {
  const [sort, setSort] = useState<SortDescriptor>({ column: 'charge', direction: 'descending' })
  const sorted = sortEntries(entries, sort)
  return (
    <Stack gap="s">
      <SectionHead title="APIキー別内訳" />
      <TableFrame>
        {/* GAP-NEW: 並べ替えの印と先頭列の固定（stickyFirstColumn）が無い。
            行を押すと API キーの詳細に移る（押せない行は isDisabled で除かれる） */}
        <Table
          aria-label="APIキー別内訳"
          sortDescriptor={sort}
          onSortChange={setSort}
          onRowAction={onOpenKey}
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
          <TableBody
            renderEmptyState={() => (
              <Typography size="s" fontWeight="bold" component="h3">
                この期間に使われたAPIキーはありません
              </Typography>
            )}
          >
            {sorted.map((e) => (
              <Row key={e.key} id={e.key} isDisabled={e.disabled}>
                {/* 実物はキー名を太字（styles.keyName）で出す。大きさは DataTableText の既定（16px） */}
                <Cell>
                  <Typography fontWeight="bold" component="span">
                    {e.label}
                  </Typography>
                </Cell>
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

/** shared/lib/usagePeriod の periodChoices */
const periodOptions = [
  { id: '24h', label: '24時間' },
  { id: '7d', label: '7日' },
  { id: '14d', label: '14日' },
  { id: '30d', label: '30日' },
]

/**
 * 期間（shared/ui/UsagePeriodFilter → ListFilterMenu の toggle。既定は 7日）。
 * 閉じたボタンには暦のアイコンと選んでいる期間を出す
 */
const UsagePeriodFilter = () => {
  const [period, setPeriod] = useState('7d')
  const selected = periodOptions.find((o) => o.id === period) ?? periodOptions[1]
  return (
    <MenuTrigger>
      <Button
        appearance="outlined"
        color="neutral"
        size="s"
        aria-label={`期間: ${selected.label}`}
        leading={<Icon name="calendar" size="s" aria-hidden="true" />}
        trailing={<Icon name="chevron_down" size="s" />}
      >
        {selected.label}
      </Button>
      <Menu
        placement="bottom start"
        selectionMode="single"
        selectedKeys={[selected.id]}
        onSelectionChange={(keys) => {
          const next = keys === 'all' ? undefined : [...keys][0]
          // 選んでいるものをもう一度選んでも外さない（UsagePeriodFilter が undefined を捨てる）
          if (next !== undefined) setPeriod(String(next))
        }}
      >
        {periodOptions.map((o) => (
          <MenuItem key={o.id} id={o.id}>
            {o.label}
          </MenuItem>
        ))}
      </Menu>
    </MenuTrigger>
  )
}

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
    <PageContainer>
      <PageHeader
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
    </PageContainer>
  )
}

/** features/ProjectUsage。期間はあるが、CSV と「モデル別 / プロジェクト別」は無い */
const ProjectUsage = ({ project, onOpenKey }: { project: Entry; onOpenKey: () => void }) => {
  // モデル別の割合は組織と同じにして、プロジェクトの量に縮める
  const projectShare = project.totals.requests / orgTotals.requests
  const models = modelEntries.map((m) => ({
    ...m,
    totals: scale(projectShare * (m.totals.requests / orgTotals.requests)),
  }))
  return (
    <PageContainer>
      <PageHeader
        title="使用状況"
        description="このプロジェクトの利用の推移とAPIキー別の内訳を確認します"
        actions={<UsagePeriodFilter />}
      />
      <DailyChartsSection modelBreakdown={models} />
      <KeyBreakdownSection entries={keyEntries} onOpenKey={onOpenKey} />
    </PageContainer>
  )
}

// ─── 画面 ───

/**
 * 画面の移り先（onNavigate の名前）:
 * - 組織の内訳の行 → 'project-usage'（AccountUsage の onOpenProject：/projects/[id]/usage）。
 *   onNavigate が無い（このファイルのストーリーを単体で開いた）ときは、ProjectUsage のストーリーへ移る
 * - プロジェクトの APIキー別内訳の行 → 'key-detail'（ProjectUsage の onOpenKey：/keys/[keyId]）
 * - 枠（サイドナビ・パンくず・切り替えメニュー）は aiGatewayShell の名前のまま
 */
export const UsageScreen = ({
  view = 'success',
  initialProject: project,
  onNavigate = navigateToAiGatewayStory,
}: {
  view?: ViewState
  /** プロジェクトの使用状況から始める */
  initialProject?: Entry
  onNavigate?: (to: string) => void
}) =>
  project ? (
    <AiGatewayShell
      project={project.label}
      current="project-usage"
      title="使用状況"
      onNavigate={onNavigate}
    >
      <ProjectUsage project={project} onOpenKey={() => onNavigate('key-detail')} />
    </AiGatewayShell>
  ) : (
    <AiGatewayShell current="usage" title="使用状況" onNavigate={onNavigate}>
      <AccountUsage view={view} onOpenProject={() => onNavigate('project-usage')} />
    </AiGatewayShell>
  )

// ─── ストーリー ───

/**
 * AI ゲートウェイの組織の使用状況（期間・CSV・推移・プロジェクト別内訳）。
 *
 * - 推移の「モデル別 / プロジェクト別」で棒の積み方とカード下の上位 3 件が切り替わる。トークン数だけは常に種別で積む
 * - 内訳の表は利用額の多い順に上位 10 件で、「残りn件を表示する」で全部出る。列見出しを押すと並べ替わる
 * - 行を押すとそのプロジェクトの使用状況に移る（アカウント直下の行は移らない）
 *
 * 積み上げ棒グラフは wip-ui に無いため、Typography で色を継承した div で代用している（GAP-19）。
 *
 * @summary 組織の使用状況
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
