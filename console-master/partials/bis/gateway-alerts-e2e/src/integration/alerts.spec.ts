/* eslint-disable sonarjs/no-duplicate-string */
//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import '../support'

import { GatewayAlertsFiltersQueryMock, GatewayAlertsQueryMock } from '@ues-data/bis/mocks'

import {
  clearFilters,
  getAllGridRows,
  getColumnFilterButton,
  getColumnPickerButton,
  getColumnRowsCells,
  getColumnSortingButton,
  getGrid,
  getGridToolbar,
  getPresentation,
  TranslationKey,
} from '../support/utils'

const COLUMNS_LABELS = {
  RISK: /risk$/i,
  TYPE: /type$/i,
  DETECTION: /detection$/i,
  RESPONSE: /response$/i,
  DEVICE: /device$/i,
  USER: /user$/i,
  DETECTION_TIME: /detection time$/i,
}

const ORDERED_COLUMNS_LABELS = [
  COLUMNS_LABELS.RISK,
  COLUMNS_LABELS.TYPE,
  COLUMNS_LABELS.DETECTION,
  COLUMNS_LABELS.RESPONSE,
  COLUMNS_LABELS.DEVICE,
  COLUMNS_LABELS.USER,
  COLUMNS_LABELS.DETECTION_TIME,
]

const ALERTS_MOCK_DATA = GatewayAlertsQueryMock
const ALERTS_MOCK_DATA_ROWS = ALERTS_MOCK_DATA.eventInfiniteScroll.events
const ALERTS_MOCK_DATA_ROWS_COUNT = ALERTS_MOCK_DATA_ROWS.length

const ALERTS_FILTERS_MOCK_DATA = GatewayAlertsFiltersQueryMock
const ALERTS_CRITICAL_RISK_FILTER_COUNT = ALERTS_FILTERS_MOCK_DATA.eventFilters[0].count
const ALERTS_HIGH_RISK_FILTER_COUNT = ALERTS_FILTERS_MOCK_DATA.eventFilters[1].count
const ALERTS_MEDIUM_RISK_FILTER_COUNT = ALERTS_FILTERS_MOCK_DATA.eventFilters[2].count
const ALERTS_LOW_RISK_FILTER_COUNT = ALERTS_FILTERS_MOCK_DATA.eventFilters[3].count

