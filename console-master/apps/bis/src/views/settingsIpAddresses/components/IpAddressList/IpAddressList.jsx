import PropTypes from 'prop-types'
import React, { memo, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'

import { BasicClose } from '@ues/assets'

import { Icon, IconButton, InfiniteList } from '../../../../shared'
import IpAddressCell from './IpAddressCell'
import styles from './IpAddressList.module.less'

const ROW_STYLES = { paddingRight: '40px' }

const RemoveRowIcon = memo(({ t, openDeleteDialog, id, name }) => {
  const handleClick = useCallback(() => openDeleteDialog([{ id, name }]), [openDeleteDialog, id, name])

  return (
    <div className={styles.removeRowButtonContainer}>
      <IconButton size="small" title={t('common.deleteItem')} onClick={handleClick}>
        <Icon icon={BasicClose} />
      </IconButton>
    </div>
  )
})

const NameItem = memo(({ openDeleteDialog, t, data, canEdit, handleUpdateIpAddressListClick }) => (
  <>
    <span className={styles.nameLink} role="button" tabIndex="-1" onClick={() => handleUpdateIpAddressListClick(data.id)}>
      {data.name}
    </span>
    {canEdit && <RemoveRowIcon t={t} openDeleteDialog={openDeleteDialog} id={data.id} name={data.name} />}
  </>
))

const initHeaders = (t, openDeleteDialog, canEdit, handleUpdateIpAddressListClick) => ({
  name: {
    columnName: 'common.name',
    dataKey: 'name',
    width: 300,
    visible: true,
    defaultVisible: true,
    disabled: false,
    cellDataGetter: data => data,
    cellRenderer: ({ data }) => (
      <NameItem
        data={data}
        openDeleteDialog={openDeleteDialog}
        t={t}
        canEdit={canEdit}
        handleUpdateIpAddressListClick={handleUpdateIpAddressListClick}
      />
    ),
  },
  detail: {
    columnName: 'settings.ipAddress.listDetails',
    dataKey: 'detail',
    visible: true,
    defaultVisible: true,
    disabled: false,
    disableSort: true,
    cellDataGetter: data => data,
    cellRenderer: cellProps => <IpAddressCell {...cellProps} onMoreClick={handleUpdateIpAddressListClick} />,
  },
})

const onLoadMoreRows = () => {}

const IpAddressList = memo(
  ({
    data,
    total,
    onSort,
    canEdit,
    sorting,
    onSelected,
    selectedAll,
    onSelectAll,
    selectionState,
    openDeleteDialog,
    handleUpdateIpAddressListClick,
  }) => {
    const { t } = useTranslation()
    const theme = useTheme()
    const headers = useRef()
    const listRef = useRef()

    if (!headers.current) {
      headers.current = initHeaders(t, openDeleteDialog, canEdit, handleUpdateIpAddressListClick)
    }

    if (!data) {
      return null
    }
    return (
      <InfiniteList
        t={t}
        onSort={onSort}
        sortBy={sorting.sortBy}
        sortDirection={sorting.sortDirection}
        onLoadMoreRows={onLoadMoreRows}
        data={data}
        total={total}
        headers={headers.current}
        ref={listRef}
        selectionState={selectionState}
        onSelected={onSelected}
        onSelectAll={onSelectAll}
        selectedAll={selectedAll}
        listMargin={0}
        autoRowHeight
        hideMenu
        rowStyle={ROW_STYLES}
        theme={theme}
      />
    )
  },
)

IpAddressList.displayName = 'IpAddressList'

IpAddressList.propTypes = {
  data: PropTypes.array,
  total: PropTypes.number,
  sorting: PropTypes.object.isRequired,
  selectionState: PropTypes.object.isRequired,
  onSelected: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  openDeleteDialog: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
}

export default IpAddressList
