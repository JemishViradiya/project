/* eslint-disable @typescript-eslint/no-useless-constructor */
import type { Permission } from '../permissions/types'
import type { ServiceId } from '../service'

/* eslint-disable @typescript-eslint/no-useless-constructor */
export abstract class DisplayableError extends Error {
  original_error: Error
  suppressed: boolean
  constructor(cause: string | Error, message?: string, suppressed?: boolean) {
    if (typeof cause === 'string') {
      super(cause)
      this.original_error = this
    } else {
      super(message || cause.message)
      this.original_error = cause || this
    }
    this.suppressed = suppressed
  }
}

export abstract class AccessError extends DisplayableError {}

export class SessionAcquisitionError extends AccessError {}

export class ServiceWorkerError extends DisplayableError {}

export class UnknownResourceError extends AccessError {
  constructor() {
    super('Resource not found')
  }
}

export class PermissionError extends AccessError {
  requiredPermissions: Permission[]

  constructor(requiredPermissions: Permission[] | [Set<Permission>], cause?: Error) {
    const first = requiredPermissions[0]
    const permissions = first && first instanceof Set ? Array.from(first.values()) : (requiredPermissions as Permission[])
    super(cause, `Needed permissions: ${permissions.join(',')}`)
    this.requiredPermissions = permissions
  }
}

export class ServiceEnabledError extends AccessError {
  service: ServiceId

  constructor(service: ServiceId, cause?: Error) {
    super(cause, `Needed service: ${service}`)
    this.service = service
  }
}

export enum GenericErrorBoundaryEvents {
  Invalidate = 'GenericErrorBoundary:Invalidate',
}
