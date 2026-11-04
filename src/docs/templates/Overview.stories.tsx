import { useState } from 'react'

import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Checkbox } from '../../Checkbox'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Menu, MenuItem, MenuTrigger } from '../../Menu'
import { Paper } from '../../Paper'
import { Select, SelectItem } from '../../Select'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../Table'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import { AppShell } from './AppShell'
import {
  CalloutBody,
  ConfigRow,
  EmptyNotice,
  gameImages,
  isServerPreparing,
  PaperTitle,
  ServerDetailHeader,
  server,
} from './gameServer'
import { Card } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { ServerStatus } from './gameServer'

/**
 * ゲームサーバーの詳細（apollo/frontend の servers/[id]/(server)/page.tsx の「詳細」タブ）。
 * 並びは ServerDetailTab のまま: ステータス → 詳細情報 → 契約中のゲーム・プラン
 * → ポート開放 → 定期スケジュール → サーバーの初期化。準備中は Alert とサーバーの再起動だけになる。
 * 実アプリにはコンソール・ログの画面は無いので作っていない。
 */
const meta = {
  title: 'Templates/Overview',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ ───

// ゲーム名は backend/entity/game.go の GameDisplayNames
const games = [
  'Minecraft (Java版)',
  'Minecraft (統合版)',
  'パルワールド',
  '7 Days to Die',
  'ARK: Survival Evolved',
]

/**
 * プランの説明は services/Plan.tsx の findDescription（Minecraft Java版のもの）、
 * 月額は backend の register_subscription_plan_by_admin/run.yml の 1ヶ月の価格。CPU / Disk は例。
 * ゲーマーズの実装と同じ値
 */
type PlanSpec = { memory: number; cpu: number; disk: number; description: string; monthly: number }
const planSpecs: PlanSpec[] = [
  { memory: 4, cpu: 2, disk: 50, description: '目安 1~5人', monthly: 1500 },
  { memory: 8, cpu: 4, disk: 100, description: '目安 6~10人、Mod使用', monthly: 3000 },
  { memory: 16, cpu: 6, disk: 200, description: '目安 11人~、Mod使用', monthly: 4300 },
  { memory: 32, cpu: 8, disk: 400, description: '目安 20人~、Mod使用', monthly: 11000 },
]
// 契約中は 8GB・1ヶ月
const plan = planSpecs[1]
const contractMonths = 1

/** 契約期間。割引率は例。実際の値は契約プランの billingRules から来る */
const durations = [
  { months: 1, discount: 0 },
  { months: 3, discount: 5 },
  { months: 6, discount: 10 },
  { months: 12, discount: 15 },
  { months: 24, discount: 20 },
  { months: 36, discount: 25 },
]

const yen = (n: number) => `${n.toLocaleString('ja-JP')}円`

// ServerFirewallRulesPaper/model の ProtocolType
const protocols = ['TCP', 'UDP', 'TCP/UDP']

const firewallRules = [
  { protocol: 'TCP', port: 25565 },
  { protocol: 'UDP', port: 19132 },
  { protocol: 'TCP', port: 8123 },
]

// ScheduleFormDialog/model。曜日は日曜始まり
const actionOptions = ['再起動', '起動', '停止'] as const
const recurrenceOptions = [
  { id: 'daily', label: '毎日' },
  { id: 'weekly', label: '毎週' },
  { id: 'monthly', label: '毎月' },
] as const
const weekdayOptions = ['日', '月', '火', '水', '木', '金', '土']
const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1)

type ScheduleAction = (typeof actionOptions)[number]
type RecurrenceType = (typeof recurrenceOptions)[number]['id']

/** model/serverSchedule の ScheduleFormValue。時刻は「04:00」の文字列で持つ */
type ScheduleValue = {
  name: string
  action: ScheduleAction
  recurrenceType: RecurrenceType
  weekdays: number[]
  days: number[]
  times: string[]
  enabled: boolean
}
type Schedule = ScheduleValue & { id: string }

/** model/serverSchedule の formatRecurrence（「毎日 04:00・05:00」「毎週日曜・土曜 03:00」「毎月1日・15日 02:00」） */
const formatRecurrence = (s: ScheduleValue) => {
  const times = s.times.join('・')
  if (s.recurrenceType === 'weekly') {
    const w = [...s.weekdays].sort((a, b) => a - b).map((d) => `${weekdayOptions[d]}曜`)
    return `毎週${w.join('・')} ${times}`
  }
  if (s.recurrenceType === 'monthly') {
    const d = [...s.days].sort((a, b) => a - b).map((x) => `${x}日`)
    return `毎月${d.join('・')} ${times}`
  }
  return `毎日 ${times}`
}

/** model/serverSchedule の emptyFormValue。既定は再起動・毎日・00:00・有効 */
const emptySchedule: ScheduleValue = {
  name: '',
  action: '再起動',
  recurrenceType: 'daily',
  weekdays: [],
  days: [],
  times: ['00:00'],
  enabled: true,
}

