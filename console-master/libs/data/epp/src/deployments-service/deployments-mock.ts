import type DeploymentsInterface from './deployments-interface'
import {
  BuildVersionsMock,
  DownloadUrlMock,
  mockCreateUpdateStrategy,
  OpticsVersionsMock,
  OsFamiliesMock,
  PackagesMock,
  PersonaVersionsMock,
  ProductsMock,
  ProtectVersionsMock,
  StrategiesMock,
  UpdateRulesMock,
} from './deployments-mock.data'
import { ProductType } from './deployments-types'

class DeploymentsMockClass implements DeploymentsInterface {
  fetchProducts() {
    return Promise.resolve({ data: ProductsMock })
  }
  fetchOsFamilies(params) {
    return Promise.resolve({
      data: OsFamiliesMock,
    })
  }
  fetchBuildVersions({ productName, osFamily }) {
    return Promise.resolve({ data: BuildVersionsMock })
  }
  fetchPackages(params) {
    return Promise.resolve({ data: PackagesMock })
  }
  fetchDownloadUrl(params) {
    return Promise.resolve({ data: DownloadUrlMock })
  }
  fetchProductVersions({ productName }) {
    switch (productName) {
      case ProductType.Optics:
        return Promise.resolve({ data: OpticsVersionsMock })
      case ProductType.Persona:
        return Promise.resolve({ data: PersonaVersionsMock })
      case ProductType.Protect:
      default:
        return Promise.resolve({ data: ProtectVersionsMock })
    }
  }
  fetchStrategies() {
    return Promise.resolve({ data: StrategiesMock })
  }
  fetchUpdateRules() {
    return Promise.resolve({ data: UpdateRulesMock })
  }
  createStrategy(params) {
    const data = mockCreateUpdateStrategy(params)
    return Promise.resolve({ data })
  }
  updateStrategy(params) {
    const data = mockCreateUpdateStrategy(params)
    return Promise.resolve({ data })
  }
  fetchHybridInstallerScript() {
    return Promise.resolve({ data: 'hybrid-installer-script' })
  }
  fetchHybridLicenseKey() {
    return Promise.resolve({ data: 'hybrid-license-key' })
  }
}

const DeploymentsMockApi = new DeploymentsMockClass()

export { DeploymentsMockApi }
