---
summary: ページ階層のパンくずリスト
category: Navigation
---

# Breadcrumbs

サイトの階層構造の中で現在のページがどこにあるかを、ホームを起点としたリンクの並びで示すパンくずリストです。
ユーザーが現在位置を把握し、上位の階層へ移動できるようにします。主要なナビゲーション（AppBar など）を補うもので、置き換えるものではありません。

## 基本の使い方

```tsx
import { Breadcrumb, Breadcrumbs } from 'wip-ui'

<nav aria-label="パンくずリスト">
  <Breadcrumbs>
    <Breadcrumb href="/">ホーム</Breadcrumb>
    <Breadcrumb href="/products">商品一覧</Breadcrumb>
    <Breadcrumb>商品詳細</Breadcrumb>
  </Breadcrumbs>
</nav>
```

## 構成要素

| 部品 | 役割 |
|---|---|
| Breadcrumbs | パンくずリスト全体。Breadcrumb を並べ、区切り記号を表示する |
| Breadcrumb | 各階層の項目 |

## 使う場面

- 階層的に配置されたページを持つ大規模な Web アプリケーションで、現在位置を示すとき
- 検索エンジンや外部リンクなど、外部から直接アクセスされる可能性が高いページ

## 使い方

### 項目

- [should] 先頭にはホームを置く
- [should] 末尾には現在のページを置き、リンクにしない
- [should] 末尾以外の項目は、その階層のページへのリンクにする
- 項目が多く1行に収まらない場合は、折り返して表示される

### 使わない場面

- [avoid] 他のナビゲーションの代わりとして Breadcrumbs だけを置かない
- [avoid] ホーム画面には置かない。現在位置を示す必要がないため

## アクセシビリティ

- [must] パンくずリストを、名前の付いたナビゲーションの領域で囲む

## 実装

- [should] 末尾以外の Breadcrumb には href を指定する。末尾の Breadcrumb には href を指定しない
- Breadcrumbs は、ナビゲーションの領域（`<nav>`）を自動で作らない
- [must] Breadcrumbs を `<nav aria-label="パンくずリスト">` で囲む
