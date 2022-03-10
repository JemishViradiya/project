/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { useSelector } from 'react-redux'

import { selectCardState } from '../store'

type useDataZoomProps = {
  id: string
}

type DataZoomProps = {
  showDataZoom: boolean
}

const DATA_ZOOM_MENU_OPTION = 'dataZoom'

export const useDataZoom = ({ id }: useDataZoomProps): DataZoomProps => {
  const cardState = useSelector(selectCardState)

  let showDataZoom = false

  const options = cardState[id].options
  if (typeof options !== 'undefined') {
    const dataZoom = options[DATA_ZOOM_MENU_OPTION]
    if (typeof dataZoom !== 'undefined') {
      showDataZoom = dataZoom as boolean
    }
  }

  return { showDataZoom }
}
