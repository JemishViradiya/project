import * as Green from './green.css'

const CYLANCE_FONTS = {
  header: 'Titillium Web',
  body: 'Open Sans',
  fallback: 'sans-serif',
}

const fontSize = 14
const fontFamily = [CYLANCE_FONTS.body, CYLANCE_FONTS.fallback].join(',')
const fontFamilyHeader = [CYLANCE_FONTS.header, CYLANCE_FONTS.fallback].join(',')

const CYLANCE_TYPOGRAPHY = {
  ...Green,
  fontSize,
  fontFamily,
  h1: {
    fontFamily: fontFamilyHeader,
    lineHeight: '32px',
    fontSize: '28px',
    fontWeight: '600',
  },
  h2: {
    fontFamily: fontFamilyHeader,
    lineHeight: '32px',
    fontSize: '24px',
    fontWeight: 'normal',
  },
  h3: {
    fontFamily: fontFamilyHeader,
    lineHeight: '24px',
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '0',
  },
  h4: {
    fontFamily: fontFamilyHeader,
    lineHeight: '20px',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.15px',
  },
  h5: {
    fontFamily: fontFamilyHeader,
    lineHeight: '18px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.15px',
  },
  h6: {
    fontFamily: fontFamily,
    lineHeight: '15px',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.15px',
  },
  subtitle1: {
    fontFamily: fontFamily,
    lineHeight: '24px',
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '0.15px',
  },
  subtitle2: {
    fontFamily: fontFamily,
    lineHeight: '20px',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '.1px',
  },
  body1: {
    fontFamily: fontFamily,
    lineHeight: '24px',
    fontSize: '16px',
    letterSpacing: '0.5px',
  },
  body2: {
    fontFamily: fontFamily,
    lineHeight: '20px',
    fontSize: '14px',
    letterSpacing: '0.25px',
  },
  button: {
    fontFamily: fontFamilyHeader,
    lineHeight: '20px',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: fontFamily,
    lineHeight: '16px',
    fontSize: '12px',
    letterSpacing: '0.25px',
  },
}

export { CYLANCE_TYPOGRAPHY }
