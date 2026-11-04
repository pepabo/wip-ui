import { useState } from 'react'
import { TabPanel } from 'react-aria-components'

import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Menu, MenuItem, MenuTrigger } from '../../Menu'
import { Paper } from '../../Paper'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Tab, TabList, Tabs } from '../../Tab'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import { DeployNowShell, ProjectDetailLayout } from './deployNowShell'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { StickerColor } from '../../Sticker'

/**
 * デプロイナウ（hosting-deploy-now/frontend）のドメイン設定を、ホスティング管理画面の中に写したもの。
 * 元: features/Project/features/ProjectDomains（index.tsx / model.ts と
 * components/DomainAddDialog・DomainDeleteDialog・KebabMenu・MigrationSteps・VerificationMethodTabs）。
 * 実物はプロジェクト詳細（features/Project/index.tsx）の「ドメイン」タブ。枠は DeployNowShell と
 * ProjectDetailLayout（パンくず・ProjectHero・タブ。値は Deploys と同じ portfolio）。
 * DNS 検証（customDomainDNSVerification）は release 済みとして、検証方法のタブを出している。
 */

const meta = {
  title: 'Templates/DeployNow/Domains',
  // テンプレートはロリポップのトンマナを確かめる場所なので、フレーバーを lolipop に固定する
  globals: { flavor: 'lolipop' },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── GAP の回避策（inline style はここに集める） ───

// 面の余白は Paper の padding で付ける（GAP-1 は解消）。ドメインのカード（実物は px-6 py-4）は既定の l、
// 中に置く DNS レコードのコピー欄（実物は px-3 py-2）は m。
// GAP-NEW: 行ごとに余白をとる部品が無い。カードの行と詳細欄は面の余白の内側に並ぶので、区切り線が面の端まで届かない。

// ─── データ（実物の DomainView と同じ形。値はダミー） ───

const ZONE = 'lolipop-now.app'

type DomainStatus = '有効' | '未設定' | '証明書発行中' | '検証中' | '削除中' | 'エラー'
type VerificationMethod = 'http' | 'dns'
type Purpose = 'verification' | 'cert_validation' | 'serving'
type DnsRecord = { type: string; name: string; value: string; purpose: Purpose }

type Domain = {
  id: string
  hostname: string
  kind: 'default' | 'custom'
  status: DomainStatus
  verificationMethod: VerificationMethod
  /** 配信レコードがデプロイナウを向いたのを backend が確かめた */
  isServingConfirmed: boolean
  dnsRecords: DnsRecord[]
}

// 内部の状態と表示ラベルは分ける（実物は Figma 準拠で「DNS未設定」「設定エラー」と具体化している）
const STATUS: Record<DomainStatus, { label: string; color: StickerColor }> = {
  有効: { label: '有効', color: 'positive' },
  未設定: { label: 'DNS未設定', color: 'notice' },
  証明書発行中: { label: '証明書発行中', color: 'neutral' },
  検証中: { label: '検証中', color: 'neutral' },
  削除中: { label: '削除中', color: 'neutral' },
  エラー: { label: '設定エラー', color: 'negative' },
}

const IN_PROGRESS: DomainStatus[] = ['証明書発行中', '検証中', '削除中']
const VERIFIABLE: DomainStatus[] = ['未設定', 'エラー', '証明書発行中']

const ADD_RECORDS_MESSAGE = 'DNS に次のレコードを追加し、「検証」を押してください。'

const httpRecords = (host: string): DnsRecord[] => [
  { type: 'A', name: host, value: '203.0.113.10', purpose: 'serving' },
  {
    type: 'TXT',
    name: `_lolipop-now.${host}`,
    value: 'lolipop-now-verify=3f9c2a71',
    purpose: 'verification',
  },
]

// dns 方式は 所有確認 → 証明書 → 配信 の順に並べる（実物の orderRecordsForDNSMethod）
const dnsRecords = (host: string): DnsRecord[] => [
  {
    type: 'TXT',
    name: `_lolipop-now.${host}`,
    value: 'lolipop-now-verify=8b1d4e02',
    purpose: 'verification',
  },
  {
    type: 'CNAME',
    name: `_c3e2d7a1b9f04e6a.${host}`,
    value: '_5f1e9a0b7c2d.mhbtsbpdnt.acm-validations.aws.',
    purpose: 'cert_validation',
  },
  { type: 'CNAME', name: host, value: `edge.${ZONE}`, purpose: 'serving' },
]

const defaultDomain: Domain = {
  id: 'dm0',
  hostname: `portfolio.${ZONE}`,
  kind: 'default',
  status: '有効',
  verificationMethod: 'http',
  isServingConfirmed: true,
  dnsRecords: [],
}

const custom = (
  id: string,
  hostname: string,
  status: DomainStatus,
  verificationMethod: VerificationMethod,
  opts: { isServingConfirmed?: boolean } = {}
): Domain => ({
  id,
  hostname,
  kind: 'custom',
  status,
  verificationMethod,
  isServingConfirmed: opts.isServingConfirmed ?? false,
  dnsRecords: verificationMethod === 'dns' ? dnsRecords(hostname) : httpRecords(hostname),
})

// ─── 表示の導出（実物の model.ts / index.tsx と同じ分岐） ───

const hasCertificateRecord = (d: Domain) =>
  d.dnsRecords.some((r) => r.purpose === 'cert_validation')

const recordsToShow = (d: Domain): DnsRecord[] => {
  if (d.verificationMethod !== 'dns') return VERIFIABLE.includes(d.status) ? d.dnsRecords : []
  switch (d.status) {
    case '未設定':
    case '証明書発行中':
      return hasCertificateRecord(d) ? d.dnsRecords.filter((r) => r.purpose !== 'serving') : []
    case '検証中':
      return d.dnsRecords.filter((r) => r.purpose === 'serving')
    case '有効':
      return d.isServingConfirmed ? [] : d.dnsRecords.filter((r) => r.purpose === 'serving')
    default:
      return []
  }
}

const isPreparing = (d: Domain) =>
  d.verificationMethod === 'dns' && d.status === '未設定' && !hasCertificateRecord(d)

const detailMessage = (d: Domain): string | null => {
  if (d.verificationMethod !== 'dns') {
    return VERIFIABLE.includes(d.status) && d.dnsRecords.length > 0 ? ADD_RECORDS_MESSAGE : null
  }
  switch (d.status) {
    case '有効':
      return d.isServingConfirmed
        ? '公開先の切り替えを確認しました。'
        : 'DNS の次のレコードを切り替えると、このドメインで公開されます。'
    case '検証中':
      return '有効になったら、DNS の次のレコードを切り替えてください。'
    case '証明書発行中':
      return '証明書を発行しています。通常は数分、最大 30 分ほどかかります。'
    case '未設定':
      return hasCertificateRecord(d) ? ADD_RECORDS_MESSAGE : '追加するレコードを準備しています。'
    default:
      return null
  }
}

type MigrationStep = { current: 1 | 2 | 'done'; isWaiting: boolean }

const migrationStep = (d: Domain): MigrationStep | null => {
  if (d.verificationMethod !== 'dns') return null
  switch (d.status) {
    case '未設定':
      return { current: 1, isWaiting: false }
    case '証明書発行中':
      return { current: 1, isWaiting: true }
    case '検証中':
      return { current: 2, isWaiting: false }
    case '有効':
      return d.isServingConfirmed
        ? { current: 'done', isWaiting: false }
        : { current: 2, isWaiting: true }
    default:
      return null
  }
}

const isAwaitingServingSwitch = (d: Domain) =>
  d.kind === 'custom' &&
  d.verificationMethod === 'dns' &&
  d.status === '有効' &&
  !d.isServingConfirmed

const canChangeMethod = (d: Domain) =>
  d.kind === 'custom' && (d.status === '未設定' || d.status === 'エラー')

// ─── 部品 ───

const PromoBanner = () => (
  <Callout
    color="neutral"
    appearance="flat"
    action={
      // 実物は素の a で Button を包み、中の span（inline-flex items-center gap-1）に文言とアイコンを並べている
      <a href="https://muumuu-domain.com/" target="_blank" rel="noopener noreferrer">
        <Button appearance="outlined" size="s">
          <Stack flexDirection="row" gap="xxs" alignItems="center">
            ドメインを取得
            <Icon name="launch" size="s" />
          </Stack>
        </Button>
      </a>
    }
  >
    <Stack gap="xxs">
      <Typography size="s" fontWeight="bold">
        Webアプリケーションに自分だけのドメインを設定しませんか？
      </Typography>
      <Typography size="xs" color="medium_emphasis">
        ムームードメインは、ロリポップ！を運営するGMOペパボの独自ドメイン取得サービスです。
        <br />
        620種類以上のドメインの中からお選びいただけます。
      </Typography>
    </Stack>
  </Callout>
)

const STEP_LABELS = ['レコードを追加', '公開先を切り替え'] as const

// GAP-2: Stepper が無い。実物の MigrationSteps は ol + 丸の番号（size-5 の border、今の段は border-2 border-neutral-900）
// + 横線のコネクタ（h-px w-5 bg-neutral-300）を手組みしている。丸の枠と横線は出せないので、番号とチェックだけを置く。
// parts の StepIndicator は「発行待ち（スピナー）」の段を持てないので、ここでローカルに組む。
// GAP-NEW: Stack に role / component が渡せず、実物の ol / li と aria-current="step" を再現できない。
// GAP-NEW: Stack に折り返し（flex-wrap）と縦横別の gap が無い。実物は gap-x-3 gap-y-1 で折り返す。
const MigrationSteps = ({ step }: { step: MigrationStep }) => (
  <Stack flexDirection="row" gap="s" alignItems="center">
    {STEP_LABELS.map((label, index) => {
      const n = index + 1
      const state =
        step.current === 'done' || n < step.current
          ? 'done'
          : n > step.current
            ? 'todo'
            : step.isWaiting
              ? 'busy'
              : 'active'
      const current = state === 'active' || state === 'busy'
      return (
        <Stack key={label} flexDirection="row" gap="xs" alignItems="center">
          {/* GAP-2: 段をつなぐ横のコネクタが無いため縦罫を流用している */}
          {index > 0 && <Divider orientation="vertical" flexItem />}
          {/* 実物の発行待ちは size-5（20px）の自前スピナー */}
          {state === 'busy' ? (
            <Loader size="s" />
          ) : state === 'done' ? (
            <Typography component="span" color="positive">
              <Icon name="check" size="s" color="currentColor" />
            </Typography>
          ) : (
            <Typography
              component="span"
              size="xs"
              fontWeight="bold"
              color={state === 'active' ? 'high_emphasis' : 'low_emphasis'}
            >
              {n}
            </Typography>
          )}
          <Typography
            component="span"
            size="xs"
            fontWeight={current ? 'bold' : 'normal'}
            color={
              state === 'todo'
                ? 'low_emphasis'
                : state === 'done'
                  ? 'medium_emphasis'
                  : 'high_emphasis'
            }
          >
            {label}
          </Typography>
        </Stack>
      )
    })}
  </Stack>
)

// GAP-NEW: 押すとコピーされる値の欄（CopyableField）が無い。実物は native button の中に
// ラベルと値を置き、押すと緑の枠で「✓ コピーしました」に 2 秒切り替える。
// ここは値の欄とコピーボタンを分けて代える。長い値の truncate（省略表示）も wip-ui に無い。
// GAP-NEW: Paper の padding は上下左右で同じ値しか取れない。実物は px-3 py-2 なので左右に合わせて s（12px）。
// 実物の枠は border-neutral-200 の角丸 rounded（4px）で、コピー後は border-emerald-300 bg-emerald-50 に変わる。
const CopyableField = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false)
  return (
    <Paper padding="s" elevation={0} outlined>
      <Stack gap="xxs">
        <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
          <Typography size="xs" color="medium_emphasis">
            {label}
          </Typography>
          <Button
            appearance="transparent"
            color="neutral"
            size="s"
            iconOnly
            aria-label={`${label}をコピー`}
            onPress={() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
          >
            <Icon name="copy" size="s" />
          </Button>
        </Stack>
        {copied ? (
          <Stack flexDirection="row" gap="xxs" alignItems="center">
            <Typography component="span" size="s" color="positive">
              <Icon name="check" size="s" color="currentColor" aria-hidden />
            </Typography>
            <Typography component="span" size="s" color="positive">
              コピーしました
            </Typography>
          </Stack>
        ) : (
          <Typography component="span" size="s">
            {value}
          </Typography>
        )}
      </Stack>
    </Paper>
  )
}

