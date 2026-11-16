import{m as t}from"./iframe-DxSbL0lQ.js";import"./preload-helper-Dp1pzeXC.js";function w(e){var u,r,a="";if(typeof e=="string"||typeof e=="number")a+=e;else if(typeof e=="object")if(Array.isArray(e)){var n=e.length;for(u=0;u<n;u++)e[u]&&(r=w(e[u]))&&(a&&(a+=" "),a+=r)}else for(r in e)e[r]&&(a&&(a+=" "),a+=r);return a}function A(){for(var e,u,r=0,a="",n=arguments.length;r<n;r++)(e=arguments[r])&&(u=w(e))&&(a&&(a+=" "),a+=u);return a}const $="xxs";function f(e,u,r){if(u==null)return[];if(typeof u!="object")return[`-${e}-${u}`];const a={...u};return a.xxs===void 0&&r!==void 0&&(a.xxs=r),Object.entries(a).filter(([,n])=>n!==void 0).map(([n,o])=>n===$?`-${e}-${o}`:`-${e}-${n}-${o}`)}const m=({children:e,flexDirection:u="column",gap:r="m",alignItems:a="normal",justifyContent:n="normal",className:o})=>{const v=A("wip-stack",f("direction",u,"column"),`-align-${a}`,`-justify-${n}`,f("gap",r,"m"),o);return t.jsx("div",{className:v,children:e})};try{m.displayName="Stack",m.__docgenInfo={description:"",displayName:"Stack",props:{flexDirection:{defaultValue:{value:"column"},description:"子要素の並び方向。レスポンシブ対応",name:"flexDirection",required:!1,type:{name:"Responsive<StackFlexDirection>"}},gap:{defaultValue:{value:"m"},description:"子要素間のスペース。レスポンシブ対応",name:"gap",required:!1,type:{name:"Responsive<StackGapSize>"}},alignItems:{defaultValue:{value:"normal"},description:"交差軸方向の配置",name:"alignItems",required:!1,type:{name:"enum",value:[{value:'"center"'},{value:'"flex-start"'},{value:'"flex-end"'},{value:'"stretch"'}]}},justifyContent:{defaultValue:{value:"normal"},description:"主軸方向の配置",name:"justifyContent",required:!1,type:{name:"enum",value:[{value:'"center"'},{value:'"flex-start"'},{value:'"flex-end"'},{value:'"space-between"'}]}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}function s({elevation:e=1,outlined:u=!1,square:r=!1,padding:a="l",className:n,...o}){const N=A("wip-paper",`wip-paper--elevation-${u?0:e}`,u&&"wip-paper--outlined",r&&"wip-paper--square",f("padding",a,"l"),n);return t.jsx("div",{className:N,...o})}try{s.displayName="Paper",s.__docgenInfo={description:"",displayName:"Paper",props:{elevation:{defaultValue:{value:"1"},description:"影の強さ（0-6）。値が大きいほど浮き上がって見える",name:"elevation",required:!1,type:{name:"enum",value:[{value:"0"},{value:"1"},{value:"2"},{value:"3"},{value:"4"},{value:"5"},{value:"6"}]}},outlined:{defaultValue:{value:"false"},description:"trueにするとボーダー表示になり影が無効化される",name:"outlined",required:!1,type:{name:"boolean"}},square:{defaultValue:{value:"false"},description:"trueにすると角丸を無効化する",name:"square",required:!1,type:{name:"boolean"}},padding:{defaultValue:{value:"l"},description:"面の内側の余白。レスポンシブ対応",name:"padding",required:!1,type:{name:"Responsive<PaperPadding>"}}}}}catch{}const I={title:"Components/Surfaces/Paper",component:s,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{elevation:{control:"select",options:[0,1,2,3,4,5,6]},outlined:{control:"boolean"},square:{control:"boolean"},padding:{control:"select",options:["none","xxs","xs","s","m","l","xl","xxl"]}}},l={args:{children:"Paper",elevation:1,outlined:!1,square:!1,padding:"l"}},i={name:"elevation",render:()=>t.jsx(m,{flexDirection:"row",gap:"s",children:[0,1,2,3,4,5,6].map(e=>t.jsx(s,{elevation:e,children:e},e))})},d={name:"outlined",render:()=>t.jsx(s,{outlined:!0,children:"outlined"})},c={name:"square",render:()=>t.jsx(s,{square:!0,children:"square"})},p={name:"padding",render:()=>t.jsx(m,{flexDirection:"row",gap:"s",alignItems:"flex-start",children:["none","xxs","xs","s","m","l","xl","xxl"].map(e=>t.jsx(s,{outlined:!0,padding:e,children:e},e))})};var x,g,E;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    children: 'Paper',
    elevation: 1,
    outlined: false,
    square: false,
    padding: 'l'
  }
}`,...(E=(g=l.parameters)==null?void 0:g.docs)==null?void 0:E.source}}};var y,B,D;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'elevation',
  render: () => <Stack flexDirection="row" gap="s">
      {([0, 1, 2, 3, 4, 5, 6] as const).map(elevation => <Paper key={elevation} elevation={elevation}>
          {elevation}
        </Paper>)}
    </Stack>
}`,...(D=(B=i.parameters)==null?void 0:B.docs)==null?void 0:D.source}}};var F,q,P;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'outlined',
  render: () => <Paper outlined>outlined</Paper>
}`,...(P=(q=d.parameters)==null?void 0:q.docs)==null?void 0:P.source}}};var C,S,_;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`{
  name: 'square',
  render: () => <Paper square>square</Paper>
}`,...(_=(S=c.parameters)==null?void 0:S.docs)==null?void 0:_.source}}};var j,h,k;p.parameters={...p.parameters,docs:{...(j=p.parameters)==null?void 0:j.docs,source:{originalSource:`{
  name: 'padding',
  render: () => <Stack flexDirection="row" gap="s" alignItems="flex-start">
      {(['none', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'] as const).map(padding => <Paper key={padding} outlined padding={padding}>
          {padding}
        </Paper>)}
    </Stack>
}`,...(k=(h=p.parameters)==null?void 0:h.docs)==null?void 0:k.source}}};const O=["Playground","Elevation","Outlined","Square","Padding"];export{i as Elevation,d as Outlined,p as Padding,l as Playground,c as Square,O as __namedExportsOrder,I as default};
