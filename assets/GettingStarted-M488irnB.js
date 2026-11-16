import{u as o,j as n,M as c}from"./iframe-sXJpPmIv.js";import"./preload-helper-Dp1pzeXC.js";function i(r){const e={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...o(),...r.components};return n.jsxs(n.Fragment,{children:[n.jsx(c,{title:"Introduction/Getting Started",summary:"wip-ui のインストールとセットアップ手順"}),`
`,n.jsx(e.h1,{id:"getting-started",children:"Getting Started"}),`
`,n.jsx(e.h2,{id:"インストール",children:"インストール"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`npm install wip-ui react react-dom react-aria-components
`})}),`
`,n.jsx(e.h2,{id:"セットアップ",children:"セットアップ"}),`
`,n.jsx(e.h3,{id:"1-css-のインポート",children:"1. CSS のインポート"}),`
`,n.jsx(e.p,{children:"使用するフレーバーの CSS ファイルをアプリケーションのエントリーポイントでインポートします。"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// 例: Pepper フレーバーを使用する場合
import 'wip-ui/css/pepper.css'
`})}),`
`,n.jsxs(e.p,{children:["利用可能なフレーバーは ",n.jsx(e.a,{href:"?path=/docs/introduction-overview--docs",children:"Overview"})," を参照してください。"]}),`
`,n.jsx(e.h3,{id:"2-flavorprovider-の配置",children:"2. FlavorProvider の配置"}),`
`,n.jsxs(e.p,{children:["アプリケーションのルートに ",n.jsx(e.code,{children:"FlavorProvider"})," を配置して、使用するフレーバーを指定します。"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { FlavorProvider } from 'wip-ui'
import 'wip-ui/css/lolipop.css'

function App() {
  return (
    <FlavorProvider flavor="lolipop">
      {/* アプリケーション全体 */}
    </FlavorProvider>
  )
}
`})}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"FlavorProvider"})," の詳細な API は ",n.jsx(e.a,{href:"?path=/docs/introduction-flavorprovider--docs",children:"Introduction/FlavorProvider"})," を参照してください。"]}),`
`,n.jsx(e.h3,{id:"3-コンポーネントの使用",children:"3. コンポーネントの使用"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Button, Typography, Stack } from 'wip-ui'

function MyPage() {
  return (
    <Stack gap="m">
      <Typography component="h1" size="xl" fontWeight="bold">
        ページタイトル
      </Typography>
      <Button color="interactive">アクション</Button>
    </Stack>
  )
}
`})}),`
`,n.jsx(e.h2,{id:"必須ピア依存",children:"必須ピア依存"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"react"})," ^19.1.1"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"react-dom"})," ^19.1.1"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"react-aria-components"})," ^1.12.2"]}),`
`]})]})}function d(r={}){const{wrapper:e}={...o(),...r.components};return e?n.jsx(e,{...r,children:n.jsx(i,{...r})}):i(r)}export{d as default};
