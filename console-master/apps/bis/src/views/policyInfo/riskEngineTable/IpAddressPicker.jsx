import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import TooltipTrigger from 'react-popper-tooltip'

import { useTheme } from '@material-ui/core/styles'

import { Context } from '../../../providers/IpAddressSettingsProvider'
import { InfiniteList } from '../../../shared'
import { type } from '../../settingsIpAddresses/static/ipAddressListType'
import styles from './IpAddressPicker.module.less'

const initHeaders = (listType, t) => ({
  name: {
    columnName: listType === type.TRUSTED ? 'policies.details.allTrustedIpAddresses' : 'policies.details.allUntrustedIpAddresses',
    columnData: { isCheckList: true },
    dataKey: 'name',
    visible: true,
    defaultVisible: true,
    disabled: false,
    disableSort: true,
    cellDataGetter: data => data,
    cellRenderer: ({ data: { name } }) => name,
  },
})

const noop = () => {}

const IpAddressPicker = memo(({ isBlacklist, onToggle, onSelected, onSelectAll, selectionState, selectedAll, children }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const headers = useRef()
  const listRef = useRef()
  const listType = isBlacklist ? type.UNTRUSTED : type.TRUSTED

  if (!headers.current) {
    headers.current = initHeaders(listType, t)
  }
  const { data, total } = useContext(Context)
  const onRowClick = useCallback(({ index, rowData }) => onSelected(index, rowData, { total }), [onSelected, total])
  const filteredData = useMemo(() => data?.filter(ipAddress => ipAddress.isBlacklist === isBlacklist), [data, isBlacklist])

  const tooltipReference = useRef()
  const setTooltipReference = useCallback(
    tooltipRef => ref => {
      tooltipReference.current = ref
      return tooltipRef(ref)
    },
    [],
  )

  const tooltip = useCallback(
    ({ getTooltipProps, tooltipRef }) => (
      <div {...getTooltipProps({ ref: setTooltipReference(tooltipRef), className: styles.container })}>
        {filteredData && (
          <InfiniteList
            className={styles.list}
            t={t}
            onLoadMoreRows={noop}
            data={filteredData}
            total={total}
            headers={headers.current}
            ref={listRef}
            selectionState={selectionState}
            onSelected={onSelected}
            onSelectAll={onSelectAll}
            selectedAll={selectedAll}
            onRowClick={onRowClick}
            onHeaderClick={onSelectAll}
            listMargin={0}
            hideMenu
            noCounter
            isCheckList
            dynamicHeightElementRef={tooltipReference}
            theme={theme}
          />
        )}
      </div>
    ),
    [filteredData, onRowClick, onSelectAll, onSelected, selectedAll, selectionState, setTooltipReference, t, theme, total],
  )

  const renderer = useMemo(() => ({ getTriggerProps, triggerRef }) => children(getTriggerProps, triggerRef), [children])

  return (
    <TooltipTrigger placement="bottom" trigger="click" onVisibilityChange={onToggle} tooltip={tooltip}>
      {renderer}
    </TooltipTrigger>
  )
})

IpAddressPicker.displayName = 'IpAddressPicker'

IpAddressPicker.propTypes = {
  isBlacklist: PropTypes.bool,
  visible: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  onSelected: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  selectionState: PropTypes.object.isRequired,
  selectedAll: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired,
}

IpAddressPicker.defaultProps = {
  isBlacklist: false,
  visible: false,
}

export default IpAddressPicker
