// dependencies
import cond from 'lodash/cond'
import React from 'react'
import { useTranslation } from 'react-i18next'

// components
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Alert from '@material-ui/lab/Alert'

import { PolicyNvpName } from '@ues-data/epp'
import { StatusMedium } from '@ues/assets'

// utils
import { LEFT_INDENT, NESTED_CONTROL_TOP_PAD } from './../constants'
import { PolicyDetailsSwitch, StaticCheckboxTable } from './../shared'
import { arePropsEqual, onSwitchChange } from './../utils'
// constants
import { DATA_FIELD_ROWS } from './constants'

const SECTION_NAME = 'policy-data-privacy'

interface DataPrivacyPropTypes {
  fields: Record<string, string>
  values: Record<string, string>
  rawControlProps: unknown
  setField: (name: string, value: string) => void
}

const DataPrivacy = ({ fields, values, rawControlProps, setField }: DataPrivacyPropTypes): JSX.Element => {
  const { t: translate } = useTranslation(['protect'])

  // utils

  const getTranslatedDataFieldTableRows = () =>
    Object.keys(DATA_FIELD_ROWS).reduce(
      (translated, labelKey) => ({
        ...translated,
        [labelKey]: translate(DATA_FIELD_ROWS[labelKey]),
      }),
      {},
    )

  // render

  const renderWarning = () => (
    <Alert variant="outlined" severity="warning" icon={<StatusMedium />} data-autoid="data-privacy-section-warning">
      <Typography variant="subtitle2">{translate('cautionDataPrivacy')}</Typography>
      <Box mt={4}>
        <Typography variant="body2">{translate('dataPrivacyWarningMessage')}</Typography>
      </Box>
      <Box mt={4}>
        <Typography variant="body2">{translate('whenDataPrivacyIsEnabled')}</Typography>
      </Box>
      <Box mt={4}>
        <Typography variant="subtitle2">{translate('agentSettingsTitle')}</Typography>
        <Typography variant="body2">{translate('autoUploadWillBeDisabled')}</Typography>
      </Box>
      <Box mt={4}>
        <Typography variant="body2">{translate('toRenableDataPrivacyWillNeedToBeDisabled')}</Typography>
      </Box>
    </Alert>
  )

  const renderDataFieldsTable = () =>
    cond([
      [
        () => values[fields[PolicyNvpName.data_privacy]] === '1',
        () => (
          <Box pl={LEFT_INDENT}>
            <Paper elevation={0} data-autoid="data-privacy-fields-table">
              <StaticCheckboxTable.Head
                fieldColumnName={translate('dataField')}
                checkboxColumnName={translate('blocked')}
                autoIdPrefix="data-privacy-data-fields-table"
              />
              <StaticCheckboxTable.Body
                fields={fields}
                values={values}
                setField={setField}
                rows={getTranslatedDataFieldTableRows()}
                autoIdPrefix="data-privacy-data-fields-table"
              />
            </Paper>
          </Box>
        ),
      ],
    ])(undefined)

  return (
    <>
      {renderWarning()}
      <PolicyDetailsSwitch
        formSection={SECTION_NAME}
        controlProps={rawControlProps}
        name={fields[PolicyNvpName.data_privacy]}
        onChange={onSwitchChange}
        checked={values[fields[PolicyNvpName.data_privacy]] === '1'}
        label={translate('dataPrivacyTitle')}
        caption={
          <span>
            {translate('dataPrivacyCaption')}
            <Box mt={NESTED_CONTROL_TOP_PAD}>{translate('availableForAndHigher', { version: translate('agentVersion1480') })}</Box>
          </span>
        }
        dataAutoid="data-privacy-switch"
      />
      {renderDataFieldsTable()}
    </>
  )
}

export default React.memo(DataPrivacy, arePropsEqual)
