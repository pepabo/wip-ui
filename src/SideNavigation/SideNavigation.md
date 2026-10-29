---
summary: 画面の横に置く、ページを移動するための縦のナビゲーション
category: Navigation
---

# SideNavigation

画面の横に置き、サービスの中のページを移動するための縦のナビゲーションです。SideNavigation の中に、SideNavigationItem と SideNavigationSection を置いて使います。
自作のサイドバーのリンクの一覧の代わりに使います。同じページの中で表示を切り替えるときは Tabs、画面の階層を示すときは Breadcrumbs、操作を選ばせるときは Menu を使ってください。

## 基本の使い方

```tsx
import { Icon, SideNavigation, SideNavigationItem, SideNavigationSection } from 'wip-ui'

<SideNavigation aria-label="メインナビゲーション">
  <SideNavigationItem href="/servers" leading={<Icon name="folder" />} isCurrent>
    サーバー
  </SideNavigationItem>
  <SideNavigationItem href="/billing" leading={<Icon name="bill" />}>
    支払い
  </SideNavigationItem>
  <SideNavigationSection title="管理">
    <SideNavigationItem href="/members" leading={<Icon name="people" />}>
      メンバー
    </SideNavigationItem>
  </SideNavigationSection>
</SideNavigation>
```

## 構成要素

| 部品 | 役割 |
|---|---|
| SideNavigation | ナビゲーション全体 |
| SideNavigationItem | 1つのページへのリンク |
| SideNavigationSection | 見出しを付けた、項目のまとまり |

## 使う場面

- 管理画面など、行き来するページが多く、どのページからもすぐに移動できるようにしたいとき
- サービスの設定の中など、関係するページの間を移動させたいとき

## 使い方

### 項目

- [must] 今表示しているページの項目に、isCurrent を付ける。下の階層のページを表示しているときも、そのページが属する項目に付ける
- [should] 項目は、よく使う順か、作業の流れの順に並べる
- [should] 項目の数が多い場合や、種類が分かれる場合は、SideNavigationSection で見出しを付けてまとめる
- [should] アイコンを付ける場合は、すべての項目に付ける。付ける項目と付けない項目を混ぜない
- [avoid] 保存や削除などの操作を、項目に置かない。項目はページの移動だけにする
- 項目の入れ子、件数のバッジ、ナビゲーション全体の折りたたみには対応していない

### 外部のページ

- [should] サービスの外のページや、新しいタブで開く項目には、trailing に Icon name="launch" を置き、ほかの項目と見分けられるようにする

### 配置

- ナビゲーションは、置いた場所の幅いっぱいに広がる。幅は、レイアウトの側で決める（例：264px）
- [should] 狭い画面では、メニューのボタンから Dialog などで開くようにする。SideNavigation には、狭い画面に合わせて表示を切り替える仕組みはない

## アクセシビリティ

- [must] 1つの画面に複数のナビゲーションがある場合は、aria-label でそれぞれ違う名前を付ける（例：「メインナビゲーション」「設定」）
- [must] 新しいタブで開く項目は、ラベルの中か aria-label で、新しいタブで開くことを伝える

## 実装

- [should] Next.js などのルーターでページを移動する場合は、react-aria-components の RouterProvider でアプリを囲む。囲まない場合は、ページ全体が読み込み直される
- [should] 今表示しているページの判定（URL が一致するかどうか）は、サービスの側で行い、結果を isCurrent に渡す
