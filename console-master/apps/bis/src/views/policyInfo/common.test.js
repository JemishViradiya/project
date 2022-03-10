import { RiskFactorId } from '@ues-data/bis/model'

import { processDisabledRiskFactors, processReAuthAction } from './common'
import { DefaultIpAddressPolicy } from './riskEngineTable/static/Defaults'

const ReachAction = {
  actionType: 'app:reAuthenticateToConfirm',
  actionAttributes: {},
}

describe('processReAuthAction', () => {
  test('no identityPolicy or fixUp at all', () => {
    const data = {
      geozonePolicy: {
        riskFactors: ['defined', 'learned'],
      },
    }

    // Change check
    expect(processReAuthAction(data)).toBe(data)

    // Verify change
    expect(data).toEqual({
      geozonePolicy: {
        riskFactors: ['defined', 'learned'],
      },
    })

    const data2 = {
      identityPolicy: {
        riskFactors: ['behavioral'],
      },
    }

    processReAuthAction(data2)
    expect(data2).toEqual({
      identityPolicy: {
        riskFactors: ['behavioral'],
      },
    })
  })

  // // For v3.0 only, remove after v3.0.
  // test('set fixUp to different levels', () => {
  //   const data = {
  //     identityPolicy: {
  //       riskFactors: ['behavioral'],
  //       riskLevelActions: [
  //         {
  //           level: 'CRITICAL',
  //           actions: [
  //             {
  //               actionType: 'uem:assignGroup',
  //               actionAttributes: {
  //                 groupGuid: '0e464fa7-f66c-46e4-8bad-c65fa22f313b',
  //                 groupName: 'Test group 1',
  //               },
  //             },
  //           ],
  //         },
  //       ],
  //       fixUp: {
  //         enabled: true,
  //         minimumBehavioralRiskLevel: 'MEDIUM',
  //         actionPauseDuration: 7200,
  //       },
  //     },
  //     geozonePolicy: {
  //       riskFactors: [],
  //     },
  //   }

  //   // Set fixUp level to MEDIUM level
  //   processReAuthAction(data)
  //   expect(data.identityPolicy.riskLevelActions).toEqual(
  //     expect.arrayContaining([
  //       {
  //         level: 'MEDIUM',
  //         actions: [{ ...ReachAction }],
  //       },
  //       {
  //         level: 'HIGH',
  //         actions: [{ ...ReachAction }],
  //       },
  //       {
  //         level: 'CRITICAL',
  //         actions: [
  //           {
  //             actionType: 'uem:assignGroup',
  //             actionAttributes: {
  //               groupGuid: '0e464fa7-f66c-46e4-8bad-c65fa22f313b',
  //               groupName: 'Test group 1',
  //             },
  //           },
  //         ],
  //       },
  //     ]),
  //   )

  //   // Change fixUp to HIGH level
  //   data.identityPolicy.fixUp.minimumBehavioralRiskLevel = 'HIGH'
  //   processReAuthAction(data)
  //   expect(data.identityPolicy.riskLevelActions).toEqual(
  //     expect.not.arrayContaining([
  //       {
  //         level: 'MEDIUM',
  //         actions: [{ ...ReachAction }],
  //       },
  //     ]),
  //   )
  //   expect(data.identityPolicy.riskLevelActions).toEqual(
  //     expect.arrayContaining([
  //       {
  //         level: 'HIGH',
  //         actions: [{ ...ReachAction }],
  //       },
  //       {
  //         level: 'CRITICAL',
  //         actions: [
  //           {
  //             actionType: 'uem:assignGroup',
  //             actionAttributes: {
  //               groupGuid: '0e464fa7-f66c-46e4-8bad-c65fa22f313b',
  //               groupName: 'Test group 1',
  //             },
  //           },
  //         ],
  //       },
  //     ]),
  //   )

  //   // Disable fixUp
  //   data.identityPolicy.fixUp.enabled = false
  //   processReAuthAction(data)
  //   expect(data.identityPolicy.riskLevelActions).toEqual(
  //     expect.not.arrayContaining([
  //       {
  //         level: 'HIGH',
  //         actions: [{ ...ReachAction }],
  //       },
  //     ]),
  //   )
  //   expect(data.identityPolicy.riskLevelActions).toEqual(
  //     expect.arrayContaining([
  //       {
  //         level: 'CRITICAL',
  //         actions: [
  //           {
  //             actionType: 'uem:assignGroup',
  //             actionAttributes: {
  //               groupGuid: '0e464fa7-f66c-46e4-8bad-c65fa22f313b',
  //               groupName: 'Test group 1',
  //             },
  //           },
  //         ],
  //       },
  //     ]),
  //   )
  // })

  // comment out for v3.0
  test('set fixUp to different levels', () => {
    const data = {
      identityPolicy: {
        riskFactors: ['behavioral'],
        riskLevelActions: [
          {
            level: 'CRITICAL',
            actions: [
              {
                actionType: 'uem:assignGroup',
                actionAttributes: {
                  groupGuid: '0e464fa7-f66c-46e4-8bad-c65fa22f313b',
                  groupName: 'Test group 1',
                },
              },
            ],
          },
        ],
        fixUp: {
          enabled: true,
          minimumBehavioralRiskLevel: 'MEDIUM',
          actionPauseDuration: 7200,
        },
      },
      geozonePolicy: {
        riskFactors: [],
      },
    }

    // Change check
    let processed = processReAuthAction(data)
    expect(processed).not.toBe(data)

    // Set fixUp level to MEDIUM level
    let toExpect = expect.arrayContaining([
      {
        level: 'MEDIUM',
        actions: [{ ...ReachAction }],
      },
      {
        level: 'HIGH',
        actions: [{ ...ReachAction }],
      },
      {
        level: 'CRITICAL',
        actions: [
          {
            actionType: 'uem:assignGroup',
            actionAttributes: {
              groupGuid: '0e464fa7-f66c-46e4-8bad-c65fa22f313b',
              groupName: 'Test group 1',
            },
          },
          { ...ReachAction },
        ],
      },
    ])

    // Check if we didn't modify original data
    expect(data.identityPolicy.riskLevelActions).not.toEqual(toExpect)
    expect(processed.identityPolicy.riskLevelActions).toEqual(toExpect)

    // Change fixUp to HIGH level
    data.identityPolicy.fixUp.minimumBehavioralRiskLevel = 'HIGH'
    processed = processReAuthAction(data)
    toExpect = expect.not.arrayContaining([
      {
        level: 'MEDIUM',
        actions: [{ ...ReachAction }],
      },
    ])
    expect(data.identityPolicy.riskLevelActions).toEqual(toExpect)
    expect(processed.identityPolicy.riskLevelActions).toEqual(toExpect)

    toExpect = expect.arrayContaining([
      {
        level: 'HIGH',
        actions: [{ ...ReachAction }],
      },
      {
        level: 'CRITICAL',
        actions: [
          {
            actionType: 'uem:assignGroup',
            actionAttributes: {
              groupGuid: '0e464fa7-f66c-46e4-8bad-c65fa22f313b',
              groupName: 'Test group 1',
            },
          },
          { ...ReachAction },
        ],
      },
    ])
    expect(data.identityPolicy.riskLevelActions).not.toEqual(toExpect)
    expect(processed.identityPolicy.riskLevelActions).toEqual(toExpect)

    // Disable fixUp
    data.identityPolicy.fixUp.enabled = false
    processed = processReAuthAction(data)
    toExpect = expect.not.arrayContaining([
      {
        level: 'HIGH',
        actions: [{ ...ReachAction }],
      },
    ])
    expect(data.identityPolicy.riskLevelActions).toEqual(toExpect)
    expect(processed.identityPolicy.riskLevelActions).toEqual(toExpect)
    expect(processed.identityPolicy.riskLevelActions).toEqual([
      {
        level: 'CRITICAL',
        actions: [
          {
            actionType: 'uem:assignGroup',
            actionAttributes: {
              groupGuid: '0e464fa7-f66c-46e4-8bad-c65fa22f313b',
              groupName: 'Test group 1',
            },
          },
        ],
      },
    ])
  })
})

describe('processDisabledRiskFactors', () => {
  test('no ipAddressPolicy data if ipAddress risk was enabled and has been disabled', () => {
    const originalData = {
      identityPolicy: {
        riskFactors: [RiskFactorId.IpAddress],
        ipAddressPolicy: { ...DefaultIpAddressPolicy },
      },
    }
    const data = { ...originalData }

    expect(processDisabledRiskFactors(data)).toEqual(originalData)

    // Verify we didn't override previous object
    expect(data).toStrictEqual(originalData)

    data.identityPolicy.riskFactors = []

    expect(processDisabledRiskFactors(data)).toStrictEqual({
      identityPolicy: {
        riskFactors: [],
      },
    })
  })
})
