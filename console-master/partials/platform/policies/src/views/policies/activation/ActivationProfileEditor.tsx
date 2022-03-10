import { isUndefined } from 'lodash-es'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, FormControlLabel, FormGroup, makeStyles, Switch, TextField, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'

import { RichTextEditor, StartStateType } from '@ues-behaviour/rich-text-editor'
import type { ActivationProfile } from '@ues-data/platform'
import { queryPredefinedEnrollmentEmail } from '@ues-data/platform'
import { FeatureName, useFeatures, useStatefulAsyncQuery } from '@ues-data/shared'
import { useInputFormControlStyles } from '@ues/assets'
import { ContentArea, ContentAreaPanel, FormButtonPanel, Loading, useSnackbar } from '@ues/behaviours'

import ButtonGroupTabs from './ButtonGroupTabs'

const PLAIN_TEXT_FORMAT = 'plaintext'
const HTML_FORMAT = 'html'

const useStyles = makeStyles(theme => ({
  form: {
    '& .MuiFormControlLabel-root': {
      margin: theme.spacing(0.5),
    },
    '& .MuiTabs-flexContainer:not(.MuiTabs-flexContainerVertical) .MuiTab-root:first-child': {
      marginLeft: '0px',
    },
  },
  indentedGroup: {
    paddingLeft: theme.spacing(12), // 48px
  },
  spacer: {
    paddingTop: theme.spacing(10), // 40px
  },
  actionButton: {
    margin: `0 ${theme.spacing(1)}px`,
  },
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  hide: {
    display: 'none',
  },
}))

type FormData = {
  name: string
  description: string
  allowedMobilePlatformsEnabled?: boolean
  mobileIos?: boolean
  mobileAndroid?: boolean
  allowedDesktopPlatformsEnabled: boolean
  desktopWin: boolean
  desktopMac: boolean
  mobileWelcomeEmail?: string
  mobileEmailSubject?: string
  desktopWelcomeEmail: string
  desktopEmailSubject: string
}

const defaultValues: FormData = {
  name: '',
  description: '',
  allowedMobilePlatformsEnabled: true,
  mobileIos: true,
  mobileAndroid: true,
  allowedDesktopPlatformsEnabled: true,
  desktopWin: true,
  desktopMac: true,
  mobileWelcomeEmail: '',
  mobileEmailSubject: '',
  desktopWelcomeEmail: '',
  desktopEmailSubject: '',
}

type FormKey = keyof FormData
const mobileOsArray: FormKey[] = ['mobileIos', 'mobileAndroid']
const desktopOsArray: FormKey[] = ['desktopWin', 'desktopMac']

const platformFormKeyToOS = {
  mobileIos: 'iOS',
  mobileAndroid: 'Android',
  desktopWin: 'Windows',
  desktopMac: 'macOS',
}

/**
 * Get the value from the initial entity or the default value from the 'defaultVAlues' or from the localized string if one is provided
 *
 * @param initialEntity  the initial entity which can be undefined
 * @param key the property key of the entity to extrat the value from
 */
const getOrDefault = (initialEntity: ActivationProfile, key: string) => {
  return initialEntity && initialEntity[key] !== undefined ? initialEntity[key] : defaultValues[key]
}

/**
 * Maps the initial entity to the default values.  If the initial entity is undefined/null, then it will just return the default
 * values, where some default value may be coming from localized string as in the case of a predefined email text
 *
 * @param initialEntity the initial entity, which can be undefined/null
 */
