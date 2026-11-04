---
summary: トリガーを押して、その下の内容を開閉するセクションの並び
category: Surfaces
---

# Accordion

トリガーを押すと、その下に隠れている内容が開閉するセクションの並びです。
自作の開閉するカードや、「詳細設定」のように押すと入力欄が出てくる部品の代わりに使います。内容を常に見せてよい場合は、開閉させずにそのまま置いてください。画面の表示を切り替える場合は Tabs を使ってください。

## 基本の使い方

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'wip-ui'

<Accordion>
  <AccordionItem id="users">
    <AccordionTrigger>追加済みのユーザー</AccordionTrigger>
    <AccordionContent>（ユーザーの一覧）</AccordionContent>
  </AccordionItem>
  <AccordionItem id="ports">
    <AccordionTrigger>開放済みのポート</AccordionTrigger>
    <AccordionContent>（ポートの一覧）</AccordionContent>
  </AccordionItem>
</Accordion>
```

## 構成要素

| 部品 | 役割 |
|---|---|
| Accordion | セクションの並び全体。開いているセクションを管理する |
| AccordionItem | トリガーと内容の1組。1つのセクション |
| AccordionTrigger | 押すと内容が開閉する部分。初期値では見出しを兼ねる |
| AccordionContent | 初期値では隠れていて、トリガーを押すと表示される内容 |

## 使う場面

- 設定の一覧など、すべてを常に見せると長くなる内容を、セクションごとにたたんでおきたいとき
- 一覧の件数だけを先に見せて、中身は必要なときに開かせたいとき
- 「詳細設定」など、多くの人は触らない入力欄を、必要な人だけに開かせたいとき

## 使い方

### 使わない場面

- [avoid] ユーザーが必ず確認しなければならない内容には使わない。閉じたままにされると、見落とされる

### 開き方

- [avoid] 別のセクションを開いたときに、開いていたセクションが自動で閉じる形（allowsMultipleExpanded={false}）にしない。読んでいた内容が急に消え、セクションどうしを見比べられなくなる
- [should] 最初から見せたい内容があるセクションは、開いた状態で表示する
- [avoid] 中身がないセクションを isDisabled にして置かない。開けない理由を書く場所がないため、セクションごと表示しないか、開いた中に理由を書く

### トリガー

- [should] 開閉の矢印の位置（indicator）は、1つのサービスの中でそろえる
- [avoid] 開閉できることがほかの見た目で分からない場合に、開閉の矢印をなくさない（indicator="none"）
- [avoid] トリガーの中に、ボタンやリンクなどの操作を置かない。操作は、開いた内容の中に置く
- セクションの入れ子、すべて開く・すべて閉じる操作には対応していない

### 見出し

- [should] 「詳細設定」のように、フォームの中で入力欄を出し入れするだけの場合は、headingLevel="none" にして見出しにしない

### 見た目

- [should] 設定の一覧のように、セクションを並べて区切りを見せたい場合は、divided でセクションの間に区切り線を入れる
- [avoid] セクションの間に Divider を置かない。線の色が強くなり、読み上げでも区切りとして読まれることがある
- [should] カードの見た目にする場合は、Accordion を Paper の中に置く

## 文言

- [should] トリガーの文言は、開かなくても中身が分かる言葉にする
- [should] 件数など、開く前に知っておくとよい情報は、文言の後ろに短く添える（例：「追加済みのユーザー 3人」）。トリガーの中の文字は、すべてトリガーの名前として読み上げられるため

## アクセシビリティ

- [must] トリガーの見出しのレベル（headingLevel）は、ページのほかの見出し（h1〜h6）の並びに合わせて決める（例：Accordion の上の見出しが h2 なら 3）。レベルが飛んだり逆になったりすると、見出しで移動する人がページの構造を取り違える
- [must] トリガーの中にアイコンを置く場合は、Icon に aria-hidden を付ける。付けないと、アイコンの文字が読み上げに混ざる
- トリガーが開いているかどうかは、読み上げで伝わる
- 対応しているブラウザでは、閉じたセクションの中の文字もページ内検索で見つかり、見つかるとセクションが開く

## 実装

- [must] AccordionItem は Accordion の中に置き、AccordionItem の中に AccordionTrigger と AccordionContent を1つずつ置く
- [must] 開閉の状態を指定する場合は、各 AccordionItem に、Accordion の中で一意の id を付ける
- [should] 開閉の状態は Accordion で指定する。最初に開いておくセクションは defaultExpandedKeys（サービスの側で開閉を決める場合は expandedKeys と onExpandedChange）に、AccordionItem の id を渡す（例：入力にエラーがあるあいだは開いておく）
