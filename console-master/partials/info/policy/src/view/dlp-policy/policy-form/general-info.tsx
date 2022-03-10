import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import * as yup from 'yup'

import { yupResolver } from '@hookform/resolvers/yup'

import { Box, Tooltip, Typography } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import { CLASSIFICATION, PolicyData } from '@ues-data/dlp'
import { Permission } from '@ues-data/shared'
import { BasicInfo } from '@ues/assets'
import { ContentAreaPanel, SecuredContentBoundary, useSecuredContent } from '@ues/behaviours'

import { usePoliciesPermissions } from '.././usePoliciesPermission'
import { policyStyles } from './styles'

const FIELDS_KEYS = ['policyName', 'description']
const FIELDS_KEYS_CONTENT_POLICY = [...FIELDS_KEYS, 'classification']

const GeneralInfo = () => {
  useSecuredContent(Permission.BIP_POLICY_READ)
  const { policyTooltip, formWrapper } = policyStyles()
  const { t } = useTranslation('dlp/policy')
  const { policyType } = useParams()
  const dispatch = useDispatch()
  const { canUpdate } = usePoliciesPermissions()
  const localGeneralInfo = useSelector(PolicyData.getGeneralInfo)
  const [generalFieldsValues, setGeneralFieldsValues] = useState([])
  const [initialGeneralValues, setInitialGeneralValues] = useState({
    policyName: localGeneralInfo?.policyName ?? '',
    description: localGeneralInfo?.description ?? '',
    classification: localGeneralInfo?.classification ?? CLASSIFICATION.ORGANIZATIONAL,
  })

  const tooltipText =
    localGeneralInfo?.classification === CLASSIFICATION.REGULATORY
      ? t('policy.sections.general.info.regulatoryDesc')
      : t('policy.sections.general.info.organizationalDesc')

  useEffect(() => {
    const isContentPolicyType = policyType === 'content'
    const newFields = isContentPolicyType ? FIELDS_KEYS_CONTENT_POLICY : FIELDS_KEYS
    setGeneralFieldsValues(newFields)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ContentAreaPanel title={t('policy.sections.general.title')} ContentWrapper={SecuredContentBoundary}>
      <Box style={{ maxWidth: 740 }}>
        <Typography variant="body2">{t('policy.sections.general.info.description')}</Typography>
      </Box>
      <div className={formWrapper}>
        <Form
          initialValues={initialGeneralValues}
          resolver={yupResolver(
            yup.object().shape({
              policyName: yup.string().required(t('policy.sections.requiredInput')),
            }),
          )}
          fields={generalFieldsValues.map((fieldKey, index) => {
            if (fieldKey === 'classification') {
              return {
                type: 'select',
                label: t('policy.sections.general.type.title'),
                name: 'classification',
                variant: 'filled',
                size: 'small',
                options: [
                  { label: t('policy.sections.general.type.organizational'), value: CLASSIFICATION.ORGANIZATIONAL },
                  { label: t('policy.sections.general.type.regulatory'), value: CLASSIFICATION.REGULATORY },
                ],
                disabled: !canUpdate,
              }
            } else {
              return {
                required: index === 0,
                type: 'text',
                label: t(`policy.sections.general.${fieldKey}`),
                name: fieldKey,
                disabled: !canUpdate,
              }
            }
          })}
          onChange={({ formValues }) => {
            dispatch(PolicyData.updateLocalPolicyData(formValues))
          }}
          hideButtons
        />
        <Tooltip title={tooltipText} placement="right" className={policyTooltip}>
          <span>
            <BasicInfo color="primary" />
          </span>
        </Tooltip>
      </div>
    </ContentAreaPanel>
  )
}

export default GeneralInfo
