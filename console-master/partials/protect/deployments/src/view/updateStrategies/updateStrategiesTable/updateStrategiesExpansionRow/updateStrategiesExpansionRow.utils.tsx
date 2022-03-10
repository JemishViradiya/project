// dependencies
import React from 'react'

// components
import Box from '@material-ui/core/Box'

import type { StrategiesListItem } from '@ues-data/epp'
import { ProductType } from '@ues-data/epp'
// utils
import { CylanceGuard, CylanceOptics, CylancePersona, CylanceProtect } from '@ues/assets'

// constants
const PRODUCT_ICONS = {
  [ProductType.Optics]: CylanceOptics,
  [ProductType.Protect]: CylanceProtect,
  [ProductType.Persona]: CylancePersona,
  [ProductType.Guard]: CylanceGuard,
}

const renderProductIcon = (productName: ProductType) => {
  const Icon = PRODUCT_ICONS[productName || ProductType.Optics]
  return <Icon color="action" />
}

const renderProducts = (updateStrategy: StrategiesListItem) =>
  updateStrategy.strategies.map((strategy, index) => (
    <Box key={`${updateStrategy.updateStrategyId}-${strategy.productName}-product-name`} ml={index > 0 ? 2 : 0} component="span">
      {renderProductIcon(strategy.productName as ProductType)}
    </Box>
  ))

export { renderProductIcon, renderProducts }
