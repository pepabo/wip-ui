import{j as e}from"./iframe-sXJpPmIv.js";import{C as se}from"./Container-D0n19-zG.js";import{P as ie}from"./Paper-eh_sK8s6.js";import{G as t,a as s}from"./GridItem-CXERTE3O.js";import{S as a}from"./Stack-D815ajbn.js";import"./preload-helper-Dp1pzeXC.js";import"./clsx-B-dksMZM.js";import"./responsiveClasses-CaDhpJgV.js";const $=["xxs","xs","s","m","l","xl","xxl","xxxl"],g=["start","end","center","stretch","space-around","space-between"],ee=["row","row-reverse","column","column-reverse"],re=["wrap","nowrap","wrap-reverse"],le={title:"Components/Layout/Grid",component:t,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{spacing:{control:"select",options:$},gapless:{control:"boolean"},alignContent:{control:"select",options:g},justifyContent:{control:"select",options:g},direction:{control:"select",options:ee},wrap:{control:"select",options:re}}},n=({children:r})=>e.jsx("div",{style:{padding:"40px"},children:e.jsx(se,{size:"xl",children:r})}),i=({children:r})=>e.jsx(ie,{style:{padding:"16px"},children:r}),z=[1,2,3].map(r=>e.jsx(s,{size:4,children:e.jsx(i,{children:r})},r)),d={args:{spacing:"m",gapless:!1,direction:"row",wrap:"wrap"},render:r=>e.jsx(n,{children:e.jsx(t,{...r,children:z})})},c={name:"spacing",render:()=>e.jsx(n,{children:e.jsx(a,{gap:"xl",children:$.map(r=>e.jsxs(t,{spacing:r,children:[e.jsx(s,{size:4,children:e.jsx(i,{children:r})}),e.jsx(s,{size:4,children:e.jsx(i,{children:r})}),e.jsx(s,{size:4,children:e.jsx(i,{children:r})})]},r))})})},m={name:"spacing (responsive)",render:()=>e.jsx(n,{children:e.jsx(t,{spacing:{xxs:"s",m:"l",xl:"xxl"},children:z})})},o={name:"gapless",render:()=>e.jsx(n,{children:e.jsx(t,{spacing:"m",gapless:!0,children:z})})},p={name:"justifyContent",render:()=>e.jsx(n,{children:e.jsx(a,{gap:"xl",children:g.map(r=>e.jsxs(t,{spacing:"m",justifyContent:r,children:[e.jsx(s,{size:3,children:e.jsx(i,{children:r})}),e.jsx(s,{size:3,children:e.jsx(i,{children:r})})]},r))})})},l={name:"alignContent",render:()=>e.jsx(n,{children:e.jsx(a,{flexDirection:"row",gap:"s",children:g.map(r=>e.jsxs(t,{spacing:"xs",alignContent:r,style:{height:"240px",flex:1,background:"#f5f5f5"},children:[e.jsx(s,{size:12,children:e.jsx(i,{children:r})}),e.jsx(s,{size:12,children:e.jsx(i,{children:r})})]},r))})})},x={name:"direction",render:()=>e.jsx(n,{children:e.jsx(a,{gap:"xl",children:ee.map(r=>e.jsxs(t,{spacing:"m",direction:r,children:[e.jsx(s,{size:4,children:e.jsxs(i,{children:[r," 1"]})}),e.jsx(s,{size:4,children:e.jsxs(i,{children:[r," 2"]})}),e.jsx(s,{size:4,children:e.jsxs(i,{children:[r," 3"]})})]},r))})})},I={name:"wrap",render:()=>e.jsx(n,{children:e.jsx(a,{gap:"xl",children:re.map(r=>e.jsxs(t,{spacing:"m",wrap:r,children:[e.jsx(s,{size:6,children:e.jsxs(i,{children:[r," 1"]})}),e.jsx(s,{size:6,children:e.jsxs(i,{children:[r," 2"]})}),e.jsx(s,{size:6,children:e.jsxs(i,{children:[r," 3"]})})]},r))})})},j={name:"GridItem size",render:()=>e.jsx(n,{children:e.jsxs(t,{spacing:"m",children:[e.jsx(s,{size:12,children:e.jsx(i,{children:"12"})}),e.jsx(s,{size:8,children:e.jsx(i,{children:"8"})}),e.jsx(s,{size:4,children:e.jsx(i,{children:"4"})}),e.jsx(s,{size:6,children:e.jsx(i,{children:"6"})}),e.jsx(s,{size:6,children:e.jsx(i,{children:"6"})}),e.jsx(s,{size:3,children:e.jsx(i,{children:"3"})}),e.jsx(s,{size:3,children:e.jsx(i,{children:"3"})}),e.jsx(s,{size:3,children:e.jsx(i,{children:"3"})}),e.jsx(s,{size:3,children:e.jsx(i,{children:"3"})})]})})},G={name:"GridItem size (responsive)",render:()=>e.jsx(n,{children:e.jsxs(t,{spacing:"m",children:[e.jsx(s,{size:{xxs:12,s:6,m:4},children:e.jsx(i,{children:"1"})}),e.jsx(s,{size:{xxs:12,s:6,m:4},children:e.jsx(i,{children:"2"})}),e.jsx(s,{size:{xxs:12,s:6,m:4},children:e.jsx(i,{children:"3"})})]})})},h={name:"GridItem offset",render:()=>e.jsx(n,{children:e.jsxs(t,{spacing:"m",children:[e.jsx(s,{size:6,offset:3,children:e.jsx(i,{children:"size=6 offset=3"})}),e.jsx(s,{size:4,offset:2,children:e.jsx(i,{children:"size=4 offset=2"})}),e.jsx(s,{size:4,children:e.jsx(i,{children:"size=4"})})]})})};var u,f,S;d.parameters={...d.parameters,docs:{...(u=d.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    spacing: 'm',
    gapless: false,
    direction: 'row',
    wrap: 'wrap'
  },
  render: args => <Wrapper>
      <Grid {...args}>{threeItems}</Grid>
    </Wrapper>
}`,...(S=(f=d.parameters)==null?void 0:f.docs)==null?void 0:S.source}}};var W,w,y;c.parameters={...c.parameters,docs:{...(W=c.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'spacing',
  render: () => <Wrapper>
      <Stack gap="xl">
        {spacings.map(spacing => <Grid key={spacing} spacing={spacing}>
            <GridItem size={4}>
              <Item>{spacing}</Item>
            </GridItem>
            <GridItem size={4}>
              <Item>{spacing}</Item>
            </GridItem>
            <GridItem size={4}>
              <Item>{spacing}</Item>
            </GridItem>
          </Grid>)}
      </Stack>
    </Wrapper>
}`,...(y=(w=c.parameters)==null?void 0:w.docs)==null?void 0:y.source}}};var C,k,v;m.parameters={...m.parameters,docs:{...(C=m.parameters)==null?void 0:C.docs,source:{originalSource:`{
  name: 'spacing (responsive)',
  render: () => <Wrapper>
      <Grid spacing={{
      xxs: 's',
      m: 'l',
      xl: 'xxl'
    }}>{threeItems}</Grid>
    </Wrapper>
}`,...(v=(k=m.parameters)==null?void 0:k.docs)==null?void 0:v.source}}};var A,R,b;o.parameters={...o.parameters,docs:{...(A=o.parameters)==null?void 0:A.docs,source:{originalSource:`{
  name: 'gapless',
  render: () => <Wrapper>
      <Grid spacing="m" gapless>
        {threeItems}
      </Grid>
    </Wrapper>
}`,...(b=(R=o.parameters)==null?void 0:R.docs)==null?void 0:b.source}}};var D,P,O;p.parameters={...p.parameters,docs:{...(D=p.parameters)==null?void 0:D.docs,source:{originalSource:`{
  name: 'justifyContent',
  render: () => <Wrapper>
      <Stack gap="xl">
        {contentAlignments.map(justifyContent => <Grid key={justifyContent} spacing="m" justifyContent={justifyContent}>
            <GridItem size={3}>
              <Item>{justifyContent}</Item>
            </GridItem>
            <GridItem size={3}>
              <Item>{justifyContent}</Item>
            </GridItem>
          </Grid>)}
      </Stack>
    </Wrapper>
}`,...(O=(P=p.parameters)==null?void 0:P.docs)==null?void 0:O.source}}};var E,J,_;l.parameters={...l.parameters,docs:{...(E=l.parameters)==null?void 0:E.docs,source:{originalSource:`{
  name: 'alignContent',
  render: () => <Wrapper>
      <Stack flexDirection="row" gap="s">
        {contentAlignments.map(alignContent => <Grid key={alignContent} spacing="xs" alignContent={alignContent} style={{
        height: '240px',
        flex: 1,
        background: '#f5f5f5'
      }}>
            <GridItem size={12}>
              <Item>{alignContent}</Item>
            </GridItem>
            <GridItem size={12}>
              <Item>{alignContent}</Item>
            </GridItem>
          </Grid>)}
      </Stack>
    </Wrapper>
}`,...(_=(J=l.parameters)==null?void 0:J.docs)==null?void 0:_.source}}};var L,T,q;x.parameters={...x.parameters,docs:{...(L=x.parameters)==null?void 0:L.docs,source:{originalSource:`{
  name: 'direction',
  render: () => <Wrapper>
      <Stack gap="xl">
        {directions.map(direction => <Grid key={direction} spacing="m" direction={direction}>
            <GridItem size={4}>
              <Item>{direction} 1</Item>
            </GridItem>
            <GridItem size={4}>
              <Item>{direction} 2</Item>
            </GridItem>
            <GridItem size={4}>
              <Item>{direction} 3</Item>
            </GridItem>
          </Grid>)}
      </Stack>
    </Wrapper>
}`,...(q=(T=x.parameters)==null?void 0:T.docs)==null?void 0:q.source}}};var B,F,H;I.parameters={...I.parameters,docs:{...(B=I.parameters)==null?void 0:B.docs,source:{originalSource:`{
  name: 'wrap',
  render: () => <Wrapper>
      <Stack gap="xl">
        {wraps.map(wrap => <Grid key={wrap} spacing="m" wrap={wrap}>
            <GridItem size={6}>
              <Item>{wrap} 1</Item>
            </GridItem>
            <GridItem size={6}>
              <Item>{wrap} 2</Item>
            </GridItem>
            <GridItem size={6}>
              <Item>{wrap} 3</Item>
            </GridItem>
          </Grid>)}
      </Stack>
    </Wrapper>
}`,...(H=(F=I.parameters)==null?void 0:F.docs)==null?void 0:H.source}}};var K,M,N;j.parameters={...j.parameters,docs:{...(K=j.parameters)==null?void 0:K.docs,source:{originalSource:`{
  name: 'GridItem size',
  render: () => <Wrapper>
      <Grid spacing="m">
        <GridItem size={12}>
          <Item>12</Item>
        </GridItem>
        <GridItem size={8}>
          <Item>8</Item>
        </GridItem>
        <GridItem size={4}>
          <Item>4</Item>
        </GridItem>
        <GridItem size={6}>
          <Item>6</Item>
        </GridItem>
        <GridItem size={6}>
          <Item>6</Item>
        </GridItem>
        <GridItem size={3}>
          <Item>3</Item>
        </GridItem>
        <GridItem size={3}>
          <Item>3</Item>
        </GridItem>
        <GridItem size={3}>
          <Item>3</Item>
        </GridItem>
        <GridItem size={3}>
          <Item>3</Item>
        </GridItem>
      </Grid>
    </Wrapper>
}`,...(N=(M=j.parameters)==null?void 0:M.docs)==null?void 0:N.source}}};var Q,U,V;G.parameters={...G.parameters,docs:{...(Q=G.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  name: 'GridItem size (responsive)',
  render: () => <Wrapper>
      <Grid spacing="m">
        <GridItem size={{
        xxs: 12,
        s: 6,
        m: 4
      }}>
          <Item>1</Item>
        </GridItem>
        <GridItem size={{
        xxs: 12,
        s: 6,
        m: 4
      }}>
          <Item>2</Item>
        </GridItem>
        <GridItem size={{
        xxs: 12,
        s: 6,
        m: 4
      }}>
          <Item>3</Item>
        </GridItem>
      </Grid>
    </Wrapper>
}`,...(V=(U=G.parameters)==null?void 0:U.docs)==null?void 0:V.source}}};var X,Y,Z;h.parameters={...h.parameters,docs:{...(X=h.parameters)==null?void 0:X.docs,source:{originalSource:`{
  name: 'GridItem offset',
  render: () => <Wrapper>
      <Grid spacing="m">
        <GridItem size={6} offset={3}>
          <Item>size=6 offset=3</Item>
        </GridItem>
        <GridItem size={4} offset={2}>
          <Item>size=4 offset=2</Item>
        </GridItem>
        <GridItem size={4}>
          <Item>size=4</Item>
        </GridItem>
      </Grid>
    </Wrapper>
}`,...(Z=(Y=h.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};const xe=["Playground","Spacing","SpacingResponsive","Gapless","JustifyContent","AlignContent","Direction","Wrap","GridItemSize","GridItemSizeResponsive","GridItemOffset"];export{l as AlignContent,x as Direction,o as Gapless,h as GridItemOffset,j as GridItemSize,G as GridItemSizeResponsive,p as JustifyContent,d as Playground,c as Spacing,m as SpacingResponsive,I as Wrap,xe as __namedExportsOrder,le as default};
