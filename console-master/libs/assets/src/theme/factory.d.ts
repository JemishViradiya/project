/* eslint-disable sonarjs/no-duplicate-string */
import type { StyleRules, Theme } from '@material-ui/core'
import type { ComponentNameToClassKey } from '@material-ui/core/styles/overrides'
import type { CSSProperties } from '@material-ui/core/styles/withStyles'

import type { ResponsiveThemeOptions } from '../dsm'

declare type ResponsiveThemeOverrides = {
  [Name in keyof ComponentNameToClassKey]?: Partial<StyleRules<ComponentNameToClassKey[Name]>>
} &
  {
    [Name in keyof ComponentNameToClassKey]?: (theme: Theme) => Partial<StyleRules<ComponentNameToClassKey[Name]>>
  } & {
    MuiCssBaseline?: {
      '@global'?: {
        '@font-face'?: CSSProperties['@font-face']
      } & Record<string, CSSProperties['@font-face'] | CSSProperties> // allow arbitrary selectors
    }
  }

declare function createMuiTheme(
  context: {
    colorScheme?: 'light' | 'dark'
    motion?: undefined | 'reduce'
    pointer?: 'fine' | 'coarse'
  },
  overrides?: ResponsiveThemeOverrides,
): Theme

declare function createMuiThemeFactory(muiTheme: ResponsiveThemeOptions): typeof createMuiTheme

export { createMuiTheme, createMuiThemeFactory }
