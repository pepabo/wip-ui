import { Breadcrumb, Breadcrumbs } from '../../../Breadcrumbs'
import { Button } from '../../../Button'
import { Divider } from '../../../Divider'
import { Grid, GridItem } from '../../../Grid'
import { Icon } from '../../../Icon'
import { Paper } from '../../../Paper'
import { RadioGroup } from '../../../Radio'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { Typography } from '../../../Typography'

import type { ReactNode } from 'react'
import type { IconName } from '../../../Icon'
import type { PaperProps } from '../../../Paper'
import type { RadioGroupProps } from '../../../Radio'
import type { StickerColor } from '../../../Sticker'

/**
 * テンプレート共通の部品。
 * コンポーネントの組み合わせだけで作り、独自スタイルは Card の padding 1 箇所に閉じ込める。
 * ここに inline style が増えたら、それは wip-ui 側に足りない prop の候補。
 */

// ── wip-ui に足りないもの（テンプレートを実際に組んで見つかった穴の一覧）──
// 各テンプレートで回避策を書くときは、この番号を `GAP-n` として参照する。
//
// GAP-1 Paper に padding が無く、内容が面の端に接する。→ Card で div を 1 枚かぶせている。
//       padding の 24px は adapter.get-spacing-size(l) の代わりに置いた暫定値で、
//       トークンに裏付けが無い。Paper に padding prop が付いたら Card ごと不要になる。
// GAP-2 Stepper（ウィザードの進行表示）が無い。→ StepIndicator を Sticker と Divider で組んでいる。
//       段と段をつなぐ線に縦罫（Divider orientation="vertical"）を流用しており、本来は横のコネクタ。
// GAP-3 「選択できるカード」（MUI の CardActionArea 相当）が無い。→ Paper + Button で組んでいる。
// GAP-4 Divider にラベルを入れられない（hr を描画するため children 不可）。
//       → ログインの「または」は線と文字を分けて組んでいる。
// GAP-5 アイコンセットに Google が無い。→ launch で代用している（identityProviders）。
// GAP-6 Avatar が img 固定でアイコンや頭文字を入れられない。
//       → AppShell の initialAvatar が SVG のデータ URI を作っている。
//         この SVG の 2 色だけはトークンではなく生の hex で、テンプレート層で唯一の例外。
// GAP-7 RadioGroup に label / caption が無い（Select・Switch・TextField にはある）。
//       → RadioField が Typography でラベルを描き、aria-label と二重に文字列を持っている。
// GAP-8 RadioGroup の orientation が効かない。型は受け取るが scss が縦並び固定。
//       → RadioField の orientation="horizontal" が Stack で横に並べ直している。
// GAP-9 Menu / DropdownMenu が無い。→ 行の操作は iconOnly ボタンを並べるか、
//       開く先の無い ellipsis ボタンを置くだけになっている。
// GAP-10 Tab が TabPanel を再エクスポートしていないため、react-aria-components から直接 import している。
// GAP-11 サイドナビの現在地を appearance でしか表現できず、aria-current を渡す口が無い。
// GAP-12 AppBar appearance="filled" の上でボタンを白くする知識が AppBar 側に無い。
//        → AppShell が呼び出し側で appearance を出し分けている。
// GAP-13 Container の最大幅が xl（1440px）止まりで「幅制限なし」が無く、Stack にも padding が無い。
//        → AppShell の width="wide" が inline style で左右の余白を作っている。
// GAP-14 Drawer / SideNavigation が無い。
//        → モバイル幅でサイドナビが全幅ボタン 7 個として縦に積まれる（Mobile ストーリーで確認できる）。
// GAP-15 アイコンセットにファイル種別（PHP / 画像 / 書庫）のアイコンが無い。
//        → FileManager が folder / code / image / note / clip で代用している。
// GAP-16 Pagination が無い。→ 件数の送りを iconOnly ボタン 2 つで代用している。
// GAP-17 Stack の alignItems がレスポンシブ非対応（flexDirection と gap は対応済み）。
// GAP-18 進捗バー / メーターが無い（Loader は円形のみ）。adapter に progress-indicator の
//        トークンは既にあるのに未実装。→ Usage が Typography で色を継承した div で代用している。
//        実消費側（hosting-deploy-now の Usage 画面）は Tailwind の bg-sky-500 を直書きしており、
//        フレーバーに追従していない。ここを塞ぐと 2 サービスが同時に直る。
// GAP-19 グラフの primitive が無い。→ Usage が同じ色継承の div を並べて棒グラフにしている。
//        hosting-ai-gateway は UsageCharts を 261 行の自前 CSS で実装している。
// GAP-20 等幅フォントのトークンが無い。API キーやコマンドを出す画面で必要。
//        hosting-deploy-now は Tailwind の font-mono を 15 箇所で直書きしている。

