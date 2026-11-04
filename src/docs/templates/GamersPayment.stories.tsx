// GAP-10: Tab が TabPanel を再エクスポートしていない
import { useState } from 'react'
import { TabPanel } from 'react-aria-components'

import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Checkbox } from '../../Checkbox'
import { Container } from '../../Container'
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Paper } from '../../Paper'
import { Radio, RadioGroup } from '../../Radio'
import { Select, SelectItem } from '../../Select'
import { Stack } from '../../Stack'
import { Tab, TabList, Tabs } from '../../Tab'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../Table'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import amexLogo from './assets/ai-gateway/card-brands/amex.svg'
import dinersLogo from './assets/ai-gateway/card-brands/diners.svg'
import jcbLogo from './assets/ai-gateway/card-brands/jcb.svg'
import mastercardLogo from './assets/ai-gateway/card-brands/mastercard.svg'
import visaLogo from './assets/ai-gateway/card-brands/visa.svg'
import paypayLogo from './assets/gamers/paypay.svg'
import surveyExcellent from './assets/gamers/survey-excellent.svg'
import surveyGood from './assets/gamers/survey-good.svg'
import surveyPoor from './assets/gamers/survey-poor.svg'
import { GamersServerShell, useGamersNavigate } from './gamersShell'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { IconName } from '../../Icon'
import type { TypographyColor } from '../../Typography'

/**
 * ゲーマーズのサーバーの「支払い」（apollo/frontend の app/(application)/(private)/servers/[id]/payment）。
 * servers/[id]/layout.tsx の Sidebar で「支払い」を選んだ画面。client.tsx のまま、
 * Container maxWidth='xl' の中に ServerPaymentHeader（xxxl の「支払い」）→ PaymentTabPanels（詳細・履歴）。
 * 元にしたファイル: RecentryPaymentsPaper・PaymentsTimeline・PaymentMethodsPaper・PaymentHistoryPaper・
 * BillGroupTable・BillGroupTableRow・RetryContractPaymentDialog・ContractCancellationDialog・
 * SatisfactionSurveyDialog・InvoiceDialog、components/PaymentCardDetail・PaymentMethodChangeDialog・PaymentCardForm
 */

