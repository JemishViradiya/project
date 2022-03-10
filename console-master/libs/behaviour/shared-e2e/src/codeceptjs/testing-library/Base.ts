/* eslint-disable sonarjs/cognitive-complexity */
import Step from 'codeceptjs/lib/step'
import type { ElementHandle as PlaywrightElement, ScopedQueries } from 'playwright-testing-library/dist/typedefs'

import type { ByRoleMatcher, waitForOptions } from '@testing-library/dom'

import chai from './chai'
import { ChainableElement, NotImplemented, recordStep } from './ChainableElement'
import type {
  ActorMethods,
  AsyncContainerType,
  ByRoleOptions,
  ChainableMethods,
  CodeceptJSElement,
  ContainerType,
  Matcher,
  MatcherOptions,
  Queries,
  SelectorMatcherOptions,
} from './types'

// eslint-disable-next-line no-redeclare
type Step = CodeceptJS.Step

const { assert, expect, should: shouldFactory } = chai

const should = shouldFactory()

export type { Matcher }

export type CTLMatcherOptions<Subject extends CodeceptJSElement> = Pick<waitForOptions, 'timeout' | 'interval'> & {
  container?: Subject
}

export interface ChainableI<Subject extends CodeceptJSElement = CodeceptJSElement>
  extends Pick<Chainable<Subject>, ActorMethods>,
    Pick<
      PlaywrightElement,
      // | '$'
      // | '$$'
      | 'asElement'
      | 'click'
      | 'dblclick'
      | 'dispatchEvent'
      | 'isDisabled'
      | 'focus'
      | 'check'
      | 'fill'
      | 'getAttribute'
      | 'getProperties'
      | 'getProperty'
      | 'hover'
      | 'innerText'
      | 'inputValue'
      | 'isChecked'
      | 'isEditable'
      | 'isEnabled'
      | 'isHidden'
      | 'isVisible'
      | 'press'
      | 'screenshot'
      | 'scrollIntoViewIfNeeded'
      | 'selectOption'
      | 'selectText'
      | 'setInputFiles'
      | 'textContent'
      | 'type'
      | 'uncheck'
      | 'waitForElementState'
    > {
  /**
   * Assign an alias for later use. Reference the alias later within a cy.get() or cy.wait() command
   * with a @alias. You can alias DOM elements, routes, stubs and spies.
   *
   * @param {string} alias
   */
  as(alias: string): ChainableI<Subject>
}

const opAliases = {
  findByLocator: '$',
  findAllByLocator: '$$',
}

export abstract class Chainable<Subject extends CodeceptJSElement = CodeceptJSElement> extends Helper {
  _init() {
    Object.assign(global, { expect, assert, should })
    Object.defineProperty(global, 'I', {
      enumerable: true,
      get: () => inject().I,
    })
    return true
  }

  abstract visit(url: string): void
  abstract url(): string

  /**
   * @deprecated Use findBy* from testing-library
   */
  findByLocator = (id: CodeceptJS.LocatorOrString, options?: MatcherOptions<Subject>): ChainableI<Subject> => {
    return this._chain('findByLocator', id, options)
  }

  /**
   * @deprecated Use findBy* from testing-library
   */
  findAllByLocator = (id: CodeceptJS.LocatorOrString, options?: MatcherOptions<Subject>): ChainableI<Subject> => {
    return this._chain('findAllByLocator', id, options)
  }

  findByPlaceholderText(id: Matcher, options?: MatcherOptions<Subject>): ChainableI<Subject> {
    return this._chain('findByPlaceholderText', id, options)
  }

  findAllByPlaceholderText(id: Matcher, options?: MatcherOptions<Subject>): ChainableI<Subject> {
    return this._chain('findAllByPlaceholderText', id, options)
  }

  findByText(id: Matcher, options?: SelectorMatcherOptions<Subject>): ChainableI<Subject> {
    return this._chain('findByText', id, options)
  }

  findAllByText(id: Matcher, options?: SelectorMatcherOptions<Subject>): ChainableI<Subject> {
    return this._chain('findAllByText', id, options)
  }

  findByLabelText(id: Matcher, options?: SelectorMatcherOptions<Subject>): ChainableI<Subject> {
    return this._chain('findByLabelText', id, options)
  }

