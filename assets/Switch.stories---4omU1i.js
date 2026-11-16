import{r as J,R as $,j as e}from"./iframe-sXJpPmIv.js";import{c as Y,z as Z,A as ee,B as ae,u as te,t as se,v as le,f as re,b as R}from"./useFocusRing-BaPemmIX.js";import{$ as ie,a as oe}from"./useToggleState-CgfA_ock.js";import{$ as ne}from"./VisuallyHidden-ECSS2lPG.js";import{c as z}from"./clsx-B-dksMZM.js";import{T as ce}from"./index-UgKjwJhE.js";import{S as n}from"./Stack-D815ajbn.js";import"./preload-helper-Dp1pzeXC.js";import"./useFormReset-DYu2WFqP.js";import"./usePress-Bfby1Qs7.js";import"./useControlledState-CF94HFoR.js";import"./responsiveClasses-CaDhpJgV.js";function de(l,a,s){let{labelProps:r,inputProps:i,isSelected:o,isPressed:c,isDisabled:S,isReadOnly:h}=ie(l,a,s);return{labelProps:r,inputProps:{...i,role:"switch",checked:o},isSelected:o,isPressed:c,isDisabled:S,isReadOnly:h}}const ue=J.createContext(null),me=J.forwardRef(function(a,s){let{inputRef:r=null,...i}=a;[a,s]=Y(i,s,ue);let o=Z(ee(r,a.inputRef!==void 0?a.inputRef:null)),c=oe(a),{labelProps:S,inputProps:h,isSelected:v,isDisabled:g,isReadOnly:w,isPressed:y}=de({...ae(a),children:typeof a.children=="function"?!0:a.children},c,o),{isFocused:D,isFocusVisible:P,focusProps:K}=te(),Q=a.isDisabled||a.isReadOnly,{hoverProps:X,isHovered:j}=se({...a,isDisabled:Q}),E=le({...a,defaultClassName:"react-aria-Switch",values:{isSelected:v,isPressed:y,isHovered:j,isFocused:D,isFocusVisible:P,isDisabled:g,isReadOnly:w,state:c}}),x=re(a,{global:!0});return delete x.id,delete x.onClick,$.createElement("label",{...R(x,S,X,E),ref:s,slot:a.slot||void 0,"data-selected":v||void 0,"data-pressed":y||void 0,"data-hovered":j||void 0,"data-focused":D||void 0,"data-focus-visible":P||void 0,"data-disabled":g||void 0,"data-readonly":w||void 0},$.createElement(ne,{elementType:"span"},$.createElement("input",{...R(h,K),ref:o})),E.children)}),t=({label:l,size:a="m",color:s="neutral",className:r,...i})=>e.jsxs(me,{...i,className:z("aria-switch",r),children:[e.jsx("div",{className:z("wip-switch",`-size-${a}`,`-color-${s}`),children:e.jsx("div",{className:"_thumb"})}),l&&e.jsx(ce,{component:"span",className:"-label",children:l})]});try{t.displayName="Switch",t.__docgenInfo={description:"",displayName:"Switch",props:{label:{defaultValue:null,description:"スイッチのラベルテキスト",name:"label",required:!1,type:{name:"ReactNode"}},size:{defaultValue:{value:"m"},description:"スイッチのサイズ",name:"size",required:!1,type:{name:"enum",value:[{value:'"s"'},{value:'"m"'},{value:'"l"'}]}},color:{defaultValue:{value:"neutral"},description:"スイッチの色テーマ",name:"color",required:!1,type:{name:"enum",value:[{value:'"negative"'},{value:'"neutral"'},{value:'"interactive"'}]}},inputRef:{defaultValue:null,description:"A ref for the HTML input element.",name:"inputRef",required:!1,type:{name:"RefObject<HTMLInputElement | null>"}},children:{defaultValue:null,description:"The children of the component. A function may be provided to alter the children based on component state.",name:"children",required:!1,type:{name:"ChildrenOrFunction<SwitchRenderProps>"}},className:{defaultValue:null,description:"The CSS [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) for the element. A function may be provided to compute the class based on component state.",name:"className",required:!1,type:{name:"ClassNameOrFunction<SwitchRenderProps>"}},style:{defaultValue:null,description:"The inline [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) for the element. A function may be provided to compute the style based on component state.",name:"style",required:!1,type:{name:"StyleOrFunction<SwitchRenderProps>"}},slot:{defaultValue:null,description:"A slot name for the component. Slots allow the component to receive props from a parent component.\nAn explicit `null` value indicates that the local props completely override all props received from a parent.",name:"slot",required:!1,type:{name:"string | null"}}}}}catch{}const Pe={title:"Components/Forms/Switch",component:t,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{size:{control:"select",options:["s","m","l"]},color:{control:"select",options:["neutral","interactive","negative"]},isDisabled:{control:"boolean"},isSelected:{control:"boolean"},label:{control:"text"}}},d={args:{label:"Switch",size:"m",color:"neutral",isDisabled:!1}},u={name:"label",render:()=>e.jsxs(n,{flexDirection:"row",gap:"s",alignItems:"center",children:[e.jsx(t,{label:"Email notifications"}),e.jsx(t,{"aria-label":"Email notifications"})]})},m={name:"size",render:()=>e.jsxs(n,{flexDirection:"row",gap:"s",alignItems:"center",children:[e.jsx(t,{size:"s",label:"s"}),e.jsx(t,{size:"m",label:"m"}),e.jsx(t,{size:"l",label:"l"})]})},p={name:"color",render:()=>e.jsxs(n,{flexDirection:"row",gap:"s",children:[e.jsx(t,{color:"neutral",defaultSelected:!0,label:"neutral"}),e.jsx(t,{color:"interactive",defaultSelected:!0,label:"interactive"}),e.jsx(t,{color:"negative",defaultSelected:!0,label:"negative"})]})},f={name:"isSelected",render:()=>e.jsxs(n,{flexDirection:"row",gap:"s",children:[e.jsx(t,{label:"Email notifications"}),e.jsx(t,{label:"Email notifications",isSelected:!0})]})},b={name:"isDisabled",render:()=>e.jsxs(n,{flexDirection:"row",gap:"s",children:[e.jsx(t,{label:"Disabled",isDisabled:!0}),e.jsx(t,{label:"Disabled",isDisabled:!0,isSelected:!0})]})};var C,A,I;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    label: 'Switch',
    size: 'm',
    color: 'neutral',
    isDisabled: false
  }
}`,...(I=(A=d.parameters)==null?void 0:A.docs)==null?void 0:I.source}}};var k,N,O;u.parameters={...u.parameters,docs:{...(k=u.parameters)==null?void 0:k.docs,source:{originalSource:`{
  name: 'label',
  render: () => <Stack flexDirection="row" gap="s" alignItems="center">
      <Switch label="Email notifications" />
      <Switch aria-label="Email notifications" />
    </Stack>
}`,...(O=(N=u.parameters)==null?void 0:N.docs)==null?void 0:O.source}}};var F,V,_;m.parameters={...m.parameters,docs:{...(F=m.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'size',
  render: () => <Stack flexDirection="row" gap="s" alignItems="center">
      <Switch size="s" label="s" />
      <Switch size="m" label="m" />
      <Switch size="l" label="l" />
    </Stack>
}`,...(_=(V=m.parameters)==null?void 0:V.docs)==null?void 0:_.source}}};var T,q,B;p.parameters={...p.parameters,docs:{...(T=p.parameters)==null?void 0:T.docs,source:{originalSource:`{
  name: 'color',
  render: () => <Stack flexDirection="row" gap="s">
      <Switch color="neutral" defaultSelected label="neutral" />
      <Switch color="interactive" defaultSelected label="interactive" />
      <Switch color="negative" defaultSelected label="negative" />
    </Stack>
}`,...(B=(q=p.parameters)==null?void 0:q.docs)==null?void 0:B.source}}};var H,L,M;f.parameters={...f.parameters,docs:{...(H=f.parameters)==null?void 0:H.docs,source:{originalSource:`{
  name: 'isSelected',
  render: () => <Stack flexDirection="row" gap="s">
      <Switch label="Email notifications" />
      <Switch label="Email notifications" isSelected />
    </Stack>
}`,...(M=(L=f.parameters)==null?void 0:L.docs)==null?void 0:M.source}}};var U,W,G;b.parameters={...b.parameters,docs:{...(U=b.parameters)==null?void 0:U.docs,source:{originalSource:`{
  name: 'isDisabled',
  render: () => <Stack flexDirection="row" gap="s">
      <Switch label="Disabled" isDisabled />
      <Switch label="Disabled" isDisabled isSelected />
    </Stack>
}`,...(G=(W=b.parameters)==null?void 0:W.docs)==null?void 0:G.source}}};const je=["Playground","Label","Size","Color","IsSelected","IsDisabled"];export{p as Color,b as IsDisabled,f as IsSelected,u as Label,d as Playground,m as Size,je as __namedExportsOrder,Pe as default};
