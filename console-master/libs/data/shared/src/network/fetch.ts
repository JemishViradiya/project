import { UESAPI_URL } from '@ues-data/network'

import { UesSessionApi } from '../console'

class FetchError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

interface Types {
  blob: Blob
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: Record<string, any>
  text: string
  formData: FormData
  stream: ReadableStream
}

export const UesFetch = async <Type extends keyof Types = 'json', Result = Types[Type]>(
  input: string,
  { headers, baseURL = '', type, ...rest }: Partial<RequestInit> & { baseURL?: string; type?: Type } = {},
): Promise<Result> => {
  const url = `${UESAPI_URL}/api${baseURL}${input}`
  const accessToken = UesSessionApi.getToken()

  const result = await fetch(url, {
    credentials: 'omit',
    headers: Object.assign(
      {
        Authorization: `Bearer ${accessToken}`,
      },
      headers,
    ),
    ...rest,
  })
  if (!result.ok) {
    throw new FetchError(result.statusText, result.status)
  }
  if (type !== 'stream') {
    return result[(type as keyof Omit<Types, 'stream'>) || 'json']()
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return result.body
}
