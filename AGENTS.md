# wip-ui

ペパボのデザインシステム UI コンポーネントライブラリ。React + TypeScript + SCSS で構築。

## コマンド

- `npm run storybook` — Storybook 開発サーバー起動 (port 6006)
- `npm run build-storybook` — Storybook ビルド
- `npm run typecheck` — TypeScript 型チェック
- `npm run lint:staged <files>` — Biome による lint（ステージング済みファイル対象）

## Storybook コーディングルール

[Storybook AI best practices](https://storybook.js.org/docs/ai/best-practices) に準拠する。

### コンポーネント

- コンポーネントには必ず JSDoc と `@summary` タグを付与する
- `@summary` にはコンポーネントの用途を簡潔に記述する
- 類似コンポーネントとの使い分けがある場合は JSDoc 本文で言及する（例: 「ページ遷移には LinkButton を使用してください」）

```tsx
/**
 * ユーザーのアクションを受け付けるためのボタンコンポーネント。
 * ページ遷移にはLinkButtonを使用してください。
 *
 * @summary ユーザーのアクションを受け付けるボタン
 */
export const Button: FC<Props> = ({ ... }) => { ... }
```

### Props

- Props インターフェースの各プロパティに JSDoc 説明を付与する

```tsx
interface Props {
  /** ボタンの外観スタイル */
  appearance?: ButtonAppearance
  /** ボタンの色テーマ */
  color?: ButtonColor
}
```

### ストーリー

- Meta に `tags: ['autodocs']` を含める
- 各ストーリーには「なぜこのストーリーが存在するか（why）」を説明する JSDoc と `@summary` を付与する
- 「何を表示しているか（what）」ではなく「どういう場面で使うか（why）」を書く
- 1 ストーリー = 1 コンセプト。複数の無関係なコンセプトを 1 つのストーリーに混ぜない
  - ただし、同一コンセプトの複数インスタンス（例: 全カラーバリエーション）は 1 ストーリーに含めてよい

```tsx
/**
 * 主要なアクションを示すインタラクティブカラーのボタン。
 * 1つのビューに1つだけ使用することを推奨。
 *
 * @summary 主要アクション向けのボタン
 */
export const Interactive: Story = { ... }
```

### manifest 除外

- AI エージェントに不要なストーリーには `tags: ['!manifest']` を付与する
- 対象: Playground、全一覧系（AllIcons, AllSizes 等）、重複するバリエーション、開発者向けリファレンス
