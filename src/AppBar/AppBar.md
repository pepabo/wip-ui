---
summary: ページ上部でタイトルと主要なアクションを表示するナビゲーションバー
category: Navigation
---

# AppBar

ページ上部に配置し、サービスのタイトル（またはロゴ）と主要なアクションを表示するナビゲーションバーです。`<header>` 要素として描画されます。
AppBarLeading と AppBarTrailing を使って、タイトルを左側に、アクションを右側に配置します。

## 基本の使い方

```tsx
import { AppBar, AppBarLeading, AppBarTrailing, Button, Icon } from 'wip-ui'

<AppBar>
  <AppBarLeading>
    <a href="/">
      <img src="/logo.svg" alt="サービス名" />
    </a>
  </AppBarLeading>
  <AppBarTrailing>
    <Button iconOnly appearance="transparent" aria-label="メニュー">
      <Icon name="menu" aria-hidden="true" />
    </Button>
  </AppBarTrailing>
</AppBar>
```

## 構成要素

| 部品 | 役割 |
|---|---|
| AppBar | バー全体 |
| AppBarLeading | 左側の領域。ロゴやタイトル、メニューを開くボタンを置く |
| AppBarTrailing | 右側の領域。アクションのボタンを置く |

## 使う場面

- Web アプリケーションの最上部で、サービス名と主要なアクションを常に表示したいとき

## 使い方

### 置くもの

- [should] Leading には、サービスのロゴ（またはサービス名）を置き、ホームへのリンクにする
- [should] よく知られたアクション（検索、通知など）は、アイコンのみのボタンにする
- [should] アイコンだけでは内容が伝わりにくいアクションは、テキスト付きのボタンにする（例：「ログイン」「新規登録」）
- [avoid] 画面ごとの補助的なアクションを AppBar に並べない。AppBar には、サービス全体で使うアクションだけを置く

### 外観

- [should] ブランドカラーを前面に出したい場合は appearance="filled" を使う
- [should] 背景の画像や色の上に重ねる場合は appearance="transparent" を使う。背景とのコントラストを確保する

### スクロールしたとき

- [should] スクロールしても画面上部に表示し続けたい場合は position="fixed" を使う

## アクセシビリティ

- [must] ロゴの画像の alt には、サービス名を入れる。「ロゴ」という言葉は入れない
- [must] アイコンのみのボタンには、aria-label で操作内容を示す（例：「検索」「通知」）
- [should] AppBar は1ページに1つだけ置く

## 実装

- [should] メニューを開くボタンには、aria-expanded で開閉の状態を、aria-controls で開くナビゲーションを示す
