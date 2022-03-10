//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import Fuse from 'fuse.js'
import { isEmpty, throttle } from 'lodash-es'
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core'

import type { AclCategoryDefinition, AclCategoryDefinitionPartial, AclRuleCategory } from '@ues-data/gateway'
import { Components, Config, Data, Hooks } from '@ues-gateway/shared'
import { BasicCancel, BasicSearch, ChevronDown } from '@ues/assets'

import useStyles from './styles'

const { useCategoriesData } = Hooks
const { LoadingProgress, EntityDetailsViewContext } = Components
const { getInitialAclRuleCategories, updateLocalAclRuleData } = Data
const { GATEWAY_TRANSLATIONS_KEY } = Config

type Selection = Record<string, Set<string>>

interface CategoryCheckboxProps {
  checked: boolean
  definition: AclCategoryDefinitionPartial
  indeterminate?: boolean
  marked?: boolean
  onChange: () => void
}

const CategoryCheckbox: React.FC<CategoryCheckboxProps> = memo(
  ({ checked, definition: { id, name }, indeterminate = false, marked, onChange }) => {
    const { shouldDisableFormField } = useContext(EntityDetailsViewContext)

    return (
      <FormControlLabel
        disabled={shouldDisableFormField}
        onClick={event => {
          event.stopPropagation()
          event.preventDefault()
          onChange()
        }}
        key={id}
        control={<Checkbox size="small" color="secondary" indeterminate={indeterminate} checked={checked} />}
        label={<Typography>{marked ? <strong>{name}</strong> : name}</Typography>}
      />
    )
  },
)

interface CategorySelectorProps {
  categoryDefinition: AclCategoryDefinition
  expanded?: boolean
  onChange?: (categorySelectionUpdate: Selection) => void
  searchValue?: string
  selection?: Selection
}

