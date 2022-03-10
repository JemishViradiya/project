import type { Response } from '@ues-data/shared'

import type { ComplianceInfo } from './compliance-types'

interface ComplianceInterface {
  getCompliance(userId: string, deviceId: string): Response<ComplianceInfo>
}

const ComplianceInterface = void 0

export default ComplianceInterface
