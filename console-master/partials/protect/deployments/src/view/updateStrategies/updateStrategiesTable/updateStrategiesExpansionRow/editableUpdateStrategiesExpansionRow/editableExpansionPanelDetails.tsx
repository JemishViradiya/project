// dependencies
import cond from 'lodash/cond'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { Args, BaseInputProps, InputInitializer } from 'react-use-form-state'

// components
import Box from '@material-ui/core/Box'
import Fade from '@material-ui/core/Fade'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import type { StrategiesListItem, Strategy } from '@ues-data/epp'

import { PRODUCTS } from '../../../../constants'
import EditableProductStrategies from './editableProductStrategies'

interface EditableExpansionPanelDetailsPropTypes {
  values: StrategiesListItem
  setField: (name: string, value: Strategy[]) => void
  textProps: InputInitializer<StrategiesListItem, Args<string>, BaseInputProps<StrategiesListItem>>
}

const UpdateStrategyFactory = (overrides: Partial<Strategy> = {}): Strategy => ({
  productName: '',
  strategyType: '',
  version: '',
  errors: [],
  ...overrides,
})

const EditableExpansionPanelDetails = ({ values, setField, textProps }: EditableExpansionPanelDetailsPropTypes) => {
  const { t: translate } = useTranslation(['deployments'])

  // actions

  const onAddAnotherProduct = () => {
    const nextAvailableProduct = PRODUCTS.find(
      product => !values.strategies.some(strategy => strategy.productName === product.value),
    )

    if (!nextAvailableProduct) {
      return
    }

    const emptyUpdateStrategy = UpdateStrategyFactory({
      productName: nextAvailableProduct.value,
    })
    const updatedStrategies = [...values.strategies, emptyUpdateStrategy]

    setField('strategies', updatedStrategies)
  }

  // render

  return (
    <Fade in timeout={500}>
      <Box width="100%" data-autoid="update-strategies-editable-details">
        <EditableProductStrategies values={values} setField={setField} />
        <Box my={6}>
          {cond([
            [
              () => values.strategies.length < PRODUCTS.length,
              () => (
                <Link onClick={onAddAnotherProduct} data-autoid="update-strategies-edit-add-another-product-link">
                  <Typography variant="body2" component="span">
                    + {translate('AddAnotherProduct')}
                  </Typography>
                </Link>
              ),
            ],
            [
              () => true,
              () => (
                <Typography variant="body2" data-autoid="update-strategies-edit-add-another-product-link-disabled">
                  + {translate('AddAnotherProduct')}
                </Typography>
              ),
            ],
          ])(undefined)}
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <TextField
              {...textProps('name')}
              label={translate('StrategyName')}
              inputProps={{
                'data-autoid': 'update-strategies-edit-name',
              }}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...textProps('description')}
              label={translate('DescriptionOptional')}
              inputProps={{
                'data-autoid': 'update-strategies-edit-description',
              }}
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
    </Fade>
  )
}

export default EditableExpansionPanelDetails