// GAP-NEW: 実物は sm（640px）以上で横並びにし、タイプの欄を w-28（112px）に固定、名前と値を flex-1 で分ける。
// 固定幅の列が作れないので Grid の 2 / 5 / 5 で代える（Grid の s は 600px から）。
const RecordRow = ({ record }: { record: DnsRecord }) => (
  <Grid spacing="xs">
    <GridItem size={{ xxs: 12, s: 2 }}>
      <CopyableField label="タイプ" value={record.type} />
    </GridItem>
    <GridItem size={{ xxs: 12, s: 5 }}>
      <CopyableField label="名前" value={record.name} />
    </GridItem>
    <GridItem size={{ xxs: 12, s: 5 }}>
      <CopyableField label="値" value={record.value} />
    </GridItem>
  </Grid>
)

const METHOD_TABS: { key: VerificationMethod; label: string; description: string }[] = [
  { key: 'http', label: 'HTTP 検証', description: '新しく公開するドメイン' },
  { key: 'dns', label: 'DNS 検証', description: '公開中のサイトを止めずに移行する' },
]

// GAP-NEW: Button の isPending に見た目が無い（押せなくなるだけ）。実物の wip-ui も同じなので、
// 処理中が分かるよう leading に Loader を入れている。

/** タブの下に出る、段階・文言・レコード・「検証」。 */
const DomainProgress = ({ domain }: { domain: Domain }) => {
  const records = recordsToShow(domain)
  const step = migrationStep(domain)
  const message = detailMessage(domain)
  const preparing = isPreparing(domain)
  const canVerify =
    domain.kind === 'custom' &&
    (VERIFIABLE.includes(domain.status) || isAwaitingServingSwitch(domain))
  // 証明書を発行できなかった dns 方式はレコードを置き直しても進めないので、手動検証を出さない
  const showVerify =
    canVerify && !(domain.verificationMethod === 'dns' && domain.status === 'エラー')
  // 段階の下は mb-2、レコードの上は mt-2、レコードどうしは space-y-2、「検証」の上は mt-3
  return (
    <Stack gap="s">
      <Stack gap="xs">
        {step && <MigrationSteps step={step} />}
        {message && (
          <Stack flexDirection="row" gap="xs" alignItems="center">
            {/* 実物は size-3.5（14px）の自前スピナー */}
            {preparing && <Loader size="s" />}
            <Typography size="s" color={preparing ? 'medium_emphasis' : 'high_emphasis'}>
              {message}
            </Typography>
          </Stack>
        )}
        {records.length > 0 && (
          <Stack gap="xs">
            {records.map((r) => (
              <RecordRow key={`${r.type}-${r.name}-${r.value}`} record={r} />
            ))}
          </Stack>
        )}
      </Stack>
      {showVerify && (
        <Stack alignItems="flex-end">
          <Button appearance="outlined" size="s" isDisabled={preparing}>
            検証
          </Button>
        </Stack>
      )}
    </Stack>
  )
}

