import { ConnectorConfigInfo, EnrollmentIncompleteReason } from '@ues-data/gateway'
import { BasicCircle, BasicPending, BasicRefresh, StatusHigh, StatusLow, StatusMedium } from '@ues/assets'
import { useConnectorStatus } from '.'

const testData: ConnectorConfigInfo = {
  connectorId: 'f1c00eda5a2b4e50acf7120f6a6896a1',
  name: 'BG Connector 1.1.1.428',
  upgradeAvailable: false,
  maintenanceRequired: false,
  privateUrl: 'https://10.0.0.165',
  authPublicKey: {
    crv: 'P-521',
    kid: 'LFV5KfccKst9Dlyxi3H3f0toObbZoQfRZEO3JMcMlq0np7cwjqJQYC4j2nBZvbiq',
    kty: 'EC',
    x: 'AAJEJ2LcJaobVoVay_Lp3t9c2nVet2Bh1TVy9c3cuMdvADR_VyEEcrlJirBQ0Q3QqSSieiyZDLlvR-jOICGb_XdZ',
    y: 'AAjb33ptfg_dnCJTDw-AUt_BUHe1E0O-oho-b6WoICeumn_aLYOW_JekYn3NDhk09-8baFuU2rNaJYaDMNJSql0_',
  },
  health: undefined,
  healthStatus: undefined,
  enrolled: {
    value: true,
  },
}

const classes = {
  warning: {
    color: 'yellow',
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
  default: {
    color: 'grey',
  },
}

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}))

jest.mock('./styles', () =>
  jest.fn(() => ({
    ...classes,
  })),
)

describe('Use connector status check', () => {
  describe('Enrollment status', () => {
    it(`should result with ${EnrollmentIncompleteReason.Pending} enrollment message`, () => {
      const result = useConnectorStatus({
        health: 'GREEN',
        connector: {
          ...testData,
          enrolled: {
            value: false,
            enrollmentIncompleteReason: EnrollmentIncompleteReason.Pending,
          },
        },
      })

      const expectedResult = { message: 'connectors.pendingEnrollment', className: classes.warning, Icon: BasicPending }

      expect(result).toStrictEqual(expectedResult)
    })

    it(`should result with ${EnrollmentIncompleteReason.Expired} enrollment message`, () => {
      const result = useConnectorStatus({
        health: 'GREEN',
        connector: {
          ...testData,
          enrolled: {
            value: false,
            enrollmentIncompleteReason: EnrollmentIncompleteReason.Expired,
          },
        },
      })

      const expectedResult = { message: 'connectors.failedToCompleteEnrollment', className: classes.error, Icon: StatusHigh }

      expect(result).toStrictEqual(expectedResult)
    })
  })

  describe('Upgrade or Maintenance status', () => {
    it('should result with reboot required status', () => {
      const result = useConnectorStatus({
        connector: {
          ...testData,
          upgradeAvailable: true,
        },
      })

      const expectedResult = { message: 'connectors.rebootRequiredTooltip', className: classes.warning, Icon: BasicRefresh }

      expect(result).toStrictEqual(expectedResult)
    })

    it('should result with attention required error', () => {
      const result = useConnectorStatus({ connector: { ...testData, maintenanceRequired: true } })

      const expectedResult = { message: 'connectors.labelAttentionRequired', className: classes.warning, Icon: StatusMedium }

      expect(result).toStrictEqual(expectedResult)
    })
  })

  describe('Health is available', () => {
    it('should result with connected status', () => {
      const result = useConnectorStatus({
        health: 'GREEN',
        connector: {
          ...testData,
          upgradeAvailable: false,
          maintenanceRequired: false,
        },
      })

      const expectedResult = { message: 'connectors.labelConnected', className: classes.success, Icon: StatusLow }

      expect(result).toStrictEqual(expectedResult)
    })

    it('should result with failure status', () => {
      const result = useConnectorStatus({
        health: 'RED',
        connector: {
          ...testData,
          upgradeAvailable: false,
          maintenanceRequired: false,
        },
      })

      const expectedResult = { message: 'dashboard.failure', className: classes.error, Icon: StatusHigh }

      expect(result).toStrictEqual(expectedResult)
    })
  })

  it('should result with unknown status', () => {
    const result = useConnectorStatus({ connector: testData })

    const expectedResult = { message: 'connectors.unknownStatus', className: classes.default, Icon: BasicCircle }

    expect(result).toStrictEqual(expectedResult)
  })
})
