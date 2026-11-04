import { useState } from 'react'

import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Container } from '../../Container'
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Paper } from '../../Paper'
import { Radio, RadioGroup } from '../../Radio'
import { Select, SelectItem } from '../../Select'
import { Stack } from '../../Stack'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import { AppShell } from './AppShell'
import sevenDaysImage from './assets/gamers/game/7days-to-die.webp'
import abioticFactorImage from './assets/gamers/game/abiotic-factor.webp'
import arkImage from './assets/gamers/game/ark_image.webp'
import astroneerImage from './assets/gamers/game/astroneer.webp'
import brickadiaImage from './assets/gamers/game/brickadia.webp'
import conanExilesImage from './assets/gamers/game/conan-exiles.webp'
import corekeeperImage from './assets/gamers/game/corekeeper.webp'
import dstImage from './assets/gamers/game/donotstarvetogether.webp'
import enshroudedImage from './assets/gamers/game/enshrouded.webp'
import factorioImage from './assets/gamers/game/factorio.webp'
import fivemImage from './assets/gamers/game/fivem.webp'
import gmodImage from './assets/gamers/game/gmod.webp'
import humanitzImage from './assets/gamers/game/humanitz.webp'
import hytaleImage from './assets/gamers/game/hytale.webp'
import icarusImage from './assets/gamers/game/icarus.webp'
import minecraftBeImage from './assets/gamers/game/minecraft_be_image.webp'
import minecraftJeImage from './assets/gamers/game/minecraft_je_image.webp'
import necesseImage from './assets/gamers/game/necesse.webp'
import palworldImage from './assets/gamers/game/palworld_image.webp'
import projectZomboidImage from './assets/gamers/game/projectzomboid.webp'
import redmImage from './assets/gamers/game/redm.webp'
import romesteadImage from './assets/gamers/game/romestead.webp'
import runescapeImage from './assets/gamers/game/runescape-dragonwilds.webp'
import rustImage from './assets/gamers/game/rust.webp'
import satisfactoryImage from './assets/gamers/game/satisfactory.webp'
import sonsOfTheForestImage from './assets/gamers/game/sons-of-the-forest.webp'
import soulmaskImage from './assets/gamers/game/soulmask.webp'
import starruptureImage from './assets/gamers/game/starrupture.webp'
import terrariaImage from './assets/gamers/game/terraria.webp'
import theForestImage from './assets/gamers/game/the-forest.webp'
import valheimImage from './assets/gamers/game/valheim.webp'
import vrisingImage from './assets/gamers/game/vrising.webp'
import windroseImage from './assets/gamers/game/windrose.webp'
import paypayLogo from './assets/gamers/paypay.svg'
import maintenanceImage from './assets/gamers/purchase-maintenance.svg'
import soldOutImage from './assets/gamers/sold-out.svg'
import { Card } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

/**
 * ゲームサーバーの申し込み。ゲーマーズ（apollo/frontend の app/(application)/(private)/servers/new）の
 * ゲーム選択 → プラン選択 → 支払い情報入力 を、段ごとのストーリーにしている。
 *
 * - 実アプリにステッパーは無く、戻る手段は右の「注文内容」の「変更」だけ。StepIndicator は置いていない
 * - 見出し（h1）があるのはゲーム選択だけ。プラン選択と支払い情報入力は 8:4 の 2 カラムがいきなり始まる
 * - 実物にあっても出ることの無い表示は置いていない。プラン選択の Message（エラーが発生しました）は onSubmit が
 *   err: null しか渡さず、注文内容の「購入できません」（SubmitButton の isCreatable）は OrderDetailDialogView が渡していない
 * - plans.tsx の PlanSelector はレンタルサーバーのプラン（ライト / スタンダード / ビジネス・月額・容量・サイト数）で、
 *   ゲーマーズのプラン（メモリ容量 × 期間）と項目が合わないため使っていない
 */

