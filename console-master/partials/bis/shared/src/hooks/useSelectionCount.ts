import { useMemo } from 'react'

export default ({ selectedAll, selectedCount = 0, deselectedCount }, total) => {
  return useMemo(() => {
    let count = selectedCount
    if (total) {
      if (selectedAll) {
        count = total
      }
      if (deselectedCount > 0) {
        count = total - deselectedCount
      }
    }
    return count
  }, [selectedCount, total, selectedAll, deselectedCount])
}
