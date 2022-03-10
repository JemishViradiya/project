/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Box, Button, Typography } from '@material-ui/core'

import { BcnApi } from '@ues-data/platform'
import { Permission, useStatefulAsyncMutation } from '@ues-data/shared'
import { HelpLinkScope, usePlatformHelpLink } from '@ues-platform/shared'
import { ContentArea, ContentAreaPanel, FormButtonPanel, PageTitlePanel, useSecuredContent } from '@ues/behaviours'

import makeStyles from './GenerateBCNStyles'

const BCNAppLink = 'https://swdownloads.blackberry.com/Downloads/entry.do?code=39D0A8908FBE6C18039EA8227F827023'

const GenerateBCN = () => {
  useSecuredContent(Permission.ECS_BCN_READ, Permission.ECS_BCN_CREATE)
  const { t } = useTranslation(['platform/common', 'general/form'])
  const classes = makeStyles()
  const navigate = useNavigate()

  const [generateAction] = useStatefulAsyncMutation(BcnApi.generateBcnActivation, {})

  const handleGenerate = () => {
    generateAction().then(response => {
      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'activation_file.txt')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  const buttons = [
    {
      variant: 'contained',
      color: 'primary',
      text: t('general/form:commonLabels.close'),
      key: 'closeButton',
      style: { margin: 10 },
      onClick: () => navigate(-1),
    },
  ]

  return (
    <>
      <PageTitlePanel
        title={t('bcn.generate.pageTitle')}
        goBack={() => navigate(-1)}
        helpId={usePlatformHelpLink(HelpLinkScope.CONNECTIVITY_NODE)}
      />
      <ContentArea>
        <ContentAreaPanel title={t('bcn.generate.title')}>
          <Box mb={6}>
            <Typography variant="subtitle2" className={classes.typographyMargin}>
              {t('bcn.generate.bcnStep1Title')}
            </Typography>
            <Button className={classes.button} variant="contained" color="primary" href={BCNAppLink} target="_blank">
              {t('general/form:commonLabels.download')}
            </Button>
          </Box>
          <Box mb={6}>
            <Typography variant="subtitle2" className={classes.typographyMargin}>
              {t('bcn.generate.bcnStep2Title')}
            </Typography>
            <Typography variant="body2" className={classes.typographyMargin}>
              {t('bcn.generate.bcnStep2Description')}
            </Typography>
            <Button className={classes.button} variant="contained" color="primary" onClick={handleGenerate}>
              {t('button.downloadActivationFile')}
            </Button>
          </Box>
          <Box>
            <Typography variant="subtitle2" className={classes.typographyMargin}>
              {t('bcn.generate.bcnStep3Title')}
            </Typography>
            <Typography variant="body2">{t('bcn.generate.bcnStep3Description')}</Typography>
          </Box>
        </ContentAreaPanel>
      </ContentArea>
      <FormButtonPanel show={true}>
        {buttons.map(button => (
          <Button {...button}>{button.text}</Button>
        ))}
      </FormButtonPanel>
    </>
  )
}

export default GenerateBCN
