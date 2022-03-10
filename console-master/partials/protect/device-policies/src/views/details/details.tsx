/* eslint-disable sonarjs/no-duplicate-string */
// --TODO: remove rule ignore above

import pick from 'lodash/pick'
import values from 'lodash/values'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormState } from 'react-use-form-state'

import { DEFAULT_DEVICE_POLICY_NAME, PolicyNvpName, RootPolicyField } from '@ues-data/epp'
import { PageBase } from '@ues-platform/shared'
import { ContentArea, ContentAreaPanel, usePageTitle } from '@ues/behaviours'

import { AgentSettings, ApplicationControl, DataPrivacy, GeneralInfo, useDetails } from './../../modules/details'
import {
  getAgentSettingsFields,
  getApplicationControlFields,
  getDataPrivacyFields,
  getExternalDeviceControlFields,
  getFileProtectionFields,
  getGeneralInfoFields,
  getMemoryProtectionFields,
  getOpticsFields,
  getPersonaFields,
  getScriptControlFields,
} from './utils'

const TEMP_FORM_ERRORS = {} // --TODO: remove this

const DevicePolicyDetails = (): JSX.Element => {
  const { t: translate } = useTranslation(['protect'])

  const { data } = useDetails()

  // fields and form state by section
  // --TODO: generate fields based on enabled features

  // --TODO: create hook for form state, submission, etc.

  const generalInfoFields = getGeneralInfoFields()
  const [generalInfoFormState, generalInfoInputs] = useFormState(pick(data, values(generalInfoFields)))

  const fileProtectionFields = useMemo(() => getFileProtectionFields(data), [data])
  const [fileProtectionFormState, fileProtectionInputs] = useFormState(pick(data, values(fileProtectionFields)))

  const memoryProtectionFields = useMemo(() => getMemoryProtectionFields(data), [data])
  const [memoryProtectionFormState, memoryProtectionInputs] = useFormState(pick(data, values(memoryProtectionFields)))

  const scriptControlFields = useMemo(() => getScriptControlFields(data), [data])
  const [scriptControlFormState, scriptControlInputs] = useFormState(pick(data, values(scriptControlFields)))

  const externalDeviceControlFields = getExternalDeviceControlFields(data)
  const [externalDeviceControlFormState, externalDeviceControlInputs] = useFormState(
    pick(data, values(externalDeviceControlFields)),
  )

  const applicationControlFields = getApplicationControlFields()
  const [applicationControlFormState, applicationControlInputs] = useFormState(pick(data, values(applicationControlFields)))

  const opticsFields = getOpticsFields(data)
  const [opticsFormState, opticsInputs] = useFormState(pick(data, values(opticsFields)))

  const personaFields = getPersonaFields()
  const [personaFormState, personaInputs] = useFormState(pick(data, values(personaFields)))

  const agentSettingsFields = useMemo(() => getAgentSettingsFields(data), [data])
  const [agentSettingsFormState, agentSettingsInputs] = useFormState(pick(data, values(agentSettingsFields)))

  const dataPrivacyFields = getDataPrivacyFields(data)
  const [dataPrivacyFormState, dataPrivacyInputs] = useFormState(pick(data, values(dataPrivacyFields)))

  // --TODO
  // const { formErrors }: { formErrors: Record<string, unknown> } = useSelector(
  //   ({ policies }: PoliciesRootState) => policies
  // );

  // render

  usePageTitle(translate('devicePolicyDetailsTitle'))

  const isDefaultPolicy = generalInfoFormState.values[generalInfoFields[RootPolicyField.policy_name]] === DEFAULT_DEVICE_POLICY_NAME
  const isDataPrivacyEnabled = dataPrivacyFormState.values[dataPrivacyFields[PolicyNvpName.data_privacy]] === '1'

  return (
    <PageBase title={translate('devicePolicyDetailsTitle')}>
      <ContentArea
        height="100%"
        //data-autoid="policy-details-form"
      >
        <ContentAreaPanel
          fullWidth
          fullHeight
          title={translate('generalInfoTitle')}
          //data-autoid="policy-details-section-general-info"
        >
          <GeneralInfo
            fields={generalInfoFields}
            values={generalInfoFormState.values}
            textProps={generalInfoInputs.text}
            errors={TEMP_FORM_ERRORS}
            isDefaultPolicy={isDefaultPolicy}
          />
        </ContentAreaPanel>

        <ContentAreaPanel
          fullWidth
          fullHeight
          //data-autoid="policy-details-section-file-protection"
        >
          <div>
            <strong>--TODO: File Protection</strong>
            <br />
            <span style={{ wordBreak: 'break-word' }}>{JSON.stringify(fileProtectionFormState.values)}</span>
          </div>
        </ContentAreaPanel>

        <ContentAreaPanel
          fullWidth
          fullHeight
          //data-autoid="policy-details-section-memory-protection""
        >
          <div>
            <strong>--TODO: Memory Protection</strong>
            <br />
            <span style={{ wordBreak: 'break-word' }}>{JSON.stringify(memoryProtectionFormState.values)}</span>
          </div>
        </ContentAreaPanel>

        <ContentAreaPanel
          fullWidth
          fullHeight
          //data-autoid="policy-details-section-script-control"
        >
          <div>
            <strong>--TODO: Script Control</strong>
            <br />
            <span style={{ wordBreak: 'break-word' }}>{JSON.stringify(scriptControlFormState.values)}</span>
          </div>
        </ContentAreaPanel>

        <ContentAreaPanel
          fullWidth
          fullHeight
          //data-autoid="policy-details-section-external-device-control"
        >
          <div>
            <strong>--TODO: External Device Control</strong>
            <br />
            <span style={{ wordBreak: 'break-word' }}>{JSON.stringify(externalDeviceControlFormState.values)}</span>
          </div>
        </ContentAreaPanel>

        <ContentAreaPanel
          fullWidth
          fullHeight
          title={translate('applicationControlTitle')}
          //data-autoid="policy-details-section-application-control"
        >
          <ApplicationControl
            fields={applicationControlFields}
            values={applicationControlFormState.values}
            rawControlProps={applicationControlInputs.raw}
            setField={applicationControlFormState.setField}
          />
        </ContentAreaPanel>

        <ContentAreaPanel
          fullWidth
          fullHeight
          //data-autoid="policy-details-section-optics-settings"
        >
          <div>
            <strong>--TODO: Optics Settings</strong>
            <br />
            <span style={{ wordBreak: 'break-word' }}>{JSON.stringify(opticsFormState.values)}</span>
          </div>
        </ContentAreaPanel>

        <ContentAreaPanel
          fullWidth
          fullHeight
          //data-autoid="policy-details-section-persona-settings"
        >
          <div>
            <strong>--TODO: Persona Settings</strong>
            <br />
            <span style={{ wordBreak: 'break-word' }}>{JSON.stringify(personaFormState.values)}</span>
          </div>
        </ContentAreaPanel>

        <ContentAreaPanel
          fullWidth
          fullHeight
          title={translate('agentSettingsTitle')}
          //data-autoid="policy-details-section-agent-settings"
        >
          <AgentSettings
            fields={agentSettingsFields}
            values={agentSettingsFormState.values}
            rawControlProps={agentSettingsInputs.raw}
            setField={agentSettingsFormState.setField}
            isDataPrivacyEnabled={isDataPrivacyEnabled}
          />
        </ContentAreaPanel>

        <ContentAreaPanel
          fullWidth
          fullHeight
          title={translate('dataPrivacyTitle')}
          //data-autoid=policy-details-section-data-privacy"
        >
          <DataPrivacy
            fields={dataPrivacyFields}
            values={dataPrivacyFormState.values}
            rawControlProps={dataPrivacyInputs.raw}
            setField={dataPrivacyFormState.setField}
          />
        </ContentAreaPanel>
      </ContentArea>
    </PageBase>
  )
}

export default DevicePolicyDetails
