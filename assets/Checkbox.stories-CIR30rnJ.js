import{j as e}from"./iframe-sXJpPmIv.js";import{C as r}from"./index-DkOqruYw.js";import{S as I}from"./Stack-D815ajbn.js";import"./preload-helper-Dp1pzeXC.js";import"./RSPContexts-2O2ccQ4D.js";import"./useFocusRing-BaPemmIX.js";import"./clsx-B-dksMZM.js";import"./Form-DLxKANZm.js";import"./usePress-Bfby1Qs7.js";import"./useToggleState-CgfA_ock.js";import"./useFormReset-DYu2WFqP.js";import"./useControlledState-CF94HFoR.js";import"./VisuallyHidden-ECSS2lPG.js";import"./index-UgKjwJhE.js";import"./responsiveClasses-CaDhpJgV.js";const v={title:"Components/Forms/Checkbox",component:r,parameters:{layout:"padded"},tags:["autodocs"],args:{children:null},argTypes:{isDisabled:{control:"boolean"},isIndeterminate:{control:"boolean"},isSelected:{control:"boolean"}}},s={args:{children:"Checkbox",isIndeterminate:!1,isDisabled:!1}},a={name:"isSelected",render:()=>e.jsxs(I,{flexDirection:"row",gap:"s",children:[e.jsx(r,{children:"Unselected"}),e.jsx(r,{isSelected:!0,children:"Selected"})]})},o={name:"isIndeterminate",render:()=>e.jsx(r,{isIndeterminate:!0,children:"Select all"})},t={name:"isDisabled",render:()=>e.jsxs(I,{flexDirection:"row",gap:"s",children:[e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isDisabled:!0,isSelected:!0,children:"Disabled"})]})},i={name:"aria-label",args:{children:null,"aria-label":"Select row"}};var c,n,l;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    children: 'Checkbox',
    isIndeterminate: false,
    isDisabled: false
  }
}`,...(l=(n=s.parameters)==null?void 0:n.docs)==null?void 0:l.source}}};var d,m,p;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  name: 'isSelected',
  render: () => <Stack flexDirection="row" gap="s">
      <Checkbox>Unselected</Checkbox>
      <Checkbox isSelected>Selected</Checkbox>
    </Stack>
}`,...(p=(m=a.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var b,u,x;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  name: 'isIndeterminate',
  render: () => <Checkbox isIndeterminate>Select all</Checkbox>
}`,...(x=(u=o.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var h,S,k;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  name: 'isDisabled',
  render: () => <Stack flexDirection="row" gap="s">
      <Checkbox isDisabled>Disabled</Checkbox>
      <Checkbox isDisabled isSelected>
        Disabled
      </Checkbox>
    </Stack>
}`,...(k=(S=t.parameters)==null?void 0:S.docs)==null?void 0:k.source}}};var D,g,C;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  name: 'aria-label',
  args: {
    children: null,
    'aria-label': 'Select row'
  }
}`,...(C=(g=i.parameters)==null?void 0:g.docs)==null?void 0:C.source}}};const z=["Playground","IsSelected","IsIndeterminate","IsDisabled","AriaLabel"];export{i as AriaLabel,t as IsDisabled,o as IsIndeterminate,a as IsSelected,s as Playground,z as __namedExportsOrder,v as default};