/** 実物の DomainErrorCallout。設定エラーのときだけ、詳細欄の先頭（mb-3）に出す。 */
const DomainErrorCallout = ({
  domain,
  onSwitchToHttp,
}: {
  domain: Domain
  onSwitchToHttp?: () => void
}) => {
  if (domain.status !== 'エラー') return null
  if (domain.verificationMethod !== 'dns') {
    return (
      <Callout color="negative" appearance="outline">
        レコードが確認できませんでした。設定を見直してから、もう一度「検証」を押してください。
      </Callout>
    )
  }
  if (!onSwitchToHttp) {
    return (
      <Callout color="negative" appearance="outline">
        証明書を発行できませんでした。ドメインを削除して追加し直してください。
      </Callout>
    )
  }
  return (
    <Callout
      color="negative"
      appearance="outline"
      action={
        <Button appearance="outlined" color="negative" size="s" onPress={onSwitchToHttp}>
          HTTP 検証に切り替える
        </Button>
      }
    >
      証明書を発行できませんでした。HTTP
      検証に切り替えるか、ドメインを削除して追加し直してください。
    </Callout>
  )
}

const DomainCard = ({
  domain,
  onChangeMethod,
  onDelete,
}: {
  domain: Domain
  onChangeMethod: (m: VerificationMethod) => void
  onDelete: () => void
}) => {
  const st = STATUS[domain.status]
  const showMethodTabs = canChangeMethod(domain)
  const hasDetail =
    recordsToShow(domain).length > 0 || detailMessage(domain) !== null || showMethodTabs
  const progress = <DomainProgress domain={domain} />
  return (
    <Paper outlined>
      {/* 行と詳細欄の上下は実物の py-4（16px） */}
      <Stack gap="m">
        <Stack flexDirection="row" gap="s" alignItems="center" justifyContent="space-between">
          {/* GAP-NEW: 長いホスト名の truncate（省略表示）が無い */}
          <Typography component="span" size="s">
            {domain.hostname}
          </Typography>
          <Stack flexDirection="row" gap="xs" alignItems="center">
            {/* 実物は size-3.5（14px）の自前スピナー */}
            {IN_PROGRESS.includes(domain.status) && <Loader size="s" />}
            <Sticker color={st.color} size="s">
              {st.label}
            </Sticker>
            {domain.kind === 'custom' && domain.status !== '削除中' && (
              <MenuTrigger>
                <Button
                  appearance="transparent"
                  color="neutral"
                  size="s"
                  iconOnly
                  aria-label={`${domain.hostname} の操作`}
                >
                  <Icon name="ellipsis_horizontal" size="s" />
                </Button>
                <Menu placement="bottom end">
                  <MenuItem color="negative" onAction={onDelete}>
                    削除
                  </MenuItem>
                </Menu>
              </MenuTrigger>
            )}
          </Stack>
        </Stack>
        {hasDetail && (
          <>
            <Divider />
            {/* GAP-NEW: Paper に地色の違う面が無い。実物の詳細欄は bg-neutral-50 */}
            <Stack gap="s">
              {domain.status === 'エラー' && (
                <DomainErrorCallout
                  domain={domain}
                  onSwitchToHttp={showMethodTabs ? () => onChangeMethod('http') : undefined}
                />
              )}
              {showMethodTabs ? (
                // 実物は wip-ui の Tabs を使わず role="tablist" の native button で手組みしている
                // （TabPanel が export されていない・下線色と文字サイズを変えられないため）。
                // GAP-NEW: Tab の文字の大きさを変えられない。実物のタブ名は text-sm、選択中は font-bold
                // text-neutral-900、それ以外は text-neutral-500。タブどうしの間は gap-6
                <Tabs
                  selectedKey={domain.verificationMethod}
                  onSelectionChange={(k) => onChangeMethod(k as VerificationMethod)}
                >
                  {/* タブと本文の間は実物の mb-3（12px） */}
                  <Stack gap="s">
                    <TabList aria-label="検証方法">
                      {METHOD_TABS.map((t) => (
                        <Tab key={t.key} id={t.key}>
                          <Stack flexDirection="row" gap="xs" alignItems="center">
                            <span>{t.label}</span>
                            <Typography
                              component="span"
                              size="xs"
                              color={
                                t.key === domain.verificationMethod
                                  ? 'medium_emphasis'
                                  : 'low_emphasis'
                              }
                            >
                              {t.description}
                            </Typography>
                          </Stack>
                        </Tab>
                      ))}
                    </TabList>
                    {/* GAP-10: TabPanel は react-aria-components から直接 import している */}
                    {METHOD_TABS.map((t) => (
                      <TabPanel key={t.key} id={t.key}>
                        {progress}
                      </TabPanel>
                    ))}
                  </Stack>
                </Tabs>
              ) : (
                progress
              )}
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  )
}

const DomainAddDialog = ({ onClose }: { onClose: () => void }) => {
  const [value, setValue] = useState('')
  return (
    <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
      {/* GAP-NEW: Dialog に幅の指定が無い。実物は中身を w-[472px]（= 外寸 520px）に固定している */}
      <DialogHeader>
        <DialogTitle>ドメインを追加</DialogTitle>
      </DialogHeader>
      <Stack gap="l">
        <Stack gap="xxs">
          <TextField
            label="ドメイン"
            placeholder="example.com"
            size="s"
            width="full"
            autoComplete="off"
            spellCheck="false"
            value={value}
            onChange={setValue}
          />
          <Typography size="s" color="medium_emphasis">
            ※追加後に表示される DNS レコードを設定すると、ドメインが有効になります。
          </Typography>
        </Stack>
      </Stack>
      <DialogFooter>
        <Button appearance="outlined" color="neutral" size="s" onPress={onClose}>
          キャンセル
        </Button>
        <Button
          appearance="flat"
          color="neutral"
          size="s"
          isDisabled={value.trim() === ''}
          onPress={onClose}
        >
          追加
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

const DomainDeleteDialog = ({ hostname, onClose }: { hostname: string; onClose: () => void }) => (
  <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
    {/* GAP-NEW: Dialog に幅の指定が無い。実物は w-[360px] に固定している */}
    <DialogHeader>
      <DialogTitle>
        <span aria-hidden>⚠️ </span>
        {`${hostname} を削除しますか？`}
      </DialogTitle>
    </DialogHeader>
    {/* 実物は失敗の Callout と説明を Stack gap="m" で積む */}
    <Stack gap="m">
      <DialogDescription>
        このドメインを削除すると、アプリケーションへ接続できなくなります。
      </DialogDescription>
    </Stack>
    <DialogFooter>
      <Button appearance="outlined" color="neutral" size="m" onPress={onClose}>
        キャンセル
      </Button>
      <Button appearance="flat" color="negative" size="m" onPress={onClose}>
        削除
      </Button>
    </DialogFooter>
  </Dialog>
)

// ─── 画面 ───

type DialogState = { kind: 'none' } | { kind: 'add' } | { kind: 'delete'; domain: Domain }

const DomainsScreen = ({
  initialDomains,
  initialDialog = { kind: 'none' },
}: {
  initialDomains: Domain[]
  initialDialog?: DialogState
}) => {
  const [domains, setDomains] = useState(initialDomains)
  const [dialog, setDialog] = useState<DialogState>(initialDialog)
  const update = (id: string, patch: Partial<Domain>) =>
    setDomains((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)))
  const hasCustom = domains.some((d) => d.kind === 'custom')
  // 実物は有効以外（＝対応が要るもの）を先に並べる
  const ordered = [
    ...domains.filter((d) => d.status !== '有効'),
    ...domains.filter((d) => d.status === '有効'),
  ]

  return (
    <DeployNowShell>
      <ProjectDetailLayout activeTab="domains">
        <Stack gap="m">
          <Stack alignItems="flex-end">
            <Button
              appearance="flat"
              color="neutral"
              size="s"
              onPress={() => setDialog({ kind: 'add' })}
            >
              ドメインを追加
            </Button>
          </Stack>
          {!hasCustom && <PromoBanner />}
          <Stack gap="m">
            {ordered.map((d) => (
              <DomainCard
                key={d.id}
                domain={d}
                onChangeMethod={(m) => {
                  if (m === d.verificationMethod) return
                  update(d.id, {
                    verificationMethod: m,
                    status: '未設定',
                    dnsRecords: m === 'dns' ? dnsRecords(d.hostname) : httpRecords(d.hostname),
                  })
                }}
                onDelete={() => setDialog({ kind: 'delete', domain: d })}
              />
            ))}
          </Stack>
        </Stack>
      </ProjectDetailLayout>

      {dialog.kind === 'add' && <DomainAddDialog onClose={() => setDialog({ kind: 'none' })} />}
      {dialog.kind === 'delete' && (
        <DomainDeleteDialog
          hostname={dialog.domain.hostname}
          onClose={() => setDialog({ kind: 'none' })}
        />
      )}
    </DeployNowShell>
  )
}

// 実物の features/Project/index.tsx がプロジェクトを取得している間と、取得に失敗したとき。
// タブ（ドメイン）より上で止まるので、パンくずも出ない。
// GAP-NEW: 余白をとる部品が無い。実物の読み込み中は py-16、失敗は px-6 py-16 の中央寄せ。
//        Stack の gap は要素の間にしか付かず、Paper は白い面になるので付けられない。

const ProjectLoadingAndError = () => (
  <Stack gap="xxl">
    <DeployNowShell>
      <Stack alignItems="center">
        <Loader size="m" message="読み込み中" />
      </Stack>
    </DeployNowShell>
    <DeployNowShell>
      <Stack alignItems="center">
        <Typography size="s" color="low_emphasis">
          プロジェクトの取得に失敗しました。時間をおいて再度お試しください。
        </Typography>
      </Stack>
    </DeployNowShell>
    <DeployNowShell>
      <Stack alignItems="center">
        <Typography size="s" color="low_emphasis">
          プロジェクトが見つかりません。
        </Typography>
      </Stack>
    </DeployNowShell>
  </Stack>
)

// ─── ストーリー ───

/**
 * 独自ドメインを追加した直後。HTTP 検証のタブが開き、DNS に追加するレコード（タイプ・名前・値）と
 * 「検証」が出る。値の欄はそれぞれコピーできる。デフォルトのドメインは対応不要なので下に並ぶ。
 *
 * @summary 独自ドメインの DNS 設定待ち
 */
export const Default: Story = {
  render: () => (
    <DomainsScreen
      initialDomains={[custom('dm1', 'example.com', '未設定', 'http'), defaultDomain]}
    />
  ),
}

/**
 * 独自ドメインがまだ無いとき。デフォルトのドメインだけが並び、ムームードメインでの取得を案内する。
 * 独自ドメインを 1 つでも追加すると案内は消える。
 *
 * @summary 独自ドメインが無いとき
 */
export const NoCustomDomain: Story = {
  render: () => <DomainsScreen initialDomains={[defaultDomain]} />,
}

/**
 * 公開中のサイトを止めずに移行する DNS 検証。
 * 「レコードを追加」→「公開先を切り替え」の 2 段階を番号で示し、今置くべきレコードだけを出す。
 *
 * @summary DNS 検証で移行する途中
 */
export const DnsMigration: Story = {
  render: () => (
    <DomainsScreen initialDomains={[custom('b', 'example.com', '未設定', 'dns'), defaultDomain]} />
  ),
}

/**
 * 「ドメインを追加」のダイアログ。検証方法はここでは選ばせず、追加後のカードで切り替える。
 * 入力が空のあいだは「追加」を押せない。
 *
 * @summary ドメインを追加
 */
export const AddDialog: Story = {
  render: () => <DomainsScreen initialDomains={[defaultDomain]} initialDialog={{ kind: 'add' }} />,
}

const deleteTarget = custom('dm1', 'example.com', '有効', 'http', { isServingConfirmed: true })

/**
 * 独自ドメインの ⋯ から開く削除の確認。
 *
 * @summary ドメインの削除
 */
export const DeleteDialog: Story = {
  render: () => (
    <DomainsScreen
      initialDomains={[deleteTarget, defaultDomain]}
      initialDialog={{ kind: 'delete', domain: deleteTarget }}
    />
  ),
}

/**
 * プロジェクトの読み込み中、取得に失敗したとき、見つからないとき。実物はプロジェクト詳細の
 * 全体がこの表示になり、ドメインのタブまで届かない。
 *
 * @summary 読み込み中・取得失敗
 */
export const LoadingAndError: Story = {
  render: () => <ProjectLoadingAndError />,
}
