export enum ColumnKey {
  Detection = 'detection',
  DetectionTime = 'detection-time',
  Device = 'device',
  Response = 'response',
  Risk = 'risk',
  Type = 'type',
  User = 'user',
}

export type UserHrefFn = (ecoId: string) => string
