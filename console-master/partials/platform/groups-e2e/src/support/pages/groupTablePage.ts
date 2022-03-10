import { GroupBasePage } from './groupBasePage'

const getRows = () => I.findAllByRole('row')

const getAddGroupButton = () => I.findByRole('button', { name: I.translate('platform/common:groups.table.addGroup') })

export const GroupTable = {
  getAddGroupButton,
  getRows,
  ...GroupBasePage,
}
