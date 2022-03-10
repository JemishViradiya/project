import { useState } from 'react'

function useFilter(searchColumns) {
  const [searchString, setSearchString] = useState('')
  const [chosenRegions, setChosenRegions] = useState([])
  const [chosenInformationTypes, setChosenInformationTypes] = useState([])

  const applyfilter = rowData => {
    return rowData
      .filter(row => chosenRegions?.length === 0 || row.regions.some(region => chosenRegions.includes(region)))
      .filter(
        row => chosenInformationTypes?.length === 0 || row.infoTypes.some(infoType => chosenInformationTypes.includes(infoType)),
      )
      .filter(
        row =>
          searchString === undefined ||
          searchString?.length === 0 ||
          searchColumns
            .map(key => (row[key] instanceof Array ? row[key].join(', ').toLowerCase() : row[key].toLowerCase()))
            .join()
            .includes(searchString.toLowerCase()),
      )
  }

  return { setSearchString, setChosenRegions, setChosenInformationTypes, applyfilter }
}

export default useFilter
