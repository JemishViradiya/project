import PropTypes from 'prop-types'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { ConfirmationModal, ConfirmationModalStyles as styles } from '../../shared'

const sanitizeZoneName = zone => {
  let safeZone = zone
  if (zone.length > 200) {
    safeZone = `${zone.substring(0, 100)}…${zone.substring(zone.length - 100)}`
  }
  return safeZone
}

export const DeletionConfirmation = ({ dialogId, zone, onClose, onDelete, deleteInProgress }) => {
  const { t } = useTranslation()

  const renderQuestion = zone => {
    if (zone.length === 1) {
      // prettier-ignore
      return (
        <Trans i18nKey="geozones.deleteGeozone">
          <span>
            Do you want to delete the <strong data-testid="zone-name">{{ zone: sanitizeZoneName(zone[0]) }}</strong> geozone?
          </span>
        </Trans>
      )
    }
    return (
      <div>
        <div>{t('geozones.confirmDeleteGeozones')}</div>
        <div className={styles.list}>
          {zone.map((name, index) => (
            <div className={styles.item} key={index} data-testid="zone-item">
              <strong>{sanitizeZoneName(name)}</strong>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <ConfirmationModal
      dialogId={dialogId}
      cancelLabel={t('common.cancel')}
      confirmLabel={t('common.delete')}
      onClose={onClose}
      onConfirm={onDelete}
      confirmInProgress={deleteInProgress}
    >
      {renderQuestion(zone)}
    </ConfirmationModal>
  )
}
DeletionConfirmation.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  dialogId: PropTypes.string,
  zone: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]).isRequired,
}
DeletionConfirmation.displayName = 'DeletionConfirmation'
