/* eslint-disable sonarjs/cognitive-complexity */
import type { queries as PlaywrightQueries } from 'playwright-testing-library'
import type { ElementHandle as PlaywrightElement } from 'playwright-testing-library/dist/typedefs'

import type {
  ByRoleOptions as DTLByRoleOptions,
  Matcher,
  MatcherOptions as DTLMatcherOptions,
  SelectorMatcherOptions as DTLSelectorMatcherOptions,
  waitForOptions,
} from '@testing-library/dom'

export type { Matcher }

export type Queries = typeof PlaywrightQueries

export type CodeceptJSElement = PlaywrightElement | WebdriverIO.Element

export type CTLMatcherOptions<Subject extends CodeceptJSElement> = Pick<waitForOptions, 'timeout' | 'interval'> & {
  container?: Subject
}

export type MatcherOptions<Subject extends CodeceptJSElement> = DTLMatcherOptions & CTLMatcherOptions<Subject>
export type ByRoleOptions<Subject extends CodeceptJSElement> = DTLByRoleOptions & CTLMatcherOptions<Subject>
export type SelectorMatcherOptions<Subject extends CodeceptJSElement> = DTLSelectorMatcherOptions & CTLMatcherOptions<Subject>

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never
const TestingLibraryMethods = [
  'findAllByAltText',
  'findAllByLabelText',
  'findAllByPlaceholderText',
  'findAllByRole',
  'findAllByText',
  'findAllByTitle',
  'findAllByDisplayValue',
  'findAllByTestId',
  'findByAltText',
  'findByDisplayValue',
  'findByLabelText',
  'findByPlaceholderText',
  'findByRole',
  'findByText',
  'findByTitle',
  'findByTestId',
  // 'queryAllByRole',
] as const
// eslint-disable-next-line no-redeclare
export type TestingLibraryMethods = ArrayElement<typeof TestingLibraryMethods>

export const ChainableMethods = new Set([...TestingLibraryMethods, 'findByLocator', 'findAllByLocator'])
// eslint-disable-next-line no-redeclare
export type ChainableMethods = TestingLibraryMethods | 'findByLocator' | 'findAllByLocator'

export type ActorMethods = ChainableMethods | 'url' | 'visit'

export type AsyncContainerType = (() => Promise<CodeceptJSElement[] | CodeceptJSElement>) & { step: CodeceptJS.Step }
export type ContainerType = AsyncContainerType | CodeceptJSElement | undefined
