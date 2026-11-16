import{j as e}from"./iframe-sXJpPmIv.js";import{c as j}from"./clsx-B-dksMZM.js";import{S as b}from"./Stack-D815ajbn.js";import"./preload-helper-Dp1pzeXC.js";import"./responsiveClasses-CaDhpJgV.js";const s=({size:o="m",message:l,className:z,..._})=>e.jsxs("div",{className:j("wip-loader",`-size-${o}`,z),..._,children:[e.jsx("div",{className:"wip-loader__spinner"}),l&&e.jsx("div",{className:"wip-loader__message",children:l})]});try{s.displayName="Loader",s.__docgenInfo={description:"",displayName:"Loader",props:{size:{defaultValue:{value:"m"},description:"ローダーのサイズ",name:"size",required:!1,type:{name:"enum",value:[{value:'"s"'},{value:'"m"'},{value:'"l"'},{value:'"xl"'},{value:'"xxl"'}]}},message:{defaultValue:null,description:"ローダーの下に表示するメッセージテキスト",name:"message",required:!1,type:{name:"string"}}}}}catch{}const B={title:"Components/Feedback/Loader",component:s,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:"select",options:["s","m","l","xl","xxl"]},message:{control:"text"}}},a={args:{size:"m",message:"読み込み中...",role:"status"}},r={name:"size",render:()=>e.jsxs(b,{flexDirection:"row",gap:"s",alignItems:"center",children:[e.jsx(s,{size:"s",role:"status","aria-label":"読み込み中"}),e.jsx(s,{size:"m",role:"status","aria-label":"読み込み中"}),e.jsx(s,{size:"l",role:"status","aria-label":"読み込み中"}),e.jsx(s,{size:"xl",role:"status","aria-label":"読み込み中"}),e.jsx(s,{size:"xxl",role:"status","aria-label":"読み込み中"})]})},t={name:"message",render:()=>e.jsx(s,{message:"読み込み中...",role:"status"})};var u,i,n;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    size: 'm',
    message: '読み込み中...',
    role: 'status'
  }
}`,...(n=(i=a.parameters)==null?void 0:i.docs)==null?void 0:n.source}}};var m,c,d;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  name: 'size',
  render: () => <Stack flexDirection="row" gap="s" alignItems="center">
      <Loader size="s" role="status" aria-label="読み込み中" />
      <Loader size="m" role="status" aria-label="読み込み中" />
      <Loader size="l" role="status" aria-label="読み込み中" />
      <Loader size="xl" role="status" aria-label="読み込み中" />
      <Loader size="xxl" role="status" aria-label="読み込み中" />
    </Stack>
}`,...(d=(c=r.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var p,x,g;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  name: 'message',
  render: () => <Loader message="読み込み中..." role="status" />
}`,...(g=(x=t.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};const S=["Playground","Size","Message"];export{t as Message,a as Playground,r as Size,S as __namedExportsOrder,B as default};
