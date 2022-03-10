import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CellMeasurer } from 'react-virtualized'

import { Button } from '../../../../shared'
import styles from './IpAddressCell.module.less'

const MAX_IP_ADDRESSES_IN_CELL = 3

// Don't memoize component, memoization breaks the cell measuring
const IpAddressCell = ({ cache, columnIndex, dataKey, parent, rowIndex, style, data: { ipAddresses = [], id }, onMoreClick }) => {
  const { t } = useTranslation()
  const visibleIpAddresses = useMemo(() => ipAddresses.slice(0, MAX_IP_ADDRESSES_IN_CELL), [ipAddresses])
  const notVisibleAddressesCount = useMemo(() => ipAddresses.length - visibleIpAddresses.length, [ipAddresses, visibleIpAddresses])

  return (
    <CellMeasurer cache={cache} columnIndex={columnIndex} key={dataKey} parent={parent} rowIndex={rowIndex}>
      {({ registerChild }) => (
        <div ref={registerChild} style={style} className={styles.root}>
          {visibleIpAddresses.map(ipAddress => (
            <div key={ipAddress}>{ipAddress}</div>
          ))}
          {ipAddresses.length > MAX_IP_ADDRESSES_IN_CELL ? (
            <Button variant="text" color="primary" size="small" className={styles.button} onClick={() => onMoreClick(id)}>
              {t('settings.ipAddress.listExpandDetails', { count: notVisibleAddressesCount })}
            </Button>
          ) : null}
        </div>
      )}
    </CellMeasurer>
  )
}

IpAddressCell.displayName = 'IpAddressCell'

IpAddressCell.propTypes = {
  cache: PropTypes.object.isRequired,
  columnIndex: PropTypes.number.isRequired,
  parent: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  dataKey: PropTypes.string,
  style: PropTypes.string,
}

export default IpAddressCell
