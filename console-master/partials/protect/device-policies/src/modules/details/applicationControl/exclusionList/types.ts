type AddDialogProps = {
  isAddDialogOpen: boolean
  onToggleAddDialog: () => void
  onAdd: (folderPath: string) => void
}

type DeleteDialogProps = {
  isDeleteDialogOpen: boolean
  onToggleDeleteDialog: () => void
  onDelete: () => void
}

export { AddDialogProps, DeleteDialogProps }
