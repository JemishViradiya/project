export type SizeProps = { width: number; height: number }

export const getWidth = (el: HTMLElement): number | undefined => (el ? el.offsetWidth : undefined)

export const getHeight = (el: HTMLElement): number | undefined => (el ? el.offsetHeight : undefined)

export const getSize = (el: HTMLElement): SizeProps => ({
  width: getWidth(el),
  height: getHeight(el),
})

export const getClientSize = (el: HTMLElement): Partial<SizeProps> => ({
  width: el ? el.clientWidth : undefined,
  height: el ? el.clientHeight : undefined,
})
export const getScrollSize = (el: HTMLElement): Partial<SizeProps> => ({
  width: el ? el.scrollWidth : undefined,
  height: el ? el.scrollHeight : undefined,
})
