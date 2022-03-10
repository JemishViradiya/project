import { CYLANCE_COLORS as colors } from './../colors'

const MuiButtonGroup = ({ palette }) => {
  const hoverStyles = {
    backgroundColor: palette.type === 'dark' ? colors.secondary[900] : colors.secondary[100],
    border: `1px solid ${colors.secondary[500]}`,
    zIndex: 1,
    '&.MuiButtonGroup-groupedOutlinedHorizontal:not(:last-child)': {
      borderRightColor: colors.secondary[500],
    },
  }

  const activeStyles = {
    backgroundColor: palette.type === 'dark' ? colors.secondary[800] : colors.secondary[200],
    border: `1px solid ${colors.secondary[500]}`,
    zIndex: 1,
  }

  return {
    root: {
      '& button': {
        '&.MuiButton-outlined': {
          '&$disabled': {
            // Use base color for disabled border (doesn't change for disabled button group)
            border: '1px solid ' + palette.logicalGrey[500],
          },
        },
      },
    },
    grouped: {
      color: palette.logicalGrey[600],
      border: `1px solid ${palette.logicalGrey[500]}`,
      minWidth: 0,
      '&.MuiButtonGroup-groupedOutlinedHorizontal:not(:last-child)': {
        borderRightColor: palette.logicalGrey[500],
      },
      '&:hover': {
        ...hoverStyles,
        // padding: '7px 15px', // --NOTE: accounting for 1px border here, as mui does for their "outline" buttons
      },
      '&.MuiButton-containedSecondary': {
        ...activeStyles,
        color: palette.logicalGrey[800],
        //  padding: '7px 15px', // --NOTE: accounting for 1px border here, as mui does for their "outline" buttons
        '&.MuiButtonGroup-groupedOutlinedHorizontal:not(:last-child)': {
          borderRightColor: colors.secondary[500],
        },
      },
      '&.MuiButton-outlined': {
        '&.selected': {
          backgroundColor: palette.type === 'dark' ? colors.secondary[700] : colors.secondary[200],
        },
      },
      '&.MuiIconButton-root': {
        color: palette.logicalGrey[500],
        border: `1px solid ${palette.logicalGrey[500]}`,
        //  padding: '7px', // --NOTE: accounting for 1px border here, as mui does for their "outline" buttons
        '&:hover': {
          ...hoverStyles,
          padding: '7px', // --NOTE: accounting for 1px border here, as mui does for their "outline" buttons
        },
        '&.MuiIconButton-colorSecondary': {
          ...activeStyles,
          color: palette.logicalGrey[600],
          //    padding: '7px', // --NOTE: accounting for 1px border here, as mui does for their "outline" buttons
        },
      },
      '&.Mui-disabled': {
        color: palette.logicalGrey[500],
        backgroundColor: palette.logicalGrey['A100'],
        border: `1px solid ${palette.logicalGrey['A100']}`,
        '&:not(:first-child)': {
          borderLeft: `1px solid ${palette.logicalGrey[500]}`,
        },
      },
      '& span': {
        '& span': {
          // Use start icon as the icon for the icon button group (needs to be centered)
          '&.MuiButton-startIcon': {
            marginRight: 0,
            marginLeft: 0,
          },
        },
      },
    },
  }
}

export default MuiButtonGroup
