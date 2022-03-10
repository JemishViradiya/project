/* eslint-disable sonarjs/no-identical-functions */

export type Dog = { id: string; name: string; breed: string; isFriend?: boolean }
export type DogVariables = { name: string }

export type DogPageVariables = { limit: number; page: number }
export type DogProgressiveVariables = { limit: number; offset: number }
