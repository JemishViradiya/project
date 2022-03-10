export type Response<TData = unknown> = Promise<{
  data?: TData
  status?: number
}>

export enum EgressHealthConnectorState {
  Online = 'Online',
  Offline = 'Offline',
}
