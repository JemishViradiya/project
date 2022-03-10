// dependencies
import cond from 'lodash/cond'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// components
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  Link,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import LinearProgress from '@material-ui/core/LinearProgress'

import type { Package } from '@ues-data/epp'
import {
  ProductType,
  queryBuildVersions,
  queryHybrid,
  queryOsFamilies,
  queryPackages,
  queryPresignedUrl,
  queryProducts,
  selectBuildVersions,
  selectHybrid,
  selectOsFamilies,
  selectPackages,
  selectPresignedUrl,
  selectProducts,
} from '@ues-data/epp'
import { useStatefulReduxQuery } from '@ues-data/shared'
import { Apple as AppleIcon, Download as DownloadIcon, Linux as LinuxIcon, Windows as WindowsIcon } from '@ues/assets'
import { useSnackbar } from '@ues/behaviours'

// constants
const PLACEHOLDER = ''

const transformPackageText = (text: string, arch: string): Package => {
  const parts = text.split('|')

  return {
    architecture: parts.length === 1 ? arch : parts[0],
    format: parts.length === 2 ? parts[1] : parts[0],
  }
}

export const ButtonProgress = ({
  t: translate,
  downloadUrl,
  dispatchGetPresignedUrlAction,
  isRequestPending,
  isEmpty,
  setIsEmpty,
}) => {
  const buttonRef = useRef(null)
  const [width, setWidth] = useState(0)

  const handleClick = () => {
    setIsEmpty(isEmpty)
    if (!isEmpty) dispatchGetPresignedUrlAction()
  }

  const LoadingButton = () => (
    <Button
      disabled
      color="primary"
      variant="outlined"
      data-autoid="deployments-download-installer-loading"
      style={{ width: `${width}px` }}
    >
      <CircularProgress color="primary" size={20} />
    </Button>
  )

  const LinkButton = () => (
    <Link href={downloadUrl}>
      <Button
        ref={buttonRef}
        color="primary"
        variant="contained"
        data-autoid="deployments-download-installer"
        startIcon={<DownloadIcon />}
        disabled={isRequestPending}
        onClick={handleClick}
      >
        {translate('general/form:commonLabels.download')}
      </Button>
    </Link>
  )

  const RegularButton = () => (
    <Button
      ref={buttonRef}
      color="primary"
      variant="contained"
      data-autoid="deployments-download-installer"
      startIcon={<DownloadIcon />}
      disabled={isRequestPending}
      onClick={handleClick}
    >
      {translate('general/form:commonLabels.download')}
    </Button>
  )

  if (buttonRef && buttonRef.current && buttonRef.current.getBoundingClientRect().width !== width) {
    setWidth(buttonRef.current.getBoundingClientRect().width)
  }

  if (isRequestPending) return <LoadingButton />
  if (downloadUrl.length) return <LinkButton />
  return <RegularButton />
}

