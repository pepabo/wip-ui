import{j as e}from"./iframe-sXJpPmIv.js";import{I as p}from"./index-2dXvtocF.js";import"./index-AheSUmAU.js";import{B as r}from"./Button-9v928iZ3.js";import{S as a}from"./Stack-D815ajbn.js";import"./preload-helper-Dp1pzeXC.js";import"./clsx-B-dksMZM.js";import"./Link-C23NS2B7.js";import"./useFocusRing-BaPemmIX.js";import"./usePress-Bfby1Qs7.js";import"./Button-DA-bDr0O.js";import"./Hidden-B8YayTWA.js";import"./responsiveClasses-CaDhpJgV.js";const V={title:"Components/Actions/Button",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{appearance:{control:"select",options:["flat","outlined","transparent","white"]},color:{control:"select",options:["neutral","interactive","negative"]},size:{control:"select",options:["s","m","l"]},width:{control:"select",options:["auto","half","third","full"]},isDisabled:{control:"boolean"}}},t={args:{children:"Button",appearance:"flat",color:"neutral",size:"m",width:"auto",isDisabled:!1}},n={name:"appearance",render:()=>e.jsxs(a,{flexDirection:"row",gap:"s",alignItems:"center",children:[e.jsx(r,{appearance:"flat",children:"flat"}),e.jsx(r,{appearance:"outlined",children:"outlined"}),e.jsx(r,{appearance:"transparent",children:"transparent"}),e.jsx("div",{style:{background:"#333",padding:"8px"},children:e.jsx(r,{appearance:"white",children:"white"})})]})},o={name:"color",render:()=>e.jsxs(a,{flexDirection:"row",gap:"s",children:[e.jsx(r,{color:"neutral",children:"neutral"}),e.jsx(r,{color:"interactive",children:"interactive"}),e.jsx(r,{color:"negative",children:"negative"})]})},i={name:"size",render:()=>e.jsxs(a,{flexDirection:"row",gap:"s",alignItems:"center",children:[e.jsx(r,{size:"s",children:"s"}),e.jsx(r,{size:"m",children:"m"}),e.jsx(r,{size:"l",children:"l"})]})},s={name:"width",parameters:{layout:"padded"},render:()=>e.jsxs(a,{gap:"s",children:[e.jsx(r,{width:"auto",children:"auto"}),e.jsx(r,{width:"third",children:"third"}),e.jsx(r,{width:"half",children:"half"}),e.jsx(r,{width:"full",children:"full"})]})},c={name:"isDisabled",render:()=>e.jsx(r,{isDisabled:!0,children:"Disabled"})},l={name:"leading / trailing",render:()=>e.jsxs(a,{flexDirection:"row",gap:"s",children:[e.jsx(r,{leading:e.jsx(p,{name:"download","aria-hidden":"true"}),children:"leading"}),e.jsx(r,{trailing:e.jsx(p,{name:"arrow_right","aria-hidden":"true"}),children:"trailing"})]})},d={name:"iconOnly",render:()=>e.jsx(r,{iconOnly:!0,"aria-label":"検索",children:e.jsx(p,{name:"magnifying_glass","aria-hidden":"true"})})};var u,m,h;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    children: 'Button',
    appearance: 'flat',
    color: 'neutral',
    size: 'm',
    width: 'auto',
    isDisabled: false
  }
}`,...(h=(m=t.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};var g,x,B;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  name: 'appearance',
  render: () => <Stack flexDirection="row" gap="s" alignItems="center">
      <Button appearance="flat">flat</Button>
      <Button appearance="outlined">outlined</Button>
      <Button appearance="transparent">transparent</Button>
      <div style={{
      background: '#333',
      padding: '8px'
    }}>
        <Button appearance="white">white</Button>
      </div>
    </Stack>
}`,...(B=(x=n.parameters)==null?void 0:x.docs)==null?void 0:B.source}}};var f,w,j;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  name: 'color',
  render: () => <Stack flexDirection="row" gap="s">
      <Button color="neutral">neutral</Button>
      <Button color="interactive">interactive</Button>
      <Button color="negative">negative</Button>
    </Stack>
}`,...(j=(w=o.parameters)==null?void 0:w.docs)==null?void 0:j.source}}};var S,D,b;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  name: 'size',
  render: () => <Stack flexDirection="row" gap="s" alignItems="center">
      <Button size="s">s</Button>
      <Button size="m">m</Button>
      <Button size="l">l</Button>
    </Stack>
}`,...(b=(D=i.parameters)==null?void 0:D.docs)==null?void 0:b.source}}};var y,k,v;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'width',
  parameters: {
    layout: 'padded'
  },
  render: () => <Stack gap="s">
      <Button width="auto">auto</Button>
      <Button width="third">third</Button>
      <Button width="half">half</Button>
      <Button width="full">full</Button>
    </Stack>
}`,...(v=(k=s.parameters)==null?void 0:k.docs)==null?void 0:v.source}}};var z,I,O;c.parameters={...c.parameters,docs:{...(z=c.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'isDisabled',
  render: () => <Button isDisabled>Disabled</Button>
}`,...(O=(I=c.parameters)==null?void 0:I.docs)==null?void 0:O.source}}};var _,A,C;l.parameters={...l.parameters,docs:{...(_=l.parameters)==null?void 0:_.docs,source:{originalSource:`{
  name: 'leading / trailing',
  render: () => <Stack flexDirection="row" gap="s">
      <Button leading={<Icon name="download" aria-hidden="true" />}>leading</Button>
      <Button trailing={<Icon name="arrow_right" aria-hidden="true" />}>trailing</Button>
    </Stack>
}`,...(C=(A=l.parameters)==null?void 0:A.docs)==null?void 0:C.source}}};var T,E,L;d.parameters={...d.parameters,docs:{...(T=d.parameters)==null?void 0:T.docs,source:{originalSource:`{
  name: 'iconOnly',
  render: () => <Button iconOnly aria-label="検索">
      <Icon name="magnifying_glass" aria-hidden="true" />
    </Button>
}`,...(L=(E=d.parameters)==null?void 0:E.docs)==null?void 0:L.source}}};const X=["Playground","Appearance","Color","Size","Width","IsDisabled","LeadingAndTrailing","IconOnly"];export{n as Appearance,o as Color,d as IconOnly,c as IsDisabled,l as LeadingAndTrailing,t as Playground,i as Size,s as Width,X as __namedExportsOrder,V as default};
