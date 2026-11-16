import{j as e}from"./iframe-sXJpPmIv.js";import{I as d}from"./index-2dXvtocF.js";import{L as r}from"./index-AheSUmAU.js";import{S as n}from"./Stack-D815ajbn.js";import"./preload-helper-Dp1pzeXC.js";import"./clsx-B-dksMZM.js";import"./Button-9v928iZ3.js";import"./Button-DA-bDr0O.js";import"./useFocusRing-BaPemmIX.js";import"./Hidden-B8YayTWA.js";import"./usePress-Bfby1Qs7.js";import"./Link-C23NS2B7.js";import"./responsiveClasses-CaDhpJgV.js";const M={title:"Components/Actions/LinkButton",component:r,parameters:{layout:"centered"},tags:["autodocs"]},a={args:{href:"#",children:"LinkButton",appearance:"flat",color:"neutral",size:"m",width:"auto",isDisabled:!1}},t={name:"appearance",render:()=>e.jsxs(n,{flexDirection:"row",gap:"s",alignItems:"center",children:[e.jsx(r,{href:"#",appearance:"flat",children:"flat"}),e.jsx(r,{href:"#",appearance:"outlined",children:"outlined"}),e.jsx(r,{href:"#",appearance:"transparent",children:"transparent"}),e.jsx("div",{style:{background:"#333",padding:"8px"},children:e.jsx(r,{href:"#",appearance:"white",children:"white"})})]})},i={name:"color",render:()=>e.jsxs(n,{flexDirection:"row",gap:"s",children:[e.jsx(r,{href:"#",color:"neutral",children:"neutral"}),e.jsx(r,{href:"#",color:"interactive",children:"interactive"}),e.jsx(r,{href:"#",color:"negative",children:"negative"})]})},o={name:"size",render:()=>e.jsxs(n,{flexDirection:"row",gap:"s",alignItems:"center",children:[e.jsx(r,{href:"#",size:"s",children:"s"}),e.jsx(r,{href:"#",size:"m",children:"m"}),e.jsx(r,{href:"#",size:"l",children:"l"})]})},s={name:"width",parameters:{layout:"padded"},render:()=>e.jsxs(n,{gap:"s",children:[e.jsx(r,{href:"#",width:"auto",children:"auto"}),e.jsx(r,{href:"#",width:"third",children:"third"}),e.jsx(r,{href:"#",width:"half",children:"half"}),e.jsx(r,{href:"#",width:"full",children:"full"})]})},c={name:"leading / trailing",render:()=>e.jsxs(n,{flexDirection:"row",gap:"s",children:[e.jsx(r,{href:"#",leading:e.jsx(d,{name:"download","aria-hidden":"true"}),children:"leading"}),e.jsx(r,{href:"#",target:"_blank",trailing:e.jsx(d,{name:"arrow_cross","aria-hidden":"true"}),children:"trailing"})]})},l={name:"iconOnly",render:()=>e.jsx(r,{href:"#",iconOnly:!0,"aria-label":"検索",children:e.jsx(d,{name:"magnifying_glass","aria-hidden":"true"})})};var p,u,h;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    href: '#',
    children: 'LinkButton',
    appearance: 'flat',
    color: 'neutral',
    size: 'm',
    width: 'auto',
    isDisabled: false
  }
}`,...(h=(u=a.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var m,f,g;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  name: 'appearance',
  render: () => <Stack flexDirection="row" gap="s" alignItems="center">
      <LinkButton href="#" appearance="flat">
        flat
      </LinkButton>
      <LinkButton href="#" appearance="outlined">
        outlined
      </LinkButton>
      <LinkButton href="#" appearance="transparent">
        transparent
      </LinkButton>
      <div style={{
      background: '#333',
      padding: '8px'
    }}>
        <LinkButton href="#" appearance="white">
          white
        </LinkButton>
      </div>
    </Stack>
}`,...(g=(f=t.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};var k,L,x;i.parameters={...i.parameters,docs:{...(k=i.parameters)==null?void 0:k.docs,source:{originalSource:`{
  name: 'color',
  render: () => <Stack flexDirection="row" gap="s">
      <LinkButton href="#" color="neutral">
        neutral
      </LinkButton>
      <LinkButton href="#" color="interactive">
        interactive
      </LinkButton>
      <LinkButton href="#" color="negative">
        negative
      </LinkButton>
    </Stack>
}`,...(x=(L=i.parameters)==null?void 0:L.docs)==null?void 0:x.source}}};var B,j,w;o.parameters={...o.parameters,docs:{...(B=o.parameters)==null?void 0:B.docs,source:{originalSource:`{
  name: 'size',
  render: () => <Stack flexDirection="row" gap="s" alignItems="center">
      <LinkButton href="#" size="s">
        s
      </LinkButton>
      <LinkButton href="#" size="m">
        m
      </LinkButton>
      <LinkButton href="#" size="l">
        l
      </LinkButton>
    </Stack>
}`,...(w=(j=o.parameters)==null?void 0:j.docs)==null?void 0:w.source}}};var S,y,z;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`{
  name: 'width',
  parameters: {
    layout: 'padded'
  },
  render: () => <Stack gap="s">
      <LinkButton href="#" width="auto">
        auto
      </LinkButton>
      <LinkButton href="#" width="third">
        third
      </LinkButton>
      <LinkButton href="#" width="half">
        half
      </LinkButton>
      <LinkButton href="#" width="full">
        full
      </LinkButton>
    </Stack>
}`,...(z=(y=s.parameters)==null?void 0:y.docs)==null?void 0:z.source}}};var v,I,D;c.parameters={...c.parameters,docs:{...(v=c.parameters)==null?void 0:v.docs,source:{originalSource:`{
  name: 'leading / trailing',
  render: () => <Stack flexDirection="row" gap="s">
      <LinkButton href="#" leading={<Icon name="download" aria-hidden="true" />}>
        leading
      </LinkButton>
      <LinkButton href="#" target="_blank" trailing={<Icon name="arrow_cross" aria-hidden="true" />}>
        trailing
      </LinkButton>
    </Stack>
}`,...(D=(I=c.parameters)==null?void 0:I.docs)==null?void 0:D.source}}};var b,_,O;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`{
  name: 'iconOnly',
  render: () => <LinkButton href="#" iconOnly aria-label="検索">
      <Icon name="magnifying_glass" aria-hidden="true" />
    </LinkButton>
}`,...(O=(_=l.parameters)==null?void 0:_.docs)==null?void 0:O.source}}};const N=["Playground","Appearance","Color","Size","Width","LeadingAndTrailing","IconOnly"];export{t as Appearance,i as Color,l as IconOnly,c as LeadingAndTrailing,a as Playground,o as Size,s as Width,N as __namedExportsOrder,M as default};