const meta = {
  title: 'Templates/Onboarding',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// 削った状態（入力エラー・処理中・完了）にあった GAP の記録
// GAP-NEW: TextField / Select にエラー表示の口が無い。color="negative" は scss が未対応で色が変わらず、
//   caption はラベルの位置（入力欄の上）に出る。実物は helperText として入力欄の下に赤で出る
// GAP-NEW: Icon の大きさは l まで。支払い方法の変更の完了は CheckCircle（150px、success 色）
// GAP-NEW: Skeleton が無い。購入後のホームでは IP アドレスの割り当てまで Skeleton を出す

// ─── データ ───

// listGames() が返すゲーム（backend/entity/instance_type.go の availableImageAliasesForInstanceType）を
// services/Game.ts の sortGames の順に並べたもの。表示名は backend/entity/game.go の GameDisplayNames、
// 「3日 ○円~」・画像・検索語（searchReadings ＋ searchAliases）は model/game.ts の Games。
// fivem-enhanced はリリースフラグ（gameReleaseFlags）で止まっているので入れていない
const games = [
  {
    id: 'minecraft-je',
    name: 'Minecraft (Java版)',
    minPrice: 520,
    img: minecraftJeImage,
    search: ['まいんくらふと', 'マイクラ', 'マイクラJE'],
  },
  {
    id: 'minecraft-bedrock',
    name: 'Minecraft (統合版)',
    minPrice: 260,
    img: minecraftBeImage,
    search: ['まいんくらふと', 'マイクラ', 'マイクラBE'],
  },
  {
    id: 'palworld',
    name: 'パルワールド',
    minPrice: 1900,
    img: palworldImage,
    search: ['ぱるわーるど', 'palworld'],
  },
  {
    id: '7dtd',
    name: '7 Days to Die',
    minPrice: 1000,
    img: sevenDaysImage,
    search: ['せぶんでいずとぅーだい', '7DTD', '7daystodie'],
  },
  {
    id: 'ark-se',
    name: 'ARK: Survival Evolved',
    minPrice: 1000,
    img: arkImage,
    search: ['あーくさばいばるえぼるぶど'],
  },
  {
    id: 'satisfactory',
    name: 'Satisfactory',
    minPrice: 1900,
    img: satisfactoryImage,
    search: ['さてぃすふぁくとりー'],
  },
  {
    id: 'fivem',
    name: 'FiveM(GTA V)',
    minPrice: 1000,
    img: fivemImage,
    search: ['ふぁいぶえむ', 'じーてぃーえー'],
  },
  { id: 'terraria', name: 'Terraria', minPrice: 260, img: terrariaImage, search: ['てらりあ'] },
  {
    id: 'corekeeper',
    name: 'Core Keeper',
    minPrice: 520,
    img: corekeeperImage,
    search: ['こあきーぱー', 'corekeeper'],
  },
  {
    id: 'astroneer',
    name: 'ASTRONEER',
    minPrice: 520,
    img: astroneerImage,
    search: ['あすとろにーあ'],
  },
  {
    id: 'project-zomboid',
    name: 'Project Zomboid',
    minPrice: 520,
    img: projectZomboidImage,
    search: ['ぷろじぇくとぞんぼいど', 'PZ', 'projectzomboid'],
  },
  {
    id: 'starrupture',
    name: 'StarRupture',
    minPrice: 520,
    img: starruptureImage,
    search: ['すたーらぷちゃー'],
  },
  {
    id: 'hytale',
    name: 'Hytale',
    minPrice: 520,
    img: hytaleImage,
    search: ['はいている', 'はいてーる'],
  },
  {
    id: 'windrose',
    name: 'Windrose',
    minPrice: 1000,
    img: windroseImage,
    search: ['うぃんどろーず'],
  },
  {
    id: 'romestead',
    name: 'Romestead',
    minPrice: 520,
    img: romesteadImage,
    search: ['ろーむすてっど'],
  },
  {
    id: 'runescape-dragonwilds',
    name: 'RuneScape: Dragonwilds',
    minPrice: 520,
    img: runescapeImage,
    search: ['るーんすけーぷ どらごんわいるず', 'RuneScape'],
  },
  {
    id: 'vrising',
    name: 'V Rising',
    minPrice: 1000,
    img: vrisingImage,
    search: ['ぶいらいじんぐ'],
  },
  {
    id: 'conan-exiles',
    name: 'Conan Exiles',
    minPrice: 1900,
    img: conanExilesImage,
    search: ['こなんえぐざいるず'],
  },
  { id: 'necesse', name: 'Necesse', minPrice: 520, img: necesseImage, search: ['ねせす'] },
  { id: 'icarus', name: 'ICARUS', minPrice: 1000, img: icarusImage, search: ['いかるす'] },
  {
    id: 'brickadia',
    name: 'Brickadia',
    minPrice: 520,
    img: brickadiaImage,
    search: ['ぶりっかでぃあ'],
  },
  {
    id: 'humanitz',
    name: 'HumanitZ',
    minPrice: 1000,
    img: humanitzImage,
    search: ['ひゅーまん いっと じー'],
  },
  {
    id: 'redm',
    name: 'RedM(RDR2/RDO)',
    minPrice: 1000,
    img: redmImage,
    search: ['れっどえむ', 'れっど でっど りでんぷしょん つー', 'れっど でっど おんらいん'],
  },
  {
    id: 'the-forest',
    name: 'The Forest',
    minPrice: 1000,
    img: theForestImage,
    search: ['ざふぉれすと'],
  },
  {
    id: 'sons-of-the-forest',
    name: 'Sons Of The Forest',
    minPrice: 1000,
    img: sonsOfTheForestImage,
    search: ['さんずおぶざふぉれすと'],
  },
  {
    id: 'donotstarvetogether',
    name: "Don't Starve Together",
    minPrice: 520,
    img: dstImage,
    search: ['どんとすたーぶとぅぎゃざー', 'DST', 'ドンスタ', 'donotstarvetogether'],
  },
  {
    id: 'valheim',
    name: 'Valheim',
    minPrice: 520,
    img: valheimImage,
    search: ['ばるへいむ', 'ゔぁるへいむ'],
  },
  {
    id: 'enshrouded',
    name: 'Enshrouded',
    minPrice: 1900,
    img: enshroudedImage,
    search: ['えんしゅらうでっど'],
  },
  { id: 'factorio', name: 'Factorio', minPrice: 520, img: factorioImage, search: ['ふぁくとりお'] },
  {
    id: 'abioticfactor',
    name: 'Abiotic Factor',
    minPrice: 1000,
    img: abioticFactorImage,
    search: ['あびおてぃっくふぁくたー', 'abioticfactor'],
  },
  { id: 'rust', name: 'Rust', minPrice: 1900, img: rustImage, search: ['らすと'] },
  {
    id: 'soulmask',
    name: 'Soulmask',
    minPrice: 1900,
    img: soulmaskImage,
    search: ['そうるますく', 'そーるますく'],
  },
  {
    id: 'gmod',
    name: "Garry's Mod",
    minPrice: 520,
    img: gmodImage,
    search: ['ぎゃりーずもっど', 'Gmod'],
  },
]
type Game = (typeof games)[number]

/**
 * Minecraft (Java版) のプラン。説明は services/Plan.tsx の findDescription、CPU / Disk は backend/entity/instance_type.go の
 * ToSpecHumanized、1ヶ月の価格は register_subscription_plan_by_admin/run.yml
 */
const plans = [
  { memory: 4, cpu: 4, disk: '100GB', description: '目安 1~5人', monthly: 1500 },
  { memory: 8, cpu: 6, disk: '100GB', description: '目安 6~10人、Mod使用', monthly: 3000 },
  { memory: 16, cpu: 8, disk: '100GB', description: '目安 11人~、Mod使用', monthly: 4300 },
  { memory: 32, cpu: 12, disk: '100GB', description: '目安 20人~、Mod使用', monthly: 11000 },
]

/** 期間。3日は月額表示が無い。3日の価格と長期の割引率は例（実際の値は契約プランの billingRules から来る） */
const periods = [
  { id: '3day', label: '3日', months: 0, discount: 0 },
  { id: '1', label: '1ヶ月', months: 1, discount: 0 },
  { id: '3', label: '3ヶ月', months: 3, discount: 5 },
  { id: '6', label: '6ヶ月', months: 6, discount: 10 },
  { id: '12', label: '12ヶ月', months: 12, discount: 15 },
  { id: '24', label: '24ヶ月', months: 24, discount: 20 },
]
type Period = (typeof periods)[number]

/** lib/normalizeSearchText。カタカナをひらがなにし、小文字にする */
const normalize = (text: string) =>
  text.replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60)).toLowerCase()

