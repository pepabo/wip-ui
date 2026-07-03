import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { Checkbox } from './index'

/** SSR 出力からルートの label の class 属性をクラス名の配列として取り出す */
const getRootLabelClasses = (html: string): string[] => {
  const className = html.match(/^<label[^>]*\bclass="([^"]*)"/)?.[1]
  if (className === undefined) {
    throw new Error(`ルートの label に class 属性が見つかりません: ${html}`)
  }
  return className.split(' ')
}

describe('Checkbox', () => {
  it('渡した className がルートの label にマージされる', () => {
    const html = renderToStaticMarkup(<Checkbox className="my-card">ラベル</Checkbox>)
    const classes = getRootLabelClasses(html)

    expect(classes).toContain('aria-checkbox')
    expect(classes).toContain('my-card')
  })

  it('className を渡さない場合は既存のクラスのみが付く', () => {
    const html = renderToStaticMarkup(<Checkbox>ラベル</Checkbox>)

    expect(getRootLabelClasses(html)).toEqual(['aria-checkbox'])
  })
})
