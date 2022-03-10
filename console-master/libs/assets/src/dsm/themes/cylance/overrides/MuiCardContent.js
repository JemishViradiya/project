import { MAX_INPUT_FIELD_WIDTH } from '../../../components/common'

const MuiCardContent = ({ spacing }) => ({
  root: {
    padding: `${spacing(0)}px`,
    '& > .MuiTypography-root.MuiTypography-body2': {
      maxWidth: MAX_INPUT_FIELD_WIDTH,
    },
    '& > .MuiTypography-body1': {
      maxWidth: MAX_INPUT_FIELD_WIDTH,
    },
    '&:last-child': {
      paddingBottom: `${spacing(0)}px`,
    },
    '& .narrow': {
      maxWidth: MAX_INPUT_FIELD_WIDTH,
    },
  },
})

export default MuiCardContent