const yen = (n: number) => `${n.toLocaleString('ja-JP')}円`

const priceOf = (memory: number, period: Period) => {
  const plan = plans.find((p) => p.memory === memory) ?? plans[0]
  if (period.months === 0) return { unit: 0, total: Math.round(plan.monthly * 0.35) }
  const unit = Math.round(plan.monthly * (1 - period.discount / 100))
  return { unit, total: unit * period.months }
}

const COUPON = { code: 'GAMERS500', name: '初回500円OFF', discount: 500 }

/** 登録済みのカード（components/PaymentCardDetail）。expire は YYMM で来て YY/MM で出す */
const REGISTERED_CARD = { last4: '4242', expire: '28/12' }

/** components/CcExpSelect。月は 1〜12、年は今年から 10 年。初期値は今日（例：2026/10/30）の月と年 */
const expireMonths = Array.from({ length: 12 }, (_, i) => String(i + 1))
const expireYears = Array.from({ length: 10 }, (_, i) => String(2026 + i))

// ─── 共通 ───

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <Typography size="xxl" fontWeight="bold" component="h2">
    {children}
  </Typography>
)

/**
 * 選べるカード（PlanCard / PeriodCard）。実アプリは ToggleButtonGroup（exclusive）の ToggleButton で、
 * カード全体を押して選ぶ。選ばれると紫→青のグラデーションの枠になる。
 * GAP-3: 選択できるカードが無い。外側の RadioGroup と、カードの中身を label にした Radio で組み、
 * 中身のどこを押しても選べるようにしている。実物に無いラジオの丸が付き、カードの余白は押せない。
 * 選ばれていることは outlined の枠で示す。
 */
const ChoiceCard = ({
  value,
  selected,
  children,
}: {
  value: string
  selected: boolean
  children: ReactNode
}) => (
  <Paper padding="m" elevation={0} outlined={selected}>
    <Radio value={value}>
      <Stack gap="s">{children}</Stack>
    </Radio>
  </Paper>
)

