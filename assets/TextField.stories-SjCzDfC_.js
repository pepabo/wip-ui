import{j as e}from"./iframe-sXJpPmIv.js";import{T as a}from"./index-D7obMvsE.js";import{S as x}from"./Stack-D815ajbn.js";import"./preload-helper-Dp1pzeXC.js";import"./FieldError-3y1QMZNu.js";import"./useFocusRing-BaPemmIX.js";import"./clsx-B-dksMZM.js";import"./useLabels-DibSWiaJ.js";import"./Hidden-B8YayTWA.js";import"./Text-zFl1_KhZ.js";import"./RSPContexts-2O2ccQ4D.js";import"./Form-DLxKANZm.js";import"./useFormReset-DYu2WFqP.js";import"./useControlledState-CF94HFoR.js";import"./responsiveClasses-CaDhpJgV.js";const fe={title:"Components/Forms/TextField",component:a,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:"select",options:["s","m","l"]},width:{control:"select",options:["auto","full","half","third"]},color:{control:"select",options:["neutral","negative"]},component:{control:"select",options:["input","textarea"]}}},r={args:{label:"メールアドレス",caption:"例：email@example.com",placeholder:"email@example.com",size:"m",width:"auto",color:"neutral",component:"input",isRequired:!1,isDisabled:!1,isReadOnly:!1}},l={name:"label",render:()=>e.jsx(a,{label:"氏名",placeholder:"山田 太郎"})},o={name:"caption",render:()=>e.jsx(a,{label:"ユーザー名",caption:"半角英数字 20 文字以内で入力してください",placeholder:"pepabo"})},t={name:"placeholder",render:()=>e.jsx(a,{label:"メールアドレス",placeholder:"email@example.com"})},s={name:"size",render:()=>e.jsxs(x,{gap:"s",children:[e.jsx(a,{label:"s",size:"s",placeholder:"入力してください"}),e.jsx(a,{label:"m",size:"m",placeholder:"入力してください"}),e.jsx(a,{label:"l",size:"l",placeholder:"入力してください"})]})},d={name:"width",parameters:{layout:"padded"},render:()=>e.jsxs(x,{gap:"s",children:[e.jsx(a,{label:"auto",width:"auto",placeholder:"入力してください"}),e.jsx(a,{label:"third",width:"third",placeholder:"入力してください"}),e.jsx(a,{label:"half",width:"half",placeholder:"入力してください"}),e.jsx(a,{label:"full",width:"full",placeholder:"入力してください"})]})},c={name:"color",render:()=>e.jsxs(x,{gap:"s",children:[e.jsx(a,{label:"neutral",color:"neutral",placeholder:"入力してください"}),e.jsx(a,{label:"negative",color:"negative",placeholder:"入力してください"})]})},i={name:"component",render:()=>e.jsxs(x,{gap:"s",children:[e.jsx(a,{label:"input",component:"input",placeholder:"1 行のテキスト"}),e.jsx(a,{label:"textarea",component:"textarea",placeholder:"複数行のテキスト"})]})},n={name:"isRequired",render:()=>e.jsx(a,{label:"氏名",placeholder:"山田 太郎",isRequired:!0})},p={name:"isDisabled",render:()=>e.jsx(a,{label:"氏名",defaultValue:"山田 太郎",isDisabled:!0})},m={name:"isReadOnly",render:()=>e.jsx(a,{label:"会員番号",caption:"この項目は変更できません",defaultValue:"123456",isReadOnly:!0})},u={name:"defaultValue",render:()=>e.jsx(a,{label:"氏名",defaultValue:"山田 太郎"})},h={name:"validate",render:()=>e.jsx(a,{label:"ユーザー名",caption:"半角英数字 20 文字以内で入力してください",defaultValue:"ぺぱぼ",validate:ae=>/^[a-zA-Z0-9]*$/.test(ae)?null:"半角英数字で入力してください",validationBehavior:"aria"})};var b,f,g;r.parameters={...r.parameters,docs:{...(b=r.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    label: 'メールアドレス',
    caption: '例：email@example.com',
    placeholder: 'email@example.com',
    size: 'm',
    width: 'auto',
    color: 'neutral',
    component: 'input',
    isRequired: false,
    isDisabled: false,
    isReadOnly: false
  }
}`,...(g=(f=r.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};var j,S,T;l.parameters={...l.parameters,docs:{...(j=l.parameters)==null?void 0:j.docs,source:{originalSource:`{
  name: 'label',
  render: () => <TextField label="氏名" placeholder="山田 太郎" />
}`,...(T=(S=l.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};var F,R,v;o.parameters={...o.parameters,docs:{...(F=o.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'caption',
  render: () => <TextField label="ユーザー名" caption="半角英数字 20 文字以内で入力してください" placeholder="pepabo" />
}`,...(v=(R=o.parameters)==null?void 0:R.docs)==null?void 0:v.source}}};var z,y,V;t.parameters={...t.parameters,docs:{...(z=t.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'placeholder',
  render: () => <TextField label="メールアドレス" placeholder="email@example.com" />
}`,...(V=(y=t.parameters)==null?void 0:y.docs)==null?void 0:V.source}}};var w,D,k;s.parameters={...s.parameters,docs:{...(w=s.parameters)==null?void 0:w.docs,source:{originalSource:`{
  name: 'size',
  render: () => <Stack gap="s">
      <TextField label="s" size="s" placeholder="入力してください" />
      <TextField label="m" size="m" placeholder="入力してください" />
      <TextField label="l" size="l" placeholder="入力してください" />
    </Stack>
}`,...(k=(D=s.parameters)==null?void 0:D.docs)==null?void 0:k.source}}};var O,q,C;d.parameters={...d.parameters,docs:{...(O=d.parameters)==null?void 0:O.docs,source:{originalSource:`{
  name: 'width',
  parameters: {
    layout: 'padded'
  },
  render: () => <Stack gap="s">
      <TextField label="auto" width="auto" placeholder="入力してください" />
      <TextField label="third" width="third" placeholder="入力してください" />
      <TextField label="half" width="half" placeholder="入力してください" />
      <TextField label="full" width="full" placeholder="入力してください" />
    </Stack>
}`,...(C=(q=d.parameters)==null?void 0:q.docs)==null?void 0:C.source}}};var I,P,A;c.parameters={...c.parameters,docs:{...(I=c.parameters)==null?void 0:I.docs,source:{originalSource:`{
  name: 'color',
  render: () => <Stack gap="s">
      <TextField label="neutral" color="neutral" placeholder="入力してください" />
      <TextField label="negative" color="negative" placeholder="入力してください" />
    </Stack>
}`,...(A=(P=c.parameters)==null?void 0:P.docs)==null?void 0:A.source}}};var B,E,L;i.parameters={...i.parameters,docs:{...(B=i.parameters)==null?void 0:B.docs,source:{originalSource:`{
  name: 'component',
  render: () => <Stack gap="s">
      <TextField label="input" component="input" placeholder="1 行のテキスト" />
      <TextField label="textarea" component="textarea" placeholder="複数行のテキスト" />
    </Stack>
}`,...(L=(E=i.parameters)==null?void 0:E.docs)==null?void 0:L.source}}};var W,Z,_;n.parameters={...n.parameters,docs:{...(W=n.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'isRequired',
  render: () => <TextField label="氏名" placeholder="山田 太郎" isRequired />
}`,...(_=(Z=n.parameters)==null?void 0:Z.docs)==null?void 0:_.source}}};var $,G,H;p.parameters={...p.parameters,docs:{...($=p.parameters)==null?void 0:$.docs,source:{originalSource:`{
  name: 'isDisabled',
  render: () => <TextField label="氏名" defaultValue="山田 太郎" isDisabled />
}`,...(H=(G=p.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var J,K,M;m.parameters={...m.parameters,docs:{...(J=m.parameters)==null?void 0:J.docs,source:{originalSource:`{
  name: 'isReadOnly',
  render: () => <TextField label="会員番号" caption="この項目は変更できません" defaultValue="123456" isReadOnly />
}`,...(M=(K=m.parameters)==null?void 0:K.docs)==null?void 0:M.source}}};var N,Q,U;u.parameters={...u.parameters,docs:{...(N=u.parameters)==null?void 0:N.docs,source:{originalSource:`{
  name: 'defaultValue',
  render: () => <TextField label="氏名" defaultValue="山田 太郎" />
}`,...(U=(Q=u.parameters)==null?void 0:Q.docs)==null?void 0:U.source}}};var X,Y,ee;h.parameters={...h.parameters,docs:{...(X=h.parameters)==null?void 0:X.docs,source:{originalSource:`{
  name: 'validate',
  render: () => <TextField label="ユーザー名" caption="半角英数字 20 文字以内で入力してください" defaultValue="ぺぱぼ" validate={value => /^[a-zA-Z0-9]*$/.test(value) ? null : '半角英数字で入力してください'} validationBehavior="aria" />
}`,...(ee=(Y=h.parameters)==null?void 0:Y.docs)==null?void 0:ee.source}}};const ge=["Playground","Label","Caption","Placeholder","Size","Width","Color","Component","IsRequired","IsDisabled","IsReadOnly","DefaultValue","Validate"];export{o as Caption,c as Color,i as Component,u as DefaultValue,p as IsDisabled,m as IsReadOnly,n as IsRequired,l as Label,t as Placeholder,r as Playground,s as Size,h as Validate,d as Width,ge as __namedExportsOrder,fe as default};
