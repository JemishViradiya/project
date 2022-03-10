import { isEmpty, isUndefined } from 'lodash-es'
import React, { useCallback, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import type { TableCellProps } from '@material-ui/core'
import { Box, Dialog, IconButton, Link, Typography } from '@material-ui/core'

import type { BrowserDomain } from '@ues-data/dlp'
import { Domain, PolicyData } from '@ues-data/dlp'
import { Permission, useStatefulReduxQuery } from '@ues-data/shared'
import { BasicAddRound, BasicDelete } from '@ues/assets'
import { ContentAreaPanel, SecuredContentBoundary, useSecuredContent } from '@ues/behaviours'

import { useItemDialog } from '../common/dialog/useItemDialog'
import { TableView } from '../common/TableView'
import { usePoliciesPermissions } from '../usePoliciesPermission'

const FIELD_NAME_MAPPING = 'domain'
const FIELD_DESCRIPTION_MAPPING = 'description'

const getSavedDomains = (domainNames: string[]): Partial<BrowserDomain>[] => {
  return domainNames?.map(name => {
    // TODO: temporary fix for issue with leak of domain information in getPolicy response
    return { domain: name, description: '', guid: uuidv4() }
  })
}

const WhitelistDomains = () => {
  useSecuredContent(Permission.BIP_POLICY_READ)

  const { t } = useTranslation('dlp/policy')
  const { guid } = useParams()

  const localBrowserDomains = useSelector(PolicyData.getBrowserDomains)
  const dispatch = useDispatch()
  const isAddMode = isUndefined(guid)
  const { loading: loadingDomains, data: dataDomains } = useStatefulReduxQuery(Domain.queryBrowserDomains, {
    variables: { policiesAssignment: false },
  })
  const browserDomains = isAddMode ? [] : getSavedDomains(localBrowserDomains)
  const [selectedRows, setSelectedRows] = useState(browserDomains)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const enabledDomains = useMemo(() => dataDomains?.elements.filter(d => d.enabled === 'true'), [
    dataDomains?.elements,
    selectedRows,
  ])
  const [filteredAssignable, setFilteredAssignable] = useState(enabledDomains)
  const { canUpdate } = usePoliciesPermissions()

  const labels = {
    title: t('policy.sections.domains.dialogs.title'),
    searchText: t('policy.sections.domains.dialogs.searchText'),
    cancel: t('policy.buttons.cancel'),
    submit: t('policy.buttons.save'),
  }

  const handleSearch = (str: string) => {
    if (str) {
      setFilteredAssignable(enabledDomains.filter(domain => domain.domain.toLowerCase().includes(str.toLowerCase())))
    } else {
      setFilteredAssignable(enabledDomains)
    }
  }

  const processAssignment = (domains: BrowserDomain[]) => {
    return domains
  }

  // eslint-disable-next-line no-unused-expressions
  filteredAssignable
    ? filteredAssignable.forEach((d, dIndex) => {
        selectedRows.forEach(r => {
          if (d?.domain === r?.domain) {
            filteredAssignable.splice(dIndex, 1)
          }
        })
      })
    : filteredAssignable

  const { dialogOptions, setDialogId } = useItemDialog({
    data: filteredAssignable,
    loading: false,
    labels: labels,
    handleSearch,
    submitAssignment: (domains: BrowserDomain[]) => {
      // check whether selected domains are unique
      const newDomains = domains.filter(d => isEmpty(selectedRows.filter(r => r.domain === d.domain)))
      const selectedDomains = [...new Set([...selectedRows, ...newDomains])]
      if (!isEmpty(newDomains)) {
        setSelectedRows(selectedDomains)
        dispatch(PolicyData.updateLocalPolicyData({ browserDomains: selectedDomains.map(b => b.domain) }))
      }
    },
    processAssignment: processAssignment,
    labelFields: { name: FIELD_NAME_MAPPING, description: FIELD_DESCRIPTION_MAPPING },
  })

  const handleAddFromDomains = useCallback(() => {
    setFilteredAssignable(enabledDomains)
    setDialogId(Symbol('assignmentId'))
  }, [enabledDomains, setDialogId])

  const onDelete = useCallback(
    (guid: string) => {
      const selectedDomains = selectedRows.filter(row => row.guid !== guid)
      setSelectedRows(selectedDomains)
      dispatch(PolicyData.updateLocalPolicyData({ browserDomains: selectedDomains.map(d => d.domain) }))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedRows],
  )

  const columns = useMemo(
    () => [
      {
        dataKey: FIELD_NAME_MAPPING,
        label: t('policy.sections.whitelist.name'),
        sortable: false,
        persistent: true,
        width: 250,
      },
      {
        dataKey: FIELD_DESCRIPTION_MAPPING,
        label: t('policy.sections.whitelist.description'),
        show: false,
        sortable: false,
      },
      {
        dataKey: 'action',
        icon: true,
        align: 'right' as TableCellProps['align'],
        renderCell: (rowData: any, rowDataIndex: number) => {
          return (
            canUpdate && (
              <IconButton size="small" onClick={() => onDelete(rowData.guid)}>
                <BasicDelete />
              </IconButton>
            )
          )
        },
        renderLabel: () =>
          canUpdate && (
            <IconButton size="small" onClick={handleAddFromDomains}>
              <BasicAddRound />
            </IconButton>
          ),
        styles: { width: 30 },
      },
    ],
    [handleAddFromDomains, onDelete, canUpdate, t],
  )

  return (
    <ContentAreaPanel title={t('policy.sections.whitelist.title')} ContentWrapper={SecuredContentBoundary}>
      <Typography variant="body2">
        <Trans t={t} i18nKey="policy.sections.whitelist.paragraph" components={[<Link href="#/settings/whitelisting"></Link>]} />
      </Typography>
      <TableView rows={selectedRows} columns={columns} noDataPlaceholder={t('policy.sections.domains.addDomain')} />
      <Dialog {...dialogOptions} />
    </ContentAreaPanel>
  )
}

export default WhitelistDomains
