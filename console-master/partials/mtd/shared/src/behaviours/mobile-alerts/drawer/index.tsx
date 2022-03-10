/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, ClickAwayListener, Drawer, IconButton, Link, Typography } from '@material-ui/core'

import { BasicClose, I18nFormats } from '@ues/assets'

import { Accordion } from './accordion/accordion'
import { useStyles } from './styles'
import type { AccordionProps } from './types'
import { EventValueKeySortOrder } from './types'

export const useDrawerProps = () => {
  const [isOpen, setState] = useState<boolean>(false)
  const [ignoreClickAway, setIgnoreClickAway] = useState<boolean>(false)
  const toggleDrawer = useCallback(() => {
    setState(!isOpen)
  }, [isOpen])
  return { isOpen, toggleDrawer, ignoreClickAway, setIgnoreClickAway }
}

export interface MtdAlertDrawerProps {
  rowData: any
  isOpen: boolean
  ignoreClickAway: boolean
  setIgnoreClickAway(value: boolean): void
  toggleDrawer(): void
}

const formatDatetime = (datetime: number | undefined, i18n: ReturnType<typeof useTranslation>['i18n']) =>
  datetime ? i18n.format(datetime, I18nFormats.DateTime) : ''

const encodeID = (id: string) => encodeURIComponent(btoa(id))

export const MtdAlertDrawer: React.FC<MtdAlertDrawerProps> = ({
  rowData,
  isOpen,
  ignoreClickAway,
  toggleDrawer,
  setIgnoreClickAway,
}) => {
  const { t, i18n } = useTranslation(['mtd/common'])
  const classNames = useStyles()

  const onClickAway = event => {
    if (!ignoreClickAway && isOpen) {
      toggleDrawer()
    }
    setIgnoreClickAway(false)
  }

  const content = useMemo(() => {
    const getI18NEventState = (state: string): string => {
      return state ? t('threatStatus.' + state?.toLowerCase(), state) : ''
    }

    const getI18NEventType = (type: string): string => {
      return type ? t('threats.' + type, type) : ''
    }

    const getI18NKey = (key: string): string => {
      return key ? t('threats.alertDetail.keys.' + key, key) : ''
    }

    const getOrder = (enumValue: string) => {
      const index = Object.keys(EventValueKeySortOrder).indexOf(enumValue)
      return index != -1 ? index : Object.keys(EventValueKeySortOrder).length
    }

    const accordionsDefinitions: AccordionProps[] = [
      {
        title: t('threats.alertDetail.overview.title'),
        altTitle: getI18NEventState(rowData?.row?.status),
        rows: [
          {
            label: t('threats.alertDetail.overview.label.name'),
            value: rowData?.row?.name,
          },
          {
            label: t('threats.alertDetail.overview.label.time'),
            value: formatDatetime(rowData?.row?.detected, i18n),
          },
        ],
      },
      {
        title: t('threats.alertDetail.assets.title'),
        rows: [
          {
            label: t('threats.alertDetail.assets.label.user'),
            value: rowData?.row?.ecoId ? (
              <Typography variant="body2">
                <Link href={`../platform#/users/${encodeID(rowData?.row?.ecoId)}`}>{rowData?.row?.userName}</Link>
              </Typography>
            ) : (
              rowData?.row?.userName
            ),
          },
          {
            label: t('threats.alertDetail.assets.label.device'),
            value: rowData?.row?.deviceName,
          },
        ],
      },
    ]
    if (rowData?.row?.resolved) {
      accordionsDefinitions[0].rows.push({
        label: t('threats.alertDetail.overview.label.resolved'),
        value: formatDatetime(rowData?.row?.resolved, i18n),
      })
    }
    // Add values sorted by EventValueKeySortOrder
    if (rowData?.row?.values) {
      // eslint-disable-next-line no-extra-semi
      ;[...rowData?.row?.values]
        .filter(event => event.value !== rowData?.row?.name)
        .sort((firstEl, secondEl) => {
          return getOrder(firstEl.key) - getOrder(secondEl.key)
        })
        .forEach(event => {
          if (event.key === 'maliciousURLs') {
            event.value.split(',').forEach((element, i) => {
              accordionsDefinitions[0].rows.push({
                label: i === 0 ? getI18NKey(event.key) : '',
                value: element,
              })
            })
          } else if (event.key === 'lastContact') {
            accordionsDefinitions[0].rows.push({
              label: t('threats.alertDetail.keys.lastContact'),
              value: formatDatetime(event.value, i18n),
            })
          } else {
            accordionsDefinitions[0].rows.push({
              label: getI18NKey(event.key),
              value: event.value,
            })
          }
        })
    }

    return (
      <Box>
        <Typography className={classNames.title} variant="h2">
          {getI18NEventType(rowData?.row?.type)}
        </Typography>
        {accordionsDefinitions.map((item, index) => (
          <Accordion key={index} {...item} />
        ))}
      </Box>
    )
  }, [t, classNames, rowData, i18n])

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Drawer classes={{ paper: classNames.paper }} variant="persistent" anchor={'right'} open={isOpen}>
        <IconButton className={classNames.closeIcon} onClick={toggleDrawer}>
          <BasicClose fontSize="small" />
        </IconButton>
        {content}
      </Drawer>
    </ClickAwayListener>
  )
}
