import{j as e}from"./iframe-sXJpPmIv.js";import"./index-AheSUmAU.js";import{S as t}from"./index-DIICFT21.js";import{T as x}from"./index-D7obMvsE.js";import{T as s}from"./index-UgKjwJhE.js";import{S as o}from"./Stack-D815ajbn.js";import{B as n}from"./Button-9v928iZ3.js";import"./preload-helper-Dp1pzeXC.js";import"./Link-C23NS2B7.js";import"./useFocusRing-BaPemmIX.js";import"./clsx-B-dksMZM.js";import"./usePress-Bfby1Qs7.js";import"./FieldError-3y1QMZNu.js";import"./useLabels-DibSWiaJ.js";import"./Hidden-B8YayTWA.js";import"./Text-zFl1_KhZ.js";import"./RSPContexts-2O2ccQ4D.js";import"./Form-DLxKANZm.js";import"./useFormReset-DYu2WFqP.js";import"./useControlledState-CF94HFoR.js";import"./responsiveClasses-CaDhpJgV.js";import"./Button-DA-bDr0O.js";const p=({flavor:r="pepper",children:i})=>e.jsx("div",{"data-flavor":r,style:{display:"contents"},children:i});try{p.displayName="FlavorProvider",p.__docgenInfo={description:"",displayName:"FlavorProvider",props:{flavor:{defaultValue:{value:"pepper"},description:"適用するデザイントークンのフレーバー。省略時は `pepper`。",name:"flavor",required:!1,type:{name:"enum",value:[{value:'"pepper"'},{value:'"minne"'},{value:'"apollo"'},{value:'"nachiguro"'},{value:'"flippers"'},{value:'"kung-pu"'},{value:'"lolipop"'}]}},children:{defaultValue:null,description:"フレーバーを適用する対象の React 要素",name:"children",required:!1,type:{name:"ReactNode"}}}}}catch{}const h=[{flavor:"lolipop",label:"lolipop（ロリポップ！）"},{flavor:"apollo",label:"apollo（ゲーマーズ）"},{flavor:"pepper",label:"pepper（既定・利用実績なし）"},{flavor:"minne",label:"minne（利用実績なし）"},{flavor:"nachiguro",label:"nachiguro（利用実績なし）"},{flavor:"flippers",label:"flippers（利用実績なし）"},{flavor:"kung-pu",label:"kung-pu（利用実績なし）"}],g=()=>e.jsxs(o,{gap:"m",children:[e.jsx(s,{component:"span",size:"xl",fontWeight:"bold",children:"見出し"}),e.jsx(s,{children:"本文のテキストです。フレーバーによって、色や形が変わります。"}),e.jsxs(o,{flexDirection:"row",gap:"s",children:[e.jsx(n,{color:"interactive",children:"保存"}),e.jsx(n,{appearance:"outlined",children:"キャンセル"}),e.jsx(n,{color:"negative",children:"削除"})]}),e.jsx(x,{label:"メールアドレス",placeholder:"email@example.com"}),e.jsxs(o,{flexDirection:"row",gap:"s",children:[e.jsx(t,{color:"positive",children:"稼働中"}),e.jsx(t,{color:"notice",children:"要確認"}),e.jsx(t,{color:"negative",children:"停止中"})]})]}),O={title:"Introduction/FlavorProvider",component:p,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{flavor:{control:"select",options:h.map(({flavor:r})=>r)},children:{control:!1}}},a={args:{flavor:"lolipop",children:e.jsx(g,{})}},l={name:"flavor",render:()=>e.jsx(o,{gap:"xl",children:h.map(({flavor:r,label:i})=>e.jsxs(o,{gap:"s",children:[e.jsx(s,{component:"h3",size:"l",fontWeight:"bold",children:i}),e.jsx(p,{flavor:r,children:e.jsx(g,{})})]},r))})};var c,u,d;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    flavor: 'lolipop',
    children: <Sample />
  }
}`,...(d=(u=a.parameters)==null?void 0:u.docs)==null?void 0:d.source}}};var m,v,f;l.parameters={...l.parameters,docs:{...(m=l.parameters)==null?void 0:m.docs,source:{originalSource:`{
  name: 'flavor',
  render: () => <Stack gap="xl">
      {flavors.map(({
      flavor,
      label
    }) => <Stack key={flavor} gap="s">
          <Typography component="h3" size="l" fontWeight="bold">
            {label}
          </Typography>
          <FlavorProvider flavor={flavor}>
            <Sample />
          </FlavorProvider>
        </Stack>)}
    </Stack>
}`,...(f=(v=l.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};const G=["Playground","Flavor"];export{l as Flavor,a as Playground,G as __namedExportsOrder,O as default};
