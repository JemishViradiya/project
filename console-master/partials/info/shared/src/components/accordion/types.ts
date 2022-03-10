import type { ReactNode } from 'react'

export interface RowProps {
  hidden?: boolean
  rowTitleGrow?: boolean
  label: ReactNode
  value: ReactNode
}

export interface AccordionProps {
  alternateTitle?: ReactNode
  chart?: ReactNode
  hidden?: boolean
  subtitle?: ReactNode
  title: ReactNode
  rows?: RowProps[]
  underlined?: boolean
}
