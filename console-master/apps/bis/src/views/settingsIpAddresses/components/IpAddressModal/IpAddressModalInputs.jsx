import PropTypes from 'prop-types'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { MenuItem, TextField } from '@material-ui/core/'

import { Select } from '@ues-bis/shared'

import styles from './IpAdressesModal.module.less'
import { checkWhetherIsWithinRange } from './utils'

const AREA_PLACEHOLDER = `
192.168.1.1
192.168.1.0/24
192.168.1.1-100`
const FIELD_REQUIRED = 'common.errorFieldRequired'
const INVALID_NAME = 'common.errorInvalidName'
const MAX_INPUT_CHARS = 250
const NON_WHITESPACE_CHAR_REQUIRED_REGEX = /.*\S.*/
const AREA_INPUT_STARTING_LINES = 5
const AREA_INPUT_MAX_LINES = 15

const IpAddressModalInputs = memo(({ register, canEdit, errors = {} }) => {
  const { t } = useTranslation()

  const errorHelperTexts = useMemo(
    () => ({
      name: 'name' in errors && errors.name.message,
      ipAddressesSource: 'ipAddressesSource' in errors && errors.ipAddressesSource.message,
      ipAddresses: 'ipAddresses' in errors && errors.ipAddresses.message,
    }),
    [errors],
  )

  const nameValidation = {
    required: t(FIELD_REQUIRED),
    pattern: {
      value: NON_WHITESPACE_CHAR_REQUIRED_REGEX,
      message: t(INVALID_NAME),
    },
    maxLength: {
      value: MAX_INPUT_CHARS,
      message: t(INVALID_NAME),
    },
  }

  const ipAddressessesValidation = {
    required: t(FIELD_REQUIRED),
    validate: checkWhetherIsWithinRange(t),
  }

  return (
    <div className={styles.modalInputContainer}>
      <TextField
        className={styles.input}
        name="name"
        disabled={!canEdit}
        type="text"
        inputProps={{
          ref: register(nameValidation),
          'data-testid': 'ipAddresses-name-input',
        }}
        size="small"
        required
        label={t('common.name')}
        error={!!errorHelperTexts.name}
        helperText={errorHelperTexts.name}
        data-testid="ip-address-modal-name-field"
      />
      <Select
        className={styles.input}
        disabled
        defaultValue="default"
        inputProps={{
          id: 'ipAddresses-source-select',
          name: 'ipAddressesSource',
          'data-testid': 'ip-address-modal-ip-addresses-source-field',
        }}
        size="small"
        required
        label={t('settings.ipAddress.sourceLabel')}
        labelId="ip-address-modal-ip-addresses-source-field-label"
        error={!!errorHelperTexts.ipAddressesSource}
        helperText={errorHelperTexts.ipAddressesSource}
      >
        <MenuItem value="default">{t('settings.ipAddress.specifiedAddresses')}</MenuItem>
      </Select>
      <div className={styles.textareaWrapper}>
        <TextField
          name="ipAddresses"
          disabled={!canEdit}
          multiline
          inputRef={register(ipAddressessesValidation)}
          className={styles.outerTextField}
          rowsMin={AREA_INPUT_STARTING_LINES}
          rowsMax={AREA_INPUT_MAX_LINES}
          label={t('settings.ipAddress.ipAddressesLabel')}
          inputProps={{
            id: 'ipAddresses-list-area',
            'data-testid': 'ipAddresses-list-area',
            className: styles.textarea,
          }}
          InputProps={{
            className: styles.innerTextField,
          }}
          placeholder={t('settings.ipAddress.inputAddressesPlaceholder', { example: AREA_PLACEHOLDER })}
          margin="none"
          required
          error={!!errorHelperTexts.ipAddresses}
          helperText={errorHelperTexts.ipAddresses}
          data-testid="ip-address-modal-ip-addresses-field"
        />
      </div>
    </div>
  )
})

IpAddressModalInputs.displayName = 'IpAddressModal'

IpAddressModalInputs.propTypes = {
  register: PropTypes.func,
  canEdit: PropTypes.bool,
}

export default IpAddressModalInputs
