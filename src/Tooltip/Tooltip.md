---
summary: ボタンなどに、マウスを乗せたときやフォーカスしたときに補足を表示するポップアップ
category: Data Display
---

# Tooltip

ボタンなどにマウスを乗せたときや、キーボードでフォーカスしたときに、短い補足を表示するポップアップです。TooltipTrigger の中に、ボタンと Tooltip を置いて使います。
HTML の `title` 属性や、自作のツールチップの代わりに使います。操作に必要な説明は、ツールチップではなく、TextField の caption などで画面に常に表示してください。

## 基本の使い方

```tsx
import { Button, Icon, Tooltip, TooltipTrigger } from 'wip-ui'

<TooltipTrigger>
  <Button iconOnly appearance="transparent" aria-label="コピー">
    <Icon name="copy" aria-hidden="true" />
  </Button>
  <Tooltip>コピー</Tooltip>
</TooltipTrigger>
```

## 構成要素

| 部品 | 役割 |
|---|---|
| TooltipTrigger | ボタンと Tooltip をまとめ、表示と非表示を管理する |
| Tooltip | 表示される補足 |

## 使う場面

- アイコンだけのボタンで、ボタンの名前を文字で示したいとき
- 省略して表示している文字の全体や、操作の補足を、必要なときだけ示したいとき

## 使い方

### 内容

- [must] 操作に欠かせない情報を、ツールチップだけに書かない。タッチ操作では表示されないため
- [should] 内容は短い文にする（例：1〜2行）
- [avoid] ボタンのラベルと同じ内容を、ツールチップに重ねて書かない
- ツールチップの中のものは押せない。リンクやボタンを置かない

### 表示

- isDisabled のボタンには表示されない
- [should] ツールチップは、補足する要素の上に表示する。上に表示すると隠れるものがある場合は、ほかの向きにする
- 画面の端で収まらない場合は、反対の向きへの反転と位置の調整が自動で行われる

## アクセシビリティ

- [must] アイコンだけのボタンには、ツールチップとは別に、aria-label でボタンの名前を付ける。ツールチップの内容は、ボタンの名前ではなく説明として読み上げられるため

## 実装

- [must] TooltipTrigger の最初の子には、wip-ui の Button など、フォーカスできる react-aria-components の部品を置く。Icon や素の HTML 要素には表示されない