  findAllByLabelText(id: Matcher, options?: SelectorMatcherOptions<Subject>): ChainableI<Subject> {
    return this._chain('findAllByLabelText', id, options)
  }

  findByAltText(id: Matcher, options?: MatcherOptions<Subject>): ChainableI<Subject> {
    return this._chain('findByAltText', id, options)
  }

  findAllByAltText(id: Matcher, options?: MatcherOptions<Subject>): ChainableI<Subject> {
    return this._chain('findAllByAltText', id, options)
  }

  findByTestId(id: Matcher, options?: MatcherOptions<Subject>): ChainableI<Subject> {
    return this._chain('findByTestId', id, options)
  }

  findAllByTestId(id: Matcher, options?: MatcherOptions<Subject>): ChainableI<Subject> {
    return this._chain('findAllByTestId', id, options)
  }

  findByTitle(id: Matcher, options?: MatcherOptions<Subject>): ChainableI<Subject> {
    return this._chain('findByTitle', id, options)
  }

  findAllByTitle(id: Matcher, options?: MatcherOptions<Subject>): ChainableI<Subject> {
    return this._chain('findAllByTitle', id, options)
  }

  findByDisplayValue(id: Matcher, options?: MatcherOptions<Subject>): ChainableI<Subject> {
    return this._chain('findByDisplayValue', id, options)
  }

  findAllByDisplayValue(id: Matcher, options?: MatcherOptions<Subject>): ChainableI<Subject> {
    return this._chain('findAllByDisplayValue', id, options)
  }

  findByRole(id: ByRoleMatcher, options?: ByRoleOptions<Subject>): ChainableI<Subject> {
    return this._chain('findByRole', id, options)
  }

  findAllByRole(id: ByRoleMatcher, options?: ByRoleOptions<Subject>): ChainableI<Subject> {
    return this._chain('findAllByRole', id, options)
  }

  /** private **/

  abstract _getSubject(container: ContainerType): Promise<Subject>

  abstract _getQueries(): Queries

  toString() {
    return 'I'
  }

  /** @private */
  _wait = async (
    method: ChainableMethods,
    id: Matcher | CodeceptJS.LocatorOrString,
    options?: MatcherOptions<CodeceptJSElement>,
    container?: ContainerType,
  ) => {
    if (!container && typeof options === 'function') {
      container = options
      options = {}
    }
    const fn = opAliases[method] || method
    options = options || undefined

    const scope = (await this._getSubject(container)) || inject().I
    if (scope[fn]) {
      // console.log(method + JSON.stringify([id, options]) + ' -> ' + JSON.stringify(result))
      return await scope[fn](id, options, options)
    }

    const queries = this._getQueries()
    if (queries[fn]) {
      // const result = await queries[fn](scope, id, options, options)
      // console.log(method + JSON.stringify([id, options])) // + ' -> ' + JSON.stringify(result))
      // return result
      return await queries[fn](scope, id, options, options)
    }

    console.log('NotImplemented: ' + method)
    throw new NotImplemented(method)
  }

  _chain<U extends ChainableI<CodeceptJSElement>>(
    method: ChainableMethods | 'should',
    id: Matcher | CodeceptJS.LocatorOrString | ByRoleMatcher,
    options?: MatcherOptions<CodeceptJSElement>,
    container?: ContainerType | null,
  ): U {
    const translation = codeceptjs.container.translation() as any
    const actionAlias = translation.actionAliasFor(method)
    const containerStep = container && ((container as unknown) as { step?: Step }).step
    const step = new Step(this, method) as CodeceptJS.Step
    step.helperMethod = '_wait'
    if (translation.loaded) {
      step.name = actionAlias
      step.actor = translation.I
    }
    if (containerStep) {
      step.suffix = ` within ${containerStep.as ? '@' + containerStep.as : containerStep.toString().replace(/within [^@]*$/, '')}`
    }

    // add methods to promise chain
    const args: unknown[] = options ? [options] : []
    if (container) args.push(container)
    else args.push(null)
    const future = recordStep(step, method, id, ...args)

    const handler = (() => future) as AsyncContainerType
    Object.defineProperty(handler, 'step', { value: step })
    step.container = handler
    return ChainableElement(this, handler) as U
  }
}
