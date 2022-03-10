import { cond } from 'lodash-es'
import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import { useTheme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Alert from '@material-ui/lab/Alert'

import { PolicyNvpName, SoftwareInventoryField } from '@ues-data/epp'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { StatusMedium, useInputFormControlStyles } from '@ues/assets'

import { LEFT_INDENT, NESTED_CONTROL_TOP_PAD } from './../constants'
import { PolicyDetailsSwitch } from './../shared'
import { arePropsEqual, onSwitchChange } from './../utils'

const SECTION_NAME = 'policy-agent-settings'
const DELETION_RANGE_MIN = 14
const DELETION_RANGE_MAX = 365
const INVENTORY_HOURS_MIN = 1
const INVENTORY_HOURS_MAX = 24

const AgentSettings = ({ fields, values, rawControlProps, setField, isDataPrivacyEnabled }) => {
  const { t: translate } = useTranslation(['protect'])
  const theme = useTheme()
  const { root } = useInputFormControlStyles(theme)

  const features = useFeatures()
  const softwareInventoryEnabled = features.isEnabled(FeatureName.DevicePolicySoftwareInventoryEnabled)

  // actions

  const onCounterChange = ({ target: { value, min } }) => (value === '' ? min : value)

  const onBlurDaysUntilDeleted = ({ target: { value } }) =>
    // ensure user-entered value respects min and max
    cond([
      [() => parseInt(value) < DELETION_RANGE_MIN, () => setField(fields[PolicyNvpName.days_until_deleted], DELETION_RANGE_MIN)],
      [() => parseInt(value) > DELETION_RANGE_MAX, () => setField(fields[PolicyNvpName.days_until_deleted], DELETION_RANGE_MAX)],
      [() => value.startsWith('0'), () => setField(fields[PolicyNvpName.days_until_deleted], value.replace(/^0+/, ''))],
      [() => true, () => value],
    ])(undefined)

  const onBlurInventoryHours = ({ target: { value } }) =>
    // ensure user-entered value respects min and max
    cond([
      [
        () => parseInt(value) < INVENTORY_HOURS_MIN,
        () => setField(fields[SoftwareInventoryField.full_report_hours], INVENTORY_HOURS_MIN),
      ],
      [
        () => parseInt(value) > INVENTORY_HOURS_MAX,
        () => setField(fields[SoftwareInventoryField.full_report_hours], INVENTORY_HOURS_MAX),
      ],
      [() => value.startsWith('0'), () => setField(fields[SoftwareInventoryField.full_report_hours], value.replace(/^0+/, ''))],
      [() => true, () => value],
    ])(undefined)

  // effects

  React.useEffect(() => {
    if (isDataPrivacyEnabled) {
      setField(fields[PolicyNvpName.logpolicy], '0')
    }
  }, [isDataPrivacyEnabled, fields, setField])

  // render

  const renderDataPrivacyMessage = cond([
    [
      () => isDataPrivacyEnabled,
      () => (
        <Box display="flex" pt={NESTED_CONTROL_TOP_PAD} pl={LEFT_INDENT} data-autoid="policy-agent-settings-data-privacy-warning">
          <Alert variant="outlined" severity="warning" icon={<StatusMedium />}>
            <Typography variant="body2">{translate('dataPrivacyEnabledMessage')}</Typography>
          </Alert>
        </Box>
      ),
    ],
  ])

  const renderReportHours = cond([
    [
      () => values[fields[SoftwareInventoryField.enabled]] === '1',
      () => (
        <Box pl={LEFT_INDENT} pt={NESTED_CONTROL_TOP_PAD}>
          <TextField
            {...rawControlProps({
              name: fields[SoftwareInventoryField.full_report_hours],
              onChange: onCounterChange,
              onBlur: onBlurInventoryHours,
            })}
            classes={{ root }}
            value={values[fields[SoftwareInventoryField.full_report_hours]] || INVENTORY_HOURS_MIN}
            label={translate('inventoryReportHoursHint')}
            helperText={translate('rangeHours', {
              range: `${INVENTORY_HOURS_MIN} - ${INVENTORY_HOURS_MAX}`,
            })}
            type="number"
            inputProps={{
              min: INVENTORY_HOURS_MIN,
              max: INVENTORY_HOURS_MAX,
            }}
            size="small"
            data-autoid={`policy-agent-settings-${fields[SoftwareInventoryField.full_report_hours]}`}
          />
        </Box>
      ),
    ],
  ])

  const renderSoftwareInventory = cond([
    [
      () => softwareInventoryEnabled,
      () => (
        <div>
          <PolicyDetailsSwitch
            formSection={SECTION_NAME}
            controlProps={rawControlProps}
            name={fields[SoftwareInventoryField.enabled]}
            onChange={onSwitchChange}
            checked={values[fields[SoftwareInventoryField.enabled]] === '1'}
            label={translate('softwareInventoryLabel')}
            caption={translate('inventoryReportHoursLabel')}
          />
          {renderReportHours(undefined)}
        </div>
      ),
    ],
  ])

  const renderAutoDeleteQuarantined = cond([
    [
      () => values[fields[PolicyNvpName.auto_delete]] === '1',
      () => (
        <Box pl={LEFT_INDENT} pt={NESTED_CONTROL_TOP_PAD}>
          <TextField
            {...rawControlProps({
              name: fields[PolicyNvpName.days_until_deleted],
              onChange: onCounterChange,
              onBlur: onBlurDaysUntilDeleted,
            })}
            classes={{ root }}
            value={values[fields[PolicyNvpName.days_until_deleted]] || DELETION_RANGE_MIN}
            label={translate('daysUntilDeletion')}
            helperText={translate('rangeDays', {
              range: `${DELETION_RANGE_MIN} - ${DELETION_RANGE_MAX}`,
            })}
            type="number"
            inputProps={{
              min: DELETION_RANGE_MIN,
              max: DELETION_RANGE_MAX,
            }}
            size="small"
            data-autoid={`policy-agent-settings-${fields[PolicyNvpName.days_until_deleted]}`}
          />
        </Box>
      ),
    ],
  ])

  return (
    <>
      <PolicyDetailsSwitch
        formSection={SECTION_NAME}
        controlProps={rawControlProps}
        name={fields[PolicyNvpName.prevent_service_shutdown]}
        onChange={onSwitchChange}
        checked={values[fields[PolicyNvpName.prevent_service_shutdown]] === '1'}
        label={translate('preventServiceShutdown')}
        caption={translate('preventServiceShutdownCaption')}
      />
      <div>
        <PolicyDetailsSwitch
          formSection={SECTION_NAME}
          controlProps={rawControlProps}
          name={fields[PolicyNvpName.logpolicy]}
          onChange={onSwitchChange}
          checked={values[fields[PolicyNvpName.logpolicy]] === '1'}
          label={translate('autoUploadLogFiles')}
          caption={translate('autoUploadLogFilesCaption')}
          disabled={isDataPrivacyEnabled}
        />
        {renderDataPrivacyMessage(undefined)}
      </div>
      <PolicyDetailsSwitch
        formSection={SECTION_NAME}
        controlProps={rawControlProps}
        name={fields[PolicyNvpName.show_notifications]}
        onChange={onSwitchChange}
        checked={values[fields[PolicyNvpName.show_notifications]] === '1'}
        label={translate('desktopNotifications')}
        caption={translate('desktopNotificationsCaption')}
      />
      <div>
        <PolicyDetailsSwitch
          formSection={SECTION_NAME}
          controlProps={rawControlProps}
          name={fields[PolicyNvpName.auto_delete]}
          onChange={onSwitchChange}
          checked={values[fields[PolicyNvpName.auto_delete]] === '1'}
          label={translate('autoDeleteQuarantined')}
          caption={translate('autoDeleteQuarantinedCaption')}
        />
        <Box pl={LEFT_INDENT} pt={NESTED_CONTROL_TOP_PAD}>
          <Typography variant="caption" color="textSecondary">
            {translate('availableForAndHigher', { version: translate('agentVersion1430') })}
          </Typography>
        </Box>
        {renderAutoDeleteQuarantined(undefined)}
      </div>
      {renderSoftwareInventory(undefined)}
    </>
  )
}

const areAgentSettingsPropsEqual = (prevProps, nextProps) =>
  prevProps.isDataPrivacyEnabled === nextProps.isDataPrivacyEnabled && arePropsEqual(prevProps, nextProps)

export default React.memo(AgentSettings, areAgentSettingsPropsEqual)
