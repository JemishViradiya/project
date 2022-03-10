import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

import type { CodeceptJSElement } from './types'

export class ElementOnlyAssertion extends Error {}

chai.use(chaiAsPromised)

const isAliases = {
  isVisible: 'isDisplayed',
}
chai.use((chai, { flag, addMethod }) => {
  // eslint-disable-next-line prettier/prettier
  ;['visible', 'hidden', 'selected', 'checked', 'enabled', 'disabled', 'exist'].forEach(assertion => {
    chai.Assertion.addProperty(assertion, async function () {
      const subject: CodeceptJSElement = flag(this, 'object')
      const assertionApiName = `is${assertion[0].toUpperCase()}${assertion.slice(1)}`
      let assertionApi = subject[assertionApiName]
      if (!assertionApi) {
        assertionApi = subject[isAliases[assertionApiName]]
        if (!assertionApi) {
          throw new ElementOnlyAssertion(`${assertion} requires an Element target`)
        }
      }
      const value = await assertionApi.apply(subject)
      // console.log('chai.%s: %o', assertion, value)
      this.assert(!!value, `expected #{this} to be ${assertion}`, `expected #{this} not to be ${assertion}`, true, !!value)
    })
  })
})

export default chai
