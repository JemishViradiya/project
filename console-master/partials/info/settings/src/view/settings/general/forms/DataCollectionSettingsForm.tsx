import { Field, Form } from 'formik'
import { isEmpty } from 'lodash-es'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import DateFnsUtils from '@date-io/date-fns'
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base'

import { makeStyles, MenuItem, Switch, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputAdornment from '@material-ui/core/InputAdornment'
import type { Theme } from '@material-ui/core/styles'
import { createTheme, ThemeProvider, useTheme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

import { CONFIG_KEY } from '@ues-data/dlp'
import { spacing_24px } from '@ues-info/shared'
import {
  BasicTime,
  makeCheckboxHelperTextStyles,
  useCheckboxLabelStyles,
  useInputFormControlStyles,
  useSwitchHelperTextStyles,
  useSwitchLabelStyles,
} from '@ues/assets'
import { FormButtonPanel, Select } from '@ues/behaviours'

import { useDlpSettingsPermissions } from '../../../useDlpSettingsPermissions'

const useStyles = makeStyles(theme => ({
  transferWindowTime: {
    marginBottom: theme.spacing(0),
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    paddingBottom: theme.spacing(4),
  },
  subTitle: {
    marginTop: theme.spacing(2),
  },
  helperText: {
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(0),
  },
  helperTextCheckbox: {
    marginLeft: theme.spacing(8),
  },
  formControlLabel: {
    marginLeft: theme.spacing(2.5),
  },
  uploadDirectlyToS3: {
    marginBottom: theme.spacing(0),
  },
  timePickers: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2.5),
    marginRight: theme.spacing(4),
    width: theme.spacing(40),

    '& button': {
      backgroundColor: 'transparent !important',
    },
  },
}))

interface DataCollectionSettingsFormProps {
  values: any[]
  handleChange: any
  handleSubmit: any
  handleBlur: any
  setFieldValue: any
  touched: any
  dirty: any
  errors: any
}

