// dependencies

import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

// components
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'

import { mutateCreateStrategy, queryAllProductVersions, queryStrategies, selectStrategies } from '@ues-data/epp'
import { useStatefulReduxQuery } from '@ues-data/shared'

import { PRODUCTS } from '../constants'
import CreateStrategyDialog from './createStrategyDialog'
import UpdateStrategiesTable from './updateStrategiesTable'

const UpdateStrategies = () => {
  const { t: translate } = useTranslation(['deployments'])

  // state

  const { loading: loadingStrategies, result: updateStrategiesResult } = useSelector(selectStrategies)
  const updateStrategiesList = updateStrategiesResult || []
  const [isFirstRender, setIsFirstRender] = useState(true)
  const [isCreateStrategyDialogOpen, setIsCreateStrategyDialogOpen] = useState(false)

  // dispatch

  const { refetch: refetchStrategies } = useStatefulReduxQuery(queryStrategies, { skip: true })
  const { refetch: refetchMutateCreateStrategy } = useStatefulReduxQuery(mutateCreateStrategy, { skip: true })
  const { refetch: refetchQueryAllProductVersions } = useStatefulReduxQuery(queryAllProductVersions, { skip: true })

  const dispatchGetUpdateStrategiesList = useCallback(() => {
    refetchStrategies()
    setIsFirstRender(false)
  }, [refetchStrategies])

  const dispatchCreateUpdateStrategy = useCallback(
    (name, strategies, description) => {
      refetchMutateCreateStrategy({
        name,
        strategies,
        description,
      })
    },
    [refetchMutateCreateStrategy],
  )

  const dispatchGetAllProductVersions = useCallback(() => {
    refetchQueryAllProductVersions({ products: PRODUCTS.map(product => product.value) })
  }, [refetchQueryAllProductVersions])

  // actions

  const onCreateStrategyDialogOpen = () => {
    setIsCreateStrategyDialogOpen(true)
  }

  // effects

  useEffect(dispatchGetUpdateStrategiesList, [dispatchGetUpdateStrategiesList])

  useEffect(dispatchGetAllProductVersions, [dispatchGetAllProductVersions])

  return (
    <Paper elevation={0} data-autoid="update-strategies">
      <Card>
        <CardContent>
          <Typography variant="h2" gutterBottom>
            {translate('UpdateStrategies')}
            <InfoOutlinedIcon data-autoid="update-strategies-info" />
          </Typography>
          <Button
            color="secondary"
            variant="contained"
            onClick={onCreateStrategyDialogOpen}
            startIcon={<AddIcon />}
            data-autoid="update-strategies-add"
          >
            {translate('AddUpdateStrategy')}
          </Button>
          <CreateStrategyDialog
            isDialogOpen={isCreateStrategyDialogOpen}
            onDialogClose={() => {
              setIsCreateStrategyDialogOpen(false)
            }}
            onDialogSubmit={dispatchCreateUpdateStrategy}
          />
          <UpdateStrategiesTable
            updateStrategies={updateStrategiesList}
            isStrategiesListPending={isFirstRender || loadingStrategies}
          />
        </CardContent>
      </Card>
    </Paper>
  )
}

export default UpdateStrategies
