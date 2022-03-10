import useCapability from './useCapability'
import useClientParamsMock from './useClientParams'

jest.mock('./useClientParams')

describe('useCapability', () => {
  it.each`
    userCapabilities                    | requiredCapabilities                                | expectedResult
    ${null}                             | ${[null]}                                           | ${[false]}
    ${undefined}                        | ${[undefined]}                                      | ${[false]}
    ${[]}                               | ${['CAPABILITY']}                                   | ${[false]}
    ${['CAPABILITY']}                   | ${['CAPABILITY']}                                   | ${[true]}
    ${['CAPABILITY_1']}                 | ${['CAPABILITY_2']}                                 | ${[false]}
    ${['CAPABILITY_1', 'CAPABILITY_2']} | ${['CAPABILITY_2']}                                 | ${[true]}
    ${['CAPABILITY_1']}                 | ${['CAPABILITY_1', 'CAPABILITY_1']}                 | ${[true, true]}
    ${['CAPABILITY_1', 'CAPABILITY_2']} | ${['CAPABILITY_1', 'CAPABILITY_2']}                 | ${[true, true]}
    ${['CAPABILITY_1', 'CAPABILITY_2']} | ${['CAPABILITY_3', 'CAPABILITY_4', 'CAPABILITY_5']} | ${[false, false, false]}
    ${['CAPABILITY_1', 'CAPABILITY_2']} | ${['CAPABILITY_1', 'CAPABILITY_5', 'CAPABILITY_2']} | ${[true, false, true]}
  `(
    'should return $expectedResult when is called with $requiredCapabilities but user capabilities are $userCapabilities',
    ({ userCapabilities, requiredCapabilities, expectedResult }) => {
      // given
      useClientParamsMock.mockReturnValueOnce(userCapabilities)

      // when
      const isCapable = useCapability(...requiredCapabilities)

      // then
      expect(isCapable).toEqual(expectedResult)
    },
  )
})
