import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

interface RiskEnginesSettingTableProps {
  hideSettingColumn?: boolean
  children: any
}

const RiskEnginesSettingTable: React.FC<RiskEnginesSettingTableProps> = ({ children, hideSettingColumn = false }) => {
  const { t } = useTranslation()

  return (
    <Box mt={6} mb={2}>
      <TableContainer>
        <Table aria-label="risk-engines-setting-table">
          <TableHead>
            <TableRow>
              <TableCell>{t('policies.details.riskEngineRiskFactor')}</TableCell>
              {!hideSettingColumn && <TableCell>{t('policies.details.riskEngineSetting')}</TableCell>}
              <TableCell>{t('common.riskLevel')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {children.map ? (
              children.map((child, index) => (
                <TableRow key={index}>
                  {child.props?.children?.map((child, index) => (
                    <TableCell aria-colindex={index} key={index}>
                      {child}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                {children.props?.children?.map((child, index) => (
                  <TableCell aria-colindex={index} key={index}>
                    {child}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default RiskEnginesSettingTable
