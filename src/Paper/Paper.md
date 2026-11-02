---
summary: 影やボーダーでコンテンツの面を浮かせる
category: Surfaces
---

# Paper

影やボーダーで、背景から浮き上がった面を表現するサーフェスコンポーネントです。カードやパネルなど、コンテンツのまとまりの背景として使います。
Dialog や SnackBar などのオーバーレイは、適切な影があらかじめ設定されているため、Paper で囲まずにそのまま使ってください。

## 基本の使い方

```tsx
import { Paper, Typography } from 'wip-ui'

<Paper>
  <Typography>今月の注文数</Typography>
</Paper>
```

## 使う場面

- カードやパネルなど、コンテンツのまとまりを背景から区別したいとき

## 使い方

### 区切り方

- [should] 同じ画面の中では、まとまりの区切り方（影、線、背景色）をそろえる
- [should] 影で区切る場合は elevation、線で区切る場合は outlined、背景色だけで区切る場合は elevation={0} を使う

### 影の強さ

- [should] 一覧に並ぶカードなど、同じ種類のまとまりには同じ elevation を使う
- [should] ほかの面の上に重なるものほど、elevation を大きくする
- [avoid] ダイアログやドロワーのように最前面に浮かぶ要素を、Paper の大きい elevation で自作しない。Dialog などのコンポーネントを使う

### 角丸

- [should] 画面端に接するレイアウトなど、角丸が不要な場合は square を指定する
