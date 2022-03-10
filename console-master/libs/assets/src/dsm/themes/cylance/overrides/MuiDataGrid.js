import { CYLANCE_COLORS as colors } from './../colors'

const MuiDataGrid = ({ palette, spacing }) => ({
  root: {
    border: 'unset',
    '& .MuiDataGrid-row': {
      '&:hover': {
        backgroundColor: palette.logicalGrey[100],
      },
      '&.Mui-selected': {
        backgroundColor: colors.secondary[50],
        '&:hover': {
          backgroundColor: palette.logicalGrey[100],
        },
      },
    },
    '& .MuiCheckbox-colorPrimary': {
      '&.Mui-checked': {
        color: colors.secondary[500],
        '&:active': {
          color: colors.secondary[700],
        },
      },
    },
    '& .MuiCheckbox-root': {
      backgroundColor: 'transparent',
      '&:active': {
        color: colors.secondary[700],
      },
      '&:hover': {
        color: colors.secondary[600],
      },
    },
    '& .MuiDataGrid-cell': {
      paddingRight: spacing(4),
      paddingLeft: spacing(4),
      borderBottom: `1px solid ${palette.divider}`,
      '&:focus': {
        outline: 'unset',
      },
      '&:focus-within': {
        outline: 'unset',
      },
    },
    '& .MuiDataGrid-colCell': {
      paddingRight: spacing(4),
      paddingLeft: spacing(4),
      '&:focus': {
        outline: 'unset',
      },
      '&:focus-within': {
        outline: 'unset',
      },
    },
    '& .MuiDataGrid-colCellTitle': {
      fontWeight: 600,
    },
    '& .MuiDataGrid-colCellCheckbox': {
      paddingRight: 0,
      paddingLeft: 0,
    },
    '& .MuiDataGrid-colCellMoving': {
      backgroundColor: palette.secondary.backgroundColor,
    },
    '& .MuiTableSortLabel-root': {
      overflow: 'hidden',
    },
    '& .MuiDataGrid-columnHeader': {
      '&:focus': {
        outline: 'unset',
      },
      '&:focus-within': {
        outline: 'unset',
      },
    },
    '& .MuiDataGrid-columnHeaderTitleContainer': {
      '& .MuiDataGrid-columnHeaderTitle': {
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
      },
      '& div': {
        '& button': {
          marginLeft: `${spacing(1)}px`,
        },
      },

      '& .MuiBox-root': {
        '& button': {
          marginLeft: spacing(1),
        },
      },
    },
  },
})

export default MuiDataGrid
