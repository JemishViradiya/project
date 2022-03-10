// dependencies
import cond from 'lodash/cond'
import get from 'lodash/get'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

// components
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import type { StrategiesListItem, Strategy } from '@ues-data/epp'
import { ProductType, selectAllProductVersions, StrategyTypes } from '@ues-data/epp'
import { BasicDelete } from '@ues/assets'

import { PRODUCTS } from '../../../../constants'

interface EditableProductStrategiesPropTypes {
  values: StrategiesListItem
  setField: (name: string, value: Strategy[]) => void
}

const EditableProductStrategies = ({ values, setField }: EditableProductStrategiesPropTypes) => {
  const { t: translate } = useTranslation(['deployments'])

  // state

  const { result: allProductVersions } = useSelector(selectAllProductVersions)

  // actions

  const onSelect = (field, index) => ({ target: { value } }) => {
    const updatedStrategies = values.strategies.map((strategy, strategyIndex) =>
      cond([
        [
          () => strategyIndex === index,
          () => ({
            ...strategy,
            [field]: value,
          }),
        ],
        [() => true, () => strategy],
      ])(undefined),
    )

    setField('strategies', updatedStrategies)
  }

  const onDeleteProduct = deleteIndex => () => {
    const updatedStrategies = values.strategies.filter((_strategy, index) => index !== deleteIndex)

    setField('strategies', updatedStrategies)
  }

  // render

  const renderProductSelect = index =>
    cond([
      [
        () => values.strategies[index].productName === ProductType.Protect,
        () => (
          <div data-autoid="update-strategies-edit-strategy-product-static-protect">
            <Box mb={2}>
              <Typography variant="subtitle2">{translate('Product')}</Typography>
            </Box>
            <Typography variant="body2">CylancePROTECT</Typography>
          </div>
        ),
      ],
      [
        () => true,
        () => (
          <TextField
            select
            fullWidth
            value={values.strategies[index].productName}
            onChange={onSelect('productName', index)}
            label={translate('Product')}
            data-autoid={`update-strategies-edit-strategy-${index}-product-name`}
            SelectProps={{
              MenuProps: {
                MenuListProps: {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  'data-autoid': `update-strategies-edit-strategy-${index}-product-name-menu`,
                },
              },
            }}
          >
            {PRODUCTS.map(product => (
              <MenuItem
                key={`${values.updateStrategyId}-${product.value}-product-select-item`}
                value={product.value}
                disabled={values.strategies.some(strategy => strategy.productName === product.value)}
              >
                {translate(product.label)}
              </MenuItem>
            ))}
          </TextField>
        ),
      ],
    ])(undefined)

  const renderStrategySelect = index => (
    <TextField
      select
      fullWidth
      value={values.strategies[index].strategyType}
      onChange={onSelect('strategyType', index)}
      label={translate('Strategy')}
      data-autoid={`update-strategies-edit-strategy-${index}-strategy-type`}
      SelectProps={{
        MenuProps: {
          MenuListProps: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            'data-autoid': `update-strategies-edit-strategy-${index}-strategy-type-menu`,
          },
        },
      }}
    >
      {Object.values(StrategyTypes).map(strategy => (
        <MenuItem key={`${values.updateStrategyId}-${strategy}-strategy-select-item`} value={strategy}>
          {translate(strategy)}
        </MenuItem>
      ))}
    </TextField>
  )

  const renderVersionSelect = index => {
    const { productName } = values.strategies[index]
    const versions = get(allProductVersions, productName, []) as string[]

    return (
      <TextField
        select
        fullWidth
        value={values.strategies[index].version}
        onChange={onSelect('version', index)}
        label={translate('Version')}
        disabled={values.strategies[index].strategyType !== StrategyTypes.FIXED}
        data-autoid={`update-strategies-edit-strategy-${index}-version`}
        SelectProps={{
          MenuProps: {
            MenuListProps: {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              'data-autoid': `update-strategies-edit-strategy-${index}-version-menu`,
            },
          },
        }}
      >
        {versions.map(version => (
          <MenuItem key={`${values.updateStrategyId}-${productName}-${version}`} value={version}>
            {version}
          </MenuItem>
        ))}
      </TextField>
    )
  }

  const renderDeleteButton = index =>
    cond([
      [
        () => values.strategies[index].productName !== ProductType.Protect,
        () => (
          <Box position="absolute" top="18px" right="-9px">
            <IconButton onClick={onDeleteProduct(index)}>
              <BasicDelete />
            </IconButton>
          </Box>
        ),
      ],
    ])(undefined)

  return (
    <>
      {values.strategies.map((strategy, index) => (
        <Box
          key={`${values.updateStrategyId}-${strategy.productName}-strategy`}
          position="relative"
          width="100%"
          data-autoid="update-strategies-edit-product-strategy"
        >
          <Box mr={10}>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                {renderProductSelect(index)}
              </Grid>
              <Grid item xs={4}>
                {renderStrategySelect(index)}
              </Grid>
              <Grid item xs={4}>
                {renderVersionSelect(index)}
              </Grid>
            </Grid>
          </Box>
          {renderDeleteButton(index)}
        </Box>
      ))}
    </>
  )
}

export default EditableProductStrategies
