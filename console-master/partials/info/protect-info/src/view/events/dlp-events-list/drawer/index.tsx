import moment from 'moment'
import type { ReactElement } from 'react'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Drawer, IconButton, Link as MuiLink, Typography } from '@material-ui/core'

import type { FileDetails } from '@ues-data/dlp'
import { EventsData, FileApi } from '@ues-data/dlp'
import { useStatefulAsyncMutation, useStatefulReduxQuery } from '@ues-data/shared'
import type { AccordionProps } from '@ues-info/shared'
import { Accordion, useDrawerStyles } from '@ues-info/shared'
import { BasicClose } from '@ues/assets'
import { useSnackbar } from '@ues/behaviours'

import { useEventsPermissions } from '../useEventsPermission'
import FileDetailsView from './file-details'

export const useDrawerProps = () => {
  const [isOpen, setState] = React.useState(false)
  const toggleDrawer = () => {
    setState(!isOpen)
  }
  return { isOpen, toggleDrawer }
}

export interface DlpListDrawerProps {
  dlpEvent: any
  isOpen: boolean
  toggleDrawer: () => void
}

export const DlpListDrawer: React.FC<DlpListDrawerProps> = ({ dlpEvent, isOpen, toggleDrawer }) => {
  const classNames = useDrawerStyles()
  const snackbar = useSnackbar()
  const elementRef = useRef<ReactElement>()
  const { t } = useTranslation(['dlp/common'])
  const { canReadUsers, canReadPolicy, canReadFileSummary } = useEventsPermissions()

  const [downloadAction, { data: data_create, loading: loading_create, error: error_create }] = useStatefulAsyncMutation(
    FileApi.downloadEvidenceFile,
    {},
  )

  const handleEvidenceFileDownload = async (fileDetails: FileDetails) => {
    const downloadFile: any = await downloadAction({ fileHash: fileDetails.fileHash })
    const url = downloadFile?.data?.blobData
      ? window.URL.createObjectURL(downloadFile?.data?.blobData)
      : downloadFile?.data.presignedDownloadURL
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', downloadFile?.data.fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // TODO need to check if it will be working else remove it
  useEffect(
    () => {
      if (!loading_create && error_create) {
        console.log('error_create', error_create)
        snackbar.enqueueMessage(t('events.drawer.fileSection.downloadFile.error'), 'error')
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [error_create, loading_create],
  )

  const { error: eventError, loading: eventLoading, data: eventData, refetch: refetchEvent } = useStatefulReduxQuery(
    EventsData.queryEventDetails,
    {
      variables: { eventUUID: dlpEvent?.eventUUID },
      // decide to load event record based on dlpEvent - "is defined"
      skip: !dlpEvent?.eventUUID,
    },
  )

  const usersPlatformPath = '/uc/platform#/users'

  const eventOverview: AccordionProps[] = [
    {
      title: t('events.drawer.accordion.eventOverview'),
      rows: [
        {
          label: t('events.drawer.accordion.typeLabel'),
          value:
            eventData?.eventType &&
            t('events.drawer.accordion.eventUserDetailsName', {
              name: t(`dashboard.exfiltrationEventTypes.${eventData?.eventType}`).toLocaleLowerCase(),
            }),
        },
        {
          label: t('events.drawer.accordion.detectionTimeLabel'),
          value: moment(new Date(eventData?.violationTime)).format('lll'),
        },
        {
          label: t('events.drawer.accordion.deviceLabel'),
          value: eventData?.clientName?.toLocaleLowerCase(),
        },
        {
          label: t('events.drawer.accordion.locationLabel'),
          value: eventData?.locations,
        },
      ],
    },
  ]

  const eventUserDetails: AccordionProps[] = [
    {
      title: t('events.drawer.accordion.eventUserDetails'),
      rows: [
        {
          label: t('events.drawer.accordion.userName'),
          value: (
            <MuiLink
              href={`${usersPlatformPath}/${eventData?.userId}`}
              onClick={(event: React.SyntheticEvent) => event.stopPropagation()}
            >
              <span>{eventData?.userName ?? t('events.columns.noUserName')}</span>
            </MuiLink>
          ),
        },
        {
          label: t('events.drawer.accordion.userEmail'),
          value: (
            // TODO need double check action
            <MuiLink
              href="#"
              onClick={e => {
                window.location.href = `mailto:${eventData?.userEmail}`
                e.preventDefault()
              }}
            >
              {eventData?.userEmail ?? ''}
            </MuiLink>
          ),
        },
        {
          label: t('events.drawer.accordion.userTitle'),
          value: eventData?.userTitle ?? '',
        },
        {
          label: t('events.drawer.accordion.userDepartment'),
          value: eventData?.userDepartment ?? '',
        },
      ],
    },
  ]

  const eventFilesDetails: AccordionProps[] = [
    {
      title: t('events.drawer.accordion.eventFilesDetails'),
      rows: eventData?.fileDetails?.map((f, i) => {
        return {
          label: f.fileName,
          value: <FileDetailsView data={f} handleEvidenceFileDownload={() => handleEvidenceFileDownload(f)} />,
        }
      }),
    },
  ]

  const eventPolicyViolations: AccordionProps[] = [
    {
      title: t('events.drawer.accordion.eventPolicyViolations'),
      rows: eventData?.policyDetails?.map(f => {
        return {
          label: (
            <MuiLink
              variant="inherit"
              color="primary"
              href={`/uc/info#/content/update/${f.policyGuid}`}
              onClick={(event: React.SyntheticEvent) => event.stopPropagation()}
            >
              <span>{f.policyName}</span>
            </MuiLink>
          ),
          value: null,
        }
      }),
    },
  ]

  return (
    <Drawer classes={{ paper: classNames.paper }} variant="persistent" PaperProps={{ elevation: 6 }} anchor={'right'} open={isOpen}>
      <IconButton className={classNames.closeIcon} onClick={toggleDrawer}>
        <BasicClose fontSize="small" />
      </IconButton>

      <Typography className={classNames.title} variant="h2">
        {t('events.drawer.eventDetailsTitle')}
      </Typography>

      {eventOverview.map(item => (
        <Accordion key="eventOverview" {...item} />
      ))}
      {canReadUsers && eventUserDetails.map(item => <Accordion key="eventUserDetails" {...item} />)}
      {!!eventData?.policyDetails?.length &&
        canReadPolicy &&
        eventPolicyViolations.map(item => (
          <Accordion alternateTitle={`${eventData?.policyDetails?.length}`} key="eventPolicyDetails" {...item} />
        ))}
      {!!eventData?.fileDetails?.length &&
        canReadFileSummary &&
        eventFilesDetails.map(item => (
          <Accordion alternateTitle={`${eventData?.fileDetails?.length}`} key="eventFileDetails" underlined={true} {...item} />
        ))}
    </Drawer>
  )
}
