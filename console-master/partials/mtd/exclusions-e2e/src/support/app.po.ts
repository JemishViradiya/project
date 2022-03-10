import { I } from '@ues-behaviour/shared-e2e'

export const getGreeting = () => I.findByRole('heading', { level: 1 })
