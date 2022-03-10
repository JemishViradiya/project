import { ChallengeState } from '@ues-data/bis/model'

export const TRANSLATION_NAMESPACES = ['platform/common', 'bis/ues', 'bis/shared', 'general/form']
export const TABLE_LAZY_LOADING_BATCH_SIZE = 50
export const TABLE_LAZY_LOADING_THRESHOLD = 5
export const TABLE_MAX_RECORDS_COUNT = 10000

export const EXPECTED_CHALLENGE_STATES_SET = new Set(Object.values(ChallengeState))