const schedulesInitial: Schedule[] = [
  {
    id: 'sc-1',
    name: '毎朝の再起動',
    action: '再起動',
    recurrenceType: 'daily',
    weekdays: [],
    days: [],
    times: ['04:00'],
    enabled: true,
  },
  {
    id: 'sc-2',
    name: '週末の夜に停止',
    action: '停止',
    recurrenceType: 'weekly',
    weekdays: [0, 6],
    days: [],
    times: ['03:00'],
    enabled: false,
  },
  {
    id: 'sc-3',
    name: '月2回の再起動',
    action: '再起動',
    recurrenceType: 'monthly',
    weekdays: [],
    days: [1, 15],
    times: ['05:00', '17:00'],
    enabled: true,
  },
]

// ─── 部品 ───

// GAP-18: 進捗バー / メーターが無い。Typography で色を継承させ、currentColor で塗っている。
// 高さ・角丸・トラックの不透明度はトークンに出典が無い暫定値。
const meterTrackStyle = { height: 8, borderRadius: 4, opacity: 0.15, background: 'currentColor' }
const meterFillStyle = { height: 8, borderRadius: 4, marginTop: -8, background: 'currentColor' }

/** 実アプリは 9 割を超えるとゲージの色が error.dark に変わる */
const Meter = ({ ratio }: { ratio: number }) => (
  <Typography component="div" color={ratio >= 0.9 ? 'negative' : 'informative'}>
    <div style={meterTrackStyle} />
    {/* GAP-18: 幅だけは値ごとに変わるので毎回作る */}
    <div style={{ ...meterFillStyle, width: `${Math.min(ratio, 1) * 100}%` }} />
  </Typography>
)

/**
 * (server)/_components/ServerStatusPaper。実アプリは MUI x-charts の Gauge（170px の円）を
 * 3 つ縦罫で区切って並べる。
 * GAP-18: 円形ゲージが無いので数値＋横棒で代用。
 * GAP-NEW: Tooltip が無い。実アプリはゲージにカーソルを乗せると「😄 問題ありません。」、
 * 9 割を超えると「💦 負荷が高まっています。プランアップもおすすめです。」
 * （ディスクは「💦 使用量が高まっています。データの削除をおすすめします。」）がカーソルに付いて出る。
 * ここでは出せていない
 */