const InstallerPackageDownload = () => {
  // hooks
  const { t: translate } = useTranslation(['deployments', 'general/form'])
  const dispatch = useDispatch()
  const { enqueueMessage } = useSnackbar()
  const { result: productsResult } = useSelector(selectProducts)
  const products = productsResult || []
  const { result: osFamiliesResult } = useSelector(selectOsFamilies)
  const osFamilies = osFamiliesResult || []
  const { result: buildVersionsResult } = useSelector(selectBuildVersions)
  const buildVersions = buildVersionsResult || []
  const { result: packagesResult } = useSelector(selectPackages)
  const packages = packagesResult || []
  const { error: errorPresignedUrl, loading: loadingPresignedUrl, result: presignedUrl } = useSelector(selectPresignedUrl)
  const { error: errorHybrid, loading: loadingHybrid, result: hybrid } = useSelector(selectHybrid)
  const hybridInstallerScript = hybrid?.installerScript
  const hybridLicenseKey = hybrid?.licenseKey

  // state
  const [product, setProduct] = useState<ProductType | typeof PLACEHOLDER>(PLACEHOLDER)
  const [osFamily, setOsFamily] = useState<string | typeof PLACEHOLDER>(PLACEHOLDER)
  const [version, setVersion] = useState(PLACEHOLDER)
  const [selectedPackage, setPackage] = useState(PLACEHOLDER)
  const [downloadUrl, setDownloadUrl] = useState(PLACEHOLDER)
  const [isEmpty, setIsEmpty] = useState(false)

  // dispatches
  const { refetch: refetchOsFamilies } = useStatefulReduxQuery(queryOsFamilies, { skip: true })
  const { refetch: refetchHybrid } = useStatefulReduxQuery(queryHybrid, { skip: true })
  const { refetch: refetchBuildVersions } = useStatefulReduxQuery(queryBuildVersions, { skip: true })
  const { refetch: refetchPresignedUrl } = useStatefulReduxQuery(queryPresignedUrl, { skip: true })
  useStatefulReduxQuery(queryProducts)
  useStatefulReduxQuery(queryPackages, {
    variables: {
      osFamily,
      productName: product,
      version,
    },
    skip: version === PLACEHOLDER,
  })

  const dispatchGetPresignedUrlAction = () => {
    if (product && osFamily && selectedPackage !== PLACEHOLDER) {
      const { architecture, format } = transformPackageText(selectedPackage, 'X64')
      refetchPresignedUrl({
        presignedUrl: {
          buildVersion: version,
          installer: format,
          osFamily,
          targetArchitecture: architecture,
          productName: product,
        },
      })
    }
  }

  const checkDownloadUrl = cond([
    [() => selectedPackage !== PLACEHOLDER, () => setIsEmpty(false)],
    [() => selectedPackage === PLACEHOLDER, () => setIsEmpty(true)],
  ])

  const isRequestFailure = Boolean(errorPresignedUrl)
  const isRequestPending = loadingPresignedUrl

  const retrievingHybrid = loadingHybrid
  const retrievingHybridFailure = Boolean(errorHybrid)

  // effects

  useEffect(
    // get OS families when product changes
    () => {
      if (product !== PLACEHOLDER) refetchOsFamilies({ productName: product })
      if (product === ProductType.Hybrid) refetchHybrid()
    },
    [refetchHybrid, refetchOsFamilies, product, dispatch],
  )

  useEffect(
    // get build versions when OS family changes
    () => {
      if (product && osFamily !== PLACEHOLDER) refetchBuildVersions({ productName: product, osFamily })
    },
    [product, osFamily, refetchBuildVersions],
  )

  useEffect(dispatchGetPresignedUrlAction, [product, osFamily, version, selectedPackage, refetchPresignedUrl])

  useEffect(() => {
    if (presignedUrl && presignedUrl !== PLACEHOLDER) setDownloadUrl(presignedUrl)
  }, [presignedUrl, selectedPackage])

  useEffect(() => {
    if (isRequestFailure) {
      enqueueMessage(translate('InstallerPackageNotFound'), 'error')
    }
  }, [dispatch, enqueueMessage, translate, isRequestFailure])

  useEffect(() => {
    if (retrievingHybridFailure) {
      enqueueMessage(translate('CouldNotRetrieveHybridInstallationScript'), 'error')
    }
  }, [dispatch, enqueueMessage, translate, retrievingHybridFailure])

  // actions

  const onChangeProduct = event => {
    setProduct(event.target.value)
    setOsFamily(PLACEHOLDER)
    setVersion(PLACEHOLDER)
    setPackage(PLACEHOLDER)
    setDownloadUrl(PLACEHOLDER)
  }

  const onChangeOsFamily = event => {
    setOsFamily(event.target.value)
    setVersion(PLACEHOLDER)
    setPackage(PLACEHOLDER)
    setDownloadUrl(PLACEHOLDER)
  }

  const onChangeBuildVersion = event => {
    setVersion(event.target.value)
    setPackage(PLACEHOLDER)
    setDownloadUrl(PLACEHOLDER)
  }

  const onChangeFormat = event => {
    setPackage(event.target.value)
  }

  const hybridInstallerScriptName = 'hybrid-online-install.txt'
  const hybridLicenseKeyName = 'license.yaml'

  const downloadHybridInstallerScript = useCallback(() => {
    const anchorElement = document.createElement('a')
    const blob = new Blob([hybridInstallerScript], { type: 'text/plain' })
    const blobUrl = URL.createObjectURL(blob)

    anchorElement.href = blobUrl
    anchorElement.download = hybridInstallerScriptName
    anchorElement.style.display = 'none'
    anchorElement.setAttribute('id', 'hybrid-script-download')
    document.body.appendChild(anchorElement)
    anchorElement.click()
    document.body.removeChild(anchorElement)
  }, [hybridInstallerScript])

  const downloadHybridLicenseKey = useCallback(() => {
    const anchorElement = document.createElement('a')
    const blob = new Blob([hybridLicenseKey], { type: 'text/plain' })
    const blobUrl = URL.createObjectURL(blob)

    anchorElement.href = blobUrl
    anchorElement.download = hybridLicenseKeyName
    anchorElement.style.display = 'none'
    anchorElement.setAttribute('id', 'hybrid-license-key')
    document.body.appendChild(anchorElement)
    anchorElement.click()
    document.body.removeChild(anchorElement)
  }, [hybridLicenseKey])

  const formatBlobSize = size => {
    return size >= 1024 ? Math.round(size / 1024) + 'KB' : size + 'B'
  }

  // render

  const renderProductItems = products =>
    products.map(product => (
      <MenuItem key={product.value} value={product.value} data-autoid={`deployments-product-select-${product.value}`}>
        {product.name}
      </MenuItem>
    ))

  const renderOsFamilyItems = osFamilies => {
    const setOrder = osType => {
      switch (osType) {
        case 'windows':
          return 1
        case 'mac':
          return 0
        default:
          return -1
      }
    }

    const osFamilyObjects = osFamilies.map(os => {
      const osName = os.name
      const osValue = os.value

      let osType
      let osIcon

      if (osName.toLowerCase().includes('windows')) {
        osType = 'windows'
        osIcon = <WindowsIcon style={{ fontSize: 15 }} />
      } else if (osName.toLowerCase().includes('mac')) {
        osType = 'mac'
        osIcon = <AppleIcon style={{ fontSize: 15 }} />
      } else {
        osType = 'linux'
        osIcon = <LinuxIcon style={{ fontSize: 15 }} />
      }

      return {
        osType,
        osIcon,
        osValue,
        osName,
      }
    })

    const sortedOsFamilies = osFamilyObjects.sort((os1, os2) => {
      const osOrder1 = setOrder(os1.osType)
      const osOrder2 = setOrder(os2.osType)

      let comparison = 0
      if (osOrder1 > osOrder2) {
        comparison = -1
      } else if (osOrder1 < osOrder2) {
        comparison = 1
      }

      return comparison
    })

    return sortedOsFamilies.map(os => {
      const { osName, osValue, osType, osIcon } = os

      return (
        <MenuItem key={osValue} value={osValue} data-autoid={`deployments-os-select-${osType}`}>
          {osIcon} {osName}
        </MenuItem>
      )
    })
  }

  const renderBuildVersionItems = buildVersions =>
    buildVersions.map(buildVersion => (
      <MenuItem key={buildVersion} value={buildVersion} data-autoid={`deployments-buildVersion-select-${buildVersion}`}>
        {buildVersion}
      </MenuItem>
    ))

  const renderFormatItems = formats =>
    formats.map(packageFormat => {
      return (
        <MenuItem
          key={packageFormat}
          value={packageFormat}
          data-value={packageFormat}
          data-autoid={`deployments-packageFormat-select-${packageFormat}`}
        >
          {packageFormat}
        </MenuItem>
      )
    })

  const isError = fieldName => {
    return fieldName === PLACEHOLDER && isEmpty
  }

  const errorMessageRenderer = fieldName => {
    return isError(fieldName) ? translate('general/form:validationErrors.required') : ''
  }

  const cylanceHybridSelected = product === ProductType.Hybrid

  // to display script size
  const hybridInstallerScriptBlob = new Blob([hybridInstallerScript])
  const hybridLicenseKeyBlob = new Blob([hybridLicenseKey])

  // match body2 Typography variant letter-spacing with
  // subtitle2 variant
  const scriptFileLabelStyles = { letterSpacing: 0.1 }

  // flex child with implicit "auto" width has no width,
  // so set 100% width explicitly + maximum width
  const progressBarStyles = {
    maxWidth: 350,
    width: '100%',
  }

  return (
    <Paper elevation={0} data-autoid="installer-package-container">
      <Card>
        <CardContent>
          <Typography variant="h2" gutterBottom>
            {translate('Installers')}
          </Typography>
          <Grid container spacing={4} alignItems="flex-start">
            <Grid item xs={3}>
              <FormControl data-autoid="deployments-product" fullWidth>
                <TextField
                  select
                  label={translate('Product')}
                  value={product}
                  onChange={onChangeProduct}
                  error={isError(product)}
                  helperText={errorMessageRenderer(product)}
                  data-autoid="deployments-product-select"
                >
                  {renderProductItems(products)}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl data-autoid="deployments-os" fullWidth>
                <TextField
                  select
                  label={translate('OS')}
                  value={osFamily}
                  onChange={onChangeOsFamily}
                  disabled={product === PLACEHOLDER}
                  error={isError(osFamily)}
                  helperText={errorMessageRenderer(osFamily)}
                  data-autoid="deployments-os-select"
                  SelectProps={{
                    MenuProps: {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      'data-autoid': 'deployments-os-menu',
                    },
                  }}
                >
                  {cond([
                    [() => product !== PLACEHOLDER, () => renderOsFamilyItems(osFamilies)],
                    [() => true, () => []],
                  ])(undefined)}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl data-autoid="deployments-version" fullWidth>
                <TextField
                  select
                  label={translate('Version')}
                  value={version}
                  onChange={onChangeBuildVersion}
                  disabled={osFamily === PLACEHOLDER}
                  error={isError(version)}
                  helperText={errorMessageRenderer(version)}
                  data-autoid="deployments-version-select"
                >
                  {cond([
                    [() => osFamily !== PLACEHOLDER, () => renderBuildVersionItems(buildVersions)],
                    [() => true, () => []],
                  ])(undefined)}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl data-autoid="deployments-format" fullWidth>
                <TextField
                  select
                  label={translate('Format')}
                  value={selectedPackage}
                  onChange={onChangeFormat}
                  disabled={version === PLACEHOLDER}
                  error={isError(selectedPackage)}
                  helperText={errorMessageRenderer(selectedPackage)}
                  data-autoid="deployments-format-select"
                >
                  {cond([
                    [() => version !== PLACEHOLDER, () => renderFormatItems(packages)],
                    [() => true, () => []],
                  ])(undefined)}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <Grid container justifyContent="center">
                <Grid item>
                  <ButtonProgress
                    t={translate}
                    downloadUrl={downloadUrl}
                    isEmpty={selectedPackage === PLACEHOLDER}
                    setIsEmpty={setIsEmpty}
                    isRequestPending={isRequestPending}
                    dispatchGetPresignedUrlAction={checkDownloadUrl}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {cylanceHybridSelected && (
            <>
              <Box display="flex" alignItems="center">
                {retrievingHybrid && <LinearProgress color="primary" style={progressBarStyles} />}
                {!retrievingHybrid && !retrievingHybridFailure && (
                  <>
                    <Box paddingRight="6px">
                      <Typography variant="subtitle2">{translate('LicenseKeyFile')}:</Typography>
                    </Box>
                    <Box paddingRight="12px">
                      <Typography variant="body2" style={scriptFileLabelStyles}>
                        {hybridLicenseKeyName}
                      </Typography>
                    </Box>
                    <Box paddingRight="20px">
                      <Typography variant="body2" style={scriptFileLabelStyles} data-autoid="hybrid-license-key-size-text">
                        {formatBlobSize(hybridLicenseKeyBlob.size)}
                      </Typography>
                    </Box>
                    <IconButton onClick={downloadHybridLicenseKey} data-autoid="hybrid-license-key-btn">
                      <DownloadIcon />
                    </IconButton>
                    <Box paddingRight="6px" paddingLeft="18px">
                      <Typography variant="subtitle2">{translate('InstallationScriptFile')}:</Typography>
                    </Box>
                    <Box paddingRight="12px">
                      <Typography variant="body2" style={scriptFileLabelStyles}>
                        {hybridInstallerScriptName}
                      </Typography>
                    </Box>
                    <Box paddingRight="20px">
                      <Typography variant="body2" style={scriptFileLabelStyles} data-autoid="hybrid-installer-script-size-text">
                        {formatBlobSize(hybridInstallerScriptBlob.size)}
                      </Typography>
                    </Box>
                    <IconButton onClick={downloadHybridInstallerScript} data-autoid="hybrid-installer-script-btn">
                      <DownloadIcon />
                    </IconButton>
                  </>
                )}
              </Box>
              <br />
              <div>
                <Box display="block">
                  <Typography variant="caption">{translate('HybridInstallOfflineNotice')}</Typography>
                </Box>
                <Box display="block">
                  <Typography variant="caption">{translate('HybridInstallOnlineNotice')}</Typography>
                </Box>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </Paper>
  )
}

export { InstallerPackageDownload }
export default withTranslation()(InstallerPackageDownload)
