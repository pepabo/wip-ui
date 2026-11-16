import{u as i,j as n,M as r,C as t}from"./iframe-sXJpPmIv.js";import{Levels as l}from"./Elevation.stories-WLRCvGY2.js";import"./preload-helper-Dp1pzeXC.js";import"./GridItem-CXERTE3O.js";import"./clsx-B-dksMZM.js";import"./responsiveClasses-CaDhpJgV.js";import"./Paper-eh_sK8s6.js";import"./index-UgKjwJhE.js";import"./Stack-D815ajbn.js";function s(o){const e={a:"a",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...i(),...o.components};return n.jsxs(n.Fragment,{children:[n.jsx(r,{title:"Foundations/Elevation",summary:"エレベーション（影）による奥行き表現のガイドライン"}),`
`,n.jsx(e.h1,{id:"elevation",children:"Elevation"}),`
`,n.jsxs(e.p,{children:["wip-ui のエレベーションは ",n.jsx(e.a,{href:"https://design.pepabo.com/inhouse/flavors/elevation/",rel:"nofollow",children:"inhouse のエレベーショントークン"})," に基づいています。影（box-shadow）を使って Z 軸方向の奥行きを表現し、要素間の階層関係をユーザーに伝えます。"]}),`
`,n.jsx(e.h2,{id:"レベル",children:"レベル"}),`
`,n.jsx(e.p,{children:"7 段階のエレベーションレベルが定義されています。数値が大きいほどユーザーに近い位置にあることを示します。"}),`
`,n.jsx(t,{of:l,sourceState:"none"}),`
`,n.jsx(e.h2,{id:"スタックの分類",children:"スタックの分類"}),`
`,n.jsx(e.h3,{id:"major-stack",children:"Major Stack"}),`
`,n.jsx(e.p,{children:"画面全体の「地面（ground plane）」を基準とした絶対的な重なり順を定義します。新しいスタッキングコンテキストを作り、z-index の関係を決定します。"}),`
`,n.jsx(e.h3,{id:"minor-stack",children:"Minor Stack"}),`
`,n.jsx(e.p,{children:"Major Stack の上に相対的に重なる要素です。"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"On タイプ"}),": 前の要素の上に積み重なる。新しいスタッキングコンテキストは作らない（例: ボタン、カード）"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Over タイプ"}),": スタッキングコンテキストを作り、他の要素の上に浮かぶ（例: ヘッダー、メニュー、ダイアログ）"]}),`
`]})]})}function f(o={}){const{wrapper:e}={...i(),...o.components};return e?n.jsx(e,{...o,children:n.jsx(s,{...o})}):s(o)}export{f as default};
