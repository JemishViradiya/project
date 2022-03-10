import type { Icon } from '@material-ui/core'

import type { ConnectorConfigInfo, ConnectorHealth } from '@ues-data/gateway'

export enum HealthType {
  Green = 'GREEN',
  Yellow = 'YELLOW',
  Red = 'RED',
}

export type UseConnectorStatusFn = (args: {
  health?: ConnectorHealth | `${ConnectorHealth}`
  connector?: Partial<ConnectorConfigInfo>
}) => { message: string; className: string; Icon: typeof Icon }
