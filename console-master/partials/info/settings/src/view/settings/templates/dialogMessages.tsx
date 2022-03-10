import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

import type { Template } from '@ues-data/dlp'

import makeStyles from '../../styles'
import { isAddable, isDeletable, isRemovable } from './rules'

interface MessageProps {
  selectedItems: Item[]
  associatedItemGuids?: string[]
}

type Item = Template

const i18NameSpace = 'dlp/common'
const CAN_BE_ADD = 'can_be_add'
const CAN_NOT_BE_ADD = 'can_not_be_add'
const CUSTOM_CAN_NOT_BE_ADD = 'custom_can_not_be_add'
const CAN_BE_REMOVE = 'can_be_remove'
const CAN_NOT_BE_REMOVE = 'can_not_be_remove'
const CUSTOM_CAN_NOT_BE_REMOVE = 'custom_can_not_be_remove'

interface MessageElementProps {
  items: Item[]
  singularText: string
  pluralText: string
}

const MessageElement: React.FC<MessageElementProps> = ({ items, singularText, pluralText }) => {
  const classes = makeStyles()
  return (
    <Box className={classes.box}>
      {/* singular */}
      {items.length === 1 && (
        <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
          {singularText}
        </Typography>
      )}

      {/* plural */}
      {items.length > 1 && (
        <>
          <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
            {pluralText}
          </Typography>
          {items.map((item: Item) => {
            return (
              <Typography paragraph align="left" variant="body2" className={classes.selectedTemplateName} key={item.guid}>
                '{item.name}'
              </Typography>
            )
          })}
        </>
      )}
    </Box>
  )
}

const ConfirmationQuestion = (): JSX.Element => {
  const { t } = useTranslation([i18NameSpace])
  const classes = makeStyles()
  return (
    <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
      {/* eslint-disable-next-line sonarjs/no-duplicate-string */}
      {t('setting.template.dialogs.confirmation.question')}
    </Typography>
  )
}

export const Message4Addition: React.FC<MessageProps> = ({ selectedItems, associatedItemGuids }): JSX.Element => {
  const { t } = useTranslation([i18NameSpace])
  const classes = makeStyles()
  const items4Adding: Item[] = Object.values(selectedItems).filter(
    (row: Item) => isAddable(row) && !associatedItemGuids.includes(row.guid),
  )
  const associatedItems: Item[] = Object.values(selectedItems).filter(
    (row: Item) => isAddable(row) && associatedItemGuids.includes(row.guid),
  )
  const customItems: Item[] = Object.values(selectedItems).filter((row: Item) => !isAddable(row))

  // singular item selected
  if (selectedItems.length === 1) {
    const text =
      items4Adding.length === 1 ? `_singular.${CAN_BE_ADD}` : associatedItems.length === 1 ? CAN_NOT_BE_ADD : CUSTOM_CAN_NOT_BE_ADD
    return (
      <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
        {t(`setting.template.dialogs.addToYourList.${text}`, { name: selectedItems[0]?.name })}
      </Typography>
    )
  }

  // plural items selected
  return (
    <>
      {/* items WILL be added */}
      {items4Adding.length > 0 && (
        <MessageElement
          items={items4Adding}
          singularText={t(`setting.template.dialogs.addToYourList.add.${CAN_BE_ADD}`, { name: items4Adding[0]?.name })}
          pluralText={t(`setting.template.dialogs.addToYourList.add_plural.${CAN_BE_ADD}`, { count: items4Adding.length })}
        />
      )}

      {/* items WONT be added */}
      {associatedItems.length > 0 && (
        <MessageElement
          items={associatedItems}
          singularText={t(`setting.template.dialogs.addToYourList.add.${CAN_NOT_BE_ADD}`, {
            name: associatedItems[0]?.name,
          })}
          pluralText={t(`setting.template.dialogs.addToYourList.add_plural.${CAN_NOT_BE_ADD}`, {
            count: associatedItems.length,
          })}
        />
      )}
      {/* custom items CANNOT be added */}
      {customItems.length > 0 && (
        <MessageElement
          items={customItems}
          singularText={t(`setting.template.dialogs.addToYourList.add.${CUSTOM_CAN_NOT_BE_ADD}`, { name: customItems[0]?.name })}
          pluralText={t(`setting.template.dialogs.addToYourList.add_plural.${CUSTOM_CAN_NOT_BE_ADD}`, {
            count: customItems.length,
          })}
        />
      )}
      <ConfirmationQuestion />
    </>
  )
}

