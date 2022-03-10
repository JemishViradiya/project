import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@material-ui/core'

type UseRankableInput = {
  rankMode: boolean
  setRankMode: (m: boolean) => void
  resetDrag: () => void
  updateRank: (ranks: { entityId: string; rank: number }[]) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  rankingSaved: boolean
  setRankingSaved: (boolean) => void
}

type UseRankableReturn = {
  show: boolean
  children: React.ReactNode
}

export const useRankable = ({
  rankMode,
  setRankMode,
  resetDrag,
  updateRank,
  data,
  rankingSaved,
  setRankingSaved = () => {
    //do nothing if undefined
  },
}: UseRankableInput): UseRankableReturn => {
  const { t } = useTranslation(['profiles'])

  const cancelRank = useCallback(() => {
    setRankMode(false)
    resetDrag()
    setRankingSaved(true)
  }, [resetDrag, setRankMode, setRankingSaved])

  const submitRank = useCallback(() => {
    setRankMode(false)
    setRankingSaved(true)
    updateRank(data.map(p => ({ entityId: p.entityId, rank: p.rank })))
  }, [data, setRankMode, updateRank, setRankingSaved])

  const getButtons = useMemo(() => {
    return (
      <>
        <Button variant="outlined" onClick={cancelRank}>
          {t('policy.cancelButton')}
        </Button>
        <Button variant="contained" color="primary" onClick={submitRank} disabled={rankingSaved}>
          {t('policy.saveButton')}
        </Button>
      </>
    )
  }, [cancelRank, submitRank, t, rankingSaved])

  return {
    show: rankMode,
    children: getButtons,
  }
}
