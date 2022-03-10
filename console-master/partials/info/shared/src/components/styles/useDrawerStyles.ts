import { makeStyles } from '@material-ui/core/styles'

import type { UesTheme } from '@ues/assets'

export const useDrawerStyles = makeStyles<UesTheme>((theme: any) => ({
  title: {
    paddingLeft: theme.spacing(6),
    paddingBottom: theme.spacing(2),
    whiteSpace: 'break-spaces',
  },
  closeIcon: {
    marginLeft: 'auto',
    marginBottom: theme.spacing(2),
  },
  paper: {
    backgroundColor: theme.palette.background.body,
    width: theme.spacing(150),
  },
  typographyMargin: {
    marginBottom: theme.spacing(2),
  },
  fileDetailsIcons: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-end',
    color: theme.palette.grey['600'],
  },
  saveAlt: {
    cursor: 'pointer',
  },
  fileIcon: {
    padding: theme.spacing(6),
    marginRight: theme.spacing(11),
    background: 'hsl(212deg 73% 9% / 14%)',
    borderRadius: '50%',
    '& svg': {
      fontSize: theme.spacing(14),
    },
  },
  fileSummaryHeading: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  fileInfoTitle: {
    fontSize: theme.spacing(3),
  },
  dataEntites: {
    color: '#424242',
  },
  fileSummaryDialog: {
    position: 'absolute',
    bottom: theme.spacing(9),
    width: theme.spacing(130),
    maxHeight: theme.spacing(100),
    padding: theme.spacing(6),
    background: theme.palette.common.white,
    boxShadow: '0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%)',
    overflowY: 'auto',
    opacity: '0',
    zIndex: -1,
    transition: 'opacity 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&.opened': {
      opacity: '1',
      zIndex: 1,
    },
  },
  snipetsList: {
    '& li': {
      paddingBottom: theme.spacing(2.5),
    },
  },
}))
