import type { GeneralSettingsOptions } from '@ues-data/bis'
import { OperatingMode } from '@ues-data/bis/model'

export default (data: GeneralSettingsOptions) => ({
  tenantSettings: {
    operatingMode: data?.generalSettings?.tenantSettings?.operatingMode || OperatingMode.PASSIVE,
  },
})
