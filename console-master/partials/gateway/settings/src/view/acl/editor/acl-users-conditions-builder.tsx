//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import React, { memo, useContext, useMemo } from 'react'
import { FormProvider, useController, useForm, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Box, FormHelperText } from '@material-ui/core'

import type { FieldModelInterface } from '@ues-behaviour/hook-form'
import { InputGroups } from '@ues-behaviour/hook-form'
import type { AclRuleSelectorConjunctionTerm } from '@ues-data/gateway'
import { AclRuleSelectorProperty } from '@ues-data/gateway'
import type { Group, User } from '@ues-data/platform'
import { GroupsApi, queryUsers } from '@ues-data/platform'
import { serializeQueryParameter, useStatefulApolloQuery } from '@ues-data/shared'
import { Components, Config, Data } from '@ues-gateway/shared'
import type { EnhancedSearchProps } from '@ues/behaviours'
import { EnhancedSearch, EnhancedSearchComparisonType, FILTER_TYPES, OPERATOR_VALUES, TableSortDirection } from '@ues/behaviours'

import { ConjunctionLabel } from '../../../components'
import { useRuleUsersAndGroupsData } from '../hooks'

const { getInitialAclRuleConditions, updateLocalAclRuleData } = Data
const { GATEWAY_TRANSLATIONS_KEY } = Config
const { EntityDetailsViewContext, LoadingProgress } = Components

const SUPPORTED_OPERATORS = [EnhancedSearchComparisonType.Contains, EnhancedSearchComparisonType.DoesNotContain]
const SEARCH_USERS_BY: keyof User = 'displayName'
const SEARCH_GROUPS_BY: keyof Group = 'name'
const FIELD_DATA_KEY = 'condition'

