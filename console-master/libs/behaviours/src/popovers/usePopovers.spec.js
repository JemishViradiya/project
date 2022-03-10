import { act, renderHook } from '@testing-library/react-hooks'

import usePopover from './usePopover'

const mockClickEvent = {
  currentTarget: {
    value: '1',
    getBoundingClientRect: () => ({ width: 123 }),
  },
}

describe('usePopover', () => {
  it('initial popover', () => {
    const { result } = renderHook(() => usePopover())
    expect(result.current.popoverIsOpen).toBe(false)
  })

  it('open popover', () => {
    const { result } = renderHook(() => usePopover())

    act(() => result.current.handlePopoverClick(mockClickEvent))
    expect(result.current.popoverAnchorEl).toBeDefined()
    expect(result.current.popoverIsOpen).toBe(true)
  })

  it('close popover', () => {
    const { result } = renderHook(() => usePopover())

    act(() => result.current.handlePopoverClick(mockClickEvent))
    act(() => result.current.handlePopoverClose())

    expect(result.current.popoverAnchorEl).toBeNull()
    expect(result.current.popoverIsOpen).toBe(false)
  })
})