const parseEntityToFormData = (initialEntity: ActivationProfile, mobileEnrollmentEnabled: boolean): FormData => {
  const mobilePlatformList = ((initialEntity && initialEntity.allowedMobilePlatformsList) ?? []).map(v => v.toLowerCase())
  const desktopPlatformList = ((initialEntity && initialEntity.allowedDesktopPlatformsList) ?? []).map(v => v.toLowerCase())

  let initialData: FormData = {
    name: getOrDefault(initialEntity, 'name'),
    description: getOrDefault(initialEntity, 'description'),
    allowedDesktopPlatformsEnabled: getOrDefault(initialEntity, 'allowedDesktopPlatformsEnabled'),
    desktopWin: initialEntity
      ? desktopPlatformList.includes(platformFormKeyToOS.desktopWin.toLowerCase())
      : defaultValues['desktopWin'],
    desktopMac: initialEntity
      ? desktopPlatformList.includes(platformFormKeyToOS.desktopMac.toLowerCase())
      : defaultValues['desktopMac'],
    desktopWelcomeEmail: getOrDefault(initialEntity, 'desktopWelcomeEmail'),
    desktopEmailSubject: getOrDefault(initialEntity, 'desktopEmailSubject'),
  }
  if (mobileEnrollmentEnabled) {
    initialData = {
      ...initialData,
      allowedMobilePlatformsEnabled: getOrDefault(initialEntity, 'allowedMobilePlatformsEnabled'),
      mobileIos: initialEntity
        ? mobilePlatformList.includes(platformFormKeyToOS.mobileIos.toLowerCase())
        : defaultValues['mobileIos'],
      mobileAndroid: initialEntity
        ? mobilePlatformList.includes(platformFormKeyToOS.mobileAndroid.toLowerCase())
        : defaultValues['mobileAndroid'],
      mobileWelcomeEmail: getOrDefault(initialEntity, 'mobileWelcomeEmail'),
      mobileEmailSubject: getOrDefault(initialEntity, 'mobileEmailSubject'),
    }
  }

  return initialData
}

const populateEntity = (
  formData: FormData,
  initialData,
  emailFormatType,
  mobileEmailEditState,
  desktopEmailEditState,
): ActivationProfile => {
  const mobilePlatformList = mobileOsArray.filter(p => formData[p]).map(k => platformFormKeyToOS[k])
  const desktopPlatformList = desktopOsArray.filter(p => formData[p]).map(k => platformFormKeyToOS[k])
  return {
    id: initialData ? initialData.id : null,
    name: formData.name,
    description: formData.description,
    isDefault: initialData ? initialData.isDefault : false,
    allowedMobilePlatformsEnabled: formData.allowedMobilePlatformsEnabled,
    allowedMobilePlatformsList: mobilePlatformList,
    allowedDesktopPlatformsEnabled: formData.allowedDesktopPlatformsEnabled,
    allowedDesktopPlatformsList: desktopPlatformList,
    mobileWelcomeEmail: formData.mobileWelcomeEmail,
    mobileEmailSubject: formData.mobileEmailSubject,
    mobileEmailEditState: mobileEmailEditState,
    mobileEmailFormat: emailFormatType,
    desktopWelcomeEmail: formData.desktopWelcomeEmail,
    desktopEmailSubject: formData.desktopEmailSubject,
    desktopEmailEditState: desktopEmailEditState,
    desktopEmailFormat: emailFormatType,
  }
}

