type RGBAValue = {
  r: number
  g: number
  b: number
  a: number
}

type TokenValue = {
  value: RGBAValue
  attributes: Record<string, string>
  filePath: string
  isSource: boolean
  original: unknown
  name: string
  path: string[]
}

type ColorLevels = Record<string, TokenValue>

type PrimitiveColors = {
  black: ColorLevels
  white: ColorLevels
  gray: ColorLevels
  blue: ColorLevels
  green: ColorLevels
  red: ColorLevels
  yellow: ColorLevels
  [key: string]: ColorLevels
}

type SemanticColors = {
  neutral: ColorLevels
  informative: ColorLevels
  positive: ColorLevels
  negative: ColorLevels
  notice: ColorLevels
  [key: string]: ColorLevels
}

type FlavorTokens = {
  color: {
    primitive: PrimitiveColors
    semantic: SemanticColors
    [key: string]: unknown
  }
  [key: string]: unknown
}

declare module '@pepabo-inhouse/tokens/build/pepper/javascript/tokens' {
  const tokens: FlavorTokens
  export default tokens
}

declare module '@pepabo-inhouse/tokens/build/minne/javascript/tokens' {
  const tokens: FlavorTokens
  export default tokens
}

declare module '@pepabo-inhouse/tokens/build/apollo/javascript/tokens' {
  const tokens: FlavorTokens
  export default tokens
}

declare module '@pepabo-inhouse/tokens/build/nachiguro/javascript/tokens' {
  const tokens: FlavorTokens
  export default tokens
}

declare module '@pepabo-inhouse/tokens/build/flippers/javascript/tokens' {
  const tokens: FlavorTokens
  export default tokens
}

declare module '@pepabo-inhouse/tokens/build/kung-pu/javascript/tokens' {
  const tokens: FlavorTokens
  export default tokens
}

declare module '@pepabo-inhouse/tokens/build/lolipop/javascript/tokens' {
  const tokens: FlavorTokens
  export default tokens
}
