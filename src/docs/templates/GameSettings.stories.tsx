import { useState } from 'react'

import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Checkbox } from '../../Checkbox'
import { Container } from '../../Container'
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Paper } from '../../Paper'
import { Radio, RadioGroup } from '../../Radio'
import { Select, SelectItem } from '../../Select'
import { Stack } from '../../Stack'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../Table'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import { GamersServerShell, ServerPageLayout } from './gamersShell'
import { CalloutBody, ConfigRow, EmptyNotice, server } from './gameServer'
import { Card } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { ServerStatus } from './gameServer'

/**
 * ゲーム設定（apollo/frontend の (server)/_components/GameManager の「ゲーム設定」タブ）。
 * GameManager/view.tsx がゲームの種類で Manager を出し分ける。全 34 の Manager を中身の Paper で分けると次のとおりで、
 * 形が違うものを 1 つずつストーリーにした（括弧は同じ形の Manager）。
 *
 * - MinecraftJavaManager … 専用の VersionUp / RecreateWorld / Setting（ホワイトリスト・管理者リスト）。Default ほか
 * - MinecraftBedrockManager … ui/ 以下の専用の画面（設定の各グループを手書き）。MinecraftBedrock
 * - VersionUp ＋ Setting（GameSettings の Server-Driven UI）… Palworld
 *   （AbioticFactor / Brickadia / ConanExiles / HumanitZ / Icarus / Necesse / Romestead /
 *   RuneScapeDragonwilds / SonsOfTheForest / TheForest / VRising / GMod / SevenDaysToDie）
 * - VersionUp ＋ RecreateWorld ＋ Settings … Factorio（DoNotStarveTogether / ProjectZomboid）
 * - VersionUp ＋ RegenerateGameWorld ＋ 接続情報 ＋ Setting … Astroneer
 *   （接続情報を持つもの: CoreKeeper / Enshrouded / Rust / Valheim。項目名だけが違う）
 * - VersionUp ＋ 招待コード ＋ Setting … Windrose（Soulmask の InvitationCode は下の注記が無いだけ）
 * - VersionUp（専用の VersionUpDialog）＋ txAdmin ＋ MySQL … FiveM（FivemEnhanced / RedM）
 * - VersionUp だけ … Hytale / Satisfactory / Starrupture。Settings だけ … ArkSe。Terraria は ui/ 以下の専用画面
 *
 * 設定の項目・選択肢・範囲は backend/service の各 *_settings.go（Server-Driven UI）のまま。
 */
