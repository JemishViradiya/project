import PropTypes from 'prop-types'
import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'

import { BasicExport } from '@ues/assets'

import LayoutHeader from '../components/layout/Header'
import SubHeader from '../components/layout/SubHeader'
import IconButton from '../components/widgets/IconButton'
import MapViewModeSwitch from '../components/widgets/MapViewModeSwitch'
import { Icon } from '../shared'
import styles from './Header.module.less'

export const Header = memo(
  ({
    actionButtons,
    filterBar,
    frontActionButtons,
    searchText,
    selectionCount,
    showMap,
    title,
    onExport,
    onHideMap,
    onSearchChange,
    onShowMap,
    isSubHeader,
    isExporting,
    name,
    desc,
  }) => {
    const { t } = useTranslation()
    const onInputChange = useCallback(e => onSearchChange(e.target.value), [onSearchChange])
    const actions = useMemo(() => {
      if (onHideMap && onShowMap) {
        return <MapViewModeSwitch showMap={showMap} onHideMap={onHideMap} onShowMap={onShowMap} />
      }
    }, [onHideMap, onShowMap, showMap])

    const ExportButton = useMemo(
      () =>
        onExport ? (
          <IconButton title={t('common.export')} onClick={onExport} loading={isExporting}>
            <Icon icon={BasicExport} />
          </IconButton>
        ) : null,
      [isExporting, onExport, t],
    )
    const DetailsView = useMemo(
      () => (
        <>
          {filterBar}
          <div className={styles.search}>
            <TextField
              id="search-field"
              className={styles.searchField}
              type="search"
              name={name}
              label={t('common.search')}
              onChange={onInputChange}
              value={searchText}
              size="small"
            />
            {frontActionButtons}
            {ExportButton}
            {actionButtons}
            {selectionCount}
          </div>
        </>
      ),
      [ExportButton, actionButtons, filterBar, frontActionButtons, onInputChange, searchText, selectionCount, t, name],
    )

    return (
      <Box mb={4}>
        {!isSubHeader ? (
          <LayoutHeader actions={actions} title={title}>
            {DetailsView}
          </LayoutHeader>
        ) : (
          <SubHeader desc={desc}>{DetailsView}</SubHeader>
        )}
      </Box>
    )
  },
)

Header.displayName = 'Header'

Header.propTypes = {
  title: PropTypes.node,
  desc: PropTypes.node,
  selectionCount: PropTypes.node,
  filterBar: PropTypes.node,
  frontActionButtons: PropTypes.node,
  actionButtons: PropTypes.node,
  onSearchChange: PropTypes.func.isRequired,
  showMap: PropTypes.bool,
  onHideMap: PropTypes.func,
  onShowMap: PropTypes.func,
  searchText: PropTypes.string.isRequired,
  onExport: PropTypes.func,
  isSubHeader: PropTypes.bool,
}

Header.defaultProps = {
  selectionCount: null,
  filterBar: <div className={styles.filterSpacer} />,
  actionButtons: null,
}

export const renderStyle = {
  selectionCount: styles.selectionCount,
}
