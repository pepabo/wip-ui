// GAP-10: Tab が TabPanel を再エクスポートしていない
import { TabPanel } from 'react-aria-components'

import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Checkbox } from '../../Checkbox'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Paper } from '../../Paper'
import { Radio } from '../../Radio'
import { Select, SelectItem } from '../../Select'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Switch } from '../../Switch'
import { Tab, TabList, Tabs } from '../../Tab'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../Table'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import { AppShell } from './AppShell'
import { Card, Inset, RadioField } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { ButtonColor } from '../../Button'
import type { DialogProps } from '../../Dialog'
import type { IconName } from '../../Icon'
import type { TypographyColor } from '../../Typography'

/**
 * お支払い。2 つの実画面を 1 ページに置いている。節見出しはそれぞれの実画面のページ見出しそのまま。
 * - ゲーマーズのサーバーの「支払い」：apollo/frontend/src/app/(application)/(private)/servers/[id]/payment
 *   （ServerPaymentHeader・PaymentTabPanels・RecentryPaymentsPaper・PaymentsTimeline・PaymentMethodsPaper・
 *   PaymentHistoryPaper・BillGroupTable・RetryContractPaymentDialog・ContractCancellationDialog・
 *   SatisfactionSurveyDialog・InvoiceDialog）と components/PaymentMethodChangeDialog。
 * - AI ゲートウェイの組織の「クレジット」：octane/admin-ui/src/features/Billing
 *   （index.tsx・BillingContent.tsx・sections.tsx・BillingDialogs.tsx・dialogs.tsx・CardTokenForm.tsx・
 *   ComplimentaryCreditNotice.tsx・CardChallengeReturn.tsx・usePrepaidBilling.ts）。
 *
 * 主ボタンの色：AI ゲートウェイの実装は主ボタンを color="neutral"（黒）にしている。
 * Hosting はロリポップのトンマナを検証する場なので、ゲーマーズ（MUI の contained primary）とそろえて
 * color="interactive" に統一している。実装へ戻すときはこの差を判断材料にする。
 */

