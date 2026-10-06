import { useState } from 'react'

import { AppBar, AppBarLeading, AppBarTrailing } from '../../../AppBar'
import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Container } from '../../../Container'
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from '../../../Dialog'
import { Divider } from '../../../Divider'
import { Grid, GridItem } from '../../../Grid'
import { Icon } from '../../../Icon'
import { Loader } from '../../../Loader'
import { Paper } from '../../../Paper'
import { Radio, RadioGroup } from '../../../Radio'
import { Select, SelectItem } from '../../../Select'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { TextField } from '../../../TextField'
import { Typography } from '../../../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

/**
 * ロリポップ！for Gamers のサーバー申し込み（apollo の /servers/new/*）の再現。
 *
 * 実アプリにはステッパーも戻るボタンも無く、唯一の後退手段は注文内容パネルの「変更」リンク。
 * ここでもそれに合わせている。
 */

const meta = {
  title: 'Templates/Apollo/Purchase',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// GAP-1 の回避策（Paper に padding が無い）
const insetStyle = { padding: 24 }
const Card = ({ children, outlined = false }: { children: ReactNode; outlined?: boolean }) => (
  <Paper elevation={outlined ? 0 : 1} outlined={outlined}>
    <div style={insetStyle}>{children}</div>
  </Paper>
)

// ─── データ ───

const games = [
  { id: 'minecraft-je', name: 'Minecraft（Java版）', from: 1200 },
  { id: 'minecraft-be', name: 'Minecraft（統合版）', from: 1200 },
  { id: 'palworld', name: 'Palworld', from: 1800 },
  { id: 'ark', name: 'ARK: Survival Ascended', from: 2400 },
  { id: 'valheim', name: 'Valheim', from: 1500 },
  { id: 'rust', name: 'Rust', from: 2400 },
  { id: 'terraria', name: 'Terraria', from: 1200 },
  { id: 'factorio', name: 'Factorio', from: 1500 },
  { id: 'project-zomboid', name: 'Project Zomboid', from: 1800 },
]

const plans = [
  { id: '4GB', cpu: '2Core', disk: '50GB', price: 1980, note: '目安 1~5人' },
  { id: '8GB', cpu: '4Core', disk: '50GB', price: 3300, note: '目安 6~10人、Mod使用' },
  { id: '16GB', cpu: '4Core', disk: '100GB', price: 6600, note: '目安 11人~、Mod使用' },
  { id: '32GB', cpu: '8Core', disk: '200GB', price: 12800, note: '大人数、より快適な環境' },
]

const terms = [
  { id: '3d', label: '3日', months: 0.1, discount: 0 },
  { id: '1m', label: '1ヶ月', months: 1, discount: 0 },
  { id: '3m', label: '3ヶ月', months: 3, discount: 5 },
  { id: '6m', label: '6ヶ月', months: 6, discount: 10 },
  { id: '12m', label: '12ヶ月', months: 12, discount: 15 },
  { id: '24m', label: '24ヶ月', months: 24, discount: 20 },
  { id: '36m', label: '36ヶ月', months: 36, discount: 25 },
]

const yen = (n: number) => `${Math.round(n).toLocaleString('ja-JP')}円`

// ─── 共通の枠 ───

const Shell = ({ children }: { children: ReactNode }) => (
  <Stack gap="l">
    <AppBar appearance="white" position="relative">
      <AppBarLeading>
        <Stack flexDirection="row" gap="s" alignItems="center">
          <Icon name="pepapon" size="m" />
          <Typography size="l" fontWeight="bold" component="span">
            ロリポップ！for Gamers
          </Typography>
        </Stack>
      </AppBarLeading>
      <AppBarTrailing>
        <Button appearance="transparent" size="s" iconOnly aria-label="アカウント詳細">
          <Icon name="person" size="m" />
        </Button>
      </AppBarTrailing>
    </AppBar>
    <Container size="xl" component="main">
      {children}
    </Container>
  </Stack>
)

// ─── 注文内容パネル ───

const OrderSummary = ({
  game,
  plan,
  term,
  cta,
  onSubmit,
  onChange,
  submitting = false,
}: {
  game: string
  plan: string
  term: string
  cta: string
  onSubmit: () => void
  onChange?: () => void
  submitting?: boolean
}) => {
  const p = plans.find((x) => x.id === plan) ?? plans[0]
  const t = terms.find((x) => x.id === term) ?? terms[1]
  const monthly = Math.round(p.price * (1 - t.discount / 100))
  const total = t.months < 1 ? Math.round(monthly * 0.2) : monthly * t.months
  return (
    <Card>
      <Stack gap="m">
        <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
          <Typography size="l" fontWeight="bold" component="h2">
            注文内容
          </Typography>
          {onChange && (
            <Button appearance="transparent" size="s" onPress={onChange}>
              変更
            </Button>
          )}
        </Stack>
        <Stack gap="s">
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography size="s" color="medium_emphasis" component="span">
              ゲーム
            </Typography>
            <Typography size="s" component="span">
              {game}
            </Typography>
          </Stack>
          <Divider />
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography size="s" color="medium_emphasis" component="span">
              容量
            </Typography>
            <Typography size="s" component="span">
              {p.id}
            </Typography>
          </Stack>
          <Divider />
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography size="s" color="medium_emphasis" component="span">
              期間
            </Typography>
            <Typography size="s" component="span">
              {t.label}
            </Typography>
          </Stack>
          <Divider />
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography size="s" color="medium_emphasis" component="span">
              月額
            </Typography>
            <Typography size="s" component="span">
              {yen(monthly)}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack flexDirection="row" alignItems="flex-end" justifyContent="space-between">
          <Typography size="s" color="medium_emphasis" component="span">
            合計
          </Typography>
          <Typography size="xxl" fontWeight="bold" component="span">
            {yen(total)}
          </Typography>
        </Stack>
        <Button
          color="interactive"
          size="l"
          width="full"
          isDisabled={submitting}
          onPress={onSubmit}
          leading={submitting ? <Loader size="s" /> : undefined}
        >
          {submitting ? '処理しています…' : cta}
        </Button>
      </Stack>
    </Card>
  )
}

// ─── ステップ1：ゲーム選択 ───

const GameSelect = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const [query, setQuery] = useState('')
  const filtered = games.filter((g) => g.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <Stack gap="l">
      <Typography size="xxl" fontWeight="bold" component="h1">
        ゲーム選択
      </Typography>
      <TextField
        aria-label="ゲームを検索"
        placeholder="ゲームタイトルで検索"
        width="half"
        value={query}
        onChange={setQuery}
      />
      {filtered.length === 0 ? (
        <Card outlined>
          <Stack alignItems="center" gap="s">
            <Icon name="magnifying_glass" size="l" />
            <Typography color="medium_emphasis">
              「{query}」に一致するゲームは見つかりませんでした。
            </Typography>
          </Stack>
        </Card>
      ) : (
        <Grid spacing="m">
          {filtered.map((g) => (
            <GridItem key={g.id} size={{ xxs: 12, s: 6, m: 4, l: 3 }}>
              {/* GAP-3: 選択できるカードが無いので Paper + Button で組んでいる */}
              <Paper elevation={1}>
                <Stack gap="s">
                  <div
                    style={{
                      aspectRatio: '16 / 9',
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: 8,
                    }}
                  >
                    <Icon name="node" size="l" />
                  </div>
                  <div style={{ padding: 16, paddingTop: 0 }}>
                    <Stack gap="xs">
                      <Typography fontWeight="bold">{g.name}</Typography>
                      <Typography size="xs" color="medium_emphasis">
                        3日 {yen(Math.round(g.from * 0.2))} ~
                      </Typography>
                      <Button
                        appearance="outlined"
                        color="interactive"
                        width="full"
                        size="s"
                        onPress={() => onSelect(g.id)}
                      >
                        このゲームを選ぶ
                      </Button>
                    </Stack>
                  </div>
                </Stack>
              </Paper>
            </GridItem>
          ))}
        </Grid>
      )}
    </Stack>
  )
}

