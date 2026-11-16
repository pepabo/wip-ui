import{r as u,j as a}from"./iframe-sXJpPmIv.js";import{S as h}from"./Stack-D815ajbn.js";import"./preload-helper-Dp1pzeXC.js";import"./clsx-B-dksMZM.js";import"./responsiveClasses-CaDhpJgV.js";const r=u.forwardRef(function({as:c,children:g,size:d="m",...v},x){const z=c??"img";return a.jsx(z,{className:`wip-avatar -size-${d}`,...c==="img"&&{type:"img"},...v,ref:x,children:g})}),w={title:"Components/Data Display/Avatar",parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:"select",options:["xs","s","m","l"]}}},t={render:e=>a.jsx(r,{...e}),args:{src:"https://i.pravatar.cc/150?img=1",alt:"山田 花子",size:"m"}},s={name:"size",render:()=>a.jsxs(h,{flexDirection:"row",gap:"s",alignItems:"center",children:[a.jsx(r,{src:"https://i.pravatar.cc/150?img=2",alt:"鈴木 太郎",size:"xs"}),a.jsx(r,{src:"https://i.pravatar.cc/150?img=3",alt:"佐藤 次郎",size:"s"}),a.jsx(r,{src:"https://i.pravatar.cc/150?img=1",alt:"山田 花子",size:"m"}),a.jsx(r,{src:"https://i.pravatar.cc/150?img=4",alt:"田中 由紀",size:"l"})]})};var i,o,p;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: args => <Avatar {...args} />,
  args: {
    src: 'https://i.pravatar.cc/150?img=1',
    alt: '山田 花子',
    size: 'm'
  }
}`,...(p=(o=t.parameters)==null?void 0:o.docs)==null?void 0:p.source}}};var m,n,l;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  name: 'size',
  render: () => <Stack flexDirection="row" gap="s" alignItems="center">
      <Avatar src="https://i.pravatar.cc/150?img=2" alt="鈴木 太郎" size="xs" />
      <Avatar src="https://i.pravatar.cc/150?img=3" alt="佐藤 次郎" size="s" />
      <Avatar src="https://i.pravatar.cc/150?img=1" alt="山田 花子" size="m" />
      <Avatar src="https://i.pravatar.cc/150?img=4" alt="田中 由紀" size="l" />
    </Stack>
}`,...(l=(n=s.parameters)==null?void 0:n.docs)==null?void 0:l.source}}};const D=["Playground","Size"];export{t as Playground,s as Size,D as __namedExportsOrder,w as default};
