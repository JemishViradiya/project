import { useCallback, useState } from 'react'

interface UseToggleInterface {
  isOn: boolean
  onToggle: () => void
}

const useToggle = (defaultOn = false): UseToggleInterface => {
  const [isOn, setIsOn] = useState(defaultOn)

  const onToggle = useCallback(() => {
    setIsOn(isOn => !isOn)
  }, [setIsOn])

  return {
    isOn,
    onToggle,
  }
}

export default useToggle