/** components/OrderDetailDialog（名前はダイアログだが、右カラムの Paper） */
const OrderDetail = ({
  game,
  memory,
  period,
  coupon,
  buttonText,
  onSubmit,
  showChange = false,
}: {
  game: Game
  memory: number
  period: Period
  coupon: boolean
  buttonText: string
  onSubmit?: () => void
  /** 支払い情報入力では「変更」でプラン選択に戻れる */
  showChange?: boolean
}) => {
  const { unit, total } = priceOf(memory, period)
  const rows: { title: string; value: string; help?: string }[] = [
    { title: 'ゲーム', value: game.name },
    { title: '容量', value: `${memory}GB` },
    {
      title: '期間',
      value: period.label,
      help: period.months === 0 ? '(2026/10/30 ~ 2026/11/02)' : '(2026/10/30 ~ 2026/11/29)',
    },
    ...(period.months === 0 ? [] : [{ title: '月額', value: yen(unit) }]),
  ]
  return (
    <Card>
      <Stack gap="l">
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Typography size="xxl" fontWeight="bold" component="h2">
            注文内容
          </Typography>
          {showChange && <Button appearance="outlined">変更</Button>}
        </Stack>
        <Stack gap="xs">
          {rows.map((r) => (
            <Stack key={r.title} flexDirection="row" justifyContent="space-between" gap="m">
              <Typography size="l" component="span">
                {r.title}
              </Typography>
              <Stack gap="xxs" alignItems="flex-end">
                <Typography size="l" fontWeight="bold" component="span">
                  {r.value}
                </Typography>
                {r.help && (
                  <Typography size="s" color="medium_emphasis" component="span">
                    {r.help}
                  </Typography>
                )}
              </Stack>
            </Stack>
          ))}
        </Stack>
        <Divider />
        {coupon && (
          <>
            <Stack flexDirection="row" justifyContent="space-between">
              <Typography size="l" fontWeight="bold" component="span">
                小計
              </Typography>
              <Typography size="l" fontWeight="bold" component="span">
                {yen(total)}
              </Typography>
            </Stack>
            <Stack flexDirection="row" justifyContent="space-between">
              <Typography size="l" fontWeight="bold" color="positive" component="span">
                {COUPON.name}
              </Typography>
              <Typography size="l" fontWeight="bold" color="positive" component="span">
                -{yen(COUPON.discount)}
              </Typography>
            </Stack>
            <Divider />
          </>
        )}
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Typography size="xl" fontWeight="bold" component="span">
            合計
          </Typography>
          <Typography size="xxl" fontWeight="bold" component="span">
            {yen(coupon ? Math.max(total - COUPON.discount, 0) : total)}
          </Typography>
        </Stack>
        {/* 実物は LoadingButton */}
        <Button color="interactive" size="l" width="full" onPress={onSubmit}>
          {buttonText}
        </Button>
      </Stack>
    </Card>
  )
}

/** 売り切れ・メンテナンス・空の状態に共通の、幅の狭い中央のカード（Container maxWidth='sm' ＋ Paper） */
const NoticeCard = ({ children }: { children: ReactNode }) => (
  <Container size="s">
    <Card elevation={0}>
      <Stack gap="l">{children}</Stack>
    </Card>
  </Container>
)

// ─── 1. ゲーム選択（servers/new/game-select）───

const GameSelect = () => {
  const [query, setQuery] = useState('')
  const q = normalize(query.trim())
  const hits = games.filter(
    (g) => !q || [g.name, ...g.search].some((t) => normalize(t).includes(q))
  )
  return (
    <Stack gap="l">
      {/* game-select/_components/ServersNewHeader */}
      <Typography size="xxxl" fontWeight="bold" component="h1">
        ゲーム選択
      </Typography>
      {/* GAP-NEW: TextField に先頭アイコン（虫めがね）と末尾のクリアボタン（検索をクリア）の枠が無い */}
      <TextField
        aria-label="ゲームタイトルで検索"
        placeholder="ゲームタイトルで検索"
        width="full"
        value={query}
        onChange={setQuery}
      />
      <Grid spacing="m">
        {hits.map((g) => (
          <GridItem key={g.id} size={{ xxs: 12, m: 3 }}>
            {/* components/GameCard（showdetail）。上半分がキービジュアル、下に名前と「3日 ○円 ~」。カード全体がボタン */}
            <Card padding="m">
              <Stack gap="s" alignItems="center">
                {/* GAP-NEW: 画像の枠（Image）が無い。実物の CardMedia はカードの端まで広げ object-fit: cover で切り抜く */}
                <img src={g.img} alt={g.name} width="100%" height={136} />
                {/* GAP-3: カード全体を押せる面にできないので、ゲーム名をボタンにしている */}
                <Button appearance="transparent" width="full">
                  <Typography size="l" fontWeight="bold" component="span">
                    {g.name}
                  </Typography>
                </Button>
                <Stack flexDirection="row" gap="xxs" alignItems="flex-end">
                  <Typography size="xs" fontWeight="bold" color="medium_emphasis" component="span">
                    3日
                  </Typography>
                  <Typography fontWeight="bold" color="medium_emphasis" component="span">
                    {g.minPrice.toLocaleString('ja-JP')}
                  </Typography>
                  <Typography size="xs" fontWeight="bold" color="medium_emphasis" component="span">
                    円 ~
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </GridItem>
        ))}
      </Grid>
      {q && hits.length === 0 && (
        <Typography color="medium_emphasis">
          「{query}」に一致するゲームは見つかりませんでした。
        </Typography>
      )}
    </Stack>
  )
}

// ─── 2. プラン選択（servers/new/plan-select）───

const SERVER_NAME_MAX = 128

