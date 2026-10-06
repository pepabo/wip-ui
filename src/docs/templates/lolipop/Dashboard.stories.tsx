import { useState } from 'react'

import { AppBar, AppBarLeading, AppBarTrailing } from '../../../AppBar'
import { Breadcrumb, Breadcrumbs } from '../../../Breadcrumbs'
import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Container } from '../../../Container'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../Dialog'
import { Divider } from '../../../Divider'
import { Grid, GridItem } from '../../../Grid'
import { Icon } from '../../../Icon'
import { Paper } from '../../../Paper'
import { Select, SelectItem } from '../../../Select'
import { SnackBar, SnackBarQueue } from '../../../SnackBar'
import { Stack } from '../../../Stack'
import { TextField } from '../../../TextField'
import { Typography } from '../../../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

/**
 * ロリポップ！の共通ダッシュボード（lolipop-user の apps/dashboard）の再現。
 * ログイン後の着地がこの画面に変わった。文言は HomeScreen / AccountScreen の実装から取っている。
 */

const meta = {
  title: 'Templates/Lolipop/Dashboard',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const queue = new SnackBarQueue()

// GAP-1 の回避策（Paper に padding が無い）
const insetStyle = { padding: 24 }
const Card = ({ children, outlined = false }: { children: ReactNode; outlined?: boolean }) => (
  <Paper elevation={outlined ? 0 : 1} outlined={outlined}>
    <div style={insetStyle}>{children}</div>
  </Paper>
)

// ─── データ ───

const usingServices = [{ name: 'ロリポップ！レンタルサーバー' }, { name: 'デプロイナウ' }]

const availableServices = [
  { name: 'デプロイナウ', description: '作ったWEBアプリをコマンドひとつで公開', using: true },
  { name: 'AIホームページ', description: 'AIと会話するだけで簡単にWebサイト作成', using: false },
  { name: 'AIエージェントクラウド', description: '1クリックでOpenClawが起動', using: false },
  { name: 'AIゲートウェイ', description: '複数のAIモデルをひとつのAPIから', using: false },
]

const prefectures = ['選択してください', '北海道', '東京都', '神奈川県', '大阪府', '福岡県']

type Profile = {
  name: string
  kana: string
  tel: string
  postal: string
  pref: string
  address: string
}

const initialProfile: Profile = {
  name: '山田 太郎',
  kana: 'ヤマダ タロウ',
  tel: '09012345678',
  postal: '1500001',
  pref: '東京都',
  address: '渋谷区神宮前 1-2-3 Example ビル 4F',
}

// ─── 共通の枠 ───

type Route = 'home' | 'account'

const DashboardLayout = ({
  route,
  onNavigate,
  children,
}: {
  route: Route
  onNavigate: (r: Route) => void
  children: ReactNode
}) => (
  <Stack gap="l">
    <AppBar appearance="white" position="relative">
      <AppBarLeading>
        <Button
          appearance="transparent"
          aria-label="ロリポップ！"
          onPress={() => onNavigate('home')}
        >
          <Stack flexDirection="row" gap="s" alignItems="center">
            <Icon name="pepapon" size="m" />
            <Typography size="l" fontWeight="bold" component="span">
              ロリポップ！
            </Typography>
          </Stack>
        </Button>
      </AppBarLeading>
      <AppBarTrailing>
        {/* GAP-9: Menu が無いため、アカウントメニューをボタン 2 つに開いている（実装はポップオーバー） */}
        <Stack flexDirection="row" gap="xs" alignItems="center">
          <Button
            appearance={route === 'account' ? 'flat' : 'transparent'}
            size="s"
            leading={<Icon name="person" size="m" />}
            onPress={() => onNavigate('account')}
          >
            アカウント情報
          </Button>
          <Button appearance="transparent" size="s">
            ログアウト
          </Button>
        </Stack>
      </AppBarTrailing>
    </AppBar>
    <Container size="m" component="main">
      <Stack gap="l">{children}</Stack>
    </Container>
  </Stack>
)

// ─── ホーム ───

const HomeScreen = () => (
  <Stack gap="xl">
    <Typography size="xxl" fontWeight="bold" component="h1">
      ホーム
    </Typography>

    <Stack gap="m">
      <Typography size="l" fontWeight="bold" component="h2">
        利用中のサービス
      </Typography>
      {usingServices.length === 0 ? (
        <Typography size="s" color="medium_emphasis">
          利用中のサービスはありません。
        </Typography>
      ) : (
        <Stack gap="s">
          {usingServices.map((s) => (
            <Card key={s.name} outlined>
              <Stack flexDirection="row" gap="m" alignItems="center" justifyContent="space-between">
                <Typography fontWeight="bold" component="span">
                  {s.name}
                </Typography>
                <Button appearance="outlined" size="s" trailing={<Icon name="launch" size="s" />}>
                  サービスページへ
                </Button>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>

    <Stack gap="m">
      <Typography size="l" fontWeight="bold" component="h2">
        ロリポップで利用できるサービス
      </Typography>
      <Grid spacing="m">
        {availableServices.map((s) => (
          <GridItem key={s.name} size={{ xxs: 12, m: 4 }}>
            <Card>
              <Stack gap="s">
                <Icon name="node" size="l" />
                <Typography fontWeight="bold">{s.name}</Typography>
                <Typography size="xs" color="medium_emphasis">
                  {s.description}
                </Typography>
                <Button
                  appearance={s.using ? 'outlined' : 'flat'}
                  color={s.using ? 'neutral' : 'interactive'}
                  width="full"
                  isDisabled={s.using}
                >
                  {s.using ? '利用中' : 'サービスを利用する'}
                </Button>
              </Stack>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </Stack>
  </Stack>
)

// ─── アカウント ───

const Field = ({ term, children }: { term: string; children: ReactNode }) => (
  <Grid spacing="s">
    <GridItem size={{ xxs: 12, s: 4 }}>
      <Typography size="s" color="medium_emphasis" component="span">
        {term}
      </Typography>
    </GridItem>
    <GridItem size={{ xxs: 12, s: 8 }}>{children}</GridItem>
  </Grid>
)

const AccountScreen = ({ onHome }: { onHome: () => void }) => {
  const [profile, setProfile] = useState(initialProfile)
  const [draft, setDraft] = useState(initialProfile)
  const [editing, setEditing] = useState(false)

  const save = () => {
    setProfile(draft)
    setEditing(false)
    queue.add({ message: 'お客様情報を更新しました。' })
  }

  return (
    <Stack gap="l">
      <Breadcrumbs>
        <Breadcrumb href="#" onPress={onHome}>
          ホーム
        </Breadcrumb>
        <Breadcrumb>アカウント</Breadcrumb>
      </Breadcrumbs>
      <Typography size="xxl" fontWeight="bold" component="h1">
        アカウント
      </Typography>

      <Card>
        <Stack gap="m">
          <Typography size="l" fontWeight="bold" component="h2">
            アカウント情報
          </Typography>
          <Field term="ID">
            <Typography component="span">lolipop-0021934</Typography>
          </Field>
          <Divider />
          <Field term="メールアドレス">
            <Typography component="span">you@example.com</Typography>
          </Field>
        </Stack>
      </Card>

      <Card>
        <Stack gap="m">
          <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
            <Typography size="l" fontWeight="bold" component="h2">
              お客様情報
            </Typography>
            {!editing && (
              <Button
                appearance="outlined"
                size="s"
                onPress={() => {
                  setDraft(profile)
                  setEditing(true)
                }}
              >
                編集する
              </Button>
            )}
          </Stack>

          {editing ? (
            <Stack gap="m">
              <TextField
                label="お名前"
                width="full"
                isRequired
                value={draft.name}
                onChange={(v) => setDraft({ ...draft, name: v })}
              />
              <TextField
                label="お名前（カナ）"
                width="full"
                isRequired
                value={draft.kana}
                onChange={(v) => setDraft({ ...draft, kana: v })}
              />
              <TextField
                label="電話番号"
                width="full"
                isRequired
                value={draft.tel}
                onChange={(v) => setDraft({ ...draft, tel: v })}
              />
              <Divider />
              <Typography size="s" fontWeight="bold">
                住所
              </Typography>
              <TextField
                label="郵便番号"
                caption="7桁を入力すると都道府県と市区町村が自動で入ります"
                width="third"
                value={draft.postal}
                onChange={(v) => setDraft({ ...draft, postal: v })}
              />
              <Select
                label="都道府県"
                width="half"
                selectedKey={draft.pref}
                onSelectionChange={(k) => setDraft({ ...draft, pref: String(k) })}
              >
                {prefectures.map((p) => (
                  <SelectItem key={p} id={p}>
                    {p}
                  </SelectItem>
                ))}
              </Select>
              <TextField
                label="市区町村・番地・建物名"
                width="full"
                value={draft.address}
                onChange={(v) => setDraft({ ...draft, address: v })}
              />
              <Callout color="notice">
                保存すると、ご契約中のロリポップ！レンタルサーバーに登録されているお客様情報も同じ内容に更新されます。
              </Callout>
              <Stack flexDirection="row" gap="s" justifyContent="flex-end">
                <Button appearance="outlined" onPress={() => setEditing(false)}>
                  キャンセル
                </Button>
                <Button color="interactive" onPress={save}>
                  保存する
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Stack gap="m">
              <Field term="お名前">
                <Typography component="span">{profile.name}</Typography>
              </Field>
              <Divider />
              <Field term="お名前（カナ）">
                <Typography component="span">{profile.kana}</Typography>
              </Field>
              <Divider />
              <Field term="電話番号">
                <Typography component="span">{profile.tel.replace(/^\+81/, '0')}</Typography>
              </Field>
              <Divider />
              <Field term="住所">
                <Typography component="span">
                  〒{profile.postal.slice(0, 3)}-{profile.postal.slice(3)} {profile.pref}
                  {profile.address}
                </Typography>
              </Field>
            </Stack>
          )}
        </Stack>
      </Card>

      <Card>
        <Stack gap="m">
          <Typography size="l" fontWeight="bold" component="h2">
            アカウント連携
          </Typography>
          <Typography size="s" color="medium_emphasis">
            連携したアカウントでログイン出来るようになります。
          </Typography>
          <Stack flexDirection="row" gap="m" alignItems="center" justifyContent="space-between">
            <Stack flexDirection="row" gap="s" alignItems="center">
              <Icon name="launch" size="m" />
              <Typography component="span">Google</Typography>
            </Stack>
            <Stack flexDirection="row" gap="xs" alignItems="center">
              <Icon name="check_on_circle" size="s" />
              <Typography size="s" color="positive" component="span">
                連携済み
              </Typography>
            </Stack>
          </Stack>
          <Divider variant="inset" />
          <Stack flexDirection="row" gap="m" alignItems="center" justifyContent="space-between">
            <Stack flexDirection="row" gap="s" alignItems="center">
              <Icon name="github" size="m" />
              <Typography component="span">GitHub</Typography>
            </Stack>
            <Button appearance="outlined" size="s">
              連携する
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  )
}

// ─── アプリ本体 ───

const App = ({ showLinkedModal = false }: { showLinkedModal?: boolean }) => {
  const [route, setRoute] = useState<Route>('home')
  const [modalOpen, setModalOpen] = useState(showLinkedModal)
  return (
    <>
      <DashboardLayout route={route} onNavigate={setRoute}>
        {route === 'home' ? <HomeScreen /> : <AccountScreen onHome={() => setRoute('home')} />}
      </DashboardLayout>
      <Dialog isOpen={modalOpen} onOpenChange={setModalOpen}>
        <DialogHeader>
          <DialogTitle>この契約をロリポップIDと連携しました</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          お持ちのロリポップIDに、いまログインしたレンタルサーバーの契約を連携しました。次回からはロリポップIDでログインできます。
        </DialogDescription>
        <Stack gap="xs">
          {[
            'ほかのサービスと、契約者情報とお支払い情報がひとつにまとまります',
            'サービスを切り替えるたびにログインし直す必要がなくなります',
            'これまでどおり、アカウントとパスワードでもログインできます',
          ].map((line) => (
            <Stack key={line} flexDirection="row" gap="xs" alignItems="center">
              <Icon name="check" size="s" />
              <Typography size="s" component="span">
                {line}
              </Typography>
            </Stack>
          ))}
        </Stack>
        <DialogFooter>
          <Button color="interactive" onPress={() => setModalOpen(false)}>
            はじめる
          </Button>
        </DialogFooter>
      </Dialog>
      <SnackBar queue={queue} />
    </>
  )
}

// ─── ストーリー ───

/**
 * ログイン後の着地になった共通ダッシュボード。実際に押して遷移する。
 *
 * - ヘッダーの「アカウント情報」でアカウント画面に入り、パンくずの「ホーム」で戻る
 * - 「編集する」でお客様情報が入力欄に変わり、「保存する」で表示に戻ってスナックバーが出る
 * - 利用中のサービスはボタンが「利用中」で押せない
 *
 * @summary 共通ダッシュボード（操作できる）
 */
export const Default: Story = {
  render: () => <App />,
}

/**
 * ロリポップIDと連携した直後に 1 度だけ出るモーダル。
 *
 * @summary ロリポップID 連携直後
 */
export const LinkedModal: Story = {
  render: () => <App showLinkedModal />,
}
