// dependencies
import React from 'react'

// components
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

// styles
import useStyles from './styles'

interface StaticCheckboxTablePropTypes {
  fieldColumnName: string
  checkboxColumnName: string
  autoIdPrefix: string
}

const StaticCheckboxTable = ({ fieldColumnName, checkboxColumnName, autoIdPrefix }: StaticCheckboxTablePropTypes): JSX.Element => {
  const classes = useStyles()

  return (
    <Grid container data-autoid={`${autoIdPrefix}-head`}>
      <Grid item xs={10} className={classes.headCell}>
        <Typography variant="button">{fieldColumnName}</Typography>
      </Grid>
      <Grid item xs={2} className={classes.headCell}>
        <Typography variant="button">{checkboxColumnName}</Typography>
      </Grid>
    </Grid>
  )
}

export default StaticCheckboxTable
