import { useState } from 'react'

import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Checkbox } from '../../../Checkbox'
import { Divider } from '../../../Divider'
import { Grid, GridItem } from '../../../Grid'
import { Icon } from '../../../Icon'
import { Loader } from '../../../Loader'
import { Radio } from '../../../Radio'
import { Select, SelectItem } from '../../../Select'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { TextField } from '../../../TextField'
import { Typography } from '../../../Typography'
import { AppShell } from './AppShell'
import { Card, DefinitionRow, PageHeader, RadioField, SectionTitle, StepIndicator } from './parts'
import { PlanSelector, plans, yen } from './plans'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { PlanId } from './plans'

const meta = {
  title: 'Templates/Hosting/Onboarding',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const steps = ['プランを選ぶ', '支払い情報', '確認']

const planById = Object.fromEntries(plans.map((plan) => [plan.id, plan])) as Record<
  PlanId,
  (typeof plans)[number]
>

// ─── 部品 ───

const Header = ({ step }: { step: number }) => (
  <Stack gap="m">
    <PageHeader
      breadcrumbs={[{ label: 'ホーム', href: '#' }, { label: 'サービスを追加' }]}
      title="レンタルサーバーを申し込む"
      description="10 日間の無料お試し期間中は料金がかかりません。期間内の解約で費用は発生しません。"
    />
    <StepIndicator steps={steps} current={step} />
  </Stack>
)

const OrderSummary = ({
  planId,
  term,
  submitting = false,
  nextLabel = '支払い情報へ',
}: {
  planId: PlanId
  term: '1' | '12'
  submitting?: boolean
  nextLabel?: string
}) => {
  const plan = planById[planId]
  const months = term === '12' ? 12 : 1
  const discount = term === '12' ? 0.1 : 0
  const total = Math.round(plan.monthly * months * (1 - discount))
  return (
    <Card elevation={2}>
      <Stack gap="m">
        <SectionTitle>お申し込み内容</SectionTitle>
        <DefinitionRow term="プラン">
          <Typography component="span" fontWeight="bold">
            {plan.name}
          </Typography>
        </DefinitionRow>
        <DefinitionRow term="契約期間">
          <Stack flexDirection="row" gap="xs" alignItems="center">
            <Typography component="span">{months} か月</Typography>
            {discount > 0 && (
              <Sticker color="positive" size="s">
                10% OFF
              </Sticker>
            )}
          </Stack>
        </DefinitionRow>
        <DefinitionRow term="お試し期間">
          <Typography component="span">10 日間（2026-09-24 〜 2026-10-03）</Typography>
        </DefinitionRow>
        <Divider />
        <Stack flexDirection="row" gap="s" alignItems="flex-end" justifyContent="space-between">
          <Typography size="s" color="medium_emphasis" component="span">
            初回請求額（税込）
          </Typography>
          <Typography size="xxl" fontWeight="bold" component="span">
            {yen(total)}
          </Typography>
        </Stack>
        <Typography size="xxs" color="low_emphasis" density="dense">
          お試し期間終了日の翌日に請求されます。期間中に解約した場合、請求は発生しません。
        </Typography>
        <Button
          color="interactive"
          size="l"
          width="full"
          isDisabled={submitting}
          trailing={submitting ? undefined : <Icon name="arrow_right" size="s" />}
          leading={submitting ? <Loader size="s" /> : undefined}
        >
          {submitting ? '処理しています…' : nextLabel}
        </Button>
      </Stack>
    </Card>
  )
}

const PlanStep = () => {
  const [planId, setPlanId] = useState<PlanId>('standard')
  const [term, setTerm] = useState<'1' | '12'>('12')
  return (
    <AppShell active="home" nav={false}>
      <Header step={0} />
      <Grid spacing="l">
        <GridItem size={{ xxs: 12, l: 8 }}>
          <Stack gap="l">
            <Stack gap="m">
              <SectionTitle>プラン</SectionTitle>
              <PlanSelector selected={planId} onSelect={setPlanId} />
            </Stack>
            <Card>
              <Stack gap="m">
                <RadioField
                  label="契約期間"
                  orientation="horizontal"
                  value={term}
                  onChange={(v) => setTerm(v as '1' | '12')}
                >
                  <Radio value="1">1 か月ごと</Radio>
                  <Radio value="12">12 か月（10% OFF）</Radio>
                </RadioField>
                <Divider />
                <Grid spacing="m">
                  <GridItem size={{ xxs: 12, m: 6 }}>
                    <Select label="サーバーの地域" size="l" width="full" defaultSelectedKey="tokyo">
                      <SelectItem id="tokyo">東京</SelectItem>
                      <SelectItem id="osaka">大阪</SelectItem>
                    </Select>
                  </GridItem>
                  <GridItem size={{ xxs: 12, m: 6 }}>
                    <Select
                      label="初期ドメイン"
                      caption="ビジネスプランのみ変更できます"
                      size="l"
                      width="full"
                      defaultSelectedKey="auto"
                      isDisabled={planId !== 'business'}
                    >
                      <SelectItem id="auto">自動で割り当て</SelectItem>
                      <SelectItem id="custom">希望の文字列を指定</SelectItem>
                    </Select>
                  </GridItem>
                </Grid>
              </Stack>
            </Card>
            <Callout color="neutral" appearance="outline">
              プランはあとから変更できます。まず小さく始めて、容量が足りなくなったら上げるのがおすすめです。
            </Callout>
          </Stack>
        </GridItem>
        <GridItem size={{ xxs: 12, l: 4 }}>
          <OrderSummary planId={planId} term={term} />
        </GridItem>
      </Grid>
    </AppShell>
  )
}

const PaymentStep = ({ submitting = false }: { submitting?: boolean }) => (
  <AppShell active="home" nav={false}>
    <Header step={1} />
    <Grid spacing="l">
      <GridItem size={{ xxs: 12, l: 8 }}>
        <Stack gap="l">
          <Card>
            <Stack gap="m">
              <RadioField label="支払い方法" defaultValue="card">
                <Radio value="card">クレジットカード</Radio>
                <Radio value="bank">銀行振込（12 か月契約のみ）</Radio>
                <Radio value="convenience" isDisabled>
                  コンビニ払い（現在ご利用いただけません）
                </Radio>
              </RadioField>
              <Divider />
              <Grid spacing="m">
                <GridItem size={{ xxs: 12 }}>
                  <TextField
                    label="カード番号"
                    placeholder="4242 4242 4242 4242"
                    width="full"
                    isRequired
                    inputMode="numeric"
                  />
                </GridItem>
                <GridItem size={{ xxs: 6, m: 4 }}>
                  <TextField label="有効期限" placeholder="MM/YY" width="full" isRequired />
                </GridItem>
                <GridItem size={{ xxs: 6, m: 4 }}>
                  <TextField
                    label="セキュリティコード"
                    placeholder="123"
                    width="full"
                    isRequired
                    type="password"
                  />
                </GridItem>
                <GridItem size={{ xxs: 12, m: 4 }}>
                  <TextField label="カード名義" placeholder="TARO YAMADA" width="full" isRequired />
                </GridItem>
              </Grid>
              <Stack flexDirection="row" gap="xs" alignItems="center">
                <Icon name="lock" size="s" />
                <Typography size="xs" color="medium_emphasis" component="span">
                  カード情報は決済代行会社に直接送信され、当社のサーバーには保存されません。
                </Typography>
              </Stack>
            </Stack>
          </Card>
          <Card>
            <Stack gap="m">
              <SectionTitle>契約者情報</SectionTitle>
              <Grid spacing="m">
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <TextField label="お名前" defaultValue="山田 太郎" width="full" isRequired />
                </GridItem>
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <TextField
                    label="メールアドレス"
                    defaultValue="you@example.com"
                    width="full"
                    isReadOnly
                  />
                </GridItem>
                <GridItem size={{ xxs: 12, m: 4 }}>
                  <TextField label="郵便番号" placeholder="150-0001" width="full" isRequired />
                </GridItem>
                <GridItem size={{ xxs: 12, m: 8 }}>
                  <TextField label="住所" placeholder="東京都渋谷区…" width="full" isRequired />
                </GridItem>
              </Grid>
              <Checkbox defaultSelected>領収書を電子発行する（紙の郵送は行いません）</Checkbox>
            </Stack>
          </Card>
        </Stack>
      </GridItem>
      <GridItem size={{ xxs: 12, l: 4 }}>
        <OrderSummary
          planId="standard"
          term="12"
          submitting={submitting}
          nextLabel="申し込みを確定する"
        />
      </GridItem>
    </Grid>
  </AppShell>
)

// ─── ストーリー ───

/**
 * 申し込みの 1 歩目。3 プランを並べて選ばせ、右側に注文内容を常に見せる。
 * 選択中のカードだけ elevation を上げ、他は outlined にする「選べるカード」の表現と、
 * プランに応じて Select が disabled になる連動を確認する。
 *
 * @summary プランと契約期間の選択
 */
export const PlanSelect: Story = {
  render: () => <PlanStep />,
}

/**
 * 支払い情報と契約者情報の入力。isRequired の必須マークが多数並ぶフォームで、
 * ラベル・プレースホルダー・補足の密度が読みやすいかを確認する。
 *
 * @summary 支払い情報の入力
 */
export const Payment: Story = {
  render: () => <PaymentStep />,
}

/**
 * 確定ボタンを押した直後。ボタン内 Loader と disabled で二重送信を防ぎ、フォームはそのまま残す。
 *
 * @summary 申し込みを処理中
 */
export const Submitting: Story = {
  render: () => <PaymentStep submitting />,
}

/**
 * 申し込み完了後、サーバーを構築している間の待ち画面。数十秒かかる処理なので、
 * 画面中央に大きな Loader と進捗の文言だけを置く。
 *
 * @summary サーバー構築中の待ち画面
 */
export const Provisioning: Story = {
  render: () => (
    <AppShell active="home" nav={false}>
      <Header step={2} />
      <Card>
        <Stack gap="l" alignItems="center">
          <Loader size="xxl" message="サーバーを準備しています。通常 1〜2 分で完了します。" />
          <Stack gap="xxs" alignItems="center">
            {[
              'アカウントを作成',
              'サーバーを割り当て',
              '初期ドメインを設定',
              'SSL 証明書を発行',
            ].map((label, index) => (
              <Stack key={label} flexDirection="row" gap="xs" alignItems="center">
                {index < 2 ? (
                  <Icon name="check_on_circle" size="s" />
                ) : index === 2 ? (
                  <Loader size="s" />
                ) : (
                  <Icon name="circle" size="s" />
                )}
                <Typography
                  component="span"
                  size="s"
                  color={index > 2 ? 'low_emphasis' : 'high_emphasis'}
                >
                  {label}
                </Typography>
              </Stack>
            ))}
          </Stack>
          <Typography size="xs" color="medium_emphasis">
            この画面を閉じても構築は続きます。完了したらメールでお知らせします。
          </Typography>
        </Stack>
      </Card>
    </AppShell>
  ),
}

/**
 * 構築が完了した直後の画面。次にやることを 3 つに絞って提示する。
 *
 * @summary 申し込み完了
 */
export const Complete: Story = {
  render: () => (
    <AppShell active="home" nav={false}>
      <Header step={3} />
      <Callout color="positive">
        サーバーの準備が完了しました。初期ドメイン user-0031102.hosting.example
        でサイトを公開できます。
      </Callout>
      <Grid spacing="m">
        {[
          {
            icon: 'roller' as const,
            title: 'WordPress をインストール',
            text: '数分でブログや企業サイトを始められます',
          },
          {
            icon: 'launch' as const,
            title: '独自ドメインを設定',
            text: '取得済みのドメインを紐づけて SSL も自動設定',
          },
          {
            icon: 'upload' as const,
            title: 'ファイルをアップロード',
            text: '既存のサイトを移転する場合はこちら',
          },
        ].map((item) => (
          <GridItem key={item.title} size={{ xxs: 12, m: 4 }}>
            <Card>
              <Stack gap="s">
                <Icon name={item.icon} size="l" />
                <Typography fontWeight="bold">{item.title}</Typography>
                <Typography size="xs" color="medium_emphasis">
                  {item.text}
                </Typography>
                <Button
                  appearance="outlined"
                  width="full"
                  trailing={<Icon name="chevron_right" size="s" />}
                >
                  始める
                </Button>
              </Stack>
            </Card>
          </GridItem>
        ))}
      </Grid>
      <Stack flexDirection="row" justifyContent="center">
        <Button appearance="transparent" trailing={<Icon name="arrow_right" size="s" />}>
          あとで設定する（ホームへ）
        </Button>
      </Stack>
    </AppShell>
  ),
}

/**
 * 支払い情報の入力をスマートフォン幅で見た状態。
 * カード番号・有効期限・セキュリティコードの 3 列が縦に落ちたときの並びと、
 * 右側の注文内容が本文の下に回ったときの導線を確認する。
 *
 * @summary スマートフォン幅での支払い情報入力
 */
export const PaymentMobile: Story = {
  globals: { viewport: { value: 'iphone14' } },
  render: () => <PaymentStep />,
}
