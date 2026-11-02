import { useState } from 'react'
import { TabPanel } from 'react-aria-components'

import { Breadcrumb, Breadcrumbs } from '../../Breadcrumbs'
import { Button, LinkButton } from '../../Button'
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
import { AppShell } from './AppShell'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { StickerColor } from '../../Sticker'

/**
 * デプロイナウ（hosting-deploy-now/frontend）のドメイン設定を、ホスティング管理画面の中に写したもの。
 * 元: features/Project/features/ProjectDomains（index.tsx / model.ts と
 * components/DomainAddDialog・DomainDeleteDialog・KebabMenu・MigrationSteps・VerificationMethodTabs）。
 * 実物はプロジェクト詳細（features/Project/index.tsx）の「ドメイン」タブ。ここではタブを AppShell のサイドナビに置き換え、
 * タブより上はパンくずだけを写している（ProjectHero は Deploys で写している）。
 * DNS 検証（customDomainDNSVerification）は release 済みとして、検証方法のタブを出している。
 */

const meta = {
  title: 'Templates/Domains',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── GAP の回避策（inline style はここに集める） ───

// GAP-1: Paper に padding が無い。ドメインのカードの行と詳細欄（実物は px-6 py-4）、
//        DNS レコードのコピー欄（実物は px-3 py-2）の余白。inline style を当てない方針のため未対応。
// GAP-NEW: TabPanel と本文のあいだの間隔（実物は mb-3 = 12px）を付ける prop が無く、
//          タブの下線に本文が接する。inline style を当てない方針のため未対応。

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
      <LinkButton
        href="https://muumuu-domain.com/"
        target="_blank"
        rel="noopener noreferrer"
        appearance="outlined"
        size="s"
        trailing={<Icon name="launch" size="s" />}
      >
        ドメインを取得
      </LinkButton>
    }
  >
    <Stack gap="xxs">
      <Typography component="div" size="s" fontWeight="bold">
        Webアプリケーションに自分だけのドメインを設定しませんか？
      </Typography>
      <Typography component="div" size="xs" color="medium_emphasis">
        ムームードメインは、ロリポップ！を運営するGMOペパボの独自ドメイン取得サービスです。
        <br />
        620種類以上のドメインの中からお選びいただけます。
      </Typography>
    </Stack>
  </Callout>
)

const STEP_LABELS = ['レコードを追加', '公開先を切り替え'] as const

// GAP-2: Stepper が無い。実物の MigrationSteps は ol + 丸の番号（border）+ 横線のコネクタを手組みしている。
// parts の StepIndicator は「発行待ち（スピナー）」の段を持てないので、ここでローカルに組む。
// GAP-NEW: Stack に role / component が渡せず、実物の ol / li と aria-current="step" を再現できない。
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
          {state === 'busy' ? (
            <Loader size="s" />
          ) : (
            <Sticker color={state === 'done' ? 'positive' : 'neutral'} size="s">
              {state === 'done' ? <Icon name="check" size="s" /> : n}
            </Sticker>
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
const CopyableField = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false)
  return (
    <Paper elevation={0} outlined>
      <Stack gap="xxs">
        <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
          <Typography component="span" size="xs" color="medium_emphasis">
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
  return (
    <Stack gap="xs">
      {step && <MigrationSteps step={step} />}
      {message && (
        <Stack flexDirection="row" gap="xs" alignItems="center">
          {preparing && <Loader size="s" />}
          <Typography
            component="div"
            size="s"
            color={preparing ? 'medium_emphasis' : 'high_emphasis'}
          >
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
    <Paper elevation={0} outlined>
      <Stack flexDirection="row" gap="s" alignItems="center" justifyContent="space-between">
        <Typography component="span" size="s">
          {domain.hostname}
        </Typography>
        <Stack flexDirection="row" gap="xs" alignItems="center">
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
                <Icon name="ellipsis_horizontal" size="s" aria-hidden="true" />
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
            {showMethodTabs ? (
              // 実物は wip-ui の Tabs を使わず role="tablist" の native button で手組みしている
              // （TabPanel が export されていない・下線色と文字サイズを変えられないため）
              <Tabs
                selectedKey={domain.verificationMethod}
                onSelectionChange={(k) => onChangeMethod(k as VerificationMethod)}
              >
                <TabList aria-label="検証方法">
                  {METHOD_TABS.map((t) => (
                    <Tab key={t.key} id={t.key}>
                      <Stack flexDirection="row" gap="xs" alignItems="center">
                        <span>{t.label}</span>
                        <Typography component="span" size="xs" color="medium_emphasis">
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
              </Tabs>
            ) : (
              progress
            )}
          </Stack>
        </>
      )}
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
          <Typography component="div" size="s" color="medium_emphasis">
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
    <DialogDescription>
      このドメインを削除すると、アプリケーションへ接続できなくなります。
    </DialogDescription>
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

// 実物はプロジェクト詳細（features/Project/index.tsx）の「ドメイン」タブ。
// 見出しはパンくずとプロジェクト名（ProjectHero）だけで、ドメインのページ見出しは無い。
// ProjectHero はデプロイの画面（Deploys）で写しているので、ここではパンくずだけを置く。
const ProjectBreadcrumbs = () => (
  <Breadcrumbs>
    <Breadcrumb href="#">プロジェクト</Breadcrumb>
    <Breadcrumb>portfolio</Breadcrumb>
  </Breadcrumbs>
)

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
    <AppShell active="domains">
      <Stack gap="l">
        <ProjectBreadcrumbs />
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
      </Stack>

      {dialog.kind === 'add' && <DomainAddDialog onClose={() => setDialog({ kind: 'none' })} />}
      {dialog.kind === 'delete' && (
        <DomainDeleteDialog
          hostname={dialog.domain.hostname}
          onClose={() => setDialog({ kind: 'none' })}
        />
      )}
    </AppShell>
  )
}

// 実物の features/Project/index.tsx がプロジェクトを取得している間と、取得に失敗したとき。
// タブ（ドメイン）より上で止まるので、パンくずも出ない。
// GAP-1: 余白をとる部品が無い。実物の読み込み中は py-16、失敗は px-6 py-16 の中央寄せ。
//        inline style を当てない方針のため未対応。

const ProjectLoadingAndError = () => (
  <Stack gap="xxl">
    <AppShell active="domains">
      <Stack alignItems="center">
        <Loader size="m" message="読み込み中" />
      </Stack>
    </AppShell>
    <AppShell active="domains">
      <Stack alignItems="center">
        <Typography component="div" size="s" color="low_emphasis">
          プロジェクトの取得に失敗しました。時間をおいて再度お試しください。
        </Typography>
      </Stack>
    </AppShell>
    <AppShell active="domains">
      <Stack alignItems="center">
        <Typography component="div" size="s" color="low_emphasis">
          プロジェクトが見つかりません。
        </Typography>
      </Stack>
    </AppShell>
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
