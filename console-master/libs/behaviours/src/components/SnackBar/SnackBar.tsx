/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { OptionsObject, SnackbarKey, VariantType } from 'notistack'
import { useSnackbar as useNotistackSnackbar } from 'notistack'
import React, { useCallback } from 'react'

import IconButton from '@material-ui/core/IconButton'

import { BasicClose } from '@ues/assets'

import { SnackbarMessage } from './SnackbarMessage'
import { useLocationChange } from './useLocationChange'

const DEFAULT_AUTO_HIDE_DURATION = 5000
const DEFAULT_VARIANT = 'info' as VariantType

export interface SnackbarProviderContext {
  /**
   * Add a standard message to the snackbar. This is not confugurable and will use pre-set options and styling.
   *
   * NOTE: All variants will be auto-dismissed after 5000ms except 'error', which needs to be manually dismissed.
   *
   * @param {string} messageText The text of the message.
   * @param {VariantType} variant The snackbar variant.
   *
   * @returns {SnackbarKey} the snackbar key.
   */
  enqueueMessage: (messageText: string, variant: VariantType) => SnackbarKey

  // /**
  //  * Add a custom message to the snackbar.
  //  *
  //  * This is a highly customizable option, see notistack documentation for available options.
  //  * Notistack: https://iamhosseindhv.com/notistack/
  //  * MUI Snackbar: https://material-ui.com/components/snackbars/#snackbar
  //  *
  //  * @param {string} messageText The text of the message.
  //  * @param {OptionsObject} props The message properties object.
  //  *
  //  * @returns {SnackbarKey} the snackbar key.
  //  */
  // enqueueCustom: (messageText: string, props: OptionsObject) => SnackbarKey

  /**
   * Close an open message
   * @param {id} string The message id
   */
  closeMessage: (id?: string) => void
}

/**
 * A hook used to enqueue a snackbar message. Must be used one level below SnackbarProvder.
 */
export const useSnackbar = (): SnackbarProviderContext => {
  const { enqueueSnackbar, closeSnackbar } = useNotistackSnackbar()
  useLocationChange(closeSnackbar)

  // /**
  //  * Adds a custom message to the queue.
  //  *
  //  * @param {string} messageText The message text.
  //  * @param {OptionsObject} options The snackbar props.
  //  */
  // const enqueueCustom = (messageText: string, props: OptionsObject) => {
  //   if (props.id === undefined) {
  //     props = { ...props, id: new Date().getTime() + Math.random() + '' }
  //   }
  //   return enqueueSnackbar(messageText, props)
  // }

  /**
   * Adds a standard message to the queue.
   * @param {string} messageText The message text.
   * @param {OptionsObject} props  message props.
   */
  const enqueue = (messageText: string, variant: VariantType) => {
    const options = {
      variant: variant ? variant : DEFAULT_VARIANT,
      preventDuplicate: true,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      autoHideDuration: variant === 'error' ? null : DEFAULT_AUTO_HIDE_DURATION,
      content: () => <SnackbarMessage id={messageText} messageText={messageText} variant={variant} />,
      key: messageText,
      action: (
        <IconButton color="inherit" onClick={() => closeSnackbar(messageText)}>
          <BasicClose />
        </IconButton>
      ),
    } as OptionsObject

    //console.log('Enqueue snackbar with options: ' + JSON.stringify)
    return enqueueSnackbar(messageText, options)
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  return {
    enqueueMessage: useCallback((messageText: string, variant: VariantType) => enqueue(messageText, variant), []),
    // enqueueCustom: useCallback(
    //   (messageText: string, props: OptionsObject) =>
    //     enqueueCustom(messageText, props),
    //   [],
    // ),
    closeMessage: useCallback((id: SnackbarKey) => closeSnackbar(id), []),
  }
}
