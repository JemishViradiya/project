/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { useSelector } from 'react-redux'

import { selectCardState } from '../store'

type useTotalCountProps = {
  id: string
}

type TotalCountProps = {
  showTotalCount: boolean
}

const TOTAL_COUNT_MENU_OPTION = 'totalCount'

export const useTotalCount = ({ id }: useTotalCountProps): TotalCountProps => {
  const cardState = useSelector(selectCardState)

  let showTotalCount = false

  const options = cardState[id].options
  if (typeof options !== 'undefined') {
    const totalCount = options[TOTAL_COUNT_MENU_OPTION]
    if (typeof totalCount !== 'undefined') {
      showTotalCount = totalCount as boolean
    }
  }

  return { showTotalCount }
}
