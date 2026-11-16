import{j as e}from"./iframe-sXJpPmIv.js";import{C as s}from"./Container-D0n19-zG.js";import{S as z}from"./Stack-D815ajbn.js";import"./preload-helper-Dp1pzeXC.js";import"./clsx-B-dksMZM.js";import"./responsiveClasses-CaDhpJgV.js";const b={title:"Components/Layout/Container",component:s,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{size:{control:"select",options:["xs","s","m","l","xl"]},isGapless:{control:"boolean"}}},r=({children:g})=>e.jsx("div",{style:{background:"#e0e0e0",padding:"20px"},children:g}),n={args:{size:"l",isGapless:!1,children:e.jsx(r,{children:"Container"})}},o={name:"size",render:()=>e.jsxs(z,{gap:"s",children:[e.jsx(s,{size:"xs",children:e.jsx(r,{children:"xs"})}),e.jsx(s,{size:"s",children:e.jsx(r,{children:"s"})}),e.jsx(s,{size:"m",children:e.jsx(r,{children:"m"})}),e.jsx(s,{size:"l",children:e.jsx(r,{children:"l"})}),e.jsx(s,{size:"xl",children:e.jsx(r,{children:"xl"})})]})},a={name:"isGapless",render:()=>e.jsxs(z,{gap:"s",children:[e.jsx(s,{children:e.jsx(r,{children:"false"})}),e.jsx(s,{isGapless:!0,children:e.jsx(r,{children:"true"})})]})},i={name:"component",render:()=>e.jsx(s,{component:"main",children:e.jsx(r,{children:"main"})})};var t,c,l;n.parameters={...n.parameters,docs:{...(t=n.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    size: 'l',
    isGapless: false,
    children: <Box>Container</Box>
  }
}`,...(l=(c=n.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var x,p,m;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  name: 'size',
  render: () => <Stack gap="s">
      <Container size="xs">
        <Box>xs</Box>
      </Container>
      <Container size="s">
        <Box>s</Box>
      </Container>
      <Container size="m">
        <Box>m</Box>
      </Container>
      <Container size="l">
        <Box>l</Box>
      </Container>
      <Container size="xl">
        <Box>xl</Box>
      </Container>
    </Stack>
}`,...(m=(p=o.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var d,u,C;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  name: 'isGapless',
  render: () => <Stack gap="s">
      <Container>
        <Box>false</Box>
      </Container>
      <Container isGapless>
        <Box>true</Box>
      </Container>
    </Stack>
}`,...(C=(u=a.parameters)==null?void 0:u.docs)==null?void 0:C.source}}};var j,h,B;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  name: 'component',
  render: () => <Container component="main">
      <Box>main</Box>
    </Container>
}`,...(B=(h=i.parameters)==null?void 0:h.docs)==null?void 0:B.source}}};const E=["Playground","Size","IsGapless","ComponentProp"];export{i as ComponentProp,a as IsGapless,n as Playground,o as Size,E as __namedExportsOrder,b as default};
