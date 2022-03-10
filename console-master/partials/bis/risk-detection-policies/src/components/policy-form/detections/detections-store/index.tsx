import { throttle } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { DraggableProvided, DraggableRubric, DraggableStateSnapshot } from 'react-beautiful-dnd'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'

import { Badge, IconButton, makeStyles, TextField, Typography } from '@material-ui/core'

import { useFeatures } from '@ues-data/shared'
import type { ActorDetectionType } from '@ues-data/shared-types'
import type { UesTheme } from '@ues/assets'
import { BasicCancel, BasicSearch } from '@ues/assets'

import { DETECTIONS_CATEGORIES, DETECTIONS_CONFIG } from '../../../../config/detections'
import { useDetectionLabelFn } from '../../../../hooks/use-detection-label-fn'
import { useDetectionsCategoryLabelFn } from '../../../../hooks/use-detections-category-label-fn'
import type { DetectionsCategory, DetectionsCategoryType } from '../../../../model'
import { useDetectionsContext } from '../context'
import { DetectionItem } from '../detection-item'

const useStyles = makeStyles<UesTheme>(theme => ({
  container: {},
  itemContainer: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    outline: 'none',
  },
  categoryTitle: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    color: theme.palette.grey[600],
    margin: 0,
    ...theme.typography.caption,
  },
  badgeWrapper: {
    display: 'block',
  },
  searchInput: {
    width: '100%',
  },
}))

type DraggableItem = { categoryType: DetectionsCategoryType } | { detectionType: ActorDetectionType }

const DetectionsSearchComponent: React.FC<{ onChange: (search: string) => void }> = ({ onChange }) => {
  const { t } = useTranslation('general/form')
  const [search, setSearch] = useState('')

  const onChangeThrottled = useMemo(() => throttle(onChange, 400), [onChange])
  const clearSearch = useCallback(() => {
    onChange('')
    setSearch('')
  }, [onChange])

  useEffect(() => {
    onChangeThrottled(search)
  }, [onChangeThrottled, search])

  return (
    <TextField
      fullWidth
      className="no-label"
      value={search}
      onInput={event => setSearch((event.target as HTMLInputElement).value)}
      inputProps={{
        'aria-label': "{t('general/form:commonLabels.search')}",
      }}
      InputProps={{
        startAdornment: <BasicSearch />,
        endAdornment: search ? (
          <IconButton onClick={clearSearch} aria-label={t('general/form:commonLabels.cancel')}>
            <BasicCancel />
          </IconButton>
        ) : null,
      }}
    />
  )
}

export const DetectionsStore: React.FC = () => {
  const categoryLabelFn = useDetectionsCategoryLabelFn()
  const detectionLabelFn = useDetectionLabelFn()
  const {
    value,
    store: { selection, toggleItemSelection },
  } = useDetectionsContext()
  const { isEnabled: isFeatureEnabled } = useFeatures()

  const styles = useStyles()

  const [search, setSearch] = useState('')

  const addedDetections = useMemo(() => {
    const items = new Set<ActorDetectionType>()

    for (const data of value) {
      for (const detection of data.detections) {
        items.add(detection.type)
      }
    }

    return items
  }, [value])

  const filteredCategories = useMemo(() => {
    const searchLowerCase = search.toLocaleLowerCase()

    return DETECTIONS_CATEGORIES.reduce<DetectionsCategory[]>((acc, category) => {
      const detections = category.detections.filter(detectionType => {
        const config = DETECTIONS_CONFIG[detectionType]
        const name = detectionLabelFn(detectionType).toLocaleLowerCase()

        return (
          !addedDetections.has(detectionType) &&
          !config.disabled &&
          !config.features?.some(featureName => !isFeatureEnabled(featureName)) &&
          (!search || name.includes(searchLowerCase))
        )
      })

      return detections.length > 0 ? [...acc, { ...category, detections }] : acc
    }, [])
  }, [search, detectionLabelFn, addedDetections, isFeatureEnabled])

  const renderDetectionItemFn = useCallback(
    (provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubric: DraggableRubric) => {
      const detectionType = rubric.draggableId as ActorDetectionType
      const draggingCount = snapshot.isDragging && selection.has(detectionType) && selection.size > 1 ? selection.size : undefined

      const dispatchToggleSelection = (event: React.MouseEvent | React.KeyboardEvent) => {
        event.preventDefault()

        toggleItemSelection(detectionType)
      }

      return (
        <div
          className={styles.itemContainer}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          onClick={dispatchToggleSelection}
          onKeyDown={undefined}
          role="button"
          tabIndex={0}
        >
          <Badge
            aria-label={detectionLabelFn(detectionType)}
            color="primary"
            badgeContent={draggingCount}
            className={styles.badgeWrapper}
          >
            <DetectionItem detectionType={detectionType} selected={selection.has(detectionType)} />
          </Badge>
        </div>
      )
    },
    [selection, styles.badgeWrapper, styles.itemContainer, toggleItemSelection, detectionLabelFn],
  )

  const draggableItems = useMemo(() => {
    const flattenedItems = filteredCategories.reduce<DraggableItem[]>(
      (acc, data) => [...acc, { categoryType: data.type }, ...data.detections.map(detectionType => ({ detectionType }))],
      [],
    )

    return flattenedItems.map((item, index) => {
      if ('categoryType' in item) {
        const categoryLabel = categoryLabelFn(item.categoryType)

        return (
          <Draggable draggableId={item.categoryType} index={index} key={item.categoryType} isDragDisabled>
            {provided => {
              return (
                <Typography
                  variant="h3"
                  className={styles.categoryTitle}
                  innerRef={provided.innerRef}
                  {...provided.dragHandleProps}
                  {...provided.draggableProps}
                >
                  {categoryLabel}
                </Typography>
              )
            }}
          </Draggable>
        )
      }

      return (
        <Draggable draggableId={item.detectionType} index={index} key={item.detectionType}>
          {renderDetectionItemFn}
        </Draggable>
      )
    })
  }, [filteredCategories, renderDetectionItemFn, categoryLabelFn, styles.categoryTitle])

  const searchComponent = useMemo(() => {
    return <DetectionsSearchComponent onChange={setSearch} />
  }, [])

  const list = useMemo(
    () => (
      <Droppable droppableId="store" isDropDisabled renderClone={renderDetectionItemFn}>
        {({ innerRef: droppableRef, placeholder }) => (
          <div ref={droppableRef} className={styles.container}>
            {draggableItems}
            {placeholder}
          </div>
        )}
      </Droppable>
    ),
    [draggableItems, renderDetectionItemFn, styles.container],
  )

  return (
    <>
      {searchComponent}
      {list}
    </>
  )
}