// GAP-1 の回避策。オブジェクトを毎レンダー作らないようモジュールスコープに置く。
const insetStyle = { padding: 24 }

export const Card = ({
  children,
  outlined = false,
  elevation = 1,
  square = false,
}: {
  children: ReactNode
  outlined?: boolean
  elevation?: PaperProps['elevation']
  square?: boolean
}) => (
  <Paper elevation={elevation} outlined={outlined} square={square}>
    <div style={insetStyle}>{children}</div>
  </Paper>
)

/** 面を持たない余白だけの枠。既に Paper の中にいる場所で Card を使うと面が二重になるため。 */
export const Inset = ({ children }: { children: ReactNode }) => (
  <div style={insetStyle}>{children}</div>
)

export const PageHeader = ({
  breadcrumbs,
  title,
  badge,
  description,
  actions,
}: {
  breadcrumbs: { label: string; href?: string }[]
  title: string
  badge?: ReactNode
  description?: string
  actions?: ReactNode
}) => (
  <Stack gap="s">
    <Breadcrumbs>
      {breadcrumbs.map((item) => (
        <Breadcrumb key={item.label} href={item.href}>
          {item.label}
        </Breadcrumb>
      ))}
    </Breadcrumbs>
    <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="m" justifyContent="space-between">
      <Stack gap="xxs">
        <Stack flexDirection="row" gap="s" alignItems="center">
          <Typography size="xxl" fontWeight="bold" component="h1">
            {title}
          </Typography>
          {badge}
        </Stack>
        {description && (
          <Typography size="s" color="medium_emphasis">
            {description}
          </Typography>
        )}
      </Stack>
      {actions && (
        <Stack flexDirection="row" gap="s" alignItems="center">
          {actions}
        </Stack>
      )}
    </Stack>
  </Stack>
)

export const SectionTitle = ({ children, action }: { children: ReactNode; action?: ReactNode }) => (
  <Stack flexDirection="row" gap="m" alignItems="center" justifyContent="space-between">
    <Typography size="l" fontWeight="bold" component="h2">
      {children}
    </Typography>
    {action}
  </Stack>
)

/** 項目名の見え方を 1 箇所に集める。Stat / DefinitionRow / RadioField が共有する。 */
export const FieldLabel = ({ children }: { children: ReactNode }) => (
  <Typography size="s" color="medium_emphasis" component="span">
    {children}
  </Typography>
)

export const Stat = ({
  label,
  value,
  unit,
  caption,
}: {
  label: string
  value: string
  unit: string
  caption?: ReactNode
}) => (
  <Stack gap="xxs">
    <FieldLabel>{label}</FieldLabel>
    <Stack flexDirection="row" gap="xxs" alignItems="flex-end">
      <Typography size="xxxl" fontWeight="bold" component="span">
        {value}
      </Typography>
      <Typography size="s" color="medium_emphasis" component="span">
        {unit}
      </Typography>
    </Stack>
    {caption}
  </Stack>
)

/**
 * 項目名と値の組。inline は 4:8 の 2 カラム、stacked は名前の下に値を置く。
 * 2 つの見せ方があること自体をここで名前付きにしておく。
 */
