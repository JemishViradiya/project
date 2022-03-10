import { ProductType } from '@ues-data/epp'

export const GET_BUILD_VERSIONS = '[DEPLOYMENTS] GET_BUILD_VERSIONS'
export const GET_HYBRID_INSTALLER_SCRIPT_AND_KEY = '[DEPLOYMENTS] GET_HYBRID_INSTALLER_SCRIPT_AND_KEY'
export const GET_OS_FAMILIES = '[DEPLOYMENTS] GET_OS_FAMILIES'
export const GET_PACKAGES = '[DEPLOYMENTS] GET_PACKAGES'
export const GET_PRESIGNED_URL = '[DEPLOYMENTS] GET_PRESIGNED_URL'
export const GET_PRODUCTS = '[DEPLOYMENTS] GET_PRODUCTS'

export const PRODUCTS = [
  {
    value: ProductType.Protect,
    label: 'ProtectTitle',
  },
  {
    value: ProductType.Optics,
    label: 'OpticsTitle',
  },
  {
    value: ProductType.Persona,
    label: 'PersonaTitle',
  },
]
