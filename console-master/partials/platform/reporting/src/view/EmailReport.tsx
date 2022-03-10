/* eslint-disable sonarjs/cognitive-complexity */
/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'

import { yupResolver } from '@hookform/resolvers/yup'

import { TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { queryDashboardTitles } from '@ues-data/dashboard'
import { useSearchDirectoryUsersMultiple } from '@ues-data/platform'
import { ReportType, ScheduledReport, ScheduledReportsApi } from '@ues-data/reporting'
import { useStatefulApolloQuery } from '@ues-data/shared'

import makeStyles from './EmailReportStyles'

const emails = ['fake_email@blackhole.sw.rim.net', 'another_fake_email@blackhole.sw.rim.net']

const schema = yup.object().shape({
  reportName: yup.string().required(),
  frequency: yup.string().required(),
  emailSubject: yup.string().required().min(1),
  bcc: yup.string().required(),
  selectDashboard: yup.object().required(),
})
const TEMP_TENTANT = 'L60858679'

export default function EmailReport(): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation(['reporting/common'])
  const { guid } = useParams()
  const classes = makeStyles()

  // const [enabled, setEnabled] = useState(false)
  const { control, handleSubmit, errors, reset, register } = useForm({
    resolver: yupResolver(schema),
  })

  const {
    data: dashBoardData,
    loading: dashboardLoading,
    error: dashboardError,
    refetch: dashboardRefetch,
  } = useStatefulApolloQuery(queryDashboardTitles, {
    variables: {},
  })

  const [open, setOpen] = React.useState(false)

  useEffect(() => {
    // you can do async server request and fill up form
    if (guid !== undefined) {
      setTimeout(() => {
        ScheduledReportsApi.ScheduledReports.get(TEMP_TENTANT, guid).then(response => {
          // setEnabled(response.data.enabled)
          const selectedDashboard = dashBoardData['getDashboards'].find(
            db => db.dashboardId === response.data.reportParams.dashboardId,
          )
          reset({
            reportName: response.data.name,
            frequency: response.data.recurrence,
            emailSubject: response.data.details.subject,
            recipients: response.data.details.recipients.map(email => {
              return {
                emailAddress: email,
              }
            }),
            selectDashboard: selectedDashboard,
            bcc: response.data.details.bcc === true ? 'on' : 'off',
            enabled: response.data.enabled === true ? true : false,
          })
        })
      }, 2000)
    }
  }, [reset, guid, dashBoardData])

  useEffect(() => {
    let active = true

    dashboardRefetch()

    return () => {
      active = false
    }
  })

  const handleCancel = () => {
    navigate(-1)
  }

  const onSubmit = data => {
    if (guid) {
      ScheduledReportsApi.ScheduledReports.update(TEMP_TENTANT, guid, {
        details: {
          from: 'noreply@eval.blackberry.com', //ToDo: Remove this
          subject: data.emailSubject,
          recipients: data.recipients.map(recipient => {
            return recipient.emailAddress
          }),
          body: 'TBD',
          bcc: data.bcc === 'on' ? true : false,
        },
        enabled: data.enabled,
        name: data.reportName,
        rawDataAttached: false, //shouldbe fixed,
        recurrence: data.frequency,
        reportParams: { dashboardId: data.selectDashboard.dashboardId },
        reportType: ReportType.SCREENSHOT_PDF,
      })
        .then(function (response) {
          // handleSuccess()
          navigate(-1)
        })
        .catch(function (error) {
          // handleError(error)
        })
    } else {
      ScheduledReportsApi.ScheduledReports.create(TEMP_TENTANT, {
        details: {
          from: 'noreply@eval.blackberry.com', //ToDo: Remove This
          subject: data.emailSubject,
          recipients: data.recipients.map(recipient => {
            return recipient.emailAddress
          }),
          body: 'TBD',
          bcc: data.bcc === 'on' ? true : false,
        },
        enabled: true,
        name: data.reportName,
        rawDataAttached: false, //shouldbe fixed,
        recurrence: data.frequency,
        reportParams: { dashboardId: data.selectDashboard.dashboardId },
        reportType: ReportType.SCREENSHOT_PDF,
      })
        .then(function (response) {
          navigate(-1)
        })
        .catch(function (error) {
          // handleError(error)
        })
    }
  }

  const DirectoryUserSearchMultiple = props => {
    return (
      <Autocomplete
        {...useSearchDirectoryUsersMultiple({
          label: t('addRecipients'),
          searchPlaceholder: t('recipients'),
          field: 'emailAddress',
        })}
        {...props}
      ></Autocomplete>
    )
  }

  return (
    <div className={classes.root}>
      <Typography variant="h1" gutterBottom>
        {guid === undefined ? t('addEmailReport') : t('editEmailReport')}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h2" gutterBottom>
          {t('emailSettings')}
        </Typography>
        {register('enabled', {
          validate: value => true,
        })}
        <Grid container spacing={1} className={classes.gridContainer}>
          <Grid item xs={6}>
            {/* Report Name */}
            <Controller
              as={TextField}
              label={t('reportName')}
              name="reportName"
              control={control}
              error={errors.reportName}
              helperText={errors.reportName?.message}
              fullWidth
              defaultValue=""
              disabled={guid ? true : false}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} className={classes.gridContainer}>
          <Grid item xs={3}>
            {/* Frequency DropDown */}
            <InputLabel id="frequency-label">{t('frequency')}</InputLabel>
            <Controller
              as={
                <Select fullWidth>
                  <MenuItem value={'DAILY'}>{t('daily')}</MenuItem>
                  <MenuItem value={'WEEKLY'}>{t('weekly')}</MenuItem>
                  <MenuItem value={'MONTHLY'}>{t('monthly')}</MenuItem>
                  <MenuItem value={'QUARTERLY'}>{t('quarterly')}</MenuItem>
                </Select>
              }
              name="frequency"
              control={control}
              rules={{ required: true }}
              defaultValue={'DAILY'}
            />
          </Grid>
        </Grid>
        {/* Email Subject*/}
        <Grid container spacing={1} className={classes.gridContainer}>
          <Grid item xs={12}>
            <Controller
              as={TextField}
              name="emailSubject"
              label={t('emailSubject')}
              control={control}
              fullWidth
              defaultValue=""
              error={errors.emailSubject}
              helperText={errors.emailSubject?.message}
            />
          </Grid>
        </Grid>
        {/* Recipients and BCC DropDown */}
        <Grid container spacing={1} className={classes.gridContainer}>
          <Grid item xs={9}>
            <Controller
              render={({ onChange, ...props }) => (
                <DirectoryUserSearchMultiple onChange={(e, data) => onChange(data)} {...props}></DirectoryUserSearchMultiple>
              )}
              onChange={([, data]) => data}
              defaultValue={[]}
              name="recipients"
              control={control}
            />
          </Grid>
          <Grid item xs={3}>
            <InputLabel id="bcc-label">{t('bcc')}</InputLabel>
            <Controller
              as={
                <Select>
                  <MenuItem value={'on'}>On</MenuItem>
                  <MenuItem value={'off'}>Off</MenuItem>
                </Select>
              }
              fullWidth
              defaultValue={'on'}
              label={t('bcc')}
              name="bcc"
              control={control}
              rules={{ required: true }}
            />
          </Grid>
        </Grid>
        <Typography variant="h2" gutterBottom>
          {t('includedContent')}
        </Typography>
        {/* Select Dashboard & Attached CSV ? */}
        <Grid container spacing={1} className={classes.gridContainer}>
          <Grid item xs={3}>
            <Controller
              render={({ onChange, ...props }) => (
                <Autocomplete
                  id="asynchronous-demo"
                  style={{ width: 300 }}
                  open={open}
                  onOpen={() => {
                    setOpen(true)
                  }}
                  onClose={() => {
                    setOpen(false)
                  }}
                  getOptionSelected={(option, value) => option.dashboardId === value.dashboardId}
                  getOptionLabel={option => option.title}
                  options={dashBoardData ? dashBoardData['getDashboards'] : []}
                  loading={dashboardLoading}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={t('selectDashboard')}
                      error={errors.selectDashboard}
                      helperText={errors.selectDashboard?.message}
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {dashboardLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                  onChange={(e, data) => onChange(data)}
                  {...props}
                />
              )}
              onChange={([, data]) => data}
              defaultValue={''}
              name="selectDashboard"
              control={control}
              rules={{ required: true }}
            />
          </Grid>
          {/* <Grid item xs={3}>
            <InputLabel id="attachedCSV-label">{t('attachedCSV')}</InputLabel>
            <Controller
              as={
                <Select fullWidth>
                  <MenuItem value={'on'}>On</MenuItem>
                  <MenuItem value={'off'}>Off</MenuItem>
                </Select>
              }
              label={t('attachedCSV')}
              defaultValue={'on'}
              name="attachedCSV"
              control={control}
              rules={{ required: true }}
            />
          </Grid> */}
        </Grid>

        <div className={classes.buttonbar}>
          <Button variant="contained" color="secondary" onClick={handleCancel}>
            {t('cancel')}
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
            {t('save')}
          </Button>
        </div>
      </form>
    </div>
  )
}