const meta = {
  title: 'Templates/Billing',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** AI ゲートウェイの主ボタンの色。冒頭のコメントのとおり neutral ではなく interactive にそろえている */
const primaryColor: ButtonColor = 'interactive'

// ─── 共通 ───

/** 実画面のページ見出し（ServerPaymentHeader の「支払い」、PageHeader の「クレジット」） */
const AppHeading = ({ title, description }: { title: string; description?: string }) => (
  <Stack gap="xxs">
    <Typography size="xxl" fontWeight="bold" component="h2">
      {title}
    </Typography>
    {description && (
      <Typography size="s" color="medium_emphasis" component="div">
        {description}
      </Typography>
    )}
  </Stack>
)

// GAP-NEW: Skeleton が無い。実物は文字や表の形の骨格を出すが、Loader で代用している
const LoadingBlock = ({ message }: { message?: string }) => (
  <Stack alignItems="center">
    <Loader size="m" message={message} />
  </Stack>
)

/** shared/ui/RetryCallout */
const RetryCallout = ({ message }: { message: string }) => (
  <Callout
    color="negative"
    action={
      <Button appearance="transparent" size="s">
        再読み込みする
      </Button>
    }
  >
    {message}
  </Callout>
)

// GAP-NEW: Dialog に幅の指定が無く、中身の幅で縮む。中身を 1 枚の div で包んで幅を持たせている。
// ゲーマーズは MUI の fullWidth（600px）、AI ゲートウェイは styles.dialog（520px）。
// どれも外寸から Dialog の左右の padding（24px × 2）を引いた値。
const gamersDialogStyle = { width: 552, maxWidth: '100%' } // GAP-NEW: Dialog に幅が無い
const aiDialogStyle = { width: 472, maxWidth: '100%' } // GAP-NEW: Dialog に幅が無い

const SizedDialog = ({
  style,
  children,
  ...props
}: Omit<DialogProps, 'children' | 'style'> & {
  style: { width: number; maxWidth: string }
  children: ReactNode
}) => (
  <Dialog isOpen {...props}>
    <div style={style}>{children}</div>
  </Dialog>
)

// ─── ゲーマーズ：データ ───

type GamersState = {
  /** 自動更新の決済に失敗し、契約が停止（SUSPENDED）している */
  error?: boolean
  loading?: boolean
}

// useSubscriptionContractDisplayName（PlanService.findPlanTitle）。8GB・1ヶ月契約は例
const planDisplayName = '8GBプラン'
const gamersYen = (n: number) => `${n.toLocaleString()}円`
/** PaymentsTimeline/model.ts の formatAmountBreakdown（「（3,000円×1ヶ月）」） */
const amountWithBreakdown = (total: number, months: number) =>
  `${gamersYen(total)}（${gamersYen(Math.floor(total / months))}×${months}ヶ月）`

// BillGroupTableRow の日付は toLocaleDateString() の既定（ゼロ埋めなし）
const billGroups = [
  { id: 'bg-3', issuedAt: '2026/10/1', amount: 3000, period: '2026/10/1 ~ 2026/10/31' },
  { id: 'bg-2', issuedAt: '2026/9/1', amount: 3000, period: '2026/9/1 ~ 2026/9/30' },
  { id: 'bg-1', issuedAt: '2026/8/1', amount: 1500, period: '2026/8/1 ~ 2026/8/31' },
]

// ─── ゲーマーズ：支払い ───

/**
 * PaymentsTimeline の 1 段。左に丸いアイコン、右に地色の付いた面。
 * GAP-NEW: Timeline が無い。実物は左のアイコンを縦線でつなぐ。
 * GAP-NEW: Paper に地色の違う面（background.default）が無いので、枠線の面で代用している。
 * GAP-NEW: Stack の子に flex-grow を指定できず、面が右端まで伸びない（実物は flex: 1）。
 */
const TimelineStep = ({
  icon,
  tone,
  children,
  action,
}: {
  icon: IconName
  tone: TypographyColor
  children: ReactNode
  action?: ReactNode
}) => (
  <Stack flexDirection="row" gap="m" alignItems="flex-start">
    <Typography component="span" color={tone}>
      <Icon name={icon} size="m" />
    </Typography>
    <Paper elevation={0} outlined>
      <Inset>
        <Stack
          flexDirection={{ xxs: 'column', s: 'row' }}
          gap="m"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack gap="xxs">{children}</Stack>
          {action}
        </Stack>
      </Inset>
    </Paper>
  </Stack>
)

/** 真ん中の「〇〇を契約中」。実物は 2 つの段をつなぐ縦線の上に文字だけを置く。GAP-2 と同じく縦罫で線を描く */
const TimelineMiddle = ({ children }: { children: ReactNode }) => (
  <Stack flexDirection="row" gap="l" alignItems="center">
    <Divider orientation="vertical" flexItem />
    {children}
  </Stack>
)

const LatestStep = ({ state }: { state: GamersState }) => (
  <TimelineStep
    icon={state.error ? 'exclamation_on_triangle' : 'check_on_circle'}
    tone={state.error ? 'negative' : 'positive'}
    action={
      state.error &&
      !state.loading && (
        <Button appearance="outlined" color="negative">
          再決済
        </Button>
      )
    }
  >
    {state.loading ? (
      <LoadingBlock />
    ) : (
      <>
        <Typography fontWeight="bold" component="span">
          {state.error
            ? '決済に問題が発生しました。'
            : `2026/10/01：${amountWithBreakdown(3000, 1)}を支払い済み`}
        </Typography>
        <Typography size="s" component="span">
          前回の自動更新
        </Typography>
        {state.error && (
          <Typography fontWeight="bold" color="negative" component="span">
            ご登録されている支払い方法にて、決済がうまく行えませんでした。
            <br />
            契約を継続したい場合には支払い方法をご確認の上、再決済を行ってください。
            <br />
            2026/11/10までにご対応いただけない場合、サービスの提供を終了させていただきますので、予めご了承ください。
          </Typography>
        )}
      </>
    )}
  </TimelineStep>
)

const NextStep = ({ state }: { state: GamersState }) => (
  <TimelineStep
    icon="exclamation_on_triangle"
    tone="notice"
    action={
      !state.loading && (
        <Button appearance="outlined" color="negative">
          自動更新の停止
        </Button>
      )
    }
  >
    {state.loading ? (
      <LoadingBlock />
    ) : (
      <>
        <Typography fontWeight="bold" component="span">
          2026/11/01：{amountWithBreakdown(3000, 1)}を支払い予定
        </Typography>
        <Typography size="s" component="span">
          次回の自動更新
        </Typography>
      </>
    )}
  </TimelineStep>
)

/** components/PaymentCardDetail。GAP-NEW: カードブランド（PaymentCardBrandIcon）のアイコンが無い */
const PaymentCardDetail = () => (
  <Stack flexDirection="row" gap="m" alignItems="center">
    <Icon name="bill" size="l" />
    <Stack gap="xs">
      <Typography size="s" component="span">
        **** **** **** 4242
      </Typography>
      <Typography size="s" component="span">
        有効期限 : 28/12
      </Typography>
    </Stack>
  </Stack>
)

const GamersPayment = ({ state, tab }: { state: GamersState; tab: 'detail' | 'history' }) => (
  <Stack gap="l">
    {/* ServerPaymentHeader */}
    <AppHeading title="支払い" />
    {/* PaymentTabPanels。Tabs の中には Select を置かない（既知の不具合）。ダイアログは Tabs の外に置く */}
    <Tabs defaultSelectedKey={tab}>
      <TabList aria-label="支払い">
        <Tab id="detail">詳細</Tab>
        <Tab id="history">履歴</Tab>
      </TabList>
      <TabPanel id="detail">
        <Stack gap="l">
          {/* RecentryPaymentsPaper */}
          <Card>
            <Stack gap="xl">
              <Typography size="xl" fontWeight="bold" component="h3">
                最近の支払い
              </Typography>
              <Stack gap="l">
                <LatestStep state={state} />
                <TimelineMiddle>
                  {state.loading ? (
                    <LoadingBlock />
                  ) : (
                    <Typography fontWeight="bold" component="span">
                      {planDisplayName}を契約中
                    </Typography>
                  )}
                </TimelineMiddle>
                <NextStep state={state} />
              </Stack>
            </Stack>
          </Card>
          {/* PaymentMethodsPaper */}
          <Card>
            <Stack
              flexDirection={{ xxs: 'column', m: 'row' }}
              gap="s"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack gap="m">
                <Typography size="xl" fontWeight="bold" component="h3">
                  決済手段
                </Typography>
                {state.loading ? <LoadingBlock /> : <PaymentCardDetail />}
              </Stack>
              <Button appearance="outlined">変更</Button>
            </Stack>
          </Card>
        </Stack>
      </TabPanel>
      <TabPanel id="history">
        {/* PaymentHistoryPaper / BillGroupTable */}
        <Card>
          <Stack gap="l">
            <Typography size="xl" fontWeight="bold" component="h3">
              支払い履歴
            </Typography>
            <Table aria-label="支払い履歴">
              <TableHeader>
                <Column isRowHeader>決済日</Column>
                <Column>金額</Column>
                <Column>契約期間</Column>
                <Column>ステータス</Column>
                {/* 実物の列見出しは空 */}
                <Column aria-label="操作"> </Column>
              </TableHeader>
              <TableBody>
                {billGroups.map((bg) => (
                  <Row key={bg.id} id={bg.id}>
                    <Cell>{bg.issuedAt}</Cell>
                    <Cell>{gamersYen(bg.amount)}</Cell>
                    <Cell>{bg.period}</Cell>
                    <Cell>
                      {/* 失敗は negative の文字で「失敗」、未決済は「未決済」 */}
                      <Typography size="s" color="high_emphasis" component="span">
                        成功
                      </Typography>
                    </Cell>
                    <Cell>
                      {/* 決済に失敗した行は領収書ではなく再決済を出す。未決済の行は何も出さない */}
                      <Button
                        appearance="outlined"
                        size="s"
                        leading={<Icon name="download" size="s" />}
                      >
                        領収書
                      </Button>
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          </Stack>
        </Card>
      </TabPanel>
    </Tabs>
  </Stack>
)

// ─── ゲーマーズ：ダイアログ ───
// ボタンは lib/dialog.ts に合わせる（キャンセル・閉じる = 文字だけ、確定 = 枠線、削除の確定 = 赤の枠線）

/**
 * RetryContractPaymentDialog。確定すると処理中（LoadingDialogContent）・完了（SuccessDialogContent）・失敗の段に移る。
 * GAP-NEW: Icon の大きさが l 止まり。完了の段の実物は 150px の CheckCircle を置く
 */
const RetryPaymentDialog = () => (
  <SizedDialog style={gamersDialogStyle}>
    <DialogHeader>
      <DialogTitle>再決済</DialogTitle>
    </DialogHeader>
    <Typography size="s">2026-11-01 〜 2026-12-01 ご利用分の再決済を行います</Typography>
    <DialogFooter>
      <Button appearance="transparent">閉じる</Button>
      <Button appearance="outlined">決済</Button>
    </DialogFooter>
  </SizedDialog>
)

/** ContractCancellationDialog。停止すると続けて満足度のアンケートを出す（「今後表示しない」を選んでいなければ） */
const ContractCancellationDialog = () => (
  <SizedDialog style={gamersDialogStyle}>
    <DialogHeader>
      <DialogTitle>自動更新の停止</DialogTitle>
    </DialogHeader>
    <Stack gap="l">
      <Typography>{planDisplayName}の自動更新を停止します</Typography>
      <Callout color="informative" appearance="outline">
        自動更新停止後も2026/11/01までご利用可能です
      </Callout>
    </Stack>
    <DialogFooter>
      <Button appearance="transparent">閉じる</Button>
      <Button appearance="outlined" color="negative">
        停止
      </Button>
    </DialogFooter>
  </SizedDialog>
)

/** SatisfactionSurveyDialog/model.ts の items */
const surveyItems = ['よかった', '普通だった', '悪かった']

const SatisfactionSurveyDialog = () => (
  <SizedDialog style={gamersDialogStyle}>
    <DialogHeader>
      <DialogTitle>サーバーの使い心地はどうでしたか？</DialogTitle>
    </DialogHeader>
    <Stack gap="l">
      {/* GAP-NEW: 画像を選ぶトグル（ToggleButtonGroup）が無く、選択肢の絵（survey-*.svg）も無い。
          実物は 3 枚の絵を並べ、ラベルは alt にだけある。ここでは枠線のボタンに文字で置く */}
      <Stack flexDirection="row" gap="m">
        {surveyItems.map((label) => (
          <Button key={label} appearance="outlined" size="l" width="third">
            {label}
          </Button>
        ))}
      </Stack>
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
        <Checkbox>今後表示しない</Checkbox>
        <Button appearance="transparent">閉じる</Button>
      </Stack>
    </Stack>
  </SizedDialog>
)

const InvoiceDialog = () => (
  <SizedDialog style={gamersDialogStyle}>
    <DialogHeader>
      <DialogTitle>領収書の宛名</DialogTitle>
    </DialogHeader>
    <TextField label="宛名" caption="書類の交付を受ける事業者の氏名または名称" width="full" />
    <DialogFooter>
      <Button appearance="transparent">閉じる</Button>
      <Button appearance="outlined">ダウンロード</Button>
    </DialogFooter>
  </SizedDialog>
)

const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const years = Array.from({ length: 10 }, (_, i) => String(2026 + i))

/** servers/new/payment-info の RegisterPaymentCardForm ＋ components/PaymentCardForm */
// GAP-NEW: Select の placeholder の既定値が英語（Select an item）。実物（CcExpSelect）は未選択で空欄
const RegisterPaymentCardForm = () => (
  <Paper elevation={0} outlined>
    <Inset>
      <Stack gap="l">
        <Typography size="l" fontWeight="bold" component="h3">
          クレジットカード情報
        </Typography>
        <TextField label="名義" autoComplete="cc-name" width="full" />
        <TextField label="カード番号" autoComplete="cc-number" inputMode="numeric" width="full" />
        <Grid spacing="xs">
          <GridItem size={6}>
            <Select label="有効期限(月)" width="full" autoComplete="cc-exp-month">
              {months.map((m) => (
                <SelectItem key={m} id={m}>
                  {m}
                </SelectItem>
              ))}
            </Select>
          </GridItem>
          <GridItem size={6}>
            <Select label="有効期限(年)" width="full" autoComplete="cc-exp-year">
              {years.map((y) => (
                <SelectItem key={y} id={y}>
                  {y}
                </SelectItem>
              ))}
            </Select>
          </GridItem>
        </Grid>
        <TextField label="セキュリティコード" type="password" autoComplete="cc-csc" width="full" />
        <Paper elevation={0} outlined>
          <Inset>
            <Typography size="xs" component="p">
              当社がお客様から収集した以下の個人情報等は、カード発行会社がおこなう不正利用検知・防止のために、お客様が利用されているカード発行会社へ提供させていただきます。氏名、電話番号、emailアドレス、請求先住所、配送先住所、インターネット利用環境に関する情報等（送信するパラメータの内容に応じて個人情報を記載ください）
              <br />
              お客様が利用されているカード発行会社が海外にある場合、これらの情報は当該発行会社が所属する国に移転される場合があります。お客様が未成年の場合、親権者または後見人の承諾を得た上で、本サービスを利用するものとします。
            </Typography>
          </Inset>
        </Paper>
      </Stack>
    </Inset>
  </Paper>
)

/**
 * components/PaymentMethodChangeDialog の入力の段。登録済みのカードがあるときは、カードと「変更」
 * （ConfirmPaymentCardForm）を出し、「変更」を押すとこのカード情報の入力に切り替わる。
 */
const PaymentMethodChangeDialog = () => (
  // 実物は onClose を渡しておらず、外側を押しても閉じない
  <SizedDialog style={gamersDialogStyle} isDismissable={false}>
    <DialogHeader>
      <DialogTitle>支払い方法の変更</DialogTitle>
    </DialogHeader>
    <Stack gap="l">
      <Callout color="notice" appearance="outline">
        現在登録可能なクレジットカードの情報はアカウントに対して1件のみです。
        <br />
        クレジットカード情報を変更した場合は、クレジット支払いを選択しているすべてのサーバーの情報が変更されます。
      </Callout>
      <RadioField label="支払い方法" defaultValue="credit-card">
        <Stack gap="m">
          {/* GAP-NEW: カードブランドのアイコン一覧（PaymentCardBrandIconsList）が無い */}
          <Radio value="credit-card">クレジットカード</Radio>
          <RegisterPaymentCardForm />
          {/* GAP-NEW: PayPay のロゴが無い */}
          <Radio value="paypay">PayPay</Radio>
          {/* GAP-NEW: 文中のテキストリンク（Link）が無い。「利用できる支払い方法と対応ブランド」をリンクにできない */}
          <Typography size="xxs" component="p">
            ※この支払い方法は自動更新に対応していません。詳しくは利用できる支払い方法と対応ブランドをご確認ください。
          </Typography>
        </Stack>
      </RadioField>
    </Stack>
    <DialogFooter>
      <Button appearance="transparent">キャンセル</Button>
      <Button appearance="outlined">変更</Button>
    </DialogFooter>
  </SizedDialog>
)

// ─── AI ゲートウェイ：クレジット（features/Billing）───

/** cardChallengeReturn はカード認証（3DS2）から戻った直後の画面（CardChallengeReturn） */
type CreditView = 'loading' | 'error' | 'success' | 'cardChallengeReturn'

// formatMicroJpy（Intl の ja-JP / JPY）。残高は小数 4 桁まで出す
const balance = '￥12,345.6789'

// mergeHistoryEntries。色が付くのは失敗（negative）と確認中（notice）だけ
const chargeHistory: { at: string; source: string; amount: string; status: string }[] = [
  { at: '2026/10/29 10:12', source: '自動', amount: '￥5,000', status: 'チャージ済み' },
  { at: '2026/10/15 18:40', source: '手動', amount: '￥10,000', status: 'チャージ済み' },
  { at: '2026/10/15 18:38', source: '手動', amount: '￥10,000', status: '失敗' },
  { at: '2026/10/01 00:00', source: '特典', amount: '￥1,000', status: '付与済み' },
]

const historyColor: Record<string, 'negative' | 'notice' | undefined> = {
  失敗: 'negative',
  確認中: 'notice',
}

// cardLabelText（ブランド名 + formatMaskedNumber）
const card = 'Visa •••• 4242'

// dialogs.tsx の manualChargeAmountOptions
const chargeAmounts = [
  { id: '1000', label: '1,000円' },
  { id: '3000', label: '3,000円' },
  { id: '5000', label: '5,000円' },
  { id: '10000', label: '10,000円' },
  { id: 'custom', label: 'カスタム' },
]

const SubTitle = ({ children, action }: { children: string; action?: ReactNode }) => (
  <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
    <Typography size="m" fontWeight="bold" component="h3">
      {children}
    </Typography>
    {action}
  </Stack>
)

const AiCredit = ({ view }: { view: CreditView }) => {
  if (view === 'cardChallengeReturn') {
    // CardChallengeReturn。請求画面へ戻すまでの間だけ出る
    return (
      <Stack gap="l">
        <AppHeading title="カード認証" description="カード認証の結果を確認しています" />
        <Card>
          <LoadingBlock message="確認しています" />
        </Card>
      </Stack>
    )
  }
  return (
    <Stack gap="l">
      {/* index.tsx の PageHeader */}
      <AppHeading
        title="クレジット"
        description="クレジット残高、支払い方法、チャージ履歴を管理します"
      />
      {/* BillingContent */}
      {view === 'loading' && (
        <Card>
          <LoadingBlock message="請求情報を読み込んでいます" />
        </Card>
      )}
      {view === 'error' && <RetryCallout message="請求情報を読み込めませんでした。" />}
      {view === 'success' && (
        <>
          <Grid spacing="m">
            <GridItem size={{ xxs: 12, m: 7 }}>
              {/* PrepaidBalanceSection */}
              <Card>
                <Stack gap="m">
                  <Stack gap="xs">
                    {/* GAP-NEW: InfoTip が無い（中身は「追加したクレジットは、購入日から1年で失効します。」）。
                        開く先の無い iconOnly ボタンを置く */}
                    <Stack flexDirection="row" gap="xxs" alignItems="center">
                      <Typography size="m" fontWeight="bold" component="h3">
                        クレジット残高
                      </Typography>
                      <Button
                        appearance="transparent"
                        size="s"
                        iconOnly
                        aria-label="クレジットの有効期限とは"
                      >
                        <Icon name="info_on_circle" size="s" />
                      </Button>
                    </Stack>
                    {/* GAP-NEW: Money（小数部を小さく薄くする）が無い */}
                    <Typography size="xxl" fontWeight="bold" component="div">
                      {balance}
                    </Typography>
                  </Stack>
                  <Stack flexDirection="row" gap="s">
                    <Button color={primaryColor} size="s" leading={<Icon name="plus" size="s" />}>
                      追加する
                    </Button>
                    <Button appearance="outlined" size="s" leading={<Icon name="gear" size="s" />}>
                      自動チャージ
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            </GridItem>
            <GridItem size={{ xxs: 12, m: 5 }}>
              {/* LowBalanceNotificationCard */}
              <Card>
                <Stack gap="m">
                  <Stack gap="xxs">
                    <Typography size="m" fontWeight="bold" component="h3">
                      通知
                    </Typography>
                    <Typography size="s" color="medium_emphasis" component="div">
                      クレジット残高が基準を下回ったときにメールでお知らせします。
                    </Typography>
                  </Stack>
                  <Stack flexDirection="row">
                    <Button appearance="outlined" size="s" leading={<Icon name="bell" size="s" />}>
                      設定する
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            </GridItem>
          </Grid>

          {/* ComplimentaryCreditSection。有効な特典があるときだけ出る */}
          <Card>
            <Stack gap="s">
              <SubTitle>特典クレジット</SubTitle>
              <Table aria-label="特典クレジット">
                <TableHeader>
                  <Column isRowHeader>特典名</Column>
                  <Column>付与額</Column>
                  <Column>有効期限</Column>
                  <Column>残高</Column>
                </TableHeader>
                <TableBody renderEmptyState={() => '特典クレジットはありません'}>
                  <Row>
                    <Cell>ウェルカムクレジット</Cell>
                    <Cell>￥1,000</Cell>
                    <Cell>2026/12/31 23:59</Cell>
                    <Cell>￥412.5</Cell>
                  </Row>
                </TableBody>
              </Table>
              <Typography size="s" color="medium_emphasis" component="div">
                特典クレジットは、チャージしたクレジットより先に消費されます。
              </Typography>
            </Stack>
          </Card>

          {/* PaymentHistorySection */}
          <Card>
            <Stack gap="s">
              <SubTitle>チャージ履歴</SubTitle>
              <Table aria-label="チャージ履歴">
                <TableHeader>
                  <Column isRowHeader>日時</Column>
                  <Column>種別</Column>
                  <Column>金額</Column>
                  <Column>結果</Column>
                </TableHeader>
                <TableBody renderEmptyState={() => 'チャージ履歴はありません'}>
                  {chargeHistory.map((h) => (
                    <Row key={`${h.at}-${h.status}`}>
                      <Cell>{h.at}</Cell>
                      <Cell>{h.source}</Cell>
                      <Cell>{h.amount}</Cell>
                      <Cell>
                        {historyColor[h.status] ? (
                          <Sticker size="s" color={historyColor[h.status]}>
                            {h.status}
                          </Sticker>
                        ) : (
                          h.status
                        )}
                      </Cell>
                    </Row>
                  ))}
                </TableBody>
              </Table>
            </Stack>
          </Card>

          {/* PaymentMethodsSection */}
          <Card>
            <Stack gap="s">
              <SubTitle
                action={
                  <Button color={primaryColor} size="s">
                    カードを追加する
                  </Button>
                }
              >
                お支払い方法
              </SubTitle>
              <Table aria-label="お支払い方法">
                <TableHeader>
                  <Column isRowHeader>カード番号</Column>
                  <Column>有効期限</Column>
                </TableHeader>
                <TableBody renderEmptyState={() => '登録されているカードはありません'}>
                  <Row>
                    <Cell>
                      {/* GAP-NEW: カードブランドのロゴが無い（CardBrandLabel） */}
                      <Stack flexDirection="row" gap="xs" alignItems="center">
                        <Typography size="s" component="span">
                          {card}
                        </Typography>
                        <Sticker size="s" color="neutral">
                          既定
                        </Sticker>
                      </Stack>
                    </Cell>
                    <Cell>12/28</Cell>
                  </Row>
                </TableBody>
              </Table>
            </Stack>
          </Card>
        </>
      )}
    </Stack>
  )
}

// ─── AI ゲートウェイ：ダイアログ ───

/** dialogs.tsx の ChargeDetail。項目名と金額の行 */
const ChargeDetail = ({
  label,
  value,
  total = false,
}: {
  label: string
  value: string
  total?: boolean
}) => (
  <Stack flexDirection="row" justifyContent="space-between">
    <Typography size={total ? 'm' : 's'} color="medium_emphasis" component="span">
      {label}
    </Typography>
    <Typography size={total ? 'm' : 's'} fontWeight={total ? 'bold' : 'normal'} component="span">
      {value}
    </Typography>
  </Stack>
)

const ChargeDetails = ({ amount, totalLabel }: { amount: string; totalLabel: string }) => (
  <Paper elevation={0} outlined>
    <Inset>
      <Stack gap="xs">
        <ChargeDetail label="クレジット" value={amount} />
        <ChargeDetail label="手数料" value="￥0" />
        <ChargeDetail label="消費税" value="￥0" />
        <Divider />
        <ChargeDetail label={totalLabel} value={amount} total />
      </Stack>
    </Inset>
  </Paper>
)

/** ManualChargeDialog。確定すると BillingDialogs の ConfirmDialog（「クレジットを追加しますか？」）が重なる */
const ManualChargeDialog = () => (
  <SizedDialog style={aiDialogStyle}>
    <DialogHeader>
      <DialogTitle>クレジットを追加する</DialogTitle>
      <DialogDescription>追加したクレジットは、購入日から1年で失効します。</DialogDescription>
    </DialogHeader>
    <Stack gap="m">
      {/* GAP-NEW: カードブランドのロゴ（CardBrandLabel）を選択肢に置けない */}
      <Select label="支払いカード" width="full" defaultSelectedKey="card-0">
        <SelectItem id="card-0">{card}</SelectItem>
        <SelectItem id="register-card">別のカードを登録する</SelectItem>
      </Select>
      <Stack gap="xs">
        <Typography size="s" fontWeight="bold" component="span">
          追加する金額
        </Typography>
        {/* GAP-NEW: SegmentedControl が無い。選択中を flat、ほかを outlined にして並べる */}
        <Stack flexDirection="row" gap="xxs">
          {chargeAmounts.map((o) => (
            <Button
              key={o.id}
              size="s"
              appearance={o.id === '5000' ? 'flat' : 'outlined'}
              aria-label={`追加する金額: ${o.label}`}
            >
              {o.label}
            </Button>
          ))}
        </Stack>
        <Typography size="s" color="medium_emphasis" component="div">
          残りチャージ可能額 ￥487,654.3211（クレジット保有上限 ¥500,000）
        </Typography>
      </Stack>
      <ChargeDetails amount="￥5,000" totalLabel="合計金額" />
    </Stack>
    <DialogFooter>
      <Button appearance="transparent">閉じる</Button>
      <Button color={primaryColor}>クレジットを追加する</Button>
    </DialogFooter>
  </SizedDialog>
)

/** 項目名とスイッチの行（styles.switchRow） */
const SwitchRow = ({ label }: { label: string }) => (
  <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
    <Typography size="s" fontWeight="bold" component="span">
      {label}
    </Typography>
    <Switch defaultSelected aria-label={label} />
  </Stack>
)

const AutoChargeSettingsDialog = () => (
  <SizedDialog style={aiDialogStyle}>
    <DialogHeader>
      <DialogTitle>自動チャージを設定する</DialogTitle>
      <DialogDescription>
        残高が基準を下回ったときに、登録したカードで自動的にチャージします。
      </DialogDescription>
    </DialogHeader>
    <Stack gap="m">
      <SwitchRow label="自動チャージを使う" />
      {/* スイッチがオンのときだけ出る。GAP-NEW: Disclosure / Collapse が無い。実物は高さのアニメーションで開閉する */}
      <Stack gap="m">
        {/* 自分で設定したカードは「設定済みのカード」、ほかのメンバーなら「〇〇が設定したカード」 */}
        <Select label="支払いカード" width="full" placeholder="設定済みのカード">
          <SelectItem id="card-0">{card}</SelectItem>
        </Select>
        <TextField
          label="基準残高（円）"
          placeholder="1,000"
          defaultValue="1,000"
          width="full"
          inputMode="numeric"
        />
        <TextField
          label="1回の金額（500円〜300,000円）"
          placeholder="5,000"
          defaultValue="5,000"
          width="full"
          inputMode="numeric"
        />
        <TextField
          label="月次上限（円）"
          placeholder="20,000"
          defaultValue="20,000"
          width="full"
          inputMode="numeric"
        />
        <ChargeDetails amount="￥5,000" totalLabel="1回の請求額" />
      </Stack>
    </Stack>
    <DialogFooter>
      <Button appearance="transparent">閉じる</Button>
      <Button color={primaryColor}>保存する</Button>
    </DialogFooter>
  </SizedDialog>
)

const LowBalanceNotificationDialog = () => (
  <SizedDialog style={aiDialogStyle}>
    <DialogHeader>
      <DialogTitle>通知を設定する</DialogTitle>
      <DialogDescription>
        クレジット残高が基準を下回ったときにメールでお知らせします。
      </DialogDescription>
    </DialogHeader>
    <Stack gap="m">
      <SwitchRow label="残高が下回ったら通知する" />
      {/* スイッチがオンのときだけ出る */}
      <TextField label="通知する残高（円）" defaultValue="1,000" width="full" inputMode="numeric" />
    </Stack>
    <DialogFooter>
      <Button appearance="transparent">閉じる</Button>
      <Button color={primaryColor}>保存する</Button>
    </DialogFooter>
  </SizedDialog>
)

// mulpay.ts の supportedCardBrands
const supportedCardBrands = ['Visa', 'Mastercard', 'JCB', 'American Express', 'Diners Club']

/** CardRegistrationDialog ＋ CardTokenForm。実物のカード番号・有効期限・セキュリティコードは決済代行の iframe */
const CardRegistrationDialog = () => (
  <SizedDialog style={aiDialogStyle}>
    <DialogHeader>
      <DialogTitle>クレジットカードを追加する</DialogTitle>
    </DialogHeader>
    <Stack gap="m">
      <Stack gap="xs">
        <Typography size="s" color="medium_emphasis" component="span">
          以下のカードをご利用いただけます
        </Typography>
        {/* GAP-NEW: カードブランドのロゴ（/card-brands/*.svg）が無い。名前を Sticker で並べる */}
        <Stack flexDirection="row" gap="xxs">
          {supportedCardBrands.map((brand) => (
            <Sticker key={brand} size="s" color="neutral">
              {brand}
            </Sticker>
          ))}
        </Stack>
      </Stack>
      <TextField label="カード番号" placeholder="1234 5678 9012 3456" width="full" />
      <Grid spacing="s">
        <GridItem size={6}>
          <TextField label="有効期限" placeholder="MM / YY" width="full" />
        </GridItem>
        <GridItem size={6}>
          <TextField label="セキュリティコード" placeholder="123" width="full" />
        </GridItem>
      </Grid>
      <TextField label="カード名義" width="full" />
    </Stack>
    <DialogFooter>
      <Button appearance="transparent">キャンセル</Button>
      <Button color={primaryColor}>カードを登録する</Button>
    </DialogFooter>
  </SizedDialog>
)

/** ComplimentaryCreditNotice の ComplimentaryCreditGrantedDialog */
const ComplimentaryCreditGrantedDialog = () => (
  <SizedDialog style={aiDialogStyle}>
    <DialogHeader>
      {/* 実物はキャンペーンごとの画像を見出しにし、画像が無いときだけこの文字を出す。GAP-NEW: 画像の見出しは置けない */}
      <DialogTitle>クレジットを獲得しました！</DialogTitle>
      {/* キャンペーン名は例 */}
      <DialogDescription>
        条件達成キャンペーンの特典として、10,000円分のクレジットを付与しました。
      </DialogDescription>
    </DialogHeader>
    <Stack gap="xxs">
      <Typography size="s">有効期限: 2027/10/31 23:59まで</Typography>
      <Typography size="s" color="medium_emphasis">
        特典クレジットは、チャージしたクレジットより先に消費されます。
      </Typography>
    </Stack>
    <DialogFooter>
      <Button appearance="transparent">閉じる</Button>
      <Button color={primaryColor}>クレジットを確認する</Button>
    </DialogFooter>
  </SizedDialog>
)

/**
 * ComplimentaryCreditNotice の WelcomeCreditGrantedDialog。会員登録で 1,000 円分を付与したときの案内。
 * GAP-NEW: 実物は styles.welcomeCredit* の独自 CSS で、イラスト・大きな金額・右上の閉じるを組んでいる。
 * イラスト（welcome-credit-illustration.svg）は置けず、金額は Typography の最大の大きさで代用する。
 */
const WelcomeCreditGrantedDialog = () => (
  <SizedDialog style={aiDialogStyle}>
    <Stack gap="l">
      <Stack flexDirection="row" justifyContent="flex-end">
        <Button iconOnly appearance="transparent" aria-label="閉じる">
          <Icon name="cross" />
        </Button>
      </Stack>
      <DialogHeader>
        <DialogTitle>会員登録ありがとうございます！</DialogTitle>
      </DialogHeader>
      <Paper elevation={0} outlined>
        <Inset>
          <Stack gap="xxs" alignItems="center">
            <Typography size="s" component="p">
              感謝の気持ちを込めて
            </Typography>
            <Stack flexDirection="row" gap="xxs" alignItems="flex-end">
              <Typography size="xxxl" fontWeight="bold" component="span">
                1,000
              </Typography>
              <Typography size="l" fontWeight="bold" component="span">
                円分
              </Typography>
            </Stack>
            <Typography fontWeight="bold" component="p">
              クレジットを付与しました！
            </Typography>
          </Stack>
        </Inset>
      </Paper>
      <Typography component="p">
        今すぐAPIキーを発行して、
        <br />
        AIを試してみよう。
      </Typography>
      <Stack gap="xs" alignItems="center">
        {/* APIキーを発行できるプロジェクトが無いときは出さず、下のボタンが「閉じる」になる */}
        <Button color={primaryColor} size="l" width="full" trailing={<Icon name="arrow_right" />}>
          APIキーを発行する
        </Button>
        <Button appearance="transparent" size="s">
          あとで設定する
        </Button>
      </Stack>
    </Stack>
  </SizedDialog>
)

// ─── 画面 ───

const BillingScreen = ({
  gamers = {},
  credit = 'success',
  tab = 'detail',
  dialog,
}: {
  gamers?: GamersState
  credit?: CreditView
  tab?: 'detail' | 'history'
  dialog?: ReactNode
}) => (
  <AppShell active="billing">
    <GamersPayment state={gamers} tab={tab} />
    <Divider />
    <AiCredit view={credit} />
    {/* Tabs の外に置く。Dialog の中の Select を Tabs の子孫にしないため */}
    {dialog}
  </AppShell>
)

// ─── ストーリー：ゲーマーズ ───

/**
 * ゲームサーバーの支払い（最近の支払いのタイムライン・決済手段）と、AI ゲートウェイのクレジット
 * （残高・通知・特典クレジット・チャージ履歴・お支払い方法）。
 *
 * @summary 支払いとクレジット
 */
export const Default: Story = {
  render: () => <BillingScreen />,
}

/**
 * 読み込み中。ゲーマーズはタイムラインと決済手段、AI ゲートウェイは請求情報全体を骨格で出す
 * （GAP-NEW: Skeleton が無いので Loader で代用）。
 *
 * @summary 読み込み中
 */
export const Loading: Story = {
  render: () => <BillingScreen gamers={{ loading: true }} credit="loading" />,
}

/**
 * 支払い履歴。成功した行には「領収書」が出る。列見出しの最後は空。
 *
 * @summary 支払い履歴
 */
export const History: Story = {
  render: () => <BillingScreen tab="history" />,
}

/**
 * 自動更新の決済に失敗し、契約が停止（SUSPENDED）しているときの再決済の確認。
 * タイムラインの先頭に再決済の案内が出ている。
 *
 * @summary 再決済の確認
 */
export const RetryPayment: Story = {
  render: () => <BillingScreen gamers={{ error: true }} dialog={<RetryPaymentDialog />} />,
}

/**
 * 自動更新の停止の確認。停止後もいつまで使えるかを出す。
 *
 * @summary 自動更新の停止
 */
export const StopAutoRenewal: Story = {
  render: () => <BillingScreen dialog={<ContractCancellationDialog />} />,
}

/**
 * 自動更新を停止した直後に出る満足度のアンケート。選ぶと閉じる。「今後表示しない」で次から出さない。
 *
 * @summary 満足度のアンケート
 */
export const SatisfactionSurvey: Story = {
  render: () => <BillingScreen dialog={<SatisfactionSurveyDialog />} />,
}

/**
 * 領収書の宛名。支払い履歴の「領収書」から開く。
 *
 * @summary 領収書の宛名
 */
export const Invoice: Story = {
  render: () => <BillingScreen tab="history" dialog={<InvoiceDialog />} />,
}

/**
 * 支払い方法の変更。クレジットカードの情報を入力する。
 *
 * @summary 支払い方法の変更
 */
export const ChangePaymentMethod: Story = {
  render: () => <BillingScreen dialog={<PaymentMethodChangeDialog />} />,
}

// ─── ストーリー：AI ゲートウェイ ───

/**
 * 請求情報を読み込めなかったとき。
 *
 * @summary クレジットの読み込みに失敗
 */
export const CreditError: Story = {
  render: () => <BillingScreen credit="error" />,
}

/**
 * カード認証（3DS2）から戻った直後の画面。結果を確かめて請求画面へ戻す。
 *
 * @summary カード認証から戻る
 */
export const CardChallengeReturn: Story = {
  render: () => <BillingScreen credit="cardChallengeReturn" />,
}

/**
 * クレジットの追加。支払いカード・金額を選ぶと内訳が出る。
 *
 * @summary クレジットの追加
 */
export const ChargeCredit: Story = {
  render: () => <BillingScreen dialog={<ManualChargeDialog />} />,
}

/**
 * 自動チャージの設定。
 *
 * @summary 自動チャージの設定
 */
export const AutoChargeSettings: Story = {
  render: () => <BillingScreen dialog={<AutoChargeSettingsDialog />} />,
}

/**
 * 残高の通知の設定。
 *
 * @summary 通知の設定
 */
export const LowBalanceNotification: Story = {
  render: () => <BillingScreen dialog={<LowBalanceNotificationDialog />} />,
}

/**
 * クレジットカードの追加。
 *
 * @summary カードの追加
 */
export const AddCard: Story = {
  render: () => <BillingScreen dialog={<CardRegistrationDialog />} />,
}

/**
 * 特典クレジットを付与したときの案内。ログイン後の画面で 1 度だけ出る。
 *
 * @summary 特典クレジットの付与
 */
export const ComplimentaryCreditGranted: Story = {
  render: () => <BillingScreen dialog={<ComplimentaryCreditGrantedDialog />} />,
}

/**
 * 会員登録で 1,000 円分のクレジットを付与したときの案内。
 *
 * @summary ウェルカムクレジットの付与
 */
export const WelcomeCreditGranted: Story = {
  render: () => <BillingScreen dialog={<WelcomeCreditGrantedDialog />} />,
}
