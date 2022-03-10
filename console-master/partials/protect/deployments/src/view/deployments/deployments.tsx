import React from 'react'

import Paper from '@material-ui/core/Paper'

import { useFeatures, usePermissions } from '@ues-data/shared'
import { FeatureName, VenueRBACs, VenueRoles } from '@ues-data/shared-types'

import { InstallerPackageDownload } from '../installerPackageDownload'
import { UpdateRules } from '../updateRules'
import { UpdateStrategies } from '../updateStrategies'
import useStyles from './styles'

const Deployments: React.FC = () => {
  const { paperContainer } = useStyles()
  const classes = useStyles()
  const { hasVenuePermission, hasVenueAnyRole } = usePermissions()
  const features = useFeatures()
  const updateStrategiesEnabled = features.isEnabled(FeatureName.DeploymentsUpdateStrategiesEnabled)
  const updateRulesEnabled = features.isEnabled(FeatureName.DeploymentsUpdateRulesEnabled)
  const hasValidRole = hasVenueAnyRole(VenueRoles.ROLE_USER, VenueRoles.ROLE_ADMINISTRATOR, VenueRoles.ROLE_ZONE_MANAGER)
  const hasInstallerDownloadPermission = hasVenuePermission(VenueRBACs.RBAC_INSTALLER_DOWNLOAD)
  const canViewInstallerDownloadUI = hasValidRole || hasInstallerDownloadPermission

  return (
    <Paper variant="outlined" className={paperContainer}>
      <div className={classes.dynamicCardContainer}>
        {canViewInstallerDownloadUI && <InstallerPackageDownload />}
        {updateStrategiesEnabled && <UpdateStrategies data-autoid="update-strategies-component" />}
        {updateRulesEnabled && <UpdateRules data-autoid="update-rules-component" />}
      </div>
    </Paper>
  )
}

export default Deployments
