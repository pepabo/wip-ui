import{j as e}from"./iframe-sXJpPmIv.js";import{T as o}from"./index-UgKjwJhE.js";import{S as r}from"./Stack-D815ajbn.js";import"./preload-helper-Dp1pzeXC.js";import"./clsx-B-dksMZM.js";import"./responsiveClasses-CaDhpJgV.js";const O={title:"Components/Data Display/Typography",component:o,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{size:{control:"select",options:["xxs","xs","s","m","l","xl","xxl","xxxl"]},density:{control:"select",options:["comfort","normal","dense"]},fontWeight:{control:"select",options:["normal","bold"]},color:{control:"select",options:["high_emphasis","medium_emphasis","low_emphasis","informative","positive","notice","negative"]}},args:{children:"テキスト"}},c="ご利用中のサービスの料金プランは、管理画面からいつでも変更できます。変更後のプランは翌月1日から適用され、日割りでの精算は行いません。",s={args:{size:"m",density:"normal",fontWeight:"normal",color:"high_emphasis",component:"p"}},a={name:"size",render:()=>e.jsxs(r,{gap:"s",children:[e.jsx(o,{size:"xxs",children:"xxs"}),e.jsx(o,{size:"xs",children:"xs"}),e.jsx(o,{size:"s",children:"s"}),e.jsx(o,{size:"m",children:"m"}),e.jsx(o,{size:"l",children:"l"}),e.jsx(o,{size:"xl",children:"xl"}),e.jsx(o,{size:"xxl",children:"xxl"}),e.jsx(o,{size:"xxxl",children:"xxxl"})]})},p={name:"density",render:()=>e.jsxs(r,{gap:"s",children:[e.jsxs(o,{density:"comfort",children:["comfort: ",c]}),e.jsxs(o,{density:"normal",children:["normal: ",c]}),e.jsxs(o,{density:"dense",children:["dense: ",c]})]})},n={name:"fontWeight",render:()=>e.jsxs(r,{gap:"s",children:[e.jsx(o,{fontWeight:"normal",children:"normal"}),e.jsx(o,{fontWeight:"bold",children:"bold"})]})},i={name:"color",render:()=>e.jsxs(r,{gap:"s",children:[e.jsx(o,{color:"high_emphasis",children:"high_emphasis"}),e.jsx(o,{color:"medium_emphasis",children:"medium_emphasis"}),e.jsx(o,{color:"low_emphasis",children:"low_emphasis"}),e.jsx(o,{color:"informative",children:"informative"}),e.jsx(o,{color:"positive",children:"positive"}),e.jsx(o,{color:"notice",children:"notice"}),e.jsx(o,{color:"negative",children:"negative"})]})},t={name:"component",render:()=>e.jsxs(r,{gap:"s",children:[e.jsx(o,{component:"h2",size:"xl",fontWeight:"bold",children:"h2"}),e.jsx(o,{component:"p",children:"p"}),e.jsx(o,{component:"span",children:"span"})]})};var h,l,m;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    size: 'm',
    density: 'normal',
    fontWeight: 'normal',
    color: 'high_emphasis',
    component: 'p'
  }
}`,...(m=(l=s.parameters)==null?void 0:l.docs)==null?void 0:m.source}}};var y,g,d;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'size',
  render: () => <Stack gap="s">
      <Typography size="xxs">xxs</Typography>
      <Typography size="xs">xs</Typography>
      <Typography size="s">s</Typography>
      <Typography size="m">m</Typography>
      <Typography size="l">l</Typography>
      <Typography size="xl">xl</Typography>
      <Typography size="xxl">xxl</Typography>
      <Typography size="xxxl">xxxl</Typography>
    </Stack>
}`,...(d=(g=a.parameters)==null?void 0:g.docs)==null?void 0:d.source}}};var x,T,j;p.parameters={...p.parameters,docs:{...(x=p.parameters)==null?void 0:x.docs,source:{originalSource:`{
  name: 'density',
  render: () => <Stack gap="s">
      <Typography density="comfort">comfort: {longText}</Typography>
      <Typography density="normal">normal: {longText}</Typography>
      <Typography density="dense">dense: {longText}</Typography>
    </Stack>
}`,...(j=(T=p.parameters)==null?void 0:T.docs)==null?void 0:j.source}}};var u,f,z;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`{
  name: 'fontWeight',
  render: () => <Stack gap="s">
      <Typography fontWeight="normal">normal</Typography>
      <Typography fontWeight="bold">bold</Typography>
    </Stack>
}`,...(z=(f=n.parameters)==null?void 0:f.docs)==null?void 0:z.source}}};var S,_,v;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  name: 'color',
  render: () => <Stack gap="s">
      <Typography color="high_emphasis">high_emphasis</Typography>
      <Typography color="medium_emphasis">medium_emphasis</Typography>
      <Typography color="low_emphasis">low_emphasis</Typography>
      <Typography color="informative">informative</Typography>
      <Typography color="positive">positive</Typography>
      <Typography color="notice">notice</Typography>
      <Typography color="negative">negative</Typography>
    </Stack>
}`,...(v=(_=i.parameters)==null?void 0:_.docs)==null?void 0:v.source}}};var W,k,b;t.parameters={...t.parameters,docs:{...(W=t.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'component',
  render: () => <Stack gap="s">
      <Typography component="h2" size="xl" fontWeight="bold">
        h2
      </Typography>
      <Typography component="p">p</Typography>
      <Typography component="span">span</Typography>
    </Stack>
}`,...(b=(k=t.parameters)==null?void 0:k.docs)==null?void 0:b.source}}};const R=["Playground","Size","Density","FontWeight","Color","Component"];export{i as Color,t as Component,p as Density,n as FontWeight,s as Playground,a as Size,R as __namedExportsOrder,O as default};
