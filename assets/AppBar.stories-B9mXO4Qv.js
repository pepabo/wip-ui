import{j as e}from"./iframe-sXJpPmIv.js";import"./index-AheSUmAU.js";import{I as N}from"./index-2dXvtocF.js";import{c as m}from"./clsx-B-dksMZM.js";import{S as j}from"./Stack-D815ajbn.js";import{B as S}from"./Button-9v928iZ3.js";import"./preload-helper-Dp1pzeXC.js";import"./Link-C23NS2B7.js";import"./useFocusRing-BaPemmIX.js";import"./usePress-Bfby1Qs7.js";import"./responsiveClasses-CaDhpJgV.js";import"./Button-DA-bDr0O.js";import"./Hidden-B8YayTWA.js";const r=({appearance:a="white",position:t="relative",className:i,children:s,...A})=>{const w=m("wip-app-bar",`-appearance-${a}`,`-position-${t}`,i);return e.jsx("header",{className:w,...A,children:e.jsx("div",{className:"_content",children:s})})};try{r.displayName="AppBar",r.__docgenInfo={description:"",displayName:"AppBar",props:{appearance:{defaultValue:{value:"white"},description:"AppBarの外観スタイル",name:"appearance",required:!1,type:{name:"enum",value:[{value:'"transparent"'},{value:'"white"'},{value:'"filled"'}]}},position:{defaultValue:{value:"relative"},description:"AppBarの配置方法",name:"position",required:!1,type:{name:"enum",value:[{value:'"fixed"'},{value:'"relative"'}]}}}}}catch{}const l=({children:a,className:t,...i})=>{const s=m("wip-app-bar-leading",t);return e.jsx("div",{className:s,...i,children:a})};try{l.displayName="AppBarLeading",l.__docgenInfo={description:"",displayName:"AppBarLeading",props:{}}}catch{}const d=({children:a,className:t,...i})=>{const s=m("wip-app-bar-trailing",t);return e.jsx("div",{className:s,...i,children:a})};try{d.displayName="AppBarTrailing",d.__docgenInfo={description:"",displayName:"AppBarTrailing",props:{}}}catch{}const R={title:"Components/Navigation/AppBar",component:r,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{appearance:{control:"select",options:["filled","white","transparent"]},position:{control:"select",options:["relative","fixed"]},children:{control:!1}}},k=`data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="32"><rect width="120" height="32" rx="4" fill="#888"/></svg>')}`,p=e.jsxs(e.Fragment,{children:[e.jsx(l,{children:e.jsx("a",{href:"/",children:e.jsx("img",{src:k,alt:"サービス名"})})}),e.jsx(d,{children:e.jsx(S,{iconOnly:!0,appearance:"transparent","aria-label":"メニュー",children:e.jsx(N,{name:"menu","aria-hidden":"true"})})})]}),n={args:{appearance:"white",position:"relative",children:p}},o={name:"appearance",render:()=>e.jsxs(j,{gap:"s",children:[e.jsx(r,{appearance:"filled",children:p}),e.jsx(r,{appearance:"white",children:p}),e.jsx("div",{style:{background:"#333"},children:e.jsx(r,{appearance:"transparent",children:p})})]})},c={name:"position",render:()=>e.jsxs(j,{gap:"s",children:[e.jsxs("div",{style:{transform:"translateZ(0)",height:"160px",overflow:"auto"},children:[e.jsx(r,{position:"relative",children:p}),e.jsx("div",{style:{height:"400px",padding:"16px"},children:"relative"})]}),e.jsxs("div",{style:{transform:"translateZ(0)",height:"160px",overflow:"auto"},children:[e.jsx(r,{position:"fixed",children:p}),e.jsx("div",{style:{height:"400px",padding:"16px",paddingTop:"80px"},children:"fixed"})]})]})};var h,u,g;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    appearance: 'white',
    position: 'relative',
    children
  }
}`,...(g=(u=n.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var x,v,f;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  name: 'appearance',
  render: () => <Stack gap="s">
      <AppBar appearance="filled">{children}</AppBar>
      <AppBar appearance="white">{children}</AppBar>
      <div style={{
      background: '#333'
    }}>
        <AppBar appearance="transparent">{children}</AppBar>
      </div>
    </Stack>
}`,...(f=(v=o.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};var y,B,_;c.parameters={...c.parameters,docs:{...(y=c.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'position',
  render: () => <Stack gap="s">
      <div style={{
      transform: 'translateZ(0)',
      height: '160px',
      overflow: 'auto'
    }}>
        <AppBar position="relative">{children}</AppBar>
        <div style={{
        height: '400px',
        padding: '16px'
      }}>relative</div>
      </div>
      <div style={{
      transform: 'translateZ(0)',
      height: '160px',
      overflow: 'auto'
    }}>
        <AppBar position="fixed">{children}</AppBar>
        <div style={{
        height: '400px',
        padding: '16px',
        paddingTop: '80px'
      }}>fixed</div>
      </div>
    </Stack>
}`,...(_=(B=c.parameters)==null?void 0:B.docs)==null?void 0:_.source}}};const V=["Playground","Appearance","Position"];export{o as Appearance,n as Playground,c as Position,V as __namedExportsOrder,R as default};
