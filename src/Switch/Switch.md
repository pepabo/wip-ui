---
summary: 即時に反映される設定の ON/OFF を切り替えるスイッチ
category: Forms
---

# Switch

ON/OFF を切り替え、その場で反映される設定に使うスイッチです。
即時に反映する設定を、素の `<input type="checkbox">` で作る代わりに使います。
送信ボタンなど別の操作で確定する選択には Checkbox、選択肢から 1 つだけを選ばせる場合は RadioGroup + Radio を使ってください。

## 基本の使い方

```tsx
import { useState } from 'react'
import { Switch } from 'wip-ui'

const [isSelected, setIsSelected] = useState(false)

<Switch label="メール通知" isSelected={isSelected} onChange={setIsSelected} />
```

## 使う場面

- 通知の受け取りなど、切り替えた時点で反映・保存される設定
- 互いに独立した設定を複数並べるとき

## 使い方

### 反映のタイミング

- [should] 切り替えたら即時に反映する。送信操作で確定するフォームでは Checkbox を使う
- [should] 反映に時間がかかる場合は Loader で処理中であることを示し、完了または失敗を SnackBar で通知する

### 切り替える内容

- [avoid] ON/OFF 以外の 2 つの状態（例：月額と年額）の切り替えに使わない。RadioGroup + Radio を使う
- [should] 切り替えによって表示・非表示が変わる内容は、Switch の後ろに置く

### 状態

- [should] 既存の設定がある場合は、現在の状態を表示する
- [should] 条件により切り替えられない場合は isDisabled を指定する

### サイズ

- [avoid] label を表示しない Switch には size="s" を使わない（押せる範囲が WCAG 2.5.8 の 24×24px を下回るため）

## 文言

- [should] label は、切り替える設定の内容を示す
- [avoid] label に「オン」「オフ」を含めない。ON/OFF の状態はスイッチ自体で表す

## アクセシビリティ

- [must] Switch の状態が切り替わっても label を変えない
- [must] label を省略する場合は aria-label を付与する

## 実装

- [should] 現在の状態は isSelected（制御しない場合は defaultSelected）で渡す
