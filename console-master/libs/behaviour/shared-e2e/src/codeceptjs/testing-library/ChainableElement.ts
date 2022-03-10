/* eslint-disable sonarjs/cognitive-complexity */
import Step from 'codeceptjs/lib/step'

import type { Chainable, ChainableI } from './Base'
import type { CodeceptJSElement, ContainerType, Matcher, MatcherOptions } from './types'
import { ChainableMethods } from './types'

// eslint-disable-next-line no-redeclare
type Step = CodeceptJS.Step & { container?: ContainerType; as?: string }

const { event, recorder } = codeceptjs

export class NotImplemented extends Error {}
export class NotImplementedAssertion extends Error {}

const ChaiLanguageChains = new Set([
  'to',
  'be',
  'been',
  'is',
  'that',
  'which',
  'and',
  'has',
  'have',
  'with',
  'at',
  'of',
  'same',
  'but',
  'does',
  'still',
  'also',
])

export function ChainableElement(self: Chainable<CodeceptJSElement>, container: ContainerType): ChainableI<CodeceptJSElement> {
  return (new Proxy(self, {
    get(target, propKey, receiver) {
      if (propKey === '_wait') {
        return async (method, ...args: any[]) => {
          const container = args.pop()
          const scope = await self._getSubject(container)
          const fn = method === 'findByLocator' ? '$' : method === 'findAllByLocator' ? '$$' : method
          if (fn === 'should') {
            scope.toString = () => containerString(container)
            const [assertion, ...assertionArgs] = args
            if (assertion === 'not.exist' || assertion === 'not.to.exist') {
              console.log('shoud', assertion, ...assertionArgs, 'on', scope ? scope.toString() : null)
            }

            let assert = scope.should
            for (const key of assertion.split('.')) {
              if (key in ChaiLanguageChains) continue
              if (key in assert) {
                assert = await assert[key]
                continue
              }
              throw new NotImplementedAssertion(`${key} in ${assertion}`)
            }
            if (typeof assert !== 'function') {
              if (assertionArgs.length > 0) {
                throw new Error(`Invalid assertion: ${assertion} does not support arguments`)
              }
              return assert
            } else {
              return (assert as (...args: any[]) => any)(...assertionArgs)
            }
          }
          if (!scope[fn]) throw new NotImplemented(fn)
          return await scope[fn](...args)
        }
      } else if (propKey === 'as') {
        return (alias: string) => {
          const step = container && (container['step'] as CodeceptJS.Step)
          if (step) {
            step.as = alias
            step.suffix = (step.suffix || '') + (step.args.length > 1 && !step.suffix ? ' ' : ', ') + `as @${alias}`
            // step.suffix
            // step.name = `@${alias}`
            return receiver
          }
          throw new Error('NO CONTAINER')
        }
      } else if (ChainableMethods.has(propKey as ChainableMethods)) {
        return function (id: Matcher | CodeceptJS.LocatorOrString, options: MatcherOptions<CodeceptJSElement>) {
          return target._chain(propKey as ChainableMethods, id, options, container)
        }
      } else {
        // console.warn('proxy.else', target, propKey)
        return function (...args: unknown[]) {
          const translation = codeceptjs.container.translation() as any
          const actionAlias = translation.actionAliasFor(propKey)
          const step = new Step(receiver, propKey) as CodeceptJS.Step
          step.helperMethod = '_wait'
          if (translation.loaded) {
            step.name = actionAlias
            step.actor = translation.I
          }
          const subject = typeof container === 'function' ? container : undefined
          if (propKey === 'should' && (args[0] as string).endsWith('.exist') && container) {
            console.log(subject, propKey, container['step'].args)
            container['step'].method = 'queryAllByRole'
          }
          if (container && subject) {
            step.suffix = ` on ${containerString(container)}`
          }
          // add methods to promise chain
          recordStep(step, propKey, ...args, subject || '')
          return receiver
        }
      }
    },
  }) as unknown) as ChainableI<CodeceptJSElement>
}

function containerString(container: ContainerType) {
  const step = container && (container['step'] as CodeceptJS.Step)
  if (step) {
    if (step.as) return `@${step.as}`
    return `${step.name}${JSON.stringify(step.args).replace(/^\[/, '(').replace(/\]$/, ')')}`
  }
  return ''
}

export function recordStep(step: CodeceptJS.Step, arg0, ...args) {
  step.status = 'queued'
  const argN = args.pop()
  step.setArguments(args)
  step['method'] = arg0

  // run async before step hooks
  event.emit(event.step.before, step)

  const task = `${step.name}: ${step.humanizeArgs()}`
  // eslint-disable-next-line @typescript-eslint/ban-types
  let val: Object

  // run step inside promise
  recorder.add(task, () => {
    if (!step.startTime) {
      // step can be retries
      event.emit(event.step.started, step)
      step.startTime = Date.now()
    }
    val = step.run(step['method'], ...args, argN)
    step.setArguments(args)
    return val
  })

  event.emit(event.step.after, step)

  recorder.add('step passed', () => {
    step.endTime = Date.now()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    event.emit(event.step.passed, step, val)
    event.emit(event.step.finished, step)
  })

  recorder.catchWithoutStop(err => {
    step.status = 'failed'
    step.endTime = Date.now()
    event.emit(event.step.failed, step)
    event.emit(event.step.finished, step)
    throw err
  })

  recorder.add('return result', () => val)
  // run async after step hooks

  return recorder.promise()
}