const CategorySelector: React.FC<CategorySelectorProps> = memo(
  ({ categoryDefinition, onChange, selection, searchValue, expanded }) => {
    const classes = useStyles()

    const [localExpanded, setLocalExpanded] = useState<boolean>(false)

    const selectedSubcategoriesLength = selection?.[categoryDefinition.id]?.size
    const hasAllSubcategoriesSelected =
      selectedSubcategoriesLength === categoryDefinition.subcategories.length || selectedSubcategoriesLength === 0
    const hasIndeterminateSelectionState = selectedSubcategoriesLength > 0 && !hasAllSubcategoriesSelected

    const checkIsSubcategorySelected = (subcategoryId: string) =>
      hasAllSubcategoriesSelected || !!selection?.[categoryDefinition.id]?.has(subcategoryId)

    const initializeSelection = data => (data[categoryDefinition.id] = new Set())

    const clearSelection = data => delete data[categoryDefinition.id]

    const handleCategoryCheckboxChange = () => {
      const update = { ...selection }

      if (update[categoryDefinition.id]) {
        clearSelection(update)
      } else {
        initializeSelection(update)
      }

      onChange(update)
    }

    const handleSubcategoryCheckboxChange = (subcategoryDefinition: AclCategoryDefinitionPartial) => {
      const update = { ...selection }

      const hasSubcategorySelected = update[categoryDefinition.id]?.has(subcategoryDefinition.id)

      if (hasSubcategorySelected) {
        update[categoryDefinition.id].delete(subcategoryDefinition.id)
      }

      if (!hasSubcategorySelected && !hasAllSubcategoriesSelected) {
        if (!update[categoryDefinition.id]) {
          initializeSelection(update)
        }
        update[categoryDefinition.id].add(subcategoryDefinition.id)
      }

      if (!hasSubcategorySelected && hasAllSubcategoriesSelected) {
        const filteredSubcategories = categoryDefinition.subcategories.reduce(
          (acc, { id }) => (id === subcategoryDefinition.id ? acc : [...acc, id]),
          [],
        )
        update[categoryDefinition.id] = new Set([...filteredSubcategories])
      }

      if (update[categoryDefinition.id].size === 0) {
        clearSelection(update)
      }

      onChange(update)
    }

    useEffect(() => {
      setLocalExpanded(expanded)
    }, [expanded])

    return (
      <Accordion expanded={localExpanded} onClick={() => setLocalExpanded(!localExpanded)}>
        <AccordionSummary expandIcon={<ChevronDown />}>
          <Box className={classes.categoryContainer}>
            <CategoryCheckbox
              definition={categoryDefinition}
              indeterminate={hasIndeterminateSelectionState}
              checked={hasAllSubcategoriesSelected}
              onChange={handleCategoryCheckboxChange}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={classes.subcategoriesContainer}>
            {categoryDefinition.subcategories.map((subcategoryDefinition, index) => (
              <CategoryCheckbox
                key={index}
                definition={subcategoryDefinition}
                checked={checkIsSubcategorySelected(subcategoryDefinition.id)}
                onChange={() => handleSubcategoryCheckboxChange(subcategoryDefinition)}
                marked={!!searchValue && subcategoryDefinition.name.toLowerCase().includes(searchValue.toLowerCase())}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    )
  },
)

const AclCategoriesBuilder: React.FC = memo(() => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const initialAclRuleCategories = useSelector(getInitialAclRuleCategories)
  const { categories, loading } = useCategoriesData()

  const [categoriesContentExpanded, setCategoriesContentExpanded] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>()
  const [searchedCategories, setSearchedCategories] = useState<AclCategoryDefinition[]>([])
  const [selection, setSelection] = useState<Selection>({})

  useEffect(() => {
    setSearchedCategories(categories)
  }, [categories])

  useEffect(() => {
    if (initialAclRuleCategories?.length) {
      setSelection(
        initialAclRuleCategories?.reduce(
          (acc, category) => ({ ...acc, [category.id]: new Set(category?.subcategories ?? []) }),
          {},
        ),
      )
    }
  }, [initialAclRuleCategories])

  const searchInstance = useMemo(
    () =>
      new Fuse(categories, {
        threshold: 0.1,
        distance: 1000,
        keys: ['name', 'subcategories.name'],
      }),
    [categories],
  )

  const throttledHandleLocalChange = useMemo(
    () =>
      throttle((update: Selection) => {
        const categoriesUpdate: AclRuleCategory[] = Object.entries(update).map(([categoryId, subcategoryIdsSet]) => ({
          id: categoryId,
          ...(subcategoryIdsSet.size > 0 ? { subcategories: [...subcategoryIdsSet] } : {}),
        }))
        dispatch(updateLocalAclRuleData({ criteria: { categorySet: { categories: categoriesUpdate } } }))
      }, 1000),
    [dispatch],
  )

  const handleSelectionChange = useCallback(
    (update: Selection) => {
      setSelection(update)
      throttledHandleLocalChange(update)
    },
    [throttledHandleLocalChange],
  )

  const handleSearchedCategoriesChange = (value: string) => {
    let searchedResult: AclCategoryDefinition[] = []

    if (isEmpty(value)) {
      searchedResult = categories
      setCategoriesContentExpanded(false)
    } else {
      searchedResult = searchInstance.search(value).map(({ item }) => item)
      setCategoriesContentExpanded(true)
    }

    setSearchValue(value)
    setSearchedCategories(searchedResult)
  }

  return (
    <>
      <div className={classes.container}>
        {loading ? (
          <LoadingProgress alignSelf="center" />
        ) : (
          <>
            <Box className={classes.searchContainer}>
              <TextField
                placeholder={t('acl.categoriesSearchPlaceholder')}
                size="small"
                value={searchValue}
                onChange={event => handleSearchedCategoriesChange(event.target.value)}
                InputProps={{
                  startAdornment: <BasicSearch fontSize="small" />,
                  endAdornment: (
                    <IconButton
                      onClick={() => {
                        handleSearchedCategoriesChange('')
                        setCategoriesContentExpanded(false)
                      }}
                      disabled={!searchValue?.length}
                    >
                      <BasicCancel fontSize="small" />
                    </IconButton>
                  ),
                }}
              />
            </Box>

            {searchedCategories.map((categoryDefinition, index) => (
              <CategorySelector
                key={index}
                selection={selection}
                categoryDefinition={categoryDefinition}
                onChange={handleSelectionChange}
                searchValue={searchValue}
                expanded={categoriesContentExpanded}
              />
            ))}
          </>
        )}
      </div>
      {!loading && (
        <Box mt={2}>
          <FormHelperText component="label">{t('acl.labelAclCategories')}</FormHelperText>
        </Box>
      )}
    </>
  )
})

export default AclCategoriesBuilder
