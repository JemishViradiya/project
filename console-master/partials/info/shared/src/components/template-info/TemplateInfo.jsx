import React from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, Drawer, Grid, IconButton, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'

import { TEMPLATE_FIELDS } from '@ues-data/dlp'

const useStyles = makeStyles(theme => ({
  drawer: {
    width: '40%',
    flexShrink: 0,
  },
  drawerPaper: {
    width: '40%',
  },
  card: {
    height: '100%',
  },
  templateTitle: {
    paddingBottom: '30px',
  },
  columnsLeft: {
    minHeight: '30px',
  },
  columnsRight: {
    minHeight: '30px',
    borderBottom: '1px solid #e6e6e6',
  },
  columnTextCapitalized: {
    textTransform: 'capitalize',
  },
}))

export const TemplateInfo = ({ isOpen, onClose, selectedRow, columns, ...rest }) => {
  const classes = useStyles()
  const { t } = useTranslation(['dlp/common'])
  if (isOpen !== true) {
    return null
  }

  console.log('SELECTED ROW = ', selectedRow)
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
    <Drawer
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor={'right'}
      open={isOpen}
      onClose={onClose}
    >
      <Card className={classes.card}>
        <div>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <CardContent>
          <Grid container>
            <Grid item xs={6} md={6}>
              <div className={classes.templateTitle}>
                <Typography variant="h1">{selectedRow[formTitleField]}</Typography>
              </div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6} md={4}>
              {visibleFields.map(item => {
                return (
                  <div className={classes.columnsLeft} key={'idx-' + item.label}>
                    {!useDataKeyAsId && <Typography variant="h4">{t('setting.template.columns.' + item.key)}</Typography>}
                    {useDataKeyAsId && <Typography variant="h4">{t('setting.template.columns.' + item.key)}</Typography>}
                  </div>
                )
              })}
            </Grid>
            <Grid item xs={6} md={6}>
              {visibleFields.map(item => {
                return (
                  <div className={classes.columnsRight} key={'idx-' + item.key}>
                    <Typography variant="body2" className={classes.columnTextCapitalized}>
                      {selectedRow[item.key] instanceof Array && item.key === TEMPLATE_FIELDS.DATA_ENTITIES
                        ? selectedRow[item.key].map(entity => entity.name).join(', ')
                        : selectedRow[item.key]}
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
