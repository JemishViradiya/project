import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

const standardWidth = {
  width: '1024px',
}

const fullWidth = {
  width: '100%',
}

const paper = theme => {
  return {
    marginLeft: 'auto',
    marginRight: 'auto',
  }
}

const defaulWidthPaperStyles = (theme: Theme) => {
  return {
    root: {
      ...paper(theme),
      ...standardWidth,
    },
  }
}

const fullWidthPaperStyles = (theme: Theme) => {
  return {
    root: {
      ...paper(theme),
      ...fullWidth,
    },
  }
}

export const useMuiPaperFullWidthStyles = makeStyles<Theme>(fullWidthPaperStyles)
export const makeFullWidthStyles = fullWidthPaperStyles

export const useMuiPaperDefaultWidthStyles = makeStyles<Theme>(defaulWidthPaperStyles)
export const makeDefaultPaperStyles = defaulWidthPaperStyles
