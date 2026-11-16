import{u as l,j as n,M as d}from"./iframe-sXJpPmIv.js";import{T as t,$ as h,a as o,b as x,c as s,d as i}from"./index-DGZWBD50.js";import"./preload-helper-Dp1pzeXC.js";import"./Button-DA-bDr0O.js";import"./useFocusRing-BaPemmIX.js";import"./clsx-B-dksMZM.js";import"./Hidden-B8YayTWA.js";import"./usePress-Bfby1Qs7.js";import"./RSPContexts-2O2ccQ4D.js";import"./Collection-Bt-eK6KW.js";import"./DragAndDrop-1UVDQf8w.js";import"./getScrollParent-C_uBuXA-.js";import"./keyboard-CJ2EdQpd.js";import"./context-CoG8qYl0.js";import"./SelectionManager-EW-pcAk9.js";import"./FocusScope-BCf5CKBZ.js";import"./useControlledState-CF94HFoR.js";import"./SelectionIndicator-CWhFQTNb.js";import"./useLocalizedStringFormatter-BYzRIH80.js";import"./VisuallyHidden-ECSS2lPG.js";function c(r){const e={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...l(),...r.components};return n.jsxs(n.Fragment,{children:[n.jsx(d,{title:"Introduction/Overview",summary:"wip-ui の概要と inhouse デザインシステムとの関係"}),`
`,n.jsx(e.h1,{id:"wip-ui",children:"wip-ui"}),`
`,n.jsxs(e.p,{children:["wip-ui は、GMO ペパボの共通基盤デザインシステム ",n.jsx(e.a,{href:"https://design.pepabo.com/inhouse/",rel:"nofollow",children:"inhouse"})," をベースにした React コンポーネントライブラリです。"]}),`
`,n.jsx(e.h2,{id:"inhouse-とは",children:"inhouse とは"}),`
`,n.jsx(e.p,{children:"inhouse は、ペパボが展開する複数サービスに共通するデザイン原則・ガイドライン・アセットを統一した共通基盤デザインシステムです。プロダクトデザインとコミュニケーションデザインの両方をカバーし、サービスごとのブランドを維持しながら一貫性を担保します。"}),`
`,n.jsxs(e.p,{children:["詳細は ",n.jsx(e.a,{href:"https://design.pepabo.com/inhouse/",rel:"nofollow",children:"design.pepabo.com/inhouse"})," を参照してください。"]}),`
`,n.jsx(e.h2,{id:"フレーバー",children:"フレーバー"}),`
`,n.jsxs(e.p,{children:["inhouse の中核となる仕組みが ",n.jsx(e.strong,{children:"フレーバー（Flavor）"})," です。フレーバーは、ブランドごとに上書き可能なデザイントークンの集合で、以下の 5 つのカテゴリで構成されます。"]}),`
`,n.jsxs(t,{"aria-label":"フレーバーカテゴリ一覧",children:[n.jsxs(h,{children:[n.jsx(o,{id:"category",isRowHeader:!0,children:"カテゴリ"}),n.jsx(o,{id:"content",children:"内容"})]}),n.jsxs(x,{children:[n.jsxs(s,{children:[n.jsx(i,{children:n.jsx(e.strong,{children:"Color"})}),n.jsx(i,{children:"プリミティブカラーとセマンティックカラー"})]}),n.jsxs(s,{children:[n.jsx(i,{children:n.jsx(e.strong,{children:"Elevation"})}),n.jsx(i,{children:"影によるZ軸方向の奥行き表現（レベル 0〜6）"})]}),n.jsxs(s,{children:[n.jsx(i,{children:n.jsx(e.strong,{children:"Icon"})}),n.jsx(i,{children:"Material Design ベースのアイコングリッド"})]}),n.jsxs(s,{children:[n.jsx(i,{children:n.jsx(e.strong,{children:"Sizing"})}),n.jsx(i,{children:"スペーシング、ボタン高さ、角丸、線幅"})]}),n.jsxs(s,{children:[n.jsx(i,{children:n.jsx(e.strong,{children:"Typography"})}),n.jsx(i,{children:"フォントサイズ、行間、フォントファミリー"})]})]})]}),`
`,n.jsx(e.p,{children:"wip-ui では以下のフレーバーが利用可能です。Storybook のツールバーから切り替えて確認できます。"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Pepper"}),"（デフォルト）"]}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Minne"})}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Apollo"})}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Nachiguro"})}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Flippers"})}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Kung-pu"})}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Lolipop"})}),`
`]}),`
`,n.jsxs(e.p,{children:["セットアップ方法は ",n.jsx(e.a,{href:"?path=/docs/introduction-getting-started--docs",children:"Getting Started"})," を参照してください。"]}),`
`,n.jsx(e.h2,{id:"トークンの-2-層構造",children:"トークンの 2 層構造"}),`
`,n.jsx(e.p,{children:"デザイントークンはプリミティブトークンとセマンティックトークンの 2 層で管理されます。"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"プリミティブトークン"}),": 具体的な値を直接定義（例: ",n.jsx(e.code,{children:"$blue-600: #3e6f99"}),"）"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"セマンティックトークン"}),": 意味を持つ名前でプリミティブトークンを参照（例: ",n.jsx(e.code,{children:"$informative-color: $blue-600"}),"）"]}),`
`]}),`
`,n.jsx(e.p,{children:"コンポーネントではセマンティックトークンを使用してください。フレーバーを切り替えた際に、プリミティブトークンの値が変わってもセマンティックな意味が保たれます。"})]})}function E(r={}){const{wrapper:e}={...l(),...r.components};return e?n.jsx(e,{...r,children:n.jsx(c,{...r})}):c(r)}export{E as default};
