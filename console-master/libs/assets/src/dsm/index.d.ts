import type { ThemeOptions } from '@material-ui/core'

interface ThemeBaseOptions {
  typography: Record<string, any>
  props: Record<string, any>
  shape: Record<string, any>
  spacing: Record<string, any>
}

interface ResponsiveThemeOptions extends ThemeOptions {
  cssVariables?: boolean
  light?: ThemeOptions
  dark?: ThemeOptions
  base?: ThemeBaseOptions
}

declare global {
  interface Window {
    UesTheme: ResponsiveThemeOptions
  }
}

declare const theme: ResponsiveThemeOptions
export { theme }
export * from './components/box'
export * from './components/buttongroup'
export * from './components/chip'
export * from './components/checkbox'
export * from './components/dialog'
export * from './components/dropdown'
export * from './components/formcontrol'
export * from './components/formgroup'
export * from './components/inputfield'
export * from './components/paper'
export * from './components/radio'
export * from './components/select'
export * from './components/switch'
export * from './components/table'
export * from './components/tableFilterChips'
export * from './components/tabs'
export * from './components/common'
