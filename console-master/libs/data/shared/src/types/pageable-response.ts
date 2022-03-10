export interface PagableResponse<T> {
  totals: {
    pages: number
    elements: number
  }
  navigation?: {
    next: string
    previous: string
  }
  count: number
  elements: T[]
}

export function makePageableResponse<T>(mockData: T[]): PagableResponse<T> {
  return {
    totals: {
      pages: 1,
      elements: mockData.length,
    },
    navigation: {
      next: 'next',
      previous: 'prev',
    },
    count: mockData.length,
    elements: [...mockData],
  }
}
