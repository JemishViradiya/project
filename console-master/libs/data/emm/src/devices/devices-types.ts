export interface DeviceStatusDetails {
  emmType?: string
  registrationStatus?: DeviceEmmRegistrationStatus | null
}

export enum DeviceEmmRegistrationStatus {
  Success = 'Success',
  Pending = 'Pending',
  Error = 'Error',
}
