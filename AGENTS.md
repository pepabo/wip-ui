# wip-ui

ペパボのデザインシステム UI コンポーネントライブラリ。React + TypeScript + SCSS で構築。

## コマンド

- `npm run storybook` — Storybook 開発サーバー起動 (port 6006)
- `npm run build-storybook` — Storybook ビルド
- `npm run typecheck` — TypeScript 型チェック
- `npm run lint:staged <files>` — Biome による lint（ステージング済みファイル対象）

## ドキュメントのルール

### 書く場所

| 情報 | 書く場所 |
|---|---|
| 概要・使う場面・使い分け・使い方のルール・アクセシビリティ・実装のルール | 各コンポーネントのフォルダの `<コンポーネント名>.md` |
| 各 prop が何か | Props インターフェースの JSDoc |
| props の見本 | ストーリー（説明文は書かない） |

- md はコンポーネントの説明の唯一の元。Storybook の概要表示は md から生成される
- md は wip-ui の実装を正として書く
- コンポーネント本体には JSDoc を書かない（md と重複するため）

### 参考にするドキュメント

md のルールを決めるときは、次のドキュメントを参考にする。食い違う場合は、上にあるものを優先する。

| 順 | ドキュメント | 何を判断するときに見るか |
|---|---|---|
| 1 | wip-ui の実装 | 正 |
| 2 | [react-aria-components](https://react-spectrum.adobe.com/react-aria/) | 引き継いでいる props の動き |
| 3 | W3C の [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/) と [WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/) | 振る舞いとアクセシビリティ |
| 4 | inhouse のガイドライン（社内 Notion） | 使い方・文言。実装と違う部分は参考にしない |
| 5 | [SmartHR Design System](https://github.com/kufu/smarthr-design-system) | 使い方・文言 |
| 6 | [Primer](https://primer.style/product/components/) | 使い方（ほかにない部品や観点の補足） |

### コンポーネントの md

- 一緒に使う部品（RadioGroup と Radio など）は、親のコンポーネントの md の「構成要素」にまとめる
- 次のテンプレートに従う。該当しない節は省略する

```md
---
summary: （1行の用途）
category: （Actions / Forms / Layout / Data Display / Surfaces / Feedback / Navigation。分類に入らないものは書かない）
---

# コンポーネント名

（概要：何をするコンポーネントか、代わりになる素の HTML 要素、似たコンポーネントとの使い分け。Storybook にはこの段落だけが表示される）

## 基本の使い方
（import と、最小限のコード例を1つ）

## 構成要素
（一緒に使う部品がある場合のみ）

## 使う場面

## 使い方
（### で小見出しを分けてよい）

## 文言
（ラベルなどの書き方の基準がある場合のみ）

## アクセシビリティ

## 実装
（コードを正しく書くためのルールがある場合のみ）
```

- 「使い方」には、デザインとしての振る舞いと判断の基準を書く。prop の渡し方などコードの書き方は「実装」に書く
- 場面を決めつけるルールにしない。判断の基準を書く
- 型定義でエラーになる制約や、props の JSDoc で分かることは書かない
- 「使い方」などのルールには、守る強さのラベルを付ける
  - `[must]`：守らないと、動作やアクセシビリティに問題が出る
  - `[should]`：守らなくても動くが、見た目や使い方の一貫性が崩れる。理由があれば例外もありうる
  - `[avoid]`：should のうち、「〜しない」と書くもの
  - ラベルなし：コンポーネントの制約（対応していないこと、できないこと）
- wip-ui として基準が決まっていない値は「例：」として書く
- md に、wip-ui に存在しない prop・値・部品を書かない

### Props

- Props インターフェースの各プロパティに、その prop が何かを1行の JSDoc で書く
- 値ごとの使い分け（例：negative は破壊的アクションに使う）は、props の JSDoc ではなく md の「使い方」に書く
- react-aria-components から引き継いだ props は再宣言しない。説明は react-aria-components のものを使い、使い方に関わるものは md の「使い方」に書く

```tsx
interface Props {
  /** ボタンの外観スタイル */
  appearance?: ButtonAppearance
  /** ボタンの色テーマ */
  color?: ButtonColor
}
```

### ストーリー

Storybook は、props の見本を見て試すための場所。使い方や使う場面は md に書く。

- 1 コンポーネント 1 ファイル（`<Name>.stories.tsx`）にする。Meta に `tags: ['autodocs']` を含める
- 先頭に、すべての props を Controls で試せる `Playground` を 1 つ置く
- prop ごとに 1 つのストーリーを置き、その prop の値を全部並べる。ストーリーの名前（`name`）は prop の名前にする
- 説明文（JSDoc）は書かない
- 組み合わせの例や、開発者向けの確認用のストーリーは置かない
- ストーリーのコードは、md のルール（aria-label の付け方など）と実装に合わせる。並べるときは Stack を使う

```tsx
export const Playground: Story = {
  args: { children: 'Button' },
}

export const Appearance: Story = {
  name: 'appearance',
  render: () => (
    <Stack flexDirection="row" gap="s">
      <Button appearance="flat">flat</Button>
      <Button appearance="outlined">outlined</Button>
      <Button appearance="transparent">transparent</Button>
    </Stack>
  ),
}
```
