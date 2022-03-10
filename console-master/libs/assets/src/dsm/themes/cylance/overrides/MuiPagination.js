const MuiPagination = ({ palette }) => ({
  root: {
    order: -1,
    '& .MuiButtonBase-root': {
      '&.PaginationItem-selected': {
        color: 'white',
      },
      '&:not([aria-current="true"])': {
        color: palette.text.primary,
        '&:focus': {
          boxShadow: `0px 0px 0px 2px ${palette.logicalGrey[100]}`,
        },
        '&:hover': {
          backgroundColor: palette.logicalGrey[100],
        },
        '&:active': {
          backgroundColor: palette.logicalGrey[200],
        },
        '&.Mui-disabled .MuiSvgIcon-root': {
          color: palette.text.disabled,
        },
      },
    },
    '& .MuiSvgIcon-root': {
      color: palette.text.secondary,
    },
  },
})

export default MuiPagination
