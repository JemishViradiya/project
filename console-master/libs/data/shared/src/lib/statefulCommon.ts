import type { ApolloError, Context, DocumentNode } from '@apollo/client'

import type { Permission } from '../permissions/types'
import type { ServiceId } from '../service/types'
import type { ApolloQueryOptions } from './statefulApolloCommon'

export enum ApolloAction {
  SKIP_WHEN_PERMISSIONS_NOT_MET = 'SKIP_WHEN_PERMISSIONS_NOT_MET',
  SKIP_WHEN_SERVICE_NOT_ENABLED = 'SKIP_WHEN_SERVICE_NOT_ENABLED',
}

export interface AbstractQuery<Query, Variables extends unknown = unknown, Result = unknown> {
  query: Query
  defaultVariables?: Variables
  mock?: true | undefined
  mockQueryFn?: (args?: Variables) => Result
  mockOverrideId?: string
  // define required permissions array for which are checked if permission-related action is defined before calling the query
  permissions: Set<Permission> | ((args?: Variables) => Set<Permission>)
  // define required services array for which are checked if service-related action is defined before calling the query
  services?: Set<ServiceId>
  actions?: Set<ApolloAction>
  iterator?: (previousVariables: Variables, previousResult?: Result) => Variables | null
  id?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AbstractQueryVariables<Q extends AbstractQuery<any>> = Q extends AbstractQuery<any, infer Args> ? Args : never
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AbstractQueryResult<Q extends AbstractQuery<any>> = Q extends AbstractQuery<infer Result> ? Result : never

export interface AbstractQueryOptions<Variables extends unknown = unknown> {
  variables: Variables
  mock?: true | undefined
  // skip?: boolean
}

export interface AbstractMutation<Mutation, Variables extends unknown = unknown, Result = unknown> {
  mutation: Mutation
  defaultVariables?: Variables
  mock?: true | undefined
  mockMutationFn?: (args?: Variables) => Result
  mockOverrideId?: string
  // define optional permissions for which mutation class can specify so is centralized in one place
  // what the mutation require in term of permissions
  permissions?: Set<Permission> | ((args?: Variables) => Set<Permissions>)
  id?: string
}

export type UpdateQueryFn<QueryResult, SubscriptionResult, Variables extends unknown> = (
  previousQueryResult: QueryResult,
  options: {
    subscriptionData: {
      data: SubscriptionResult
    }
    variables?: Variables
  },
  // optional permission which can be checked before the update is done
  permissions?: Set<Permission> | ((args?: Variables) => Set<Permissions>),
) => QueryResult

export type AbstractSubscription<
  Query,
  Variables extends unknown = unknown,
  QueryResult = unknown,
  SubscriptionResult = unknown
> = AbstractQuery<Query, Variables, QueryResult> & {
  subscription: Query
} & {
  updateQuery?: UpdateQueryFn<QueryResult, SubscriptionResult, Variables>
}

export interface ApolloQuery<Result, Args extends unknown> extends AbstractQuery<DocumentNode, Args, Result> {
  context: Context
  displayName?: string
  onError?: ApolloQueryOptions<Result, Args>['onError']
  onCompleted?: ApolloQueryOptions<Result, Args>['onCompleted']
}

export type ApolloSubscription<QueryResult, SubscriptionResult, Args> = AbstractSubscription<
  DocumentNode,
  Args,
  QueryResult,
  SubscriptionResult
> & {
  context?: Context
  displayName?: string
}

export type StatefulResult<Result> = Result extends void
  ? {
      loading?: boolean
      error?: Error
    }
  : {
      loading?: boolean
      error?: Error
      data?: Result
    }

export const mockStatefulResult = <T>(fn: () => T): { data: T } | { error: ApolloError } => {
  try {
    return { data: fn() }
  } catch (error) {
    return { error }
  }
}
