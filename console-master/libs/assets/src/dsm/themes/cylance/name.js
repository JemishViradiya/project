const getThemeName = name => {
  if (!name && globalThis.sessionStorage) {
    name = globalThis.sessionStorage.UES_THEME_NAME
  }
  if (!name && globalThis.localStorage) {
    name = globalThis.localStorage.UES_THEME_NAME
  }

  return name || 'CY_GREEN'
}

const THEME_NAME = getThemeName(globalThis.UES_THEME_NAME)

export { THEME_NAME }
