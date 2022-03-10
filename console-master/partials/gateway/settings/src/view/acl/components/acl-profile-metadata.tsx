//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import type { AclRulesProfile } from '@ues-data/gateway'
import { Config, Hooks, Utils } from '@ues-gateway/shared'

const { formatTimestamp } = Utils
const { GATEWAY_TRANSLATIONS_KEY } = Config
const { useSelectedUsersData } = Hooks

interface AclProfileMetadataProps {
  data: AclRulesProfile
}

const AclProfileMetadata: React.FC<AclProfileMetadataProps> = ({ data }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const { data: users } = useSelectedUsersData([data?.updatedBy])

  const { displayName } = users?.[data?.updatedBy] ?? {}

  return !isEmpty(data) ? (
    <Typography variant="caption">
      {t(data.updatedBy && displayName ? 'acl.lastModifiedAtLabel' : 'acl.lastModifiedAtOnlyDateLabel', {
        date: formatTimestamp(data.updated),
        name: displayName,
      })}
    </Typography>
  ) : null
}

export default AclProfileMetadata
