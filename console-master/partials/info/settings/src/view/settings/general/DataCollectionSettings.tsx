import { Formik } from 'formik'
import _ from 'lodash-es'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import * as Yup from 'yup'

import { usePrevious } from '@ues-behaviour/react'
import type { TenantConfigItem } from '@ues-data/dlp'
import { CONFIG_KEY, tenantConfigArrOrdered, TenantSettings } from '@ues-data/dlp'
import { Permission, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { ContentArea, ContentAreaPanel, Loading, SecuredContentBoundary, useSecuredContent } from '@ues/behaviours'

import DataCollectionSettingsForm from './forms/DataCollectionSettingsForm'
import WhitelistEmailForm from './forms/WhitelistEmailForm'
import makeStyles from './styles'

const DataCollectionSettings: React.FC = () => {
  useSecuredContent(Permission.BIP_SETTINGS_READ)
  const classes = makeStyles()
  const { pathname } = useLocation()

  // TODO: add error handling
  const { error, loading, data, refetch, fetchMore } = useStatefulReduxQuery(TenantSettings.fetchConfigs)
  const [updateConfigs, updateConfigsTask] = useStatefulReduxMutation(TenantSettings.mutationUpdateConfigs)
  const [updateFileSettings, updateFileSettingsTask] = useStatefulReduxMutation(TenantSettings.mutationUpdatFileSettings)

  const key2value = []
  if (!loading && data) {
    // convert server response to object
    const serverKeys2Value = data.reduce((acc, { key, value }) => ((acc[key] = value), acc), {})

    // convert local ordered key/value array to array of configs
    const localKeys2Value = tenantConfigArrOrdered.map(v => {
      return { [v.key]: v.value }
    })
    // ordering data according to UI design and apply default values
    for (const item of localKeys2Value) {
      const key = Object.keys(item)[0]
      let value = Object.values(item)[0]
      if (key in serverKeys2Value) {
        const serverValue = serverKeys2Value[key]
        // note: server response can contains keys without values or empty values are also possible
        if (!_.isNil(serverValue) && !_.isEmpty(serverValue)) value = serverValue
      }
      key2value.push({ key: key, value: value })
    }
  }

  const updateConfigsTaskPrev = usePrevious(updateConfigsTask)
  useEffect(() => {
    if (!updateConfigsTask.loading && updateConfigsTaskPrev.loading && updateConfigsTaskPrev.error) {
      // TODO: add snackbar for errors
      console.log('submit failed')
    } else if (!updateConfigsTask.loading && updateConfigsTaskPrev.loading) {
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateConfigsTask])

  // TODO: add handling for file settings update
  // TODO: add handling for file settings update errors

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Formik
          initialValues={key2value}
          onSubmit={async values => {
            const serverSettings = values.filter((i: TenantConfigItem) => i.key !== CONFIG_KEY.DATA_RETENTION_STOREDAYS)
            const fileSettings = values.filter((i: TenantConfigItem) => i.key === CONFIG_KEY.DATA_RETENTION_STOREDAYS)
            await updateConfigs({ data: serverSettings })
            await updateFileSettings({ data: fileSettings })
            refetch()
          }}
          validationSchema={Yup.array().of(
            Yup.object().shape({
              key: Yup.string(),
            }),
          )}
        >
          {({ handleChange, handleSubmit, handleBlur, setFieldValue, values, touched, errors, dirty }) => {
            return pathname === '/settings/whitelisting' ? (
              <WhitelistEmailForm
                values={values}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                dirty={dirty}
                errors={errors}
              />
            ) : (
              <DataCollectionSettingsForm
                values={values}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                touched={touched}
                dirty={dirty}
                errors={errors}
              />
            )
          }}
        </Formik>
      )}
    </>
  )
}

export default DataCollectionSettings
