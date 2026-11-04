import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Dialog, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Loader } from '../../Loader'
import { Stack } from '../../Stack'
import { Typography } from '../../Typography'
import paypayLogo from './assets/gamers/paypay.svg'
import { GamersPageContainer, GamersShell, useGamersNavigate } from './gamersShell'
import { Card } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

/**
 * 契約更新・再決済の購入画面。ゲーマーズの PayPay（都度払い）の契約で、「支払い」の「契約更新」から入る。
 * 元：apollo/frontend/src/app/(application)/(private)/servers/(no_sidebar)/[id]/billing
 * （client.tsx・hooks.ts・model.ts・_components/Message・_components/PaymentInfoPaper）と
 * components/OrderDetailDialog（ダイアログではなく右カラムの面）・components/InSubmitDialog。
 * 実物はサイドバーの無いレイアウト（(no_sidebar)）で、(private)/layout.tsx の GlobalHeader の下に client.tsx の Container（mt 3）が来る。
 * 「購入する」を押すと PayPay へ移るので、このテンプレートでは購入中の表示までを扱う。
 */

const meta = {
  title: 'Templates/Gamers/Renewal',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ ───

// 契約中のプラン。Templates/Gamers/Payment の契約（8GB・1ヶ月）と同じ
const order = {
  game: 'Minecraft (Java版)',
  memory: '8GB',
  period: '1ヶ月',
  // 未払いの請求の期間、なければ次の契約期間（startDate・endDate）。OrderDetailDialog の formatDate
  range: '(2026/11/01 ~ 2026/11/30)',
  monthly: '3,000円',
  total: '3,000円',
}

// ─── 部品 ───

// GAP-NEW: Skeleton が無い。実物は文字の形の骨格を出すが、Loader で代用している
const Pending = () => <Loader size="s" />

/** _components/PaymentInfoPaper ＋ PaymentMethodCard */
const PaymentInfo = ({ loading }: { loading: boolean }) => {
  const navigate = useGamersNavigate()
  return (
    // 実物の Paper は pt 6・pb 8・px 4
    <Card padding="xl">
      <Stack gap="xl">
        <Typography size="xxl" fontWeight="bold" component="h2">
          支払い方法
        </Typography>
        {/* GAP-NEW: Stack の alignItems にブレークポイントごとの値を渡せない。実物は縦並び（xs）のとき左揃え */}
        <Stack
          flexDirection={{ xxs: 'column', s: 'row' }}
          gap="s"
          justifyContent="space-between"
          alignItems="center"
        >
          {loading ? (
            <Pending />
          ) : (
            <Stack flexDirection="row" gap="m" alignItems="center">
              <img src={paypayLogo} alt="PayPay" width={48} height={48} />
              <Typography size="s" component="p">
                PayPay
              </Typography>
            </Stack>
          )}
          {/* 支払いの画面へ移り、支払い方法の変更のダイアログを開く（payment?payment_method_change_dialog=true） */}
          <Button appearance="outlined" onPress={() => navigate('payment-method-change')}>
            変更
          </Button>
        </Stack>
      </Stack>
    </Card>
  )
}

const OrderRow = ({ title, value, help }: { title: string; value?: string; help?: string }) => (
  <Stack flexDirection="row" justifyContent="space-between" alignItems="flex-start" gap="m">
    <Typography size="l" component="span">
      {title}
    </Typography>
    {value ? (
      <Stack gap="xxs" alignItems="flex-end">
        <Typography size="l" fontWeight="bold" component="span">
          {value}
        </Typography>
        {help && (
          <Typography size="s" color="medium_emphasis" component="span">
            {help}
          </Typography>
        )}
      </Stack>
    ) : (
      <Pending />
    )}
  </Stack>
)

/**
 * components/OrderDetailDialog。更新では「変更」ボタン（changeButtonHref）を渡さない。
 * 実物は期間の変更予定・未完了の PayPay の支払いがあると、ここに Callout を足す
 * （GAP-NEW: 文中のテキストリンク（Link）が無い。未完了の支払いの案内の「こちら」をリンクにできない）。
 * 購入を始められなかったときなどは、ページの上に _components/Message（Alert の AlertTitle ＋本文）を出す
 * （GAP-NEW: Callout にタイトルの枠が無い）。
 */
const OrderDetail = ({ loading }: { loading: boolean }) => {
  const navigate = useGamersNavigate()
  return (
    // 実物の Paper は pt 6・pb 8・px 4。見出し・明細・区切り線・合計・ボタンの間はどれも 40px（mb 5 / my 5）
    <Card padding="xl">
      <Stack gap="xxl">
        {/* 実物は variant='xxl_comfort' */}
        <Typography size="xxl" fontWeight="bold" component="h2">
          注文内容
        </Typography>
        <Stack gap="xs">
          <OrderRow title="ゲーム" value={loading ? undefined : order.game} />
          <OrderRow title="容量" value={loading ? undefined : order.memory} />
          <OrderRow title="期間" value={loading ? undefined : order.period} help={order.range} />
          <OrderRow title="月額" value={loading ? undefined : order.monthly} />
        </Stack>
        <Divider />
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Typography size="xl" fontWeight="bold" component="span">
            合計
          </Typography>
          {loading ? (
            <Pending />
          ) : (
            <Typography size="xxl" fontWeight="bold" component="span">
              {order.total}
            </Typography>
          )}
        </Stack>
        {/* 押すと購入中（InSubmitDialog）の後、PayPay の決済ページ（paypayUrl）へ。始められなかったときは支払い（payment）へ戻る */}
        <Button
          color="interactive"
          size="l"
          width="full"
          isDisabled={loading}
          onPress={() => navigate('external')}
        >
          購入する
        </Button>
      </Stack>
    </Card>
  )
}

// GAP-NEW: Dialog に幅の prop（MUI の fullWidth・600px）が無い。inline style を当てない方針のため未対応で、中身の幅で縮む

/**
 * components/InSubmitDialog。閉じられない。「購入する」を押して PayPay へ移るまでと、
 * PayPay から戻って支払いの完了を確かめている間に出る。
 */
const InSubmitDialog = () => (
  <Dialog isOpen isDismissable={false}>
    <DialogHeader>
      <DialogTitle>購入</DialogTitle>
    </DialogHeader>
    <Stack gap="xl">
      <Callout color="notice" appearance="outline">
        アプリを閉じないようにご注意ください
      </Callout>
      <Stack alignItems="center">
        <Loader size="xxl" />
      </Stack>
    </Stack>
  </Dialog>
)

// ─── 画面 ───

const RenewalScreen = ({
  loading = false,
  submitting = false,
}: {
  loading?: boolean
  submitting?: boolean
}): ReactNode => (
  <GamersShell>
    {/* client.tsx の Container（mt 3）＋ Message ＋ Grid（spacing 2、md 以上で 8 / 4） */}
    <GamersPageContainer maxWidth="lg">
      <Grid spacing="m">
        <GridItem size={{ xxs: 12, m: 8 }}>
          <PaymentInfo loading={loading} />
        </GridItem>
        <GridItem size={{ xxs: 12, m: 4 }}>
          <OrderDetail loading={loading} />
        </GridItem>
      </Grid>
    </GamersPageContainer>
    {submitting && <InSubmitDialog />}
  </GamersShell>
)

// ─── ストーリー ───

/**
 * 契約の更新（再決済）。左に支払い方法（PayPay）、右に注文内容と「購入する」。
 *
 * @summary 契約更新の購入
 */
export const Default: Story = {
  render: () => <RenewalScreen />,
}

/**
 * 契約とプランを読み込み中（GAP-NEW: Skeleton が無いので Loader で代用）。「購入する」は押せない。
 *
 * @summary 読み込み中
 */
export const Loading: Story = {
  render: () => <RenewalScreen loading />,
}

/**
 * 「購入する」を押して PayPay へ移るまで、または PayPay から戻って支払いの完了を確かめている間。
 *
 * @summary 購入中
 */
export const Submitting: Story = {
  render: () => <RenewalScreen submitting />,
}
