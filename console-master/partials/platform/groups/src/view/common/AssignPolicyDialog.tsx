import { remove } from 'lodash-es'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  Checkbox,
  Dialog,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core'

import type { ReconciliationEntity } from '@ues-data/shared'
import { defaultSelectProps } from '@ues/assets'

import { DialogContent } from './DialogContent'

export const AssignPolicyDialog = ({ open, onClose, onSave, reconciliationType, assigned, assignable }) => {
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const title =
    reconciliationType === 'RANKING' && assigned.length > 0 ? t('groups.policyAssign.replace') : t('groups.policyAssign.assign')
  const [selected, setSelected] = useState<ReconciliationEntity[]>([])
  const [error, setError] = useState(null)
  const assignedIds = assigned ? assigned.map(a => a.entityId) : []
  const filteredAssignable = assignable ? assignable.filter(a => !assignedIds.includes(a.entityId)) : []

  const RecoSelect = () => {
    const onChange = e => setSelected([e.target.value])

    return (
      <FormControl size="small" variant="filled" fullWidth error={error}>
        <InputLabel id="label-id">{t('groups.policyAssign.policy')}</InputLabel>
        <Select
          labelId="label-id"
          id="select-id"
          label={t('groups.policyAssign.policy')}
          value={selected[0] ?? ''}
          renderValue={(value: any) => value.name}
          onChange={onChange}
          {...defaultSelectProps}
        >
          {filteredAssignable.map(item => (
            <MenuItem key={item.entityId} value={item}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }

  const CumulativeList = () => {
    const handleToggle = (value: ReconciliationEntity) => () => {
      const current = selected.find(s => s.entityId === value.entityId)
      const newSelected = [...selected]

      if (current) {
        remove(newSelected, p => p.entityId === value.entityId)
      } else {
        newSelected.push(value)
      }

      setSelected(newSelected)
    }

    return (
      <List disablePadding>
        {filteredAssignable.map(value => {
          const labelId = `checkbox-list-label-${value.entityId}`

          return (
            <ListItem key={value.entityId} role={undefined} dense disableGutters button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={selected.find(s => s.entityId === value.entityId) !== undefined}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.name} />
            </ListItem>
          )
        })}
      </List>
    )
  }

  const validate = () => {
    if (selected.length < 1) {
      setError(t('groups.policyAssign.notSelectedError'))
      return false
    }
    return true
  }

  const onCloseDialog = () => {
    onClose()
    setError(null)
  }

  useEffect(() => {
    setSelected([])
  }, [open])

  return (
    <Dialog open={open} onClose={onCloseDialog} maxWidth="xs" fullWidth>
      <DialogContent
        title={title}
        onClose={onCloseDialog}
        content={
          <>
            <Typography variant="body2" color="error">
              {error}
            </Typography>
            {reconciliationType === 'RANKING' ? <RecoSelect /> : <CumulativeList />}
          </>
        }
        actions={
          <>
            <Button variant="outlined" onClick={onCloseDialog}>
              {t('general/form:commonLabels.cancel')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={() => {
                if (validate()) {
                  onSave(selected, reconciliationType)
                  onCloseDialog()
                }
              }}
            >
              {t('general/form:commonLabels.save')}
            </Button>
          </>
        }
      />
    </Dialog>
  )
}
