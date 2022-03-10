const MuiTypography = ({ spacing }) => ({
  h1: {
    lineHeight: '32px',
    fontSize: '28px',
    fontWeight: '600',
  },
  h2: {
    lineHeight: '32px',
    fontSize: '24px',
    fontWeight: 'normal',
  },
  h3: {
    lineHeight: '24px',
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '0',
  },
  h4: {
    lineHeight: '20px',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.15px',
  },
  h5: {
    lineHeight: '18px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.15px',
  },
  h6: {
    lineHeight: '15px',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.15px',
  },
  subtitle1: {
    lineHeight: '24px',
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '0.15px',
  },
  subtitle2: {
    lineHeight: '20px',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '.1px',
  },
  body1: {
    lineHeight: '24px',
    fontSize: '16px',
    letterSpacing: '0.5px',
  },
  body2: {
    lineHeight: '20px',
    fontSize: '14px',
    letterSpacing: '0.25px',
  },
  button: {
    lineHeight: '20px',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  caption: {
    lineHeight: '16px',
    fontSize: '12px',
    letterSpacing: '0.25px',
  },
  gutterBottom: {
    marginBottom: spacing(4),
  },
})

export default MuiTypography
