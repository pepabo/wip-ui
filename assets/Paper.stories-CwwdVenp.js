import{j as r}from"./iframe-sXJpPmIv.js";import{P as s}from"./Paper-eh_sK8s6.js";import{S as v}from"./Stack-D815ajbn.js";import"./preload-helper-Dp1pzeXC.js";import"./clsx-B-dksMZM.js";import"./responsiveClasses-CaDhpJgV.js";const b={title:"Components/Surfaces/Paper",component:s,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{elevation:{control:"select",options:[0,1,2,3,4,5,6]},outlined:{control:"boolean"},square:{control:"boolean"}}},c=e=>r.jsx("div",{style:{padding:"20px"},children:e}),a={args:{children:c("Paper"),elevation:1,outlined:!1,square:!1}},o={name:"elevation",render:()=>r.jsx(v,{flexDirection:"row",gap:"s",children:[0,1,2,3,4,5,6].map(e=>r.jsx(s,{elevation:e,children:c(String(e))},e))})},n={name:"outlined",render:()=>r.jsx(s,{outlined:!0,children:c("outlined")})},t={name:"square",render:()=>r.jsx(s,{square:!0,children:c("square")})};var i,l,d;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    children: content('Paper'),
    elevation: 1,
    outlined: false,
    square: false
  }
}`,...(d=(l=a.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var p,u,m;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  name: 'elevation',
  render: () => <Stack flexDirection="row" gap="s">
      {([0, 1, 2, 3, 4, 5, 6] as const).map(elevation => <Paper key={elevation} elevation={elevation}>
          {content(String(elevation))}
        </Paper>)}
    </Stack>
}`,...(m=(u=o.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var g,P,S;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  name: 'outlined',
  render: () => <Paper outlined>{content('outlined')}</Paper>
}`,...(S=(P=n.parameters)==null?void 0:P.docs)==null?void 0:S.source}}};var x,f,q;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  name: 'square',
  render: () => <Paper square>{content('square')}</Paper>
}`,...(q=(f=t.parameters)==null?void 0:f.docs)==null?void 0:q.source}}};const w=["Playground","Elevation","Outlined","Square"];export{o as Elevation,n as Outlined,a as Playground,t as Square,w as __namedExportsOrder,b as default};
