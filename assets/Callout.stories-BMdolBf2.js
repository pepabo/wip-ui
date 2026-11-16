import{R as N,j as e}from"./iframe-sXJpPmIv.js";import"./index-AheSUmAU.js";import{I as A}from"./index-2dXvtocF.js";import{c as I}from"./clsx-B-dksMZM.js";import{S as i}from"./Stack-D815ajbn.js";import{B as u}from"./Button-9v928iZ3.js";import"./preload-helper-Dp1pzeXC.js";import"./Link-C23NS2B7.js";import"./useFocusRing-BaPemmIX.js";import"./usePress-Bfby1Qs7.js";import"./responsiveClasses-CaDhpJgV.js";import"./Button-DA-bDr0O.js";import"./Hidden-B8YayTWA.js";const w=o=>{switch(o){case"negative":case"notice":return"exclamation_on_triangle";case"positive":return"check_on_circle";default:return"info_on_circle"}},a=({color:o="informative",appearance:F="flat",children:_,action:c,className:y,...E})=>{const S=I("wip-callout",`-color-${o}`,`-appearance-${F}`,c&&"-has-action",y),k=c?N.cloneElement(c):null;return e.jsxs("div",{className:S,...E,children:[e.jsx(A,{name:w(o),className:"wip-callout-icon"}),e.jsx("div",{className:"wip-callout-content",children:_}),k]})};try{a.displayName="Callout",a.__docgenInfo={description:"",displayName:"Callout",props:{color:{defaultValue:{value:"informative"},description:"コールアウトのセマンティックカラー",name:"color",required:!1,type:{name:"enum",value:[{value:'"informative"'},{value:'"positive"'},{value:'"notice"'},{value:'"negative"'},{value:'"neutral"'}]}},appearance:{defaultValue:{value:"flat"},description:"コールアウトの外観スタイル",name:"appearance",required:!1,type:{name:"enum",value:[{value:'"flat"'},{value:'"outline"'}]}},action:{defaultValue:null,description:"右側に表示するアクション要素（ボタンやアイコン）",name:"action",required:!1,type:{name:"ReactNode"}}}}}catch{}const K={title:"Components/Feedback/Callout",component:a,parameters:{layout:"padded"},tags:["autodocs"],args:{children:null},argTypes:{color:{control:"select",options:["informative","neutral","negative","notice","positive"]},appearance:{control:"select",options:["flat","outline"]}}},r={args:{children:"メンテナンスのため、10月30日 2:00〜4:00 はサービスを利用できません。",color:"informative",appearance:"flat"}},t={name:"color",render:()=>e.jsxs(i,{gap:"s",children:[e.jsx(a,{color:"informative",children:"informative"}),e.jsx(a,{color:"positive",children:"positive"}),e.jsx(a,{color:"negative",children:"negative"}),e.jsx(a,{color:"notice",children:"notice"}),e.jsx(a,{color:"neutral",children:"neutral"})]})},n={name:"appearance",render:()=>e.jsxs(i,{gap:"s",children:[e.jsx(a,{appearance:"flat",children:"flat"}),e.jsx(a,{appearance:"outline",children:"outline"})]})},l={name:"action",render:()=>e.jsxs(i,{gap:"s",children:[e.jsx(a,{color:"negative",action:e.jsx(u,{appearance:"outlined",color:"negative",children:"再試行"}),children:"データを読み込めませんでした。"}),e.jsx(a,{color:"notice",action:e.jsx(u,{appearance:"transparent",size:"s",iconOnly:!0,"aria-label":"閉じる",children:e.jsx(A,{name:"cross","aria-hidden":"true"})}),children:"10月30日 2:00〜4:00 は、管理画面を利用できません。"})]})};var s,p,m;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    children: 'メンテナンスのため、10月30日 2:00〜4:00 はサービスを利用できません。',
    color: 'informative',
    appearance: 'flat'
  }
}`,...(m=(p=r.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var d,v,f;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  name: 'color',
  render: () => <Stack gap="s">
      <Callout color="informative">informative</Callout>
      <Callout color="positive">positive</Callout>
      <Callout color="negative">negative</Callout>
      <Callout color="notice">notice</Callout>
      <Callout color="neutral">neutral</Callout>
    </Stack>
}`,...(f=(v=t.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};var C,g,h;n.parameters={...n.parameters,docs:{...(C=n.parameters)==null?void 0:C.docs,source:{originalSource:`{
  name: 'appearance',
  render: () => <Stack gap="s">
      <Callout appearance="flat">flat</Callout>
      <Callout appearance="outline">outline</Callout>
    </Stack>
}`,...(h=(g=n.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var x,B,j;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  name: 'action',
  render: () => <Stack gap="s">
      <Callout color="negative" action={<Button appearance="outlined" color="negative">
            再試行
          </Button>}>
        データを読み込めませんでした。
      </Callout>
      <Callout color="notice" action={<Button appearance="transparent" size="s" iconOnly aria-label="閉じる">
            <Icon name="cross" aria-hidden="true" />
          </Button>}>
        10月30日 2:00〜4:00 は、管理画面を利用できません。
      </Callout>
    </Stack>
}`,...(j=(B=l.parameters)==null?void 0:B.docs)==null?void 0:j.source}}};const L=["Playground","Color","Appearance","Action"];export{l as Action,n as Appearance,t as Color,r as Playground,L as __namedExportsOrder,K as default};
