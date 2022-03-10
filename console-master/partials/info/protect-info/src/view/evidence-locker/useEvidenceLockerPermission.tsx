import { Permission, usePermissions } from '@ues-data/shared'

export const useEvidenceLockerPermissions = () => {
  const { hasPermission } = usePermissions()
  const readPermission = hasPermission(Permission.BIP_FILESUMMARY_READ) // view evidence locker table permission
  const readFilePermission = hasPermission(Permission.BIP_FILECONTENT_READ) // download file permission for button
  const deleteFilePermission = hasPermission(Permission.BIP_FILE_DELETE) // delete file permission for button
  const readEventsPermission = hasPermission(Permission.BIP_EVENT_READ) // permission to link Events page

  return {
    canReadEvidenceLocker: readPermission,
    canReadFle: readFilePermission,
    canDeleteFile: deleteFilePermission,
    canReadEvents: readEventsPermission,
  }
}
