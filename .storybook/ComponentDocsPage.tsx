import {
  Controls,
  Markdown,
  Primary,
  Stories,
  Subtitle,
  Title,
  useOf,
} from '@storybook/addon-docs/blocks'

// コンポーネントの説明は各フォルダの <Name>.md が唯一の元。ここではその概要だけを表示する
const docs = import.meta.glob<string>('../src/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// frontmatter を除き、最初の見出し（# ）の直後から次の見出し（## ）までを概要として取り出す
const extractOverview = (md: string) => {
  const lines = md.replace(/^---\n[\s\S]*?\n---\n/, '').split('\n')
  const rest = lines.slice(lines.findIndex((line) => line.startsWith('# ')) + 1)
  const end = rest.findIndex((line) => line.startsWith('## '))
  return rest
    .slice(0, end === -1 ? undefined : end)
    .join('\n')
    .trim()
    // 日本語の段落内の改行が、表示で空白にならないように詰める
    .replace(/([^\n])\n(?=[^\n])/g, '$1')
}

// './src/Button/Button.stories.tsx' に対応する、同じ名前の md（'../src/Button/Button.md'）を返す
const findDoc = (fileName?: string) =>
  fileName ? docs[fileName.replace(/^\.\//, '../').replace(/\.stories\.\w+$/, '.md')] : undefined

export const ComponentDocsPage = () => {
  const resolved = useOf('meta')
  const fileName =
    resolved.type === 'meta' ? (resolved.preparedMeta.parameters.fileName as string) : undefined
  const doc = findDoc(fileName)

  return (
    <>
      <Title />
      <Subtitle />
      {doc && <Markdown>{extractOverview(doc)}</Markdown>}
      <Primary />
      <Controls />
      <Stories />
    </>
  )
}
