//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Box, Collapse } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import type { AclRuleMatchDefinition } from '@ues-data/gateway'
import { Components, Config, Data, Types, Utils } from '@ues-gateway/shared'

import { MATCHES_LOCALIZATION_KEYS } from '../constants'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { EntityDetailsViewContext } = Components
const { getFetchAclRuleTask } = Data
const { makeMatchDefinition, makeMatchUIDefinition } = Utils

interface AclMatchBuilderProps {
  onChange: (data: AclRuleMatchDefinition) => void
  initialData: AclRuleMatchDefinition
  customOptionValues?: Types.AclRuleMatchUIDefinition[]
  criteriaBuilderComponent: React.ReactNode
}

const AclMatchBuilder: React.FC<AclMatchBuilderProps> = ({
  onChange,
  initialData,
  customOptionValues,
  criteriaBuilderComponent,
}) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const fetchAclRuleTask = useSelector(getFetchAclRuleTask)

  const { shouldDisableFormField } = useContext(EntityDetailsViewContext)

  const optionValues = customOptionValues ?? Object.values(Types.AclRuleMatchUIDefinition)

  return (
    <Box mb={2}>
      <Form
        initialValues={{ match: makeMatchUIDefinition(initialData) }}
        fields={[
          {
            disabled: shouldDisableFormField,
            name: 'match',
            options: optionValues.map(value => ({ label: t(MATCHES_LOCALIZATION_KEYS[value]), value })),
            type: 'select',
            muiProps: { fullWidth: false },
            renderComponent: ({ fieldComponent, fieldValue, fieldClassNames }) => (
              <>
                {fieldComponent}
                <Collapse in={fieldValue !== Types.AclRuleMatchUIDefinition.NotApplicable && !fetchAclRuleTask?.loading}>
                  <Box className={fieldClassNames.secondary}>{criteriaBuilderComponent}</Box>
                </Collapse>
              </>
            ),
          },
        ]}
        onChange={({ formValues: { match } }) => onChange(makeMatchDefinition(match))}
        hideButtons
      />
    </Box>
  )
}

export default AclMatchBuilder
