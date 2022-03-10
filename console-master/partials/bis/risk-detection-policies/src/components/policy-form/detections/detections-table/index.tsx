import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import Paper from '@material-ui/core/Paper'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { RiskLevelChip } from '@ues-bis/shared'
import type { UesTheme } from '@ues/assets'

import { useDetectionsContext } from '../context'
import { DetectionsTableItems } from '../detections-table-items'

export interface DetectionsTableProps {
  readOnly: boolean
}

export const useStyles = makeStyles<UesTheme>(theme => ({
  table: {
    marginTop: theme.spacing(2),
    border: 'none',
  },
  riskCell: {
    width: theme.spacing(8),
  },
  row: {
    '&:hover': {
      background: 'transparent !important',
    },
  },
}))

const StyledTableHeadCell = withStyles(() => ({ body: { border: 'none', verticalAlign: 'baseline' } }))(TableCell)

const StyledTableCell = withStyles(() => ({ body: { verticalAlign: 'top' } }))(TableCell)

export const DetectionsTable: React.FC<DetectionsTableProps> = memo(({ readOnly }) => {
  const styles = useStyles()
  const { t } = useTranslation('bis/ues')
  const { value } = useDetectionsContext()

  const rows = useMemo(
    () =>
      value.map(data => (
        <TableRow key={data.riskLevel} className={styles.row}>
          <StyledTableCell>
            <RiskLevelChip riskLevel={data.riskLevel} t={t} />
          </StyledTableCell>
          <StyledTableCell>
            <DetectionsTableItems readOnly={readOnly} data={data} />
          </StyledTableCell>
        </TableRow>
      )),
    [value, styles.row, t, readOnly],
  )

  // TODO: Convert TableContainer to Grid once UES-4215 is ready
  return (
    <Paper elevation={0} className={styles.table}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableHeadCell className={styles.riskCell}>
                {t('bis/ues:detectionPolicies.tableHeader.risk')}
              </StyledTableHeadCell>
              <StyledTableHeadCell>{t('bis/ues:detectionPolicies.tableHeader.detection')}</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
})
