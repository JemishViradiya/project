import cond from 'lodash/cond'
import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Alert from '@material-ui/lab/Alert'

import { AppControlField, RootPolicyField } from '@ues-data/epp'
import { StatusMedium } from '@ues/assets'

import { CAPTION_TOP_MARGIN, LEFT_INDENT, NESTED_CONTROL_TOP_PAD } from './../constants'
import { PolicyDetailsSwitch } from './../shared'
import { onSwitchChange } from './../utils'
import { DEFAULT_APPLICATION_CONTROL_LOCKDOWN } from './constants'
import ExclusionList from './exclusionList'

const SECTION_NAME = 'policy-application-control'

interface ApplicationControlPropTypes {
  fields: Record<string, string>
  values: Record<string, any>
  rawControlProps: unknown
  setField: (name: string, value: any) => void
}

const ApplicationControl = ({ fields, values, rawControlProps, setField }: ApplicationControlPropTypes): JSX.Element => {
  const { t: translate } = useTranslation(['protect'])
  const isSectionEnabled = Boolean(values[fields[RootPolicyField.appcontrol]]?.length)

  // actions

  const onToggleApplicationControl = ({ target: { checked } }) =>
    cond([
      [() => checked, () => DEFAULT_APPLICATION_CONTROL_LOCKDOWN],
      [() => true, () => []],
    ])(undefined)

  // render

  const renderWarning = () => (
    <Alert variant="outlined" severity="warning" icon={<StatusMedium />}>
      <Typography variant="body2">{translate('applicationControlWarning')}</Typography>
      <Box mt={NESTED_CONTROL_TOP_PAD}>
        <Typography variant="body2">
          <strong>{translate('fileProtectionTitle')}</strong>
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">{translate('applicationControlWarningAutoQuarantine')}</Typography>
          </li>
          <li>
            <Typography variant="body2">{translate('applicationControlWarningFileWatcher')}</Typography>
          </li>
        </ul>
        <Typography variant="body2">
          <strong>{translate('memoryProtectionTitle')}</strong>
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">{translate('applicationControlWarningMemoryProtection')}</Typography>
          </li>
          <li>
            <Typography variant="body2">{translate('applicationControlWarningMemoryProtectionViolationTypes')}</Typography>
          </li>
        </ul>
      </Box>
    </Alert>
  )

  const renderChangeWindow = cond([
    [
      () => isSectionEnabled,
      () => (
        <Box pl={LEFT_INDENT}>
          <PolicyDetailsSwitch
            formSection={SECTION_NAME}
            controlProps={rawControlProps}
            name={fields[AppControlField.changewindow_enabled]}
            onChange={onSwitchChange}
            checked={isSectionEnabled && values[fields[AppControlField.changewindow_enabled]] === '1'}
            label={translate('changeWindow')}
            caption={translate('changeWindowCaption')}
          />
        </Box>
      ),
    ],
  ])

  const renderExclusionList = cond([
    [
      () => isSectionEnabled,
      () => (
        <Box pl={LEFT_INDENT}>
          <Typography component="div" variant="body1">
            {translate('excludeFolders')}
          </Typography>
          <Box mt={CAPTION_TOP_MARGIN}>
            <Typography component="div" variant="caption" color="textSecondary">
              {translate('applicationControlExclusionListCaption')}
            </Typography>
          </Box>
          <Box pt={NESTED_CONTROL_TOP_PAD}>
            <ExclusionList fields={fields} values={values} setField={setField} />
          </Box>
        </Box>
      ),
    ],
  ])

  return (
    <>
      {renderWarning()}
      <PolicyDetailsSwitch
        formSection={SECTION_NAME}
        controlProps={rawControlProps}
        name={fields[RootPolicyField.appcontrol]}
        onChange={onToggleApplicationControl}
        checked={isSectionEnabled}
        label={translate('applicationControlTitle')}
        caption={
          <span>
            {translate('blocksNewApplications')} <strong>{translate('notSupportedForMacDevices')}</strong>
          </span>
        }
      />
      {renderChangeWindow(undefined)}
      {renderExclusionList(undefined)}
    </>
  )
}

export default ApplicationControl
