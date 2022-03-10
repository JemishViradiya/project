/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const { stringify: jsStringify } = require('javascript-stringify')

const ROOT_FONT_SIZE = 16 /* font size in PX */
const SPACING = 8 /* spacing in PX */
const BORDER = 1 /* border width in PX */

const common = {
  verticalComponentMultiplier: defaultValues => calcComponentVerticalPaddingMultiplier(defaultValues, 0),
  verticalComponentMultiplierWithBorder: defaultValues => calcComponentVerticalPaddingMultiplier(defaultValues, BORDER * 2),
  verticalMultiplier: (height, border, fontSize) => calcVerticalPaddingMultiplier(height, border, fontSize),
  trimPx: value => trimUnit(value, 'px'),
  trimRem: value => trimUnit(value, 'rem'),
  spread: obj => jsStringify(obj).slice(1, -1),
  SPACING: SPACING,
  ROOT_FONT_SIZE: ROOT_FONT_SIZE,
}

const calcComponentVerticalPaddingMultiplier = (defaultValues, border) => {
  let { height, fontSize, iconSize = '0rem' } = defaultValues

  height = height.toLowerCase().replace('px', '')
  fontSize = fontSize.toLowerCase().replace('rem', '')
  iconSize = iconSize.toLowerCase().replace('rem', '')

  fontSize = Math.max(fontSize, iconSize)

  return calcVerticalPaddingMultiplier(height, border, fontSize)
}

/**
 * Calculates spacing multiplier for vertical padding.
 *
 * @param {*} total component height in px
 * @param {*} border border width in px
 * @param {*} lineHeight line heithg in rem
 */
const calcVerticalPaddingMultiplier = (height, border, lineHeight) => {
  /* eslint-disable sonarjs/prefer-immediate-return */
  process.stdout.write(`height: ${height}, border: ${border}, lineHeight: ${lineHeight * ROOT_FONT_SIZE} `)
  const result = (height - border - lineHeight * ROOT_FONT_SIZE) / (2 * SPACING)
  process.stdout.write(`, result: ${result}rem or ${result * SPACING}px\n`)
  return result
}

const trimUnit = (value, unit) => {
  return value.toLowerCase().replace(unit, '')
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const spread = obj => {
  return jsStringify(obj).slice(1, -1)
}

module.exports = common
