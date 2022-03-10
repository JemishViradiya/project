import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const useName = (initialName: string, canHaveName?: (name: string) => string) => {
  const { t } = useTranslation('behaviour/geozones-map')
  const [name, setName] = useState(initialName)
  const [nameError, setNameError] = useState<string>(null)

  useEffect(() => {
    setName(initialName)
    setNameError(null)
  }, [initialName])

  const onNameChange = useCallback(
    e => {
      const name = e.target.value
      if (name) {
        setName(name)
        const trimmedName = name.trim()
        if (!trimmedName) {
          setNameError(t('popupGeozone.errors.invalidName'))
        } else if (canHaveName) {
          const reason = canHaveName(trimmedName)
          if (reason) {
            setNameError(reason)
          } else {
            setNameError(null)
          }
        } else {
          setNameError(null)
        }
      } else {
        setName('')
        setNameError(null)
      }
    },
    [canHaveName, t],
  )

  return [name, nameError, onNameChange] as const
}