const meta = {
  title: 'Templates/Gamers/Payment',
  // テンプレートはロリポップのトンマナを確かめる場所なので、フレーバーを lolipop に固定する
  globals: { flavor: 'lolipop' },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ ───

type GamersState = {
  /** 自動更新の決済に失敗し、契約が停止（SUSPENDED）している */
  error?: boolean
  loading?: boolean
}

// useSubscriptionContractDisplayName（PlanService.findPlanTitle）。8GB・1ヶ月契約は例
const planDisplayName = '8GBプラン'
const yen = (n: number) => `${n.toLocaleString()}円`
/** PaymentsTimeline/model.ts の formatAmountBreakdown（「（3,000円×1ヶ月）」） */
const amountWithBreakdown = (total: number, months: number) =>
  `${yen(total)}（${yen(Math.floor(total / months))}×${months}ヶ月）`

// BillGroupTableRow の日付は toLocaleDateString() の既定（ゼロ埋めなし）
const billGroups = [
  { id: 'bg-3', issuedAt: '2026/10/1', amount: 3000, period: '2026/10/1 ~ 2026/10/31' },
  { id: 'bg-2', issuedAt: '2026/9/1', amount: 3000, period: '2026/9/1 ~ 2026/9/30' },
  { id: 'bg-1', issuedAt: '2026/8/1', amount: 1500, period: '2026/8/1 ~ 2026/8/31' },
]

// mulpay の対応ブランド（PaymentCardBrandIconsList の VISA / MASTER / JCB / AMEX / DINERS の順）。
// ゲーマーズの図柄は SvgIcon の手書き（PaymentCardBrandIcon）で、同じ図柄の AI ゲートウェイの card-brands/*.svg で代える
const cardBrands = [
  { label: 'Visa', logo: visaLogo },
  { label: 'Mastercard', logo: mastercardLogo },
  { label: 'JCB', logo: jcbLogo },
  { label: 'American Express', logo: amexLogo },
  { label: 'Diners Club', logo: dinersLogo },
]

type DialogName = 'retry' | 'cancel' | 'survey' | 'invoice' | 'paymentMethod'

/** ダイアログを開く・閉じる口。押すとダイアログが開くボタンが使う */
type DialogControl = { open: (name: DialogName) => void; close: () => void }

// ─── 部品 ───

// 実物は Skeleton（文字や矩形の骨格）。Skeleton が無いので Loader
const LoadingBlock = () => <Loader size="m" />

/** 各 Paper。実物は p: { xs: 3, md: 6 } */
const PaymentPaper = ({ children }: { children: ReactNode }) => (
  <Paper padding={{ xxs: 'l', m: 'xxl' }}>{children}</Paper>
)

/**
 * PaymentsTimeline の 1 段。左に丸いアイコン、右に地色（background.default）の付いた面（flex: 1）。
 * 実物はアイコンの上下を 2px の縦線でつなぐ（線の色は成功が success、決済失敗が error、次回の段の下は warning）。
 * Timeline が無いので、アイコンと枠線の面を並べ、縦線は出していない。
 * 実物のアイコンは CheckCircleOutline / ErrorOutline（丸に感嘆符）。後者は三角の exclamation_on_triangle で代える
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
    <Paper padding="s" elevation={0} outlined>
      <Stack
        flexDirection={{ xxs: 'column', s: 'row' }}
        gap="m"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack gap="xxs">{children}</Stack>
        {action}
      </Stack>
    </Paper>
  </Stack>
)

/** 真ん中の「〇〇を契約中」。実物は 2 つの段をつなぐ縦線の右（pl 7）に文字だけを置く */
const TimelineMiddle = ({ children }: { children: ReactNode }) => (
  <Stack flexDirection="row" gap="l" alignItems="center">
    <Divider orientation="vertical" flexItem />
    {children}
  </Stack>
)

const LatestStep = ({ state, dialogs }: { state: GamersState; dialogs: DialogControl }) => (
  <TimelineStep
    icon={state.error ? 'exclamation_on_triangle' : 'check_on_circle'}
    tone={state.error ? 'negative' : 'positive'}
    action={
      state.error &&
      !state.loading && (
        <Button appearance="outlined" color="negative" onPress={() => dialogs.open('retry')}>
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

const NextStep = ({ state, dialogs }: { state: GamersState; dialogs: DialogControl }) => (
  <TimelineStep
    icon="exclamation_on_triangle"
    tone="notice"
    action={
      !state.loading && (
        <Button appearance="outlined" color="negative" onPress={() => dialogs.open('cancel')}>
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

/**
 * components/PaymentCardDetail。ブランドの図柄（fontSize 60、白地に角丸 0.125rem）の右に、番号と有効期限の 2 行
 */
const PaymentCardDetail = () => (
  <Stack flexDirection="row" gap="m" alignItems="center">
    <img src={visaLogo} alt="Visa" width={60} height={38} />
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

/** RecentryPaymentsPaper。見出し「最近の支払い」の下（mt 5）に PaymentsTimeline */
const RecentPaymentsPaper = ({
  state,
  dialogs,
}: {
  state: GamersState
  dialogs: DialogControl
}) => (
  <PaymentPaper>
    <Stack gap="xl">
      <Typography size="xl" fontWeight="bold" component="h2">
        最近の支払い
      </Typography>
      <Stack gap="l">
        <LatestStep state={state} dialogs={dialogs} />
        <TimelineMiddle>
          {state.loading ? (
            <LoadingBlock />
          ) : (
            <Typography fontWeight="bold" component="span">
              {planDisplayName}を契約中
            </Typography>
          )}
        </TimelineMiddle>
        <NextStep state={state} dialogs={dialogs} />
      </Stack>
    </Stack>
  </PaymentPaper>
)

/** PaymentMethodsPaper。左に「決済手段」とカード、右に「変更」（未登録なら「登録」） */
const PaymentMethodsPaper = ({
  state,
  dialogs,
}: {
  state: GamersState
  dialogs: DialogControl
}) => (
  <PaymentPaper>
    <Stack
      flexDirection={{ xxs: 'column', m: 'row' }}
      gap="xs"
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack gap="m">
        <Typography size="xl" fontWeight="bold" component="h2">
          決済手段
        </Typography>
        {state.loading ? <LoadingBlock /> : <PaymentCardDetail />}
      </Stack>
      <Button appearance="outlined" onPress={() => dialogs.open('paymentMethod')}>
        変更
      </Button>
    </Stack>
  </PaymentPaper>
)

/** PaymentHistoryPaper / BillGroupTable / BillGroupTableRow */
const PaymentHistoryPaper = ({ dialogs }: { dialogs: DialogControl }) => (
  <PaymentPaper>
    <Stack gap="xl">
      <Typography size="xl" fontWeight="bold" component="h2">
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
              <Cell>{yen(bg.amount)}</Cell>
              <Cell>{bg.period}</Cell>
              {/* 失敗は error の色で「失敗」、未決済は「未決済」 */}
              <Cell>成功</Cell>
              <Cell>
                {/* 実物は右寄せ。失敗した行は領収書ではなく赤の「再決済」、未決済の行は何も出さない */}
                <Button
                  appearance="outlined"
                  leading={<Icon name="download" size="s" />}
                  onPress={() => dialogs.open('invoice')}
                >
                  領収書
                </Button>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </Stack>
  </PaymentPaper>
)

// ─── ダイアログ ───
// ボタンは lib/dialog.ts に合わせる（キャンセル・閉じる = 文字だけ、確定 = 枠線、削除の確定 = 赤の枠線）。
// 実物のダイアログは MUI の fullWidth（幅 600px）

/**
 * RetryContractPaymentDialog の確認の段。確定すると処理中（Alert「アプリを閉じないようにご注意ください」と
 * CircularProgress 100）・完了（CheckCircle 150 と「再決済が完了しました。」）・失敗の段に移る
 */
const RetryPaymentDialog = ({ close }: { close: () => void }) => (
  <Dialog isOpen onOpenChange={(open) => !open && close()}>
    <DialogHeader>
      <DialogTitle>再決済</DialogTitle>
    </DialogHeader>
    <Typography size="s">2026/11/01 〜 2026/12/01 ご利用分の再決済を行います</Typography>
    <DialogFooter>
      <Button appearance="transparent" onPress={close}>
        閉じる
      </Button>
      <Button appearance="outlined" onPress={close}>
        決済
      </Button>
    </DialogFooter>
  </Dialog>
)

/** ContractCancellationDialog。停止すると続けて満足度のアンケートを出す（「今後表示しない」を選んでいなければ） */
const ContractCancellationDialog = ({ dialogs }: { dialogs: DialogControl }) => (
  <Dialog isOpen onOpenChange={(open) => !open && dialogs.close()}>
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
      <Button appearance="transparent" onPress={dialogs.close}>
        閉じる
      </Button>
      <Button appearance="outlined" color="negative" onPress={() => dialogs.open('survey')}>
        停止
      </Button>
    </DialogFooter>
  </Dialog>
)

/** SatisfactionSurveyDialog/model.ts の items */
const surveyItems = [
  { label: 'よかった', image: surveyExcellent },
  { label: '普通だった', image: surveyGood },
  { label: '悪かった', image: surveyPoor },
]

/**
 * SatisfactionSurveyDialog。3 枚の絵（142×180）がそのまま押せるボタン（ToggleButton）で、ラベルは alt にだけある。
 * 下に「今後表示しない」と「閉じる」。DialogActions は無い
 */
const SatisfactionSurveyDialog = ({ close }: { close: () => void }) => (
  <Dialog isOpen onOpenChange={(open) => !open && close()}>
    <DialogHeader>
      <DialogTitle>サーバーの使い心地はどうでしたか？</DialogTitle>
    </DialogHeader>
    <Stack gap="l">
      <Stack flexDirection="row" gap="m" justifyContent="center">
        {surveyItems.map((item) => (
          // 実物は Paper（px 2, py 3）の中の絵で、ホバーで角丸 16px のグラデーションの枠が出る。
          // 画像のトグルボタンが wip-ui に無いので素の button
          <Paper key={item.label} padding="s" elevation={0}>
            <button
              type="button"
              onClick={close}
              style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
            >
              <img src={item.image} alt={item.label} width={142} height={180} />
            </button>
          </Paper>
        ))}
      </Stack>
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
        <Checkbox>今後表示しない</Checkbox>
        <Button appearance="transparent" onPress={close}>
          閉じる
        </Button>
      </Stack>
    </Stack>
  </Dialog>
)

/** InvoiceDialog。「宛名」（m 太字）と説明（s）の下に、ラベルの無い入力欄 */
const InvoiceDialog = ({ close }: { close: () => void }) => (
  <Dialog isOpen onOpenChange={(open) => !open && close()}>
    <DialogHeader>
      <DialogTitle>領収書の宛名</DialogTitle>
    </DialogHeader>
    <TextField label="宛名" caption="書類の交付を受ける事業者の氏名または名称" width="full" />
    <DialogFooter>
      <Button appearance="transparent" onPress={close}>
        閉じる
      </Button>
      <Button appearance="outlined" onPress={close}>
        ダウンロード
      </Button>
    </DialogFooter>
  </Dialog>
)

const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const years = Array.from({ length: 10 }, (_, i) => String(2026 + i))

/**
 * servers/new/payment-info の RegisterPaymentCardForm（Paper p 4、地色 #1D2A40）＋ components/PaymentCardForm。
 * 実物の有効期限（CcExpSelect）は未選択で空欄
 */
const RegisterPaymentCardForm = () => (
  <Paper padding="xl" elevation={0} outlined>
    <Stack gap="xl">
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
      {/* 実物は p 2 の薄い地色の面 */}
      <Paper padding="m" elevation={0} outlined>
        <Typography size="xs" component="p">
          当社がお客様から収集した以下の個人情報等は、カード発行会社がおこなう不正利用検知・防止のために、お客様が利用されているカード発行会社へ提供させていただきます。氏名、電話番号、emailアドレス、請求先住所、配送先住所、インターネット利用環境に関する情報等（送信するパラメータの内容に応じて個人情報を記載ください）
          <br />
          お客様が利用されているカード発行会社が海外にある場合、これらの情報は当該発行会社が所属する国に移転される場合があります。お客様が未成年の場合、親権者または後見人の承諾を得た上で、本サービスを利用するものとします。
        </Typography>
      </Paper>
    </Stack>
  </Paper>
)

/**
 * servers/new/payment-info の ConfirmPaymentCardForm。登録済みのカード（PaymentCardDetail）と、
 * 鉛筆の「変更」（文字だけのボタン）。薄い地色・角丸 16px の面（p 2）
 */
const ConfirmPaymentCardForm = ({ onEdit }: { onEdit: () => void }) => (
  <Paper padding="m" elevation={0} outlined>
    <Stack
      flexDirection={{ xxs: 'column', m: 'row' }}
      gap="m"
      justifyContent="space-between"
      alignItems="center"
    >
      <PaymentCardDetail />
      <Button
        appearance="transparent"
        size="l"
        leading={<Icon name="pencil" size="s" />}
        onPress={onEdit}
      >
        変更
      </Button>
    </Stack>
  </Paper>
)

/**
 * components/PaymentMethodChangeDialog の入力の段（InputDialogContent）。登録済みのカードがあるので、
 * 初めは ConfirmPaymentCardForm を出し、「変更」でカード情報の入力（RegisterPaymentCardForm）に切り替わる。
 * 実物は onClose を渡しておらず、外側を押しても閉じない
 */
const PaymentMethodChangeDialog = ({ close }: { close: () => void }) => {
  const [editing, setEditing] = useState(false)
  return (
    <Dialog isOpen isDismissable={false}>
      <DialogHeader>
        <DialogTitle>支払い方法の変更</DialogTitle>
      </DialogHeader>
      <Stack gap="xl">
        <Callout color="notice" appearance="outline">
          現在登録可能なクレジットカードの情報はアカウントに対して1件のみです。
          <br />
          クレジットカード情報を変更した場合は、クレジット支払いを選択しているすべてのサーバーの情報が変更されます。
        </Callout>
        {/* 実物の RadioGroup に見える見出しは無い */}
        <RadioGroup aria-label="支払い方法" defaultValue="credit-card">
          <Stack gap={editing ? 'xl' : 'm'}>
            <Stack gap="m">
              <Stack flexDirection="row" gap="xs" alignItems="center">
                <Radio value="credit-card">クレジットカード</Radio>
                {/* components/PaymentCardBrandIconsList。実物は 32×20 の白地の枠 */}
                <Stack flexDirection="row" gap="xxs" alignItems="center">
                  {cardBrands.map((brand) => (
                    <img
                      key={brand.label}
                      src={brand.logo}
                      alt={brand.label}
                      width={32}
                      height={20}
                    />
                  ))}
                </Stack>
              </Stack>
              {editing ? (
                <RegisterPaymentCardForm />
              ) : (
                <ConfirmPaymentCardForm onEdit={() => setEditing(true)} />
              )}
            </Stack>
            <Stack gap="xs">
              <Stack flexDirection="row" gap="xs" alignItems="center">
                <Radio value="paypay">PayPay</Radio>
                <img src={paypayLogo} alt="PayPay" width={30} height={30} />
              </Stack>
              {/* 実物は「利用できる支払い方法と対応ブランド」がヘルプ記事へのリンク（別タブ） */}
              <Typography size="xxs" component="p">
                ※この支払い方法は自動更新に対応していません。詳しくは利用できる支払い方法と対応ブランドをご確認ください。
              </Typography>
            </Stack>
          </Stack>
        </RadioGroup>
      </Stack>
      <DialogFooter>
        <Button appearance="transparent" onPress={close}>
          キャンセル
        </Button>
        <Button appearance="outlined" onPress={close}>
          変更
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

// ─── 画面 ───

/** payment/client.tsx。Container xl ＋ Stack spacing 5 で ServerPaymentHeader → PaymentTabPanels */
const PaymentScreen = ({
  state = {},
  tab = 'detail',
  initialDialog = null,
}: {
  state?: GamersState
  tab?: 'detail' | 'history'
  initialDialog?: DialogName | null
}) => {
  const [dialog, setDialog] = useState<DialogName | null>(initialDialog)
  const dialogs: DialogControl = { open: setDialog, close: () => setDialog(null) }
  return (
    <GamersServerShell active="payment">
      <Container size="xl">
        <Stack gap="xl">
          {/* ServerPaymentHeader */}
          <Typography size="xxxl" fontWeight="bold" component="h1">
            支払い
          </Typography>
          <PaymentTabPanels state={state} tab={tab} dialogs={dialogs} />
        </Stack>
      </Container>
      {/* Tabs の外に置く。Dialog の中の Select を Tabs の子孫にしないため */}
      {dialog === 'retry' && <RetryPaymentDialog close={dialogs.close} />}
      {dialog === 'cancel' && <ContractCancellationDialog dialogs={dialogs} />}
      {dialog === 'survey' && <SatisfactionSurveyDialog close={dialogs.close} />}
      {dialog === 'invoice' && <InvoiceDialog close={dialogs.close} />}
      {dialog === 'paymentMethod' && <PaymentMethodChangeDialog close={dialogs.close} />}
    </GamersServerShell>
  )
}

/**
 * PaymentTabPanels。Tabs と各タブの中身は Stack spacing 2、詳細の中は spacing 3。
 * 実物のタブは同じページの中の切り替え（ActiveTab）
 */
const PaymentTabPanels = ({
  state,
  tab,
  dialogs,
}: {
  state: GamersState
  tab: 'detail' | 'history'
  dialogs: DialogControl
}) => {
  const navigate = useGamersNavigate()
  return (
    <Tabs
      defaultSelectedKey={tab}
      onSelectionChange={(key) => navigate(key === 'history' ? 'payment-history' : 'payment')}
    >
      {/* Tabs と各タブの中身の間は Stack spacing 2（16px） */}
      <Stack gap="m">
        {/* 実物の aria-label は 'basic tabs example' */}
        <TabList aria-label="支払い">
          <Tab id="detail">詳細</Tab>
          <Tab id="history">履歴</Tab>
        </TabList>
        <TabPanel id="detail">
          <Stack gap="l">
            <RecentPaymentsPaper state={state} dialogs={dialogs} />
            {/* 特典アカウント（isBenefitAccount）では出ない */}
            <PaymentMethodsPaper state={state} dialogs={dialogs} />
          </Stack>
        </TabPanel>
        <TabPanel id="history">
          <PaymentHistoryPaper dialogs={dialogs} />
        </TabPanel>
      </Stack>
    </Tabs>
  )
}

// ─── ストーリー ───

/**
 * サーバーの支払い（最近の支払いのタイムライン・決済手段）。
 *
 * @summary 支払い
 */
export const Default: Story = {
  render: () => <PaymentScreen />,
}

/**
 * 読み込み中。タイムラインと決済手段を骨格で出す。
 *
 * @summary 読み込み中
 */
export const Loading: Story = {
  render: () => <PaymentScreen state={{ loading: true }} />,
}

/**
 * 支払い履歴。成功した行には「領収書」が出る。列見出しの最後は空。
 *
 * @summary 支払い履歴
 */
export const History: Story = {
  render: () => <PaymentScreen tab="history" />,
}

/**
 * 自動更新の決済に失敗し、契約が停止（SUSPENDED）しているときの再決済の確認。
 * タイムラインの先頭に再決済の案内が出ている。
 *
 * @summary 再決済の確認
 */
export const RetryPayment: Story = {
  render: () => <PaymentScreen state={{ error: true }} initialDialog="retry" />,
}

/**
 * 自動更新の停止の確認。停止後もいつまで使えるかを出す。
 *
 * @summary 自動更新の停止
 */
export const StopAutoRenewal: Story = {
  render: () => <PaymentScreen initialDialog="cancel" />,
}

/**
 * 自動更新を停止した直後に出る満足度のアンケート。選ぶと閉じる。「今後表示しない」で次から出さない。
 *
 * @summary 満足度のアンケート
 */
export const SatisfactionSurvey: Story = {
  render: () => <PaymentScreen initialDialog="survey" />,
}

/**
 * 領収書の宛名。支払い履歴の「領収書」から開く。
 *
 * @summary 領収書の宛名
 */
export const Invoice: Story = {
  render: () => <PaymentScreen tab="history" initialDialog="invoice" />,
}

/**
 * 支払い方法の変更。登録済みのカードの「変更」で、クレジットカードの情報の入力に切り替わる。
 *
 * @summary 支払い方法の変更
 */
export const ChangePaymentMethod: Story = {
  render: () => <PaymentScreen initialDialog="paymentMethod" />,
}
