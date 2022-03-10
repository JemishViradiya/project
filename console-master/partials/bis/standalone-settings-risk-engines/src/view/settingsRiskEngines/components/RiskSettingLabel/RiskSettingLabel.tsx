import cn from 'classnames'
import React, { memo } from 'react'

import { makeStyles } from '@material-ui/core'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'

import { RiskIcon } from '@ues-bis/standalone-shared'
import { StandaloneRiskLevelColor } from '@ues-data/bis/model'

const useStyles = makeStyles(theme => ({
  riskSettingLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 20px',
    borderBottom: `1px solid ${theme.palette.divider}`,
    borderRight: `1px solid ${theme.palette.divider}`,
    borderLeft: '3px solid transparent',
    '&:first-child': {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
  },
  riskSettingName: {
    display: 'flex',
    alignItems: 'center',
    width: '150px',
    paddingRight: '20px',
  },
  riskSettingIcon: {
    marginRight: '8px',
  },
}))

interface RiskSettingLabel {
  level: string
  riskText: string
  customClass?: string
}

const RiskSettingLabel: React.FC<RiskSettingLabel> = memo(({ children, level, riskText, customClass }) => {
  const styles = useStyles()
  return (
    <ListItem
      data-testid="settings.riskengines.riskSettingsLabel"
      className={cn(styles.riskSettingLabel, customClass)}
      style={{ borderLeftColor: StandaloneRiskLevelColor[level] }}
    >
      <div className={styles.riskSettingName}>
        <RiskIcon size="title" level={level} className={styles.riskSettingIcon} />
        <Typography variant="body2">{riskText}</Typography>
      </div>

      <Typography variant="body2" component="div">
        {children}
      </Typography>
    </ListItem>
  )
})

RiskSettingLabel.displayName = 'RiskSettingLabel'

export default RiskSettingLabel
