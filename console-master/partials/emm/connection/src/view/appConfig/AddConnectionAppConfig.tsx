/* eslint-disable react-hooks/exhaustive-deps */
/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { Backdrop, Box, Button, Dialog, FormControlLabel, IconButton, Switch, TextField, Typography } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'

import type { ForbiddenResponse, GroupResponse } from '@ues-data/emm'
import { ConnectionApi } from '@ues-data/emm'
import { Permission, usePrevious, useStatefulReduxMutation } from '@ues-data/shared'
import { BasicAddRound, BasicDelete, HelpLinks } from '@ues/assets'
import type { TableColumn } from '@ues/behaviours'
import {
  BasicTable,
  ContentArea,
  ContentAreaPanel,
  FormButtonPanel,
  PageTitlePanel,
  SecuredContent,
  TableProvider,
  useSnackbar,
} from '@ues/behaviours'

import { appConfigMultiStatusErrorMessage, createLoginPopup } from '../common/Util'
import makeStyles from './AddConnectionAppConfigStyle'
import type { AssignmentItem } from './GroupAssignmentDialogContent'
import { useGroupAssignmentDialog } from './useGroupAssignmentDialog'

// eslint-disable-next-line sonarjs/cognitive-complexity
const AddConnectionAppConfig = memo(() => {
  const ERROR_MESSAGE = 'emm.validation.emptyField'
  const ERROR_TEMPLATE = { isError: false, message: '' }
  const { t } = useTranslation(['emm/connection'])
  const classes = makeStyles()
  const navigate = useNavigate()
  const { enqueueMessage } = useSnackbar()
  const location = useLocation()
  const [filteredAssignableAndroidGroups, setFilteredAssignableAndroidGroups] = useState([])
  const [filteredAssignableIOSGroups, setFilteredAssignableIOSGroups] = useState([])
  const [appConfigDetails, setAppConfigDetails] = useState({
    androidAppName: 'BlackBerry Protect for Android',
    androidTargetedApp: 'BlackBerry Protect',
    iosAppName: 'BlackBerry Protect for iOS',
    iosTargetedApp: 'BlackBerry Protect',
  })
  const [androidSearchResponse, setAndroidSearchResponse] = useState(null)
  const [iosSearchResponse, setIOSSearchResponse] = useState(null)

  const [error, setError] = useState({
    androidAppName: ERROR_TEMPLATE,
    androidTargetedApp: ERROR_TEMPLATE,
    iosAppName: ERROR_TEMPLATE,
    iosTargetedApp: ERROR_TEMPLATE,
  })

  enum PLATFORM_TYPE {
    ANDROID = 'Android',
    IOS = 'iOS',
  }

  const ALL_USER_GROUP_ID = 'acacacac-9df4-4c7d-9d50-4ef0226f57a9'
  const [androidAssignedGroups, setAndroidAssignedGroups] = useState<AssignmentItem[]>([])
  const [iosAssignedGroups, setIOSAssignedGroups] = useState([])

  const [checkBoxChecked, setCheckBoxChecked] = useState({
    iosCheckBox: {
      value: true,
      devicePlatform: PLATFORM_TYPE.IOS,
      fields: ['iosAppName', 'iosTargetedApp'],
      groups: [],
      assignAllGroups: false,
    },
    androidCheckBox: {
      value: true,
      devicePlatform: PLATFORM_TYPE.ANDROID,
      fields: ['androidAppName', 'androidTargetedApp'],
      groups: [],
      assignAllGroups: false,
    },
  })

  const [groupCheckBoxChecked, setGroupCheckBoxChecked] = useState({
    iosGroupCheckBox: {
      value: false,
      devicePlatform: PLATFORM_TYPE.IOS,
      fields: ['IOSTransferList'],
    },
    androidGroupCheckBox: {
      value: false,
      devicePlatform: PLATFORM_TYPE.ANDROID,
      fields: ['AndroidTransferList'],
    },
  })

  const [checkCount, setCheckCount] = useState(2)
  const [redirect] = useState(false)
  const [authCode, setAuthCode] = useState(null)
  const [authConnConfig, setAuthConnConfig] = useState(null)
  const [appConfigResponse, setAppConfigResponse] = useState({
    IOS: { success: false, message: '' },
    ANDROID: { success: false, message: '' },
  })
  const [addAction, addState] = useStatefulReduxMutation(ConnectionApi.mutationAddAppConfig, {})
  const prevAddState = usePrevious(addState)

  function onSubmit() {
    if (isValid()) {
      createAppConfig(undefined)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const createAppConfig = code => {
    let newAppConfig = {
      appConfigurationPolicyInformation: [],
    }
    Object.entries(checkBoxChecked)
    if (checkBoxChecked.androidCheckBox.value && !code && authConnConfig) {
      createPopup(authConnConfig)
    } else {
      Object.entries(checkBoxChecked)
        .filter(checkbox => checkbox[1].value === true)
        .forEach(checkbox => {
          if (
            checkbox[1].devicePlatform === PLATFORM_TYPE.IOS &&
            checkBoxChecked.androidCheckBox.value &&
            !authConnConfig &&
            code
          ) {
            newAppConfig = {
              ...newAppConfig,
            }
          } else {
            newAppConfig = {
              ...newAppConfig,
              appConfigurationPolicyInformation: [
                ...newAppConfig.appConfigurationPolicyInformation,
                {
                  devicePlatform: checkbox[1].devicePlatform,
                  appConfigdisplayName: appConfigDetails[checkbox[1].devicePlatform.toLowerCase() + 'AppName'],
                  managedApp: {
                    appName: appConfigDetails[checkbox[1].devicePlatform.toLowerCase() + 'TargetedApp'],
                  },
                  groups: {
                    includedGroups: checkbox[1].assignAllGroups ? [ALL_USER_GROUP_ID] : checkbox[1].groups.map(({ id }) => id),
                    excludedGroups: [],
                  },
                  authCode: checkbox[1].devicePlatform === PLATFORM_TYPE.ANDROID ? code : undefined,
                },
              ],
            }
          }
        })
      addAction({ appConfigRequest: newAppConfig, type: 'INTUNE' })
    }
  }

  const processLoginResponse = loginResponseParams => {
    const urlParams = new URLSearchParams(loginResponseParams)
    if (!urlParams.get('error') && urlParams.get('code')) {
      setAuthCode(urlParams.get('code'))
      createAppConfig(urlParams.get('code'))
    } else if (urlParams.get('error')) {
      const error = t('emm.intune.add.error.setAppConfigErrorWithCause', {
        cause: t('emm.intune.add.error.azureLoginFailure'),
      })
      enqueueMessage(error, 'error')
      console.error(urlParams.get('error') + ' - ' + urlParams.get('error_description'))
    } else {
      enqueueMessage(t('emm.intune.add.error.setAppConfigError'), 'error')
      console.error(t('emm.intune.add.error.azureLoginFailure'))
    }
  }
  const createPopup = (forbiddenResponse: ForbiddenResponse) => {
    createLoginPopup(forbiddenResponse, t('emm.intune.add.azureUserLogin'), false)
    window.onstorage = e => {
      if (e.key === 'userLogin' && window.localStorage.getItem('userLogin')) {
        processLoginResponse(window.localStorage.getItem('userLogin'))
      }
    }
  }

  useEffect(() => {
    if (ConnectionApi.isTaskResolved(addState, prevAddState)) {
      setAuthCode(null)
      if (addState.error) {
        try {
          const errorPayload = addState.error

          const appConfigResponseMap = appConfigMultiStatusErrorMessage(errorPayload, t, enqueueMessage)
          if (appConfigResponseMap && appConfigResponseMap.ANDROID.forbiddenResponse) {
            if (appConfigResponseMap.IOS.value) {
              setAppConfigResponse({
                ...appConfigResponse,
                IOS: {
                  success: appConfigResponseMap.IOS.success,
                  message: appConfigResponseMap.IOS.message,
                },
              })
            }
            setAuthConnConfig(appConfigResponseMap.ANDROID.forbiddenResponse)
            createPopup(appConfigResponseMap.ANDROID.forbiddenResponse)
          } else if (appConfigResponseMap && appConfigResponseMap.ANDROID.value && appConfigResponseMap.IOS.value) {
            enqueueMessage(appConfigResponseMap.ANDROID.message, appConfigResponseMap.ANDROID.success ? 'success' : 'error')
            enqueueMessage(appConfigResponseMap.IOS.message, appConfigResponseMap.IOS.success ? 'success' : 'error')
          } else if (appConfigResponseMap && appConfigResponseMap.ANDROID.value) {
            if (appConfigResponse.IOS.message && appConfigResponse.IOS.message.trim().length > 0) {
              enqueueMessage(appConfigResponse.IOS.message, appConfigResponse.IOS.success ? 'success' : 'error')
            }
            enqueueMessage(appConfigResponseMap.ANDROID.message, 'error')
          } else if (appConfigResponseMap && appConfigResponseMap.IOS.value) {
            if (appConfigResponse.ANDROID.message && appConfigResponse.ANDROID.message.trim().length > 0) {
              enqueueMessage(appConfigResponse.ANDROID.message, appConfigResponse.ANDROID.success ? 'success' : 'error')
            }
            enqueueMessage(appConfigResponseMap.IOS.message, 'error')
          }
          if (appConfigResponseMap && !appConfigResponseMap.ANDROID.forbiddenResponse) {
            emptyAppConfigResponse()
          }
        } catch (err) {
          enqueueMessage(t('server.error.default'), 'error')
          emptyAppConfigResponse()
        }
      } else {
        if (
          (appConfigResponse.ANDROID.success &&
            appConfigResponse.ANDROID.message &&
            appConfigResponse.ANDROID.message.trim().length > 0) ||
          (appConfigResponse.IOS.success && appConfigResponse.IOS.message && appConfigResponse.IOS.message.trim().length > 0)
        ) {
          onAppConfigSucceededCompletely()
        } else if (
          !appConfigResponse.ANDROID.success &&
          appConfigResponse.ANDROID.message &&
          appConfigResponse.ANDROID.message.trim().length > 0
        ) {
          enqueueMessage(appConfigResponse.ANDROID.message, 'error')
          enqueueMessage(t('emm.appConfig.multiStatusSuccess', { DEVICE_TYPE: 'IOS' }), 'success')
        } else if (
          !appConfigResponse.IOS.success &&
          appConfigResponse.IOS.message &&
          appConfigResponse.IOS.message.trim().length > 0
        ) {
          enqueueMessage(appConfigResponse.IOS.message, 'error')
          enqueueMessage(t('emm.appConfig.multiStatusSuccess', { DEVICE_TYPE: 'ANDROID' }), 'success')
        } else {
          onAppConfigSucceededCompletely()
        }
        emptyAppConfigResponse()
      }
    }
  }, [addState, prevAddState, enqueueMessage, t])

  function emptyAppConfigResponse() {
    setAppConfigResponse({
      IOS: { success: false, message: '' },
      ANDROID: { success: false, message: '' },
    })
  }

  function onAppConfigSucceededCompletely() {
    enqueueMessage(t('emm.appConfig.success'), 'success')
    navigate(window.location.hash.substring(1, window.location.hash.lastIndexOf('/emm/')) + '/emm')
  }

  const isEmpty = value => {
    return typeof value !== 'undefined' && value.length > 0
  }

  function isValid() {
    let validForm = true
    const fields = [
      {
        id: 'androidAppName',
        value: appConfigDetails.androidAppName,
        enabled: checkBoxChecked.androidCheckBox.value,
        validate: [{ validator: isEmpty, errorKey: ERROR_MESSAGE }],
      },
      {
        id: 'androidTargetedApp',
        value: appConfigDetails.androidTargetedApp,
        enabled: checkBoxChecked.androidCheckBox.value,
        validate: [{ validator: isEmpty, errorKey: ERROR_MESSAGE }],
      },
      {
        id: 'iosAppName',
        value: appConfigDetails.iosAppName,
        enabled: checkBoxChecked.iosCheckBox.value,
        validate: [{ validator: isEmpty, errorKey: ERROR_MESSAGE }],
      },
      {
        id: 'iosTargetedApp',
        value: appConfigDetails.iosTargetedApp,
        enabled: checkBoxChecked.iosCheckBox.value,
        validate: [{ validator: isEmpty, errorKey: ERROR_MESSAGE }],
      },
    ]

    const validateField = async field => {
      let valid = true

      for (let i = 0; i < field.validate.length && valid; i++) {
        valid = field.validate[i].validator(field.value)

        if (!valid) {
          setError(prevState => ({
            ...prevState,
            [field.id]: {
              isError: true,
              message: t(field.validate[i].errorKey),
            },
          }))
        }
        validForm = validForm && valid
      }
      return validForm
    }

    const enabledFields = fields.filter(field => field.enabled === true)
    enabledFields.forEach(validateField)
    return validForm
  }

  const handleChange = e => {
    const { id, value } = e.target
    setAppConfigDetails(prevState => ({
      ...prevState,
      [id]: value,
    }))

    setError(prevState => ({
      ...prevState,
      [id]: ERROR_TEMPLATE,
    }))
  }

  const handleCheckBoxChange = event => {
    if (event.target.checked) {
      setCheckCount(prevState => prevState + 1)
      setCheckBoxChecked({
        ...checkBoxChecked,
        [event.target.name]: { ...checkBoxChecked[event.target.name], value: event.target.checked },
      })
    } else if (checkCount - 1 > 0) {
      setCheckCount(prevState => prevState - 1)
      setCheckBoxChecked({
        ...checkBoxChecked,
        [event.target.name]: { ...checkBoxChecked[event.target.name], value: event.target.checked },
      })
    }
  }

  const handleAllGroupsSwitch = event => {
    if (event.target.name === 'iosGroupCheckBox') {
      checkBoxChecked.iosCheckBox.assignAllGroups = event.target.checked
    } else if (event.target.name === 'androidGroupCheckBox') {
      checkBoxChecked.androidCheckBox.assignAllGroups = event.target.checked
    }

    setGroupCheckBoxChecked({
      ...groupCheckBoxChecked,
      [event.target.name]: { ...groupCheckBoxChecked[event.target.name], value: event.target.checked },
    })
  }

  const goBack = () => {
    location.state && location.state['prevPath'] === 'AddIntuneConnection' ? navigate(-2) : navigate(-1)
  }

  if (redirect) {
    goBack()
  }

  const checkAction = () => {
    if (window.location.href.indexOf('?') === -1) {
      return <div></div>
    }
    const queryParams = window.location.href.substring(window.location.href.indexOf('?'))
    if (queryParams.indexOf('code') > -1 || queryParams.indexOf('error') > -1) {
      window.localStorage.setItem('userLogin', queryParams)
      window.close()
    }
    return <div></div>
  }

  useEffect(() => {
    if (checkBoxChecked.androidCheckBox) checkBoxChecked.androidCheckBox.groups = androidAssignedGroups
  }, [androidAssignedGroups, checkBoxChecked.androidCheckBox])

  useEffect(() => {
    if (checkBoxChecked.iosCheckBox) checkBoxChecked.iosCheckBox.groups = iosAssignedGroups
  }, [checkBoxChecked.iosCheckBox, iosAssignedGroups])

  const deleteGroup = (groupId, type) => {
    if (type === PLATFORM_TYPE.ANDROID) {
      setAndroidAssignedGroups(androidAssignedGroups.filter(group => group.id !== groupId))
    } else {
      setIOSAssignedGroups(iosAssignedGroups.filter(group => group.id !== groupId))
    }
  }

  const renderGroup = rowData => {
    return <Typography variant="body2">{rowData.displayName}</Typography>
  }

  const renderDeleteButton = (rowData, type) => {
    return (
      <IconButton size="small">
        <BasicDelete key={rowData.groupId} onClick={e => deleteGroup(rowData.id, type)} />
      </IconButton>
    )
  }

  const renderColumnHeading = (type: string) => {
    return (
      <IconButton size="small" className={classes.icon} onClick={() => handleAddClick(type)}>
        <BasicAddRound />
      </IconButton>
    )
  }

  const handleAddClick = (type: string) => {
    if (type === PLATFORM_TYPE.ANDROID) {
      setAndroidDialogId(Symbol('assignmentId'))
    } else if (type === PLATFORM_TYPE.IOS) {
      setIOSDialogId(Symbol('assignmentId'))
    }
  }

  const idFunction = rowData => rowData.id

  // Android group add feature
  const ANDROID_COLUMNS: TableColumn[] = useMemo(
    () => [
      {
        label: t('emm.appConfig.table.group'),
        dataKey: 'groupName',
        width: 40,
        renderCell: data => renderGroup(data),
        persistent: false,
        sortable: false,
      },
      {
        renderLabel: () => renderColumnHeading(PLATFORM_TYPE.ANDROID),
        dataKey: 'action',
        renderCell: data => renderDeleteButton(data, PLATFORM_TYPE.ANDROID),
        styles: { width: 20 },
      },
    ],
    [renderColumnHeading, renderDeleteButton, t],
  )

  useEffect(() => {
    if (androidSearchResponse) {
      const response = androidSearchResponse as GroupResponse
      setFilteredAssignableAndroidGroups(
        response.groups.map(group => ({ ...group, disabled: androidAssignedGroups.some(({ id }) => id === group.id) })),
      )
    } else {
      setFilteredAssignableAndroidGroups([])
    }
  }, [androidSearchResponse, androidAssignedGroups])

  const handleAndroidGroupSearch = (searchResponse: GroupResponse) => {
    setAndroidSearchResponse(searchResponse)
  }

  const { dialogOptions: androidDialogOptions, setDialogId: setAndroidDialogId } = useGroupAssignmentDialog({
    data: filteredAssignableAndroidGroups,
    loading: false,
    handleSearch: handleAndroidGroupSearch,
    submitAssignment: (selectedGroups: AssignmentItem[]) => {
      setAndroidAssignedGroups([...androidAssignedGroups, ...selectedGroups])
      checkBoxChecked.androidCheckBox.groups = androidAssignedGroups
    },
  })

  // IOS group search and add feature
  const IOS_COLUMNS: TableColumn[] = useMemo(
    () => [
      {
        label: t('emm.appConfig.table.group'),
        dataKey: 'groupName',
        width: 40,
        renderCell: data => renderGroup(data),
        icon: true,
        persistent: false,
        sortable: false,
      },
      {
        renderLabel: () => renderColumnHeading(PLATFORM_TYPE.IOS),
        dataKey: 'action',
        renderCell: data => renderDeleteButton(data, PLATFORM_TYPE.IOS),
        icon: true,
        align: 'right',
        styles: { width: 20 },
      },
    ],
    [renderColumnHeading, renderDeleteButton, t],
  )

  useEffect(() => {
    if (iosSearchResponse) {
      const response = iosSearchResponse as GroupResponse
      setFilteredAssignableIOSGroups(response.groups.map(g => ({ ...g, disabled: iosAssignedGroups.some(sg => sg.id === g.id) })))
    } else {
      setFilteredAssignableIOSGroups([])
    }
  }, [iosSearchResponse, iosAssignedGroups])

  const handleIOSGroupSearch = (searchResponse: GroupResponse) => {
    setIOSSearchResponse(searchResponse)
  }

  const { dialogOptions: iosDialogOptions, setDialogId: setIOSDialogId } = useGroupAssignmentDialog({
    data: filteredAssignableIOSGroups,
    loading: false,
    handleSearch: handleIOSGroupSearch,
    submitAssignment: (selectedGroups: AssignmentItem[]) => {
      setIOSAssignedGroups([...iosAssignedGroups, ...selectedGroups])
      checkBoxChecked.iosCheckBox.groups = iosAssignedGroups
    },
  })

  return (
    <>
      <div>{checkAction()}</div>
      <Box className={classes.outerContainer}>
        <PageTitlePanel title={t('emm.appConfig.title')} goBack={goBack} helpId={HelpLinks.EmmAppConfig} />
        <ContentArea>
          <div className={classes.cardContainer}>
            <SecuredContent
              requiredPermissions={
                new Set([
                  Permission.ECS_MDM_READ,
                  location.state && location.state['prevPath'] === 'AddIntuneConnection'
                    ? Permission.ECS_MDM_CREATE
                    : Permission.ECS_MDM_UPDATE,
                ])
              }
            >
              <ContentAreaPanel title={t('emm.appConfig.heading')}>
                <Box display="flex" flexDirection="column">
                  <Box>
                    <Typography paragraph align="left" variant="body2" className={classes.descriptionLabel}>
                      {t('emm.appConfig.description')}
                    </Typography>
                  </Box>
                  <Box className={classes.settingContainer}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={checkBoxChecked.androidCheckBox.value}
                          onChange={handleCheckBoxChange}
                          name="androidCheckBox"
                        />
                      }
                      label={t('emm.appConfig.androidCheckBoxLabel')}
                      className={classes.toggleSwitch}
                    />
                    {checkBoxChecked.androidCheckBox.value ? (
                      <>
                        <div>
                          <TextField
                            className={classes.input}
                            id="androidAppName"
                            required
                            label={t('emm.appConfig.androidAppName')}
                            fullWidth
                            margin="normal"
                            name="androidAppName"
                            onChange={handleChange}
                            value={appConfigDetails.androidAppName}
                            size="small"
                            error={error.androidAppName.isError}
                            helperText={error.androidAppName.message}
                          />
                          <TextField
                            className={classes.input}
                            id="androidTargetedApp"
                            required
                            label={t('emm.appConfig.androidTargetedApp')}
                            fullWidth
                            margin="normal"
                            name="androidTargetedApp"
                            onChange={handleChange}
                            value={appConfigDetails.androidTargetedApp}
                            size="small"
                            error={error.androidTargetedApp.isError}
                            helperText={error.androidTargetedApp.message}
                          />
                        </div>
                        <div>
                          <Typography variant="h3" className={classes.groupLabel}>
                            {t('emm.appConfig.groupAssignmentTitle')}
                          </Typography>
                          <FormControlLabel
                            className={classes.groupSwitch}
                            control={
                              <Switch
                                checked={groupCheckBoxChecked.androidGroupCheckBox.value}
                                onChange={handleAllGroupsSwitch}
                                name="androidGroupCheckBox"
                              />
                            }
                            label={t('emm.appConfig.groupSwitchTitle')}
                          />
                        </div>
                        {!groupCheckBoxChecked.androidGroupCheckBox.value ? (
                          <div id={'AndroidTransferList'} className={`${classes.transferListIndent} ${classes.separatorTop}`}>
                            <TableProvider basicProps={{ columns: ANDROID_COLUMNS, idFunction: idFunction, embedded: true }}>
                              <BasicTable noDataPlaceholder={t('noItem')} data={androidAssignedGroups} />
                            </TableProvider>
                            <Dialog fullWidth={true} {...androidDialogOptions} />
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </Box>
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch checked={checkBoxChecked.iosCheckBox.value} onChange={handleCheckBoxChange} name="iosCheckBox" />
                      }
                      label={t('emm.appConfig.iosCheckBoxLabel')}
                      className={classes.toggleSwitch}
                    />
                    {checkBoxChecked.iosCheckBox.value ? (
                      <>
                        <div>
                          <TextField
                            className={classes.input}
                            id="iosAppName"
                            required
                            label={t('emm.appConfig.iosAppName')}
                            fullWidth
                            margin="normal"
                            name="iosAppName"
                            onChange={handleChange}
                            value={appConfigDetails.iosAppName}
                            size="small"
                            error={error.iosAppName.isError}
                            helperText={error.iosAppName.message}
                          />
                          <TextField
                            className={classes.input}
                            id="iosTargetedApp"
                            required
                            label={t('emm.appConfig.iosTargetedApp')}
                            fullWidth
                            margin="normal"
                            name="iosTargetedApp"
                            onChange={handleChange}
                            value={appConfigDetails.iosTargetedApp}
                            size="small"
                            error={error.iosTargetedApp.isError}
                            helperText={error.iosTargetedApp.message}
                          />
                        </div>
                        <div>
                          <Typography variant="h3" className={classes.groupLabel}>
                            {t('emm.appConfig.groupAssignmentTitle')}
                          </Typography>
                          <FormControlLabel
                            className={classes.groupSwitch}
                            control={
                              <Switch
                                checked={groupCheckBoxChecked.iosGroupCheckBox.value}
                                onChange={handleAllGroupsSwitch}
                                name="iosGroupCheckBox"
                              />
                            }
                            label={t('emm.appConfig.groupSwitchTitle')}
                          />
                        </div>
                        {!groupCheckBoxChecked.iosGroupCheckBox.value ? (
                          <div id={'IOSTransferList'} className={`${classes.transferListIndent} ${classes.separatorTop}`}>
                            <TableProvider basicProps={{ columns: IOS_COLUMNS, idFunction: idFunction, embedded: true }}>
                              <BasicTable noDataPlaceholder={t('noItem')} data={iosAssignedGroups} />
                            </TableProvider>
                            <Dialog fullWidth={true} {...iosDialogOptions} />
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </Box>
                </Box>
              </ContentAreaPanel>
              <FormButtonPanel show={true}>
                <Button variant="outlined" onClick={goBack}>
                  {t('button.cancel')}
                </Button>
                <Button color="primary" variant="contained" onClick={onSubmit}>
                  {t('button.save')}
                </Button>
              </FormButtonPanel>
            </SecuredContent>
          </div>
        </ContentArea>
      </Box>
      <Backdrop className={classes.backdrop} open={addState.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
})

export default AddConnectionAppConfig