const ConditionInput: React.FC<{
  onChange: () => void
  formField: FieldModelInterface
  usersMap?: Record<User['ecoId'], User>
  groupsMap?: Record<Group['id'], Group>
  autoFocus?: boolean
}> = memo(({ onChange, formField, usersMap, groupsMap, autoFocus }) => {
  const formInstance = useFormContext()
  const { field: formFieldController } = useController({
    control: formInstance?.control,
    name: formField.name,
  })

  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const { shouldDisableFormField } = useContext(EntityDetailsViewContext)

  const serializeSearchQueryParam = (queryParamName, value) =>
    serializeQueryParameter(queryParamName, { value, operator: OPERATOR_VALUES.CONTAINS })

  const updateCondition: EnhancedSearchProps['onChange'] = data => {
    const update = data.map<AclRuleSelectorConjunctionTerm>(({ dataKey, operator, value }) => ({
      negated: operator === EnhancedSearchComparisonType.DoesNotContain,
      propertySelector: { property: dataKey, values: value } as AclRuleSelectorConjunctionTerm['propertySelector'],
    }))

    formFieldController.onChange(update)
    onChange()
  }

  const {
    data: userOptionsData,
    loading: userOptionsLoading,
    refetch: refetchUsersOptions,
    fetchMore: fetchMoreUsersOptions,
  } = useStatefulApolloQuery(queryUsers, { variables: { sortBy: SEARCH_USERS_BY, sortDirection: TableSortDirection.Asc } })
  const usersOptions = useMemo(
    () => userOptionsData?.platformUsers?.elements?.map(item => ({ label: item[SEARCH_USERS_BY], value: item.ecoId })) ?? [],
    [userOptionsData?.platformUsers?.elements],
  )

  const {
    data: groupOptionsData,
    loading: groupOptionsLoading,
    refetch: refetchGroupsOptions,
  } = useStatefulApolloQuery(GroupsApi.queryGroups, { variables: { sortBy: `${SEARCH_GROUPS_BY} ${TableSortDirection.Asc}` } })
  const groupsOptions = useMemo(
    () => groupOptionsData?.userGroups?.elements?.map(item => ({ label: item[SEARCH_GROUPS_BY], value: item.id })) ?? [],
    [groupOptionsData?.userGroups?.elements],
  )

  const enhancedSearchListProps = {
    [AclRuleSelectorProperty.User]: {
      onSearch: value => refetchUsersOptions({ query: serializeSearchQueryParam(SEARCH_USERS_BY, value) }),
      onFetchMore: ({ offset, searchValue }) =>
        fetchMoreUsersOptions({ variables: { offset, query: serializeSearchQueryParam(SEARCH_USERS_BY, searchValue) } }),
    },
    [AclRuleSelectorProperty.UserGroup]: {
      onSearch: value => refetchGroupsOptions({ query: serializeSearchQueryParam(SEARCH_GROUPS_BY, value) }),
    },
  }

  const enhancedSearchFieldsAsyncProps = {
    [AclRuleSelectorProperty.User]: {
      options: usersOptions,
      loading: userOptionsLoading,
      total: userOptionsData?.platformUsers?.totals?.elements ?? 0,
    },
    [AclRuleSelectorProperty.UserGroup]: {
      options: groupsOptions,
      loading: groupOptionsLoading,
      total: groupOptionsData?.userGroups.totals?.elements ?? 0,
    },
  }

  const enhancedSearchOptionLabel = useMemo(
    () => ({
      [AclRuleSelectorProperty.User]: value => usersMap?.[value]?.[SEARCH_USERS_BY] ?? '',
      [AclRuleSelectorProperty.UserGroup]: value => groupsMap?.[value]?.[SEARCH_GROUPS_BY] ?? '',
    }),
    [usersMap, groupsMap],
  )

  const initialValues = useMemo(
    () =>
      (formFieldController.value as AclRuleSelectorConjunctionTerm[])?.map(item => {
        const propertyKey = item.propertySelector.property

        return {
          dataKey: propertyKey,
          operator: item.negated ? EnhancedSearchComparisonType.DoesNotContain : EnhancedSearchComparisonType.Contains,
          value: item?.propertySelector?.values?.map(value => ({
            label: enhancedSearchOptionLabel[propertyKey](value),
            value,
          })),
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enhancedSearchOptionLabel],
  )

  return (
    <Box>
      <EnhancedSearch
        disabled={shouldDisableFormField}
        showChipSeparator
        condensed
        asyncFieldsProps={enhancedSearchFieldsAsyncProps}
        onChange={updateCondition}
        initialValues={initialValues}
        placeholder={t('acl.addUsersOrGroups')}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={formField.autoFocus || autoFocus}
        fields={[
          {
            type: FILTER_TYPES.LIST,
            label: t('common.user'),
            dataKey: AclRuleSelectorProperty.User,
            customOperators: SUPPORTED_OPERATORS,
            listProps: enhancedSearchListProps[AclRuleSelectorProperty.User],
          },
          {
            type: FILTER_TYPES.LIST,
            label: t('common.group'),
            dataKey: AclRuleSelectorProperty.UserGroup,
            customOperators: SUPPORTED_OPERATORS,
            listProps: enhancedSearchListProps[AclRuleSelectorProperty.UserGroup],
            allowDuplicate: true,
          },
        ]}
      />
    </Box>
  )
})

const AclConditionsBuilder: React.FC = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const initialAclRuleConditions = useSelector(getInitialAclRuleConditions)
  const { shouldDisableFormField } = useContext(EntityDetailsViewContext)

  const { usersTask, groupsTask } = useRuleUsersAndGroupsData(initialAclRuleConditions)

  const initialValues = useMemo(() => initialAclRuleConditions?.map(item => ({ [FIELD_DATA_KEY]: item })), [
    initialAclRuleConditions,
  ])

  const formInstance = useForm({
    mode: 'all',
    shouldFocusError: true,
    defaultValues: initialValues,
  })

  // TODO throttle that action
  const handleChange = () => {
    const data = formInstance.getValues()

    const conditionsUpdate = Object.values(data).reduce(
      (acc, item) => (isEmpty(item?.[FIELD_DATA_KEY]) ? acc : [...acc, item[FIELD_DATA_KEY]]),
      [],
    )

    dispatch(updateLocalAclRuleData({ criteria: { selector: { conjunctions: conditionsUpdate } } }))
  }

  return usersTask.loading || groupsTask.loading ? (
    <LoadingProgress alignSelf="center" />
  ) : (
    <FormProvider {...formInstance}>
      <form>
        <InputGroups
          addButtonContainerMuiProps={{ ml: 14 }}
          initialValues={initialValues}
          onChange={handleChange}
          disabled={shouldDisableFormField}
          fieldsModel={{
            [FIELD_DATA_KEY]: {
              name: FIELD_DATA_KEY,
              renderComponent: ({ field, onChange, index: fieldIndex, autoFocus }) => (
                <React.Fragment key={fieldIndex}>
                  <ConjunctionLabel showText={fieldIndex > 0} autoHeight />
                  <ConditionInput
                    formField={field}
                    groupsMap={groupsTask?.data}
                    onChange={onChange}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus={autoFocus}
                    usersMap={usersTask?.data}
                  />
                </React.Fragment>
              ),
            },
          }}
          appendItem={() => (
            <Box ml={16}>
              <FormHelperText component="label">{t('acl.labelAclUsersOrGroups')}</FormHelperText>
            </Box>
          )}
        />
      </form>
    </FormProvider>
  )
}

export default AclConditionsBuilder
