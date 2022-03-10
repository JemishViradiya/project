export type EvidenceFile = {
  blobData?: Blob
  fileName: string
  presignedDownloadURL?: string
}

type host = string[]

// TODO remove or update it later.
// Skipped it in UI for a while. It triggers TS error and cannot retrieve Response.headers from API call in UI code
export type PresignedDownloadURL = {
  headers: host
  url: string
}

export type EvidenceFileUsersItem = {
  id: string
  name: string
  email: string
  title: string
  department: string
}

export type EvidenceFileDevicesItem = {
  guid: string
  name: string
}

export type EvidenceFileDetails = {
  hash: string
  users: EvidenceFileUsersItem[]
  devices: EvidenceFileDevicesItem[]
}
