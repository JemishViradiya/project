import { debounce, isArray, isEmpty, isUndefined } from 'lodash-es'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import * as yup from 'yup'

import { yupResolver } from '@hookform/resolvers/yup'

import { Button } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import { usePrevious } from '@ues-behaviour/react'
import { ALGORITHM, DataEntities, INFO_TYPES, REGION } from '@ues-data/dlp'
import { Permission, useStatefulReduxMutation } from '@ues-data/shared'
import {
  ContentArea,
  ContentAreaPanel,
  FormButtonPanel,
  SecuredContentBoundary,
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

import { useDlpSettingsPermissions } from '../../../useDlpSettingsPermissions'
import { dataTypesStyles } from './styles'

// TODO provide typescript more deeply for response  value. Implement TS for JSON object
const dataEntityObj = {
  name: '',
  regions: '',
  infoTypes: '',
  algorithm: `${ALGORITHM.EXPRESSION}`,
  parameters: '',
  description: '',
}

enum Parameters {
  keywords = 'Keywords',
  expression = 'Regex',
}

const formatDataTypeResponse = dataType => {
  const parameters = dataType?.parameters[Parameters[dataType?.algorithm]] ?? ''
  return {
    name: dataType?.name,
    description: [dataType?.description],
    regions: dataType?.regions,
    infoTypes: dataType?.infoTypes,
    algorithm: dataType?.algorithm || ALGORITHM.EXPRESSION,
    parameters: parameters,
  }
}

const DataTypeEditor: React.FC<any> = ({ selectedDataEntity = dataEntityObj }) => {
  useSecuredContent(Permission.BIP_SETTINGS_READ)

  const { t } = useTranslation(['dlp/common', 'general/form'])
  const classes = dataTypesStyles()
  const { guid } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const snackbar = useSnackbar()
  const isAddMode = isUndefined(guid)
  const localDataEntity = useSelector(DataEntities.getLocalDataEntity)
  const hasUnsavedChanges = useSelector(DataEntities.getHasUnsavedDataEntityChanges(selectedDataEntity))

  const [createDataEntityAction, createDataEntityTask] = useStatefulReduxMutation(DataEntities.mutationCreateDataEntity)
  const [updateDataEntityAction, updateDataEntityTask] = useStatefulReduxMutation(DataEntities.mutationEditDataEntity)

  const [algorithm, setAlgorithm] = useState('')
  const { canUpdate } = useDlpSettingsPermissions()
  const readOnly = selectedDataEntity?.type === 'PREDEFINED'

  const defaultDataEntityState = formatDataTypeResponse(selectedDataEntity)
  const [initialDataEntity, setInitialDataEntity] = useState(defaultDataEntityState)

  // TODO refuse from debounce at all. Refactor and rewrite form to speed up typing within it.
  const onChangeForm = useMemo(
    () => debounce(f => dispatch(DataEntities.updateLocalDataEntity(f.formValues)), 600),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    setAlgorithm(localDataEntity.algorithm)
  }, [localDataEntity.algorithm])

  // handling for "create"
  const createDataEntityTaskPrev = usePrevious(createDataEntityTask)
  useEffect(() => {
    if (!createDataEntityTask.loading && createDataEntityTaskPrev.loading && createDataEntityTask.error) {
      snackbar.enqueueMessage(t('setting.dataType.error.create', { error: createDataEntityTask.error.message }), 'error')
    } else if (!createDataEntityTask.loading && createDataEntityTaskPrev.loading && createDataEntityTask.error === undefined) {
      snackbar.enqueueMessage(t('setting.dataType.success.create'), 'success')
      navigate('../../settings/data-types')
      dispatch(DataEntities.clearDataEntity())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createDataEntityTask])

  // handling for "update"
  const updateDataEntityTaskPrev = usePrevious(updateDataEntityTask)
  useEffect(() => {
    if (!updateDataEntityTask.loading && updateDataEntityTaskPrev.loading && updateDataEntityTask.error) {
      snackbar.enqueueMessage(t('setting.dataType.error.update', { error: updateDataEntityTask.error.message }), 'error')
    } else if (!updateDataEntityTask.loading && updateDataEntityTaskPrev.loading && updateDataEntityTask.error === undefined) {
      snackbar.enqueueMessage(t('setting.dataType.success.update'), 'success')
      navigate('../../../settings/data-types')
      dispatch(DataEntities.clearDataEntity())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateDataEntityTask])

  const handleCancel = () => {
    dispatch(DataEntities.updateLocalDataEntity(selectedDataEntity))
    setInitialDataEntity(null)
  }
  useEffect(
    () => {
      if (!initialDataEntity) {
        setInitialDataEntity(defaultDataEntityState)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialDataEntity],
  )

  const onSubmit = formData => {
    const parameters =
      formData?.algorithm === ALGORITHM.EXPRESSION
        ? { Regex: formData?.parameters }
        : { Keywords: formData?.parameters.split(','), IgnoreCase: true }
    const newDataEntity = {
      name: formData?.name,
      description: isArray(formData?.description) ? formData?.description.join(' ') : formData?.description,
      regions: formData?.regions,
      infoTypes: formData?.infoTypes,
      algorithm: formData?.algorithm || ALGORITHM.EXPRESSION,
      parameters: parameters,
    }
    isAddMode ? createDataEntityAction(newDataEntity) : updateDataEntityAction({ ...newDataEntity, guid: guid })
  }

  return (
    <ContentArea paddingBottom={6}>
      <ContentAreaPanel ContentWrapper={SecuredContentBoundary}>
        <Form
          initialValues={initialDataEntity}
          resolver={yupResolver(
            yup.object().shape({
              name: yup.string().required(t('enterField')),
              regions: yup.string().required(t('enterField')),
              infoTypes: yup.string().required(t('enterField')),
              algorithm: yup.string().required(t('enterField')),
              parameters: yup.string().required(t('enterField')),
            }),
          )}
          fields={[
            {
              type: 'text',
              name: 'name',
              label: t('setting.dataType.name'),
              required: true,
              disabled: !canUpdate,
              muiProps: {
                inputProps: {
                  readOnly: readOnly,
                },
              },
            },
            {
              type: 'multiLine',
              name: 'description',
              label: t('setting.dataType.description'),
              disabled: !canUpdate,
              muiProps: {
                inputProps: {
                  readOnly: readOnly,
                },
              },
            },
            {
              type: 'select',
              name: 'regions',
              label: t('setting.dataType.region'),
              required: true,
              disabled: !canUpdate,
              muiProps: {
                inputProps: {
                  readOnly: readOnly,
                },
              },
              options: [
                { label: REGION.GLOBAL, value: REGION.GLOBAL },
                { label: REGION.AUSTRALIA, value: REGION.AUSTRALIA },
                { label: REGION.CANADA, value: REGION.CANADA },
                { label: REGION.EUROPEAN_UNION, value: REGION.EUROPEAN_UNION },
                { label: REGION.INDIA, value: REGION.INDIA },
                { label: REGION.UNITED_KINGDOM, value: REGION.UNITED_KINGDOM },
                { label: REGION.USA, value: REGION.USA },
              ],
            },
            {
              type: 'select',
              name: 'infoTypes',
              label: t('setting.dataType.infoTypes'),
              required: true,
              disabled: !canUpdate,
              muiProps: {
                inputProps: {
                  readOnly: readOnly,
                },
              },
              options: [
                { label: INFO_TYPES.CUSTOM, value: INFO_TYPES.CUSTOM },
                { label: INFO_TYPES.FINANCE, value: INFO_TYPES.FINANCE },
                { label: INFO_TYPES.HEALTH, value: INFO_TYPES.HEALTH },
                { label: INFO_TYPES.PRIVACY, value: INFO_TYPES.PRIVACY },
              ],
            },
            {
              type: 'select',
              name: 'algorithm',
              label: t('setting.dataType.algorithm'),
              required: true,
              disabled: !canUpdate,
              muiProps: {
                inputProps: {
                  readOnly: readOnly,
                },
              },
              options: [
                { label: ALGORITHM.KEYWORD, value: ALGORITHM.KEYWORD },
                { label: ALGORITHM.EXPRESSION, value: ALGORITHM.EXPRESSION },
              ],
            },
            {
              type: 'text',
              name: 'parameters',
              label: algorithm === ALGORITHM.KEYWORD ? t('setting.dataType.keywords') : t('setting.dataType.regex'),
              required: true,
              disabled: !canUpdate,
              muiProps: {
                inputProps: {
                  readOnly: readOnly,
                },
              },
            },
          ]}
          onChange={onChangeForm}
          hideButtons
          onSubmit={onSubmit}
        >
          <div className={classes.buttonPanel}>
            <FormButtonPanel show={hasUnsavedChanges}>
              <Button variant="outlined" onClick={handleCancel}>
                {t('general/form:commonLabels.cancel')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={[
                  localDataEntity?.name,
                  localDataEntity?.infoTypes,
                  localDataEntity?.regions,
                  localDataEntity?.algorithm,
                  localDataEntity?.parameters,
                ].some(val => isEmpty(val))}
              >
                {isAddMode ? t('general/form:commonLabels.add') : t('general/form:commonLabels.save')}
              </Button>
            </FormButtonPanel>
          </div>
        </Form>
      </ContentAreaPanel>
    </ContentArea>
  )
}

export default DataTypeEditor
