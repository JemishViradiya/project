import React from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@material-ui/core/Typography'

import makeStyles from '../../styles'
import { isAdditable, isDeletable, isRemovable } from './rules'

const i18NameSpace = 'dlp/common'

export const Message4Addition = ({ selectedItems, existingItems }): JSX.Element => {
  const classes = makeStyles()
  const { t } = useTranslation([i18NameSpace])

  const newItems: any = Object.values(selectedItems).filter((row: any) => isAdditable(row))
  let addingItemText
  let existingItemText
  let newItemsNames

  if (selectedItems.length === 1 && !existingItems.length) {
    return (
      newItems.length === 1 && (
        <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
          {t('setting.dataTypes.dialogs.addToYourList.add_one', { name: newItems[0].name })}
        </Typography>
      )
    )
  } else {
    if (newItems.length === 1) {
      addingItemText = t('setting.dataTypes.dialogs.addToYourList.add_new', { count: newItems.length })
    } else if (newItems.length > 1) {
      addingItemText = t('setting.dataTypes.dialogs.addToYourList.add_new_plural', { count: newItems.length })
    }
    // items TO BE added
    newItemsNames = newItems.map((item: any) => {
      return (
        <Typography paragraph align="left" variant="body2" className={classes.selectedDataTypeName}>
          '{item.name}'
        </Typography>
      )
    })
    if (existingItems.length > 0) {
      existingItemText = t('setting.dataTypes.dialogs.addToYourList.add_existing', { count: existingItems.length })
    }
  }
  // items WONT be added
  const existingItemsNames = existingItems.map((item: any) => {
    return (
      <Typography paragraph align="left" variant="body2" className={classes.selectedDataTypeName}>
        '{item.name}'
      </Typography>
    )
  })

  return (
    <>
      <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
        {addingItemText}
      </Typography>

      {newItemsNames}

      <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
        {existingItemText}
      </Typography>

      {existingItemsNames}

      <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
        {/* eslint-disable-next-line sonarjs/no-duplicate-string */}
        {t('setting.dataTypes.dialogs.confirmation.question')}
      </Typography>
    </>
  )
}

export const Message4Removal = ({ selectedItems }): JSX.Element => {
  const classes = makeStyles()
  const { t } = useTranslation([i18NameSpace])

  const items4Removing: any = Object.values(selectedItems).filter((row: any) => isRemovable(row))
  let text4RemovingItems

  if (items4Removing.length === 1) {
    return (
      <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
        {t('setting.dataTypes.dialogs.removeFromYourList.remove', { name: items4Removing[0].name })}
      </Typography>
    )
  } else if (items4Removing.length > 1) {
    text4RemovingItems = t('setting.dataTypes.dialogs.removeFromYourList.remove_plural', { count: items4Removing.length })
  }
  // items TO BE removed
  // eslint-disable-next-line sonarjs/no-identical-functions
  const removingItemsName = items4Removing.map((item: any) => {
    return (
      <Typography paragraph align="left" variant="body2" className={classes.selectedDataTypeName}>
        '{item.name}'
      </Typography>
    )
  })

  return (
    <>
      <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
        {text4RemovingItems}
      </Typography>

      {removingItemsName}

      <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
        {/* eslint-disable-next-line sonarjs/no-duplicate-string */}
        {t('setting.dataTypes.dialogs.confirmation.question')}
      </Typography>
    </>
  )
}

export const Message4Deletion = ({ selectedItems }): JSX.Element => {
  const classes = makeStyles()
  const { t } = useTranslation([i18NameSpace])

  const items4Deleting: any = Object.values(selectedItems).filter((row: any) => isDeletable(row))
  const itemsUnDeletable = Object.values(selectedItems).filter((row: any) => !isDeletable(row))
  let text4DeletingItems
  let text4UnDeletableItems
  let newItemsNames

  if (selectedItems.length === 1) {
    return (
      items4Deleting.length === 1 && (
        <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
          {t('setting.dataTypes.dialogs.delete.delete_one', { name: items4Deleting[0].name })}
        </Typography>
      )
    )
  } else {
    if (items4Deleting.length === 1) {
      text4DeletingItems = t('setting.dataTypes.dialogs.delete.delete_allowed', { count: items4Deleting.length })
    } else if (items4Deleting.length > 1) {
      text4DeletingItems = t('setting.dataTypes.dialogs.delete.delete_allowed_plural', { count: items4Deleting.length })
    }
    // items TO BE added
    // eslint-disable-next-line sonarjs/no-identical-functions
    newItemsNames = items4Deleting.map((item: any) => {
      return (
        <Typography paragraph align="left" variant="body2" className={classes.selectedDataTypeName}>
          '{item.name}'
        </Typography>
      )
    })
    if (itemsUnDeletable.length === 1) {
      text4UnDeletableItems = t('setting.dataTypes.dialogs.delete.delete_protected', { count: itemsUnDeletable.length })
    } else {
      text4UnDeletableItems = t('setting.dataTypes.dialogs.delete.delete_protected_plural', { count: itemsUnDeletable.length })
    }
  }
  // items WONT be added
  // eslint-disable-next-line sonarjs/no-identical-functions
  const existingItemsNames = itemsUnDeletable.map((item: any) => {
    return (
      <Typography paragraph align="left" variant="body2" className={classes.selectedDataTypeName}>
        '{item.name}'
      </Typography>
    )
  })

  return (
    <>
      <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
        {text4DeletingItems}
      </Typography>

      {newItemsNames}

      <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
        {text4UnDeletableItems}
      </Typography>

      {existingItemsNames}

      <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
        {/* eslint-disable-next-line sonarjs/no-duplicate-string */}
        {t('setting.dataTypes.dialogs.confirmation.question')}
      </Typography>
    </>
  )
}
