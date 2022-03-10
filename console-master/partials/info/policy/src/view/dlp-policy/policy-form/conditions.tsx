import _ from 'lodash-es'
import React, { useCallback, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Dialog, Link, Typography } from '@material-ui/core'

import type { DataEntity, Template } from '@ues-data/dlp'
import { PolicyData, TemplateData } from '@ues-data/dlp'
import { Permission, useStatefulReduxQuery } from '@ues-data/shared'
import { ConditionsBuilder, exportJsonLogic } from '@ues-info/shared'
import {
  ConfirmationState,
  ContentAreaPanel,
  Loading,
  SecuredContentBoundary,
  useConfirmation,
  useSecuredContent,
} from '@ues/behaviours'

import { usePoliciesPermissions } from '.././usePoliciesPermission'
import { useItemDialog } from '../common/dialog/useItemDialog'

const FIELD_NAME_MAPPING = 'name'
const FIELD_DESCRIPTION_MAPPING = 'description'

const defaultConditionJson = '{"and":[{">=":[{"var":" "},1]}]}'

const Conditions = () => {
  useSecuredContent(Permission.BIP_POLICY_READ)
  const [conditionEntity, setConditionEntity] = useState(defaultConditionJson)
  const conditionJson = useSelector(PolicyData.getConditionJSON)
  const { canUpdate } = usePoliciesPermissions()
  const confirmation = useConfirmation()

  const dispatch = useDispatch()
  useMemo(() => {
    if (!_.isEmpty(conditionJson)) {
      setConditionEntity(conditionJson)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditionJson])

  const { t } = useTranslation('dlp/policy')
  // TODO. Add state management logic for Dialog and adding of new conditon
  // TODO. Implement conditions table after approval of UX design
  const { loading: loadingAssociatedTemplates, data: associatedTemplates } = useStatefulReduxQuery(
    TemplateData.queryAssociatedTemplates,
  )

  const [filteredAssignable, setFilteredAssignable] = useState([])

  const labels = {
    title: t('policy.sections.conditions.addFromTemplateDialog.title'),
    description: t('policy.sections.conditions.addFromTemplateDialog.description'),
    noTemplates: (
      <Typography variant="body2">
        <Trans
          t={t}
          i18nKey="policy.sections.conditions.addFromTemplateDialog.noTemplatesDescription"
          components={[<Link href="#/settings/templates"></Link>]}
        />
      </Typography>
    ),
    searchText: t('policy.sections.conditions.addFromTemplateDialog.searchText'),
    cancel: t('policy.buttons.cancel'),
    submit: t('policy.buttons.save'),
  }

  const handleSearch = (str: string) => {
    if (str) {
      setFilteredAssignable(
        associatedTemplates?.elements.filter(template => template.name.toLowerCase().includes(str.toLowerCase())),
      )
    } else {
      setFilteredAssignable(associatedTemplates?.elements)
    }
  }

  let confirmationState: string
  let json: string

  const checkPopUpDisplaying = (value: string) => {
    const isAllInputsEmpty = /"var":(?="\S*")/g.test(value) ? false : true
    return /"var":(?="\s*")|("and"|"or"):(?=\[\])/g.test(value) && isAllInputsEmpty ? false : true
  }

  const processAssignment = async (templates: Template[]) => {
    json = JSON.stringify(templates[0]?.condition)
    if (checkPopUpDisplaying(conditionEntity) && json !== conditionEntity) {
      confirmationState = await confirmation({
        title: t('policy.sections.conditions.addFromTemplateDialog.confirmation.title'),
        description: t('policy.sections.conditions.addFromTemplateDialog.confirmation.description'),
        cancelButtonLabel: t('policy.buttons.cancel'),
        confirmButtonLabel: t('policy.buttons.continue'),
      })
    } else {
      confirmationState = ConfirmationState.Confirmed
    }
    if (confirmationState === ConfirmationState.Confirmed) {
      if (templates[0]?.condition) {
        setConditionEntity(json)
        onChange(json)
      } else {
        setConditionEntity(defaultConditionJson)
      }
      return []
    }
  }

  const { dialogOptions, setDialogId } = useItemDialog({
    data: filteredAssignable,
    loading: false,
    labels: labels,
    handleSearch,
    submitAssignment: (dataEntities: DataEntity[]) => ({}),
    processAssignment: processAssignment,
    labelFields: { name: FIELD_NAME_MAPPING, description: FIELD_DESCRIPTION_MAPPING },
  })

  const handleAddFromTemplate = useCallback(() => {
    setFilteredAssignable(associatedTemplates?.elements)
    setDialogId(Symbol('assignmentId'))
  }, [associatedTemplates, setDialogId])

  const onChange = (conditionJson: string) => {
    if (!_.isEqual(conditionEntity, conditionJson)) {
      dispatch(PolicyData.updateLocalPolicyData({ condition: conditionJson }))
    }
  }

  return (
    <ContentAreaPanel title={t('policy.sections.conditions.title')} ContentWrapper={SecuredContentBoundary}>
      <Typography variant="body2" paragraph={true}>
        <Trans t={t} i18nKey="policy.sections.conditions.description" components={[<Link href="#/settings/templates"></Link>]} />
      </Typography>
      <div style={{ maxWidth: '200px' }}>
        {canUpdate && (
          <Button color="primary" variant="contained" size="medium" onClick={handleAddFromTemplate}>
            {t('policy.sections.conditions.addFromTemplate')}
          </Button>
        )}
      </div>
      <Dialog {...dialogOptions} />
      <ConditionsBuilder conditionEntity={conditionEntity} onChangeConditionEntity={onChange} editable={canUpdate} />
    </ContentAreaPanel>
  )
}

export default Conditions
