import slice from 'lodash/slice'
import { useCallback, useState } from 'react'

const handleHover = (ref, index, moveCard) => {
  return (item, monitor) => {
    if (!ref.current) {
      return
    }

    const dragIndex = item.index
    const hoverIndex = index

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }

    // Determine rectangle on screen
    const hoverBoundingRect = ref.current.getBoundingClientRect()

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

    // Determine mouse position
    const clientOffset = monitor.getClientOffset()

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    if ((dragIndex < hoverIndex && hoverClientY < hoverMiddleY) || (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)) {
      return
    }

    // Time to actually perform the action
    moveCard(dragIndex, hoverIndex)

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    item.index = hoverIndex
  }
}

const useDragDrop = data => {
  const [cards, setCards] = useState(data)

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = cards[dragIndex]
      const reorderedCards = slice(cards)
      reorderedCards.splice(dragIndex, 1)

      let hoverIndexInteger = parseInt(hoverIndex, 10)
      hoverIndexInteger = hoverIndexInteger > 0 ? hoverIndexInteger : 0
      reorderedCards.splice(hoverIndexInteger, 0, dragCard)

      setCards(reorderedCards)
    },
    [cards],
  )

  const stepUp = useCallback(
    index => {
      moveCard(index, index - 1)
    },
    [moveCard],
  )

  const stepDown = useCallback(
    index => {
      moveCard(index, index + 1)
    },
    [moveCard],
  )

  return { cards, moveCard, stepUp, stepDown }
}

export { handleHover, useDragDrop }
