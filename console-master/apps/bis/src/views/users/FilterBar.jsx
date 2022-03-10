import PropTypes from 'prop-types'
import React, { memo, useMemo } from 'react'
import { withTranslation } from 'react-i18next'

import { UserFiltersQuery } from '@ues-data/bis'

import styles from '../../list/Filter.module.less'
import FilterButton from '../../list/FilterButton'
import { default as FilterLink } from '../../list/FilterLink'
import { RiskLevel, useClientParams, useUpdatedOptions } from '../../shared'

const behaviorOptionsBase = RiskLevel.BehaviorOptions
const appAnomalyOptionsBase = RiskLevel.AppAnomalyOptions
const networkAnomalyOptionsBase = RiskLevel.NetworkAnomalyOptions
const ipAddressRiskOptionsBase = RiskLevel.IpAddressRiskOptions
const geozoneOptionsBase = RiskLevel.GeozoneOptions
const fixupOptionsBase = RiskLevel.FixupOptions
const locationOptionsBase = RiskLevel.LocationOptions

const userFiltersAccessor = data => data.userFilters

const defaultVariables = {}

export const FilterBar = memo(
  ({ variables = defaultVariables, filters, onFilterChange, t, query = UserFiltersQuery, dataAccessor = userFiltersAccessor }) => {
    const {
      features: { RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection },
    } = useClientParams()
    // These two are always shown
    const [behaviorOptions] = useUpdatedOptions(filters, onFilterChange, behaviorOptionsBase)
    const [geozoneOptions] = useUpdatedOptions(filters, onFilterChange, geozoneOptionsBase)
    const [appAnomalyOptions, hasAppAnomalyFilters] = useUpdatedOptions(filters, onFilterChange, appAnomalyOptionsBase)
    const [networkAnomalyOptions, hasNetworkAnomalyFilters] = useUpdatedOptions(filters, onFilterChange, networkAnomalyOptionsBase)
    const [ipAddressRiskOptions, hasIpAddressRiskFilters] = useUpdatedOptions(filters, onFilterChange, ipAddressRiskOptionsBase)
    const [fixupOptions, hasFixupFilters] = useUpdatedOptions(filters, onFilterChange, fixupOptionsBase)
    const [locationOptions, hasLocationFilters] = useUpdatedOptions(filters, onFilterChange, locationOptionsBase)

    const allOptions = useMemo(
      () => [
        behaviorOptions,
        geozoneOptions,
        ...(RiskScoreResponseFormat ? [appAnomalyOptions] : []),
        ...(RiskScoreResponseFormat && NetworkAnomalyDetection ? [networkAnomalyOptions] : []),
        ...(IpAddressRisk ? [ipAddressRiskOptions] : []),
        fixupOptions,
        locationOptions,
      ],
      [
        behaviorOptions,
        geozoneOptions,
        RiskScoreResponseFormat,
        appAnomalyOptions,
        networkAnomalyOptions,
        NetworkAnomalyDetection,
        IpAddressRisk,
        ipAddressRiskOptions,
        fixupOptions,
        locationOptions,
      ],
    )

    // TODO: Restrict fetches to filters already in place
    return (
      <div id="dashboard-filters" className={styles.filterContainer}>
        <FilterButton
          key="behavior-filter"
          id="behavior-filter-button"
          field={behaviorOptions.field}
          label={t(behaviorOptions.label)}
          options={behaviorOptions.levels}
          query={query}
          variables={variables}
          dataAccessor={dataAccessor}
        />
        <FilterButton
          id="geozone-filter-button"
          key="geozone-filter"
          field={geozoneOptions.field}
          label={t(geozoneOptions.label)}
          options={geozoneOptions.levels}
          query={query}
          variables={variables}
          dataAccessor={dataAccessor}
        />
        {hasAppAnomalyFilters ? (
          <FilterButton
            id="app-anomaly-filter-button"
            key="app-anomaly-filter"
            field={appAnomalyOptions.field}
            label={t(appAnomalyOptions.label)}
            options={appAnomalyOptions.levels}
            query={query}
            variables={variables}
            dataAccessor={dataAccessor}
          />
        ) : null}
        {hasNetworkAnomalyFilters ? (
          <FilterButton
            id="network-anomaly-filter-button"
            key="network-anomaly-filter"
            field={networkAnomalyOptions.field}
            label={t(networkAnomalyOptions.label)}
            options={networkAnomalyOptions.levels}
            query={query}
            variables={variables}
            dataAccessor={dataAccessor}
          />
        ) : null}
        {hasIpAddressRiskFilters ? (
          <FilterButton
            id="ip-address-risk-filter-button"
            key="ip-address-risk-filter"
            field={ipAddressRiskOptions.field}
            label={t(ipAddressRiskOptions.label)}
            options={ipAddressRiskOptions.levels}
            query={query}
            variables={variables}
            dataAccessor={dataAccessor}
          />
        ) : null}
        {hasFixupFilters ? (
          <FilterButton
            id="fixup-filter-button"
            key="fixup-filter"
            field={fixupOptions.field}
            label={t(fixupOptions.label)}
            options={fixupOptions.levels}
            query={query}
            variables={variables}
            dataAccessor={dataAccessor}
          />
        ) : null}
        {hasLocationFilters ? (
          <FilterButton
            id="location-filter-button"
            key="location-filter"
            field={locationOptions.field}
            label={t(locationOptions.label)}
            options={locationOptions.levels}
            query={query}
            variables={variables}
            dataAccessor={dataAccessor}
          />
        ) : null}
        <FilterLink
          id="all-filters-link"
          label={t('common.allFilters')}
          options={allOptions}
          query={query}
          variables={variables}
          dataAccessor={dataAccessor}
        />
      </div>
    )
  },
)

FilterBar.displayName = 'FilterBar'

FilterBar.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
}

export default withTranslation()(FilterBar)