const PlanSelect = () => {
  const [gameId, setGameId] = useState(games[0].id)
  const [memory, setMemory] = useState(8)
  const [period, setPeriod] = useState<Period>(periods[1])
  const [name, setName] = useState('LOLIPOP-GAMERS-SERVER')
  const game = games.find((g) => g.id === gameId) ?? games[0]
  return (
    <Grid spacing="m">
      <GridItem size={{ xxs: 12, m: 8 }}>
        {/* plan-select/_components/GameSpecPaper */}
        <Card>
          <Stack gap="xl">
            {/* GameSelectSection */}
            <Stack gap="m">
              <SectionTitle>ゲーム</SectionTitle>
              {/* GAP-NEW: ComboBox（Autocomplete）が無い。実アプリは画像付きの候補と「○円〜」を出す検索ボックスで、
                  選んだゲームの 80px 角のキービジュアルを入力欄の先頭に出す。ここでは Select の左に置いている */}
              {/* GAP-NEW: 画像の枠（Image）が無い（実物は object-fit: cover と左側の角丸） */}
              <Stack flexDirection="row" gap="s" alignItems="center">
                <img src={game.img} alt={game.name} width={80} height={80} />
                <Select
                  aria-label="ゲーム"
                  width="full"
                  selectedKey={game.id}
                  onSelectionChange={(k) => setGameId(String(k))}
                >
                  {games.map((g) => (
                    <SelectItem key={g.id} id={g.id}>
                      {`${g.name}　${g.minPrice.toLocaleString('ja-JP')}円〜`}
                    </SelectItem>
                  ))}
                </Select>
              </Stack>
            </Stack>

            {/* PlanCardsSection */}
            <Stack gap="m">
              <SectionTitle>プラン</SectionTitle>
              <RadioGroup
                aria-label="プラン"
                value={String(memory)}
                onChange={(v) => setMemory(Number(v))}
              >
                <Grid spacing="m">
                  {plans.map((p) => (
                    <GridItem key={p.memory} size={{ xxs: 12, s: 4 }}>
                      <ChoiceCard value={String(p.memory)} selected={p.memory === memory}>
                        <Typography size="l" fontWeight="bold" component="h3">
                          {p.memory}GB
                        </Typography>
                        <Stack gap="xxs">
                          <Typography size="xs" component="span">
                            CPU {p.cpu}Core / Disk {p.disk}
                          </Typography>
                          <Typography size="xs" component="span">
                            {p.description}
                          </Typography>
                        </Stack>
                      </ChoiceCard>
                    </GridItem>
                  ))}
                </Grid>
              </RadioGroup>
            </Stack>

            <Stack gap="m">
              <SectionTitle>期間</SectionTitle>
              <RadioGroup
                aria-label="期間"
                value={period.id}
                onChange={(v) => setPeriod(periods.find((pd) => pd.id === v) ?? periods[1])}
              >
                <Grid spacing="m">
                  {periods.map((pd) => {
                    const { unit, total } = priceOf(memory, pd)
                    const base = plans.find((p) => p.memory === memory)?.monthly ?? 0
                    return (
                      <GridItem key={pd.id} size={{ xxs: 12, s: 4 }}>
                        <ChoiceCard value={pd.id} selected={pd.id === period.id}>
                          <Typography size="l" fontWeight="bold" component="h3">
                            {pd.label}
                          </Typography>
                          {pd.months > 1 ? (
                            <Stack gap="xxs">
                              {/* GAP-NEW: Typography に取り消し線が無い。実アプリは元の月額に line-through */}
                              {/* 実アプリは 1 行（flexWrap）。Stack に折り返しが無いので 2 行に分けている */}
                              <Typography size="xs" color="low_emphasis" component="span">
                                月額 {yen(base)} →
                              </Typography>
                              <Typography size="xl" fontWeight="bold" component="span">
                                {yen(unit)}
                              </Typography>
                              <Typography size="xs" fontWeight="bold" component="span">
                                {pd.discount}%オフ
                              </Typography>
                            </Stack>
                          ) : (
                            <Stack flexDirection="row" gap="xxs" alignItems="flex-end">
                              {pd.months === 1 && (
                                <Typography size="xs" component="span">
                                  月額
                                </Typography>
                              )}
                              <Typography size="xl" fontWeight="bold" component="span">
                                {yen(pd.months === 1 ? unit : total)}
                              </Typography>
                            </Stack>
                          )}
                        </ChoiceCard>
                      </GridItem>
                    )
                  })}
                </Grid>
              </RadioGroup>
              {/* GAP-NEW: 文中のリンクが無い。「契約期間を変更する」「対応バージョン一覧」は本来リンク */}
              <Typography size="xxs" density="comfort">
                ※
                契約期間の変更が適用されるのは現在の契約期間満了後からとなります。詳しくは契約期間を変更するをご確認ください。
              </Typography>
              {/* ActiveGameNotion。Minecraft (Java版) のときだけ出る */}
              {game.id === 'minecraft-je' && (
                <Typography size="xxs" density="comfort">
                  対応バージョンについて事前にご確認ください。対応バージョン一覧
                </Typography>
              )}
            </Stack>

            {/* ServerSettingSection */}
            <Stack gap="m">
              <SectionTitle>サーバー名</SectionTitle>
              <TextField
                aria-label="サーバー名"
                placeholder="LOLIPOP-GAMERS-SERVER"
                width="full"
                value={name}
                onChange={setName}
                caption={`サーバーを識別するために名前をつけることができます。後で変更も可能（${SERVER_NAME_MAX}文字以内）`}
              />
            </Stack>
          </Stack>
        </Card>
      </GridItem>
      <GridItem size={{ xxs: 12, m: 4 }}>
        <OrderDetail
          game={game}
          memory={memory}
          period={period}
          coupon={false}
          buttonText="支払い情報入力へ"
        />
      </GridItem>
    </Grid>
  )
}

// ─── 3. 支払い情報入力（servers/new/payment-info）───

