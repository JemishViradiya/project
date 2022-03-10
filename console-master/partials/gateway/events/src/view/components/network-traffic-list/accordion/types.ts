import type { ReactNode } from 'react'

export interface RowProps {
  hidden?: boolean
  label: ReactNode
  value: ReactNode
  secondaryRows?: Omit<RowProps, 'secondaryRows'>[]
}

export interface AccordionProps {
  alternateTitle?: ReactNode
  element?: ReactNode
  hidden?: boolean
  subtitle?: ReactNode
  title: ReactNode
  rows?: RowProps[]
}
