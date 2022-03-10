export enum ChallengeState {
  InProgress = 'in_progress',
  NotApplicable = 'not_applicable',
  NoMfa = 'no_mfa',
  Ok = 'ok',
  Deny = 'deny',
  Fraud = 'fraud',
  Timeout = 'timeout',
  Unknown = 'unknown',
  Failed = 'failed',
  MfaSkipped = 'mfa_skipped',
}