/** payment-info/_components/RegisterPaymentCardForm ＋ components/PaymentCardForm */
const RegisterPaymentCardForm = () => (
  // 実アプリは一段明るい #1D2A40 の面
  <Paper padding="m" elevation={0} outlined>
    <Stack gap="l">
      <Typography size="l" fontWeight="bold" component="h3">
        クレジットカード情報
      </Typography>
      <TextField label="名義" autoComplete="cc-name" width="full" />
      <TextField label="カード番号" autoComplete="cc-number" inputMode="numeric" width="full" />
      <Grid spacing="xs">
        <GridItem size={6}>
          {/* components/CcExpSelect */}
          <Select label="有効期限(月)" width="full" defaultSelectedKey="10">
            {expireMonths.map((m) => (
              <SelectItem key={m} id={m}>
                {m}
              </SelectItem>
            ))}
          </Select>
        </GridItem>
        <GridItem size={6}>
          <Select label="有効期限(年)" width="full" defaultSelectedKey="2026">
            {expireYears.map((y) => (
              <SelectItem key={y} id={y}>
                {y}
              </SelectItem>
            ))}
          </Select>
        </GridItem>
      </Grid>
      <TextField
        label="セキュリティコード"
        type="password"
        autoComplete="cc-csc"
        inputMode="numeric"
        width="full"
      />
      {/* 実物は rgb(255 255 255 / .05) の地。GAP-NEW: 面の地色だけを変える指定が無いので outlined で代用 */}
      <Paper padding="m" elevation={0} outlined>
        <Typography size="xs">
          当社がお客様から収集した以下の個人情報等は、カード発行会社がおこなう不正利用検知・防止のために、お客様が利用されているカード発行会社へ提供させていただきます。氏名、電話番号、emailアドレス、請求先住所、配送先住所、インターネット利用環境に関する情報等（送信するパラメータの内容に応じて個人情報を記載ください）
          <br />
          お客様が利用されているカード発行会社が海外にある場合、これらの情報は当該発行会社が所属する国に移転される場合があります。お客様が未成年の場合、親権者または後見人の承諾を得た上で、本サービスを利用するものとします。
        </Typography>
      </Paper>
    </Stack>
  </Paper>
)

/** PaymentInfoPaper/InitialPaymentMethodRadioGroup（登録済みの決済手段が無い初回の表示） */
const InitialPaymentMethodRadioGroup = () => {
  const [method, setMethod] = useState<'credit-card' | 'paypay'>('credit-card')
  return (
    // GAP-7: RadioGroup に label が無いので、見出しを SectionTitle で置き aria-label と二重に持っている
    <RadioGroup
      aria-label="支払い方法"
      value={method}
      onChange={(v) => setMethod(v as 'credit-card' | 'paypay')}
    >
      <Stack gap="l">
        <Stack gap="m">
          {/* GAP-NEW: カードブランド（VISA / Mastercard / JCB / AMEX / Diners）のアイコンが無い */}
          <Radio value="credit-card">クレジットカード</Radio>
          {method === 'credit-card' && <RegisterPaymentCardForm />}
        </Stack>
        <Stack gap="xs">
          <Stack flexDirection="row" gap="xs" alignItems="center">
            <Radio value="paypay">PayPay</Radio>
            <img src={paypayLogo} alt="PayPay" width={30} height={30} />
          </Stack>
          {/* GAP-NEW: 文中のリンクが無い。「利用できる支払い方法と対応ブランド」は本来リンク */}
          <Typography size="xxs">
            ※この支払い方法は自動更新に対応していません。詳しくは利用できる支払い方法と対応ブランドをご確認ください。
          </Typography>
        </Stack>
      </Stack>
    </RadioGroup>
  )
}

/** components/PaymentCardDetail。expire は YYMM で来て YY/MM で出す */
const PaymentCardDetail = () => (
  <Stack flexDirection="row" gap="s" alignItems="center">
    {/* GAP-NEW: カードブランドのアイコン（PaymentCardBrandIcon、60px）が無い */}
    <Stack gap="xs">
      <Typography size="s">**** **** **** {REGISTERED_CARD.last4}</Typography>
      <Typography size="s">有効期限 : {REGISTERED_CARD.expire}</Typography>
    </Stack>
  </Stack>
)

/** PaymentInfoPaper/PaymentMethodCard（登録済みの決済手段がある場合） */
const PaymentMethodCard = ({ onChange }: { onChange: () => void }) => (
  // GAP-NEW: Stack の alignItems にブレークポイントごとの値を渡せない。実物は横並び（s 以上）で縦の中央揃え
  <Stack
    flexDirection={{ xxs: 'column', s: 'row' }}
    gap="xs"
    alignItems="flex-start"
    justifyContent="space-between"
  >
    <PaymentCardDetail />
    {/* 押すと PaymentMethodChangeDialog が開く */}
    <Button appearance="outlined" onPress={onChange}>
      変更
    </Button>
  </Stack>
)

