import cn from 'classnames'
import React, { useCallback, useMemo } from 'react'
import type { DraggableProvided, DraggableRubric, DraggableStateSnapshot } from 'react-beautiful-dnd'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'

import { Badge, IconButton, makeStyles } from '@material-ui/core'

import type { ActorDetectionType } from '@ues-data/shared-types'
import type { UesTheme } from '@ues/assets'
import { BasicClose } from '@ues/assets'

import { useDetectionLabelFn } from '../../../../hooks/use-detection-label-fn'
import type { DetectionsRiskLevel } from '../../../../model'
import { useDetectionsContext } from '../context'
import { DetectionItem } from '../detection-item'

export interface DetectionsTableItemsProps {
  data: DetectionsRiskLevel
  readOnly?: boolean
}

const useStyles = makeStyles<UesTheme>(theme => ({
  dropContainer: {
    marginBottom: -theme.spacing(1),
    marginTop: -theme.spacing(1),
    minHeight: 46,
    position: 'relative',

    '&::before': {
      background: 'transparent',
      bottom: theme.spacing(1),
      content: '" "',
      display: 'block',
      left: 0,
      position: 'absolute',
      right: 0,
      top: theme.spacing(1),
      transition: theme.transitions.create('background'),
    },

    '&.is-dragging-over::before': {
      background: theme.palette.cyGreen[50],
    },
  },
  itemContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    outline: 'none',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    position: 'relative',

    '& > :first-child': {
      flex: 1,
    },

    '& > :last-child': {
      marginLeft: theme.spacing(2),
    },

    '&.is-dragging > :last-child': {
      visibility: 'hidden',
    },
  },
  itemBadgeWrapper: {
    display: 'block',
  },
}))

export const DetectionsTableItems: React.FC<DetectionsTableItemsProps> = ({ data, readOnly = false }) => {
  const {
    table: { selection, toggleItemSelection, removeItem },
  } = useDetectionsContext()
  const styles = useStyles()
  const detectionLabelFn = useDetectionLabelFn()
  const { t } = useTranslation('general/form')

  const renderDetectionItemFn = useCallback(
    (provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubric: DraggableRubric) => {
      const detectionType = rubric.draggableId as ActorDetectionType
      const draggingCount = snapshot.isDragging && selection.has(detectionType) && selection.size > 1 ? selection.size : undefined

      const handleItemClick = (event: React.MouseEvent) => {
        event.preventDefault()

        if (!readOnly) {
          toggleItemSelection(detectionType)
        }
      }

      const handleDeleteButtonClick = (event: React.MouseEvent) => {
        event.stopPropagation()
        event.preventDefault()

        if (!readOnly) {
          removeItem(detectionType)
        }
      }

      return (
        <div
          ref={provided.innerRef}
          className={cn(styles.itemContainer, snapshot.isDragging ? 'is-dragging' : undefined)}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          onClick={handleItemClick}
          onKeyDown={undefined}
          role="button"
          tabIndex={0}
        >
          <Badge
            aria-label={detectionLabelFn(detectionType)}
            color="primary"
            badgeContent={draggingCount}
            className={styles.itemBadgeWrapper}
          >
            <DetectionItem detectionType={detectionType} selected={!readOnly && selection.has(detectionType)} />
          </Badge>
          {readOnly ? null : (
            <IconButton
              aria-label={`${detectionLabelFn(detectionType)} ${t('general/form:commonLabels.delete')}`}
              size="small"
              onClick={handleDeleteButtonClick}
            >
              <BasicClose fontSize="small" />
            </IconButton>
          )}
        </div>
      )
    },
    [detectionLabelFn, readOnly, removeItem, selection, styles.itemBadgeWrapper, styles.itemContainer, t, toggleItemSelection],
  )

  return useMemo(
    () => (
      <Droppable droppableId={data.riskLevel}>
        {(provided, snapshot) => (
          <div
            role="list"
            className={cn(styles.dropContainer, snapshot.isDraggingOver ? 'is-dragging-over' : undefined)}
            ref={provided.innerRef}
          >
            {data.detections.map((detection, index) => (
              <Draggable draggableId={detection.type} index={index} key={detection.type} isDragDisabled={readOnly}>
                {renderDetectionItemFn}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    ),
    [data.detections, data.riskLevel, readOnly, renderDetectionItemFn, styles.dropContainer],
  )
}
