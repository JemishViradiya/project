import type { Response } from '@ues-data/shared'

import type { PredefinedEmail } from './predefinedemail-types'

interface EnrollmentEmailInterface {
  getPredefinedEnrollmentEmail(type: 'mobile' | 'desktop', format: 'html' | 'plaintext'): Response<PredefinedEmail>
}

const EnrollmentEmailInterface = void 0

export default EnrollmentEmailInterface