const DataCollectionSettingsForm: React.FC<DataCollectionSettingsFormProps> = ({
  values,
  handleChange,
  handleSubmit,
  handleBlur,
  setFieldValue,
  touched,
  dirty,
  errors,
}) => {
  const { canUpdate } = useDlpSettingsPermissions()
  const { t } = useTranslation(['dlp/common'])
  const classes = useStyles()
  const theme = useTheme()
  const textFieldClasses = useInputFormControlStyles(theme)
  const switchLabelClasses = useSwitchLabelStyles(theme)
  const switchHelperTextClasses = useSwitchHelperTextStyles(theme)
  const checkboxLabelClasses = useCheckboxLabelStyles(theme)
  const checkboxHelperTextClasses = makeStyles({ ...makeCheckboxHelperTextStyles(theme, 'medium') })

  const getSelectedValue = (values, keyValue) => values?.find(config => config.key === keyValue)?.value

  const [fileUploadMethod, setFileUploadMethod] = useState(getSelectedValue(values, CONFIG_KEY.UPLOAD_DIRECTLY_TO_S3))
  const [dataRetentionStoreDays, setDataRetentionStoreDays] = useState(
    getSelectedValue(values, CONFIG_KEY.DATA_RETENTION_STOREDAYS),
  )

  useEffect(() => {
    setFileUploadMethod(getSelectedValue(values, CONFIG_KEY.UPLOAD_DIRECTLY_TO_S3))
    setDataRetentionStoreDays(getSelectedValue(values, CONFIG_KEY.DATA_RETENTION_STOREDAYS))
  }, [values])

  const isTrue = value => {
    return value === true || value === 'true'
  }

  const [collectFullCopyOfTheData, setCollectFullCopyOfTheData] = useState(
    isTrue(values?.filter(config => config.key === CONFIG_KEY.UPLOAD_EVIDENCE_FILE)[0]?.value),
  )

  const configTo = {
    index: values?.findIndex(config => config.key === CONFIG_KEY.TRANSFER_WINDOW_END_TIME),
    config: values?.filter(config => config.key === CONFIG_KEY.TRANSFER_WINDOW_END_TIME)[0],
  }

  const generalDataCollectionSettings = 'setting.general.dataCollectionSettings'

  const getTranlationKey = ({ key, suffix, prefix = generalDataCollectionSettings }) =>
    `${prefix}.${key.replace(/\./g, '_')}.${suffix}`

  // form control for switch
  const FormControlSwitch = ({ config, control }) => {
    const key = config.key
    return (
      <FormControl fullWidth disabled={!canUpdate}>
        <FormControlLabel
          control={control}
          label={t(getTranlationKey({ key: key, suffix: 'title' }))}
          classes={switchLabelClasses}
        />
        <FormHelperText classes={switchHelperTextClasses}>
          {t(getTranlationKey({ key: key, suffix: 'description' }))}
        </FormHelperText>
      </FormControl>
    )
  }

  // form control for checkbox
  const FormControlCheckbox = ({ config, control }) => {
    const key = config.key
    return (
      <FormControl fullWidth disabled={!canUpdate}>
        <FormControlLabel
          control={control}
          label={t(getTranlationKey({ key: key, suffix: 'title' }))}
          classes={checkboxLabelClasses}
        />
        <FormHelperText classes={checkboxHelperTextClasses()} className={classes.helperTextCheckbox}>
          {t(getTranlationKey({ key: key, suffix: 'description' }))}
        </FormHelperText>
      </FormControl>
    )
  }

  const FormControlSelect = ({ config, index, setFieldValue }) => {
    const key = config.key
    const handleOnChange = e => {
      setFileUploadMethod(e.target.value)
      setFieldValue(`${index}.value`, e.target.value)
    }

    return (
      <FormControl className={classes.uploadDirectlyToS3} variant="filled" fullWidth>
        <Typography variant="h3" className={classes.title}>
          {t('setting.general.dataCollectionSettings.ui_tenant_setting_uploadDirectlyToS3.heading')}
        </Typography>
        <Select
          label={t(getTranlationKey({ key: key, suffix: 'title' }))}
          name="fileUploadMethod"
          size="small"
          variant="filled"
          onChange={handleOnChange}
          value={fileUploadMethod}
          helperText={t(getTranlationKey({ key: key, suffix: 'description' }))}
          disabled={!canUpdate}
        >
          <MenuItem value="true">{t(getTranlationKey({ key: key, suffix: 's3_cloud_method' }))}</MenuItem>
          <MenuItem value="false">{t(getTranlationKey({ key: key, suffix: 'local_dlp_file_service_method' }))}</MenuItem>
        </Select>
      </FormControl>
    )
  }
  const DataRetentionSelect = ({ config, index, setFieldValue }) => {
    const key = config.key
    const handleOnChange = e => {
      setDataRetentionStoreDays(e.target.value)
      setFieldValue(`${index}.value`, e.target.value)
    }
    return (
      <FormControl variant="filled" fullWidth>
        <Typography variant="h3" className={classes.title}>
          {t('setting.general.dataCollectionSettings.ui_file_setting_evidenceFileRetentionPeriod.heading')}
        </Typography>
        <Select
          label={t(getTranlationKey({ key: key, suffix: 'title' }))}
          name="dataRetentionStoreDays"
          size="small"
          variant="filled"
          onChange={handleOnChange}
          value={dataRetentionStoreDays}
          disabled={!canUpdate}
          helperText={t(getTranlationKey({ key: key, suffix: 'description' }))}
        >
          <MenuItem value="30">{t(getTranlationKey({ key: key, suffix: '30_days' }))}</MenuItem>
          <MenuItem value="60">{t(getTranlationKey({ key: key, suffix: '60_days' }))}</MenuItem>
          <MenuItem value="90">{t(getTranlationKey({ key: key, suffix: '90_days' }))}</MenuItem>
        </Select>
      </FormControl>
    )
  }
  const expectedTimeValue = /^\d{2}$/
  const hasErrorTimePicker = (values: any) => {
    if (values.some((el: any) => el === null)) return true
    return values
      ?.map((time: string) => {
        const splitValueOnVerif = time.split(':')
        return expectedTimeValue.test(splitValueOnVerif[0]) && expectedTimeValue.test(splitValueOnVerif[1])
      })
      ?.some((isValid: boolean) => !isValid)
  }

  // time picker
  const TimePickerField = ({
    field,
    form,
    inputValueFrom,
    inputValueTo,
    setInputValueFrom,
    setInputValueTo,
    defaultKey,
    setIsValidValuesDTT,
    ...other
  }) => {
    const ampm = true
    const minutesStep = 1
    const styles = makeStyles(theme => ({
      filledTimePicker: {
        '& div': {
          '& div': {
            '& button': {
              '&.Mui-focusVisible': {
                boxShadow: 'unset',
              },
              '&:active': {
                backgroundColor: 'unset',
              },
              '&:hover': {
                backgroundColor: 'none',
              },
            },
          },
        },
      },
    }))()

    const overrides = theme => {
      return {
        MuiPickersTimePickerToolbar: {
          ...theme.overrides.MuiPickersTimePickerToolbar,
          toolbarAmpmLeftPadding: {
            paddingLeft: 0,
          },
          separator: {
            fontSize: '3.5rem',
            alignSelf: 'baseline',
          },
          hourMinuteLabel: {
            '& button': {
              fontSize: '3.5rem',
              minHeight: '50px',
              paddingBottom: theme.spacing(1.5),
              '& span': {
                '& h2': {
                  fontSize: '3.5rem',
                },
              },
            },
          },
        },
      }
    }
    const timeFormatMap = {
      0: 'HH:mm',
      1: 'HH:mm', //'hh:mm A',
    }

    const getTimeFormat = ampm => {
      return timeFormatMap[ampm ? 1 : 0]
    }

    const [timeValue, setTimeValue] = useState()
    const [isManualEntering, setIsManualEntering] = useState(true)
    let splitTimeValueOnChange = []
    let seconds: number

    const handleOnChangeKeyboardTimePicker = (time: any, value: string) => {
      if (isManualEntering) {
        field.name === defaultKey ? setInputValueFrom(value) : setInputValueTo(value)
        //check if value is null before using .split() with it
        value ? (splitTimeValueOnChange = value.split(':')) : setIsValidValuesDTT(false)
        //if value is not null check if user entered valid digits
        if (expectedTimeValue.test(splitTimeValueOnChange[0]) && expectedTimeValue.test(splitTimeValueOnChange[1])) {
          setIsValidValuesDTT(true)
          // Server expects time in seconds representation.
          // e.g. specified in UI '01:00' should be converted to number of seconds (integer), eaual to = 1h x 60min x 60sec =  3600 sec
          seconds = splitTimeValueOnChange[0] * 60 * 60 + splitTimeValueOnChange[1] * 60
          form.setFieldValue(`${other.index}.value`, seconds.toString(), false)
          setIsValidValuesDTT(true)
        } else {
          setIsValidValuesDTT(false)
        }
      } else {
        setTimeValue(time)
      }
    }

    const dateFormatter = (date: string) => date

    return (
      <ThemeProvider
        theme={(theme: Theme) =>
          createTheme({
            ...theme,
            overrides: {
              ...theme.overrides,
              ...overrides(theme),
            },
          })
        }
      >
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardTimePicker
            format={getTimeFormat(ampm)}
            ampm={ampm}
            inputVariant="filled"
            minutesStep={minutesStep}
            key={field.name + other.index}
            name={`${other.index}.key`}
            value={`${other.index}.value`}
            inputValue={field.name === defaultKey ? inputValueFrom : inputValueTo}
            label={other.label}
            onClose={() => {
              setIsManualEntering(true)
              setIsValidValuesDTT(true)
              if (!timeValue) return
              form.setFieldValue(
                `${other.index}.value`,
                moment(timeValue).diff(moment(timeValue).startOf('day'), 'seconds').toString(),
                false,
              )
            }}
            onOpen={() => {
              setIsManualEntering(false)
            }}
            keyboardIcon={<BasicTime />}
            onChange={handleOnChangeKeyboardTimePicker}
            rifmFormatter={dateFormatter}
            className={styles.filledTimePicker}
            variant="inline"
            {...other}
            error={hasErrorTimePicker([field.name === defaultKey ? inputValueFrom : inputValueTo])}
            helperText={
              hasErrorTimePicker([field.name === defaultKey ? inputValueFrom : inputValueTo])
                ? t('pickers.time.invalidMessage')
                : ''
            }
          />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    )
  }

  const timeHandler = (time: number) => {
    return moment(new Date(new Date().setHours(0, 0, time, 0))).format('HH:mm')
  }

  // form control for double input with time
  const TimeFormControl = ({
    config: from,
    configTo: to,
    handleChange,
    handleBlur,
    errors,
    labelFrom,
    labelTo,
    defaultKey,
    setIsValidValuesDTT,
  }) => {
    const key = from.config.key
    const [inputValueFrom, setInputValueFrom] = useState(
      from.config.value ? timeHandler(from.config.value) : moment().format('HH:mm'),
    )
    const [inputValueTo, setInputValueTo] = useState(from.config.value ? timeHandler(to.config.value) : moment().format('HH:mm'))
    useEffect(
      () => {
        if (!hasErrorTimePicker([inputValueFrom, inputValueTo])) {
          setIsValidValuesDTT(true)
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [inputValueFrom, inputValueTo],
    )
    return (
      <FormControl variant="filled" disabled={!canUpdate}>
        <FormControlLabel
          control={<div></div>}
          label={t(getTranlationKey({ key: key, suffix: 'title' }))}
          classes={{ label: classes.formControlLabel }}
        />
        <FormHelperText className={classes.helperText}>{t(getTranlationKey({ key: key, suffix: 'description' }))}</FormHelperText>
        <Box>
          <Field
            name={from.config.key}
            value={inputValueFrom}
            index={from.index}
            label={labelFrom}
            size="small"
            component={TimePickerField}
            className={classes.timePickers}
            disabled={!canUpdate}
            inputValueFrom={inputValueFrom}
            setInputValueFrom={setInputValueFrom}
            defaultKey={defaultKey}
            setIsValidValuesDTT={setIsValidValuesDTT}
          />
          <Field
            name={to.config.key}
            value={inputValueTo}
            index={to.index}
            label={labelTo}
            size="small"
            component={TimePickerField}
            className={classes.timePickers}
            disabled={!canUpdate}
            inputValueTo={inputValueTo}
            setInputValueTo={setInputValueTo}
            defaultKey={defaultKey}
            setIsValidValuesDTT={setIsValidValuesDTT}
          />
        </Box>
      </FormControl>
    )
  }

  const MemoTimeFormControl = useMemo(() => {
    return TimeFormControl
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  const [isValidDiskSpace, setIsValidDiskSpace] = useState(true)
  const [isValidBandWidthLimit, setIsValidBandWidthLimit] = useState(true)
  const [isValidValuesDTT, setIsValidValuesDTT] = useState(true)

  const validationCases = currValue => {
    return !currValue || +currValue > 100 || +currValue < 0 || !/^[1-9]{1,}|^[0]{1}$/.test(currValue) || !/^\d+$/.test(currValue)
  }

  const handleOnChangeNumberField = e => {
    switch (e.target.id) {
      case CONFIG_KEY.TEMP_FILE_FOLDER_SIZE:
        validationCases(e.target.value) ? setIsValidDiskSpace(false) : setIsValidDiskSpace(true)
        break
      case CONFIG_KEY.BANDWIDTH_LIMIT:
        validationCases(e.target.value) ? setIsValidBandWidthLimit(false) : setIsValidBandWidthLimit(true)
        break
    }
    setFieldValue(`${e.target.name}`, e.target.value.trim())
  }

  return (
    <Box>
      <Form className={classes.root} noValidate onSubmit={handleSubmit}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h2" className={classes.title}>
            {t(generalDataCollectionSettings + '.title')}
            <Typography className={classes.subTitle}>{t('setting.general.dataCollectionSettings.description')}</Typography>
          </Typography>
        </Box>
        {values?.map((config, index) => {
          const key = config.key
          return (
            <>
              {key === CONFIG_KEY.IS_SNIPPET_REPORTED && (
                <Box>
                  <Typography variant="h3" className={classes.title}>
                    {t('setting.general.dataCollectionSettings.ui_tenant_setting_isSnippetReported.heading')}
                  </Typography>
                  <FormControlSwitch
                    config={config}
                    control={
                      <Switch
                        key={`${index}.value` + index}
                        name={`${index}.value`}
                        checked={isTrue(config.value)}
                        onChange={handleChange}
                      />
                    }
                  />
                </Box>
              )}
              {key === CONFIG_KEY.UPLOAD_EVIDENCE_FILE && (
                <Box>
                  <Typography variant="h3" className={classes.title}>
                    {t('setting.general.dataCollectionSettings.ui_tenant_setting_uploadEvidenceFile.heading')}
                  </Typography>
                  <FormControlSwitch
                    config={config}
                    control={
                      <Switch
                        key={`${index}.value` + index}
                        name={`${index}.value`}
                        checked={isTrue(config.value)}
                        onChange={handleChange}
                      />
                    }
                  />
                </Box>
              )}
              {key === CONFIG_KEY.TEMP_FILE_FOLDER_SIZE && (
                <FormControl fullWidth>
                  <TextField
                    id={config.key}
                    name={`${index}.value`}
                    label={t('setting.general.dataCollectionSettings.diskSpaceLabel')}
                    value={config.value}
                    disabled={canUpdate ? !collectFullCopyOfTheData : !canUpdate || !collectFullCopyOfTheData}
                    margin="dense"
                    onChange={handleOnChangeNumberField}
                    onBlur={handleBlur}
                    error={!isEmpty(errors) || validationCases(config.value)}
                    helperText={
                      !validationCases(config.value)
                        ? t(getTranlationKey({ key: key, suffix: 'description' }))
                        : t('setting.general.dataCollectionSettings.validation.percentValue')
                    }
                    classes={{ root: textFieldClasses.root }}
                    InputProps={{
                      endAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }}
                  />
                </FormControl>
              )}
              {key === CONFIG_KEY.UPLOAD_DIRECTLY_TO_S3 && (
                <FormControlSelect config={config} index={index} setFieldValue={setFieldValue} />
              )}
              {key === CONFIG_KEY.UPLOAD_ON_MOBILE_NETWORK && (
                <FormControlCheckbox
                  config={config}
                  control={
                    <Checkbox
                      name={`${index}.value`}
                      checked={isTrue(config.value)}
                      onChange={handleChange}
                      disabled={!canUpdate || !collectFullCopyOfTheData}
                    />
                  }
                />
              )}

              {/* for more details take a look to https://jirasd.rim.net/browse/DLP-5494 */}

              {/* {key === CONFIG_KEY.BANDWIDTH_LIMIT && (
                <FormControl fullWidth>
                  <TextField
                    id={config.key}
                    name={`${index}.value`}
                    label={t('setting.general.dataCollectionSettings.ui_tenant_setting_bandwidthLimit.bandwidthLimit')}
                    value={config.value}
                    disabled={canUpdate ? !collectFullCopyOfTheData : !canUpdate || !collectFullCopyOfTheData}
                    margin="dense"
                    onChange={handleOnChangeNumberField}
                    onBlur={handleBlur}
                    error={!isEmpty(errors) || validationCases(config.value)}
                    helperText={
                      !validationCases(config.value)
                        ? t(getTranlationKey({ key: key, suffix: 'description' }))
                        : t('setting.general.dataCollectionSettings.validation.percentValue')
                    }
                    classes={{ root: textFieldClasses.root }}
                    InputProps={{
                      endAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }}
                  />
                </FormControl>
              )}
              {key === CONFIG_KEY.TRANSFER_WINDOW_STAR_TIME && (
                <div className={classes.transferWindowTime}>
                  <MemoTimeFormControl
                    config={{ config: config, index: index }}
                    configTo={configTo}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    errors={errors}
                    setIsValidValuesDTT={setIsValidValuesDTT}
                    defaultKey={CONFIG_KEY.TRANSFER_WINDOW_STAR_TIME}
                    labelFrom={t('setting.general.dataCollectionSettings.ui_tenant_setting_transferWindowStartTime.from')}
                    labelTo={t('setting.general.dataCollectionSettings.ui_tenant_setting_transferWindowEndTime.to')}
                  />
                </div>
              )} */}
              {key === CONFIG_KEY.DATA_RETENTION_STOREDAYS && (
                <DataRetentionSelect config={config} index={index} setFieldValue={setFieldValue} />
              )}
            </>
          )
        })}
        {
          <FormButtonPanel show={dirty}>
            <Button variant="contained" type="reset">
              {t('setting.buttons.cancel')}
            </Button>
            <Button
              disabled={!isValidDiskSpace || !isValidBandWidthLimit || !isValidValuesDTT}
              color="secondary"
              variant="contained"
              type="submit"
            >
              {t('setting.buttons.save')}
            </Button>
          </FormButtonPanel>
        }
      </Form>
    </Box>
  )
}

export default DataCollectionSettingsForm
