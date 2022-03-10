export const fetchJson = async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const res = await fetch(input, init)
  return res.json()
}