export const DefinitionRow = ({
  term,
  direction = 'inline',
  children,
}: {
  term: string
  direction?: 'inline' | 'stacked'
  children: ReactNode
}) =>
  direction === 'stacked' ? (
    <Stack gap="xxs">
      <FieldLabel>{term}</FieldLabel>
      {children}
    </Stack>
  ) : (
    <Grid spacing="s">
      <GridItem size={{ xxs: 12, s: 4 }}>
        <FieldLabel>{term}</FieldLabel>
      </GridItem>
      <GridItem size={{ xxs: 12, s: 8 }}>{children}</GridItem>
    </Grid>
  )

/** 値とコピーボタンの組。GAP-9 の Menu が無いぶん、行内の操作はこの形に寄せる。 */
export const CopyableValue = ({ value, label }: { value: string; label: string }) => (
  <Stack flexDirection="row" gap="xs" alignItems="center">
    <Typography component="span">{value}</Typography>
    <Button appearance="transparent" size="s" iconOnly aria-label={`${label}をコピー`}>
      <Icon name="copy" size="s" />
    </Button>
  </Stack>
)

/**
 * ラベル付きの RadioGroup。GAP-7 / GAP-8 の回避策をここ 1 箇所に閉じ込める。
 * RadioGroup 自身が縦並びと gap を持っているので、縦のときは Stack を重ねない。
 */
export const RadioField = ({
  label,
  orientation = 'vertical',
  children,
  ...props
}: {
  label: string
  orientation?: 'vertical' | 'horizontal'
  children: ReactNode
} & Omit<RadioGroupProps, 'children' | 'aria-label' | 'orientation'>) => (
  <Stack gap="xs">
    <FieldLabel>{label}</FieldLabel>
    <RadioGroup aria-label={label} {...props}>
      {orientation === 'horizontal' ? (
        <Stack flexDirection="row" gap="l">
          {children}
        </Stack>
      ) : (
        children
      )}
    </RadioGroup>
  </Stack>
)

export type IdentityProvider = { id: string; label: string; icon: IconName }

/** GAP-5: Google のアイコンが無いため launch で代用している。 */
export const identityProviders: IdentityProvider[] = [
  { id: 'google', label: 'Google', icon: 'launch' },
  { id: 'apple', label: 'Apple', icon: 'apple' },
  { id: 'x', label: 'X', icon: 'x' },
  { id: 'line', label: 'LINE', icon: 'line' },
  { id: 'discord', label: 'Discord', icon: 'discord' },
]

export type ServiceStatus = 'active' | 'pending' | 'expired' | 'error' | 'disabled' | 'paid'

const statusPresentation: Record<ServiceStatus, { label: string; color: StickerColor }> = {
  active: { label: '有効', color: 'positive' },
  pending: { label: '設定中', color: 'informative' },
  expired: { label: '期限切れ', color: 'negative' },
  error: { label: 'エラー', color: 'negative' },
  disabled: { label: '無効', color: 'neutral' },
  paid: { label: '支払い済み', color: 'positive' },
}

export const StatusSticker = ({ status }: { status: ServiceStatus }) => {
  const { label, color } = statusPresentation[status]
  return (
    <Sticker color={color} size="s">
      {label}
    </Sticker>
  )
}

export const StepIndicator = ({ steps, current }: { steps: string[]; current: number }) => (
  <Stack flexDirection="row" gap="s" alignItems="center">
    {steps.map((step, index) => {
      const state = index < current ? 'done' : index === current ? 'current' : 'todo'
      return (
        <Stack key={step} flexDirection="row" gap="s" alignItems="center">
          {/* GAP-2: 段をつなぐ横のコネクタが無いため縦罫を流用している */}
          {index > 0 && <Divider orientation="vertical" flexItem />}
          <Sticker
            color={state === 'current' ? 'informative' : state === 'done' ? 'positive' : 'neutral'}
            size="s"
          >
            {state === 'done' ? <Icon name="check" size="s" /> : index + 1}
          </Sticker>
          <Typography
            component="span"
            size="s"
            fontWeight={state === 'current' ? 'bold' : 'normal'}
            color={state === 'todo' ? 'low_emphasis' : 'high_emphasis'}
          >
            {step}
          </Typography>
        </Stack>
      )
    })}
  </Stack>
)
