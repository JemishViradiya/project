import usePromise from 'react-promise-suspense'

const fetchJson = async (input: RequestInfo, init?: RequestInit) => {
  const res = await fetch(input, init)
  return res.json()
}

export const useFetch = <T>(input: RequestInfo, init: RequestInit = { method: 'GET' }): T => usePromise(fetchJson, [input, init])
