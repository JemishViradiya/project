import { MAX_INPUT_FIELD_WIDTH } from '../../../components/common'

const MuiAccordionDetails = ({ spacing }) => {
  return {
    root: {
      padding: [[spacing(0), spacing(0), spacing(3), spacing(0)]],
      '&.rows': {
        flexDirection: 'column',
        display: 'flex',
      },
      '& .MuiTypography-body2': {
        maxWidth: MAX_INPUT_FIELD_WIDTH,
      },
    },
  }
}

export default MuiAccordionDetails
