import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => {
  const arrowButtonWidth = 48
  const categoryCheckboxWidth = 38
  const subcategorySpacing = arrowButtonWidth + categoryCheckboxWidth - categoryCheckboxWidth / 2

  return {
    container: {
      maxHeight: '750px',
      overflowY: 'auto',
      resize: 'vertical',
      marginTop: theme.spacing(4),
      border: `1px solid ${theme.palette.grey[300]}`,

      '& .MuiAccordion-root': {
        padding: 0,

        '&::before': {
          height: 0,
        },
      },

      '& .MuiAccordionDetails-root': {
        padding: 0,
      },

      '& .MuiAccordion-root.Mui-expanded': {
        margin: 0,
      },

      '& .MuiAccordionSummary-content .MuiCheckbox-root': {
        width: `${categoryCheckboxWidth}px`,
      },

      '& .MuiAccordionSummary-expandIcon': {
        width: `${arrowButtonWidth}px`,
        order: -1,
      },
    },
    searchContainer: {
      backgroundColor: '#fff',
      padding: theme.spacing(3),
      position: 'sticky',
      top: 0,
      zIndex: 1,

      '& .MuiTextField-root': {
        marginBottom: 0,
      },
      '& .MuiInputBase-adornedStart': {
        padding: `0 ${theme.spacing(2)}px`,
      },
      '& input': {
        padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
      },
    },
    categoryContainer: {
      paddingLeft: theme.spacing(2),
    },
    subcategoriesContainer: {
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: `${subcategorySpacing}px`,
    },
  }
})
