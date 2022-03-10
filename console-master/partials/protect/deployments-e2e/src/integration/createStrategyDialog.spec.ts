import { CommonFns } from '@ues/assets-e2e'

const { loadingIconShould } = CommonFns(I)

describe('Update Strategies - Create New Strategy', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
  })
  beforeEach(() => {
    window.localStorage.setItem('Deployments.UpdateRules.enabled', 'true')
    window.localStorage.setItem('Deployments.UpdateStrategies.enabled', 'true')
    I.visit('/')
    loadingIconShould('not.exist')
  })

  // Page Element Selectors
  const addButton = '[data-autoid=update-strategies-add]'
  const addStrategyDialog = '[data-autoid=update-strategies-add-dialog] .MuiPaper-root'
  const dialogTitle = '[data-autoid=update-strategies-add-dialog] .MuiDialogTitle-root h2'
  const addProductButton = '[data-autoid=create-update-strategy--add-product]'
  const strategyNameInput = '[data-autoid=create-update-strategy--name] input'
  const strategyDescriptionInput = '[data-autoid=create-update-strategy--description] input'

  const productRow = index => `[data-autoid=create-update-strategy--productrow-${index}`
  const productRowStrategySelect = index => `[data-autoid=create-update-strategy--productrow-${index}-select-strategy]`
  const productRowVersionSelect = index => `[data-autoid=create-update-strategy--productrow-${index}-select-version]`
  const productRowDeleteButton = index => `[data-autoid=create-update-strategy--productrow-${index}-delete]`
  const productRowProductSelect = index => `[data-autoid=create-update-strategy--productrow-${index}-select-product]`

  const selectProduct = (product: string) => `[data-autoid=create-update-strategy--product-${product}]`

  const selectItemDoNotUpdate = '[data-autoid=create-update-strategy--strategy-DoNotUpdate]'
  const selectItemFixed = '[data-autoid=create-update-strategy--strategy-Fixed]'

  const selectVersionItem = (index: number) => `[data-autoid=create-update-strategy--version-index-${index}]`

  const submitStrategyButton = '[data-autoid=create-update-strategy--submit'
  const cancelButton = '[data-autoid=create-update-strategy--cancel'

  context('Add "Update Strategies" Button', () => {
    it('should display button', () => {
      I.get(addButton).should('exist').and('contain', 'Add Update Strategy')
    })
  })

  context('Add "Update Strategies" Flow', () => {
    const fillForm = (submit = true) => {
      I.get(productRowStrategySelect(0)).click()
      I.get(selectItemDoNotUpdate).click()

      I.get(strategyNameInput).type('Strategy Name')
      I.get(strategyDescriptionInput).type('Strategy Description')

      if (submit) I.get(submitStrategyButton).click()
    }

    beforeEach(() => {
      I.get(addButton).click()
    })

    it('should show dialog title', () => {
      I.get(dialogTitle).should('have.text', 'Add Update Strategy')
    })

    it('should add new strategies', () => {
      fillForm(true)
      I.get(addStrategyDialog).should('not.exist')
    })

    it('should add new product row', () => {
      fillForm(false)
      I.get(addProductButton).click()

      I.get(productRow(0)).should('exist')
      I.get(productRow(1)).should('exist')
    })

    it('should add new product rows and delete new row', () => {
      fillForm(false)
      I.get(addProductButton).click()
      I.get(addProductButton).click()

      I.get(productRow(0)).should('exist')
      I.get(productRow(1)).should('exist')
      I.get(productRow(2)).should('exist')

      I.get(productRowDeleteButton(1)).click()

      I.get(productRow(0)).should('exist')
      I.get(productRow(1)).should('exist')
      I.get(productRow(2)).should('not.exist')
    })

    it('should allow version options after selecting fixed strategy', () => {
      fillForm(false)

      I.get(selectVersionItem(0)).should('not.exist')
      I.get(selectVersionItem(1)).should('not.exist')
      I.get(selectVersionItem(2)).should('not.exist')
      I.get(selectVersionItem(3)).should('not.exist')

      I.get(productRowStrategySelect(0)).click()
      I.get(selectItemFixed).click()
      I.get(productRowVersionSelect(0)).click()

      I.get(selectVersionItem(0)).should('exist')
      I.get(selectVersionItem(1)).should('exist')
      I.get(selectVersionItem(2)).should('exist')
      I.get(selectVersionItem(3)).should('not.exist')
    })

    it('should reset form when dialog closes', () => {
      fillForm(false)

      I.get(cancelButton).click()
      I.get(addButton).click()

      // fields should be empty
      I.get(strategyNameInput).should('have.text', '')
      I.get(strategyDescriptionInput).should('have.text', '')
    })
  })
})
