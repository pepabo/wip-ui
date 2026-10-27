---
summary: 12 カラムでカラム幅をそろえたレイアウトを組む
category: Layout
---

# Grid

12 カラムのグリッドで、カラム幅をそろえたレイアウトを組むコンポーネントです。GridItem と組み合わせて使い、画面幅に応じてカラム数を変えるレスポンシブなレイアウトを作れます。
要素を縦または横に並べるだけなら Stack、コンテンツの最大幅の制限には Container を使ってください。

## 基本の使い方

```tsx
import { Container, Grid, GridItem, Paper } from 'wip-ui'

<Container>
  <Grid spacing="l">
    <GridItem size={8}>
      <Paper>メインコンテンツ</Paper>
    </GridItem>
    <GridItem size={4}>
      <Paper>サイドバー</Paper>
    </GridItem>
  </Grid>
</Container>
```

## 構成要素

| 部品 | 役割 |
|---|---|
| Grid | アイテムを並べる行。アイテム間の間隔や配置を指定する |
| GridItem | Grid の中のカラム。占めるカラム数（size）と左側のオフセット（offset）を指定する |

## 使う場面

- メインコンテンツとサイドバーなど、幅の異なるカラムを組み合わせた画面
- カード一覧やダッシュボードなど、要素をタイル状に並べるとき
- 画面幅に応じて、カラム数を変えたいとき

## 使い方

### カラム
- [should] GridItem の size は、1 行の合計が 12 になるように指定する
- [should] コンテンツを中央に寄せたり左側に余白を設けたりしたい場合は、GridItem の offset を使う（例：size={6} offset={3}）

### 間隔
- [should] アイテム間の間隔は Grid の spacing で指定する。GridItem に margin を付けない
- [avoid] spacing を大きくしすぎない。コンテンツの領域が狭くなり、レイアウトがそろっていないように見える
- spacing を省略すると、アイテム間の間隔は 0 になる

### 並び方
- [avoid] 要素を縦に積み重ねるだけの場合は Grid を使わない。Stack を使う

### 余白
- [should] Grid の左右に余白を取りたい場合は、Grid を Container で囲む
- Grid 自体は上下・左右の余白を持たない。上下の余白は前後の要素との関係で決める

### レスポンシブ
- [should] 画面幅が狭くなって、各カラムの内容が読みにくくなる場合は、画面幅に応じてカラム数を減らす
- [should] 画面幅が広くなるほど、アイテム間の間隔を広くする

## 実装

- [should] 画面幅でカラム数や間隔を変える場合は、GridItem の size と Grid の spacing にブレークポイントごとの値を渡す（例：size={{ xxs: 12, s: 6, m: 4 }}、spacing={{ xxs: 's', m: 'l' }}）
