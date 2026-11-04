import { Button, LinkButton } from '../../Button'
import { Container } from '../../Container'
import { Icon } from '../../Icon'
import { Stack } from '../../Stack'
import { Typography } from '../../Typography'
import chatbotImage from './assets/gamers/chatbot.svg'
import { GamersPublicShell, useGamersNavigate } from './gamersShell'
import { Card } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'

/**
 * ゲーマーズのエラー・メンテナンスの画面（apollo/frontend/src）の再現。
 * - app/(application)/(public)/error/page.tsx: (public) の layout（ロゴだけの GlobalHeader）＋ Container maxWidth='sm' mt 6
 * - components/Maintenance: フラグ gamers_maintenance-mode が ON のとき、layout ごと差し替わる。
 *   ロゴだけの GlobalHeader（GMO のヘッダー無し）＋ Container maxWidth='sm' mt 6 pt 10
 *
 * 実物と違って残っている点:
 * - Paper は実物では高さ 400px で、中身を縦に中央寄せしている
 * - MUI の maxWidth='sm'（600px）を Container の size="s" に、Paper の p 3〜8 / 8 を padding の l〜xxl / xxl に寄せている
 * - MUI の各要素の mt / mb は Stack の gap に寄せている
 * - メンテナンスのイラストは実物では 12em 角
 */

const meta = {
  title: 'Templates/Gamers/SystemPages',
  // テンプレートはロリポップのトンマナを確かめる場所なので、フレーバーを lolipop に固定する
  globals: { flavor: 'lolipop' },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── ストーリー ───

/**
 * ゲーマーズのエラー画面（(public)/error）。お問い合わせ（サポートの問い合わせフォームを別タブで開く）と、
 * ホーム・サービストップへの戻り道を出す。?trace_id があるとき（エラートラッキングコードとコピーボタンが出る）の表示。
 *
 * @summary ゲーマーズのエラー画面
 */
const ErrorPage = () => {
  const navigate = useGamersNavigate()
  const code = '6c9f1a2b3d4e5f60718293a4b5c6d7e8'
  return (
    <Container size="s">
      <Card elevation={0} padding={{ xxs: 'l', s: 'xxl' }}>
        <Stack gap="xxl">
          <Stack gap="l">
            <Typography size="xl" fontWeight="bold" component="h1">
              問題が発生しました
            </Typography>
            <Typography size="m" component="p">
              一時的にアクセスできない状態です <br />{' '}
              お困りの場合はエラートラッキングコードを添えてお問い合せください
            </Typography>
            <Stack
              flexDirection={{ xxs: 'column', s: 'row' }}
              gap="m"
              justifyContent="space-between"
            >
              <Stack gap="xxs">
                <Typography size="m" fontWeight="bold" component="span">
                  エラートラッキングコード
                </Typography>
                <Typography size="m" component="span">
                  {code}
                </Typography>
              </Stack>
              {/* components/CopyButton。押すと「コピーしました」のスナックバーが出る */}
              <Button appearance="outlined" leading={<Icon name="copy" size="s" />}>
                コピー
              </Button>
            </Stack>
          </Stack>
          <Stack gap="m">
            <LinkButton
              color="interactive"
              size="l"
              width="full"
              href="#support-request"
              target="_blank"
              // 実物は support.server.lolipop.jp の問い合わせフォーム（?tf_35133945804563=trace_id）
              onPress={() => navigate('external')}
            >
              お問い合わせ
            </LinkButton>
            <Stack flexDirection={{ xxs: 'column', s: 'row' }} gap="m">
              <LinkButton
                appearance="outlined"
                size="l"
                width="full"
                href="#home"
                onPress={() => navigate('home')}
              >
                ホームへ
              </LinkButton>
              {/* 実物は https://gamers.lolipop.jp */}
              <LinkButton
                appearance="outlined"
                size="l"
                width="full"
                href="#gamers-top"
                onPress={() => navigate('external')}
              >
                サービストップへ
              </LinkButton>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Container>
  )
}

export const GamersError: Story = {
  render: () => (
    <GamersPublicShell>
      <ErrorPage />
    </GamersPublicShell>
  ),
}

/**
 * ゲーマーズのメンテナンス画面（components/Maintenance）。
 * イラスト（chatbot.svg）→ 中央の見出し → 2 行の説明 →「トップへ」。
 *
 * @summary ゲーマーズのメンテナンス画面
 */
const MaintenanceTopButton = () => {
  const navigate = useGamersNavigate()
  return (
    // 実物は https://gamers.lolipop.jp
    <LinkButton
      color="interactive"
      size="l"
      width="full"
      href="#gamers-top"
      onPress={() => navigate('external')}
    >
      トップへ
    </LinkButton>
  )
}

export const GamersMaintenance: Story = {
  render: () => (
    <GamersPublicShell>
      <Container size="s">
        <Card elevation={0} padding="xxl">
          <Stack gap="xxl">
            <Stack gap="l">
              <Stack gap="m" alignItems="center">
                <img src={chatbotImage} alt="chatbotのイラスト" width={192} height={192} />
                <Typography size="m" fontWeight="bold" component="h1">
                  メンテナンス中です
                </Typography>
              </Stack>
              <Stack gap="xs">
                <Typography size="m" component="span">
                  メンテナンスにより、一時的にアクセスできない状態です
                </Typography>
                <Typography size="m" component="span">
                  お困りの場合はお問い合わせください
                </Typography>
              </Stack>
            </Stack>
            <MaintenanceTopButton />
          </Stack>
        </Card>
      </Container>
    </GamersPublicShell>
  ),
}
