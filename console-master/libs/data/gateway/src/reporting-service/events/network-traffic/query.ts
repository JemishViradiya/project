/* eslint-disable sonarjs/no-nested-template-literals */
//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

import { FeatureName, FeaturizationApi } from '@ues-data/shared'

const checkIDNSTunnelingEnabled = () => FeaturizationApi.isFeatureEnabled(FeatureName.UESBigDnsTunnelingEnabled)

export const queryEventsNetworkTrafficGql = gql`
  query queryEventsNetworkTraffic($tenantId: String!, $fromRecord: Int!, $maxRecords: Int!, $filter: Filter!, $sort: [SortField]) {
    tenant(tenantId: $tenantId) {
      tunnelEvents(fromRecord: $fromRecord, maxRecords: $maxRecords, filter: $filter, sort: $sort) {
        totalHits
        eventsLimit
        events {
          sourceIp
          sourcePort
          destinationIp
          destinationFqdn
          destination
          destinationPort
          networkRoute
          flowId
          ecoId
          endpointId
          proto
          appProto
          datapointId
          anomaly
          bisScore
          timeStamp

          dnsId
          rrType
          rrName

          category
          subCategory

          tsStart
          tsTerm

          appName
          appDest
          policyId
          policyName
          policyType
          action
          alerts {
            alertType
            category
            signature
            timeStamp
            mitre {
              tacticId
              tacticName
              techniqueId
              techniqueName
            }
            ${
              checkIDNSTunnelingEnabled()
                ? ` ... on DnsTunnelingAlertInfo {
              dnsTunneling {
                nameServer
                score
              }
            }`
                : ''
            }
          }
          rules {
            requestType
            ruleId
            ruleName
            action
            timeStamp
            risk
          }

          pkts_toserver
          pkts_toclient
          bytes_toserver
          bytes_toclient
          bytes_total

          subject
          issuerdn
          serial
          sni
          version
          notafter
          notbefore
          client_alpn
          server_alpn

          firstName
          lastName
          userName
          displayName
          email
          deviceInfo {
            deviceId
            platform
            osVersion
            deviceModelName
            manufacturer
          }
        }
      }
    }
  }
`
