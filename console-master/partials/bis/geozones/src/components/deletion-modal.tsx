import React, { useCallback, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Button, Dialog, Typography } from '@material-ui/core'

import type { GeozonesListEntity } from '@ues-data/bis'
import { DialogChildren } from '@ues/behaviours'

import { useDeleteGeozoneHandler } from '../hooks/use-delete-geozone-handler'

type DeletionModalProps = {
  onClose?: () => void
  show?: boolean
  deletedEntities?: GeozonesListEntity[]
}

export const useDeletionModalHandlers = (data: GeozonesListEntity[] = []) => {
  const hashTable = useMemo(() => new Map(data.map(entity => [entity.id, entity])), [data])
  const [show, setShow] = useState(false)
  const [deletedEntities, setDeletedEntities] = useState<GeozonesListEntity[]>([])

  const closeDeletionModal = useCallback(() => {
    setShow(false)
  }, [])

  const openDeletionModal = useCallback(
    async (ids: string[]) => {
      const entities = ids.map(id => hashTable.get(id)).filter(entity => entity !== undefined)

      if (entities.length === 0) {
        return
      }

      setDeletedEntities(entities)
      setShow(true)
    },
    [hashTable],
  )

  return { props: { show, deletedEntities, onClose: closeDeletionModal }, openDeletionModal }
}

export const DeletionModal: React.FC<DeletionModalProps> = ({ show, onClose, deletedEntities }: DeletionModalProps) => {
  const { t } = useTranslation(['bis/ues', 'general/form'])
  const multipleItems = (deletedEntities?.length ?? 0) > 1
  const geozonesList = multipleItems
    ? deletedEntities.map(geozone => (
        <Typography variant="h4" key={geozone?.id}>
          {geozone?.name}
        </Typography>
      ))
    : null

  const { handler, loading } = useDeleteGeozoneHandler()

  const modalContent =
    deletedEntities?.length > 0 ? (
      multipleItems ? (
        <div>
          <p style={{ marginTop: 0 }}>{t('geozones.deleteDialog.multiMessage')}</p>
          {geozonesList}
        </div>
      ) : (
        <Trans i18nKey="geozones.deleteDialog.singleMessage">
          <span>
            Do you want to remove the <strong data-testid="zone-name">{{ zone: deletedEntities[0]?.name }}</strong> geozone?
          </span>
        </Trans>
      )
    ) : null

  const onConfirm = useCallback(async () => {
    const { error } = await handler(deletedEntities.map(entity => entity.id))

    if (!error) {
      onClose()
    }
  }, [deletedEntities, handler, onClose])

  const dialogTitle = multipleItems ? t('bis/ues:geozones.deleteDialog.multiTitle') : t('bis/ues:geozones.deleteDialog.singleTitle')

  return (
    <Dialog open={show} onClose={onClose} maxWidth="sm" fullWidth={true} aria-label={dialogTitle}>
      <DialogChildren
        title={dialogTitle}
        onClose={onClose}
        content={modalContent}
        actions={
          <>
            <Button variant="outlined" size="medium" onClick={onClose}>
              {t('general/form:commonLabels.cancel')}
            </Button>
            <Button variant="contained" color="primary" type="submit" onClick={onConfirm} disabled={loading}>
              {t('general/form:commonLabels.remove')}
            </Button>
          </>
        }
      />
    </Dialog>
  )
}
