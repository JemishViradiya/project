import type { DirectoryInstance } from '@ues-data/platform'

export type SyncStateProps = {
  connection: DirectoryInstance
}

export interface SyncSettingsProps {
  editable: boolean
  syncSettings: Record<string, unknown>
  onSettingsUpdate: (newState) => void
  error?: string
}