const ServerStatusPaper = ({ status }: { status: ServerStatus }) => {
  const items = [
    { label: 'CPU使用率', ratio: 0.234, text: '23.4%', free: `76.6% 空き / ${plan.cpu}Core` },
    {
      label: 'メモリ使用量',
      ratio: 7.4 / plan.memory,
      text: '7.4GB',
      free: `0.6GB 空き / ${plan.memory}GB`,
    },
    {
      label: 'ディスク使用量',
      ratio: 18.6 / plan.disk,
      text: '18.6GB',
      free: `81.4GB 空き / ${plan.disk}GB`,
    },
  ]
  return (
    <Card>
      <Stack gap="l">
        <PaperTitle>ステータス</PaperTitle>
        <Grid spacing="l">
          {items.map((m) => (
            <GridItem key={m.label} size={{ xxs: 12, l: 4 }}>
              <Stack gap="s">
                <Typography size="s" fontWeight="bold" component="h3">
                  {m.label}
                </Typography>
                {status !== 'RUNNING' ? (
                  <EmptyNotice>
                    😴 サーバー停止中のため非表示になっています。
                    <br />
                    サーバーを起動後、最大30秒程度で表示されます。
                  </EmptyNotice>
                ) : (
                  <Stack gap="xs">
                    <Typography size="l" fontWeight="bold" component="span">
                      {m.text}
                    </Typography>
                    <Meter ratio={m.ratio} />
                    <Typography size="xs" component="span">
                      {m.free}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </GridItem>
          ))}
        </Grid>
      </Stack>
    </Card>
  )
}

/** (server)/_components/ServerDetailPaper。項目の間に Divider */
const ServerDetailPaper = ({
  status,
  onSshKey,
}: {
  status: ServerStatus
  onSshKey: () => void
}) => (
  <Card>
    <Stack gap="l">
      <PaperTitle>詳細情報</PaperTitle>
      <Stack
        flexDirection={{ xxs: 'column', m: 'row' }}
        gap="s"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <ConfigRow label="IPアドレス">{server.ip}</ConfigRow>
        {/* components/CopyButton */}
        <Button appearance="outlined" leading={<Icon name="copy" size="s" />}>
          アドレスをコピー
        </Button>
      </Stack>
      <Divider />
      <Stack
        flexDirection={{ xxs: 'column', m: 'row' }}
        gap="s"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Typography size="s" fontWeight="bold" component="span">
          SSH Key
        </Typography>
        {/* KeyGenerateButton。起動中以外は鍵を再生成できない */}
        <Button
          appearance="outlined"
          leading={<Icon name="copy" size="s" />}
          isDisabled={status !== 'RUNNING'}
          onPress={onSshKey}
        >
          秘密鍵を再作成
        </Button>
      </Stack>
      <Divider />
      <ConfigRow label="SSH ユーザー名">admin</ConfigRow>
      <Divider />
      <ConfigRow label="サーバーID">{server.id}</ConfigRow>
    </Stack>
  </Card>
)

// ─── 契約中のゲーム・プラン（ContractPaper + SubscriptionInPlaceModal）───
// SelectableRow・PlanItemBody・PriceLine・CurrentSticker と ContractPaper の開いた状態は
// ゲーマーズの SubscriptionInPlaceModal を再現したもの

/** components/Sticker の spec='current' */
const CurrentSticker = () => (
  <Sticker color="informative" size="s">
    現在
  </Sticker>
)

/**
 * SubscriptionInPlaceModal の GameItem / PlanItem / 期間の 1 枠。
 * GAP-3: 選択できるカードが無いので、Paper の outlined の有無と Button で組んでいる。
 */
const SelectableRow = ({
  selected,
  isDisabled,
  onPress,
  children,
  label,
}: {
  selected: boolean
  isDisabled?: boolean
  onPress: () => void
  children: ReactNode
  label: string
}) => (
  <Paper padding="m" elevation={0} outlined={selected}>
    <Stack
      flexDirection={{ xxs: 'column', m: 'row' }}
      gap="s"
      justifyContent="space-between"
      alignItems="center"
    >
      {children}
      <Button
        appearance={selected ? 'flat' : 'outlined'}
        color={selected ? 'interactive' : 'neutral'}
        size="s"
        isDisabled={isDisabled}
        aria-label={label}
        onPress={onPress}
      >
        {selected ? '選択中' : '選択'}
      </Button>
    </Stack>
  </Paper>
)

const PlanItemBody = ({
  spec,
  months,
  isContracted,
  isLower,
}: {
  spec: PlanSpec
  months: number
  isContracted: boolean
  isLower: boolean
}) => {
  const d = durations.find((x) => x.months === months) ?? durations[0]
  const unit = Math.round(spec.monthly * (1 - d.discount / 100))
  return (
    <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="l" alignItems="center">
      <Stack gap="xs">
        <Stack flexDirection="row" gap="xs" alignItems="center">
          <Typography size="s" fontWeight="bold" component="span">
            {spec.memory}GB
          </Typography>
          {isContracted && <CurrentSticker />}
          <Typography size="s" color={isLower ? 'negative' : 'high_emphasis'} component="span">
            {isLower ? '下位プランへの変更は現在対応していません' : spec.description}
          </Typography>
        </Stack>
        <Typography size="s" component="span">
          メモリー {spec.memory}GB / CPU {spec.cpu}Core / Disk {spec.disk}GB
        </Typography>
      </Stack>
      {d.months > 1 ? (
        <Stack gap="xxs">
          <Typography size="s" fontWeight="bold" component="span">
            月額 {yen(spec.monthly)} → {yen(unit)}
          </Typography>
          <Typography size="s" component="span">
            長期割引適用中 （{d.discount}%オフ）
          </Typography>
        </Stack>
      ) : (
        <Typography size="s" fontWeight="bold" component="span">
          月額 {yen(spec.monthly)}
        </Typography>
      )}
    </Stack>
  )
}

/**
 * (server)/_components/ContractPaper + SubscriptionInPlaceModal + DurationChangeCancelDialog。
 * 閉じているときは契約中のゲームとプランを 1 枠ずつ、「変更」で同じ場所に一覧が開く（モーダルではない）。
 * 契約期間の変更を予約していると「契約期間の変更が予定されています」と「取り消し」が出る
 */
const ContractPaper = ({
  initialOpen = false,
  cancelDialog = false,
}: {
  initialOpen?: boolean
  /** 契約期間の変更を予約している状態で、取り消しの確認を開いておく */
  cancelDialog?: boolean
}) => {
  const contracted = { game: server.game as string, memory: plan.memory, months: contractMonths }
  // 予約中の期間（例）
  const nextMonths = 12
  const [open, setOpen] = useState(initialOpen)
  const [game, setGame] = useState(contracted.game)
  const [memory, setMemory] = useState(contracted.memory)
  const [months, setMonths] = useState(contracted.months)
  const [isCancelOpen, setCancelOpen] = useState(cancelDialog)

  const isChanged =
    game !== contracted.game || memory !== contracted.memory || months !== contracted.months
  const close = () => {
    setOpen(false)
    setGame(contracted.game)
    setMemory(contracted.memory)
    setMonths(contracted.months)
  }

  return (
    <Card>
      <Stack gap="l">
        {cancelDialog && (
          <Callout
            color="informative"
            action={
              <Button appearance="transparent" size="s" onPress={() => setCancelOpen(true)}>
                取り消し
              </Button>
            }
          >
            <CalloutBody title="契約期間の変更が予定されています">
              次回の自動更新：2026/11/01より、
              <Typography size="s" fontWeight="bold" component="span">
                {nextMonths}ヶ月
              </Typography>{' '}
              分の料金がまとめて請求されます。
            </CalloutBody>
          </Callout>
        )}
        <PaperTitle
          action={
            open ? undefined : (
              <Button appearance="outlined" onPress={() => setOpen(true)}>
                変更
              </Button>
            )
          }
        >
          契約中のゲーム・プラン
        </PaperTitle>
        <Divider />
        <Grid spacing="l">
          <GridItem size={{ xxs: 12, l: 4 }}>
            <Stack gap="xs">
              <Typography size="s" fontWeight="bold" component="h3">
                ゲーム
              </Typography>
              {/* GameItem。名前の左に 70px 角のキービジュアル。GAP-NEW: 画像の枠（Image）が無い（実物は object-fit: cover） */}
              {open ? (
                <Stack gap="xs">
                  {games.map((g) => (
                    <SelectableRow
                      key={g}
                      selected={g === game}
                      label={`${g}を選択`}
                      onPress={() => setGame(g)}
                    >
                      <Stack flexDirection="row" gap="s" alignItems="center">
                        <img src={gameImages[g]} alt={g} width={70} height={70} />
                        <Typography fontWeight="bold" component="span">
                          {g}
                        </Typography>
                        {g === contracted.game && <CurrentSticker />}
                      </Stack>
                    </SelectableRow>
                  ))}
                </Stack>
              ) : (
                <Paper padding="m" elevation={0} outlined>
                  <Stack flexDirection="row" gap="s" alignItems="center">
                    <img
                      src={gameImages[contracted.game]}
                      alt={contracted.game}
                      width={70}
                      height={70}
                    />
                    <Typography fontWeight="bold" component="span">
                      {contracted.game}
                    </Typography>
                  </Stack>
                </Paper>
              )}
            </Stack>
          </GridItem>
          <GridItem size={{ xxs: 12, l: 8 }}>
            <Stack gap="xs">
              <Typography size="s" fontWeight="bold" component="h3">
                プラン
              </Typography>
              {open ? (
                <Stack gap="xs">
                  {planSpecs.map((p) => {
                    const isLower = p.memory < contracted.memory
                    return (
                      <SelectableRow
                        key={p.memory}
                        selected={p.memory === memory}
                        isDisabled={isLower}
                        label={`${p.memory}GBを選択`}
                        onPress={() => setMemory(p.memory)}
                      >
                        <PlanItemBody
                          spec={p}
                          months={months}
                          isContracted={p.memory === contracted.memory}
                          isLower={isLower}
                        />
                      </SelectableRow>
                    )
                  })}
                </Stack>
              ) : (
                <Paper padding="m" elevation={0} outlined>
                  <PlanItemBody
                    spec={plan}
                    months={contracted.months}
                    isContracted={false}
                    isLower={false}
                  />
                </Paper>
              )}
            </Stack>
          </GridItem>
        </Grid>

        {open && (
          <>
            <Stack gap="xs">
              <Typography size="s" fontWeight="bold" component="h3">
                期間
              </Typography>
              <Grid spacing="xs">
                {durations.map((d) => (
                  <GridItem key={d.months} size={{ xxs: 12, s: 4 }}>
                    <SelectableRow
                      selected={d.months === months}
                      label={`${d.months}ヶ月を選択`}
                      onPress={() => setMonths(d.months)}
                    >
                      <Stack flexDirection="row" gap="xs" alignItems="center">
                        <Typography fontWeight="bold" component="span">
                          {d.months}ヶ月
                        </Typography>
                        {d.months === contracted.months && <CurrentSticker />}
                      </Stack>
                    </SelectableRow>
                  </GridItem>
                ))}
              </Grid>
            </Stack>

            <Stack flexDirection="row" gap="s" justifyContent="center">
              <Button appearance="outlined" onPress={close}>
                キャンセル
              </Button>
              <Button color="interactive" isDisabled={!isChanged} onPress={close}>
                保存
              </Button>
            </Stack>
          </>
        )}
      </Stack>

      {/* (server)/_components/DurationChangeCancelDialog */}
      <Dialog isOpen={isCancelOpen} isDismissable={false}>
        <DialogHeader>
          <DialogTitle>プラン変更予定の取り消し</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {nextMonths}ヶ月契約への変更予定を取り消します。
          <br />
          取り消し後は、現在の{contracted.months}ヶ月契約を引き続きご利用いただけます。
        </DialogDescription>
        <DialogFooter>
          <Button appearance="transparent" onPress={() => setCancelOpen(false)}>
            閉じる
          </Button>
          <Button appearance="outlined" onPress={() => setCancelOpen(false)}>
            取り消し
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  )
}

/** (server)/_components/ServerFirewallRulesPaper */
const ServerFirewallRulesPaper = () => {
  const [port, setPort] = useState('')
  return (
    <Card>
      <Stack gap="l">
        <PaperTitle>ポート開放</PaperTitle>
        <Stack flexDirection={{ xxs: 'column', l: 'row' }} gap="m" alignItems="flex-end">
          <Select label="プロトコル" size="s" defaultSelectedKey="TCP">
            {protocols.map((p) => (
              <SelectItem key={p} id={p}>
                {p}
              </SelectItem>
            ))}
          </Select>
          <TextField
            label="ポート番号"
            size="s"
            inputMode="numeric"
            value={port}
            onChange={setPort}
          />
          {/* GAP-NEW: LockOpen に当たるアイコンが無いので lock で代用 */}
          <Button appearance="outlined" leading={<Icon name="lock" size="s" />} isDisabled={!port}>
            開放
          </Button>
        </Stack>
        {/* GAP-NEW: Accordion / Disclosure が無い。実アプリは「開放済ポート　N個」の見出しを押すと表が開く。ここでは開いた状態で固定 */}
        <Paper padding="m" elevation={0} outlined>
          <Stack gap="m">
            <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="xl">
              <Typography component="span">開放済ポート</Typography>
              <Typography color="medium_emphasis" component="span">
                {firewallRules.length}個
              </Typography>
            </Stack>
            <Table aria-label="開放済ポート">
              <TableHeader>
                <Column isRowHeader allowsSorting>
                  プロトコル
                </Column>
                <Column allowsSorting>ポート番号</Column>
                <Column aria-label="操作"> </Column>
              </TableHeader>
              <TableBody>
                {firewallRules.map((r) => (
                  <Row key={`${r.protocol}-${r.port}`} id={`${r.protocol}-${r.port}`}>
                    <Cell>{r.protocol}</Cell>
                    <Cell>{r.port}</Cell>
                    <Cell>
                      <Button
                        appearance="outlined"
                        color="negative"
                        size="s"
                        leading={<Icon name="garbage_can" size="s" />}
                      >
                        閉鎖
                      </Button>
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          </Stack>
        </Paper>
      </Stack>
    </Card>
  )
}

// ─── 定期スケジュール（ServerSchedulePaper）───

/** (server)/_components/ServerSchedulePaper */
const ServerSchedulePaper = ({
  schedules,
  onAdd,
  onEdit,
  onDelete,
}: {
  schedules: Schedule[]
  onAdd: () => void
  onEdit: (s: Schedule) => void
  onDelete: (s: Schedule) => void
}) => {
  return (
    <Card>
      <Stack gap="l">
        <PaperTitle
          action={
            <Button appearance="outlined" leading={<Icon name="plus" size="s" />} onPress={onAdd}>
              追加
            </Button>
          }
        >
          定期スケジュール
        </PaperTitle>
        <Table aria-label="定期スケジュール">
          <TableHeader>
            <Column isRowHeader>名前</Column>
            <Column>アクション</Column>
            <Column>頻度</Column>
            <Column>実行</Column>
            <Column aria-label="操作"> </Column>
          </TableHeader>
          <TableBody
            renderEmptyState={() => <Typography size="s">定期スケジュールがありません</Typography>}
          >
            {schedules.map((s) => (
              <Row key={s.id} id={s.id}>
                <Cell>{s.name}</Cell>
                <Cell>{s.action}</Cell>
                <Cell>{formatRecurrence(s)}</Cell>
                {/* 切り替えは編集フォームの中で行う。ここは状態の表示だけ */}
                <Cell>{s.enabled ? '有効' : '無効'}</Cell>
                <Cell>
                  <MenuTrigger>
                    <Button
                      appearance="transparent"
                      size="s"
                      iconOnly
                      aria-label={`${s.name} の操作`}
                    >
                      <Icon name="ellipsis_vertical" size="m" aria-hidden="true" />
                    </Button>
                    <Menu placement="bottom end">
                      <MenuItem
                        leading={<Icon name="pencil" size="s" />}
                        onAction={() => onEdit(s)}
                      >
                        編集
                      </MenuItem>
                      <MenuItem
                        color="negative"
                        leading={<Icon name="garbage_can" size="s" />}
                        onAction={() => onDelete(s)}
                      >
                        削除
                      </MenuItem>
                    </Menu>
                  </MenuTrigger>
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </Stack>
    </Card>
  )
}

const toggle = (list: number[], value: number) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

/**
 * ServerSchedulePaper/components/ScheduleFormDialog。追加と編集で同じフォーム（見出しはどちらも「定期スケジュール」）。
 * GAP-NEW: 全画面の Dialog が無い。実アプリは fullScreen の Dialog（幅 900px）なので、
 * Mods と同じく AppShell の中身を置き換えている。
 * 保存・変更を破棄のバーは変更が入るまで出ない。実アプリは画面下に固定（GAP-NEW: 下端に固定する部品が無いのでフォームの直下）
 */
const ScheduleForm = ({ initial, onBack }: { initial: ScheduleValue; onBack: () => void }) => {
  const [value, setValue] = useState(initial)
  const set = (patch: Partial<ScheduleValue>) => setValue((prev) => ({ ...prev, ...patch }))
  const dirty = JSON.stringify(value) !== JSON.stringify(initial)
  return (
    <Stack gap="l">
      <Stack flexDirection="row">
        <Button
          appearance="outlined"
          leading={<Icon name="arrow_left" size="s" />}
          onPress={onBack}
        >
          戻る
        </Button>
      </Stack>
      <Typography size="xxxl" fontWeight="bold" component="h1">
        定期スケジュール
      </Typography>
      <Card>
        <Stack gap="xl">
          <TextField
            label="名前"
            width="full"
            value={value.name}
            onChange={(name) => set({ name })}
          />
          <Select
            label="アクション"
            width="full"
            selectedKey={value.action}
            onSelectionChange={(k) => set({ action: k as ScheduleAction })}
          >
            {actionOptions.map((a) => (
              <SelectItem key={a} id={a}>
                {a}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="頻度"
            width="full"
            selectedKey={value.recurrenceType}
            onSelectionChange={(k) => set({ recurrenceType: k as RecurrenceType })}
          >
            {recurrenceOptions.map((o) => (
              <SelectItem key={o.id} id={o.id}>
                {o.label}
              </SelectItem>
            ))}
          </Select>
          {value.recurrenceType === 'weekly' && (
            // GAP-NEW: ToggleButtonGroup が無い。実アプリは 7 つの曜日を横いっぱいのトグルで並べる。Checkbox で代用
            // GAP-7: CheckboxGroup にもラベルが無いので Typography で見出しを描いている
            <Stack gap="s">
              <Typography size="s" fontWeight="bold" component="span">
                曜日
              </Typography>
              <Stack flexDirection="row" gap="m">
                {weekdayOptions.map((label, i) => (
                  <Checkbox
                    key={label}
                    isSelected={value.weekdays.includes(i)}
                    onChange={() => set({ weekdays: toggle(value.weekdays, i) })}
                  >
                    {label}
                  </Checkbox>
                ))}
              </Stack>
            </Stack>
          )}
          {value.recurrenceType === 'monthly' && (
            // GAP-NEW: 複数選択の Select が無い。実アプリは Select を開くと 1〜31 日が 7 列に並び、
            // 選んだ日がチップで入る。Checkbox を並べて代用（GAP-NEW: Grid の columns={7} が効かず 12 列で折り返す）
            <Stack gap="s">
              <Typography size="s" fontWeight="bold" component="span">
                日
              </Typography>
              <Grid columns={7} spacing="xs">
                {daysOfMonth.map((d) => (
                  <GridItem key={d} size={1}>
                    <Checkbox
                      isSelected={value.days.includes(d)}
                      onChange={() => set({ days: toggle(value.days, d).sort((a, b) => a - b) })}
                    >
                      {String(d)}
                    </Checkbox>
                  </GridItem>
                ))}
              </Grid>
            </Stack>
          )}
          {/* GAP-NEW: TimePicker が無い。実アプリは時・分を縦に並べたスクロールの列から選ぶ。type="time" の TextField で代用。24 時間表記はブラウザの言語設定任せ */}
          <Stack gap="s">
            <Typography size="s" fontWeight="bold" component="span">
              時刻
            </Typography>
            {value.times.map((t, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: 時刻は重複しうるので位置で持つ（実アプリも key={i}）
              <Stack key={i} flexDirection="row" gap="xs" alignItems="center">
                <TextField
                  aria-label={`${i + 1}つめの時刻`}
                  type="time"
                  value={t}
                  onChange={(next) =>
                    set({ times: value.times.map((x, j) => (j === i ? next : x)) })
                  }
                />
                <Button
                  appearance="transparent"
                  size="s"
                  iconOnly
                  aria-label={`${i + 1}つめの時刻を削除`}
                  // 時刻は必ず 1 つ要るので、最後の 1 件は消させない
                  isDisabled={value.times.length <= 1}
                  onPress={() => set({ times: value.times.filter((_, j) => j !== i) })}
                >
                  <Icon name="cross" size="m" />
                </Button>
              </Stack>
            ))}
            <Stack flexDirection="row">
              <Button
                appearance="transparent"
                leading={<Icon name="plus" size="s" />}
                // 一覧の「追加」と文言が同じで役割が違うので、読み上げでは区別する
                aria-label="時刻を追加"
                onPress={() => set({ times: [...value.times, '00:00'] })}
              >
                追加
              </Button>
            </Stack>
          </Stack>
          <Stack gap="s">
            <Typography size="s" fontWeight="bold" component="span">
              スケジュールを実行
            </Typography>
            <Checkbox isSelected={value.enabled} onChange={(enabled) => set({ enabled })}>
              有効
            </Checkbox>
          </Stack>
        </Stack>
      </Card>
      {dirty && (
        <Stack flexDirection="row" gap="s" justifyContent="center">
          <Button color="interactive" size="l" onPress={onBack}>
            保存
          </Button>
          <Button appearance="outlined" size="l" onPress={() => setValue(initial)}>
            変更を破棄
          </Button>
        </Stack>
      )}
    </Stack>
  )
}

/** 見出し・説明と右のボタン 1 つの Paper（RestartServerPaper / RecreateServerPaper） */
const ActionPaper = ({
  title,
  children,
  action,
}: {
  title: string
  children: ReactNode
  action: ReactNode
}) => (
  <Card>
    <Stack
      flexDirection={{ xxs: 'column', s: 'row' }}
      gap="m"
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack gap="s">
        <Typography size="xxl" fontWeight="bold" component="h2">
          {title}
        </Typography>
        <Typography size="s">{children}</Typography>
      </Stack>
      {action}
    </Stack>
  </Card>
)

// ─── 画面 ───

type DialogName = 'recreate' | 'sshKey' | 'deleteSchedule' | null
type ScheduleFormTarget = { mode: 'new' } | { mode: 'edit'; schedule: Schedule } | null

const OverviewScreen = ({
  status = 'RUNNING',
  contractOpen = false,
  contractCancelDialog = false,
  initialDialog = null,
  schedules = schedulesInitial,
  scheduleForm = null,
}: {
  status?: ServerStatus
  /** 「変更」を押して SubscriptionInPlaceModal を開いた状態から始める */
  contractOpen?: boolean
  /** 契約期間の変更予定と、その取り消しの確認を出す */
  contractCancelDialog?: boolean
  initialDialog?: DialogName
  schedules?: Schedule[]
  scheduleForm?: ScheduleFormTarget
}) => {
  const [dialog, setDialog] = useState<DialogName>(initialDialog)
  const [form, setForm] = useState<ScheduleFormTarget>(scheduleForm)
  const [scheduleTarget, setScheduleTarget] = useState<Schedule>(
    schedules[0] ?? schedulesInitial[0]
  )
  const close = () => setDialog(null)

  if (form) {
    return (
      <AppShell active="overview">
        <ScheduleForm
          initial={form.mode === 'edit' ? form.schedule : emptySchedule}
          onBack={() => setForm(null)}
        />
      </AppShell>
    )
  }

  return (
    <AppShell active="overview">
      <ServerDetailHeader status={status} tab="詳細" />

      {status === 'RESTORING' ? (
        // page.tsx。復元中はタブの中身ごと置き換わる。
        // GAP-NEW: Callout のアイコンを差し替えられない。実アプリはアイコンの位置に CircularProgress
        <Callout color="informative">
          <CalloutBody title="バックアップからデータを復元しています">
            復元が完了するまで、サーバーの操作は一時的にご利用いただけません。
            <br />
            完了までしばらくお待ちください。
          </CalloutBody>
        </Callout>
      ) : isServerPreparing(status) ? (
        <>
          {/* ServerDetailTab の準備中。GAP-NEW: Callout のアイコンを CircularProgress に差し替えられない */}
          <Callout color="informative">
            <CalloutBody title="準備中です">
              準備が完了するまでサーバーを利用することができません
            </CalloutBody>
          </Callout>
          {/* RestartServerPaper。押すと RestartServerDialog（閉じられない進行表示）が開く */}
          <ActionPaper
            title="サーバーの再起動"
            action={<Button appearance="outlined">再起動</Button>}
          >
            現在のゲームを停止し、サーバーを再起動します。
          </ActionPaper>
        </>
      ) : (
        <>
          <ServerStatusPaper status={status} />
          <ServerDetailPaper status={status} onSshKey={() => setDialog('sshKey')} />
          <ContractPaper initialOpen={contractOpen} cancelDialog={contractCancelDialog} />
          <ServerFirewallRulesPaper />
          <ServerSchedulePaper
            schedules={schedules}
            onAdd={() => setForm({ mode: 'new' })}
            onEdit={(s) => setForm({ mode: 'edit', schedule: s })}
            onDelete={(s) => {
              setScheduleTarget(s)
              setDialog('deleteSchedule')
            }}
          />
          <ActionPaper
            title="サーバーの初期化"
            action={
              <Button appearance="outlined" color="negative" onPress={() => setDialog('recreate')}>
                初期化
              </Button>
            }
          >
            サーバーの再作成を行い、すべてのサーバーデータを初期化します。
            <br />
            現在のサーバーデータは削除されるため、バックアップをしてから初期化を行ってください。
          </ActionPaper>
        </>
      )}

      {/* (server)/_components/RecreateServerDialog の確認 */}
      <Dialog isOpen={dialog === 'recreate'} isDismissable={false}>
        <DialogHeader>
          <DialogTitle>サーバーの初期化をしますか？</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          初期化すると現在のサーバーデータはすべて削除されます。
          <br />
          必ず現在のサーバーデータのバックアップをしてから初期化してください。
        </DialogDescription>
        <DialogFooter>
          <Button appearance="transparent" onPress={close}>
            キャンセル
          </Button>
          <Button appearance="outlined" color="negative" onPress={close}>
            初期化
          </Button>
        </DialogFooter>
      </Dialog>

      {/* (server)/_components/KeyGenerateButton のダイアログ */}
      <Dialog isOpen={dialog === 'sshKey'} onOpenChange={(open) => !open && close()}>
        <DialogHeader>
          <DialogTitle>秘密鍵の作成</DialogTitle>
        </DialogHeader>
        <Stack gap="m">
          <Callout color="negative" appearance="outline">
            <CalloutBody title="秘密鍵の取り扱いについて">
              ・秘密鍵を公開しないようにご注意ください
            </CalloutBody>
          </Callout>
          <Typography size="s">問題なければ「作成」を押してください</Typography>
        </Stack>
        <DialogFooter>
          <Button appearance="transparent" onPress={close}>
            閉じる
          </Button>
          <Button appearance="outlined" onPress={close}>
            作成
          </Button>
        </DialogFooter>
      </Dialog>

      {/* ServerSchedulePaper/components/DeleteScheduleDialog */}
      <Dialog isOpen={dialog === 'deleteSchedule'} onOpenChange={(open) => !open && close()}>
        <DialogHeader>
          <DialogTitle>「{scheduleTarget.name}」を削除しますか？</DialogTitle>
        </DialogHeader>
        <DialogDescription>この定期スケジュールを削除します。</DialogDescription>
        <DialogFooter>
          <Button appearance="transparent" onPress={close}>
            キャンセル
          </Button>
          <Button appearance="outlined" color="negative" onPress={close}>
            削除
          </Button>
        </DialogFooter>
      </Dialog>
    </AppShell>
  )
}

// ─── ストーリー ───

/**
 * 起動中のサーバー詳細。
 *
 * @summary 起動中のサーバー詳細
 */
export const Default: Story = {
  render: () => <OverviewScreen />,
}

/**
 * 停止中。ステータスの 3 つのゲージが「😴 サーバー停止中のため…」に置き換わり、
 * 秘密鍵の再作成が押せなくなる。ヘッダーのボタンは「起動」と「再起動」。
 *
 * @summary 停止中のサーバー詳細
 */
export const Stopped: Story = {
  render: () => <OverviewScreen status="STOPPED" />,
}

/**
 * 申し込み直後などの準備中（状態が不明なときも同じ表示）。ヘッダーからステータスと起動ボタンが消え、
 * 詳細は準備中の Alert とサーバーの再起動だけになる。
 *
 * @summary 準備中
 */
export const Preparing: Story = {
  render: () => <OverviewScreen status="PREPARING" />,
}

/**
 * バックアップから復元している間。詳細の中身全体が復元中の Alert に置き換わる。
 *
 * @summary バックアップから復元中
 */
export const Restoring: Story = {
  render: () => <OverviewScreen status="RESTORING" />,
}

/**
 * 「秘密鍵を再作成」を押した直後の確認ダイアログ。
 *
 * @summary 秘密鍵の作成ダイアログ
 */
export const SshKeyDialog: Story = {
  render: () => <OverviewScreen initialDialog="sshKey" />,
}

/**
 * 「変更」を押した直後。ゲーム・プラン・期間の一覧が同じ場所に開く（SubscriptionInPlaceModal）。
 *
 * @summary ゲーム・プランの変更
 */
export const PlanChange: Story = {
  render: () => <OverviewScreen contractOpen />,
}

/**
 * 契約期間の変更を予約している状態で「取り消し」を押した直後の確認ダイアログ。
 *
 * @summary 変更予定の取り消し
 */
export const DurationChangeCancelDialog: Story = {
  render: () => <OverviewScreen contractCancelDialog />,
}

/**
 * 定期スケジュールが 1 件も無い状態。見出しは残し、表の中に「定期スケジュールがありません」。
 *
 * @summary 定期スケジュールが空
 */
export const NoSchedules: Story = {
  render: () => <OverviewScreen schedules={[]} />,
}

/**
 * 「追加」を押した直後のフォーム。既定は再起動・毎日・00:00・有効。変更を入れると保存のボタンが出る。
 * 頻度を「毎週」にすると曜日、「毎月」にすると日が出る。
 *
 * @summary 定期スケジュールの追加
 */
export const ScheduleFormNew: Story = {
  render: () => <OverviewScreen scheduleForm={{ mode: 'new' }} />,
}

/**
 * ⋮ の「削除」を押した直後の確認ダイアログ。
 *
 * @summary 定期スケジュールの削除の確認
 */
export const ScheduleDeleteDialog: Story = {
  render: () => <OverviewScreen initialDialog="deleteSchedule" />,
}

/**
 * 「初期化」を押した直後の確認ダイアログ。
 *
 * @summary サーバーの初期化の確認
 */
export const RecreateConfirm: Story = {
  render: () => <OverviewScreen initialDialog="recreate" />,
}
