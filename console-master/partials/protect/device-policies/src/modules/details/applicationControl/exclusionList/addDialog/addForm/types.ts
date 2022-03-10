import type { ExclusionField } from './constants'

interface Exclusion {
  [ExclusionField.path]: string
}

export { Exclusion }
