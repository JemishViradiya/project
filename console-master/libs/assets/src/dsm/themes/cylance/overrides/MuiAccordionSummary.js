const MuiAccordionSummary = ({ spacing }) => ({
  root: {
    padding: `${spacing(0)}px`,
    '&$expanded': {
      minHeight: 'unset',
    },
  },
  content: {
    margin: `${spacing(0)}px`,
    padding: `${spacing(0)}px`,
    display: 'flex',
    flexDirection: 'column',
    '&.Mui-expanded': {
      margin: `${spacing(0)}px`,
    },
  },
  expandIcon: {
    '&.subtitle': {
      marginBottom: `${spacing(5)}px`,
    },
  },
})

export default MuiAccordionSummary
