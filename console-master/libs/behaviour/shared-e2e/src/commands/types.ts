/**
 * @param {string} id Action id
 * @param {any} data Mock data
 * @param {any} error Error (optonal)
 */
interface MockAction {
  id: string
  data?: Record<string, unknown>
  error?: Record<string, unknown>
}

export type { MockAction }
