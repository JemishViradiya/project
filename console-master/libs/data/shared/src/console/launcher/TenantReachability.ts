import type { OpaqueResponse } from '../../lib/fetchOpaque'
import { fetchOpaque } from '../../lib/fetchOpaque'
import type { Tenant } from './types'

const checkedIds: Record<string, boolean> = {}

export async function checkIfTenantReachable(tenantUri: string): Promise<OpaqueResponse> {
  // the favicon is a reliable resource to hit to check if UEM is up
  const tenantFaviconUri = new URL(tenantUri).origin.toString() + '/admin/favicon.ico'
  return fetchOpaque(tenantFaviconUri, { mode: 'no-cors' })
}

export default async function checkTenantsReachability(tenants: Array<Tenant>): Promise<void> {
  await Promise.all(
    tenants.map(async tenant => {
      if (tenant.id in checkedIds) {
        tenant.isReachable = checkedIds[tenant.id]
      } else if (!tenant.isCloud) {
        const uemConsole = tenant.services[0]
        const result = await checkIfTenantReachable(uemConsole.url)
        if (result.type === 'error') {
          tenant.isReachable = false
        } else {
          tenant.isReachable = true
        }
        checkedIds[tenant.id] = tenant.isReachable
      }
    }),
  )
}
