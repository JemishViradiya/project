import cond from 'lodash/cond'
import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import type { Variant } from '@material-ui/core/styles/createTypography'
import SvgIcon from '@material-ui/core/SvgIcon'
import Typography from '@material-ui/core/Typography'
import StopIcon from '@material-ui/icons/Stop'

import type { PersonaScoreType } from '@ues-data/persona'
import { theme } from '@ues/assets'

const ICON_FONT_SIZE = 16
const { palette } = theme.light

const DashLineIcon = ({ style, stroke }) => (
  <SvgIcon style={style}>
    <line x1="0" y1="12" x2="24" y2="12" stroke={stroke} strokeWidth="3" strokeDasharray="9 4" />
  </SvgIcon>
)

interface UserTrustScoreLogLegendItemPropTypes {
  messageId: string
  scoreType: PersonaScoreType
  color: string
  enabled: boolean
  dashLineIcon: boolean
  'data-autoid': string
  variant?: Variant
  onChangeModel?: (modelType: PersonaScoreType) => (event: React.MouseEvent) => void
}

const UserTrustScoreLogLegendItem = ({
  messageId: modelNameId,
  scoreType: modelType,
  color,
  enabled,
  dashLineIcon: isDashedLine = false,
  onChangeModel = null,
  variant = 'caption' as Variant,
  'data-autoid': autoid,
}: UserTrustScoreLogLegendItemPropTypes) => {
  const { t } = useTranslation(['persona/common'])

  const iconColor = enabled ? color : palette.grey[400]
  const textColor = enabled ? 'textPrimary' : 'textSecondary'

  return (
    <Box
      py={1}
      onClick={onChangeModel && onChangeModel(modelType)}
      style={onChangeModel && { cursor: 'pointer' }}
      display="flex"
      alignItems="flex-start"
      data-autoid={autoid}
    >
      <Box display="flex" pr={2}>
        {isDashedLine ? (
          <DashLineIcon style={{ fontSize: ICON_FONT_SIZE }} stroke={iconColor} />
        ) : (
          <StopIcon
            style={{
              fill: iconColor,
              stroke: iconColor,
              fontSize: ICON_FONT_SIZE,
            }}
          />
        )}
      </Box>
      <Typography variant={variant} color={textColor}>
        {t(modelNameId)}
      </Typography>
    </Box>
  )
}

export default UserTrustScoreLogLegendItem