const meta = {
  title: 'Templates/Gamers/GameSettings',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ: Server-Driven UI の設定（GetGameSettingsResponse の形）───

type Option = { value: string; label: string }

/**
 * description はラベルの下（FieldLabel）、hint は入力欄の下（各 *Field の config.description）に出る。
 * 読み取り専用の表示（GameSettingsView）に出るのは description だけ
 */
type Field = { id: string; label: string; description?: string; hint?: string } & (
  | {
      kind: 'text'
      value: string
      maxLength?: number
      minLength?: number
      pattern?: string
      placeholder?: string
      password?: boolean
    }
  | { kind: 'slider'; value: number; min: number; max: number; step?: number }
  | { kind: 'select'; value: string; options: Option[] }
  | { kind: 'radio'; value: string; options: Option[] }
  | { kind: 'checkbox'; value: boolean }
  | { kind: 'checkboxGroup'; value: string[]; options: Option[] }
  | {
      kind: 'conditional'
      value: string
      enableLabel: string
      password?: boolean
      maxLength?: number
      placeholder?: string
    }
  | {
      kind: 'conditionalSlider'
      /** 0 はオフ（無制限） */
      value: number
      enableLabel: string
      min: number
      max: number
      step?: number
    }
)

type Group = { id: string; title: string; fields: Field[] }

const opts = (...values: string[]) => values.map((v) => ({ value: v, label: v }))

/** GameSettingsView の表示値 */
const displayValue = (f: Field) => {
  switch (f.kind) {
    case 'select':
    case 'radio':
      return f.options.find((o) => o.value === f.value)?.label ?? f.value
    case 'checkbox':
      return f.value ? '有効' : '無効'
    case 'checkboxGroup':
      return f.value.length > 0
        ? f.value.map((v) => f.options.find((o) => o.value === v)?.label ?? v).join(', ')
        : '未選択'
    case 'slider':
      return String(f.value)
    case 'conditionalSlider':
      return f.value === 0 ? '無制限' : String(f.value)
    case 'text':
    case 'conditional':
      // パスワードは読み取り専用でも * で伏せる。空は「未設定」
      return f.password && f.value ? '*'.repeat(f.value.length) : f.value
  }
}

/** パスワードの項目は値が入っていれば「コピー」が出る */
const copyValue = (f: Field) =>
  (f.kind === 'text' || f.kind === 'conditional') && f.password && f.value ? f.value : undefined

// MinecraftJava: backend/service/minecraft_java.go の buildMinecraftJava*Group。
// whitelist グループはホワイトリストの欄で別に出すため、ここには含めない（useSetting の filteredGameSettings）
const minecraftJavaGroups: Group[] = [
  {
    id: 'basic',
    title: 'サーバー基本情報',
    fields: [
      {
        id: 'motd',
        label: 'サーバー説明',
        kind: 'text',
        value: 'ロリポップ！for Gamers のサーバーへようこそ',
        maxLength: 59,
        placeholder: 'A Minecraft Server',
      },
      {
        id: 'max-players',
        label: 'サーバーに参加できる最大人数',
        kind: 'slider',
        value: 10,
        min: 1,
        max: 100,
      },
    ],
  },
  {
    id: 'gameplay',
    title: 'ゲームプレイ',
    fields: [
      {
        id: 'gamemode',
        label: 'ゲームモード',
        kind: 'select',
        value: 'survival',
        options: opts('survival', 'creative', 'adventure', 'spectator'),
      },
      {
        id: 'difficulty',
        label: '難易度',
        kind: 'select',
        value: 'normal',
        options: opts('peaceful', 'easy', 'normal', 'hard'),
      },
      {
        id: 'force-gamemode',
        label: 'プレイヤーに適用するゲームモード',
        kind: 'radio',
        value: 'false',
        options: [
          { value: 'true', label: 'サーバーのゲームモード' },
          { value: 'false', label: 'プレイヤーが選択したゲームモード' },
        ],
      },
      { id: 'hardcore', label: 'ハードコア', kind: 'checkbox', value: false },
      {
        id: 'allow-flight',
        label: 'プレイヤーに飛行を可能にするMODを許可',
        kind: 'checkbox',
        value: false,
      },
      {
        id: 'allow-nether',
        label: 'プレイヤーがネザーにいくことを許可',
        kind: 'checkbox',
        value: true,
      },
      { id: 'pvp', label: 'PVP', kind: 'checkbox', value: true },
      { id: 'enable-command-block', label: 'コマンドブロック', kind: 'checkbox', value: false },
      {
        id: 'spawn-protection',
        label: 'プレイヤースポーン地点の保護半径',
        kind: 'slider',
        value: 16,
        min: 0,
        max: 16,
      },
      {
        id: 'player-idle-timeout',
        label: '無操作のプレイヤーがサーバーからキックされるまでの時間(分)',
        kind: 'slider',
        value: 0,
        min: 0,
        max: 180,
      },
      {
        id: 'op-permission-level',
        label: '/opコマンドを使用したときに与えられるデフォルトの権限レベル',
        kind: 'select',
        value: '4',
        options: opts('1', '2', '3', '4'),
      },
      {
        id: 'resource-pack',
        label: 'リソースパックのURL',
        hint: 'リソースパックのURLを設定します。',
        kind: 'conditional',
        value: '',
        enableLabel: 'リソースパックのURLを設定する',
      },
    ],
  },
  {
    id: 'world-generation',
    title: 'ワールド生成',
    fields: [
      {
        id: 'level-type',
        label: 'マップのタイプ',
        hint: 'ワールドに生成されるマップのタイプを選択できます。新しいマップのタイプを適用するにはワールドの再生成を行ってください。',
        kind: 'select',
        value: 'minecraft:normal',
        options: [
          { value: 'minecraft:normal', label: 'normal' },
          { value: 'minecraft:flat', label: 'flat' },
          { value: 'minecraft:large_biomes', label: 'large_biomes' },
          { value: 'minecraft:amplified', label: 'amplified' },
        ],
      },
      {
        id: 'level-seed',
        label: 'シード値',
        kind: 'conditional',
        value: '-4172144997902289642',
        enableLabel: 'シード値を設定する',
      },
    ],
  },
  {
    id: 'world',
    title: 'ワールド',
    fields: [
      { id: 'generate-structures', label: '構造物の生成', kind: 'checkbox', value: true },
      { id: 'spawn-animals', label: '動物のスポーン', kind: 'checkbox', value: true },
      { id: 'spawn-monsters', label: 'モンスターのスポーン', kind: 'checkbox', value: true },
      { id: 'spawn-npcs', label: '村人のスポーン', kind: 'checkbox', value: true },
      {
        id: 'max-world-size',
        label: 'ワールド境界の最大サイズ',
        kind: 'slider',
        value: 29999984,
        min: 1,
        max: 29999984,
      },
    ],
  },
  {
    id: 'performance',
    title: 'パフォーマンスと処理',
    fields: [
      {
        id: 'simulation-distance',
        label: 'シミュレーション距離',
        kind: 'slider',
        value: 10,
        min: 3,
        max: 32,
      },
      {
        id: 'view-distance',
        label: 'ワールド描画設定',
        kind: 'slider',
        value: 10,
        min: 3,
        max: 32,
      },
    ],
  },
]

// Palworld: backend/service/palworld.go の palworldFieldMetas。publiclobby は先頭に足される。
// 「アイテム設定」「ワールド設定」「パル&プレイヤー設定」の 3 グループ（倍率のスライダー約 60 項目）は省いた
const palworldGroups: Group[] = [
  {
    id: 'basic',
    title: '基本設定',
    fields: [
      {
        id: 'publiclobby',
        label: 'コミュニティサーバー公開設定',
        kind: 'radio',
        value: 'false',
        options: [
          { value: 'true', label: '公開する' },
          { value: 'false', label: '公開しない' },
        ],
      },
      {
        id: 'server-player-max-num',
        label: 'サーバーに参加できる最大人数',
        kind: 'slider',
        value: 32,
        min: 1,
        max: 32,
      },
      {
        id: 'server-name',
        label: 'サーバー名',
        kind: 'text',
        value: server.name,
        maxLength: 100,
        placeholder: 'サーバー名を入力',
      },
      {
        id: 'server-description',
        label: 'サーバー説明',
        kind: 'text',
        value: '',
        maxLength: 200,
        placeholder: 'サーバー説明を入力',
      },
      {
        id: 'admin-password',
        label: 'サーバーの管理者権限パスワード',
        kind: 'conditional',
        value: 'pepa-admin-2026',
        enableLabel: '管理者パスワードを設定する',
        placeholder: 'パスワードを入力',
        password: true,
      },
      {
        id: 'server-password',
        label: 'サーバーのログインパスワード',
        kind: 'conditional',
        value: '',
        enableLabel: 'ログインパスワードを設定する',
        placeholder: 'パスワードを入力',
        password: true,
      },
      {
        id: 'show-player-list',
        label: 'ESCキーで表示される画面での参加者一覧を有効化',
        kind: 'checkbox',
        value: false,
      },
      {
        id: 'crossplay-platforms',
        label: '接続を許可するプラットフォーム',
        kind: 'checkboxGroup',
        value: [],
        options: opts('Steam', 'Xbox', 'PS5', 'Mac'),
      },
      {
        id: 'is-show-join-left-message',
        label: 'プレイヤーの参加・退出時にゲーム内メッセージを表示',
        kind: 'checkbox',
        value: true,
      },
      {
        id: 'allow-client-mod',
        label: 'Modを有効化しているユーザーのサーバー参加を許可',
        kind: 'checkbox',
        value: true,
      },
      {
        id: 'enable-voice-chat',
        label: 'ボイスチャット機能を有効化',
        kind: 'checkbox',
        value: false,
      },
      {
        id: 'voice-chat-max-volume-distance',
        label: 'ボイスチャットの通話音量を減衰させない距離',
        kind: 'slider',
        value: 3000,
        min: 0,
        max: 30000,
        step: 100,
      },
      {
        id: 'voice-chat-zero-volume-distance',
        label: 'ボイスチャットの通話音量を0にする距離',
        kind: 'slider',
        value: 15000,
        min: 0,
        max: 30000,
        step: 100,
      },
      {
        id: 'enable-building-player-uid-display',
        label: '建築物上に作成者のプレイヤーIDを表示',
        kind: 'checkbox',
        value: false,
      },
    ],
  },
]

// Factorio: backend/service/factorio_settings.go。最大人数は 0 が「無制限」
const factorioGroups: Group[] = [
  {
    id: 'server',
    title: 'サーバー基本情報',
    fields: [
      {
        id: 'server_name',
        label: 'サーバー名',
        kind: 'text',
        value: 'lolipop-for-gamers-server',
        maxLength: 60,
      },
      {
        id: 'server_description',
        label: 'サーバー説明',
        kind: 'text',
        value: 'LOLIPOP! for Gamers',
        maxLength: 200,
      },
      {
        id: 'game_password',
        label: 'パスワード',
        kind: 'conditional',
        value: 'factory-2026',
        enableLabel: 'パスワードを設定する',
        maxLength: 64,
        password: true,
      },
      {
        id: 'max_players',
        label: 'サーバーに参加できる最大人数',
        kind: 'conditionalSlider',
        value: 0,
        enableLabel: '最大人数を設定する',
        min: 1,
        max: 16,
        step: 1,
      },
    ],
  },
]

// Astroneer: backend/service/astroneer_settings.go。管理者パスワードは 1 文字以上（MinLength: 1）
const astroneerGroups: Group[] = [
  {
    id: 'server',
    title: 'サーバー基本情報',
    fields: [
      {
        id: 'server_name',
        label: 'サーバー名',
        kind: 'text',
        value: 'Server by Lolipop for Gamers',
        maxLength: 64,
      },
      {
        id: 'server_password',
        label: '接続パスワード',
        kind: 'text',
        value: 'astro-2026',
        maxLength: 64,
        password: true,
      },
      {
        id: 'owner_name',
        label: 'オーナーのプレイヤー名',
        kind: 'text',
        value: 'pepa_taro',
        maxLength: 64,
        hint: 'ゲーム内で管理者権限を持つプレイヤーの Steam プレイヤー名を設定します',
      },
      {
        id: 'console_password',
        label: '管理者パスワード',
        kind: 'text',
        value: 'console-1234',
        minLength: 1,
        maxLength: 64,
        password: true,
        hint: 'サーバーコンソールへの接続に使用します。空にすると停止時にワールドが保存されなくなります',
      },
      {
        id: 'max_players',
        label: '最大プレイヤー数',
        kind: 'slider',
        value: 8,
        min: 1,
        max: 8,
        step: 1,
      },
    ],
  },
]

const windroseDifficulty: Option[] = [
  { value: 'WDS.Parameter.CombatDifficulty.Easy', label: 'Easy' },
  { value: 'WDS.Parameter.CombatDifficulty.Normal', label: 'Normal' },
  { value: 'WDS.Parameter.CombatDifficulty.Hard', label: 'Hard' },
]

// Windrose: backend/service/windrose_settings.go
const windroseGroups: Group[] = [
  {
    id: 'server',
    title: 'サーバー基本設定',
    fields: [
      {
        id: 'server_name',
        label: 'サーバー名',
        kind: 'text',
        value: server.name,
        maxLength: 64,
        placeholder: 'My Windrose Server',
      },
      {
        id: 'max_player_count',
        label: '最大プレイヤー数',
        kind: 'slider',
        value: 4,
        min: 1,
        max: 10,
        step: 1,
      },
      {
        id: 'use_direct_connection',
        label: 'Direct IP接続を許可',
        kind: 'checkbox',
        value: false,
        hint: '有効にするとIPアドレスでの直接接続が可能になります。招待コード経由の参加は無効になります。',
      },
      {
        id: 'is_password_protected',
        label: 'パスワード保護',
        kind: 'checkbox',
        value: false,
        hint: '有効にするとサーバーへの接続にパスワードが必要になります',
      },
      {
        id: 'password',
        label: 'パスワード',
        kind: 'text',
        value: '',
        maxLength: 64,
        password: true,
      },
    ],
  },
  {
    id: 'world',
    title: 'ワールド設定',
    fields: [
      {
        id: 'combat_difficulty',
        label: '戦闘難易度',
        kind: 'select',
        value: 'WDS.Parameter.CombatDifficulty.Normal',
        options: windroseDifficulty,
        hint: 'ボス戦全体の難易度および敵の攻撃性を制御します',
      },
      {
        id: 'mob_health_multiplier',
        label: '敵の体力倍率',
        kind: 'slider',
        value: 1,
        min: 0.2,
        max: 5,
        step: 0.2,
        hint: '敵の体力を設定します',
      },
      {
        id: 'mob_damage_multiplier',
        label: '敵のダメージ倍率',
        kind: 'slider',
        value: 1,
        min: 0.2,
        max: 5,
        step: 0.2,
        hint: '敵が与えるダメージ量を設定します',
      },
      {
        id: 'ships_health_multiplier',
        label: '敵船の体力倍率',
        kind: 'slider',
        value: 1,
        min: 0.4,
        max: 5,
        step: 0.2,
        hint: '敵船の体力量を設定します',
      },
      {
        id: 'ships_damage_multiplier',
        label: '敵船のダメージ倍率',
        kind: 'slider',
        value: 1,
        min: 0.2,
        max: 2.5,
        step: 0.1,
        hint: '敵船が与えるダメージ量を設定します',
      },
      {
        id: 'boarding_difficulty_multiplier',
        label: '乗り込み戦の難易度倍率',
        kind: 'slider',
        value: 1,
        min: 0.2,
        max: 5,
        step: 0.2,
        hint: '乗り込み戦闘（ボーディングアクション）に勝利するために倒すべき敵船員の人数を設定します',
      },
      {
        id: 'stats_correction_modifier',
        label: 'プレイヤー数に応じた敵の体力の調整',
        kind: 'slider',
        value: 1,
        min: 0,
        max: 2,
        step: 0.1,
        hint: 'サーバー上のプレイヤー数に応じて、敵の体力および姿勢（ポスチャー）の低下量を調整します',
      },
      {
        id: 'ship_stats_correction_modifier',
        label: 'プレイヤー数に応じた敵船の体力の調整',
        kind: 'slider',
        value: 0,
        min: 0,
        max: 2,
        step: 0.1,
        hint: 'サーバー上のプレイヤー数に応じて、敵船の体力を調整します',
      },
      {
        id: 'shared_quests',
        label: '共有クエストの進行',
        kind: 'checkbox',
        value: true,
        hint: 'プレイヤーが協力クエストを完了すると、そのクエストを進行中の全プレイヤーに対して自動的に完了扱いとなります',
      },
      {
        id: 'easy_explore',
        label: '探索マップのマーカーを非表示',
        kind: 'checkbox',
        value: false,
        hint: '探索の難易度を高めるため、注目地点（ポイント・オブ・インタレスト）のマップマーカーを無効化します',
      },
    ],
  },
]

// ─── データ: Minecraft (Java版) のホワイトリスト・管理者リスト ───

const whiteList = {
  enabled: true,
  enforce: true,
  users: ['gamers_jiro', 'lolipop_hanako', 'pepa_taro'],
}

// MinecraftJavaManager/model.ts の OpsLevelOptions
const opsLevelOptions: Option[] = [
  { value: '1', label: 'モデレーター' },
  { value: '2', label: 'ゲームマスター' },
  { value: '3', label: '管理者' },
  { value: '4', label: 'サーバー所有者' },
]
const ops = { bypassesPlayerLimit: false, level: '4', users: ['pepa_taro'] }

// VersionUpDialog の選択肢（実アプリは API から取る）。vanilla と spigot にはビルドの選択が無い
const modNames = ['vanilla', 'paper', 'spigot', 'forge', 'fabric', 'mohist']
const modVersions = ['1.21.4', '1.21.1', '1.20.6', '1.20.4', '1.20.1']
const modBuilds = ['1.20.1-a8f3c2e', '1.20.1-77b91d0', '1.20.1-3c0e6f4']

// ─── データ: そのほかのゲーム（値はダミー）───

/** ゲーム名は backend/entity/game.go の GameDisplayNames */
type GameId =
  | 'minecraftJava'
  | 'minecraftBedrock'
  | 'palworld'
  | 'factorio'
  | 'astroneer'
  | 'windrose'
  | 'fivem'

const gameNames: Record<GameId, string> = {
  minecraftJava: 'Minecraft (Java版)',
  minecraftBedrock: 'Minecraft (統合版)',
  palworld: 'パルワールド',
  factorio: 'Factorio',
  astroneer: 'ASTRONEER',
  windrose: 'Windrose',
  fivem: 'FiveM(GTA V)',
}

const sduiGroups: Partial<Record<GameId, Group[]>> = {
  palworld: palworldGroups,
  factorio: factorioGroups,
  astroneer: astroneerGroups,
  windrose: windroseGroups,
}

// AstroneerManager/components/ServerConnectionInfo（backend の astroneer_connection_info.go）
const astroneerServerUrl = `${server.ip}:8777`
// WindroseManager/components/InviteCode
const windroseInviteCode = 'K7Q2-9XPL'
// FivemSettings
const fivem = {
  version: '12911',
  txAdminUrl: `http://${server.ip}:40120`,
  txAdminPin: '4821',
  mysqlHostName: 'localhost',
  mysqlPort: '3306',
  mysqlUsername: 'fivem',
  mysqlInitialPassword: 'Xf8kq2Lm9pRt',
}
// FivemManager/components/VersionUpDialog/model.ts の versionOptions
const fivemVersionOptions: Option[] = [
  { value: 'recommended', label: '推奨' },
  { value: 'latest', label: '最新' },
]
const factorioVersion = '2.0.72'
// MinecraftBedrockManager（model.ts の getDefaultMinecraftBedrockSettings に近い値）
const bedrock = {
  version: '1.21.44.01',
  allowList: true,
  users: ['gamers_jiro', 'pepa_taro'],
  opsIgnoresPlayerLimit: false,
  ops: ['pepa_taro'],
  serverName: 'Dedicated Server',
  maxPlayers: 10,
  gamemode: 'survival',
  difficulty: 'easy',
  defaultPlayerPermissionLevel: 'member',
  forceGamemode: false,
  allowCheats: false,
  disableCustomSkins: false,
  playerIdleTimeout: 30,
  levelSeed: '',
  tickDistance: 4,
  viewDistance: 32,
}

// ─── 共通の部品 ───

/** components/CopyButton */
const CopyButton = () => (
  <Button appearance="outlined" leading={<Icon name="copy" size="s" />}>
    コピー
  </Button>
)

/** 値の右にコピーを置く行（ConfigRow ＋ CopyButton） */
const CopyRow = ({
  label,
  description,
  display,
  copy,
}: {
  label: string
  description?: string
  display: ReactNode
  copy?: string
}) => (
  <Stack flexDirection="row" gap="s" justifyContent="space-between" alignItems="center">
    <ConfigRow label={label} description={description}>
      {display}
    </ConfigRow>
    {copy && <CopyButton />}
  </Stack>
)

/** VersionUp / RecreateWorld などの 1 行の Paper。見出しは variant='l' */
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
      alignItems="flex-start"
    >
      {/* 説明は見出しの下 mt 2 */}
      <Stack gap="m">
        <Typography size="l" fontWeight="bold" component="h2">
          {title}
        </Typography>
        {children}
      </Stack>
      {action}
    </Stack>
  </Card>
)

