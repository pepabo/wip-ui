import{j as i}from"./iframe-sXJpPmIv.js";import{D as e}from"./index-D4-j0KdH.js";import{S as d}from"./Stack-D815ajbn.js";import"./preload-helper-Dp1pzeXC.js";import"./clsx-B-dksMZM.js";import"./responsiveClasses-CaDhpJgV.js";const D={title:"Components/Data Display/Divider",component:e,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{orientation:{control:"select",options:["horizontal","vertical"]},variant:{control:"select",options:["fullWidth","inset","middle"]},absolute:{control:"boolean"},flexItem:{control:"boolean"}}},a={args:{orientation:"horizontal",variant:"fullWidth",absolute:!1,flexItem:!1}},t={name:"orientation",render:()=>i.jsxs(d,{gap:"s",children:[i.jsxs("div",{children:[i.jsx("div",{style:{padding:"10px"},children:"上のコンテンツ"}),i.jsx(e,{orientation:"horizontal"}),i.jsx("div",{style:{padding:"10px"},children:"下のコンテンツ"})]}),i.jsxs(d,{flexDirection:"row",gap:"s",children:[i.jsx("div",{style:{padding:"10px"},children:"左のコンテンツ"}),i.jsx(e,{orientation:"vertical",flexItem:!0,"aria-orientation":"vertical"}),i.jsx("div",{style:{padding:"10px"},children:"右のコンテンツ"})]})]})},r={name:"variant",render:()=>i.jsxs(d,{gap:"s",children:[i.jsxs("div",{children:[i.jsx("div",{style:{padding:"10px"},children:"fullWidth"}),i.jsx(e,{variant:"fullWidth"})]}),i.jsxs("div",{children:[i.jsx("div",{style:{padding:"10px"},children:"inset"}),i.jsx(e,{variant:"inset"})]}),i.jsxs("div",{children:[i.jsx("div",{style:{padding:"10px"},children:"middle"}),i.jsx(e,{variant:"middle"})]})]})};var n,s,o;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    orientation: 'horizontal',
    variant: 'fullWidth',
    absolute: false,
    flexItem: false
  }
}`,...(o=(s=a.parameters)==null?void 0:s.docs)==null?void 0:o.source}}};var l,p,c;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  name: 'orientation',
  render: () => <Stack gap="s">
      <div>
        <div style={{
        padding: '10px'
      }}>上のコンテンツ</div>
        <Divider orientation="horizontal" />
        <div style={{
        padding: '10px'
      }}>下のコンテンツ</div>
      </div>
      <Stack flexDirection="row" gap="s">
        <div style={{
        padding: '10px'
      }}>左のコンテンツ</div>
        <Divider orientation="vertical" flexItem aria-orientation="vertical" />
        <div style={{
        padding: '10px'
      }}>右のコンテンツ</div>
      </Stack>
    </Stack>
}`,...(c=(p=t.parameters)==null?void 0:p.docs)==null?void 0:c.source}}};var v,x,m;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
  name: 'variant',
  render: () => <Stack gap="s">
      <div>
        <div style={{
        padding: '10px'
      }}>fullWidth</div>
        <Divider variant="fullWidth" />
      </div>
      <div>
        <div style={{
        padding: '10px'
      }}>inset</div>
        <Divider variant="inset" />
      </div>
      <div>
        <div style={{
        padding: '10px'
      }}>middle</div>
        <Divider variant="middle" />
      </div>
    </Stack>
}`,...(m=(x=r.parameters)==null?void 0:x.docs)==null?void 0:m.source}}};const S=["Playground","Orientation","Variant"];export{t as Orientation,a as Playground,r as Variant,S as __namedExportsOrder,D as default};
