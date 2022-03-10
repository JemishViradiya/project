import { slice } from 'lodash-es'
import { useCallback, useState } from 'react'

const useDragDrop = data => {
  const [cards, setCards] = useState(data)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const moveCard = useCallback(handleMoveCard(cards, setCards), [cards])

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

const handleMoveCard = (cards, setCards) => {
  return (dragIndex, hoverIndex) => {
    const dragCard = cards[dragIndex]
    const reorderedCards = slice(cards)
    reorderedCards.splice(dragIndex, 1)

    let hoverIndexInteger = parseInt(hoverIndex, 10)
    hoverIndexInteger = hoverIndexInteger > 0 ? hoverIndexInteger : 0
    reorderedCards.splice(hoverIndexInteger, 0, dragCard)

    setCards(reorderedCards)
  }
}

export { useDragDrop }
