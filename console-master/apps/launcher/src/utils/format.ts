export const SetReplacer = (key, value) => {
  if (value instanceof Set) return Array.from(value.values())
  return value
}
