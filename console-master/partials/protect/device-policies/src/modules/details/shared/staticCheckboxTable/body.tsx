// dependencies
import React from 'react'

import Checkbox from '@material-ui/core/Checkbox'
// components
import Grid from '@material-ui/core/Grid'

// styles
import useStyles from './styles'

interface StaticCheckboxTableBodyPropTypes {
  fields: Record<string, string>
  values: Record<string, string>
  rows: Record<string, string>
  setField: (name: string, value: `${0 | 1}`) => void
  autoIdPrefix: string
}

const StaticCheckboxTableBody = ({
  fields,
  values,
  rows,
  setField,
  autoIdPrefix,
}: StaticCheckboxTableBodyPropTypes): JSX.Element => {
  const classes = useStyles()

  // actions

  const onChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => setField(field, e.target.checked ? '1' : '0')

  // render

  const renderRow = (key: string, label: string) => (
    <Grid key={`${autoIdPrefix}-${key}-${label}`} item container className={classes.row} data-autoid={`${autoIdPrefix}-row`}>
      <Grid item xs={10} className={classes.bodyCell}>
        {label}
      </Grid>
      <Grid item xs={2} className={classes.bodyCell}>
        <Checkbox checked={values[fields[key]] === '1'} onChange={onChange(fields[key])} />
      </Grid>
    </Grid>
  )

  return <Grid container>{Object.keys(rows).map(rowKey => renderRow(rowKey, rows[rowKey]))}</Grid>
}

export default StaticCheckboxTableBody
