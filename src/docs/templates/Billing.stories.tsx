import { useEffect, useState } from 'react'

import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Paper } from '../../Paper'
import { Select, SelectItem } from '../../Select'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Switch } from '../../Switch'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../Table'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import {
  AiGatewayShell,
  navigateToAiGatewayStory,
  PageContainer,
  PageHeader,
} from './aiGatewayShell'
import complimentaryCreditGranted from './assets/ai-gateway/campaigns/complimentary-credit-granted.png'
import welcomeCreditIllustration from './assets/ai-gateway/campaigns/welcome-credit-illustration.svg'
import amexLogo from './assets/ai-gateway/card-brands/amex.svg'
import dinersLogo from './assets/ai-gateway/card-brands/diners.svg'
import jcbLogo from './assets/ai-gateway/card-brands/jcb.svg'
import mastercardLogo from './assets/ai-gateway/card-brands/mastercard.svg'
import visaLogo from './assets/ai-gateway/card-brands/visa.svg'
import { InfoTip } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

/**
 * AI ゲートウェイ（octane/admin-ui）の組織の「クレジット」（/accounts/[accountId]/billing）。
 * features/Billing の index.tsx・BillingContent.tsx・sections.tsx・BillingDialogs.tsx・dialogs.tsx・
 * CardTokenForm.tsx・CardBrandLabel.tsx・ComplimentaryCreditNotice.tsx・CardChallengeReturn.tsx に合わせている。
 * 枠は aiGatewayShell（組織の画面。Sidebar の「クレジット」が現在地、パンくずは「組織 / クレジット」）。
 *
 * 実物と違って残っている点:
 * - GAP: Skeleton が無い。読み込み中は、実物が骨格を出す場所（残高・ボタンの行・表）に Loader を置いている
 * - GAP: Money が無い。残高の小数部（.6789）は実物では 0.6em・gray[500]。ここでは同じ大きさ・色で続けて出す
 * - GAP: 残高・通知の面は実物では影の無い枠線（gray[200]）・角丸 12px。Paper の角丸のまま
 * - GAP: 残高・通知の 2 枚は実物では同じ高さに伸び、ボタンの行が下端にそろう（margin-top: auto）。ここでは中身の高さのまま
 * - GAP: 残高・通知の面のボタンは実物では文字 12px・太字・影なし（walletActionButton）。Button の size="s" のまま
 * - GAP: shared/ui/DataTable の列の最小幅（minWidth）と右寄せ（align: 'end'。金額・付与額・残高）が無い。表は左寄せ
 * - GAP: DataTableText tone="aux"（14px・行の高さ 20px）の文字を、Typography size="s" density="dense" で出している
 * - GAP: Dialog の幅（実物は styles.dialog の 520px）を指定できず、ダイアログは中身の幅になる
 * - GAP: SegmentedControl（shared/ui）が無い。実物は白い地に gray[200] の枠のトラックの中に 16px・gray[600] の項目を並べ、
 *   選択中は gray[100] の地と太字。ここでは選択中を neutral の outlined、ほかを neutral の transparent の Button で並べている
 * - GAP: 内訳の面（chargeDetails）は実物では地が gray[50]。Paper の地のまま
 * - GAP: スイッチで開く欄の高さのアニメーション（collapsePanel）が無い。開いた状態だけを出している
 * - GAP: カード番号・有効期限・セキュリティコードは実物では決済代行の iframe（枠線 gray[200]・角丸 6px）。TextField で代用している
 * - GAP: WelcomeCreditGrantedDialog は実物では 480px 幅・中央揃え・独自の文字組み（オレンジの小見出し、メッシュで抜いた 90px の数字、
 *   右上に重ねた閉じるボタン、グラデーションの地の面）。Typography と Paper の範囲で並べている
 * - GAP: ComplimentaryCreditGrantedDialog の画像は実物では幅 100%・角丸 8px。原寸（1080 角）だと収まらないので 400 角にしている
 */

