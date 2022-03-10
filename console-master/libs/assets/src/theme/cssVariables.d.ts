import type { ThemeOptions } from '@material-ui/core'

declare function createCssVariablesTheme(theme: ThemeOptions, options?: { filter: (a: string, b: string) => boolean }): ThemeOptions

export { createCssVariablesTheme }
