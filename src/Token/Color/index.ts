import tokens from '@pepabo-inhouse/tokens/build/pepper/javascript/tokens'

const rgbaToHex = (rgba: { r: number; g: number; b: number }): string => {
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}`
}

const convertToHexColors = (
  colorTokens: Record<string, { value: { r: number; g: number; b: number } }>
): Record<string, string> => {
  const result: Record<string, string> = {}
  for (const [level, token] of Object.entries(colorTokens)) {
    result[level] = rgbaToHex(token.value)
  }
  return result
}

// Primitive Colors
export const black = convertToHexColors(tokens.color.primitive.black)
export const white = convertToHexColors(tokens.color.primitive.white)
export const gray = convertToHexColors(tokens.color.primitive.gray)
export const blue = convertToHexColors(tokens.color.primitive.blue)
export const green = convertToHexColors(tokens.color.primitive.green)
export const red = convertToHexColors(tokens.color.primitive.red)
export const yellow = convertToHexColors(tokens.color.primitive.yellow)

// Semantic Colors
export const neutral = convertToHexColors(tokens.color.semantic.neutral)
export const informative = convertToHexColors(tokens.color.semantic.informative)
export const positive = convertToHexColors(tokens.color.semantic.positive)
export const negative = convertToHexColors(tokens.color.semantic.negative)
export const notice = convertToHexColors(tokens.color.semantic.notice)

export const colors = {
  primitive: {
    black,
    white,
    gray,
    blue,
    green,
    red,
    yellow,
  },
  semantic: {
    neutral,
    informative,
    positive,
    negative,
    notice,
  },
} as const
