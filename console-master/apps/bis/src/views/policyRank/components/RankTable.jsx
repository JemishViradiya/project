import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ArrowDown, ArrowUp } from '@ues/assets'

import { Icon, IconButton } from '../../../shared'
import tableStyles from '../../../table/Table.module.less'
import styles from './RankTable.module.less'

const ArrowCell = memo(({ index, total, handleRankChange }) => {
  const canBeUpgraded = useMemo(() => index > 0, [index])
  const canBeDowngraded = useMemo(() => index < total - 1, [index, total])

  const rankUp = useCallback(() => {
    if (canBeUpgraded) {
      handleRankChange(index, -1)
    }
  }, [canBeUpgraded, handleRankChange, index])
  const rankDown = useCallback(() => {
    if (canBeDowngraded) {
      handleRankChange(index, 1)
    }
  }, [canBeDowngraded, handleRankChange, index])

  return (
    <td aria-colindex="2">
      {total > 1 && (
        <div className={styles.rankButtonsWrapper}>
          <IconButton
            onClick={rankUp}
            className={!canBeUpgraded ? styles.rankButtonInvisible : undefined}
            size="small"
            aria-label="increase"
            aria-hidden={!canBeUpgraded}
          >
            <Icon icon={ArrowUp} />
          </IconButton>

          <IconButton
            onClick={rankDown}
            className={!canBeDowngraded ? styles.rankButtonInvisible : undefined}
            size="small"
            aria-label="decrease"
            aria-hidden={!canBeDowngraded}
          >
            <Icon icon={ArrowDown} />
          </IconButton>
        </div>
      )}
    </td>
  )
})

const RankTable = memo(({ data, header, handleRankChange, editable }) => {
  const { t } = useTranslation()

  const createPolicyRow = (policy, index) => (
    <tr aria-rowindex={index} key={policy.id} className={cn(tableStyles.row, styles.row)}>
      <td aria-colindex="1">{policy.name}</td>
      {editable && <ArrowCell index={index} total={data.length} handleRankChange={handleRankChange} />}
      <td aria-colindex={editable ? 3 : 2}>{index + 1}</td>
    </tr>
  )

  return (
    <table aria-describedby="rank-table-description" className={tableStyles.table}>
      <thead className={tableStyles.header}>
        <tr>
          <th className={styles.headerCell}>{header}</th>
          {editable && <th className={styles.headerCell}>{t('policies.rank.ranking')}</th>}
          <th className={styles.headerCell}>{t('policies.rank.rankPosition')}</th>
        </tr>
      </thead>
      <tbody>{data.map((policy, i) => createPolicyRow(policy, i))}</tbody>
    </table>
  )
})

RankTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  ),
  header: PropTypes.string.isRequired,
  handleRankChange: PropTypes.func.isRequired,
  editable: PropTypes.bool,
}

RankTable.defaultProps = {
  editable: true,
}

export default RankTable