/** 項目を縦に並べるだけの Paper（接続情報・招待コード・txAdmin・MySQL） */
const InfoPaper = ({ title, children }: { title: string; children: ReactNode }) => (
  <Card>
    <Stack gap="l">
      <Typography size="l" fontWeight="bold" component="h2">
        {title}
      </Typography>
      {children}
    </Stack>
  </Card>
)

/** 「設定」の Paper の見出し（変更 / リセット） */
const SettingTitle = ({ onEdit, onReset }: { onEdit?: () => void; onReset: () => void }) => (
  // 実アプリは画面幅によらず見出しとボタンを横に並べる（PaperTitle は xxs で縦積みになるので使わない）
  <Stack flexDirection="row" gap="s" alignItems="flex-start" justifyContent="space-between">
    <Typography size="xxl" fontWeight="bold" component="h2">
      設定
    </Typography>
    <Stack flexDirection="row" gap="s">
      <Button appearance="outlined" leading={<Icon name="pencil" size="s" />} onPress={onEdit}>
        変更
      </Button>
      {/* GAP-NEW: RestartAltOutlined に当たるアイコンが無いので arrow_order で代用 */}
      <Button
        appearance="outlined"
        leading={<Icon name="arrow_order" size="s" />}
        onPress={onReset}
      >
        リセット
      </Button>
    </Stack>
  </Stack>
)

