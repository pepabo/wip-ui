---
summary: 1 つの対象の状態や見え方を、その場で 1 つ選んで切り替える
category: Navigation
---

# SegmentedControl

1 つの対象（一覧やグラフなど）の状態や見え方を、少ない選択肢から 1 つ選んで切り替えるコントロールです。一覧の並び順、グラフの期間、リスト表示とカード表示の切り替えのように、選ぶと同時にその対象の表示が変わります。常にどれか 1 つが選ばれていて、空にはできません。
表示する対象そのものを切り替えるものではありません。別の対象（別の一覧や別の設定画面など）へ移動するナビゲーションには Tabs を使ってください。

## 基本の使い方

```tsx
import { SegmentedControl, SegmentedControlItem } from 'wip-ui'

<SegmentedControl aria-label="並び順" onSelectionChange={(key) => setSort(key)}>
  <SegmentedControlItem id="newest">新着順</SegmentedControlItem>
  <SegmentedControlItem id="name">名前順</SegmentedControlItem>
</SegmentedControl>
```

## 構成要素

| 部品 | 役割 |
|---|---|
| SegmentedControl | SegmentedControlItem をまとめ、選択値を管理するコンテナ |
| SegmentedControlItem | 個々の選択肢 |

## 使う場面

- 一覧やグラフの並び順、期間、表示の形を、その場で切り替えるとき
- 状態の選択肢が少なく、すべてを見せたまま切り替えさせたいとき

## 使い方

### 切り替える内容

- [should] 切り替えの前後で対象が同じで、その状態や見え方だけが変わるものに使う。対象そのものが変わるなら Tabs を使う
- [must] 選んだら即時に対象の表示へ反映する。選ばれている状態だけが変わって表示が変わらないと、何が起きたか分からない
- [must] ページの移動や URL の変更に使わない。選択肢はリンクではなくラジオボタンとして伝わるため
- [must] フォームの値の入力に使わない。フォームの送信には含まれない。送信や保存の操作で確定する値には RadioGroup + Radio を使う

### 選択肢

- [should] 選択肢は、ラベルをすべて見せたまま 1 行に収まる数にする（目安は 5 個まで）
- [should] 対象の現在の状態に合う選択肢を初期値にする

### 無効

- [should] 特定の選択肢だけを選べなくする場合は、その SegmentedControlItem に isDisabled を指定する
- [should] 送信中や権限不足などですべての選択肢を操作できなくする場合は、SegmentedControl に isDisabled を指定する

### サイズと幅

- 高さは Button や TextField の size="m" と同じ。サイズは変えられない
- [should] 他の入力要素と幅をそろえたい場合は width="full" を指定する

## 文言

- [should] ラベルは名詞か名詞句で、1 語に近い短さにする（例：新着順、名前順）
- [should] 選択肢どうしで、ラベルの長さをそろえる。段の幅はいちばん長いラベルに合わせてそろうため、長さの差がそのまま余白の差になる
- [avoid] アイコンだけのラベルにしない
- [avoid] アイコンを使う選択肢と使わない選択肢を混在させない

## アクセシビリティ

- [must] SegmentedControl に aria-label を付与し、何を切り替えるものかを伝える。見える見出しがある場合は aria-labelledby でそれを指す
- ラジオボタンのグループとして読み上げられる。矢印キーで選択肢を移動し、Space か Enter で選択する

## 実装

- SegmentedControl は role="radiogroup"、SegmentedControlItem は role="radio" の `<button>` として描画される
- [must] 各 SegmentedControlItem に、SegmentedControl の中で一意の id を指定する。選択値（selectedKey、defaultSelectedKey）は id で扱う
- [should] 初期値は defaultSelectedKey（制御する場合は selectedKey と onSelectionChange）で指定する
