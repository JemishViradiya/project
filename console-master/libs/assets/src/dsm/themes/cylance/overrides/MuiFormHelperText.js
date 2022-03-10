import { MAX_INPUT_FIELD_WIDTH } from '../../../components/common'

const MuiFormHelperText = ({ spacing, palette }) => ({
  filled: {
    color: palette.text.hint,
  },
  root: {
    '&.right-aligned': {
      textAlign: 'right',
    },
    marginTop: `${spacing(0)}px`,
    marginBottom: `${spacing(0)}px`,
    lineHeight: `${spacing(5)}px`,
    maxWidth: MAX_INPUT_FIELD_WIDTH,
  },
})

export default MuiFormHelperText
