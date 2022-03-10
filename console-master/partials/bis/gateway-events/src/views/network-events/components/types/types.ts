import type { ReactNode } from 'react'

export interface RowProps {
  label: ReactNode
  value: ReactNode
}

export interface AccordionProps {
  title: ReactNode
  subtitle?: ReactNode
  rows: RowProps[]
  noRows?: string
}

export interface DrawerProps {
  isOpen: boolean
  toggleDrawer: () => void
  details: { title: string } & { data: AccordionProps[] }
}