/** GameSettings/GameSettingsView。グループの間に Divider。見出しの下 mb 4、項目の間 spacing 4 */
const SettingsView = ({ groups }: { groups: Group[] }) => (
  <>
    {groups.map((group, i) => (
      <Stack key={group.id} gap="xl">
        {i > 0 && <Divider />}
        <Typography size="l" fontWeight="bold" component="h3">
          {group.title}
        </Typography>
        {group.fields.map((f) => (
          <CopyRow
            key={f.id}
            label={f.label}
            description={f.description}
            display={displayValue(f) || '未設定'}
            copy={copyValue(f)}
          />
        ))}
      </Stack>
    ))}
  </>
)

// ─── Minecraft (Java版) の設定 ───

/**
 * Accordion の中の「追加済ユーザー」の表（WhiteList / OpsList / components/UserListItem）。
 * 実物は閉じた状態で始まり、見出しの行を押すと表が開く。Accordion が無いので、右端の山のボタンで開閉する
 */
const UserTable = ({
  label,
  users,
  deletable = false,
}: {
  label: string
  users: string[]
  deletable?: boolean
}) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <Paper padding="m" elevation={0} outlined>
      <Stack gap="m">
        <Stack flexDirection="row" gap="s" alignItems="center" justifyContent="space-between">
          <Stack flexDirection={{ xxs: 'column', s: 'row' }} gap="m">
            <Typography size="m" component="span">
              追加済ユーザー
            </Typography>
            <Typography size="m" component="span">
              {users.length}人
            </Typography>
          </Stack>
          <Button
            appearance="transparent"
            size="s"
            iconOnly
            aria-label={`${label}の追加済ユーザー`}
            aria-expanded={expanded}
            onPress={() => setExpanded(!expanded)}
          >
            <Icon name={expanded ? 'chevron_up' : 'chevron_down'} size="m" />
          </Button>
        </Stack>
        {expanded && (
          <Table aria-label={`${label}の追加済ユーザー`}>
            <TableHeader>
              <Column isRowHeader allowsSorting>
                ユーザー名
              </Column>
              {deletable ? <Column aria-label="操作"> </Column> : null}
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <Row key={u} id={u}>
                  <Cell>{u}</Cell>
                  {deletable ? (
                    <Cell>
                      <Button
                        appearance="outlined"
                        color="negative"
                        size="s"
                        leading={<Icon name="garbage_can" size="s" />}
                      >
                        削除
                      </Button>
                    </Cell>
                  ) : null}
                </Row>
              ))}
            </TableBody>
          </Table>
        )}
      </Stack>
    </Paper>
  )
}

/** MinecraftJavaManager/components/Setting（読み取り専用の表示） */
const MinecraftJavaSettingPaper = ({
  onEdit,
  onReset,
}: {
  onEdit: () => void
  onReset: () => void
}) => (
  <Card>
    <Stack gap="xl">
      <SettingTitle onEdit={onEdit} onReset={onReset} />
      <Divider />
      {/* Setting/components/WhiteList（Stack spacing 4） */}
      <Stack gap="xl">
        <Typography size="l" fontWeight="bold" component="h3">
          ホワイトリスト
        </Typography>
        <Typography size="s">{whiteList.enabled ? '有効' : '無効'}</Typography>
        <ConfigRow label="サーバーにホワイトリストを適用">
          {whiteList.enforce ? '有効' : '無効'}
        </ConfigRow>
        <UserTable label="ホワイトリスト" users={whiteList.users} />
      </Stack>
      <Divider />
      {/* Setting/components/OpsList（Stack spacing 4） */}
      <Stack gap="xl">
        <Typography size="l" fontWeight="bold" component="h3">
          管理者リスト
        </Typography>
        <ConfigRow label="管理者を除いたサーバーに参加できる最大人数の制限">
          {ops.bypassesPlayerLimit ? '有効' : '無効'}
        </ConfigRow>
        <ConfigRow label="管理者の権限レベル">
          {opsLevelOptions.find((o) => o.value === ops.level)?.label}
        </ConfigRow>
        <UserTable label="管理者リスト" users={ops.users} />
      </Stack>
      <Divider />
      <SettingsView groups={minecraftJavaGroups} />
    </Stack>
  </Card>
)

// ─── 編集（GameSettingsModal / SettingModal）───

/** GameSettings/fields/FieldLabel */
const FieldLabel = ({ label, description }: { label: string; description?: string }) => (
  <Stack gap="xs">
    <Typography size="m" fontWeight="bold" component="span">
      {label}
    </Typography>
    {description && (
      <Typography size="s" color="medium_emphasis" component="span">
        {description}
      </Typography>
    )}
  </Stack>
)

const Hint = ({ children }: { children?: string }) =>
  children ? (
    <Typography size="xs" color="medium_emphasis">
      {children}
    </Typography>
  ) : null

/**
 * GameSettings/fields/TextField。password のときは右に表示切り替えのボタンが付く。
 * GAP-NEW: 不備のある TextField（color="negative" や data-invalid）は lolipop フレーバーで入力欄の枠が消える
 */
const TextInput = ({
  label,
  value,
  onChange,
  hint,
  password,
  maxLength,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  hint?: string
  password?: boolean
  maxLength?: number
  placeholder?: string
}) => {
  const [visible, setVisible] = useState(false)
  return (
    <Stack flexDirection="row" gap="xs" alignItems="flex-start">
      <TextField
        aria-label={label}
        type={password && !visible ? 'password' : 'text'}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        width="full"
        caption={hint}
      />
      {password && (
        // GAP-NEW: TextField に末尾のボタンの枠と、目（Visibility）のアイコンが無い。lock で代用して横に置く
        <Button
          appearance="transparent"
          iconOnly
          aria-label={visible ? 'パスワードを隠す' : 'パスワードを表示'}
          aria-pressed={visible}
          onPress={() => setVisible((v) => !v)}
        >
          <Icon name="lock" size="m" />
        </Button>
      )}
    </Stack>
  )
}

/** GAP-NEW: Slider が無い。実アプリは 120px の数値入力と Slider を横に並べる。ここは数値入力だけ */
const SliderInput = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: () => void
}) => (
  <TextField
    aria-label={label}
    type="number"
    defaultValue={String(value)}
    caption={`${min}〜${max}${step ? `（${step}刻み）` : ''}`}
    onChange={onChange}
  />
)

