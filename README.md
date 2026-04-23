# @pepabo/wip-ui

ペパボのデザインシステム UI コンポーネントライブラリ。React + TypeScript + SCSS で構築。

📘 **[Storybook](https://pepabo.github.io/wip-ui/)**

## インストール

```bash
npm install @pepabo/wip-ui
```

### Peer dependencies

本パッケージは以下の peer dependencies を必要とします。利用側でインストールしてください。

```bash
npm install react react-dom react-aria-components
```

- `react` >= 18.2.0
- `react-dom` >= 18.2.0
- `react-aria-components` ^1.12.2

## 使い方

アプリのルートで `FlavorProvider` を配置し、全フレーバー同梱の CSS を読み込みます。`flavor` prop は省略時 `pepper` が適用されます。

```tsx
import { FlavorProvider, Button } from '@pepabo/wip-ui'
import '@pepabo/wip-ui/css/all.css'

export const App = () => (
  <FlavorProvider>
    <Button>クリック</Button>
  </FlavorProvider>
)
```

別のフレーバーに切り替える場合は `flavor` prop を指定します。ネストして領域ごとに異なるフレーバーを適用することもできます。

```tsx
<FlavorProvider flavor="minne">
  <Button>クリック</Button>
</FlavorProvider>
```

コンポーネント単位でのインポートも可能です。

```tsx
import { Button } from '@pepabo/wip-ui/Button'
```

### 利用可能なフレーバー

`@pepabo/wip-ui/css/all.css` は以下の全フレーバーを含みます。

- `pepper`（デフォルト）
- `minne`
- `apollo`
- `nachiguro`
- `flippers`
- `kung-pu`
- `lolipop`

単一フレーバーのみ使用する場合は、バンドルサイズ削減のために個別 CSS を読み込むこともできます（`FlavorProvider` の `flavor` と必ず一致させる必要があります）。

```tsx
import '@pepabo/wip-ui/css/minne.css'

<FlavorProvider flavor="minne">...</FlavorProvider>
```

## 開発

```bash
npm install
```

### コマンド

| コマンド | 説明 |
|---------|------|
| `npm run storybook` | Storybook 開発サーバー起動 (port 6006) |
| `npm run build-storybook` | Storybook ビルド |
| `npm run build` | ライブラリのビルド（dist/ 出力） |
| `npm run typecheck` | TypeScript 型チェック |
| `npm run lint` | 型チェック + Biome チェック |
| `npm run lint:staged <files>` | Biome による lint（ステージング対象） |

## License

[MIT](./LICENSE)
