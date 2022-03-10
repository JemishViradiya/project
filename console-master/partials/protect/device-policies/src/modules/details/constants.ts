// dependencies
import { RootPolicyField } from '@ues-data/epp'

const SWITCH_RIGHT_PAD = 1
const LEFT_INDENT = 13
const CONTROL_TOP_PAD = 6
const NESTED_CONTROL_TOP_PAD = 4
const CAPTION_TOP_MARGIN = 1

const UNTOUCHED_FIELD_ERRORS = {
  [RootPolicyField.policy_name]: 'PolicyNameRequired',
}

export { SWITCH_RIGHT_PAD, LEFT_INDENT, CONTROL_TOP_PAD, NESTED_CONTROL_TOP_PAD, CAPTION_TOP_MARGIN, UNTOUCHED_FIELD_ERRORS }
