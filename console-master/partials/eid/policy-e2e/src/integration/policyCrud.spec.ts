import { authenticatorsMock, policyMock } from '@ues-data/eid/mocks'

import { getButton, getButtons, getLabel, getSubmitButton, getTextBoxLabel, setLocalStorageState } from '../support/settings'

const policyNameForCreate = 'createName'
const policyDescriptionForCreate = 'createDescription'
const updateGuid = '9906e78b-4ccc-4080-8b6c-fd2367c45d02'
const targetAuthId = '5109e9f3-0788-4ada-8fcd-3bb64b36b611'
const copyItem = itemToCopy => {
  return JSON.parse(JSON.stringify(itemToCopy))
}

// submit form
// using @policyCreate capture the EID POST create payload
// verify payload against payloadToVerify parameter
const verifyCreatePayload = payloadToVerify => {
  const payload = copyItem(payloadToVerify)
  getSubmitButton(true)
    .click()
    .wait('@policyCreate')
    .its('request.body')
    .then(body => {
      // verify complex members separately - ignore order to make less fragile
      // console.log('VerifyCreatePayload', { body, payload })
      expect(body['authenticators']).to.deep.equals(payload['authenticators'])
      expect(body['exceptions']).to.deep.equals(payload['exceptions'])
      body['authenticators'] = payload['authenticators'] = undefined
      body['exceptions'] = payload['exceptions'] = undefined
      expect(body).contains(payload)
    })
}

// submit form
// using @policyCreate capture the EID POST create payload
// verify payload against payloadToVerify parameter
const verifyUpdatePayload = payloadToVerify => {
  const payload = copyItem(payloadToVerify)
  payload['authenticators'] = copyItem(payloadToVerify['authenticators'])
  getSubmitButton(true)
    .click()
    .wait('@policyUpdate')
    .its('request.body')
    .then(body => {
      // verify complex members separately - ignore order to make less fragile
      // console.log('VerifyUpdatePayload!!!!!!!!!!!!!!!!', { body, payload })
      expect(body['authenticators']).to.deep.equals(payload['authenticators'])
      expect(body['exceptions']).to.deep.equals(payload['exceptions'])
      body['authenticators'] = payload['authenticators'] = undefined
      body['exceptions'] = payload['exceptions'] = undefined
      expect(body).contains(payload)
    })
}

const verifyDelete = guid => {
  getButton('deletePolicyConfirmationDialog.confirmButton')
    .click()
    .wait('@policyDelete')
    .should(xhr => {
      expect(xhr.request.url).to.match(new RegExp(guid + '$'))
    })
}

describe('EID policy create testcase', () => {
  before(() => {
    setLocalStorageState()
  })
  beforeEach(() => {
    setLocalStorageState()
    window.localStorage.setItem('UES.MockOverride.eidCreatePolicy.Enabled', 'true')

    // Single visit for all create tests
    I.visit('#/enterpriseIdentity/create')

    I.intercept(
      {
        method: 'POST',
        pathname: '/**/api/authentication-policies',
      },
      {
        statusCode: 200,
      },
    ).as('policyCreate')
  })
  it('testing create payload', () => {
    I.loadI18nNamespaces('eid/common').then(() => {
      // Must specify a authenticator prior to saving policy
      getButton('authenticatorsList.addButton').click()
      // select the first authenticator from mock - these are sorted when presenting
      I.findByRole('generic', { name: getLabel('addAuthenticatorsDialog.dropdownLabel') }).type('{enter}')

      getButton('addAuthenticatorsDialog.addButton').click()

      // add the first app to the exception list
      getButton('applicationExceptionButton').click()
      I.findByRole('checkbox', { name: 'DAC App1' }).click()
      I.findByTitle('Add selected items').click()
      I.findAllByText('Save').eq(1).click()

      // Must specify a authenticator for app exception
      getButtons('authenticatorsList.addButton').last().click()
      I.findByRole('generic', { name: getLabel('addAuthenticatorsDialog.dropdownLabel') }).type('{enter}')
      getButton('addAuthenticatorsDialog.addButton').click()

      const payloadToValidate = {}
      payloadToValidate['authenticators'] = {
        1: [
          authenticatorsMock?.sort((a: any, b: any) => {
            return a.name.localeCompare(b.name)
          })[0].id,
        ],
      }
      payloadToValidate['exceptions'] = [
        {
          name: 'DAC App1',
          software_id: 'dave.test.com',
          authenticators: {
            1: [
              authenticatorsMock?.sort((a: any, b: any) => {
                return a.name.localeCompare(b.name)
              })[0].id,
            ],
          },
        },
      ]
      getTextBoxLabel('name').clear().type(policyNameForCreate)
      payloadToValidate['name'] = policyNameForCreate
      getTextBoxLabel('description').clear().type(policyDescriptionForCreate)
      payloadToValidate['description'] = policyDescriptionForCreate
      verifyCreatePayload(payloadToValidate)
    })
  })
})

describe('EID policy update testcase', () => {
  beforeEach(() => {
    setLocalStorageState()
    window.localStorage.setItem('UES.MockOverride.eidUpdatePolicy.Enabled', 'true')

    // Single visit for all create tests
    I.visit(`#/enterpriseIdentity/update/${updateGuid}`)

    I.intercept(
      {
        method: 'PUT',
        pathname: `/**/api/authentication-policies/${updateGuid}`,
      },
      {
        statusCode: 200,
      },
    ).as('policyUpdate')
  })
  it('testing update payload', () => {
    I.loadI18nNamespaces('eid/common').then(() => {
      //delete the first default authenticator
      I.findAllByRole('checkbox').eq(1).click()
      getButton('authenticatorsList.deleteButton').should('not.be.disabled').click()

      //delete the first authenticor for app exception
      I.findAllByRole('checkbox').eq(3).click()
      getButton('authenticatorsList.deleteButton').should('not.be.disabled').click()

      const payloadToValidate = { ...policyMock.filter(entry => entry.id === updateGuid)[0] }
      // Make form dirty
      getTextBoxLabel('name').clear().type(policyNameForCreate)
      payloadToValidate['name'] = policyNameForCreate
      delete payloadToValidate.id
      delete payloadToValidate.risk_factors
      delete payloadToValidate.created
      delete payloadToValidate.last_modified

      payloadToValidate['authenticators'] = {
        1: [targetAuthId],
      }
      payloadToValidate.exceptions[0].authenticators = {
        1: [targetAuthId],
      }
      verifyUpdatePayload(payloadToValidate)
    })
  })
})

describe('EID policy delete testcase', () => {
  it('testing delete policy', () => {
    setLocalStorageState()
    window.localStorage.setItem('UES.MockOverride.eidDeletePolicy.Enabled', 'true')

    I.visit(`#/enterpriseIdentity/update/${updateGuid}`)

    I.intercept(
      {
        method: 'DELETE',
        pathname: `/**/api/authentication-policies/${updateGuid}`,
      },
      {
        statusCode: 200,
      },
    ).as('policyDelete')
    I.loadI18nNamespaces('eid/common').then(() => {
      I.findByRole('button', { name: getLabel('updateFormDeletePolicyTooltip'), timeout: 8000 }).click()
      verifyDelete(updateGuid)
    })
  })
})