const meta = {
  title: 'Templates/AiGateway/Billing',
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

// ─── データ（値はダミー）───

/** cardChallengeReturn はカード認証（3DS2）から戻った直後の画面（CardChallengeReturn） */
type CreditView = 'loading' | 'error' | 'success' | 'cardChallengeReturn'

// formatMicroJpyParts（Intl の ja-JP / JPY）。残高は小数 4 桁まで出す
const balance = '￥12,345.6789'

// mergeHistoryEntries。チャージと特典の付与を日時の新しい順に混ぜる。色が付くのは失敗（negative）と確認中（notice）だけ
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

// formatDateTime（Intl の ja-JP、dateStyle: medium・timeStyle: short）
const complimentaryExpiresAt = '2026/12/31 23:59'

// formatMaskedNumber
const cardNumber = '•••• 4242'

// mulpay.ts の supportedCardBrands。ロゴは public/card-brands/*.svg
const cardBrands = [
  { label: 'Visa', logo: visaLogo },
  { label: 'Mastercard', logo: mastercardLogo },
  { label: 'JCB', logo: jcbLogo },
  { label: 'American Express', logo: amexLogo },
  { label: 'Diners Club', logo: dinersLogo },
]

// dialogs.tsx の manualChargeAmountOptions
const chargeAmounts = [
  { id: '1000', label: '1,000円' },
  { id: '3000', label: '3,000円' },
  { id: '5000', label: '5,000円' },
  { id: '10000', label: '10,000円' },
  { id: 'custom', label: 'カスタム' },
]

/** 開いているダイアログ（BillingDialogs と ComplimentaryCreditNotice が出すもの） */
type DialogName =
  | 'charge'
  | 'chargeConfirm'
  | 'autoCharge'
  | 'lowBalance'
  | 'card'
  | 'complimentary'
  | 'welcome'

type OpenDialog = (name: DialogName) => void

// ─── 部品 ───

const LoadingBlock = () => (
  <Stack alignItems="flex-start">
    <Loader size="s" />
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

/**
 * 節の見出し（Typography m 太字）。お支払い方法だけ右にボタンを持つ（styles.sectionHead）。
 * 実物は見出しではなく p（.sections p で margin 0）なので、UA の margin が残らない div にしている
 */
const SectionTitle = ({ children, action }: { children: string; action?: ReactNode }) => (
  <Stack flexDirection="row" gap="m" justifyContent="space-between" alignItems="center">
    <Typography size="m" fontWeight="bold" component="div">
      {children}
    </Typography>
    {action}
  </Stack>
)

/** CardBrandLabel。ロゴ（幅 32px）と伏せたカード番号 */
const CardBrandLabel = () => (
  <Stack flexDirection="row" gap="xs" alignItems="center">
    <img src={visaLogo} alt="Visa" width={32} height={21} />
    <span>{cardNumber}</span>
  </Stack>
)

/** DataTableEmpty（s の太字の h3） */
const TableEmpty = ({ title }: { title: string }) => (
  <Typography component="h3" size="s" fontWeight="bold">
    {title}
  </Typography>
)

/** DataTableText tone="aux"（14px・行の高さ 20px） */
const Aux = ({ children }: { children: ReactNode }) => (
  <Typography size="s" density="dense" component="span">
    {children}
  </Typography>
)

/**
 * sections.tsx の PrepaidBalanceSection（styles.wallet）と LowBalanceNotificationCard（styles.sideCard）。
 * どちらも padding 24px・中の gap 16px の枠線の面で、900px 以上で 2 列に等分する（styles.walletGrid、gap 16px）。
 * 面の中の文字は p（.sections p で margin 0）なので、UA の margin が残らない div にしている
 */
const WalletCards = ({ loading = false, onOpen }: { loading?: boolean; onOpen?: OpenDialog }) => (
  <section aria-label="クレジット残高">
    <Grid spacing="m">
      <GridItem size={{ xxs: 12, m: 6 }}>
        <Paper outlined>
          <Stack gap="m">
            {/* walletHead（gap 4px）: 見出しの行（gap 8px）と残高 */}
            <Stack gap="xxs">
              <Stack flexDirection="row" gap="xs" alignItems="center">
                <Typography size="m" fontWeight="bold" component="div">
                  クレジット残高
                </Typography>
                {/* 骨格では出さない */}
                {!loading && (
                  <InfoTip label="クレジットの有効期限とは">
                    追加したクレジットは、購入日から1年で失効します。
                  </InfoTip>
                )}
              </Stack>
              {loading ? (
                <LoadingBlock />
              ) : (
                <Typography component="span" size="xxl" fontWeight="bold">
                  {balance}
                </Typography>
              )}
            </Stack>
            {loading ? (
              <LoadingBlock />
            ) : (
              // actionRow（gap 8px）。自動チャージはカードがあるときだけ
              <Stack flexDirection="row" gap="xs">
                {/* カードがあれば ManualChargeDialog、無ければ CardRegistrationDialog */}
                <Button
                  size="s"
                  leading={<Icon name="plus" size="s" />}
                  onPress={() => onOpen?.('charge')}
                >
                  追加する
                </Button>
                <Button
                  appearance="outlined"
                  color="neutral"
                  size="s"
                  leading={<Icon name="gear" size="s" />}
                  onPress={() => onOpen?.('autoCharge')}
                >
                  自動チャージ
                </Button>
              </Stack>
            )}
          </Stack>
        </Paper>
      </GridItem>
      <GridItem size={{ xxs: 12, m: 6 }}>
        <section aria-label="通知">
          <Paper outlined>
            <Stack gap="m">
              <Stack gap="xxs">
                <Typography size="m" fontWeight="bold" component="div">
                  通知
                </Typography>
                <Typography size="s" color="medium_emphasis" component="div">
                  クレジット残高が基準を下回ったときにメールでお知らせします。
                </Typography>
              </Stack>
              {loading ? (
                <LoadingBlock />
              ) : (
                <Stack flexDirection="row" gap="xs">
                  <Button
                    appearance="outlined"
                    color="neutral"
                    size="s"
                    leading={<Icon name="bell" size="s" />}
                    onPress={() => onOpen?.('lowBalance')}
                  >
                    設定する
                  </Button>
                </Stack>
              )}
            </Stack>
          </Paper>
        </section>
      </GridItem>
    </Grid>
  </section>
)

/** BillingContent。節は面に入れず、見出しと表を縦に積む（styles.sections は gap 32px、styles.stack は 16px） */
const BillingContent = ({
  view,
  onOpen,
}: {
  view: Exclude<CreditView, 'cardChallengeReturn'>
  onOpen: OpenDialog
}) => {
  if (view === 'loading') {
    // BillingSkeleton。特典クレジットの節は出さない
    return (
      <Stack gap="xl">
        <WalletCards loading />
        <Stack gap="m">
          <SectionTitle>チャージ履歴</SectionTitle>
          <LoadingBlock />
        </Stack>
        <Stack gap="m">
          <SectionTitle>お支払い方法</SectionTitle>
          <LoadingBlock />
        </Stack>
      </Stack>
    )
  }
  if (view === 'error') return <RetryCallout message="請求情報を読み込めませんでした。" />
  return (
    <Stack gap="xl">
      <WalletCards onOpen={onOpen} />

      {/* ComplimentaryCreditSection。有効な特典があるときだけ出る */}
      <section aria-label="特典クレジット">
        <Stack gap="m">
          <SectionTitle>特典クレジット</SectionTitle>
          {/* shared/ui/DataTable は表を枠線の Paper（padding 0）に入れる */}
          <Paper outlined padding="none">
            <Table aria-label="特典クレジット">
              <TableHeader>
                <Column isRowHeader>特典名</Column>
                <Column>付与額</Column>
                <Column>有効期限</Column>
                <Column>残高</Column>
              </TableHeader>
              <TableBody renderEmptyState={() => <TableEmpty title="特典クレジットはありません" />}>
                <Row>
                  <Cell>ウェルカムクレジット</Cell>
                  <Cell>￥1,000</Cell>
                  <Cell>
                    <Aux>{complimentaryExpiresAt}</Aux>
                  </Cell>
                  <Cell>￥412.5</Cell>
                </Row>
              </TableBody>
            </Table>
          </Paper>
          <Typography size="s" color="medium_emphasis" component="div">
            特典クレジットは、チャージしたクレジットより先に消費されます。
          </Typography>
        </Stack>
      </section>

      {/* PaymentHistorySection */}
      <section aria-label="チャージ履歴">
        <Stack gap="m">
          <SectionTitle>チャージ履歴</SectionTitle>
          <Paper outlined padding="none">
            <Table aria-label="チャージ履歴">
              <TableHeader>
                <Column isRowHeader>日時</Column>
                <Column>種別</Column>
                <Column>金額</Column>
                <Column>結果</Column>
              </TableHeader>
              <TableBody renderEmptyState={() => <TableEmpty title="チャージ履歴はありません" />}>
                {chargeHistory.map((h) => (
                  <Row key={`${h.at}-${h.status}`}>
                    <Cell>
                      <Aux>{h.at}</Aux>
                    </Cell>
                    <Cell>
                      <Aux>{h.source}</Aux>
                    </Cell>
                    <Cell>{h.amount}</Cell>
                    <Cell>
                      {historyColor[h.status] ? (
                        <Sticker size="s" color={historyColor[h.status]}>
                          {h.status}
                        </Sticker>
                      ) : (
                        <Aux>{h.status}</Aux>
                      )}
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Stack>
      </section>

      {/* PaymentMethodsSection。「カードを追加する」は契約が有効なときだけ */}
      <section aria-label="お支払い方法">
        <Stack gap="m">
          <SectionTitle
            action={
              <Button color="neutral" size="s" onPress={() => onOpen('card')}>
                カードを追加する
              </Button>
            }
          >
            お支払い方法
          </SectionTitle>
          <Paper outlined padding="none">
            <Table aria-label="お支払い方法">
              <TableHeader>
                <Column isRowHeader>カード番号</Column>
                <Column>有効期限</Column>
              </TableHeader>
              <TableBody
                renderEmptyState={() => <TableEmpty title="登録されているカードはありません" />}
              >
                <Row>
                  <Cell>
                    {/* CardIdentity: CardBrandLabel と、既定のカードなら「既定」 */}
                    <Stack flexDirection="row" gap="xs" alignItems="center">
                      <CardBrandLabel />
                      <Sticker size="s" color="neutral">
                        既定
                      </Sticker>
                    </Stack>
                  </Cell>
                  <Cell>
                    <Aux>12/28</Aux>
                  </Cell>
                </Row>
              </TableBody>
            </Table>
          </Paper>
        </Stack>
      </section>
    </Stack>
  )
}

// ─── ダイアログ（dialogs.tsx・BillingDialogs.tsx・ComplimentaryCreditNotice.tsx）───

type DialogProps = {
  onClose: () => void
  onOpen: (name: DialogName) => void
  onNavigate?: (to: string) => void
}

const closeOn = (onClose: () => void) => (open: boolean) => {
  if (!open) onClose()
}

/** dialogs.tsx の ChargeDetail。項目名と金額の行。合計の行は上に罫線 */
const ChargeDetail = ({
  label,
  value,
  total = false,
}: {
  label: string
  value: string
  total?: boolean
}) => (
  <Stack flexDirection="row" gap="m" justifyContent="space-between" alignItems="center">
    <Typography component="span" size={total ? 'm' : 's'} color="medium_emphasis">
      {label}
    </Typography>
    <Typography component="span" size={total ? 'm' : 's'} fontWeight={total ? 'bold' : undefined}>
      {value}
    </Typography>
  </Stack>
)

/** 内訳の面（styles.section の padding 16px、行の間 12px） */
const ChargeDetails = ({ amount, totalLabel }: { amount: string; totalLabel: string }) => (
  <Paper outlined padding="m">
    <Stack gap="s">
      <ChargeDetail label="クレジット" value={amount} />
      <ChargeDetail label="手数料" value="￥0" />
      <ChargeDetail label="消費税" value="￥0" />
      <Divider />
      <ChargeDetail label={totalLabel} value={amount} total />
    </Stack>
  </Paper>
)

/** ManualChargeDialog。確定すると BillingDialogs の ConfirmDialog（「クレジットを追加しますか？」）が重なる */
const ManualChargeDialog = ({ onClose, onOpen }: DialogProps) => (
  <Dialog isOpen onOpenChange={closeOn(onClose)}>
    <DialogHeader>
      <DialogTitle>クレジットを追加する</DialogTitle>
      <DialogDescription>追加したクレジットは、購入日から1年で失効します。</DialogDescription>
    </DialogHeader>
    {/* dialogFields（gap 16px） */}
    <Stack gap="m">
      {/* 「別のカードを登録する」を選ぶと、このダイアログを閉じてカードの登録を開く（registerCardFromCharge） */}
      <Select
        autoFocus
        label="支払いカード"
        width="full"
        defaultSelectedKey="card-0"
        onSelectionChange={(key) => {
          if (key === 'register-card') onOpen('card')
        }}
      >
        <SelectItem id="card-0" textValue={`Visa ${cardNumber}`}>
          <CardBrandLabel />
        </SelectItem>
        <SelectItem id="register-card">別のカードを登録する</SelectItem>
      </Select>
      {/* amountSection（gap なし）: 金額の選択、「カスタム」のときだけ開く金額の欄、残りチャージ可能額。
          Stack の既定の gap は m（16px）なので、最小の xxs（4px）にする */}
      <Stack gap="xxs">
        {/* SegmentedControl のラベルの行（14px・太字・行の高さ 24px、下に 8px） */}
        <Stack gap="xs">
          <Typography size="s" fontWeight="bold" component="span">
            追加する金額
          </Typography>
          <Stack flexDirection="row" gap="xxs">
            {chargeAmounts.map((o) => (
              <Button
                key={o.id}
                size="s"
                color="neutral"
                appearance={o.id === '5000' ? 'outlined' : 'transparent'}
                aria-pressed={o.id === '5000'}
              >
                {o.label}
              </Button>
            ))}
          </Stack>
        </Stack>
        <Typography size="s" color="medium_emphasis">
          残りチャージ可能額 ￥487,654.3211（クレジット保有上限 ¥500,000）
        </Typography>
      </Stack>
      <ChargeDetails amount="￥5,000" totalLabel="合計金額" />
    </Stack>
    <DialogFooter>
      <Button appearance="transparent" color="neutral" onPress={onClose}>
        閉じる
      </Button>
      <Button color="neutral" onPress={() => onOpen('chargeConfirm')}>
        クレジットを追加する
      </Button>
    </DialogFooter>
  </Dialog>
)

/**
 * BillingDialogs の ConfirmDialog（shared/ui/ConfirmDialog、幅 400px）。
 * 確定すると決済を始め、カード認証（3DS2）が要るときは決済代行の認証画面へ移り、終わると CardChallengeReturn に戻る
 */
const ChargeConfirmDialog = ({ onClose, onNavigate }: DialogProps) => (
  <Dialog isOpen onOpenChange={closeOn(onClose)} role="alertdialog">
    <DialogHeader>
      <DialogTitle>クレジットを追加しますか？</DialogTitle>
    </DialogHeader>
    <DialogDescription>￥5,000をVisa •••• 4242で追加します。</DialogDescription>
    <DialogFooter>
      <Button appearance="transparent" color="neutral" onPress={onClose}>
        キャンセル
      </Button>
      <Button color="neutral" onPress={() => onNavigate?.('card-challenge-return')}>
        クレジットを追加する
      </Button>
    </DialogFooter>
  </Dialog>
)

/** 項目名とスイッチの行（styles.switchRow） */
const SwitchRow = ({ label }: { label: string }) => (
  <Stack flexDirection="row" gap="m" justifyContent="space-between" alignItems="center">
    <Typography size="s" fontWeight="bold">
      {label}
    </Typography>
    <Switch defaultSelected aria-label={label} />
  </Stack>
)

/** スイッチがオンのときだけ開く欄（collapseFields）。上に gray[100] の罫線、欄の間 16px */
const CollapseFields = ({ children }: { children: ReactNode }) => (
  <Stack gap="m">
    <Divider />
    {children}
  </Stack>
)

const AutoChargeSettingsDialog = ({ onClose }: DialogProps) => (
  <Dialog isOpen onOpenChange={closeOn(onClose)}>
    <DialogHeader>
      <DialogTitle>自動チャージを設定する</DialogTitle>
      <DialogDescription>
        残高が基準を下回ったときに、登録したカードで自動的にチャージします。
      </DialogDescription>
    </DialogHeader>
    <Stack gap="s">
      <SwitchRow label="自動チャージを使う" />
      <CollapseFields>
        {/* placeholder は自分で設定したカードなら「設定済みのカード」、ほかのメンバーなら「〇〇が設定したカード」、未設定なら「カードを選ぶ」 */}
        <Select label="支払いカード" width="full" placeholder="設定済みのカード">
          <SelectItem id="card-0" textValue={`Visa ${cardNumber}`}>
            <CardBrandLabel />
          </SelectItem>
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
      </CollapseFields>
    </Stack>
    <DialogFooter>
      <Button appearance="transparent" color="neutral" onPress={onClose}>
        閉じる
      </Button>
      <Button color="neutral" onPress={onClose}>
        保存する
      </Button>
    </DialogFooter>
  </Dialog>
)

const LowBalanceNotificationDialog = ({ onClose }: DialogProps) => (
  <Dialog isOpen onOpenChange={closeOn(onClose)}>
    <DialogHeader>
      <DialogTitle>通知を設定する</DialogTitle>
      <DialogDescription>
        クレジット残高が基準を下回ったときにメールでお知らせします。
      </DialogDescription>
    </DialogHeader>
    <Stack gap="s">
      <SwitchRow label="残高が下回ったら通知する" />
      <CollapseFields>
        <TextField
          label="通知する残高（円）"
          defaultValue="1,000"
          width="full"
          inputMode="numeric"
        />
      </CollapseFields>
    </Stack>
    <DialogFooter>
      <Button appearance="transparent" color="neutral" onPress={onClose}>
        閉じる
      </Button>
      <Button color="neutral" onPress={onClose}>
        保存する
      </Button>
    </DialogFooter>
  </Dialog>
)

/** CardRegistrationDialog ＋ CardTokenForm */
const CardRegistrationDialog = ({ onClose, onNavigate }: DialogProps) => (
  <Dialog isOpen onOpenChange={closeOn(onClose)}>
    <DialogHeader>
      <DialogTitle>クレジットカードを追加する</DialogTitle>
    </DialogHeader>
    <Stack gap="m">
      {/* cardBrands（gap 8px）。ロゴは幅 40px で gap 8px */}
      <Stack gap="xs">
        <Typography size="s" color="medium_emphasis" component="span">
          以下のカードをご利用いただけます
        </Typography>
        <Stack flexDirection="row" gap="xs">
          {cardBrands.map((brand) => (
            <img key={brand.label} src={brand.logo} alt={brand.label} width={40} height={26} />
          ))}
        </Stack>
      </Stack>
      {/* CardTokenFields（dialogFields、gap 16px） */}
      <Stack gap="m">
        <TextField label="カード番号" placeholder="1234 5678 9012 3456" width="full" />
        <Grid spacing="m">
          <GridItem size={6}>
            <TextField label="有効期限" placeholder="MM / YY" width="full" />
          </GridItem>
          <GridItem size={6}>
            <TextField label="セキュリティコード" placeholder="123" width="full" />
          </GridItem>
        </Grid>
        <TextField label="カード名義" width="full" />
      </Stack>
    </Stack>
    <DialogFooter>
      <Button appearance="transparent" color="neutral" onPress={onClose}>
        キャンセル
      </Button>
      {/* 認証が要るカードは決済代行の認証画面へ移り、終わると CardChallengeReturn に戻る。要らなければ閉じて一覧を読み直す */}
      <Button color="neutral" onPress={() => onNavigate?.('card-challenge-return')}>
        カードを登録する
      </Button>
    </DialogFooter>
  </Dialog>
)

/** ComplimentaryCreditNotice の ComplimentaryCreditGrantedDialog。見出しはキャンペーンごとの画像で、alt が見出しの名前になる */
const ComplimentaryCreditGrantedDialog = ({ onClose, onNavigate }: DialogProps) => (
  <Dialog isOpen onOpenChange={closeOn(onClose)}>
    <DialogHeader>
      <DialogTitle>
        <img
          src={complimentaryCreditGranted}
          alt="条件達成 10,000円分クレジット クレジットを獲得しました！"
          width={400}
          height={400}
        />
      </DialogTitle>
      {/* キャンペーン名は例 */}
      <DialogDescription>
        条件達成キャンペーンの特典として、10,000円分のクレジットを付与しました。
      </DialogDescription>
    </DialogHeader>
    <div>
      <Typography size="s">有効期限: 2027/10/31 23:59まで</Typography>
      <Typography size="s" color="medium_emphasis">
        特典クレジットは、チャージしたクレジットより先に消費されます。
      </Typography>
    </div>
    <DialogFooter>
      <Button appearance="transparent" color="neutral" onPress={onClose}>
        閉じる
      </Button>
      <Button color="neutral" onPress={() => onNavigate?.('billing')}>
        クレジットを確認する
      </Button>
    </DialogFooter>
  </Dialog>
)

/**
 * ComplimentaryCreditNotice の WelcomeCreditGrantedDialog。会員登録で 1,000 円分を付与したときの案内。
 * 上から 閉じる（右上）・イラスト・見出し・金額の面・リード文・ボタン 2 つ。DialogHeader と DialogFooter は使わない
 */
const WelcomeCreditGrantedDialog = ({ onClose, onNavigate }: DialogProps) => (
  <Dialog isOpen onOpenChange={closeOn(onClose)}>
    <Stack gap="m" alignItems="center">
      <Stack flexDirection="row" justifyContent="flex-end">
        <Button
          iconOnly
          appearance="transparent"
          color="neutral"
          aria-label="閉じる"
          onPress={onClose}
        >
          <Icon name="cross" />
        </Button>
      </Stack>
      <img src={welcomeCreditIllustration} alt="" width={512} height={168} />
      <DialogTitle>会員登録ありがとうございます！</DialogTitle>
      <Paper outlined padding="m">
        <Stack gap="xxs" alignItems="center">
          <Typography size="s" fontWeight="bold" color="negative" component="p">
            感謝の気持ちを込めて
          </Typography>
          <Stack flexDirection="row" gap="xxs" alignItems="flex-end">
            <Typography size="xxxl" fontWeight="bold" component="span">
              1,000
            </Typography>
            <Typography size="xl" fontWeight="bold" component="span">
              円分
            </Typography>
          </Stack>
          <Typography size="xl" fontWeight="bold" component="p">
            クレジットを付与しました！
          </Typography>
        </Stack>
      </Paper>
      <Typography size="s" fontWeight="bold" component="p">
        今すぐAPIキーを発行して、
        <br />
        AIを試してみよう。
      </Typography>
      <Stack gap="xxs" alignItems="center">
        {/* APIキーを発行できるプロジェクトが無いときは出さず、下のボタンが「閉じる」になる */}
        {/* すぐ使えるプロジェクトの APIキー画面へ */}
        <Button
          color="neutral"
          size="l"
          width="full"
          trailing={<Icon name="arrow_right" />}
          onPress={() => onNavigate?.('keys')}
        >
          APIキーを発行する
        </Button>
        <Button appearance="transparent" color="neutral" size="s" onPress={onClose}>
          あとで設定する
        </Button>
      </Stack>
    </Stack>
  </Dialog>
)

// ─── 画面 ───

const dialogs: Record<DialogName, (props: DialogProps) => ReactNode> = {
  charge: ManualChargeDialog,
  chargeConfirm: ChargeConfirmDialog,
  autoCharge: AutoChargeSettingsDialog,
  lowBalance: LowBalanceNotificationDialog,
  card: CardRegistrationDialog,
  complimentary: ComplimentaryCreditGrantedDialog,
  welcome: WelcomeCreditGrantedDialog,
}

/**
 * CardChallengeReturn（/payment/complete/[accountId]）。開いたらすぐ請求画面へ戻す（window.location.replace）。
 * パスが /accounts の下に無いので、Sidebar に現在地は付かない
 */
const CardChallengeReturnScreen = ({ onNavigate }: { onNavigate?: (to: string) => void }) => {
  // すぐ戻すのは AiGatewayApp の中だけ。画面ごとのストーリーで開いたときは、この画面を見せるために戻さない
  useEffect(() => {
    onNavigate?.('billing')
  }, [onNavigate])
  return (
    <AiGatewayShell title="カード認証" onNavigate={onNavigate}>
      <PageContainer>
        <PageHeader title="カード認証" description="カード認証の結果を確認しています" />
        {/* 実物の wip-ui（0.1.x）の Paper は余白を持たない。いまの Paper の既定は l なので none にする */}
        <Paper padding="none">
          <Loader message="確認しています" />
        </Paper>
      </PageContainer>
    </AiGatewayShell>
  )
}

export const BillingScreen = ({
  view = 'success',
  dialog: initialDialog = null,
  onNavigate: onNavigateProp,
}: {
  view?: CreditView
  /** 開いた状態で始めるダイアログ */
  dialog?: DialogName | null
  onNavigate?: (to: string) => void
}) => {
  const [dialog, setDialog] = useState<DialogName | null>(initialDialog)
  if (view === 'cardChallengeReturn')
    return <CardChallengeReturnScreen onNavigate={onNavigateProp} />
  // 渡されない（画面ごとのストーリー）ときは、行き先の画面のストーリーへ移る
  const onNavigate = onNavigateProp ?? navigateToAiGatewayStory
  const OpenDialogView = dialog ? dialogs[dialog] : null
  return (
    <AiGatewayShell current="billing" title="クレジット" onNavigate={onNavigate}>
      <PageContainer>
        <PageHeader
          title="クレジット"
          description="クレジット残高、支払い方法、チャージ履歴を管理します"
        />
        <BillingContent view={view} onOpen={setDialog} />
      </PageContainer>
      {OpenDialogView && (
        <OpenDialogView
          // 確認はクレジットの追加の上に重なる。キャンセルで追加のダイアログへ戻る
          onClose={() => setDialog(dialog === 'chargeConfirm' ? 'charge' : null)}
          onOpen={setDialog}
          onNavigate={onNavigate}
        />
      )}
    </AiGatewayShell>
  )
}

// ─── ストーリー ───

/**
 * クレジット残高・通知・特典クレジット・チャージ履歴・お支払い方法。
 *
 * @summary クレジット
 */
export const Default: Story = {
  render: () => <BillingScreen />,
}

/**
 * 読み込み中。実物は請求情報全体を骨格で出す（Loader で代用）。
 *
 * @summary 読み込み中
 */
export const Loading: Story = {
  render: () => <BillingScreen view="loading" />,
}

/**
 * 請求情報を読み込めなかったとき。
 *
 * @summary クレジットの読み込みに失敗
 */
export const CreditError: Story = {
  render: () => <BillingScreen view="error" />,
}

/**
 * カード認証（3DS2）から戻った直後の画面。結果を確かめて請求画面へ戻す。
 *
 * @summary カード認証から戻る
 */
export const CardChallengeReturn: Story = {
  render: () => <BillingScreen view="cardChallengeReturn" />,
}

/**
 * クレジットの追加。支払いカード・金額を選ぶと内訳が出る。
 *
 * @summary クレジットの追加
 */
export const ChargeCredit: Story = {
  render: () => <BillingScreen dialog="charge" />,
}

/**
 * 自動チャージの設定。
 *
 * @summary 自動チャージの設定
 */
export const AutoChargeSettings: Story = {
  render: () => <BillingScreen dialog="autoCharge" />,
}

/**
 * 残高の通知の設定。
 *
 * @summary 通知の設定
 */
export const LowBalanceNotification: Story = {
  render: () => <BillingScreen dialog="lowBalance" />,
}

/**
 * クレジットカードの追加。
 *
 * @summary カードの追加
 */
export const AddCard: Story = {
  render: () => <BillingScreen dialog="card" />,
}

/**
 * 特典クレジットを付与したときの案内。ログイン後の画面で 1 度だけ出る。
 *
 * @summary 特典クレジットの付与
 */
export const ComplimentaryCreditGranted: Story = {
  render: () => <BillingScreen dialog="complimentary" />,
}

/**
 * 会員登録で 1,000 円分のクレジットを付与したときの案内。
 *
 * @summary ウェルカムクレジットの付与
 */
export const WelcomeCreditGranted: Story = {
  render: () => <BillingScreen dialog="welcome" />,
}
