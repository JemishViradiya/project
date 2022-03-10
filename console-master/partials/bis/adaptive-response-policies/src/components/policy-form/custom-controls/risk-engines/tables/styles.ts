import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: any) => {
  return {
    container: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    card: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
    },
    table: {
      marginTop: theme.spacing(2),
      border: 'none',
    },
    operatingModeSelectWrapper: {
      marginTop: theme.spacing(8),
      marginBottom: 0,
    },
    metadata: {
      display: 'flex',
      flexFlow: 'column',
      width: '100%',
      justifyContent: 'stretch',
    },
    metadataInputName: {
      marginBottom: '50px',
    },
    metadataInput: {
      backgroundColor: '#f4f5f6',
    },
    riskEngineTableBox: {
      margin: 0,
    },
    description: {},
    text: {
      height: '25%',
    },
    riskReductionLabel: {
      display: 'flex',
      gap: '8px',
      height: '100%',
      flexWrap: 'nowrap',
      alignItems: 'center',
      paddingLeft: '12px',
      margin: '0',
      color: theme.palette.cyBlueGrey['800'],
    },
    hidden: {
      visibility: 'hidden',
    },
    tableRiskFactors: {
      display: 'flex',
      flexFlow: 'row wrap',
      alignItems: 'stretch',
    },
    tableActions: {
      display: 'flex',
      flexFlow: 'row wrap',
      alignItems: 'center',
    },
    behavioralIndicatorBackground: {
      height: '4px',
      backgroundColor: '#e0e0e0',
      margin: '10px 0 4px',
      position: 'relative',
    },
    behavioralIndicator: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      height: '4px',
    },
    tableRiskFactorItem: {
      border: `1px solid ${theme.palette.divider}`,
      display: 'inline-block',
      padding: '9px 14px 11px',
      margin: '0 5px 5px 0',
      minHeight: '72px',
      lineHeight: '21px',
      width: '205px',
      boxSizing: 'border-box',
      whiteSpace: 'pre-line',
      wordWrap: 'break-word',
    },
    addActionContainer: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    actionChip: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
    },
    automaticRiskReduction: {
      marginTop: theme.spacing(0),
      marginBottom: theme.spacing(0),
    },
  }
})
