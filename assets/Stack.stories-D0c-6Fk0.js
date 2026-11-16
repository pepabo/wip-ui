import{j as e}from"./iframe-sXJpPmIv.js";import{S as s}from"./Stack-D815ajbn.js";import"./preload-helper-Dp1pzeXC.js";import"./clsx-B-dksMZM.js";import"./responsiveClasses-CaDhpJgV.js";const E=["xxs","xs","s","m","l","xl","xxl","xxxl"],J=["flex-start","center","flex-end","stretch"],P=["flex-start","center","flex-end","space-between"],q={title:"Components/Layout/Stack",component:s,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{flexDirection:{control:"select",options:["row","column"]},gap:{control:"select",options:E},alignItems:{control:"select",options:J},justifyContent:{control:"select",options:P}}},r=({children:t,height:p})=>e.jsx("div",{style:{background:"#e0e0e0",padding:"20px",borderRadius:"4px",height:p},children:t}),o=({label:t,children:p})=>e.jsxs("div",{children:[e.jsx("div",{style:{marginBottom:"4px",fontSize:"12px"},children:t}),e.jsx("div",{style:{border:"1px dashed #999",padding:"8px"},children:p})]}),n={args:{flexDirection:"column",gap:"m",alignItems:"stretch",justifyContent:"flex-start",children:e.jsxs(e.Fragment,{children:[e.jsx(r,{children:"Item 1"}),e.jsx(r,{children:"Item 2"}),e.jsx(r,{children:"Item 3"})]})}},a={name:"flexDirection",render:()=>e.jsxs(s,{gap:"l",children:[e.jsx(o,{label:"column",children:e.jsxs(s,{flexDirection:"column",gap:"s",children:[e.jsx(r,{children:"Item 1"}),e.jsx(r,{children:"Item 2"}),e.jsx(r,{children:"Item 3"})]})}),e.jsx(o,{label:"row",children:e.jsxs(s,{flexDirection:"row",gap:"s",children:[e.jsx(r,{children:"Item 1"}),e.jsx(r,{children:"Item 2"}),e.jsx(r,{children:"Item 3"})]})})]})},c={name:"flexDirection (responsive)",render:()=>e.jsxs(s,{flexDirection:{xxs:"column",m:"row"},gap:"s",children:[e.jsx(r,{children:"Item 1"}),e.jsx(r,{children:"Item 2"}),e.jsx(r,{children:"Item 3"})]})},l={name:"gap",render:()=>e.jsx(s,{gap:"l",children:E.map(t=>e.jsx(o,{label:t,children:e.jsxs(s,{flexDirection:"row",gap:t,children:[e.jsx(r,{children:"Item 1"}),e.jsx(r,{children:"Item 2"}),e.jsx(r,{children:"Item 3"})]})},t))})},i={name:"gap (responsive)",render:()=>e.jsxs(s,{gap:{xxs:"s",m:"l",xl:"xxl"},children:[e.jsx(r,{children:"Item 1"}),e.jsx(r,{children:"Item 2"}),e.jsx(r,{children:"Item 3"})]})},x={name:"alignItems",render:()=>e.jsx(s,{gap:"l",children:J.map(t=>e.jsx(o,{label:t,children:e.jsxs(s,{flexDirection:"row",gap:"s",alignItems:t,children:[e.jsx(r,{children:"Item 1"}),e.jsx(r,{height:"80px",children:"Item 2"}),e.jsx(r,{children:"Item 3"})]})},t))})},m={name:"justifyContent",render:()=>e.jsx(s,{gap:"l",children:P.map(t=>e.jsx(o,{label:t,children:e.jsxs(s,{flexDirection:"row",gap:"s",justifyContent:t,children:[e.jsx(r,{children:"Item 1"}),e.jsx(r,{children:"Item 2"}),e.jsx(r,{children:"Item 3"})]})},t))})};var d,g,I;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    flexDirection: 'column',
    gap: 'm',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    children: <>
        <Box>Item 1</Box>
        <Box>Item 2</Box>
        <Box>Item 3</Box>
      </>
  }
}`,...(I=(g=n.parameters)==null?void 0:g.docs)==null?void 0:I.source}}};var j,u,h;a.parameters={...a.parameters,docs:{...(j=a.parameters)==null?void 0:j.docs,source:{originalSource:`{
  name: 'flexDirection',
  render: () => <Stack gap="l">
      <Frame label="column">
        <Stack flexDirection="column" gap="s">
          <Box>Item 1</Box>
          <Box>Item 2</Box>
          <Box>Item 3</Box>
        </Stack>
      </Frame>
      <Frame label="row">
        <Stack flexDirection="row" gap="s">
          <Box>Item 1</Box>
          <Box>Item 2</Box>
          <Box>Item 3</Box>
        </Stack>
      </Frame>
    </Stack>
}`,...(h=(u=a.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var B,f,S;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
  name: 'flexDirection (responsive)',
  render: () => <Stack flexDirection={{
    xxs: 'column',
    m: 'row'
  }} gap="s">
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
}`,...(S=(f=c.parameters)==null?void 0:f.docs)==null?void 0:S.source}}};var k,y,D;l.parameters={...l.parameters,docs:{...(k=l.parameters)==null?void 0:k.docs,source:{originalSource:`{
  name: 'gap',
  render: () => <Stack gap="l">
      {gaps.map(gap => <Frame key={gap} label={gap}>
          <Stack flexDirection="row" gap={gap}>
            <Box>Item 1</Box>
            <Box>Item 2</Box>
            <Box>Item 3</Box>
          </Stack>
        </Frame>)}
    </Stack>
}`,...(D=(y=l.parameters)==null?void 0:y.docs)==null?void 0:D.source}}};var F,b,w;i.parameters={...i.parameters,docs:{...(F=i.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'gap (responsive)',
  render: () => <Stack gap={{
    xxs: 's',
    m: 'l',
    xl: 'xxl'
  }}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
}`,...(w=(b=i.parameters)==null?void 0:b.docs)==null?void 0:w.source}}};var C,v,R;x.parameters={...x.parameters,docs:{...(C=x.parameters)==null?void 0:C.docs,source:{originalSource:`{
  name: 'alignItems',
  render: () => <Stack gap="l">
      {alignItemsValues.map(alignItems => <Frame key={alignItems} label={alignItems}>
          <Stack flexDirection="row" gap="s" alignItems={alignItems}>
            <Box>Item 1</Box>
            <Box height="80px">Item 2</Box>
            <Box>Item 3</Box>
          </Stack>
        </Frame>)}
    </Stack>
}`,...(R=(v=x.parameters)==null?void 0:v.docs)==null?void 0:R.source}}};var G,V,A;m.parameters={...m.parameters,docs:{...(G=m.parameters)==null?void 0:G.docs,source:{originalSource:`{
  name: 'justifyContent',
  render: () => <Stack gap="l">
      {justifyContentValues.map(justifyContent => <Frame key={justifyContent} label={justifyContent}>
          <Stack flexDirection="row" gap="s" justifyContent={justifyContent}>
            <Box>Item 1</Box>
            <Box>Item 2</Box>
            <Box>Item 3</Box>
          </Stack>
        </Frame>)}
    </Stack>
}`,...(A=(V=m.parameters)==null?void 0:V.docs)==null?void 0:A.source}}};const H=["Playground","FlexDirection","FlexDirectionResponsive","Gap","GapResponsive","AlignItems","JustifyContent"];export{x as AlignItems,a as FlexDirection,c as FlexDirectionResponsive,l as Gap,i as GapResponsive,m as JustifyContent,n as Playground,H as __namedExportsOrder,q as default};
