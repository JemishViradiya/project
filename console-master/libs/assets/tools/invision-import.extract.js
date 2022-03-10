/* eslint-disable @typescript-eslint/no-var-requires */
const ColorString = require('color-string')
const lodash = require('lodash')

const normalizeColor = input => {
  const parsed = ColorString.get.rgb(input)
  return parsed ? ColorString.to.hex(parsed.value || parsed).toLowerCase() : input
}

const normalizeColorDeep = obj => {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      obj[key] = normalizeColor(value)
    } else if (typeof value === 'object') {
      obj[key] = normalizeColorDeep(value)
    }
  }
  return obj
}

const normalizePalette = obj => {
  const {
    base: { palette: base },
    light: { palette: light },
    dark: { palette: dark },
    colors: { palette: colors },
  } = normalizeColorDeep(obj)
  return { base, light, dark, colors }
}

const normalizeTypeographyStyle = (obj, { fontSize }) => {
  for (const key of Object.keys(obj)) {
    const { [key]: value } = obj
    if (value === null || value === undefined || key === 'fontFamily') {
      delete obj[key]
    }
  }

  const { fontSize: localFontSize } = obj
  const localFontSizePx = parseFloat(localFontSize.slice(0, -2))
  if (obj.lineHeight && obj.lineHeight.endsWith('px')) {
    obj.lineHeight = parseFloat(obj.lineHeight.slice(0, -2)) / localFontSizePx
  }
  if (obj.letterSpacing && obj.letterSpacing.endsWith('px')) {
    obj.letterSpacing = `${parseFloat(obj.letterSpacing.slice(0, -2)) / localFontSizePx}em`
  }
  if (obj.fontSize && obj.fontSize.endsWith('px')) {
    obj.fontSize = `${parseFloat(obj.fontSize.slice(0, -2)) / fontSize}rem`
  }

  return lodash.pick(obj, ['fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'lineHeight', 'textTransform'])
}

const extractPalette = ({ colors }) => {
  const white = '#fefefe'
  const black = '#020202'
  const base = {
    contrastThreshold: 3,
    tonalOffset: 0.25,
    common: { white, black },
    shadows: {
      umbraOpacity: 0.02,
      penumbraOpacity: 0.014,
      ambientShadowOpacity: 0.012,
    },
    divider: 'rgba(128, 128, 128, 0.15)',
  }
  const colorsObj = extractColors(colors, ['blue', 'green', 'grey', 'red', 'yellow'])

  const theme = colors.reduce(
    (agg1, block) => {
      return block.colors.reduce((agg, c) => lodash.set(agg, c.name, c.value), agg1)
    },
    {
      base: { palette: base },
      light: { palette: { type: 'light' } },
      dark: { palette: { type: 'dark' } },
      colors: { palette: colorsObj },
    },
  )

  return normalizePalette(theme)
}

const extractColors = (colors, colorNames) => {
  const result = {}
  for (const color of colors) {
    const colorName = color.name.toLowerCase()
    if (colorNames.find(x => x === color.name.toLowerCase())) {
      result[colorName] = Object.values(color.colors).reduce((acc, x) => {
        const [_, colorValue] = x.name.split(' ')
        Object.assign(acc, { [colorValue]: x.value })
        return acc
      }, {})
      console.log(result)
    }
  }

  return result
}

const extractTypography = ({ fonts, typeStyles }) => {
  const theme = {
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 16,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      button: {
        textTransform: 'none',
      },
    },
  }
  const reduced = typeStyles.reduce(
    (agg, { name, ...typeStyle }) =>
      lodash.set(agg, name, {
        ...lodash.get(agg, name),
        ...normalizeTypeographyStyle(typeStyle, theme.typography),
      }),
    theme,
  )
  return reduced.typography
}

const filterMuiPalette = ({
  palette: {
    // non-color items
    type,
    breakpoints,
    direction,
    mixins,
    augmentColor,
    getContrastText,
    // light/dark sensitive
    divider,
    background,
    text,
    action,
    // abstract palette
    ...palette
  },
}) => {
  return normalizeColorDeep(palette)
}

const filterMuiSchemePalette = ({
  palette: {
    // light/dark sensitive
    type,
    background,
    divider,
    text,
    action,
  },
}) => {
  return normalizeColorDeep({ type, background, divider, text, action })
}

module.exports = {
  extractPalette,
  extractTypography,
  filterMuiPalette,
  filterMuiSchemePalette,
}
