/* eslint-disable react-hooks/exhaustive-deps */
/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Button, Dialog, TextField, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import { UESPolicyListUpdateMutation } from '@ues-data/bis'
import { useStatefulApolloMutation } from '@ues-data/shared'
import { ContentArea, ContentAreaPanel, DialogChildren, PageTitlePanel, useSnackbar } from '@ues/behaviours'

import { IpAddressListAddMutation, IpAddressListUpdateMutation } from './IpAddressList'
import makeStyles from './PolicyAndIpAddressStyle'

// eslint-disable-next-line sonarjs/cognitive-complexity
const PolicyAndIpAddress: React.FC = memo(() => {
  const { t } = useTranslation(['emm/connection'])

  const classes = makeStyles()
  const { enqueueMessage } = useSnackbar()

  const onPolicyUpdateCompleted = useCallback(
    async ({ updatePolicy: { id } }) => {
      enqueueMessage('Policy was updated', 'success')
      cleanState()
    },
    [enqueueMessage],
  )

  const onPolicyUpdateError = useCallback(
    error => {
      console.error(error)
      enqueueMessage('An Error occured, Policy not updated', 'error')
    },
    [t, enqueueMessage],
  )

  const onAddIpAddressCompleted = useCallback(
    async ({ addIpAddressList }) => {
      enqueueMessage('IPAddressList was added', 'success')
      setResponseDialog({
        show: true,
        content: JSON.stringify(addIpAddressList),
      })
      cleanState()
    },
    [enqueueMessage],
  )

  const onAddIpAddressError = useCallback(
    error => {
      console.error(error)
      enqueueMessage('An Error occured, IPAddressList not added', 'error')
    },
    [t, enqueueMessage],
  )

  const onUpdateIpAddressCompleted = useCallback(
    async ({ updateIpAddressList }) => {
      enqueueMessage('IPAddressList was updated', 'success')
      setResponseDialog({
        show: true,
        content: updateIpAddressList.toString(),
      })
      cleanState()
    },
    [enqueueMessage],
  )

  const onUpdateIpAddressError = useCallback(
    error => {
      console.error(error)
      enqueueMessage('An Error occured, IPAddressList not updated', 'error')
    },
    [t, enqueueMessage],
  )

  const [updatePolicy] = useStatefulApolloMutation(UESPolicyListUpdateMutation, {
    onCompleted: onPolicyUpdateCompleted,
    onError: onPolicyUpdateError,
  })

  const [ipAddress] = useStatefulApolloMutation(IpAddressListAddMutation, {
    onCompleted: onAddIpAddressCompleted,
    onError: onAddIpAddressError,
  })

  const [updateIpAddressList] = useStatefulApolloMutation(IpAddressListUpdateMutation, {
    onCompleted: onUpdateIpAddressCompleted,
    onError: onUpdateIpAddressError,
  })

  const [dialogContent, setDialogContent] = useState({
    open: false,
    selectedOption: '',
    title: '',
    firstField: {
      show: false,
      title: '',
      required: false,
    },
    secondField: {
      show: false,
      title: '',
      required: false,
    },
    thirdField: {
      show: false,
      title: '',
      required: false,
    },
    cancel: 'Cancel',
    submit: 'Submit',
  })

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    value: '',
  })

  const [responseDialog, setResponseDialog] = useState({
    show: false,
    content: '',
  })

  const cleanState = () => {
    setDialogContent(prevState => ({
      ...prevState,
      open: false,
      title: '',
    }))
  }

  const handleMenuClick = (event, target) => {
    let title = ''
    let firstField = {
      show: false,
      title: '',
      required: false,
    }
    let secondField = {
      show: false,
      title: '',
      required: false,
    }
    let thirdField = {
      show: false,
      title: '',
      required: false,
    }
    switch (target) {
      case 'policy':
        firstField = { show: true, title: 'Policy Id', required: true }
        thirdField = { show: true, title: 'Policy data', required: true }
        secondField = { show: true, title: 'Policy name', required: true }
        title = 'Update Policy'
        break
      case 'addIpaddressList':
        firstField = { show: false, title: '', required: false }
        secondField = { show: false, title: '', required: false }
        thirdField = { show: true, title: 'IP Address List', required: true }
        title = 'Add IP Address List'
        break
      case 'updateIpaddressList':
        title = 'Update IP Address List'
        firstField = { show: true, title: 'IP Address List Id', required: true }
        secondField = { show: false, title: '', required: false }
        thirdField = { show: true, title: 'IP Address List', required: true }
        break
    }
    setDialogContent(prevState => ({
      ...prevState,
      open: true,
      selectedOption: target,
      title: title,
      firstField: firstField,
      secondField: secondField,
      thirdField: thirdField,
    }))
  }

  const handleChange = (event, field) => {
    const data = { ...formData }
    data[field] = event.target.value
    setFormData(data)
  }

  const handleClose = event => {
    cleanState()
  }

  const validateFormData = () => {
    let error = true
    if (dialogContent.firstField.required && (!formData.id || formData.id.trim().length === 0)) {
      error = false
    }
    if (dialogContent.secondField.required && (!formData.name || formData.name.trim().length === 0)) {
      error = false
    }
    if (dialogContent.thirdField.required && (!formData.value || formData.value.trim().length === 0)) {
      error = false
    }
    return error
  }

  const onSubmit = event => {
    if (validateFormData()) {
      switch (dialogContent.selectedOption) {
        case 'policy':
          try {
            updatePolicy({
              variables: {
                id: formData.id,
                input: {
                  name: formData.name,
                  policyData: JSON.parse(formData.value),
                },
              },
            })
          } catch (error) {
            enqueueMessage('Please fill valid policy data JSON value', 'error')
          }
          break
        case 'addIpaddressList':
          try {
            ipAddress({ variables: { input: JSON.parse(formData.value) } })
          } catch (error) {
            enqueueMessage('Please fill valid ipaddress list JSON request', 'error')
          }
          break
        case 'updateIpaddressList':
          try {
            updateIpAddressList({ variables: { id: formData.id, input: JSON.parse(formData.value) } })
          } catch (error) {
            enqueueMessage('Please fill valid JSON value', 'error')
          }
          break
      }
    } else {
      enqueueMessage('Please fill all required fields', 'error')
    }
  }

  const handleResponseDialogClose = event => {
    setResponseDialog({
      show: false,
      content: '',
    })
  }

  return (
    <Box className={classes.outerContainer}>
      <PageTitlePanel title={[t('PolicyAndIpAddress.title')]} />
      <ContentArea>
        <ContentAreaPanel>
          <Box>
            <Button
              aria-controls="customized-menu"
              aria-haspopup="true"
              variant="contained"
              color="secondary"
              onClick={e => handleMenuClick(e, 'policy')}
              startIcon={<AddIcon />}
            >
              {t('PolicyAndIpAddress.button.policy')}
            </Button>
          </Box>
          <Box>
            <Button
              aria-controls="customized-menu"
              aria-haspopup="true"
              variant="contained"
              color="secondary"
              onClick={e => handleMenuClick(e, 'addIpaddressList')}
              startIcon={<AddIcon />}
            >
              {t('PolicyAndIpAddress.button.addIpaddressList')}
            </Button>
          </Box>
          <Box>
            <Button
              aria-controls="customized-menu"
              aria-haspopup="true"
              variant="contained"
              color="secondary"
              onClick={e => handleMenuClick(e, 'updateIpaddressList')}
              startIcon={<AddIcon />}
            >
              {t('PolicyAndIpAddress.button.updateIpaddressList')}
            </Button>
          </Box>
        </ContentAreaPanel>
      </ContentArea>
      <Dialog open={dialogContent.open} onClose={handleClose} maxWidth={'xs'} fullWidth>
        <DialogChildren
          title={dialogContent.title}
          content={
            <>
              {dialogContent.firstField.show ? (
                <Box>
                  <TextField
                    variant="filled"
                    fullWidth
                    label={dialogContent.firstField.title}
                    onChange={e => handleChange(e, 'id')}
                    required={dialogContent.firstField.required}
                  />
                </Box>
              ) : null}
              {dialogContent.secondField.show ? (
                <Box>
                  <TextField
                    variant="filled"
                    fullWidth
                    label={dialogContent.secondField.title}
                    onChange={e => handleChange(e, 'name')}
                    required={dialogContent.secondField.required}
                  />
                </Box>
              ) : null}
              {dialogContent.thirdField.show ? (
                <Box>
                  <TextField
                    variant="filled"
                    fullWidth
                    multiline
                    minRows="4"
                    label={dialogContent.thirdField.title}
                    onChange={e => handleChange(e, 'value')}
                    required={dialogContent.thirdField.required}
                  />
                </Box>
              ) : null}
            </>
          }
          actions={
            <>
              <Button variant="outlined" onClick={handleClose}>
                {dialogContent.cancel}
              </Button>
              <Button variant="contained" color="primary" onClick={onSubmit}>
                {dialogContent.submit}
              </Button>
            </>
          }
          onClose={handleClose}
        />
      </Dialog>
      <Dialog open={responseDialog.show} onClose={handleResponseDialogClose} maxWidth={'xs'} fullWidth>
        <DialogChildren
          title={dialogContent.title + ' Response'}
          content={<Typography variant="body2">{responseDialog.content}</Typography>}
          actions={
            <Button variant="contained" color="primary" onClick={handleResponseDialogClose}>
              {'ok'}
            </Button>
          }
          onClose={handleResponseDialogClose}
        />
      </Dialog>
    </Box>
  )
})

export default PolicyAndIpAddress
