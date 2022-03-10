const skipKeys = new Set(['keys', 'values', 'shadows', 'overrides', 'type'])
const defaultFilter = (key, parentKey) => {
  if (key.indexOf('@') !== -1 || skipKeys.has(key) || (key === 'fontFamily' && parentKey !== 'typography')) {
    return false
  }
  return true
}

const createCssVariablesThemeOptions = (acc, parentKey, parentValue, filter) => {
  const keys = Object.keys(parentValue)
  if (keys.length === 0) {
    return acc
  }
  return keys.reduce((acc, key) => {
    if (!filter(key, parentKey)) {
      return acc
    }
    const value = parentValue[key]
    if (typeof value === 'object') {
      acc[key] = {}
      createCssVariablesThemeOptions(acc[key], key, value, filter)
    } else if (typeof value !== 'function') {
      acc[key] = value
    }
    return acc
  }, acc)
}

const createCssVariables = (acc, [parentKey, parentValue]) => {
  const entries = Object.entries(parentValue)
  if (entries.length === 0) {
    return acc
  }
  return entries.reduce((acc, [key, value]) => {
    const sep = key[0] === '&' ? '_' : '-'
    if (key === acc['--mui-palette-type']) {
      const cssKey = `--${parentKey}${sep}${key}`
      acc[cssKey] = value
    }
    key = key.replace(/[&$ +]+/g, '_')
    if (typeof value === 'object') {
      createCssVariables(acc, [`${parentKey}${sep}${key}`, value])
    } else if (typeof value !== 'function') {
      const cssKey = `--${parentKey}${sep}${key}`
      acc[cssKey] = value
      parentValue[key] = `var(${cssKey})`
    }
    return acc
  }, acc)
}

const createCssVariablesTheme = (theme, { filter = defaultFilter } = {}) => {
  const options = createCssVariablesThemeOptions({}, 'mui', theme, filter)
  const spacing = theme.spacing()

  const seed = Object.assign({}, { '--mui-palette-type': theme.palette.type, '--mui-spacing': spacing })
  for (let i = 1; i <= 10; i++) {
    seed[`--mui-spacing-${i}`] = `${spacing * i}px`
  }
  const cssVariables = createCssVariables(seed, ['mui', options])
  Object.defineProperty(theme, 'cssVariables', {
    configurable: true,
    value: cssVariables,
  })
  return theme
}

export { createCssVariablesTheme }
