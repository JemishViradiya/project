import React, { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { TablePagination, Typography } from '@material-ui/core'
import { Pagination, PaginationItem } from '@material-ui/lab'

import type { UsePagination } from '../../../tables/usePagination/usePagination'

const dummyPageChange = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
  /* ignore */
}

export const StandardPagination = ({
  total,
  pagesCount,
  rowsPerPageOptions,
  paginationProps,
}: {
  total: number
  pagesCount: number
  rowsPerPageOptions: number[]
  paginationProps: UsePagination
}) => {
  const { t } = useTranslation(['tables'])
  const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = paginationProps

  return (
    <TablePagination
      component="div"
      count={total}
      rowsPerPageOptions={rowsPerPageOptions}
      page={page ? page - 1 : undefined}
      rowsPerPage={rowsPerPage}
      onPageChange={dummyPageChange}
      onRowsPerPageChange={onChangeRowsPerPage}
      ActionsComponent={() => (
        <Pagination
          count={pagesCount}
          showFirstButton
          showLastButton
          shape="rounded"
          color="secondary"
          size="small"
          onChange={onChangePage}
          page={page}
          renderItem={item => (
            <PaginationItem
              {...item}
              component={forwardRef((props, ref) => (
                <Typography {...props} innerRef={ref} variant="caption" />
              ))}
            />
          )}
        />
      )}
      labelRowsPerPage={<Typography variant="caption">{t('rowsPerPage')}</Typography>}
      labelDisplayedRows={({ from, to, count }) => (
        <Typography variant="caption">{t('elementsCount', { from, to, count })}</Typography>
      )}
      SelectProps={{
        renderValue: value => <Typography variant="caption">{value}</Typography>,
      }}
    />
  )
}
