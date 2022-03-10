import { useMemo } from 'react'

export const useClientSearch = <TDataEntry>(props: {
  data: TDataEntry[]
  searchColumns: string[]
  searchString: string
}): TDataEntry[] => {
  const { data, searchColumns, searchString } = props

  return useMemo(() => {
    if (searchString && searchColumns && searchColumns.length) {
      return data.filter(row => {
        const searchFields = searchColumns.map(key => row[key]?.toLowerCase()).join()
        return searchFields.includes(searchString?.toLowerCase())
      })
    } else {
      return data
    }
  }, [data, searchColumns, searchString])
}
