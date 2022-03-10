import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { memo } from 'react'

import styles from './SimpleTable.module.less'

const SimpleTable = memo(({ className, columns, data }) => {
  return (
    <div className={cn(styles.simpleTable, className)}>
      <table className={styles.table}>
        <tbody>
          {data.map((row, i) => {
            return (
              <tr className={styles.tableRow} key={row[columns[0].accessor]}>
                {columns.map(column => {
                  const { accessor, ...props } = column
                  const value = row[column.accessor]
                  return (
                    <td className={styles.tableCell} key={value} {...props}>
                      {value}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
})

SimpleTable.displayName = 'SimpleTable'
SimpleTable.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
}

export default SimpleTable
