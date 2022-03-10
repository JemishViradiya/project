import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  tabs: {
    '& .MuiTabs-flexContainer:not(.MuiTabs-flexContainerVertical) .MuiTab-root:first-child': {
      marginLeft: 0,
    },
    marginBottom: theme.spacing(6),
    // TODO adjust the styles accordingly to future changes in behaviours components
    marginTop: -theme.spacing(10),
  },
}))
