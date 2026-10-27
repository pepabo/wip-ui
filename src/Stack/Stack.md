---
summary: 子要素を縦または横に等間隔で並べるレイアウト
category: Layout
---

# Stack

子要素を縦または横方向に等間隔で並べる、Flexbox ベースのレイアウトコンポーネントです。
レイアウトのための `<div>` と `display: flex` の代わりに使います。
カラム幅をそろえた 2 次元のレイアウトには Grid、コンテンツの最大幅の制限には Container を使ってください。

## 基本の使い方

```tsx
import { Button, Stack } from 'wip-ui'

<Stack flexDirection="row" gap="s" alignItems="center">
  <Button appearance="outlined">キャンセル</Button>
  <Button>保存</Button>
</Stack>
```

## 使う場面

- フォームの項目やセクションを縦に並べるとき
- ボタンやタグなど、要素を横に並べるとき

## 使い方

### 間隔
- [should] 関係の強い要素どうしほど間隔を狭くし、区切りたいまとまりどうしほど間隔を広くする（例：ラベルと補足説明の間は狭く、フォームのセクションの間は広く）
- [should] 同じ種類の要素が並ぶ場合は、間隔をそろえる

### 揃え方
- [should] 横に並べた要素の高さが違う場合は、縦方向の中央でそろえる（例：アイコンとテキスト、ボタンとテキスト）

### レスポンシブ
- [should] 横に並べた要素が狭い画面で収まらない場合は、画面幅に応じて縦並びに切り替える
- 子要素の折り返しには対応していない。横に並べた要素が幅に収まらない場合は、はみ出す

## 実装

- [should] 間隔は gap で指定する。子要素に margin を付けない
- [should] 縦方向の中央でそろえる場合は alignItems="center"、両端に分ける場合は justifyContent="space-between" を使う
- [should] 画面幅で並び方や間隔を変える場合は、flexDirection と gap にブレークポイントごとの値を渡す（例：flexDirection={{ xxs: 'column', m: 'row' }}）
