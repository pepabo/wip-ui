import{j as e}from"./iframe-sXJpPmIv.js";import{S as r}from"./index-DIICFT21.js";import{S as k}from"./Stack-D815ajbn.js";import"./preload-helper-Dp1pzeXC.js";import"./clsx-B-dksMZM.js";import"./responsiveClasses-CaDhpJgV.js";const h={title:"Components/Data Display/Sticker",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{color:{control:"select",options:["neutral","informative","positive","negative","notice","attention"]},size:{control:"select",options:["s","m"]}},args:{children:"Sticker"}},o={args:{color:"neutral",size:"m"}},t={name:"color",render:()=>e.jsxs(k,{flexDirection:"row",gap:"s",children:[e.jsx(r,{color:"neutral",children:"neutral"}),e.jsx(r,{color:"informative",children:"informative"}),e.jsx(r,{color:"positive",children:"positive"}),e.jsx(r,{color:"negative",children:"negative"}),e.jsx(r,{color:"notice",children:"notice"}),e.jsx(r,{color:"attention",children:"attention"})]})},i={name:"size",render:()=>e.jsxs(k,{flexDirection:"row",gap:"s",alignItems:"center",children:[e.jsx(r,{size:"s",children:"s"}),e.jsx(r,{size:"m",children:"m"})]})};var c,s,a;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    color: 'neutral',
    size: 'm'
  }
}`,...(a=(s=o.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};var n,l,m;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  name: 'color',
  render: () => <Stack flexDirection="row" gap="s">
      <Sticker color="neutral">neutral</Sticker>
      <Sticker color="informative">informative</Sticker>
      <Sticker color="positive">positive</Sticker>
      <Sticker color="negative">negative</Sticker>
      <Sticker color="notice">notice</Sticker>
      <Sticker color="attention">attention</Sticker>
    </Stack>
}`,...(m=(l=t.parameters)==null?void 0:l.docs)==null?void 0:m.source}}};var p,d,S;i.parameters={...i.parameters,docs:{...(p=i.parameters)==null?void 0:p.docs,source:{originalSource:`{
  name: 'size',
  render: () => <Stack flexDirection="row" gap="s" alignItems="center">
      <Sticker size="s">s</Sticker>
      <Sticker size="m">m</Sticker>
    </Stack>
}`,...(S=(d=i.parameters)==null?void 0:d.docs)==null?void 0:S.source}}};const z=["Playground","Color","Size"];export{t as Color,o as Playground,i as Size,z as __namedExportsOrder,h as default};
