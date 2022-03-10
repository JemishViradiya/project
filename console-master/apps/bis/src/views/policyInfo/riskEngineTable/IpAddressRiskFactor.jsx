import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Context as IpAddressSettingsContext } from '../../../providers/IpAddressSettingsProvider'
import { isSelected, Loading, RiskLevel, RiskLevelLabel as Label, useSelection, useToggle } from '../../../shared'
import styles from './Common.module.less'
import IpAddressPicker from './IpAddressPicker'

const isMatchingIpAddress = (ipAddress, isBlacklisted, isWhitelisted) =>
  (isBlacklisted && ipAddress.isBlacklist) || (isWhitelisted && !ipAddress.isBlacklist)

const IpAddressRiskFactor = memo(({ ipRiskLevels, canEdit, policy, onPolicyChange }) => {
  const { t } = useTranslation()
  const { data: ipAddressSettings, loading } = useContext(IpAddressSettingsContext)

  const isBlacklisted = ipRiskLevels.some(ipRiskLevel => ipRiskLevel === RiskLevel.UNTRUSTED)
  // only one of blacklisted/whitelisted can be on the same risk level - this assumption reduces code overhead in next steps
  const isWhitelisted = !isBlacklisted && ipRiskLevels.some(ipRiskLevel => ipRiskLevel === RiskLevel.TRUSTED)

  const selectedIpAddressList = useMemo(
    () =>
      isBlacklisted || isWhitelisted
        ? (ipAddressSettings || []).filter(
            ipAddress =>
              policy.ipAddressListIds.includes(ipAddress.id) && isMatchingIpAddress(ipAddress, isBlacklisted, isWhitelisted),
          )
        : [],
    [ipAddressSettings, isBlacklisted, isWhitelisted, policy.ipAddressListIds],
  )

  const [showPicker, toggleShowPicker] = useToggle(false)
  const { onSelected, onSelectAll, selectionState, selectedAll, onSelectMultiple } = useSelection()

  const onToggleIpAddressPicker = useCallback(() => {
    if (showPicker) {
      const ipAddressPolicy = { ...policy }
      if (isBlacklisted) {
        ipAddressPolicy.allBlackLists = selectedAll
      } else {
        ipAddressPolicy.allWhiteLists = selectedAll
      }
      /**
       * Backend uses one list of whitelisted & blacklisted IPs so we need to get other list IDs first
       * (so if we are on blacklisted list, we need to get whitelisted IDs, or vice versa)
       * so they won't get lost.
       */
      const otherListIds = ipAddressPolicy.ipAddressListIds.filter(id =>
        selectedIpAddressList.every(ipAddress => ipAddress.id !== id),
      )
      const currentlySelectedListIds = selectedAll
        ? []
        : (ipAddressSettings || [])
            .filter(
              ipAddress => isMatchingIpAddress(ipAddress, isBlacklisted, isWhitelisted) && isSelected(selectionState, ipAddress.id),
            )
            .map(({ id }) => id)
      ipAddressPolicy.ipAddressListIds = [...otherListIds, ...currentlySelectedListIds]
      onPolicyChange(ipAddressPolicy)
    } else {
      const selectedAll = isBlacklisted ? policy.allBlackLists : policy.allWhiteLists
      onSelectMultiple(selectedIpAddressList, selectedAll)
    }
    toggleShowPicker()
  }, [
    ipAddressSettings,
    isBlacklisted,
    isWhitelisted,
    onPolicyChange,
    onSelectMultiple,
    policy,
    selectedAll,
    selectedIpAddressList,
    selectionState,
    showPicker,
    toggleShowPicker,
  ])

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const itemsToDisplay = useMemo(() => {
    const itemsToDisplay = []
    if (loading) {
      itemsToDisplay.push({
        key: 'loading',
        value: <Loading inline />,
      })
      return itemsToDisplay
    }
    const hasUndetected = ipRiskLevels.some(ipRiskLevel => ipRiskLevel === RiskLevel.UNDETECTED)
    const hasUndefined = ipRiskLevels.some(ipRiskLevel => ipRiskLevel === RiskLevel.UNDEFINED)
    if (isBlacklisted || isWhitelisted) {
      let textToDisplay = ''
      if ((isBlacklisted && policy.allBlackLists) || (isWhitelisted && policy.allWhiteLists)) {
        textToDisplay = t(isBlacklisted ? 'policies.details.allUntrustedIpAddresses' : 'policies.details.allTrustedIpAddresses')
      } else if (selectedIpAddressList.length) {
        textToDisplay = selectedIpAddressList.map(({ name }) => name).join(', ')
      } else {
        textToDisplay = t(isBlacklisted ? 'policies.details.selectUntrustedIpAddress' : 'policies.details.selectTrustedIpAddress')
      }
      const itemClassName = cn(
        canEdit && styles.tableRiskFactorLink,
        hasUndetected || hasUndefined ? styles.truncatedNameOneLine : styles.truncatedNameTwoLines,
      )
      itemsToDisplay.push({
        key: isBlacklisted ? RiskLevel.UNTRUSTED : RiskLevel.TRUSTED,
        value: canEdit ? (
          <IpAddressPicker
            isBlacklist={isBlacklisted}
            onToggle={onToggleIpAddressPicker}
            onSelected={onSelected}
            onSelectAll={onSelectAll}
            selectionState={selectionState}
            selectedAll={selectedAll}
          >
            {(getTriggerProps, triggerRef) => (
              <div
                {...getTriggerProps({
                  ref: triggerRef,
                  className: itemClassName,
                  role: 'button',
                  tabIndex: '-1',
                })}
              >
                {textToDisplay}
              </div>
            )}
          </IpAddressPicker>
        ) : (
          <div className={itemClassName}>{textToDisplay}</div>
        ),
      })
    }
    let otherElement
    if (hasUndetected && hasUndefined) {
      otherElement = {
        key: `${RiskLevel.UNDETECTED}-${RiskLevel.UNDEFINED}`,
        value: `${t(Label.UNDETECTED)}, ${t(Label.UNDEFINED)}`,
      }
    } else if (hasUndetected) {
      otherElement = {
        key: RiskLevel.UNDETECTED,
        value: t(Label.UNDETECTED),
      }
    } else if (hasUndefined) {
      otherElement = {
        key: RiskLevel.UNDEFINED,
        value: t(Label.UNDEFINED),
      }
    }
    if (otherElement) {
      /**
       * We need to wrap other element with <div> because we use "-webkit-inline-box"
       * for the main element to achieve ellipses breaking on words and working on
       * multiple lines.
       * We can't use "-webkit-box" as in some cases (reduced zoom level on FF)
       * it produces a glitch when it was displaying truncated text and then some
       * short one.
       */
      otherElement.value = <div>{otherElement.value}</div>
      itemsToDisplay.push(otherElement)
    }
    return itemsToDisplay
  }, [
    loading,
    ipRiskLevels,
    isBlacklisted,
    isWhitelisted,
    policy.allBlackLists,
    policy.allWhiteLists,
    selectedIpAddressList,
    canEdit,
    onToggleIpAddressPicker,
    onSelected,
    onSelectAll,
    selectionState,
    selectedAll,
    t,
  ])

  return (
    <div className={styles.tableRiskFactorItem}>
      <div id="ip-address-label">{t('common.ipAddress')}</div>
      <div aria-labelledby="ip-address-label" className={styles.tableRiskFactorDescription}>
        {itemsToDisplay.map(({ key, value }) => (
          <React.Fragment key={key}>{value}</React.Fragment>
        ))}
      </div>
    </div>
  )
})

IpAddressRiskFactor.propTypes = {
  ipRiskLevels: PropTypes.arrayOf(
    PropTypes.oneOf([RiskLevel.UNTRUSTED, RiskLevel.UNDETECTED, RiskLevel.UNDEFINED, RiskLevel.TRUSTED]),
  ),
  policy: PropTypes.object,
  onPolicyChange: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
}

export default IpAddressRiskFactor
