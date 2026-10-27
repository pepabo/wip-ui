# wip-ui

ペパボのデザインシステム UI コンポーネントライブラリ。React + TypeScript + SCSS で構築。

📘 **[Storybook](https://pepabo.github.io/wip-ui/)**

## インストール

```bash
npm install wip-ui
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

CSS をインポートするだけで、デフォルトの `pepper` フレーバーでコンポーネントが描画されます。

```tsx
import { Button } from 'wip-ui'
import 'wip-ui/styles.css'

export const App = () => <Button>クリック</Button>
```

別のフレーバーを適用したい場合、あるいは領域ごとに異なるフレーバーを切り替えたい場合は `FlavorProvider` で対象領域を囲みます。

```tsx
import { FlavorProvider, Button } from 'wip-ui'
import 'wip-ui/styles.css'

export const App = () => (
  <FlavorProvider flavor="minne">
    <Button>クリック</Button>
  </FlavorProvider>
)
```

コンポーネント単位でのインポートも可能です。

```tsx
import { Button } from 'wip-ui/Button'
```

> **中の `FlavorProvider` で切り替える場合の注意**: フレーバーを入れ子にしたとき、CSS の詳細度が同じためソース順序が後ろ（`pepper` < `minne` < `apollo` < `nachiguro` < `flippers` < `kung-pu` < `lolipop` の順）のフレーバーが勝ちます。「外側 `lolipop` + 内側 `pepper`」のような組み合わせでは、内側が外側を上書きできない点にご注意ください。

### 利用可能なフレーバー

`wip-ui/styles.css` は以下の全フレーバーを含みます。

- `pepper`（デフォルト）
- `minne`
- `apollo`
- `nachiguro`
- `flippers`
- `kung-pu`
- `lolipop`

> **バンドルサイズを最適化したい場合**: 単一フレーバーのみ利用する場合は、`all.css` の代わりに `wip-ui/css/{flavor}.css` を読み込むこともできます。その場合は `FlavorProvider` の `flavor` と必ず一致させてください。

## AI エージェントで使う

wip-ui のパッケージには、AI エージェントと人が判断に使うガイドラインと、lint のプラグインが入っています。`node_modules` の中を読むので、使っている wip-ui のバージョンに合ったルールが使われます。

```
node_modules/wip-ui/
├── guidelines/README.md   入口。rules.md → selector.md → 各コンポーネントの md の順に読む
├── guidelines/rules.md    常に守るルール
├── guidelines/selector.md 用途からコンポーネントを選ぶ一覧
├── dist/js/<Folder>/<Name>.md  各コンポーネントの使い方と props
└── lint/biome/no-raw-element.grit
```

### ガイドラインを読ませる

使っているツールの指示ファイルに、ガイドラインを読む指示を書きます。モノレポの場合は、wip-ui が実際に入っている `node_modules` のパスにしてください。

**Claude Code**（`CLAUDE.md`）

```md
## UI の実装

UI を実装・修正・レビューするときは、wip-ui のガイドラインに従う。

@node_modules/wip-ui/guidelines/README.md
@node_modules/wip-ui/guidelines/rules.md
```

`@` で始まる行のファイルは、自動で読み込まれます。selector.md と各コンポーネントの md は、必要なときに AI が読みにいきます。

**AGENTS.md を読むツール**（Codex など）、**GitHub Copilot**（`.github/copilot-instructions.md`）

```md
## UI の実装

UI を実装・修正・レビューするときは、最初に node_modules/wip-ui/guidelines/README.md を読み、書かれている順番に従う。
```

**Cursor**（`.cursor/rules/wip-ui.mdc`）

```md
---
description: wip-ui を使って UI を実装・修正・レビューするときのルール
globs: ["**/*.tsx"]
alwaysApply: false
---

UI を実装・修正・レビューするときは、最初に node_modules/wip-ui/guidelines/README.md を読み、書かれている順番に従う。
```

### lint を入れる（Biome）

wip-ui のコンポーネントで置き換えられる素の HTML 要素を検出します。`biome.json` に追加します。

```json
{
  "plugins": ["./node_modules/wip-ui/lint/biome/no-raw-element.grit"]
}
```

検出する要素と、例外として素の要素を使う場合の書き方は、[lint/README.md](./lint/README.md) を参照してください。

## Contributing

リポジトリのセットアップ方法・開発コマンドは [`CONTRIBUTING.md`](./CONTRIBUTING.md) を参照してください。

## License

[MIT](./LICENSE)
