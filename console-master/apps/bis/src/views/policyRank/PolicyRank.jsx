import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import { Button, ButtonPanel, Container, LayoutHeader, Loading, MessageSnackbar, Section } from '../../shared'
import { PolicyHeader } from '../policies/Header'
import RankTable from './components/RankTable'
import styles from './PolicyRank.module.less'

const PolicyRank = ({
  loading,
  updating,
  handleCancel,
  canEdit,
  snackbar,
  policies,
  handleSubmit,
  handleSnackbarClose,
  handleRankChange,
}) => {
  const { t } = useTranslation()

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <LayoutHeader mb={4} title={<PolicyHeader title={t('policies.rank.title')} onCancel={handleCancel} />} />

      <form onSubmit={handleSubmit} noValidate>
        <Container>
          <Section>
            <div>
              <Typography id="rank-table-description" variant="body1" gutterBottom>
                {t('policies.rank.description')}
              </Typography>
              <div className={styles.rankTable}>
                <RankTable
                  data={policies}
                  header={t('policies.rank.policyName')}
                  handleRankChange={handleRankChange}
                  editable={canEdit}
                />
              </div>
            </div>
          </Section>
        </Container>

        {canEdit && (
          <ButtonPanel
            buttons={[
              <Button onClick={handleCancel} data-testid="policy-rank-cancel-button">
                {t('common.cancel')}
              </Button>,
              <Button.Confirmation color="primary" loading={updating} type="submit" data-testid="policy-rank-submit-button">
                {t('common.save')}
              </Button.Confirmation>,
            ]}
          ></ButtonPanel>
        )}
      </form>

      <MessageSnackbar
        open={snackbar.open}
        message={t('common.errorPleaseContact')}
        variant="error"
        onClose={handleSnackbarClose}
      />
    </>
  )
}

PolicyRank.displayName = 'PolicyRank'

PolicyRank.propTypes = {
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  policies: PropTypes.array,
  snackbar: PropTypes.object,
  canEdit: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSnackbarClose: PropTypes.func.isRequired,
  handleRankChange: PropTypes.func.isRequired,
}

export default PolicyRank