export const Message4Removal: React.FC<MessageProps> = ({ selectedItems, associatedItemGuids }): JSX.Element => {
  const { t } = useTranslation([i18NameSpace])
  const classes = makeStyles()
  const items4Removing: Item[] = Object.values(selectedItems).filter(
    (row: Item) => isRemovable(row) && associatedItemGuids.includes(row.guid),
  )
  const disassociatedItems: Item[] = Object.values(selectedItems).filter(
    (row: Item) => isRemovable(row) && !associatedItemGuids.includes(row.guid),
  )
  const customItems: Item[] = Object.values(selectedItems).filter((row: Item) => !isRemovable(row))

  // singular item selected
  if (selectedItems.length === 1) {
    const text =
      items4Removing.length === 1
        ? `_singular.${CAN_BE_REMOVE}`
        : disassociatedItems.length === 1
        ? CAN_NOT_BE_REMOVE
        : CUSTOM_CAN_NOT_BE_REMOVE

    return (
      <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
        {t(`setting.template.dialogs.removeFromYourList.remove${text}`, { name: selectedItems[0]?.name })}
      </Typography>
    )
  }

  // plural items selected
  return (
    <>
      {/* items WILL be removed */}
      {items4Removing.length > 0 && (
        <MessageElement
          items={items4Removing}
          singularText={t(`setting.template.dialogs.removeFromYourList.remove.${CAN_BE_REMOVE}`, { name: items4Removing[0]?.name })}
          pluralText={t(`setting.template.dialogs.removeFromYourList.remove_plural.${CAN_BE_REMOVE}`, {
            count: items4Removing.length,
          })}
        />
      )}

      {/* items WONT be removed */}
      {disassociatedItems.length > 0 && (
        <MessageElement
          items={disassociatedItems}
          singularText={t(`setting.template.dialogs.removeFromYourList.remove.${CAN_NOT_BE_REMOVE}`, {
            name: disassociatedItems[0]?.name,
          })}
          pluralText={t(`setting.template.dialogs.removeFromYourList.remove_plural.${CAN_NOT_BE_REMOVE}`, {
            count: disassociatedItems.length,
          })}
        />
      )}

      {/* custom items CANNOT be removed */}
      {customItems.length > 0 && (
        <MessageElement
          items={customItems}
          singularText={t(`setting.template.dialogs.removeFromYourList.remove.${CUSTOM_CAN_NOT_BE_REMOVE}`, {
            name: customItems[0]?.name,
          })}
          pluralText={t(`setting.template.dialogs.removeFromYourList.remove_plural.${CUSTOM_CAN_NOT_BE_REMOVE}`, {
            count: customItems.length,
          })}
        />
      )}
      <ConfirmationQuestion />
    </>
  )
}

export const Message4Deletion: React.FC<MessageProps> = ({ selectedItems }): JSX.Element => {
  const { t } = useTranslation([i18NameSpace])
  const classes = makeStyles()
  const items4Deleting: Item[] = Object.values(selectedItems).filter((row: Item) => isDeletable(row))
  const itemsUnDeletable = Object.values(selectedItems).filter((row: Item) => !isDeletable(row))

  // singular item selected
  if (selectedItems.length === 1) {
    const text = items4Deleting.length === 1 ? 'delete_one' : 'delete_protected'
    return (
      items4Deleting.length === 1 && (
        <Typography paragraph align="left" variant="body2" className={classes.numberSelected}>
          {t(`setting.template.dialogs.delete.${text}`, { name: selectedItems[0]?.name })}
        </Typography>
      )
    )
  }

  // plural items selected
  return (
    <>
      {/* items WILL be deleted */}
      {items4Deleting.length > 0 && (
        <MessageElement
          items={items4Deleting}
          singularText={t(`setting.template.dialogs.delete.delete_allowed`, { name: items4Deleting[0]?.name })}
          pluralText={t(`setting.template.dialogs.delete.delete_allowed_plural`, { count: items4Deleting.length })}
        />
      )}

      {/* Predefined items WONT be deleted */}
      {itemsUnDeletable.length > 0 && (
        <MessageElement
          items={itemsUnDeletable}
          singularText={t(`setting.template.dialogs.delete.delete_protected`, { name: itemsUnDeletable[0]?.name })}
          pluralText={t(`setting.template.dialogs.delete.delete_protected_plural`, { count: itemsUnDeletable.length })}
        />
      )}

      <ConfirmationQuestion />
    </>
  )
}
