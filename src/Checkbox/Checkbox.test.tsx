import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { Checkbox } from './index'

describe('Checkbox', () => {
  it('渡した className がルートの label にマージされる', () => {
    const html = renderToStaticMarkup(<Checkbox className="my-card">ラベル</Checkbox>)

    expect(html).toContain('aria-checkbox')
    expect(html).toContain('my-card')
  })

  it('className を渡さない場合は既存のクラスのみが付く', () => {
    const html = renderToStaticMarkup(<Checkbox>ラベル</Checkbox>)

    expect(html).toContain('aria-checkbox')
    expect(html).not.toContain('undefined')
  })
})
