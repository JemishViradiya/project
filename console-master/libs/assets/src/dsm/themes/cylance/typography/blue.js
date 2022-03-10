import * as Blue from './blue.css'

const BB_TYPOGRAPHY = {
  ...Blue,
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: 16,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  button: {
    textTransform: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: '0.03571428571428571em',
    lineHeight: 1.4285714285714286,
  },
  h1: {
    fontSize: '1.5rem',
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: '-0.020833333333333332em',
    lineHeight: 1.3333333333333333,
  },
  h2: { fontSize: '1.25rem', fontWeight: '500', fontStyle: 'normal', letterSpacing: '-0.0125em', lineHeight: 1.4 },
  h3: { fontSize: '1rem', fontWeight: '500', fontStyle: 'normal', lineHeight: 1.5 },
  h4: { fontSize: '0.875rem', fontWeight: '500', fontStyle: 'normal', lineHeight: 1.4285714285714286 },
  h5: { fontSize: '0.75rem', fontWeight: '500', fontStyle: 'normal', letterSpacing: '0.012499999999999999em', lineHeight: 1.5 },
  h6: { fontSize: '0.625rem', fontWeight: '500', fontStyle: 'normal', letterSpacing: '0.015em', lineHeight: 1.5 },
  subtitle1: { fontSize: '1rem', fontWeight: '500', fontStyle: 'normal', lineHeight: 1.5 },
  subtitle2: { fontSize: '0.875rem', fontWeight: '500', fontStyle: 'normal', lineHeight: 1.4285714285714286 },
  body1: { fontSize: '1rem', fontWeight: '400', fontStyle: 'normal', lineHeight: 1.5 },
  body2: {
    fontSize: '0.875rem',
    fontWeight: '400',
    fontStyle: 'normal',
    letterSpacing: '0.010714285714285714em',
    lineHeight: 1.4285714285714286,
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: '400',
    fontStyle: 'normal',
    letterSpacing: '0.020833333333333332em',
    lineHeight: 1.3333333333333333,
  },
  overline: { fontSize: '0.625rem', fontWeight: '400', fontStyle: 'normal', letterSpacing: '0.05em', lineHeight: 1.4 },
}

export { BB_TYPOGRAPHY }
