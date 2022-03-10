import PropTypes from 'prop-types'
import React, { memo, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { uniqueValues } from '@ues-bis/shared'
import { FixupDetailsQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

import AppAnomalyRiskScoreInfo from '../../../components/AppAnomalyRiskScoreInfo'
import BehavioralPatternRiskInfo from '../../../components/BehavioralPatternRiskInfo'
import NetworkAnomalyRiskScoreInfo from '../../../components/NetworkAnomalyRiskScoreInfo'
import {
  CollapsibleInfo,
  GeozoneIcon,
  GeozoneRiskLevel,
  IdentityRiskLevel,
  Loading,
  RiskLevel,
  SimpleTable,
  useClientParams,
} from '../../../shared'
import FixupLog from './FixupLog'
import styles from './RiskStatusTable.module.less'

const getRiskInfo = (level, t) => <div>{t(`risk.level.${level}`)}</div>

const getScoreInfo = (riskScore, riskLevel) => (
  <div>
    <BehavioralPatternRiskInfo score={riskScore} level={riskLevel} />
  </div>
)

const getGeozoneInfo = (level, name, t) => {
  const levelText = t(`risk.level.${level}`)
  return (
    <div className={styles.infoEntry}>
      <GeozoneIcon level={level} />
      <span className={styles.entryText}>{name ? `${name} (${levelText})` : levelText}</span>
    </div>
  )
}

const Fixup = memo(({ datapointId, refetchRef, onRefresh }) => {
  const options = useMemo(
    () => ({
      variables: {
        datapointId,
      },
    }),
    [datapointId],
  )
  const { loading, error, data, refetch } = useStatefulApolloQuery(FixupDetailsQuery, options)
  if (error) {
    // FIXME: report error to UI if needed in future.
    console.log('Error when fetching fixup details: ', error)
    return null
  }

  if (loading || !data) {
    return <Loading />
  }

  refetchRef.current = refetch
  return <FixupLog data={data.fixupDetails} onRefresh={onRefresh} />
})

const columns = [{ width: 112, accessor: 'name' }, { accessor: 'content' }]

const RiskStatusTable = memo(
  ({
    riskLevel,
    behavioralRiskScore,
    behavioralRiskLevel,
    appAnomalyRiskScore,
    networkAnomalyRiskScore,
    geozoneRiskLevel,
    geozoneName,
    datapointId,
    ipAddressType,
  }) => {
    const { features: { IpAddressRisk = false } = {} } = useClientParams()
    const { t } = useTranslation()
    const { features: { RiskScoreResponseFormat = false, NetworkAnomalyDetection = false } = {} } = useClientParams()

    const refetch = useRef(() => {})
    const onRefresh = useCallback(() => {
      refetch.current({ datapointId })
    }, [datapointId])

    const data = useMemo(() => {
      const result = [
        { name: t('risk.common.identityRisk'), content: getRiskInfo(riskLevel, t) },
        { name: t('risk.common.behavioralPatternRiskScore'), content: getScoreInfo(behavioralRiskScore, behavioralRiskLevel) },
      ]

      if (RiskScoreResponseFormat && RiskLevel.isValidRiskScore(appAnomalyRiskScore)) {
        result.push({
          name: t('risk.common.appAnomaly'),
          content: <AppAnomalyRiskScoreInfo riskScore={appAnomalyRiskScore} />,
        })
      }

      if (RiskScoreResponseFormat && NetworkAnomalyDetection && RiskLevel.isValidRiskScore(networkAnomalyRiskScore)) {
        result.push({
          name: t('risk.common.networkAnomaly'),
          content: <NetworkAnomalyRiskScoreInfo riskScore={networkAnomalyRiskScore} />,
        })
      }

      if (IpAddressRisk && ipAddressType !== undefined) {
        result.push({
          name: t('common.ipAddress'),
          content: <div>{ipAddressType}</div>,
        })
      }

      result.push({
        name: t('common.geozoneRisk'),
        content: getGeozoneInfo(geozoneRiskLevel, geozoneName, t),
      })

      result.push({
        name: t('common.automaticRiskReduction'),
        content: <Fixup datapointId={datapointId} refetchRef={refetch} onRefresh={onRefresh} />,
      })

      return result
    }, [
      t,
      riskLevel,
      behavioralRiskScore,
      behavioralRiskLevel,
      RiskScoreResponseFormat,
      appAnomalyRiskScore,
      networkAnomalyRiskScore,
      NetworkAnomalyDetection,
      IpAddressRisk,
      ipAddressType,
      geozoneRiskLevel,
      geozoneName,
      datapointId,
      onRefresh,
    ])

    return (
      <CollapsibleInfo title={t('usersEvents.riskStatus')}>
        <SimpleTable columns={columns} data={data} />
      </CollapsibleInfo>
    )
  },
)

RiskStatusTable.displayName = 'RiskStatusTable'
RiskStatusTable.propTypes = {
  riskLevel: PropTypes.oneOf(Object.values(IdentityRiskLevel)).isRequired,
  behavioralRiskScore: PropTypes.number.isRequired,
  behavioralRiskLevel: PropTypes.oneOf(uniqueValues([...Object.values(IdentityRiskLevel), RiskLevel.TRAINING])),
  geozoneRiskLevel: PropTypes.oneOf(Object.values(GeozoneRiskLevel)).isRequired,
  geozoneName: PropTypes.string,
  datapointId: PropTypes.string.isRequired,
}

export default RiskStatusTable
