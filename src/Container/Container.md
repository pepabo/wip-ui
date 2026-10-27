---
summary: コンテンツの最大幅を制限して中央に配置するレイアウト
category: Layout
---

# Container

コンテンツの最大幅を制限し、中央に配置するレイアウトコンポーネントです。左右の余白は画面幅に応じて自動で調整されます。
ページ全体やセクションのラッパーとして、Grid や Stack の外側で使います。子要素を並べるには Stack、カラムで区切るには Grid を使ってください。

## 基本の使い方

```tsx
import { Container, Stack, Typography } from 'wip-ui'

<Container component="main">
  <Stack gap="m">
    <Typography component="h1" size="xl" fontWeight="bold">アカウント設定</Typography>
    <Typography>登録情報を変更できます。</Typography>
  </Stack>
</Container>
```

## 使う場面

- ページ全体やセクションのコンテンツに、最大幅と左右の余白を設けたいとき

## 使い方

### サイズ

- [should] 一覧・詳細・編集のように、利用者が行き来する一連の画面では、size をそろえる
- [should] 目的が違う画面のまとまりでは、そのまとまりに合う size を選ぶ。目安は次のとおり。どれにも当てはまらない場合は、既定の size="l" を使う

| 画面のまとまり | size |
|---|---|
| ログイン・新規登録など、入力項目の少ないフォームの画面 | xs |
| お知らせ・ヘルプ・規約など、文章を読ませる画面 | s |
| 設定・申し込みなど、フォームが中心の画面 | m |
| 一覧・詳細・編集など、一般的な画面 | l（既定） |
| 列の多いテーブルやダッシュボードなど、横幅を使う画面 | xl |

- [should] まとまりの中に横幅が必要な画面がある場合は、その画面だけを変えず、まとまり全体の size をそろえる
- 各 size の最大幅は、フレーバーごとに異なる
- 最小の xs でも、モバイル幅の画面よりは広い。そのため、モバイル幅ではどの size でも見え方はほぼ変わらない

### 余白

- [should] Grid の左右に余白を取りたい場合は、Grid を Container で囲む

## アクセシビリティ

- [should] ページの主要な領域として使う場合は、component="main" を指定する。component="main" は1ページに1つだけにする
