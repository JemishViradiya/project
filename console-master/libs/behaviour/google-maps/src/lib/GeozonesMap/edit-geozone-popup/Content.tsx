import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { Select } from '@ues/behaviours'

import { GeozoneUnit } from '../model'

interface ContentProps {
  isCircle: boolean
  name: string
  nameError: string
  onNameChange: (event: React.ChangeEvent) => void
  radius: number
  radiusError: boolean
  onRadiusChange: (event: React.ChangeEvent) => void
  onUnitChange: (event: React.ChangeEvent<{ name?: string; value: unknown }>) => void
  unit: GeozoneUnit
  shapeSize: { unit: string; value: string }
}

const useStyles = makeStyles(({ spacing }) => ({
  radiusContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  nameInput: {
    minWidth: spacing(60),
    maxWidth: spacing(60),
  },
  radiusInput: {
    minWidth: spacing(28),
    maxWidth: spacing(28),
  },
  unitSelect: {
    minWidth: `${spacing(28)}px !important`,
    maxWidth: `${spacing(28)}px !important`,
  },
}))

const Content: React.FC<ContentProps> = memo(
  ({ isCircle, name, nameError, onNameChange, radius, radiusError, onRadiusChange, unit, onUnitChange, shapeSize }) => {
    const styles = useStyles()
    const { t } = useTranslation('behaviour/geozones-map')

    return (
      <>
        <TextField
          required
          size="small"
          error={!!nameError}
          helperText={nameError}
          onChange={onNameChange}
          value={name}
          inputProps={{
            'aria-labelledby': 'geozone-name',
            'data-testid': 'geozone-popup-geozone-name-input',
          }}
          margin="none"
          label={t('popupGeozone.inputName')}
          className={styles.nameInput}
        />
        {isCircle && (
          <Box className={styles.radiusContainer}>
            <TextField
              type="number"
              onChange={onRadiusChange}
              error={radiusError}
              helperText={radiusError && t('popupGeozone.errors.invalidRadius')}
              value={radius}
              label={t('popupGeozone.inputRadius')}
              size="small"
              inputProps={{
                'data-testid': 'geozone-popup-radius-input',
              }}
              className={styles.radiusInput}
            />
            <Select
              variant="filled"
              label={t('popupGeozone.inputUnit')}
              onChange={onUnitChange}
              size="small"
              value={unit}
              inputProps={{
                'data-testid': 'geozone-popup-radius-unit-input',
              }}
              className={styles.unitSelect}
            >
              <MenuItem value={GeozoneUnit.miles}>{t('popupGeozone.units.miles')}</MenuItem>
              <MenuItem value={GeozoneUnit.km}>{t('popupGeozone.units.km')}</MenuItem>
            </Select>
          </Box>
        )}
        {shapeSize && <Typography>{t('popupGeozone.labelSize', shapeSize)}</Typography>}
      </>
    )
  },
)

export default Content
