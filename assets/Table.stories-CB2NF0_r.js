import{j as e}from"./iframe-sXJpPmIv.js";import{C as r}from"./index-DkOqruYw.js";import{T as i,$ as p,a as o,b as h,c as n,d as l}from"./index-DGZWBD50.js";import"./preload-helper-Dp1pzeXC.js";import"./RSPContexts-2O2ccQ4D.js";import"./useFocusRing-BaPemmIX.js";import"./clsx-B-dksMZM.js";import"./Form-DLxKANZm.js";import"./usePress-Bfby1Qs7.js";import"./useToggleState-CgfA_ock.js";import"./useFormReset-DYu2WFqP.js";import"./useControlledState-CF94HFoR.js";import"./VisuallyHidden-ECSS2lPG.js";import"./index-UgKjwJhE.js";import"./responsiveClasses-CaDhpJgV.js";import"./Button-DA-bDr0O.js";import"./Hidden-B8YayTWA.js";import"./Collection-Bt-eK6KW.js";import"./DragAndDrop-1UVDQf8w.js";import"./getScrollParent-C_uBuXA-.js";import"./keyboard-CJ2EdQpd.js";import"./context-CoG8qYl0.js";import"./SelectionManager-EW-pcAk9.js";import"./FocusScope-BCf5CKBZ.js";import"./SelectionIndicator-CWhFQTNb.js";import"./useLocalizedStringFormatter-BYzRIH80.js";const G={title:"Components/Data Display/Table",component:i,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{selectionMode:{control:"select",options:["none","single","multiple"]}}},s={args:{"aria-label":"ファイル一覧",selectionMode:"none"},render:j=>e.jsxs(i,{...j,children:[e.jsxs(p,{children:[e.jsx(o,{isRowHeader:!0,children:"名前"}),e.jsx(o,{children:"種類"}),e.jsx(o,{children:"更新日"})]}),e.jsxs(h,{children:[e.jsxs(n,{children:[e.jsx(l,{children:"Document.pdf"}),e.jsx(l,{children:"PDF"}),e.jsx(l,{children:"2024-01-15"})]}),e.jsxs(n,{children:[e.jsx(l,{children:"Image.png"}),e.jsx(l,{children:"画像"}),e.jsx(l,{children:"2024-01-14"})]}),e.jsxs(n,{children:[e.jsx(l,{children:"Spreadsheet.xlsx"}),e.jsx(l,{children:"Excel"}),e.jsx(l,{children:"2024-01-13"})]})]})]})},c={name:"selectionMode",render:()=>e.jsxs(i,{"aria-label":"ファイル一覧",selectionMode:"multiple",children:[e.jsxs(p,{children:[e.jsx(o,{children:e.jsx(r,{slot:"selection",children:null})}),e.jsx(o,{isRowHeader:!0,children:"名前"}),e.jsx(o,{children:"種類"}),e.jsx(o,{children:"サイズ"})]}),e.jsxs(h,{children:[e.jsxs(n,{children:[e.jsx(l,{children:e.jsx(r,{slot:"selection",children:null})}),e.jsx(l,{children:"File1.txt"}),e.jsx(l,{children:"テキスト"}),e.jsx(l,{children:"1.2 KB"})]}),e.jsxs(n,{children:[e.jsx(l,{children:e.jsx(r,{slot:"selection",children:null})}),e.jsx(l,{children:"File2.doc"}),e.jsx(l,{children:"文書"}),e.jsx(l,{children:"45 KB"})]}),e.jsxs(n,{children:[e.jsx(l,{children:e.jsx(r,{slot:"selection",children:null})}),e.jsx(l,{children:"File3.jpg"}),e.jsx(l,{children:"画像"}),e.jsx(l,{children:"230 KB"})]})]})]})};var t,d,a;s.parameters={...s.parameters,docs:{...(t=s.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    'aria-label': 'ファイル一覧',
    selectionMode: 'none'
  },
  render: args => <Table {...args}>
      <TableHeader>
        <Column isRowHeader>名前</Column>
        <Column>種類</Column>
        <Column>更新日</Column>
      </TableHeader>
      <TableBody>
        <Row>
          <Cell>Document.pdf</Cell>
          <Cell>PDF</Cell>
          <Cell>2024-01-15</Cell>
        </Row>
        <Row>
          <Cell>Image.png</Cell>
          <Cell>画像</Cell>
          <Cell>2024-01-14</Cell>
        </Row>
        <Row>
          <Cell>Spreadsheet.xlsx</Cell>
          <Cell>Excel</Cell>
          <Cell>2024-01-13</Cell>
        </Row>
      </TableBody>
    </Table>
}`,...(a=(d=s.parameters)==null?void 0:d.docs)==null?void 0:a.source}}};var x,C,m;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:`{
  name: 'selectionMode',
  render: () => <Table aria-label="ファイル一覧" selectionMode="multiple">
      <TableHeader>
        <Column>
          <Checkbox slot="selection">{null}</Checkbox>
        </Column>
        <Column isRowHeader>名前</Column>
        <Column>種類</Column>
        <Column>サイズ</Column>
      </TableHeader>
      <TableBody>
        <Row>
          <Cell>
            <Checkbox slot="selection">{null}</Checkbox>
          </Cell>
          <Cell>File1.txt</Cell>
          <Cell>テキスト</Cell>
          <Cell>1.2 KB</Cell>
        </Row>
        <Row>
          <Cell>
            <Checkbox slot="selection">{null}</Checkbox>
          </Cell>
          <Cell>File2.doc</Cell>
          <Cell>文書</Cell>
          <Cell>45 KB</Cell>
        </Row>
        <Row>
          <Cell>
            <Checkbox slot="selection">{null}</Checkbox>
          </Cell>
          <Cell>File3.jpg</Cell>
          <Cell>画像</Cell>
          <Cell>230 KB</Cell>
        </Row>
      </TableBody>
    </Table>
}`,...(m=(C=c.parameters)==null?void 0:C.docs)==null?void 0:m.source}}};const J=["Playground","SelectionMode"];export{s as Playground,c as SelectionMode,J as __namedExportsOrder,G as default};
