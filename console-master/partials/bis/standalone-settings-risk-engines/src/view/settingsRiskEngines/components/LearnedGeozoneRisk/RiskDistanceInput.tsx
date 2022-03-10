import React, { memo, useCallback, useMemo } from 'react'
import type { Validate } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ErrorMessage } from '@hookform/error-message'

import { FormControl, FormHelperText, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core'

import { Select } from '@ues-bis/shared'

import UnitTypes from '../../static/UnitTypes'

const FIELD_REQUIRED = 'common.errorFieldRequired'

const useStyles = makeStyles(theme => ({
  inputLabel: {
    composes: theme.typography.h6,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    padding: 0,
    color: theme.palette.text.primary,
    position: 'relative',
  },
  select: {
    margin: '4px 4px',
    minWidth: '8ch',
    width: '22px',
    height: '33px',
    fontWeight: 'normal',
  },
  noBottomMargin: {
    marginBottom: 0,
  },
  distanceInputContainer: {
    margin: '4px 0',
    height: '33px',
    width: '88px',
  },
}))

interface RiskDistanceInputProps {
  valueFieldName: string
  unitFieldName: string
  handleChange: (e: any) => void
  handlePaste: (e: any) => void
  disabled: boolean
  isWithinRange: Validate
}

const RiskDistanceInput: React.FC<RiskDistanceInputProps> = memo(
  ({ valueFieldName, unitFieldName, handleChange, handlePaste, disabled, isWithinRange }) => {
    const { t }: { t: any } = useTranslation()
    const styles = useStyles()
    const { control, register } = useFormContext()
    const options = useMemo(
      () =>
        Object.values(UnitTypes).map(unit => (
          <MenuItem key={unit} value={unit}>
            {t(`common.unit.${unit}`)}
          </MenuItem>
        )),
      [t],
    )

    const renderUnitSelect = useCallback(
      ({ value, onChange }) => (
        <Select
          disabled={disabled}
          className={styles.select}
          wrapperClassName={styles.noBottomMargin}
          inputProps={{ 'data-testid': unitFieldName }}
          onChange={onChange}
          value={value}
          size="small"
        >
          {options}
        </Select>
      ),
      [disabled, options, styles.noBottomMargin, styles.select, unitFieldName],
    )

    return (
      <label className={styles.inputLabel}>
        <Typography variant="caption">{t('settings.riskEngines.learnedGeozoneDistance')}</Typography>
        <div>
          <FormControl className={styles.noBottomMargin}>
            <TextField
              type="number"
              className={styles.noBottomMargin}
              name={valueFieldName}
              disabled={disabled}
              size="small"
              inputProps={{
                min: 1,
                step: 1,
                ref: register({
                  required: t(FIELD_REQUIRED),
                  validate: isWithinRange,
                }),
                'data-testid': valueFieldName,
                onKeyDown: handleChange,
                onPaste: handlePaste,
              }}
              InputProps={{
                className: styles.distanceInputContainer,
              }}
            />
          </FormControl>
          <FormControl className={styles.noBottomMargin}>
            <Controller render={renderUnitSelect} name={unitFieldName} control={control} />
          </FormControl>
          <ErrorMessage name={valueFieldName} as={<FormHelperText margin="dense" error />}>
            {({ message }) => t(message)}
          </ErrorMessage>
        </div>
      </label>
    )
  },
)

export default RiskDistanceInput
