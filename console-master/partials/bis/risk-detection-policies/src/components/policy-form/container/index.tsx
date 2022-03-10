import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@material-ui/core/Button'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { FormButtonPanel, ProgressButton } from '@ues/behaviours'

import { useViewContext } from '../../../contexts/view-context'
import { PolicyFormMode } from '../../../model'

const useStyles = makeStyles(theme => ({
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}))

export interface PolicyFormProps {
  readOnly?: boolean
  loading?: boolean
  isDirty?: boolean
  isValid?: boolean
  mode?: PolicyFormMode
  onCancel: () => void | Promise<void>
  onSubmit: () => void
}

export const PolicyFormContainer: React.FC<PolicyFormProps> = memo(
  ({ readOnly, loading, isDirty, isValid, mode, onCancel, onSubmit, children }) => {
    const { t } = useTranslation('bis/shared')
    const styles = useStyles()
    const view = useViewContext()

    const formButtonPanelVisible =
      !view.persistentDrawer.isOpen && !readOnly && (mode === PolicyFormMode.Add || mode === PolicyFormMode.Copy || isDirty)

    return (
      <>
        <div className={styles.container}>{children}</div>

        <FormButtonPanel show={formButtonPanelVisible}>
          <Button onClick={onCancel} variant="outlined" disabled={loading}>
            {t('bis/shared:common.cancel')}
          </Button>
          <ProgressButton
            loading={loading}
            color="primary"
            variant="contained"
            disabled={!isDirty || !isValid || loading}
            onClick={onSubmit}
          >
            {mode === PolicyFormMode.Add ? t('bis/shared:common.add') : t('bis/shared:common.save')}
          </ProgressButton>
        </FormButtonPanel>
      </>
    )
  },
)
