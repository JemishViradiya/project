const MuiExpansionPanelSummary = ({ palette, spacing }) => ({
  root: {
    '& .MuiExpansionPanelSummary-expandIcon': {
      marginRight: 0,
    },
    '&.stand-alone-expansion-panel': {
      minHeight: '64px',
      '&:hover:not($disabled)': {
        backgroundColor: palette.logicalGrey[200],
        '& .MuiExpansionPanelSummary-expandIcon': {
          color: palette.grey[800],
        },
      },
      '&$expanded': {
        backgroundColor: palette.logicalGrey[200],
        borderBottom: `1px solid ${palette.grey['A100']}`,
        minHeight: '64px',
      },
    },
  },
  content: {
    padding: [[spacing(0), spacing(4)]],
  },
})

export default MuiExpansionPanelSummary
