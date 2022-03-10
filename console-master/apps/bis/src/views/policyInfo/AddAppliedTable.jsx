import cn from 'classnames'
import PropTypes, { object } from 'prop-types'
import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { BasicClose } from '@ues/assets'

import { DirectoryGroup, DirectoryUserName, Icon } from '../../shared'
import tableStyles from '../../table/Table.module.less'
import listStyles from './AppliedList.module.less'
import styles from './AppliedModal.module.less'

const RemoveRowIcon = memo(({ t, onClick, id }) => {
  const handleClick = useCallback(() => onClick(id), [onClick, id])
  const title = useMemo(() => t('common.delete'), [t])
  return (
    <div className={listStyles.removeRowIcon} title={title} aria-label={title} role="button" tabIndex="0" onClick={handleClick}>
      <Icon icon={BasicClose} />
    </div>
  )
})

const AppliedRow = memo(({ applied, deleteAppliedItem, t, index }) => (
  <tr aria-rowindex={index} key={applied.id} className={cn(tableStyles.row, styles.flex, styles.row)}>
    <td aria-colindex="1" className={cn(styles.flex, styles.cell)}>
      {applied.__typename === 'BIS_DirectoryGroup' ? <DirectoryGroup {...applied.info} /> : <DirectoryUserName {...applied.info} />}
    </td>
    <td aria-colindex="2" className={cn(styles.flex, styles.cell)}>
      {applied.info.primaryEmail}
      <RemoveRowIcon t={t} onClick={deleteAppliedItem} id={applied.id} />
    </td>
  </tr>
))

const AddAppliedTable = memo(({ data, deleteAppliedItem }) => {
  const { t } = useTranslation()

  return (
    <table className={cn(tableStyles.table, styles.addAppliedTable)}>
      <thead className={tableStyles.header}>
        <tr className={cn(styles.flex, styles.row)}>
          <th className={cn(styles.flex, styles.cell)}>{t('common.name')}</th>
          <th className={cn(styles.flex, styles.cell)}>{t('common.email')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((applied, index) => (
          <AppliedRow key={applied.id} applied={applied} deleteAppliedItem={deleteAppliedItem} t={t} index={index} />
        ))}
      </tbody>
    </table>
  )
})

AddAppliedTable.propTypes = {
  data: PropTypes.arrayOf(object),
  deleteAppliedItem: PropTypes.func,
}

export default AddAppliedTable
