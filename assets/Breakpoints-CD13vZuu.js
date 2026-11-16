import{u as d,j as e,M as o,C as l}from"./iframe-sXJpPmIv.js";import{Indicator as t}from"./Breakpoints.stories-DvcxJN6Q.js";import{T as p,$ as h,a as c,b as j,c as r,d as s}from"./index-DGZWBD50.js";import"./preload-helper-Dp1pzeXC.js";import"./index-UgKjwJhE.js";import"./clsx-B-dksMZM.js";import"./responsiveClasses-CaDhpJgV.js";import"./Stack-D815ajbn.js";import"./Button-DA-bDr0O.js";import"./useFocusRing-BaPemmIX.js";import"./Hidden-B8YayTWA.js";import"./usePress-Bfby1Qs7.js";import"./RSPContexts-2O2ccQ4D.js";import"./Collection-Bt-eK6KW.js";import"./DragAndDrop-1UVDQf8w.js";import"./getScrollParent-C_uBuXA-.js";import"./keyboard-CJ2EdQpd.js";import"./context-CoG8qYl0.js";import"./SelectionManager-EW-pcAk9.js";import"./FocusScope-BCf5CKBZ.js";import"./useControlledState-CF94HFoR.js";import"./SelectionIndicator-CWhFQTNb.js";import"./useLocalizedStringFormatter-BYzRIH80.js";import"./VisuallyHidden-ECSS2lPG.js";function x(i){const n={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...d(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Foundations/Breakpoints",summary:"レスポンシブデザインのブレークポイント定義"}),`
`,e.jsx(n.h1,{id:"breakpoints",children:"Breakpoints"}),`
`,e.jsx(n.p,{children:"wip-ui のレスポンシブ対応は 7 段階のブレークポイントで構成されています。"}),`
`,e.jsx(n.p,{children:"ブラウザのウィンドウ幅を変更すると、アクティブなブレークポイントがリアルタイムで切り替わります。"}),`
`,e.jsx(l,{of:t,sourceState:"none"}),`
`,e.jsxs(p,{"aria-label":"ブレークポイント一覧",children:[e.jsxs(h,{children:[e.jsx(c,{id:"name",isRowHeader:!0,children:"名前"}),e.jsx(c,{id:"width",children:"幅"}),e.jsx(c,{id:"usage",children:"主な用途"})]}),e.jsxs(j,{children:[e.jsxs(r,{children:[e.jsx(s,{children:e.jsx("code",{children:"xxs"})}),e.jsx(s,{children:"330px〜"}),e.jsx(s,{children:"小型スマートフォン"})]}),e.jsxs(r,{children:[e.jsx(s,{children:e.jsx("code",{children:"xs"})}),e.jsx(s,{children:"480px〜"}),e.jsx(s,{children:"スマートフォン"})]}),e.jsxs(r,{children:[e.jsx(s,{children:e.jsx("code",{children:"s"})}),e.jsx(s,{children:"600px〜"}),e.jsx(s,{children:"大型スマートフォン・小型タブレット"})]}),e.jsxs(r,{children:[e.jsx(s,{children:e.jsx("code",{children:"m"})}),e.jsx(s,{children:"768px〜"}),e.jsx(s,{children:"タブレット"})]}),e.jsxs(r,{children:[e.jsx(s,{children:e.jsx("code",{children:"l"})}),e.jsx(s,{children:"1024px〜"}),e.jsx(s,{children:"小型デスクトップ"})]}),e.jsxs(r,{children:[e.jsx(s,{children:e.jsx("code",{children:"xl"})}),e.jsx(s,{children:"1280px〜"}),e.jsx(s,{children:"デスクトップ"})]}),e.jsxs(r,{children:[e.jsx(s,{children:e.jsx("code",{children:"xxl"})}),e.jsx(s,{children:"1400px〜"}),e.jsx(s,{children:"大型デスクトップ"})]})]})]}),`
`,e.jsx(n.h2,{id:"レスポンシブ-props",children:"レスポンシブ Props"}),`
`,e.jsx(n.p,{children:"多くのコンポーネントの prop がブレークポイントごとの指定に対応しています。単一の値を渡すと全画面幅で適用され、オブジェクトを渡すとブレークポイントごとに切り替わります。"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`// 全画面幅で同じ値
<Stack gap="m">...</Stack>

// ブレークポイントごとに切り替え
<Stack gap={{ xxs: 's', m: 'l' }}>...</Stack>
`})}),`
`,e.jsx(n.h2,{id:"responsive-型",children:"Responsive 型"}),`
`,e.jsxs(n.p,{children:["レスポンシブ対応の prop は ",e.jsx(n.code,{children:"Responsive<T>"})," 型で定義されています。"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`type Responsive<T> = T | {
  xxs?: T
  xs?: T
  s?: T
  m?: T
  l?: T
  xl?: T
  xxl?: T
}
`})}),`
`,e.jsx(n.p,{children:"指定したブレークポイント以上の画面幅で値が適用されます。未指定のブレークポイントは、より小さいブレークポイントの値を継承します。"})]})}function I(i={}){const{wrapper:n}={...d(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(x,{...i})}):x(i)}export{I as default};