// ─── ステップ2：プラン選択 ───

const PlanSelect = ({
  gameId,
  onGame,
  plan,
  onPlan,
  term,
  onTerm,
  name,
  onName,
  onNext,
}: {
  gameId: string
  onGame: (id: string) => void
  plan: string
  onPlan: (id: string) => void
  term: string
  onTerm: (id: string) => void
  name: string
  onName: (v: string) => void
  onNext: () => void
}) => {
  const game = games.find((g) => g.id === gameId) ?? games[0]
  return (
    <Grid spacing="l">
      <GridItem size={{ xxs: 12, l: 8 }}>
        <Stack gap="l">
          <Card>
            <Stack gap="m">
              <Typography size="l" fontWeight="bold" component="h2">
                ゲーム
              </Typography>
              {/* 実アプリは Autocomplete。wip-ui に無いので Select で代用 */}
              <Select
                aria-label="ゲームを選ぶ"
                width="full"
                selectedKey={gameId}
                onSelectionChange={(k) => onGame(String(k))}
              >
                {games.map((g) => (
                  <SelectItem key={g.id} id={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </Select>
            </Stack>
          </Card>

          <Card>
            <Stack gap="m">
              <Typography size="l" fontWeight="bold" component="h2">
                プラン
              </Typography>
              <Grid spacing="m">
                {plans.map((p) => (
                  <GridItem key={p.id} size={{ xxs: 12, s: 6 }}>
                    <Paper elevation={p.id === plan ? 3 : 0} outlined={p.id !== plan}>
                      <div style={{ padding: 16 }}>
                        <Stack gap="s">
                          <Typography size="l" fontWeight="bold" component="h3">
                            {p.id}
                          </Typography>
                          <Typography size="xs" color="medium_emphasis">
                            CPU {p.cpu} / Disk {p.disk}
                          </Typography>
                          <Typography size="xs" color="low_emphasis">
                            {p.note}
                          </Typography>
                          <Typography fontWeight="bold" component="span">
                            月額 {yen(p.price)}
                          </Typography>
                          <Button
                            appearance={p.id === plan ? 'flat' : 'outlined'}
                            color={p.id === plan ? 'interactive' : 'neutral'}
                            width="full"
                            size="s"
                            onPress={() => onPlan(p.id)}
                            leading={p.id === plan ? <Icon name="check" size="s" /> : undefined}
                          >
                            {p.id === plan ? '選択中' : '選ぶ'}
                          </Button>
                        </Stack>
                      </div>
                    </Paper>
                  </GridItem>
                ))}
              </Grid>
            </Stack>
          </Card>

          <Card>
            <Stack gap="m">
              <Typography size="l" fontWeight="bold" component="h2">
                期間
              </Typography>
              <Grid spacing="s">
                {terms.map((t) => {
                  const base = plans.find((x) => x.id === plan)?.price ?? 0
                  const after = Math.round(base * (1 - t.discount / 100))
                  return (
                    <GridItem key={t.id} size={{ xxs: 6, m: 4, l: 3 }}>
                      <Paper elevation={t.id === term ? 2 : 0} outlined={t.id !== term}>
                        <div style={{ padding: 12 }}>
                          <Stack gap="xxs">
                            <Stack flexDirection="row" gap="xs" alignItems="center">
                              <Typography fontWeight="bold" component="span">
                                {t.label}
                              </Typography>
                              {t.discount > 0 && (
                                <Sticker color="positive" size="s">
                                  {t.discount}%オフ
                                </Sticker>
                              )}
                            </Stack>
                            {t.discount > 0 ? (
                              <Stack flexDirection="row" gap="xxs" alignItems="center">
                                <Typography size="xs" color="low_emphasis" component="span">
                                  月額 {yen(base)}
                                </Typography>
                                <Icon name="arrow_right" size="s" />
                                <Typography size="xs" fontWeight="bold" component="span">
                                  {yen(after)}
                                </Typography>
                              </Stack>
                            ) : (
                              <Typography size="xs" color="medium_emphasis">
                                月額 {yen(after)}
                              </Typography>
                            )}
                            <Button
                              appearance={t.id === term ? 'flat' : 'outlined'}
                              color={t.id === term ? 'interactive' : 'neutral'}
                              width="full"
                              size="s"
                              onPress={() => onTerm(t.id)}
                            >
                              {t.id === term ? '選択中' : '選ぶ'}
                            </Button>
                          </Stack>
                        </div>
                      </Paper>
                    </GridItem>
                  )
                })}
              </Grid>
              <Typography size="xs" color="medium_emphasis">
                ※ 契約期間の変更が適用されるのは現在の契約期間満了後からとなります。
              </Typography>
            </Stack>
          </Card>

          <Card>
            <Stack gap="m">
              <Typography size="l" fontWeight="bold" component="h2">
                サーバー名
              </Typography>
              <TextField
                aria-label="サーバー名"
                placeholder="LOLIPOP-GAMERS-SERVER"
                caption="サーバーを識別するために名前をつけることができます。後で変更も可能（128文字以内）"
                width="full"
                value={name}
                onChange={onName}
              />
            </Stack>
          </Card>
        </Stack>
      </GridItem>
      <GridItem size={{ xxs: 12, l: 4 }}>
        <OrderSummary
          game={game.name}
          plan={plan}
          term={term}
          cta="支払い情報入力へ"
          onSubmit={onNext}
        />
      </GridItem>
    </Grid>
  )
}

// ─── ステップ3：支払い情報 ───

const PaymentInfo = ({
  gameId,
  plan,
  term,
  submitting,
  onSubmit,
  onBack,
}: {
  gameId: string
  plan: string
  term: string
  submitting: boolean
  onSubmit: () => void
  onBack: () => void
}) => {
  const [method, setMethod] = useState('card')
  const game = games.find((g) => g.id === gameId) ?? games[0]
  return (
    <Stack gap="l">
      <Typography size="xxl" fontWeight="bold" component="h1">
        支払い方法
      </Typography>
      <Grid spacing="l">
        <GridItem size={{ xxs: 12, l: 8 }}>
          <Stack gap="l">
            <Card>
              <Stack gap="m">
                {/* GAP-7: RadioGroup に label が無いので Typography で見出しを置いている */}
                <RadioGroup aria-label="支払い方法" value={method} onChange={setMethod}>
                  <Radio value="card">クレジットカード</Radio>
                  <Radio value="paypay">PayPay</Radio>
                </RadioGroup>
                {method === 'paypay' && (
                  <Callout color="notice">
                    ※この支払い方法は自動更新に対応していません。詳しくは「利用できる支払い方法と対応ブランド」をご確認ください。
                  </Callout>
                )}
              </Stack>
            </Card>

            {method === 'card' && (
              <Card>
                <Stack gap="m">
                  <Typography size="l" fontWeight="bold" component="h2">
                    クレジットカード情報
                  </Typography>
                  <TextField label="名義" placeholder="TARO YAMADA" width="full" isRequired />
                  <TextField
                    label="カード番号"
                    placeholder="4242424242424242"
                    width="full"
                    isRequired
                    inputMode="numeric"
                  />
                  <Grid spacing="m">
                    <GridItem size={{ xxs: 6, m: 4 }}>
                      <Select label="有効期限(月)" width="full" defaultSelectedKey="12">
                        {['01', '02', '03', '12'].map((m) => (
                          <SelectItem key={m} id={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </Select>
                    </GridItem>
                    <GridItem size={{ xxs: 6, m: 4 }}>
                      <Select label="有効期限(年)" width="full" defaultSelectedKey="28">
                        {['26', '27', '28', '29'].map((y) => (
                          <SelectItem key={y} id={y}>
                            {y}
                          </SelectItem>
                        ))}
                      </Select>
                    </GridItem>
                    <GridItem size={{ xxs: 12, m: 4 }}>
                      <TextField
                        label="セキュリティコード"
                        placeholder="123"
                        width="full"
                        isRequired
                      />
                    </GridItem>
                  </Grid>
                </Stack>
              </Card>
            )}

            <Card>
              <Stack gap="m">
                <Typography size="l" fontWeight="bold" component="h2">
                  クーポン
                </Typography>
                <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="s">
                  <TextField label="クーポンコード" width="half" />
                  <Button appearance="outlined">適用</Button>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </GridItem>
        <GridItem size={{ xxs: 12, l: 4 }}>
          <OrderSummary
            game={game.name}
            plan={plan}
            term={term}
            cta="購入する"
            submitting={submitting}
            onSubmit={onSubmit}
            onChange={onBack}
          />
        </GridItem>
      </Grid>
    </Stack>
  )
}

// ─── 完了 ───

const Complete = ({ onHome }: { onHome: () => void }) => (
  <Stack gap="l" alignItems="center">
    <Icon name="check_on_circle" size="l" />
    <Stack gap="xs" alignItems="center">
      <Typography size="xxl" fontWeight="bold" component="h1">
        サーバーの購入が完了しました
      </Typography>
      <Typography size="s" color="medium_emphasis">
        サーバーの準備ができ次第、メールでお知らせします。
      </Typography>
    </Stack>
    <Button color="interactive" size="l" onPress={onHome}>
      ホームへ
    </Button>
  </Stack>
)

// ─── フロー本体 ───

type Step = 'game' | 'plan' | 'payment' | 'complete'

const Flow = () => {
  const [step, setStep] = useState<Step>('game')
  const [gameId, setGameId] = useState(games[0].id)
  const [plan, setPlan] = useState('8GB')
  const [term, setTerm] = useState('1m')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const purchase = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setStep('complete')
    }, 1800)
  }

  return (
    <Shell>
      {step === 'game' && (
        <GameSelect
          onSelect={(id) => {
            setGameId(id)
            setStep('plan')
          }}
        />
      )}
      {step === 'plan' && (
        <PlanSelect
          gameId={gameId}
          onGame={setGameId}
          plan={plan}
          onPlan={setPlan}
          term={term}
          onTerm={setTerm}
          name={name}
          onName={setName}
          onNext={() => setStep('payment')}
        />
      )}
      {step === 'payment' && (
        <PaymentInfo
          gameId={gameId}
          plan={plan}
          term={term}
          submitting={submitting}
          onSubmit={purchase}
          onBack={() => setStep('plan')}
        />
      )}
      {step === 'complete' && <Complete onHome={() => setStep('game')} />}

      <Dialog isOpen={submitting} isDismissable={false}>
        <DialogHeader>
          <DialogTitle>購入</DialogTitle>
        </DialogHeader>
        <DialogDescription>アプリを閉じないようにご注意ください</DialogDescription>
        <Stack alignItems="center">
          <Loader size="xl" />
        </Stack>
      </Dialog>
    </Shell>
  )
}

// ─── ストーリー ───

/**
 * サーバーの申し込み。ゲーム選択 → プラン選択 → 支払い情報 → 完了を実際に押して進む。
 *
 * - ゲームカードの「このゲームを選ぶ」で次へ進む。検索で絞り込める
 * - プランと期間を選ぶと右の注文内容の金額が変わる
 * - 「購入する」を押すと処理中のダイアログが出て、1.8 秒後に完了画面になる
 * - 戻る手段は注文内容パネルの「変更」だけ。実アプリにステッパーも戻るボタンも無いため
 *
 * @summary サーバーの申し込み（操作できる）
 */
export const Default: Story = {
  render: () => <Flow />,
}
