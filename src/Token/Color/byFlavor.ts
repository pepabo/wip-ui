import apolloTokens from '@pepabo-inhouse/tokens/build/apollo/javascript/tokens'
import flippersTokens from '@pepabo-inhouse/tokens/build/flippers/javascript/tokens'
import kungPuTokens from '@pepabo-inhouse/tokens/build/kung-pu/javascript/tokens'
import lolipopTokens from '@pepabo-inhouse/tokens/build/lolipop/javascript/tokens'
import minneTokens from '@pepabo-inhouse/tokens/build/minne/javascript/tokens'
import nachiguroTokens from '@pepabo-inhouse/tokens/build/nachiguro/javascript/tokens'
import pepperTokens from '@pepabo-inhouse/tokens/build/pepper/javascript/tokens'

type FlavorTokens = typeof pepperTokens

export type FlavorName =
  | 'pepper'
  | 'minne'
  | 'apollo'
  | 'nachiguro'
  | 'flippers'
  | 'kung-pu'
  | 'lolipop'

export const flavorTokensMap: Record<FlavorName, FlavorTokens> = {
  pepper: pepperTokens,
  minne: minneTokens,
  apollo: apolloTokens,
  nachiguro: nachiguroTokens,
  flippers: flippersTokens,
  'kung-pu': kungPuTokens,
  lolipop: lolipopTokens,
}

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

export function getColorsByFlavor(flavor: FlavorName) {
  const tokens = flavorTokensMap[flavor]

  const primitive = {
    black: convertToHexColors(tokens.color.primitive.black),
    white: convertToHexColors(tokens.color.primitive.white),
    gray: convertToHexColors(tokens.color.primitive.gray),
    blue: convertToHexColors(tokens.color.primitive.blue),
    green: convertToHexColors(tokens.color.primitive.green),
    red: convertToHexColors(tokens.color.primitive.red),
    yellow: convertToHexColors(tokens.color.primitive.yellow),
  }

  const semantic = {
    neutral: convertToHexColors(tokens.color.semantic.neutral),
    informative: convertToHexColors(tokens.color.semantic.informative),
    positive: convertToHexColors(tokens.color.semantic.positive),
    negative: convertToHexColors(tokens.color.semantic.negative),
    notice: convertToHexColors(tokens.color.semantic.notice),
  }

  return { primitive, semantic }
}