describe('Gateway Alerts view', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    I.loadI18nNamespaces('tables', 'bis/ues', 'bis/shared').then(() => {
      I.visit('#/alerts')
    })
  })

  describe('View', () => {
    it('Should show passive operating mode alert', () => {
      I.findByRole('alert').should('contain.text', I.translate(TranslationKey.PassiveOperatingModeTitle))
    })
  })

  describe('Table', () => {
    it('Should be loaded', () => {
      getAllGridRows().its('length').should('be.eq', ALERTS_MOCK_DATA_ROWS_COUNT)
      getGrid().should('exist')
      getGrid().should('not.contain.text', I.translate(TranslationKey.NoData))
    })

    it('Should render all default columns', () => {
      for (const labelRegex of ORDERED_COLUMNS_LABELS) {
        I.findAllByInfiniteTableColumnLabel(labelRegex).should('exist')
      }
    })

    it('Should render total results counter in the toolbar', () => {
      getGridToolbar().should(
        'contain.text',
        I.translate(TranslationKey.TotalResultsLabel, {
          total: ALERTS_MOCK_DATA.eventInfiniteScroll.total,
        }),
      )
    })
  })

  describe('Column picker', () => {
    it('Should be present', () => {
      getColumnPickerButton().should('exist')
    })

    it('Should allow for toggling all columns except detection', () => {
      const detectionColumnIndex = ORDERED_COLUMNS_LABELS.indexOf(COLUMNS_LABELS.DETECTION)

      getColumnPickerButton().click()
      getPresentation()
        .should('contain.text', I.translate(TranslationKey.ColumnPickerTitle))
        .findAllByRole('button')
        .should('have.length', ORDERED_COLUMNS_LABELS.length)
        .each((element, index) => {
          expect(element.prop('ariaDisabled')).to.eq(index === detectionColumnIndex ? 'true' : 'false')
        })
    })

    it('Should correctly handle columns toggling', () => {
      const colLabel = COLUMNS_LABELS.RISK
      const colIndex = ORDERED_COLUMNS_LABELS.indexOf(colLabel)

      getPresentation().findAllByRole('button').eq(colIndex).click()
      getPresentation().click('top')
      getGrid().findByRole('columnheader', { name: colLabel }).should('not.exist')

      getColumnPickerButton().click()
      getPresentation().findAllByRole('button').eq(colIndex).click()
      getPresentation().click('top')
      getGrid().findByRole('columnheader', { name: colLabel }).should('exist')
    })
  })

  describe('User column', () => {
    describe('Rows', () => {
      it('Should correctly render username', () => {
        getColumnRowsCells(COLUMNS_LABELS.USER).each((cell, index) => {
          const row = ALERTS_MOCK_DATA_ROWS[index]
          const expectedValue = row?.assessment?.userInfo?.displayName

          if (expectedValue) {
            I.wrap(cell).should('contain.text', expectedValue)
          } else {
            I.wrap(cell).should('not.contain.text')
          }
        })
      })

      it('Should render usernames as anchors to user details view', () => {
        I.location().then(location => {
          getColumnRowsCells(COLUMNS_LABELS.USER)
            .filter(':not(:empty)')
            .each((cell, index) => {
              const row = ALERTS_MOCK_DATA_ROWS[index]

              I.wrap(cell).within(() => {
                I.findByRole('link').should(
                  'have.attr',
                  'href',
                  `${location.origin}${location.pathname}#/users/${encodeURIComponent(btoa(row.assessment.eEcoId))}`,
                )
              })
            })
        })
      })
    })

    describe('Filtering', () => {
      it('Should be enabled', () => {
        getColumnFilterButton(COLUMNS_LABELS.USER).should('exist')
      })

      it('Should allow for filtering by text input', () => {
        getColumnFilterButton(COLUMNS_LABELS.USER).click()
        getPresentation().findByRole('textbox').type('UES')
        getPresentation().click('top')
        getGridToolbar().findByRole('button').should('contain.text', 'UES').should('exist')
        clearFilters()
      })
    })
  })

  describe('Devices column', () => {
    describe('Rows', () => {
      it('Should render correct values', () => {
        getColumnRowsCells(COLUMNS_LABELS.DEVICE).each((cell, index) => {
          const row = ALERTS_MOCK_DATA_ROWS[index]
          const expectedValue = row?.assessment?.datapoint?.source?.deviceModel

          if (expectedValue) {
            I.wrap(cell).should('contain.text', expectedValue)
          } else {
            I.wrap(cell).should('not.contain.text')
          }
        })
      })
    })

    describe('Filtering', () => {
      it('Should not be enabled', () => {
        getColumnFilterButton(COLUMNS_LABELS.DEVICE).should('not.exist')
      })
    })
  })

  describe('Risk column', () => {
    describe('Rows', () => {
      it('Should render correct values', () => {
        getColumnRowsCells(COLUMNS_LABELS.RISK).each((cell, index) => {
          const row = ALERTS_MOCK_DATA_ROWS[index]
          const riskLevel = row?.assessment?.identityAndBehavioralRisk?.level

          if (riskLevel) {
            I.wrap(cell).should('contain.text', I.translate(`bis/shared:risk.level.${riskLevel}`))
          } else {
            I.wrap(cell).should('not.contain.text')
          }
        })
      })
    })

    describe('Filtering', () => {
      it('Should be enabled', () => {
        getColumnFilterButton(COLUMNS_LABELS.RISK).should('exist')
      })

      it('Should allow for filtering by four types of risk level', () => {
        const EXPECTED_LABELS = [TranslationKey.CriticalRiskLevel, TranslationKey.HighRiskLevel, TranslationKey.MediumRiskLevel]

        const EXPECTED_COUNTERS = [
          ALERTS_CRITICAL_RISK_FILTER_COUNT,
          ALERTS_HIGH_RISK_FILTER_COUNT,
          ALERTS_MEDIUM_RISK_FILTER_COUNT,
          ALERTS_LOW_RISK_FILTER_COUNT,
        ]

        getColumnFilterButton(COLUMNS_LABELS.RISK).click()
        getPresentation().should('contain.text', I.translate(TranslationKey.RiskFilter))
        I.findAllByRole('menuitem')
          .should('have.length', 4)
          .each((element, index) => {
            I.wrap(element)
              .should('contain.text', I.translate(EXPECTED_LABELS[index]))
              .should('contain.text', EXPECTED_COUNTERS[index])
          })
          .eq(0)
          .findByRole('checkbox')
          .click()
        getPresentation().click('top')

        getGridToolbar()
          .findByRole('button')
          .findByText(new RegExp(`${I.translate(TranslationKey.CriticalRiskLevel)}`, 'i'))
          .should('exist')
        clearFilters()
      })
    })

    describe('Sorting', () => {
      it('Should be enabled', () => {
        getColumnSortingButton(COLUMNS_LABELS.RISK).should('have.attr', 'role', 'button')
      })
    })
  })

  describe('Type column', () => {
    describe('Rows', () => {
      it('Should render correct values', () => {
        getColumnRowsCells(COLUMNS_LABELS.TYPE).each(cell => {
          I.wrap(cell).should('contain.text', I.translate(`bis/shared:risk.common.identityRisk`))
        })
      })
    })

    describe('Filtering', () => {
      it('Should not be enabled', () => {
        getColumnFilterButton(COLUMNS_LABELS.TYPE).should('not.exist')
      })
    })

    describe('Sorting', () => {
      it('Should not be enabled', () => {
        getColumnSortingButton(COLUMNS_LABELS.TYPE).should('not.have.attr', 'role', 'button')
      })
    })
  })

  describe('Response column', () => {
    describe('Filtering', () => {
      it('Should not be enabled', () => {
        getColumnFilterButton(COLUMNS_LABELS.RESPONSE).should('not.exist')
      })
    })

    describe('Sorting', () => {
      it('Should not be enabled', () => {
        getColumnSortingButton(COLUMNS_LABELS.RESPONSE).should('not.have.attr', 'role', 'button')
      })
    })
  })

  describe('Detection time column', () => {
    describe('Rows', () => {
      it('Should render values', () => {
        getColumnRowsCells(COLUMNS_LABELS.DETECTION_TIME).each((cell, index) => {
          const row = ALERTS_MOCK_DATA_ROWS[index]
          const value = row?.assessment?.datetime

          if (value) {
            I.wrap(cell).should('not.be.empty')
          } else {
            I.wrap(cell).should('not.contain.text')
          }
        })
      })
    })

    describe('Filtering', () => {
      it('Should be enabled', () => {
        getColumnFilterButton(COLUMNS_LABELS.DETECTION_TIME).should('exist')
      })

      it('Should allow for filtering by date selector', () => {
        getColumnFilterButton(COLUMNS_LABELS.DETECTION_TIME).click()
        getPresentation().should('contain.text', I.translate(TranslationKey.DetectionTimeFilter))
        getPresentation().click('top')
      })
    })

    describe('Sorting', () => {
      it('Should be enabled', () => {
        getColumnSortingButton(COLUMNS_LABELS.DETECTION_TIME).should('have.attr', 'role', 'button')
      })
    })
  })

  describe('Detection column', () => {
    describe('Rows', () => {
      it('Should render values', () => {
        getColumnRowsCells(COLUMNS_LABELS.DETECTION).each(cell => {
          I.wrap(cell).should('contain.text', I.translate(TranslationKey.NetworkAnomalyDetection))
        })
      })
    })

    describe('Filtering', () => {
      it('Should not be enabled', () => {
        getColumnFilterButton(COLUMNS_LABELS.DETECTION).should('not.exist')
      })
    })

    describe('Sorting', () => {
      it('Should not be enabled', () => {
        getColumnSortingButton(COLUMNS_LABELS.DETECTION).should('not.have.attr', 'role', 'button')
      })
    })
  })
})
