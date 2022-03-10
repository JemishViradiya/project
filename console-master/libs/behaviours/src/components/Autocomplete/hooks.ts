import type React from 'react'
import { useMemo } from 'react'

interface IProps {
  setOpen: (open: boolean) => void
  open: boolean
  currentTags: Array<string>
  setCurrentTags: (current: Array<string>) => void
  setUserInput: (input: string) => void
  handleAddTags: (tags: Array<string>) => void
  addedTags: Array<string>
  userInput: string
  isOnNewTagOption: boolean
  isHighlightedRef: any
}

export const useAutocompleteTags = ({
  setOpen,
  open,
  currentTags,
  setCurrentTags,
  setUserInput,
  handleAddTags,
  addedTags,
  userInput,
  isOnNewTagOption,
  isHighlightedRef,
}: IProps) => {
  const currentTagsWithoutAddedLowerCase = useMemo(() => {
    return currentTags.filter(val => !addedTags.includes(val)).map(val2 => val2.toLowerCase())
  }, [currentTags, addedTags])

  const isInCurrentTags = useMemo(() => userInput && currentTags.map(val => val.toLowerCase()).includes(userInput.toLowerCase()), [
    currentTags,
    userInput,
  ])

  const isInAddedTags = useMemo(() => userInput && addedTags.map(val => val.toLowerCase()).includes(userInput.toLowerCase()), [
    addedTags,
    userInput,
  ])

  const isItStartsWithCurrentTagsWithoutAdded = useMemo(
    () => currentTagsWithoutAddedLowerCase.some(val => val.startsWith(userInput.toLowerCase())),
    [currentTagsWithoutAddedLowerCase, userInput],
  )

  const isInCurrentTagsWithoutAdded = useMemo(() => currentTagsWithoutAddedLowerCase.includes(userInput.toLowerCase()), [
    currentTagsWithoutAddedLowerCase,
    userInput,
  ])

  const currentTagsSorted = currentTags.sort((a, b) => (a !== b ? (a < b ? -1 : 1) : 0))

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ((e.target.value.length > 0 && open === false) || (e.target.value.length === 0 && open === true)) {
      toggleOpen()
    }
    setUserInput(e.target.value.trim())
  }

  const toggleOpen = () => {
    setOpen(!open)
  }

  const onTagsChange = (event: never, value: string[]) => {
    if (value.length && !value[value.length - 1]) return
    if (value.length === 0) {
      toggleOpen()
    }
    handleAddTags(value)
    setUserInput('')
  }

  const addNewTagWithNoOptions = () => {
    if (isInAddedTags) return
    handleAddTags([...addedTags, userInput])
    setUserInput('')
  }

  const keyAddCheck = event => {
    if (userInput.length === 0) return
    if (event.key === ' ' || (event.key === 'Enter' && isHighlightedRef.current === false)) {
      if (userInput.indexOf(' ') >= 0 || isInAddedTags) {
        return
      }
      if (!isInCurrentTags) {
        setCurrentTags(currentTags.concat(userInput))
        handleAddTags([...addedTags, userInput])
      } else {
        const properUserInput = changeUserInputToProperCase()
        handleAddTags([...addedTags, properUserInput])
      }
      setUserInput('')
    }
  }

  const changeUserInputToProperCase = () => {
    return currentTags.find(element => element.toLowerCase() === userInput.toLowerCase())
  }

  const onClose = () => {
    if (!isOnNewTagOption) {
      isHighlightedRef.current = false
      setOpen(false)
    }
  }

  return {
    toggleOpen,
    handleOnChange,
    addNewTagWithNoOptions,
    keyAddCheck,
    currentTagsSorted,
    isInAddedTags,
    isItStartsWithCurrentTagsWithoutAdded,
    isInCurrentTagsWithoutAdded,
    onClose,
    onTagsChange,
  }
}
