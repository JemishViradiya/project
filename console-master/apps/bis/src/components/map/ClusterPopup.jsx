import cn from 'classnames'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { RiskIcon } from '@ues-bis/standalone-shared'
import { ArrowRight } from '@ues/assets'

import { Icon } from '../../shared'
import styles from './ClusterPopup.module.less'

const ClusterPopup = memo(
  ({
    noTotal,
    noBorder,
    summary: { critical, high, medium, low, total },
    onClickFunctions: { gotoCritical, gotoHigh, gotoMedium, gotoLow, gotoUnknown, gotoTotal },
  }) => {
    const { t } = useTranslation()
    let unknown
    if (total !== undefined && low !== undefined && medium !== undefined && high !== undefined && critical !== undefined) {
      unknown = total - low - medium - high - critical
    }
    const popupCN = cn(styles.hint, noBorder && styles.noBorder)
    const criticalCN = cn(styles.row, gotoCritical && styles.clickableRow)
    const highCN = cn(styles.row, gotoHigh && styles.clickableRow)
    const mediumCN = cn(styles.row, gotoMedium && styles.clickableRow)
    const lowCN = cn(styles.row, gotoLow && styles.clickableRow)
    const unknownCN = cn(styles.row, gotoUnknown && styles.clickableRow)
    return (
      <div data-testid="SummaryPopup" className={popupCN}>
        {!critical ? null : (
          <div data-testid="PopUpCritical" className={criticalCN} role="button" onClick={gotoCritical} tabIndex={0}>
            <RiskIcon level="CRITICAL" className={styles.icon} />
            <span className={styles.label}>
              {critical} {t('risk.level.CRITICAL')}
            </span>
          </div>
        )}
        {!high ? null : (
          <div data-testid="PopUpHigh" className={highCN} role="button" onClick={gotoHigh} tabIndex={0}>
            <RiskIcon level="HIGH" className={styles.icon} />
            <span className={styles.label}>
              {high} {t('risk.level.HIGH')}
            </span>
          </div>
        )}
        {!medium ? null : (
          <div data-testid="PopUpMedium" className={mediumCN} role="button" onClick={gotoMedium} tabIndex={0}>
            <RiskIcon level="MEDIUM" className={styles.icon} />
            <span className={styles.label}>
              {medium} {t('risk.level.MEDIUM')}
            </span>
          </div>
        )}
        {!low ? null : (
          <div data-testid="PopUpLow" className={lowCN} role="button" onClick={gotoLow} tabIndex={0}>
            <RiskIcon level="LOW" className={styles.icon} />
            <span className={styles.label}>
              {low} {t('risk.level.LOW')}
            </span>
          </div>
        )}
        {!unknown ? null : (
          <div data-testid="PopUpUnknown" className={unknownCN} role="button" onClick={gotoUnknown} tabIndex={0}>
            <RiskIcon level="UNKNOWN" className={styles.icon} />
            <span className={styles.label}>
              {unknown} {t('risk.level.UNKNOWN')}
            </span>
          </div>
        )}
        {!total || noTotal ? null : (
          <div
            data-testid="PopUpTotal"
            className={cn(styles.clickableRow, styles.total)}
            role="button"
            onClick={gotoTotal}
            tabIndex={0}
          >
            <Icon icon={ArrowRight} className={styles.icon} />
            <span className={styles.label}>
              {total} {t('common.total')}
            </span>
          </div>
        )}
      </div>
    )
  },
)

ClusterPopup.displayName = 'ClusterPopup'

export default ClusterPopup
