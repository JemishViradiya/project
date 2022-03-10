import React from 'react'

import { useMediaQuery } from '@material-ui/core'

import { theme as muiTheme } from '../dsm'
import { createCssVariablesTheme } from './cssVariables'
import { createMuiThemeFactory } from './factory'

const mediaQueryColorSchemeDark = '(prefers-color-scheme: dark)'
const mediaQueryPointerCoarse = '(hover: none) and (pointer: coarse)'
const mediaQueryMotionReduce = '(prefers-reduced-motion: reduce)'

const DARK_MODE_WHITELISTED_DOMAINS = [
  'staging.ues.labs.blackberry.com',
  'qa2-ues.cylance.com',
  'local-staging-ues.cylance.com',
  'dev.ues.labs.blackberry.com',
  'r02-ues.cylance.com',
  'r00-ues.cylance.com',
  'local-dev-ues.cylance.com',
  'rim.net',
  'ues.cylance.com',
  'ues-euc1.cylance.com',
  'ues-apne1.cylance.com',
  'ues-sae1.cylance.com',
]

const createMuiTheme = createMuiThemeFactory(muiTheme)

const mediaQueryOptions = { noSsr: true }
const defaultThemeOverrides = {
  cssVariables: true,
}
const themeCache = {}

const useCssVariables = cssVariables => {
  React.useEffect(() => {
    if (!cssVariables) return

    let styleEl = document.head.querySelector('#ues-mui-variables')
    if (!styleEl) {
      document.head.insertAdjacentHTML('afterbegin', '<style type="text/css" id="ues-mui-variables"></style>')
      styleEl = document.head.querySelector('#ues-mui-variables')
    }

    const variablesContent = Object.entries(cssVariables)
      .map(([name, value]) => `${name}: ${JSON.stringify(value)};`)
      .join('\n')
    styleEl.innerText = `:root {
${variablesContent}
}`
  }, [cssVariables])
}

const darkModeEnabled = () => {
  return DARK_MODE_WHITELISTED_DOMAINS.some(domain => window.location.origin.includes(domain))
}

const useResponsiveMuiTheme = (themeOverrides = defaultThemeOverrides) => {
  const isDark = useMediaQuery(mediaQueryColorSchemeDark, mediaQueryOptions)
  const isCoarse = useMediaQuery(mediaQueryPointerCoarse, mediaQueryOptions)
  const isMotionReduced = useMediaQuery(mediaQueryMotionReduce, mediaQueryOptions)

  const responsiveTheme = React.useMemo(() => {
    const key = `${isDark}:${isCoarse}`
    let responsiveTheme = themeCache[key]
    if (!responsiveTheme) {
      responsiveTheme = createMuiTheme(
        {
          colorScheme: isDark && darkModeEnabled() ? 'dark' : 'light', // Disable dark color scheme for production
          pointer: isCoarse ? 'coarse' : 'fine',
          motion: isMotionReduced ? 'reduce' : undefined,
        },
        themeOverrides,
      )
      if (themeOverrides.cssVariables) {
        responsiveTheme = createCssVariablesTheme(responsiveTheme)
      }
      // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // // @ts-ignore
      // if (window.cacheTheme !== false) {
      //   themeCache[key] = responsiveTheme
      // }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.MuiTheme = responsiveTheme
    return responsiveTheme
  }, [isDark, isCoarse, isMotionReduced, themeOverrides])

  useCssVariables(responsiveTheme.cssVariables)

  return responsiveTheme
}

export { createMuiTheme, createMuiThemeFactory, createCssVariablesTheme, useResponsiveMuiTheme }
