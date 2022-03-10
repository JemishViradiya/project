import { axiosInstance, deploymentsBaseUrl } from '../config.rest'
import type DeploymentInterface from './deployments-interface'

class DeploymentsClass implements DeploymentInterface {
  fetchProducts() {
    return axiosInstance().get(`${deploymentsBaseUrl}/installers/products`)
  }
  fetchOsFamilies({ productName }) {
    return axiosInstance().get(`${deploymentsBaseUrl}/installers/products/${productName}/osFamily`)
  }
  fetchBuildVersions({ productName, osFamily }) {
    return axiosInstance().get(`${deploymentsBaseUrl}/installers/products/${productName}/osFamily/${osFamily}/versions`)
  }
  fetchPackages(params) {
    return params.productName && params.version
      ? axiosInstance().get(`${deploymentsBaseUrl}/installers/packages`, { params })
      : axiosInstance().get(`${deploymentsBaseUrl}/installers/osFamily/${params.osFamily}/packages`)
  }
  fetchDownloadUrl({ presignedUrl }) {
    const { productName, buildVersion, osFamily, installer, targetArchitecture } = presignedUrl

    // avoids issues with values such as
    // "CylancePROTECT 2.1.1570 + CylanceOPTICS 2.5.2000" (+ sign)
    const encodedBuildVersion = encodeURIComponent(buildVersion)
    const encodedProductName = encodeURIComponent(productName)

    return axiosInstance().get(
      `${deploymentsBaseUrl}/installers/downloadUrl?product=${encodedProductName}&os=${osFamily}&version=${encodedBuildVersion}&package=${installer}&architecture=${targetArchitecture}`,
    )
  }
  fetchProductVersions({ productName }) {
    return axiosInstance().get(`${deploymentsBaseUrl}/installers/products/${productName}/versions`)
  }
  fetchStrategies() {
    return axiosInstance().get(`${deploymentsBaseUrl}/updateStrategies`)
  }
  fetchUpdateRules() {
    return axiosInstance().get(`${deploymentsBaseUrl}/updateRules`)
  }
  createStrategy({ name, description, strategies }) {
    return axiosInstance().post(`${deploymentsBaseUrl}/updateStrategies`, {
      name,
      description,
      strategies,
    })
  }
  updateStrategy({ strategy }) {
    return axiosInstance().put(`${deploymentsBaseUrl}/updateStrategies/${strategy.updateStrategyId}`, strategy)
  }
  fetchHybridInstallerScript() {
    return axiosInstance().get(`${deploymentsBaseUrl}/installers/script/hybrid`)
  }
  fetchHybridLicenseKey() {
    return axiosInstance().get(`${deploymentsBaseUrl}/installers/license/hybrid`)
  }
}

const DeploymentsApi = new DeploymentsClass()

export { DeploymentsApi }
