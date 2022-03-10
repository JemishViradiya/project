import React, { useEffect, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { Grid, TextField } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import MenuIcon from '@material-ui/icons/Menu'

import { CARD_TYPES } from './dragdrop.constants'
import { handleHover } from './dragdrop.utils'

const Row = ({ id, text, index, moveCard, stepUp, stepDown }) => {
  const ref = useRef(null)
  const [indexValue, setIndexValue] = useState(index + 1)

  useEffect(() => {
    // make sure the cards input shows the correct new index
    setIndexValue(index + 1)
  }, [index])

  const [, drop] = useDrop({
    accept: CARD_TYPES.RULE,
    hover: handleHover(ref, index, moveCard),
  })

  const handleKeyDown = e => {
    // commit the change when user presses Enter
    if (e.key === 'Enter') {
      moveCard(index, e.target.value - 1)
    }
  }

  const handleOnBlur = e => {
    // commit the change when user leaves the input
    moveCard(index, e.target.value - 1)
  }

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: CARD_TYPES.RULE, id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // for hiding current dragged element
  const opacity = isDragging ? 0 : 1

  return (
    <TableRow
      direction="row"
      ref={node => {
        ref.current = node
        preview(drop(node))
      }}
      style={{ opacity }}
    >
      <TableCell padding="checkbox" className="dragAndDrop-handle">
        <div ref={node => drag(drop(node))}>
          <MenuIcon />
        </div>
      </TableCell>
      <TableCell padding="checkbox">
        <TextField
          className="dragAndDrop-input"
          variant="outlined"
          margin="dense"
          value={indexValue}
          onChange={e => {
            setIndexValue(e.target.value)
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleOnBlur}
        />
      </TableCell>
      <TableCell padding="checkbox">
        <Grid container direction="column">
          <IconButton edge="end" size="small" onClick={() => stepUp(index)}>
            <ArrowDropUpIcon />
          </IconButton>
          <IconButton edge="end" size="small" onClick={() => stepDown(index)}>
            <ArrowDropDownIcon />
          </IconButton>
        </Grid>
      </TableCell>
      <TableCell>{text}</TableCell>
    </TableRow>
  )
}

export default Row
