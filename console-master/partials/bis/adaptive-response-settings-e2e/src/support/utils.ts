import { apolloQuery } from '@ues-behaviour/shared-e2e'
import { OperatingMode } from '@ues-data/bis/mocks'
import { PolicySchema } from '@ues-data/bis/model'

export const TranslationKey = {
  OperatingModeTitle: 'bis/ues:settings.operatingMode.title',
  OperatingModeDescription: 'bis/ues:settings.operatingMode.description',
  SaveButton: 'bis/shared:common.save',
  CancelButton: 'bis/shared:common.cancel',
  OperatingModeActive: `bis/ues:settings.operatingMode.options.${OperatingMode.ACTIVE}`,
  OperatingModePassive: `bis/ues:settings.operatingMode.options.${OperatingMode.PASSIVE}`,
}

export const getTabPanel = () => I.findByRole('tabpanel')

export const visitPage = (pageUrl: string, callback?) => {
  I.visit(pageUrl, {
    onBeforeLoad: contentWindow => {
      contentWindow.model.mockAll({
        id: 'bis.policySchema',
        data: apolloQuery({
          queryName: 'policySchema',
          result: PolicySchema.OldPolicy,
        }),
      })
      callback?.(contentWindow)
    },
  })
}