/** payment-info/_components/ConfirmPaymentCardForm（変更ダイアログの中の登録済みカード） */
const ConfirmPaymentCardForm = ({ onEdit }: { onEdit: () => void }) => (
  // 実物は rgb(255 255 255 / .05) の地。GAP-NEW: 面の地色だけを変える指定が無いので outlined で代用
  <Paper padding="m" elevation={0} outlined>
    <Stack
      flexDirection={{ xxs: 'column', m: 'row' }}
      gap="s"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <PaymentCardDetail />
      {/* 実物は EditOutlined のアイコン付きの文字ボタン */}
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
 * PaymentInfoPaper/PaymentMethodChangeDialog の入力の段。
 * 実物は onClose を持たないので、背景を押しても閉じない。ボタンの見た目は lib/dialog.ts（閉じる = 文字だけ、確定 = 枠線）
 */
const PaymentMethodChangeDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const [method, setMethod] = useState<'credit-card' | 'paypay'>('credit-card')
  const [editing, setEditing] = useState(false)
  return (
    <Dialog isOpen={isOpen} isDismissable={false}>
      <DialogHeader>
        <DialogTitle>支払い方法の変更</DialogTitle>
      </DialogHeader>
      <Stack gap="l">
        <Callout color="notice" appearance="outline">
          現在登録可能なクレジットカードの情報はアカウントに対して1件のみです。
          <br />
          クレジットカード情報を変更した場合は、クレジット支払いを選択しているすべてのサーバーの情報が変更されます。
        </Callout>
        {/* GAP-7: RadioGroup に label が無い。実物も見出しを持たないので aria-label だけを付ける */}
        <RadioGroup
          aria-label="支払い方法"
          value={method}
          onChange={(v) => setMethod(v as 'credit-card' | 'paypay')}
        >
          <Stack gap="l">
            <Stack gap="m">
              {/* GAP-NEW: カードブランドのアイコン（PaymentCardBrandIconsList）が無い */}
              <Radio value="credit-card">クレジットカード</Radio>
              {/* InputDialogContent の creditCardFormState：登録済みなら confirm、「変更」で register */}
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
              {/* GAP-NEW: 文中のリンクが無い。「利用できる支払い方法と対応ブランド」は本来リンク */}
              <Typography size="xxs">
                ※このお支払い方法は自動更新に対応していません。詳しくは利用できる支払い方法と対応ブランドをご確認ください。
              </Typography>
            </Stack>
          </Stack>
        </RadioGroup>
      </Stack>
      <DialogFooter>
        <Button appearance="transparent" onPress={onClose}>
          キャンセル
        </Button>
        <Button appearance="outlined" onPress={onClose}>
          変更
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

/** payment-info/_components/PaymentInfoPaper と注文内容。registered は登録済みの決済手段（カード）があるとき */
const PaymentInfo = ({
  registered = false,
  initialCouponDraft = '',
  initialAskCoupon = false,
  initialChanging = false,
}: {
  registered?: boolean
  initialCouponDraft?: string
  /** クーポン未適用の確認ダイアログを開いた状態で始める */
  initialAskCoupon?: boolean
  /** 支払い方法の変更ダイアログを開いた状態で始める */
  initialChanging?: boolean
}) => {
  const game = games[0]
  const [coupon, setCoupon] = useState(false)
  const [couponDraft, setCouponDraft] = useState(initialCouponDraft)
  const [askCoupon, setAskCoupon] = useState(initialAskCoupon)
  const [changing, setChanging] = useState(initialChanging)
  return (
    <>
      <Grid spacing="m">
        <GridItem size={{ xxs: 12, m: 8 }}>
          {/* payment-info/_components/PaymentInfoPaper */}
          <Card>
            <Stack gap="xl">
              <SectionTitle>支払い方法</SectionTitle>
              {registered ? (
                <PaymentMethodCard onChange={() => setChanging(true)} />
              ) : (
                <InitialPaymentMethodRadioGroup />
              )}

              <Stack gap="xl">
                <SectionTitle>クーポン</SectionTitle>
                {coupon ? (
                  <Stack gap="xs">
                    <Typography size="s" fontWeight="bold" component="span">
                      適用されているクーポン
                    </Typography>
                    {/* GAP-NEW: LabelOutlined（荷札）に当たるアイコンが無い */}
                    <Typography size="s" fontWeight="bold" color="positive" component="span">
                      {COUPON.name}
                    </Typography>
                  </Stack>
                ) : (
                  // CouponCodeForm
                  <Stack flexDirection="row" gap="xs" alignItems="flex-end">
                    <TextField
                      label="クーポンコード"
                      width="full"
                      value={couponDraft}
                      onChange={setCouponDraft}
                    />
                    <Button
                      appearance="outlined"
                      onPress={() => {
                        if (couponDraft.trim().toUpperCase() === COUPON.code) setCoupon(true)
                      }}
                    >
                      適用
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Card>
        </GridItem>
        <GridItem size={{ xxs: 12, m: 4 }}>
          <OrderDetail
            game={game}
            memory={8}
            period={periods[1]}
            coupon={coupon}
            buttonText="購入する"
            showChange
            // コードを入力したまま適用していないと確認が出る（AssertCouponUnapplyDialog）
            onSubmit={() => {
              if (couponDraft && !coupon) setAskCoupon(true)
            }}
          />
        </GridItem>
      </Grid>

      {/* payment-info/_components/AssertCouponUnapplyDialog（タイトル無し） */}
      <Dialog isOpen={askCoupon} onOpenChange={setAskCoupon}>
        <Typography>クーポンが適用されていません。購入を続けますか？</Typography>
        <DialogFooter>
          <Button appearance="transparent" onPress={() => setAskCoupon(false)}>
            閉じる
          </Button>
          <Button appearance="outlined" onPress={() => setAskCoupon(false)}>
            購入する
          </Button>
        </DialogFooter>
      </Dialog>

      <PaymentMethodChangeDialog isOpen={changing} onClose={() => setChanging(false)} />
    </>
  )
}

// ─── 売り切れ・メンテナンス ───

/** servers/new/_components/SoldOut（ServerSoldWrapper が isServerSoldOut を見て差し替える） */
const SoldOut = () => (
  <NoticeCard>
    <Typography size="xxl" fontWeight="bold" component="h1">
      売り切れ
    </Typography>
    {/* 実物は 12em 角。HTML の width / height は em を取れないので 16px 換算の 192 にしている */}
    <Stack alignItems="center">
      <img src={soldOutImage} alt="クリスマスプレゼントのイラスト" width={192} height={192} />
    </Stack>
    <Stack gap="xs">
      <Typography>サーバーが売り切れているため購入することができません</Typography>
      <Typography>再入荷までお待ちください</Typography>
    </Stack>
    <Button color="interactive" size="l" width="full">
      ホームへ
    </Button>
  </NoticeCard>
)

/** components/PurchaseMaintenance。実物はログイン前の GlobalHeader（isLogin=false）で、アカウントのメニューが無い */
const PurchaseMaintenance = () => (
  <NoticeCard>
    <Stack alignItems="center">
      <img src={maintenanceImage} alt="メンテナンス" width={250} height={250} />
    </Stack>
    {/* GAP-NEW: Typography に文字揃え（text-align）が無い。実物は Paper 全体が中央揃えで、2 行の本文も行ごとに中央に揃う */}
    <Stack gap="xs" alignItems="center">
      <Typography size="xl" fontWeight="bold" component="h1">
        おっと！今は準備中みたいです。
      </Typography>
      <Typography>
        再開までしばらくお待ちください。
        <br />
        くわしくはお知らせをご覧ください。
      </Typography>
    </Stack>
    <Stack gap="s">
      <Button color="interactive" size="l" width="full">
        お知らせへ
      </Button>
      <Button appearance="outlined" size="l" width="full">
        トップ画面へ
      </Button>
    </Stack>
  </NoticeCard>
)

// ─── ストーリー ───

/** 申し込みの間はサイドナビが無い */
const Screen = ({ children }: { children: ReactNode }) => (
  <AppShell active="home" nav={false}>
    {children}
  </AppShell>
)

/**
 * 1 段目：ゲーム選択。ゲームのカードを並べ、上の検索欄で絞り込む（読み「まいんくらふと」などでも当たる）。
 *
 * @summary ゲームを選ぶ
 */
export const GameSelectStep: Story = {
  name: 'GameSelect',
  render: () => (
    <Screen>
      <GameSelect />
    </Screen>
  ),
}

/**
 * 2 段目：プラン選択。左にゲーム・プラン（メモリ容量）・期間・サーバー名、右に注文内容。
 * プランと期間を選ぶと注文内容の金額が変わる。3ヶ月以上は元の月額と割引率が出る。
 *
 * @summary プランと期間を選ぶ
 */
export const PlanSelectStep: Story = {
  name: 'PlanSelect',
  render: () => (
    <Screen>
      <PlanSelect />
    </Screen>
  ),
}

/**
 * 3 段目：支払い情報入力（登録済みの決済手段が無い初回）。クレジットカードを選ぶとカード情報のフォームが開く。
 * クーポンコード（例：GAMERS500）を「適用」すると注文内容に小計と割引が出る。
 *
 * @summary 支払い方法とクーポンを入力する
 */
export const PaymentInfoStep: Story = {
  name: 'PaymentInfo',
  render: () => (
    <Screen>
      <PaymentInfo />
    </Screen>
  ),
}

/**
 * 登録済みのカードの「変更」で開く、支払い方法の変更ダイアログ（PaymentMethodChangeDialog）。
 * 登録できるカードは 1 件だけという注意と、登録済みのカード、PayPay を選ぶラジオが出る。
 * カードの「変更」でカード情報のフォームに切り替わる。
 *
 * @summary 支払い方法の変更
 */
export const PaymentMethodChange: Story = {
  render: () => (
    <Screen>
      <PaymentInfo registered initialChanging />
    </Screen>
  ),
}

/**
 * クーポンコードを入力したまま「適用」を押さずに「購入する」を押したときの確認（AssertCouponUnapplyDialog）。
 *
 * @summary クーポン未適用の確認
 */
export const CouponUnapplied: Story = {
  render: () => (
    <Screen>
      <PaymentInfo registered initialCouponDraft="GAMERS500" initialAskCoupon />
    </Screen>
  ),
}

/**
 * サーバーが売り切れのとき。申し込みのどの段にも入れず、この画面に差し替わる。
 *
 * @summary 売り切れ
 */
export const SoldOutStep: Story = {
  name: 'SoldOut',
  render: () => (
    <Screen>
      <SoldOut />
    </Screen>
  ),
}

/**
 * 購入がメンテナンスで止まっているとき（PurchaseMaintenance）。
 *
 * @summary 購入のメンテナンス中
 */
export const Maintenance: Story = {
  render: () => (
    <Screen>
      <PurchaseMaintenance />
    </Screen>
  ),
}

/**
 * プラン選択をスマートフォン幅で見た状態。注文内容は左カラムの下に回る。
 *
 * @summary スマートフォン幅でのプラン選択
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'iphone14' } },
  render: () => (
    <Screen>
      <PlanSelect />
    </Screen>
  ),
}
