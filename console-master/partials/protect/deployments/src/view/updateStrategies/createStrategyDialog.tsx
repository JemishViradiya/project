import cloneDeep from 'lodash/cloneDeep'
import find from 'lodash/find'
import React, { useState } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  Link,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'

import type { ProductType, ProductVersionsItem, StrategyItem } from '@ues-data/epp'
import { queryProductVersions, selectProductVersions, StrategyTypes } from '@ues-data/epp'
import { useStatefulReduxQuery } from '@ues-data/shared'
import { Times as TimesIcon } from '@ues/assets'

import { PRODUCTS } from '../constants'

const PLACEHOLDER = ''
const INITIAL_PRODUCT_STRATEGY: StrategyItem[] = [
  {
    productName: 'Protect',
    strategyType: '',
    version: '',
  },
]

const translateLabel = (array, translate) =>
  array.map(item => {
    return { ...item, label: translate(item.label) }
  })

const getVersionsForProduct = (productVersions: ProductVersionsItem[] = [], productName: string) => {
  const product = find(productVersions, ['product', productName])
  return (product && product.versions) || []
}

const CreateStrategyDialog = props => {
  const { isDialogOpen, onDialogClose, onDialogSubmit } = props
  const { t: translate } = useTranslation(['deployments', 'general/form'])

  const { refetch: refetchQueryProductVersions } = useStatefulReduxQuery(queryProductVersions, { skip: true })

  const { result: productVersions } = useSelector(selectProductVersions)

  const products = translateLabel(PRODUCTS, translate)

  const [productStrategies, setProductStrategies] = useState(cloneDeep(INITIAL_PRODUCT_STRATEGY))

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [showErrors, setShowErrors] = useState(false)

  const onChangeName = event => {
    setName(event.target.value || '')
  }

  const onChangeDescription = event => {
    setDescription(event.target.value || '')
  }

  const onClose = () => {
    onDialogClose()

    // reset state
    setName('')
    setDescription('')
    setProductStrategies(cloneDeep(INITIAL_PRODUCT_STRATEGY))
    setShowErrors(false)
  }

  const onClickAddAnotherProduct = () => {
    setProductStrategies(previousProductStrategies => [...previousProductStrategies, { ...INITIAL_PRODUCT_STRATEGY[0] }])
  }

  const onChangeProductStrategy = event => {
    const newProductStrategies = [...productStrategies]
    const dataset = event.currentTarget.dataset

    newProductStrategies[dataset.id][dataset.name] = event.target.value
    setProductStrategies(newProductStrategies)

    // reset the version value of strategy is not 'fixed'
    // or if product changed
    if (
      (newProductStrategies[dataset.id].strategyType !== StrategyTypes.FIXED && dataset.name === 'strategyType') ||
      dataset.name === 'productName'
    ) {
      newProductStrategies[dataset.id].version = ''
    }

    // only fetch versions if product is selected and strategy is set to 'fixed'
    if (newProductStrategies[dataset.id].productName && newProductStrategies[dataset.id].strategyType === StrategyTypes.FIXED) {
      refetchQueryProductVersions({ productName: newProductStrategies[dataset.id].productName as ProductType })
    }
  }

  const onClickDeleteProductStrategy = event => {
    const newProductStrategies = [...productStrategies]
    newProductStrategies.splice(event.currentTarget.dataset.id, 1)
    setProductStrategies(newProductStrategies)
  }

  const onClickAddStrategy = () => {
    setShowErrors(true)
    let valid = true

    if (name === PLACEHOLDER) {
      valid = false
    }

    productStrategies.forEach(strategy => {
      if (
        strategy.productName === PLACEHOLDER ||
        strategy.strategyType === PLACEHOLDER ||
        (strategy.strategyType === 'Fixed' && strategy.version === PLACEHOLDER)
      ) {
        valid = false
      }
    })

    if (valid) {
      onDialogSubmit(name, productStrategies, description)
      onClose()
    }
  }

  const isError = fieldName => {
    if (!showErrors) return null

    return fieldName === PLACEHOLDER
  }

  const errorMessageRenderer = fieldName => {
    return isError(fieldName) ? translate('general/form:validationErrors.required') : ''
  }

  return (
    <Dialog open={isDialogOpen} fullWidth maxWidth="md" data-autoid="update-strategies-add-dialog">
      <DialogTitle disableTypography>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h2">{translate('AddUpdateStrategy')}</Typography>
          <IconButton aria-label="close" onClick={onClose} data-autoid="create-update-strategy--close-x">
            <TimesIcon />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Grid container direction="column" justifyContent="space-between" spacing={6}>
          {productStrategies.map((item, index) => (
            <Grid
              key={`createstrategy-productstrategy-${index}`}
              data-autoid={`create-update-strategy--productrow-${index}`}
              item
              container
              xs={12}
            >
              {index === 0 ? (
                <Grid item xs={3} container direction="column" justifyContent="space-around">
                  <Typography variant="subtitle2">{translate('Product')}</Typography>
                  <Typography variant="body2">CylancePROTECT</Typography>
                </Grid>
              ) : (
                <Grid item xs={3} container direction="column" justifyContent="space-around">
                  <FormControl fullWidth>
                    <TextField
                      key={`row-${index}-product`}
                      select
                      label={translate('Product')}
                      value={item.productName}
                      onChange={onChangeProductStrategy}
                      data-autoid={`create-update-strategy--productrow-${index}-select-product`}
                      error={isError(item.productName)}
                      helperText={errorMessageRenderer(item.productName)}
                    >
                      {products.map((product, productIndex) => (
                        <MenuItem
                          key={`row-${index}-product-${productIndex}`}
                          data-name="productName"
                          data-id={index}
                          value={product.value}
                          data-autoid={`create-update-strategy--product-${product.value}`}
                        >
                          {product.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={1}></Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <TextField
                    select
                    label={translate('Strategy')}
                    value={item.strategyType}
                    onChange={onChangeProductStrategy}
                    data-autoid={`create-update-strategy--productrow-${index}-select-strategy`}
                    error={isError(item.strategyType)}
                    helperText={errorMessageRenderer(item.strategyType)}
                  >
                    {Object.values(StrategyTypes).map((strategy, strategyIndex) => (
                      <MenuItem
                        key={`row-${index}-strategy-${strategyIndex}`}
                        data-name="strategyType"
                        data-id={index}
                        value={strategy}
                        data-autoid={`create-update-strategy--strategy-${strategy}`}
                      >
                        {translate(strategy)}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <TextField
                    disabled={
                      productStrategies[index]['productName'] !== '' &&
                      productStrategies[index]['strategyType'] === StrategyTypes.FIXED
                        ? false
                        : true
                    }
                    select
                    label={translate('Version')}
                    value={item.version}
                    onChange={onChangeProductStrategy}
                    data-autoid={`create-update-strategy--productrow-${index}-select-version`}
                    error={productStrategies[index]['strategyType'] === StrategyTypes.FIXED && isError(item.version)}
                    helperText={
                      productStrategies[index]['strategyType'] === StrategyTypes.FIXED && errorMessageRenderer(item.version)
                    }
                  >
                    {getVersionsForProduct(productVersions, item.productName).map((version, versionIndex) => (
                      <MenuItem
                        key={`row-${index}-version-${versionIndex}`}
                        data-name="version"
                        data-id={index}
                        value={version}
                        data-autoid={`create-update-strategy--version-index-${versionIndex}`}
                      >
                        {version}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={1}>
                {index !== 0 && (
                  <IconButton
                    aria-label="create-strategy-delete"
                    data-id={index}
                    onClick={onClickDeleteProductStrategy}
                    data-autoid={`create-update-strategy--productrow-${index}-delete`}
                  >
                    <DeleteOutlinedIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
          <Grid item>
            <Link onClick={onClickAddAnotherProduct} data-autoid="create-update-strategy--add-product">
              + {translate('AddAnotherProduct')}
            </Link>
          </Grid>
          <Grid item container justifyContent="space-between" spacing={6} direction="row" xs={12}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  label={translate('StrategyName')}
                  data-autoid="create-update-strategy--name"
                  value={name}
                  onChange={onChangeName}
                  error={isError(name)}
                  helperText={errorMessageRenderer(name)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  label={translate('DescriptionOptional')}
                  data-autoid="create-update-strategy--description"
                  value={description}
                  onChange={onChangeDescription}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="outlined" data-autoid="create-update-strategy--cancel" onClick={onClose}>
          {translate('general/form:commonLabels.cancel')}
        </Button>
        <Button onClick={onClickAddStrategy} color="primary" variant="contained" data-autoid="create-update-strategy--submit">
          {translate('AddStrategy')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export { CreateStrategyDialog }
export default withTranslation()(CreateStrategyDialog)
