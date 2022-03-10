import union from 'lodash-es/union'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { List, ListItem, ListItemText } from '@material-ui/core'

import { useControlledDialog } from '@ues/behaviours'

import { NEW_FEATURES_BUGFIXES } from '../config/consts/dialogIds'
import bugfixesImage from '../static/bugFixes.svg'
import featuresImage from '../static/newFeatures.svg'
import useGlobalClientParams from './hooks/useGlobalClientParams'
import useLocalStorage, { LocalStorageKeys } from './hooks/useLocalStorage'
import styles from './Notification.module.less'
import Button from './widgets/Button'
import Modal from './widgets/Modal'

const notificationModalPage = {
  FEATURES: 'features',
  BUGFIXES: 'bugfixes',
}

const UpdateNotificationModal = memo(({ dialogId, onClose, newFeatures, bugfixes, showBugfixes, showNewFeatures }) => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(showNewFeatures ? notificationModalPage.FEATURES : notificationModalPage.BUGFIXES)
  const isFeaturesPage = currentPage === notificationModalPage.FEATURES
  const isBugfixesPage = currentPage === notificationModalPage.BUGFIXES
  const showSaveButton = (isFeaturesPage && !showBugfixes) || isBugfixesPage

  const onBackClick = useCallback(() => setCurrentPage(notificationModalPage.FEATURES), [])
  const onNextClick = useCallback(() => setCurrentPage(notificationModalPage.BUGFIXES), [])

  const { open, onClose: controlledOnClose } = useControlledDialog({
    dialogId,
    onClose,
  })

  return (
    <Modal
      open={open}
      onClose={controlledOnClose}
      size="md"
      title={t(isFeaturesPage ? 'common.notification.whatsNew' : 'common.notification.fixedIssues')}
      disableEscapeKeyDowns
      actions={
        <>
          {isBugfixesPage && showNewFeatures && <Button onClick={onBackClick}>{t('common.back')}</Button>}
          {isFeaturesPage && showBugfixes && (
            <Button className={styles.rightButton} color="primary" onClick={onNextClick}>
              {t('common.notification.next')}
            </Button>
          )}
          {showSaveButton && (
            <Button className={styles.rightButton} color="primary" onClick={controlledOnClose}>
              {t('common.notification.close')}
            </Button>
          )}
        </>
      }
    >
      <>
        <img src={isFeaturesPage ? featuresImage : bugfixesImage} className={styles.graphic} alt="" />
        {isFeaturesPage && (
          <List disablePadding>
            {newFeatures.map(({ id, header, text }) => (
              <ListItem key={id} className={styles.item}>
                <ListItemText primaryTypographyProps={{ variant: 'subtitle1' }}>
                  <header>{t(header)}</header>
                  <span dangerouslySetInnerHTML={{ __html: t(text) }} />
                </ListItemText>
              </ListItem>
            ))}
          </List>
        )}
        {isBugfixesPage && (
          <ul className={styles.bugfixes}>
            {bugfixes.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </>
    </Modal>
  )
})

const Notification = memo(() => {
  const {
    notification: { items: newFeatures = [], bugfixes: { id: bugfixesId, items: bugfixes = [] } = {} } = {},
  } = useGlobalClientParams()
  const [seenNotificationIds, saveSeenNotificationIds] = useLocalStorage(LocalStorageKeys.NOTIFICATION_IDS)
  const seenNotificationIdsArray = useMemo(() => (Array.isArray(seenNotificationIds) ? seenNotificationIds : []), [
    seenNotificationIds,
  ])
  const filteredNewFeatures = newFeatures.filter(item => !seenNotificationIdsArray.some(id => id === item.id))
  const showBugfixes = !seenNotificationIdsArray.some(id => id === bugfixesId) && Array.isArray(bugfixes) && bugfixes.length > 0
  const [dialog, setDialog] = useState({
    ...((filteredNewFeatures.length > 0 || showBugfixes) && { dialogId: NEW_FEATURES_BUGFIXES }),
  })
  const closeDialog = useCallback(() => setDialog({}), [])

  const onCloseModal = useCallback(() => {
    const idsToSave = newFeatures.map(item => item.id)
    const bugfixesIdToSave = bugfixesId ? [bugfixesId] : []
    saveSeenNotificationIds(union(seenNotificationIdsArray, idsToSave, bugfixesIdToSave))
    closeDialog()
  }, [newFeatures, bugfixesId, saveSeenNotificationIds, seenNotificationIdsArray, closeDialog])

  return dialog.dialogId ? (
    <UpdateNotificationModal
      dialogId={dialog.dialogId}
      newFeatures={filteredNewFeatures}
      showBugfixes={showBugfixes}
      showNewFeatures={filteredNewFeatures.length > 0}
      bugfixes={bugfixes}
      onClose={onCloseModal}
    />
  ) : null
})

export default Notification