type ActivationProfileEditorProps = {
  readOnly: boolean
  onSubmitAction: (profile: ActivationProfile) => void
  onCancelAction: () => void
  initialEntity?: ActivationProfile
  externalErrors?: any
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const ActivationProfileEditor = forwardRef((props: ActivationProfileEditorProps, ref) => {
  const { t } = useTranslation(['platform/common', 'general/form'])
  const { readOnly, onSubmitAction, onCancelAction, initialEntity, externalErrors = {} } = props
  const classes = useStyles()
  const { enqueueMessage } = useSnackbar()
  const { isEnabled } = useFeatures()
  const isMobileEnrollmentEnabled = isEnabled(FeatureName.MobileEnrollment)
  const isEmailRichTextEditorEnabled = isEnabled(FeatureName.EnrollmentProfileEmailRichTextEditor)
  const EDITOR_FORMAT = isEmailRichTextEditorEnabled ? HTML_FORMAT : PLAIN_TEXT_FORMAT
  const isAddMode = isUndefined(initialEntity)
  const isCopyMode = !isUndefined(initialEntity) && initialEntity.id === null

  const { data: mobileEmailTemplate, loading: mobileEmailTemplateLoading } = useStatefulAsyncQuery(queryPredefinedEnrollmentEmail, {
    variables: { type: 'mobile', format: EDITOR_FORMAT },
    skip: !isMobileEnrollmentEnabled || (initialEntity !== undefined && initialEntity !== null),
  })

  const { data: desktopEmailTemplate, loading: desktopEmailTemplateLoading } = useStatefulAsyncQuery(
    queryPredefinedEnrollmentEmail,
    {
      variables: { type: 'desktop', format: EDITOR_FORMAT },
      skip: initialEntity !== undefined && initialEntity !== null,
    },
  )
  const initialData = useMemo(() => parseEntityToFormData(initialEntity, isMobileEnrollmentEnabled), [
    initialEntity,
    isMobileEnrollmentEnabled,
  ])

  const [mobileReady, setMobileReady] = useState(false)
  const [desktopReady, setDesktopReady] = useState(false)

  const [mobileWelcomeEmailHtml, setMobileWelcomeEmailHtml] = useState(initialData['mobileWelcomeEmail'])
  const [desktopWelcomeEmailHtml, setDesktopWelcomeEmailHtml] = useState(initialData['desktopWelcomeEmail'])
  const [mobileEmailEditState, setMobileEmailEditState] = useState(initialEntity?.mobileEmailEditState)
  const [desktopEmailEditState, setDesktopEmailEditState] = useState(initialEntity?.desktopEmailEditState)

  const { register, setValue, getValues, handleSubmit, errors, formState, watch, reset } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: initialData,
  })

  const onSubmit = handleSubmit((value: FormData) => {
    const updatedFormValue = { ...value }
    if (isEmailRichTextEditorEnabled) {
      updatedFormValue.mobileWelcomeEmail = mobileWelcomeEmailHtml
      updatedFormValue.desktopWelcomeEmail = desktopWelcomeEmailHtml
      updatedFormValue['mobileEmailEditState'] = mobileEmailEditState
      updatedFormValue['desktopEmailEditState'] = desktopEmailEditState
    } else {
      updatedFormValue['mobileEmailEditState'] = ''
      updatedFormValue['desktopEmailEditState'] = ''
    }

    onSubmitAction(
      populateEntity(
        value,
        initialEntity,
        EDITOR_FORMAT,
        updatedFormValue['mobileEmailEditState'],
        updatedFormValue['desktopEmailEditState'],
      ),
    )
  })

  const togglePlatformsCommon = (event, theFieldName, theOSArray) => {
    const enabled = event.target.checked
    setValue(theFieldName, enabled)
    if (!enabled) {
      theOSArray.forEach(os => {
        setValue(os, false)
      })
    }
  }
  const toggleMobilePlatforms = event => {
    togglePlatformsCommon(event, 'allowedMobilePlatformsEnabled', mobileOsArray)
  }

  const toggleDesktopPlatforms = event => {
    togglePlatformsCommon(event, 'allowedDesktopPlatformsEnabled', desktopOsArray)
  }

  const defaultOnChange = event => {
    setValue(event.target.name, event.target.checked)
  }

  const getErrorText = (fieldName: string) => {
    return (errors[fieldName] && t(`activationProfile.form.${errors[fieldName].type}`)) || externalErrors[fieldName]
  }

  const textFieldClasses = useInputFormControlStyles(useTheme())

  const getTextField = (readOnly, required, fieldName, register, label, rows = 1, margin, autoFocus = false) => {
    return (
      <TextField
        id={fieldName}
        fullWidth
        margin={margin}
        size="small"
        disabled={readOnly}
        name={fieldName}
        inputRef={register({ required: required })}
        label={label}
        minRows={rows}
        multiline={rows > 1}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        error={!!errors[fieldName] || !!externalErrors[fieldName]}
        helperText={getErrorText(fieldName)}
        classes={{ root: textFieldClasses.root }}
      />
    )
  }
  const handleRichTextEditorError = lErrorMsg => {
    enqueueMessage(lErrorMsg, 'error')
  }
  const getEmailRichTextEditor = (
    welcomeEmailFieldName: string,
    welcomeEmailEditStateJSONString: string,
    welcomeEmailHtml: string,
    welcomeEmailFieldFunction,
  ) => {
    return !initialEntity && welcomeEmailHtml === undefined ? (
      <Loading />
    ) : (
      <React.Suspense fallback={<Loading />}>
        <RichTextEditor
          required
          register={register}
          readOnly={readOnly}
          fieldName={welcomeEmailFieldName}
          fieldLabel={t('activationProfile.form.message')}
          startEditorState={initialEntity ? welcomeEmailEditStateJSONString : welcomeEmailHtml}
          startEditorStateType={initialEntity ? StartStateType.DELTA_JSON : StartStateType.HTML}
          onChange={welcomeEmailFieldFunction}
          error={!!errors[welcomeEmailFieldName]}
          onError={handleRichTextEditorError}
        />
      </React.Suspense>
    )
  }

  const formValues = watch()
  const { allowedMobilePlatformsEnabled, allowedDesktopPlatformsEnabled } = formValues

  const handleMobileEditorChange = (html: string, delta, source, editor) => {
    const shouldDirtyFlag = mobileEmailEditState !== undefined
    setMobileWelcomeEmailHtml(html)
    setValue('mobileWelcomeEmail', html, { shouldDirty: shouldDirtyFlag, shouldValidate: false })
    const editorJSON = JSON.stringify(editor.getContents())
    setMobileEmailEditState(editorJSON)
  }

  const handleDesktopEditorChange = (html: string, delta, source, editor) => {
    const shouldDirtyFlag = desktopEmailEditState !== undefined
    setDesktopWelcomeEmailHtml(html)
    setValue('desktopWelcomeEmail', html, { shouldDirty: shouldDirtyFlag, shouldValidate: false })
    const editorJSON = JSON.stringify(editor.getContents())
    setDesktopEmailEditState(editorJSON)
  }

  /**
   * Function to build tab content for platform and a list of OS array
   */
  const buildTabContentCommon = (
    platformEnabledFieldName,
    platformsEnabledValue,
    platformEnabledFieldLabelLocaleKey,
    theOSArray,
    thePlatformEnabledToggleFunction,
    welcomeEmailFieldName,
    welcomeEmailFieldLabelLocaleKey,
    welcomeEmailHtml,
    welcomeEmailEditStateJSONString,
    welcomeEmailFieldFunction,
    emailSubjectFieldName,
  ) => {
    return (
      <div className={classes.container}>
        {getSwitch(
          readOnly,
          platformEnabledFieldName,
          register,
          t(platformEnabledFieldLabelLocaleKey),
          null,
          thePlatformEnabledToggleFunction,
        )}
        <FormGroup className={classes.indentedGroup}>
          {theOSArray.map(os =>
            getSwitch(
              readOnly || !platformsEnabledValue,
              os,
              register,
              t(`activationProfile.form.${os}`),
              platformEnabledFieldName,
            ),
          )}
        </FormGroup>
        <div className={classes.spacer} />
        <Typography variant="h3">{t(welcomeEmailFieldLabelLocaleKey)}</Typography>
        {getTextField(readOnly, true, emailSubjectFieldName, register, t('activationProfile.form.subject'), 1, 'normal')}
        {isEmailRichTextEditorEnabled
          ? getEmailRichTextEditor(
              welcomeEmailFieldName,
              welcomeEmailEditStateJSONString,
              welcomeEmailHtml,
              welcomeEmailFieldFunction,
            )
          : getTextField(readOnly, true, welcomeEmailFieldName, register, t('activationProfile.form.message'), 6, 'normal')}
      </div>
    )
  }

  /**
   * Builds the Mobile tab content
   */
  const buildMobileTabContent = () => {
    return buildTabContentCommon(
      'allowedMobilePlatformsEnabled',
      allowedMobilePlatformsEnabled,
      'activationProfile.form.allowedPlatforms',
      mobileOsArray,
      toggleMobilePlatforms,
      'mobileWelcomeEmail',
      'activationProfile.form.mobileWelcomeLabel',
      mobileWelcomeEmailHtml,
      mobileEmailEditState,
      handleMobileEditorChange,
      'mobileEmailSubject',
    )
  }

  /**
   * Builds the Gateway Desktop tab content
   */
  const buildDesktopTabContent = () => {
    return buildTabContentCommon(
      'allowedDesktopPlatformsEnabled',
      allowedDesktopPlatformsEnabled,
      'activationProfile.form.allowedPlatforms',
      desktopOsArray,
      toggleDesktopPlatforms,
      'desktopWelcomeEmail',
      'activationProfile.form.desktopWelcomeLabel',
      desktopWelcomeEmailHtml,
      desktopEmailEditState,
      handleDesktopEditorChange,
      'desktopEmailSubject',
    )
  }

  const getSwitch = (readOnly, fieldName, register, label, parentFieldName, onChange = defaultOnChange) => {
    const value = formValues[fieldName]
    const parentFieldValue = parentFieldName
      ? getValues(parentFieldName) === undefined
        ? initialData[parentFieldName]
        : getValues(parentFieldName)
      : null
    return (
      <FormControlLabel
        key={`${fieldName}-key`}
        disabled={readOnly}
        control={<Switch checked={value} name={fieldName} inputRef={register} onChange={onChange} />}
        label={label}
        className={!parentFieldName || parentFieldValue ? null : classes.hide}
      />
    )
  }

  useImperativeHandle(
    ref,
    () => ({
      isModified(): boolean {
        return formState.isDirty
      },
    }),
    [formState.isDirty],
  )

  useEffect(() => {
    if (!mobileEmailTemplateLoading) {
      // if mobile enrollment not enabled or if initial entity already there (not add new), then mark as 'ready'
      if (!isMobileEnrollmentEnabled || (initialEntity !== undefined && initialEntity !== null)) {
        setMobileReady(true)
      } else if (mobileEmailTemplate && mobileEmailTemplate.content) {
        setMobileWelcomeEmailHtml(mobileEmailTemplate.content)
        setMobileReady(true)
      }
    }
    if (!desktopEmailTemplateLoading) {
      // desktop ready if initial entity defined (not add new)
      if (initialEntity !== undefined && initialEntity !== null) {
        setDesktopReady(true)
      } else if (desktopEmailTemplate && desktopEmailTemplate.content) {
        setDesktopWelcomeEmailHtml(desktopEmailTemplate.content)
        setDesktopReady(true)
      }
    }
    if (mobileReady && desktopReady) {
      let copyData = null
      if (mobileEmailTemplate && mobileEmailTemplate.content) {
        copyData = copyData ? copyData : { ...getValues() }
        copyData.mobileEmailSubject = mobileEmailTemplate.subject
        copyData.mobileWelcomeEmail = mobileEmailTemplate.content
      }
      if (desktopEmailTemplate && desktopEmailTemplate.content) {
        copyData = copyData ? copyData : { ...getValues() }
        copyData.desktopEmailSubject = desktopEmailTemplate.subject
        copyData.desktopWelcomeEmail = desktopEmailTemplate.content
      }
      if (copyData) {
        reset(copyData)
      }
    }
  }, [
    initialEntity,
    isMobileEnrollmentEnabled,
    mobileEmailTemplateLoading,
    desktopEmailTemplateLoading,
    mobileEmailTemplate,
    desktopEmailTemplate,
    mobileReady,
    desktopReady,
    getValues,
    reset,
  ])

  return !mobileReady || !desktopReady ? (
    <Loading />
  ) : (
    <form className={classes.form} onSubmit={onSubmit}>
      <ContentArea>
        <ContentAreaPanel title={t('activationProfile.form.generalInfo')}>
          {getTextField(
            readOnly || (initialEntity && initialEntity.isDefault),
            true,
            'name',
            register,
            t('activationProfile.form.name'),
            1,
            'none',
            true,
          )}
          {getTextField(readOnly, false, 'description', register, t('activationProfile.form.description'), 1, 'none')}
        </ContentAreaPanel>
      </ContentArea>
      <ContentArea>
        <ContentAreaPanel title={t('activationProfile.form.settings')}>
          <ButtonGroupTabs
            tabs={
              isMobileEnrollmentEnabled
                ? [
                    {
                      label: t('activationProfile.form.mobileTab'),
                      tabContent: buildMobileTabContent(),
                      id: 0,
                    },
                    {
                      label: t('activationProfile.form.gatewayTab'),
                      tabContent: buildDesktopTabContent(),
                      id: 1,
                    },
                  ]
                : [
                    {
                      label: t('activationProfile.form.gatewayTab'),
                      tabContent: buildDesktopTabContent(),
                      id: 0,
                    },
                  ]
            }
            alwaysMount
          />
        </ContentAreaPanel>
      </ContentArea>
      <FormButtonPanel show={!readOnly && (isAddMode || isCopyMode || formState.isDirty)}>
        <Button className={classes.actionButton} variant="outlined" onClick={onCancelAction}>
          {t('general/form:commonLabels.cancel')}
        </Button>
        <Button color="primary" variant="contained" type="submit" className={classes.actionButton}>
          {isAddMode ? t('general/form:commonLabels.add') : t('general/form:commonLabels.save')}
        </Button>
      </FormButtonPanel>
    </form>
  )
})

export default ActivationProfileEditor
