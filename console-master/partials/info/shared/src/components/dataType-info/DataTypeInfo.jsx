import React from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, Drawer, Grid, IconButton, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles(theme => ({
  drawer: {
    flexShrink: 0,
  },
  card: {
    height: '100%',
  },
  dataTypeTitle: {
    paddingBottom: theme.spacing(7.5),
  },
  columnsLeft: {
    minHeight: theme.spacing(7.5),
  },
  columnsRight: {
    minHeight: theme.spacing(7.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  columnTextCapitalized: {
    textTransform: 'capitalize',
  },
}))

// TODO: It was used in DataTypesSettings component inside the table to view info on Data Type.
// Now this logic is available in Update data Type page so probably should refuse completely from this component

export const DataTypeInfo = ({ isOpen, onClose, selectedRow, columns, ...rest }) => {
  const classes = useStyles()
  const { t } = useTranslation(['dlp/common'])
  if (isOpen !== true) {
    return null
  }

  const { useDataKeyAsId } = rest
  let keyAttribute = 'id'
  if (useDataKeyAsId) {
    keyAttribute = 'dataKey'
  }

  let formTitleField = 'name'

  const columnsIds2Values = columns.map(col => {
    return { key: col[keyAttribute], label: col.label }
  })

  const skippedFileds = ['name', 'guid', 'created', 'updated']
  const visibleFields = columnsIds2Values.filter(item => !skippedFileds.includes(item.key))

  return (
    <Drawer className={classes.drawer} anchor={'right'} open={isOpen} onClose={onClose}>
      <Card className={classes.card}>
        <div>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <CardContent>
          <Grid container>
            <Grid item xs={6} md={6}>
              <div className={classes.dataTypeTitle}>
                <Typography variant="h1">{selectedRow[formTitleField]}</Typography>
              </div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6} md={4}>
              {visibleFields.map(item => {
                return (
                  <div className={classes.columnsLeft} key={'idx-' + item.label}>
                    {!useDataKeyAsId && <Typography variant="h4">{t('setting.dataType.columns.' + item.key)}</Typography>}
                    {useDataKeyAsId && <Typography variant="h4">{t('setting.dataType.columns.' + item.key)}</Typography>}
                  </div>
                )
              })}
            </Grid>
            <Grid item xs={6} md={6}>
              {visibleFields.map(item => {
                return (
                  <div className={classes.columnsRight} key={'idx-' + item.key}>
                    <Typography variant="body2" className={classes.columnTextCapitalized}>
                      {selectedRow[item.key] instanceof Array ? selectedRow[item.key].join(', ') : selectedRow[item.key]}
                    </Typography>
                  </div>
                )
              })}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Drawer>
  )
}
