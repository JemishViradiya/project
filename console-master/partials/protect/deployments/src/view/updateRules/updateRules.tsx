// dependencies
import cond from 'lodash/cond'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

// components
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'

import type { UpdateRule } from '@ues-data/epp'
import { queryUpdateRules, selectUpdateRules } from '@ues-data/epp'
import { useStatefulReduxQuery } from '@ues-data/shared'

import UpdateRulesTable from './updateRulesTable'

const UpdateRules = () => {
  const { t: translate } = useTranslation(['deployments', 'general/form'])

  // state

  const { loading: loadingUpdateRules, result: updateRulesResult } = useSelector(selectUpdateRules)
  const updateRulesList = updateRulesResult || []
  const [isFirstRender, setIsFirstRender] = useState(true)
  const [isEditable, setIsEditable] = useState(false)

  // dispatch

  const { refetch: refetchQueryUpdateRules } = useStatefulReduxQuery(queryUpdateRules, { skip: true })
  const dispatchGetUpdateRulesList = useCallback(() => {
    refetchQueryUpdateRules()
  }, [refetchQueryUpdateRules])

  // actions

  const onToggleIsEditable = () => {
    setIsEditable(!isEditable)
  }

  const onDelete = (rule: UpdateRule) => {
    // --TODO
    console.log(rule)
  }

  const onSaveEdit = () => {
    // --TODO:
  }

  // utils

  const getDateString = (date = moment()) => {
    // --TODO: get the date of the last modified rule
    return date.format('MM/DD/YYYY h:mm a')
  }

  // effects

  useEffect(() => {
    dispatchGetUpdateRulesList()
    setIsFirstRender(false)
  }, [dispatchGetUpdateRulesList])

  const isRulesListPending = isFirstRender || loadingUpdateRules

  // render

  const renderEditButton = () => (
    <Grid item>
      <Button
        color="primary"
        variant="contained"
        onClick={onToggleIsEditable}
        startIcon={<EditIcon />}
        data-autoid="update-rules-edit"
      >
        {translate('general/form:commonLabels.edit')}
      </Button>
    </Grid>
  )

  const renderSaveButtons = () => (
    <>
      <Grid item>
        <Button variant="outlined" onClick={onToggleIsEditable} data-autoid="update-rules-cancel">
          {translate('general/form:commonLabels.cancel')}
        </Button>
      </Grid>
      <Grid item>
        <Button color="primary" variant="contained" onClick={onSaveEdit} data-autoid="update-rules-save">
          {translate('general/form:commonLabels.save')}
        </Button>
      </Grid>
    </>
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <Paper elevation={0} data-autoid="update-rules">
        <Card>
          <CardContent>
            <Typography variant="h2" gutterBottom>
              {translate('UpdateRules')}
              <InfoOutlinedIcon data-autoid="update-rules-info" />
            </Typography>
            <Grid container>
              <Grid item xs={4}>
                <Button color="secondary" variant="contained" startIcon={<AddIcon />} data-autoid="update-rules-add">
                  {translate('AddUpdateRule')}
                </Button>
              </Grid>
              <Grid item xs={8} container justifyContent="flex-end" alignItems="center" spacing={4}>
                <Grid item>
                  <Typography variant="body2">
                    {translate('LastModifiedRule', {
                      date: getDateString(), // --TODO
                      email: 'User@company.com', // --TODO
                    })}
                  </Typography>
                </Grid>
                {cond([
                  [() => isEditable, renderSaveButtons],
                  [() => true, renderEditButton],
                ])(undefined)}
              </Grid>
            </Grid>
            <UpdateRulesTable
              updateRules={updateRulesList}
              isEditable={isEditable}
              isRulesListPending={isRulesListPending}
              onDelete={onDelete}
            />
          </CardContent>
        </Card>
      </Paper>
    </DndProvider>
  )
}

export default UpdateRules