/** GameSettings/fields/DynamicField。値が変わると onChange を呼ぶ */
const DynamicField = ({ field: f, onChange }: { field: Field; onChange: () => void }) => {
  const [text, setText] = useState(f.kind === 'text' || f.kind === 'conditional' ? f.value : '')
  const [enabled, setEnabled] = useState(
    (f.kind === 'conditional' && f.value !== '') ||
      (f.kind === 'conditionalSlider' && f.value !== 0)
  )
  const changed = onChange
  switch (f.kind) {
    case 'text': {
      return (
        <Stack gap="s">
          <FieldLabel label={f.label} description={f.description} />
          <TextInput
            label={f.label}
            value={text}
            onChange={(v) => {
              setText(v)
              changed()
            }}
            hint={f.hint}
            password={f.password}
            maxLength={f.maxLength}
            placeholder={f.placeholder}
          />
        </Stack>
      )
    }
    case 'slider':
      return (
        <Stack gap="s">
          <FieldLabel label={f.label} description={f.description} />
          <SliderInput
            label={f.label}
            value={f.value}
            min={f.min}
            max={f.max}
            step={f.step}
            onChange={changed}
          />
          <Hint>{f.hint}</Hint>
        </Stack>
      )
    case 'select':
      return (
        <Stack gap="s">
          <FieldLabel label={f.label} description={f.description} />
          <Select
            aria-label={f.label}
            defaultSelectedKey={f.value}
            width="full"
            onSelectionChange={changed}
          >
            {f.options.map((o) => (
              <SelectItem key={o.value} id={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </Select>
          <Hint>{f.hint}</Hint>
        </Stack>
      )
    case 'radio':
      return (
        <Stack gap="s">
          <FieldLabel label={f.label} description={f.description} />
          <RadioGroup aria-label={f.label} defaultValue={f.value} onChange={changed}>
            {f.options.map((o) => (
              <Radio key={o.value} value={o.value}>
                {o.label}
              </Radio>
            ))}
          </RadioGroup>
        </Stack>
      )
    case 'checkbox':
      return (
        <Stack gap="xs">
          <FieldLabel label={f.label} description={f.description} />
          <Checkbox defaultSelected={f.value} onChange={changed}>
            有効
          </Checkbox>
          <Hint>{f.hint}</Hint>
        </Stack>
      )
    case 'checkboxGroup':
      // GAP-NEW: CheckboxGroup が無いので Checkbox を縦に並べる（まとまりの名前は FieldLabel が持つ）
      return (
        <Stack gap="xs">
          <FieldLabel label={f.label} description={f.description} />
          {f.options.map((o) => (
            <Checkbox key={o.value} defaultSelected={f.value.includes(o.value)} onChange={changed}>
              {o.label}
            </Checkbox>
          ))}
        </Stack>
      )
    case 'conditional':
    case 'conditionalSlider':
      return (
        <Stack gap="s">
          <Stack gap="xs">
            <FieldLabel label={f.label} description={f.description} />
            <Checkbox
              isSelected={enabled}
              onChange={(v) => {
                setEnabled(v)
                changed()
              }}
            >
              {f.enableLabel}
            </Checkbox>
          </Stack>
          {enabled &&
            (f.kind === 'conditional' ? (
              <TextInput
                label={f.label}
                value={text}
                onChange={(v) => {
                  setText(v)
                  changed()
                }}
                password={f.password}
                maxLength={f.maxLength}
                placeholder={f.placeholder}
              />
            ) : (
              <SliderInput
                label={f.label}
                value={f.value || f.min}
                min={f.min}
                max={f.max}
                step={f.step}
                onChange={changed}
              />
            ))}
          {/* 条件付き入力の config.description は、入力欄を出しているときだけその下に出る */}
          {enabled && <Hint>{f.hint}</Hint>}
        </Stack>
      )
  }
}

/** 編集画面の Paper（variant='l' の見出しの下に Divider） */
const GroupPaper = ({ title, children }: { title: string; children: ReactNode }) => (
  <Card>
    <Stack gap="l">
      <Stack gap="s">
        <Typography size="l" fontWeight="bold" component="h2">
          {title}
        </Typography>
        <Divider />
      </Stack>
      {children}
    </Stack>
  </Card>
)

/** components/UserListItem の「ユーザー追加」と追加済ユーザーの表 */
const UserListItem = ({ label, users }: { label: string; users: string[] }) => {
  const [input, setInput] = useState('')
  return (
    <>
      <Stack gap="s">
        <Typography size="m" fontWeight="bold" component="span">
          ユーザー追加
        </Typography>
        <Stack flexDirection="row" gap="s" alignItems="flex-start">
          <TextField
            aria-label={`${label}に追加するユーザー名`}
            size="s"
            value={input}
            onChange={setInput}
          />
          <Button appearance="outlined" leading={<Icon name="plus" size="s" />}>
            追加
          </Button>
        </Stack>
      </Stack>
      <UserTable label={label} users={users} deletable />
    </>
  )
}

/**
 * components/MultipleSaveButton。変更があると出る。
 * GAP-NEW: 画面下に固定するバー（position: fixed の面）が無いので、フォームの最後に置いている
 */
const SaveBar = ({ onSave, onDiscard }: { onSave: () => void; onDiscard: () => void }) => (
  <Paper elevation={0} square outlined>
    <Stack flexDirection={{ xxs: 'column', s: 'row' }} gap="s" justifyContent="center">
      <Button color="interactive" size="l" onPress={onSave}>
        保存
      </Button>
      <Button appearance="outlined" size="l" onPress={onDiscard}>
        変更を破棄
      </Button>
    </Stack>
  </Paper>
)

/** 全画面の編集の枠（戻る ＋ 「設定」） */
const EditorFrame = ({ onBack, children }: { onBack: () => void; children: ReactNode }) => (
  <Stack gap="m">
    <Stack alignItems="flex-start">
      {/* GAP-NEW: ArrowBack に当たるアイコンが無いので chevron_left で代用 */}
      <Button
        appearance="outlined"
        size="l"
        leading={<Icon name="chevron_left" size="m" />}
        onPress={onBack}
      >
        戻る
      </Button>
    </Stack>
    <Typography size="xxxl" density="comfort" fontWeight="bold" component="h1">
      設定
    </Typography>
    {children}
  </Stack>
)

type EditorProps = { onBack: () => void }

/**
 * GameSettings/GameSettingsModal（Server-Driven UI の設定の編集）。
 * 実アプリは fullScreen の Dialog（Container maxWidth='md'）で開く。全画面の Dialog が無いので、
 * ここではヘッダーとサイドバーを外した画面として出している
 */
const GameSettingsEditor = ({ groups, onBack }: EditorProps & { groups: Group[] }) => {
  const [dirty, setDirty] = useState(false)
  const changed = () => setDirty(true)
  return (
    <EditorFrame onBack={onBack}>
      {groups.map((group) => (
        <GroupPaper key={group.id} title={group.title}>
          {group.fields.map((f) => (
            <DynamicField key={f.id} field={f} onChange={changed} />
          ))}
        </GroupPaper>
      ))}
      {dirty && <SaveBar onSave={onBack} onDiscard={onBack} />}
    </EditorFrame>
  )
}

/** MinecraftJavaManager/components/SettingModal */
const MinecraftJavaSettingEditor = ({ onBack }: EditorProps) => {
  const [dirty, setDirty] = useState(false)
  const [whiteListEnabled, setWhiteListEnabled] = useState(whiteList.enabled)
  const changed = () => setDirty(true)
  return (
    <EditorFrame onBack={onBack}>
      {/* SettingModal/components/WhiteListSetting */}
      <GroupPaper title="ホワイトリスト">
        <Checkbox
          isSelected={whiteListEnabled}
          onChange={(v) => {
            setWhiteListEnabled(v)
            changed()
          }}
        >
          有効
        </Checkbox>
        {whiteListEnabled && (
          <>
            {/* components/CheckboxItem */}
            <Stack gap="xs">
              <Typography size="m" fontWeight="bold" component="span">
                サーバーにホワイトリストを適用
              </Typography>
              <Checkbox defaultSelected={whiteList.enforce} onChange={changed}>
                有効
              </Checkbox>
            </Stack>
            <UserListItem label="ホワイトリスト" users={whiteList.users} />
          </>
        )}
      </GroupPaper>

      {/* SettingModal/components/OpsSetting */}
      <GroupPaper title="管理者リスト">
        <Stack gap="xs">
          <Typography size="m" fontWeight="bold" component="span">
            管理者を除いたサーバーに参加できる最大人数の制限
          </Typography>
          <Checkbox defaultSelected={ops.bypassesPlayerLimit} onChange={changed}>
            有効
          </Checkbox>
        </Stack>
        {/* components/SelectItem */}
        <Stack gap="s">
          <Typography size="m" fontWeight="bold" component="span">
            管理者の権限レベル
          </Typography>
          <Select
            aria-label="管理者の権限レベル"
            defaultSelectedKey={ops.level}
            width="full"
            onSelectionChange={changed}
          >
            {opsLevelOptions.map((o) => (
              <SelectItem key={o.value} id={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </Select>
        </Stack>
        <UserListItem label="管理者リスト" users={ops.users} />
      </GroupPaper>

      {/* GameSettings/GameSettingsGroup */}
      {minecraftJavaGroups.map((group) => (
        <GroupPaper key={group.id} title={group.title}>
          {group.fields.map((f) => (
            <DynamicField key={f.id} field={f} onChange={changed} />
          ))}
        </GroupPaper>
      ))}

      {dirty && <SaveBar onSave={onBack} onDiscard={onBack} />}
    </EditorFrame>
  )
}

// ─── ダイアログ ───

type DialogName =
  | 'version'
  | 'versionUp'
  | 'fivemVersion'
  | 'recreateWorld'
  | 'initWorld'
  | 'reset'
  | 'bedrockReset'
  | null
/** VersionUpDialog / RecreateWorldDialog / ResetDialog などに共通の確認ダイアログ */
const ConfirmDialog = ({
  title,
  confirmLabel,
  onClose,
  children,
}: {
  title: string
  confirmLabel: string
  onClose: () => void
  children: ReactNode
}) => (
  <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
    </DialogHeader>
    {children}
    <DialogFooter>
      <Button appearance="transparent" onPress={onClose}>
        閉じる
      </Button>
      <Button appearance="outlined" onPress={onClose}>
        {confirmLabel}
      </Button>
    </DialogFooter>
  </Dialog>
)

/** 確認の本文（1 行の説明 ＋ outlined の warning） */
const ConfirmBody = ({ text, warning }: { text: string; warning: string }) => (
  <Stack gap="m">
    <Typography>{text}</Typography>
    <Callout color="notice" appearance="outline">
      {warning}
    </Callout>
  </Stack>
)

/** MinecraftJavaManager/components/VersionUpDialog の確認 */
const MinecraftJavaVersionBody = () => {
  const [mod, setMod] = useState<string>(server.mod)
  return (
    <Stack gap="m">
      <Typography>指定したバージョンに変更できます</Typography>
      <Grid spacing="m">
        <GridItem size={6}>
          <Select
            label="サーバーの種類"
            size="s"
            width="full"
            selectedKey={mod}
            onSelectionChange={(k) => setMod(String(k))}
          >
            {modNames.map((m) => (
              <SelectItem key={m} id={m}>
                {m}
              </SelectItem>
            ))}
          </Select>
        </GridItem>
        <GridItem size={6}>
          <Select label="バージョン" size="s" width="full" defaultSelectedKey={server.version}>
            {modVersions.map((v) => (
              <SelectItem key={v} id={v}>
                {v}
              </SelectItem>
            ))}
          </Select>
        </GridItem>
      </Grid>
      <Callout color="notice" appearance="outline">
        バージョン変更中はサーバーがご利用できなくなる旨をご注意ください
      </Callout>
      {mod !== 'vanilla' && mod !== 'spigot' && (
        <>
          <Divider />
          {/* GAP-NEW: Accordion が無い。実アプリは「高度な設定」を押すとビルドバージョンが開く。ここでは開いた状態で固定 */}
          <Typography size="s" density="comfort" color="medium_emphasis" component="span">
            高度な設定
          </Typography>
          <Select label="ビルドバージョン" size="s" width="full" defaultSelectedKey={modBuilds[0]}>
            {modBuilds.map((b) => (
              // mohist のビルドは <id>-<hash> の hash だけを出す（hideMohistId）
              <SelectItem key={b} id={b}>
                {mod === 'mohist' ? b.split('-')[1] : b}
              </SelectItem>
            ))}
          </Select>
        </>
      )}
    </Stack>
  )
}

/** 各ダイアログの文言（実物の文字列のまま） */
const dialogs: Record<
  Exclude<DialogName, null>,
  { title: string; confirmLabel: string; body: ReactNode }
> = {
  // MinecraftJavaManager/components/VersionUpDialog
  version: {
    title: 'バージョン変更',
    confirmLabel: 'バージョン変更',
    body: <MinecraftJavaVersionBody />,
  },
  // components/VersionUpDialog（Minecraft (Java版)・FiveM 系以外の全ゲームが使う）
  versionUp: {
    title: 'バージョンのアップデート',
    confirmLabel: 'バージョンアップ',
    body: (
      <ConfirmBody
        text="最新のバージョンにアップデートします"
        warning="バージョンアップ中はサーバーがご利用できなくなる旨をご注意ください"
      />
    ),
  },
  // FivemManager/components/VersionUpDialog
  fivemVersion: {
    title: 'バージョン変更',
    confirmLabel: '変更',
    body: (
      <Stack gap="m">
        <Typography>最新の推奨バージョンもしくは最新バージョンに変更できます</Typography>
        <Select label="バージョン" size="s" width="full" defaultSelectedKey="recommended">
          {fivemVersionOptions.map((o) => (
            <SelectItem key={o.value} id={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </Select>
        <Callout color="notice" appearance="outline">
          バージョン変更中はサーバーがご利用できなくなる旨をご注意ください
        </Callout>
      </Stack>
    ),
  },
  // RecreateWorldDialog / GameSettings/RegenerateGameWorldModal / Bedrock の re-create-world-dialog
  recreateWorld: {
    title: 'ワールドの再生成',
    confirmLabel: '再生成',
    body: (
      <ConfirmBody
        text="現在の設定でワールドを再生成します"
        warning="再生成すると現在のワールドのデータが変更されますのでご注意ください"
      />
    ),
  },
  // FactorioManager/components/RecreateWorldDialog
  initWorld: {
    title: 'ワールドの初期化',
    confirmLabel: '初期化',
    body: (
      <ConfirmBody
        text="現在の設定でワールドを初期化します"
        warning="初期化すると現在のワールドのデータが変更されますのでご注意ください"
      />
    ),
  },
  // Setting/components/ResetDialog / GameSettings/ResetGameSettingsModal
  reset: {
    title: '設定ファイルのリセット',
    confirmLabel: 'リセット',
    body: (
      <ConfirmBody
        text="変更されている内容をリセットすることができます"
        warning="設定のリセット中はサーバーがご利用できなくなる旨をご注意ください"
      />
    ),
  },
  // MinecraftBedrockManager/ui/settings/reset-settings-dialog
  bedrockReset: {
    title: '設定のリセット',
    confirmLabel: 'リセット',
    body: (
      <ConfirmBody
        text="変更されている内容をリセットすることができます"
        warning="設定のリセット中はサーバーがご利用できなくなる旨をご注意ください"
      />
    ),
  },
}

// ─── ゲームごとの中身 ───

/** 共通の VersionUp（説明文 ＋「バージョンアップ」） */
const VersionUpPaper = ({ onOpen }: { onOpen: () => void }) => (
  <ActionPaper
    title="バージョンアップ"
    action={
      <Button appearance="outlined" onPress={onOpen}>
        バージョンアップ
      </Button>
    }
  >
    <Typography size="s">最新のバージョンにアップデートすることができます</Typography>
  </ActionPaper>
)

/** 今のバージョンを出す VersionUp（Factorio / Bedrock は「アップデート」、FiveM は「変更」） */
const VersionPaper = ({
  version,
  label,
  onOpen,
}: {
  version: string
  label: string
  onOpen: () => void
}) => (
  <ActionPaper
    title="バージョン"
    action={
      <Button appearance="outlined" onPress={onOpen}>
        {label}
      </Button>
    }
  >
    <Typography size="s">{version}</Typography>
  </ActionPaper>
)

const RecreateWorldPaper = ({ onOpen }: { onOpen: () => void }) => (
  <ActionPaper
    title="ワールドの再生成"
    action={
      <Button appearance="outlined" onPress={onOpen}>
        再生成
      </Button>
    }
  >
    <Typography size="s">
      現在の設定でワールドを再生成することができます。再生成すると現在のワールドのデータが変更されます。
    </Typography>
  </ActionPaper>
)

/** MinecraftBedrockManager/ui/settings（各グループは手書きで、Server-Driven UI ではない） */
const BedrockSettingPaper = ({ onReset }: { onReset: () => void }) => (
  <Card>
    <Stack gap="xl">
      {/* 「変更」は ui/setting-modal（全画面の編集）を開く。ここでは編集画面を作っていない */}
      <SettingTitle onReset={onReset} />
      <Divider />
      <Stack gap="l">
        <Typography size="l" fontWeight="bold" component="h3">
          ホワイトリスト
        </Typography>
        <Typography size="s">{bedrock.allowList ? '有効' : '無効'}</Typography>
        <UserTable label="ホワイトリスト" users={bedrock.users} />
      </Stack>
      <Divider />
      <Stack gap="l">
        <Typography size="l" fontWeight="bold" component="h3">
          管理者リスト
        </Typography>
        <ConfigRow label="管理者を除いたサーバーに参加できる最大人数の制限">
          {bedrock.opsIgnoresPlayerLimit ? '有効' : '無効'}
        </ConfigRow>
        <UserTable label="管理者リスト" users={bedrock.ops} />
      </Stack>
      <Divider />
      <Stack gap="l">
        <Typography size="l" fontWeight="bold" component="h3">
          サーバー基本情報
        </Typography>
        <ConfigRow label="サーバー説明">{bedrock.serverName}</ConfigRow>
        <ConfigRow label="サーバーに参加できる最大人数">{bedrock.maxPlayers}</ConfigRow>
      </Stack>
      <Divider />
      <Stack gap="l">
        <Typography size="l" fontWeight="bold" component="h3">
          ゲームプレイ
        </Typography>
        <ConfigRow label="ゲームモード">{bedrock.gamemode}</ConfigRow>
        <ConfigRow label="難易度">{bedrock.difficulty}</ConfigRow>
        <ConfigRow label="プレイヤーに付与する権限レベル">
          {bedrock.defaultPlayerPermissionLevel}
        </ConfigRow>
        <ConfigRow label="プレイヤーに適用するゲームモード">
          {bedrock.forceGamemode ? 'サーバーのゲームモード' : 'プレイヤーが選択したゲームモード'}
        </ConfigRow>
        <ConfigRow label="チートコマンド">{bedrock.allowCheats ? '有効' : '無効'}</ConfigRow>
        <ConfigRow label="カスタマイズされたスキンを制限">
          {bedrock.disableCustomSkins ? '有効' : '無効'}
        </ConfigRow>
        <ConfigRow label="無操作のプレイヤーがサーバーからキックされるまでの時間（分）">
          {bedrock.playerIdleTimeout}
        </ConfigRow>
      </Stack>
      <Divider />
      <Stack gap="l">
        <Typography size="l" fontWeight="bold" component="h3">
          ワールド生成
        </Typography>
        <ConfigRow label="シード値">{bedrock.levelSeed || '未設定'}</ConfigRow>
      </Stack>
      <Divider />
      <Stack gap="l">
        <Typography size="l" fontWeight="bold" component="h3">
          パフォーマンスと処理
        </Typography>
        <ConfigRow label="シミュレーション距離">{bedrock.tickDistance}</ConfigRow>
        <ConfigRow label="ワールドの描画距離">{bedrock.viewDistance}</ConfigRow>
      </Stack>
    </Stack>
  </Card>
)

const GameBody = ({
  game,
  groups,
  open,
  onEdit,
}: {
  game: GameId
  groups: Group[]
  open: (d: Exclude<DialogName, null>) => void
  onEdit: () => void
}) => {
  // 各 Manager の components/Setting（GameSettingsView ＋ GameSettingsModal ＋ ResetGameSettingsModal）
  const settings = (
    <Card>
      <Stack gap="xl">
        <SettingTitle onEdit={onEdit} onReset={() => open('reset')} />
        <Divider />
        <SettingsView groups={groups} />
      </Stack>
    </Card>
  )
  switch (game) {
    case 'minecraftJava':
      return (
        <>
          {/* MinecraftJavaManager/components/VersionUp */}
          <ActionPaper
            title="バージョン"
            action={
              <Button appearance="outlined" onPress={() => open('version')}>
                変更
              </Button>
            }
          >
            {/* GAP-NEW: 実アプリは左側を残りの幅いっぱいに広げ（Grid size='grow'）、その中を 2 列（各 6/12）に分ける。
                ActionPaper の左側を広げる手段が無いので、2 つを横に並べるだけにしている */}
            <Stack flexDirection="row" gap="xxl">
              <ConfigRow label="サーバーの種類">{server.mod}</ConfigRow>
              <ConfigRow label="バージョン">{server.version}</ConfigRow>
            </Stack>
          </ActionPaper>
          <RecreateWorldPaper onOpen={() => open('recreateWorld')} />
          <MinecraftJavaSettingPaper onEdit={onEdit} onReset={() => open('reset')} />
        </>
      )
    case 'minecraftBedrock':
      return (
        <>
          <VersionPaper
            version={bedrock.version}
            label="アップデート"
            onOpen={() => open('versionUp')}
          />
          <RecreateWorldPaper onOpen={() => open('recreateWorld')} />
          <BedrockSettingPaper onReset={() => open('bedrockReset')} />
        </>
      )
    case 'palworld':
      return (
        <>
          <VersionUpPaper onOpen={() => open('versionUp')} />
          {settings}
        </>
      )
    case 'factorio':
      return (
        <>
          <VersionPaper
            version={factorioVersion}
            label="アップデート"
            onOpen={() => open('versionUp')}
          />
          {/* FactorioManager/components/RecreateWorld */}
          <ActionPaper
            title="ワールドの初期化"
            action={
              <Button appearance="outlined" onPress={() => open('initWorld')}>
                初期化
              </Button>
            }
          >
            <Typography size="s">
              現在の設定でワールドを初期化することができます。初期化すると現在のワールドのデータが変更されます。
            </Typography>
          </ActionPaper>
          {settings}
        </>
      )
    case 'astroneer':
      return (
        <>
          <VersionUpPaper onOpen={() => open('versionUp')} />
          {/* GameSettings/RegenerateGameWorldView */}
          <RecreateWorldPaper onOpen={() => open('recreateWorld')} />
          {/* AstroneerManager/components/ServerConnectionInfo */}
          <InfoPaper title="接続情報">
            <CopyRow label="サーバーURL" display={astroneerServerUrl} copy={astroneerServerUrl} />
          </InfoPaper>
          {settings}
        </>
      )
    case 'windrose':
      return (
        <>
          <VersionUpPaper onOpen={() => open('versionUp')} />
          {/* WindroseManager/components/InviteCode */}
          <Card>
            <Stack gap="s">
              <Typography size="l" fontWeight="bold" component="h2">
                招待コード
              </Typography>
              <Stack flexDirection="row" gap="s" justifyContent="space-between" alignItems="center">
                <Typography size="s">{windroseInviteCode}</Typography>
                <CopyButton />
              </Stack>
              <Typography size="s" density="comfort" color="medium_emphasis">
                Direct
                IP接続が有効な場合、招待コードでは参加できません。IPアドレスで直接接続してください。
              </Typography>
            </Stack>
          </Card>
          {settings}
        </>
      )
    case 'fivem':
      return (
        <>
          <VersionPaper version={fivem.version} label="変更" onOpen={() => open('fivemVersion')} />
          {/* FivemManager/components/TxAdmins */}
          <InfoPaper title="txAdmin接続情報">
            <ConfigRow label="接続先">
              {/* GAP-NEW: 文中のリンク（Link）が無い。実物は新しいタブで開くリンク ＋ OpenInNew のアイコン */}
              <Stack flexDirection="row" gap="xxs" alignItems="center">
                <Typography size="s" color="informative" component="span">
                  {fivem.txAdminUrl}
                </Typography>
                <Typography size="s" color="informative" component="span">
                  <Icon name="launch" size="s" />
                </Typography>
              </Stack>
            </ConfigRow>
            <CopyRow label="PINコード" display={fivem.txAdminPin} copy={fivem.txAdminPin} />
          </InfoPaper>
          {/* FivemManager/components/MySQLs。初期パスワードだけ伏せてコピーを付ける */}
          <InfoPaper title="MySQL">
            <ConfigRow label="データベース ホスト名">{fivem.mysqlHostName}</ConfigRow>
            <ConfigRow label="データベース ポート名">{fivem.mysqlPort}</ConfigRow>
            <ConfigRow label="ユーザー名">{fivem.mysqlUsername}</ConfigRow>
            <CopyRow
              label="初期パスワード"
              display={'*'.repeat(fivem.mysqlInitialPassword.length)}
              copy={fivem.mysqlInitialPassword}
            />
          </InfoPaper>
        </>
      )
  }
}

// ─── 画面 ───

type ViewState = 'ready' | 'loading' | 'polling'

const GameSettingsScreen = ({
  game = 'minecraftJava',
  status = 'RUNNING',
  view = 'ready',
  initialDialog = null,
  initialEditing = false,
}: {
  game?: GameId
  status?: ServerStatus
  /** loading はゲームデータの取得前、polling は取得に失敗して 10 秒ごとに取り直している状態 */
  view?: ViewState
  initialDialog?: DialogName
  initialEditing?: boolean
}) => {
  const [dialog, setDialog] = useState<DialogName>(initialDialog)
  const [editing, setEditing] = useState(initialEditing)

  const groups = sduiGroups[game]
  const editor =
    game === 'minecraftJava' ? (
      <MinecraftJavaSettingEditor onBack={() => setEditing(false)} />
    ) : groups ? (
      <GameSettingsEditor groups={groups} onBack={() => setEditing(false)} />
    ) : null

  const current = dialog ? dialogs[dialog] : null

  // GameSettingsModal / SettingModal は fullScreen の Dialog で、ヘッダーとサイドバーごと画面を覆う。
  // 全画面の Dialog が無いので、枠の代わりに Container maxWidth='md'（pt 6, pb 16）だけで出す
  if (editing && editor) {
    return <Container size="m">{editor}</Container>
  }

  return (
    // servers/[id]/layout.tsx の Sidebar で「サーバー」、(server) の ServerDetailHeader の下のタブで「ゲーム設定」
    <GamersServerShell active="server" game={gameNames[game]}>
      <ServerPageLayout status={status} game={gameNames[game]} tab="gameManager">
        {status !== 'RUNNING' ? (
          // ServerDetailTabPanels。停止中はゲーム設定の中身を出さず、Paper の無い面に 1 行だけ出す。
          // GAP-NEW: 最小の高さ 200px の中で上下中央に置く指定ができないので、横の中央だけ
          <EmptyNotice size="s">
            😴
            サーバー停止中のため非表示になっています。サーバーを起動後、最大30秒程度で表示されます。
          </EmptyNotice>
        ) : view === 'polling' ? (
          // components/GameDataPollingAlert。GAP-NEW: Callout のアイコンを CircularProgress に差し替えられない
          <Callout color="informative">
            <CalloutBody title="ゲームデータを取得しています">
              約10秒ごとにデータを取得しています。完了までお待ちください。
              <br />
              10分ほど待っても表示されない場合は、お手数ですがお問い合わせください。
            </CalloutBody>
          </Callout>
        ) : view === 'loading' ? (
          // GAP-NEW: Skeleton が無い。実アプリは高さ 140 / 300 / 500 の角丸の Skeleton を 3 つ縦に並べる
          <Stack gap="l">
            {[0, 1, 2].map((i) => (
              <Card key={i}>
                <Stack alignItems="center">
                  <Loader size="m" />
                </Stack>
              </Card>
            ))}
          </Stack>
        ) : (
          <GameBody
            game={game}
            groups={groups ?? []}
            open={setDialog}
            onEdit={() => setEditing(true)}
          />
        )}

        {current && (
          <ConfirmDialog
            title={current.title}
            confirmLabel={current.confirmLabel}
            onClose={() => setDialog(null)}
          >
            {current.body}
          </ConfirmDialog>
        )}
      </ServerPageLayout>
    </GamersServerShell>
  )
}

// ─── ストーリー: Minecraft (Java版) ───

/**
 * 起動中の Minecraft (Java版) サーバーのゲーム設定。バージョン・ワールドの再生成・設定
 * （ホワイトリスト、管理者リスト、server.properties の 5 グループ）を読み取り専用で並べる。
 *
 * @summary ゲーム設定の一覧
 */
export const Default: Story = {
  render: () => <GameSettingsScreen />,
}

/**
 * 停止中。ゲーム設定の中身は出さず、起動を促す 1 行だけになる。
 *
 * @summary 停止中のゲーム設定
 */
export const Stopped: Story = {
  render: () => <GameSettingsScreen status="STOPPED" />,
}

/**
 * ゲームデータの取得前。実アプリは Skeleton を 3 つ並べる。
 *
 * @summary ゲームデータの読み込み中
 */
export const Loading: Story = {
  render: () => <GameSettingsScreen view="loading" />,
}

/**
 * ゲームデータの取得に失敗し、10 秒ごとに取り直している状態。中身の代わりに Alert が出る。
 *
 * @summary ゲームデータを取得し直している
 */
export const Polling: Story = {
  render: () => <GameSettingsScreen view="polling" />,
}

/**
 * 設定の「変更」を押した直後の編集画面。各項目の入力の型は backend の Server-Driven UI の定義
 * （TextField / Slider / Select / Radio / Checkbox / 条件付き入力）に合わせている。
 *
 * @summary 設定の編集画面
 */
export const Editing: Story = {
  render: () => <GameSettingsScreen initialEditing />,
}

/**
 * バージョンの「変更」を押した直後。サーバーの種類が vanilla / spigot 以外ならビルドバージョンも選べる。
 *
 * @summary バージョン変更のダイアログ
 */
export const VersionDialog: Story = {
  render: () => <GameSettingsScreen initialDialog="version" />,
}

/**
 * ワールドの再生成の確認ダイアログ。
 *
 * @summary ワールドの再生成の確認
 */
export const RecreateWorldDialog: Story = {
  render: () => <GameSettingsScreen initialDialog="recreateWorld" />,
}

/**
 * 設定ファイルのリセットの確認ダイアログ。
 *
 * @summary 設定のリセットの確認
 */
export const ResetDialog: Story = {
  render: () => <GameSettingsScreen initialDialog="reset" />,
}

// ─── ストーリー: ほかのゲーム ───

/**
 * パルワールド。バージョンアップと、Server-Driven UI の設定の 2 つ。
 * パスワードは伏せて「コピー」が付き、何も選んでいないチェックボックスのまとまりは「未選択」、空の文字列は「未設定」になる。
 * 設定は「基本設定」グループだけを写した。
 *
 * @summary パルワールドのゲーム設定
 */
export const Palworld: Story = {
  render: () => <GameSettingsScreen game="palworld" />,
}

/**
 * 共通のバージョンアップ（components/VersionUpDialog）の確認。Java 版と FiveM 系以外の全ゲームがこれを使う。
 *
 * @summary バージョンのアップデートの確認
 */
export const PalworldVersionUp: Story = {
  render: () => <GameSettingsScreen game="palworld" initialDialog="versionUp" />,
}

/**
 * パルワールドの設定の編集。パスワードの表示切り替え、プラットフォームのチェックボックスのまとまりがある。
 *
 * @summary パルワールドの設定の編集
 */
export const PalworldEditing: Story = {
  render: () => <GameSettingsScreen game="palworld" initialEditing />,
}

/**
 * Factorio。ワールドは「再生成」ではなく「初期化」。最大人数は条件付きのスライダーで、オフ（0）のときは「無制限」と出る。
 *
 * @summary Factorio のゲーム設定
 */
export const Factorio: Story = {
  render: () => <GameSettingsScreen game="factorio" />,
}

/**
 * ASTRONEER。バージョンアップ・ワールドの再生成・接続情報（サーバーURL とコピー）・設定の 4 つ。
 *
 * @summary ASTRONEER のゲーム設定
 */
export const Astroneer: Story = {
  render: () => <GameSettingsScreen game="astroneer" />,
}

/**
 * Windrose。招待コード（コピーと、Direct IP 接続との関係の注記）と、2 グループの設定。
 *
 * @summary Windrose のゲーム設定
 */
export const Windrose: Story = {
  render: () => <GameSettingsScreen game="windrose" />,
}

/**
 * FiveM（GTA V）。設定の Paper は無く、バージョン・txAdmin の接続情報・MySQL を出す。
 * FiveM(GTA V Enhanced) と RedM も同じ形。
 *
 * @summary FiveM のゲーム設定
 */
export const FiveM: Story = {
  render: () => <GameSettingsScreen game="fivem" />,
}

/**
 * FiveM 専用のバージョン変更。推奨 / 最新から選ぶ。
 *
 * @summary FiveM のバージョン変更
 */
export const FiveMVersionDialog: Story = {
  render: () => <GameSettingsScreen game="fivem" initialDialog="fivemVersion" />,
}

/**
 * Minecraft (統合版)。Java 版と見た目は近いが、各グループを手書きした専用の画面
 * （ホワイトリストの適用・管理者の権限レベル・リソースパックなどの項目が無い）。
 *
 * @summary Minecraft (統合版) のゲーム設定
 */
export const MinecraftBedrock: Story = {
  render: () => <GameSettingsScreen game="minecraftBedrock" />,
}
