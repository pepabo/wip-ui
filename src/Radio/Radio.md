---
summary: 複数の選択肢から 1 つだけを選ばせるラジオボタン
category: Forms
---

# Radio

複数の選択肢から 1 つだけを選ばせるラジオボタンです。RadioGroup の中に Radio を並べて使います。
素の `<input type="radio">` の代わりに使います。
複数選択や単独の ON/OFF には Checkbox、選択肢が多く表示面積を抑えたい場合は Select を使ってください。

## 基本の使い方

```tsx
import { Radio, RadioGroup } from 'wip-ui'

<RadioGroup aria-label="権限" defaultValue="edit">
  <Radio value="admin">管理権限</Radio>
  <Radio value="edit">編集権限</Radio>
  <Radio value="view">閲覧権限</Radio>
</RadioGroup>
```

## 構成要素

| 部品 | 役割 |
|---|---|
| RadioGroup | Radio をまとめ、選択値を管理するコンテナ |
| Radio | 個々の選択肢 |

## 使う場面

- 2 つ以上の選択肢から 1 つだけを選ばせるとき
- 4 個以下の選択肢から選ばせるとき

## 使い方

### 構成

- [avoid] Radio を 1 つだけで使わない。単独の ON/OFF には Checkbox を使う
- RadioGroup には、グループの見える見出しを出す機能はない

### 選択値

- [should] 初期値として、どれか1つを選んでおく。既存の値がある場合はその値にする
- [should] 初期値にふさわしい選択肢がない場合は、「指定しない」などの選択肢を足して、それを初期値にする

### 無効

- [should] 特定の選択肢だけを選べなくする場合は、その Radio に isDisabled を指定する
- [should] すべての選択肢を操作できなくする場合は、RadioGroup に isDisabled を指定する

### 配置

- 選択肢は縦に並ぶ。横並びには対応していない

## 文言

- [should] ラベルは、モバイル幅でも1行に収まる短さにする
- [should] 選択肢どうしで、ラベルの長さをそろえる

## アクセシビリティ

- [must] RadioGroup に aria-label を付与し、グループの意味を伝える

## 実装

- [must] Radio は RadioGroup の中で使う
- [must] 各 Radio に、グループ内で一意の value を指定する
- [should] 初期値は defaultValue（制御する場合は value と onChange）で指定する
