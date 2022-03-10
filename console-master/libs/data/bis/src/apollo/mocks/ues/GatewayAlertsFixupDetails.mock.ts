import { ChallengeState } from '../../../model'

export const GatewayAlertsFixupDetailsQueryMock = {
  fixupDetails: [
    {
      datetime: 1605170280040,
      state: ChallengeState.InProgress,
    },
    {
      datetime: 1605171280940,
      state: ChallengeState.Ok,
      previousBehavioralRiskLevel: 'HIGH',
    },
    {
      datetime: 1605171280940,
      state: ChallengeState.MfaSkipped,
      previousBehavioralRiskLevel: 'HIGH',
    },
  ],
}
