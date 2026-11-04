import { useState } from 'react'

import { Breadcrumb, Breadcrumbs } from '../../Breadcrumbs'
import { Button } from '../../Button'
import { Icon } from '../../Icon'
import { Paper } from '../../Paper'
import { RadioGroup } from '../../Radio'
import { Stack } from '../../Stack'
import { Tooltip, TooltipTrigger } from '../../Tooltip'
import { Typography } from '../../Typography'

import type { ReactNode } from 'react'
import type { PaperProps } from '../../Paper'
import type { RadioGroupProps } from '../../Radio'

/**
 * テンプレート共通の部品。
 * コンポーネントの組み合わせだけで作り、既存コンポーネントには inline style を当てない。
 * 見た目が崩れる箇所は、そのまま wip-ui 側に足りない prop の記録として残す。
 */

// ── wip-ui に足りないもの（テンプレートを実際に組んで見つかった穴の一覧）──
// 各テンプレートで回避策を書くときは、この番号を `GAP-n` として参照する。
//
// GAP-1 （解消）Paper に padding が入った。Card は padding を Paper に渡し、既定は Paper の l（24px）。
//       表や一覧の面は none、小さな面・面の中に置く面は m にしている（Paper.md の「余白」）。
// GAP-2 Stepper（ウィザードの進行表示）が無い。
// GAP-3 「選択できるカード」（MUI の CardActionArea 相当）が無い。→ Paper + Button で組んでいる。
// GAP-4 Divider にラベルを入れられない（hr を描画するため children 不可）。
//       → ログインの「または」は線と文字を分けて組んでいる。
// GAP-5 アイコンセットに Google が無い。→ launch で代用している（Auth の外部アカウント）。
// GAP-6 Avatar が img 固定でアイコンや頭文字を入れられない。
//       → アバターはアイコンボタンなどで代用している。
//         この SVG の 2 色だけはトークンではなく生の hex で、テンプレート層で唯一の例外。
// GAP-7 RadioGroup に label / caption が無い（Select・Switch・TextField にはある）。
//       → RadioField が Typography でラベルを描き、aria-label と二重に文字列を持っている。
// GAP-8 RadioGroup の orientation が効かない。型は受け取るが scss が縦並び固定。
//       → RadioField の orientation="horizontal" が Stack で横に並べ直している。
// GAP-9 （解消）Menu が入ったので、行の操作やユーザーメニューは Menu で組んでいる。
// GAP-10 Tab が TabPanel を再エクスポートしていないため、react-aria-components から直接 import している。
// GAP-11 （解消）SideNavigation の isCurrent で現在地を示している。
// GAP-12 AppBar appearance="filled" の上でボタンを白くする知識が AppBar 側に無い。
//        → 呼び出し側で appearance を出し分けている。
// GAP-13 Container の最大幅が xl（1440px）止まりで「幅制限なし」が無く、Stack にも padding が無い。
//        inline style を当てない方針のため未対応。全幅の画面は本文が画面の端に接する。
// GAP-14 Drawer が無く、SideNavigation に狭い画面での切り替えも無い。
//        → モバイル幅でサイドナビが本文の上に積まれる（Mobile ストーリーで確認できる）。
// GAP-15 アイコンセットにファイル種別（PHP / 画像 / 書庫）のアイコンが無い。
//        → FileManager が folder / code / image / note / clip で代用している。
// GAP-16 Pagination が無い。→ 件数の送りを iconOnly ボタン 2 つで代用している。
// GAP-17 Stack の alignItems がレスポンシブ非対応（flexDirection と gap は対応済み）。
// GAP-18 （解消）Meter が入ったので、使用量や予算のバーは Meter で組んでいる。
// GAP-19 グラフの primitive が無い。→ Usage が同じ色継承の div を並べて棒グラフにしている。
//        hosting-ai-gateway は UsageCharts を 261 行の自前 CSS で実装している。
// GAP-20 等幅フォントのトークンが無い。API キーやコマンドを出す画面で必要。
//        hosting-deploy-now は Tailwind の font-mono を 15 箇所で直書きしている。

/**
 * 文中のテキストリンク。実物は素の a（または next/link）に text-sm と青い文字（text-sky-700 など）、hover で下線。
 * 素の a で包み、中に Typography と、別タブのときは launch のアイコンを並べる。左端は前後の文字とそろう。
 * onPress を渡すと、押したとき href へは移らずに onPress を呼ぶ（テンプレートの中の画面遷移）。
 * href には実物の URL を入れる。
 * GAP: 文中のテキストリンクの部品が無い。素の a の既定の見た目が残る（下線が常に出て、下線の色は
 *      ブラウザのリンクの色・訪問済みの色になる）。文字の色は Typography の informative で、実物の色とは違う。
 *      a は置いた Stack の幅いっぱいに広がり、押せる範囲が文字より広くなる（実物は w-fit）
 */
export const TextLink = ({
  children,
  href,
  external = false,
  onPress,
}: {
  children: ReactNode
  href: string
  /** 別タブで開くリンク。末尾に launch のアイコンを出す */
  external?: boolean
  onPress?: () => void
}) => (
  <a
    href={href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    onClick={
      onPress
        ? (event) => {
            event.preventDefault()
            onPress()
          }
        : undefined
    }
  >
    <Stack flexDirection="row" gap="xxs" alignItems="center">
      <Typography component="span" size="s" color="informative">
        {children}
      </Typography>
      {external && (
        <Typography component="span" size="s" color="informative">
          <Icon name="launch" size="s" color="currentColor" aria-hidden />
        </Typography>
      )}
    </Stack>
  </a>
)

export const Card = ({
  children,
  outlined = false,
  elevation = 1,
  square = false,
  padding,
}: {
  children: ReactNode
  outlined?: boolean
  elevation?: PaperProps['elevation']
  square?: boolean
  padding?: PaperProps['padding']
}) => (
  <Paper elevation={elevation} outlined={outlined} square={square} padding={padding}>
    {children}
  </Paper>
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

/** 項目名の見え方。RadioField が使う。 */
const FieldLabel = ({ children }: { children: ReactNode }) => (
  <Typography size="s" color="medium_emphasis" component="span">
    {children}
  </Typography>
)

/** 値とコピーボタンの組。 */
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

/**
 * 項目名の横に置く補足（AI ゲートウェイの shared/ui/InfoTip）。
 * hover とキーボードのフォーカスで開き、押すと開いたままになる。もう一度押すか、フォーカスが外れると閉じる。
 * 実物と同じく、開くまで 200ms 待ち、ボタンから 6px 離して出す
 */
export const InfoTip = ({ label, children }: { label: string; children: ReactNode }) => {
  const [pinned, setPinned] = useState(false)
  const [hovered, setHovered] = useState(false)
  return (
    <TooltipTrigger isOpen={pinned || hovered} onOpenChange={setHovered} delay={200}>
      <Button
        appearance="transparent"
        color="neutral"
        size="s"
        iconOnly
        aria-label={label}
        onPress={() => setPinned((current) => !current)}
        onBlur={() => setPinned(false)}
      >
        <Icon name="info_on_circle" size="s" aria-hidden="true" />
      </Button>
      <Tooltip offset={6}>{children}</Tooltip>
    </TooltipTrigger>
  )
}
