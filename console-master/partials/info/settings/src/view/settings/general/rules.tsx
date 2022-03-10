export const isAllSelectedWithoutPolicies = (selectedItems: any[]) => selectedItems.every(row => !row.policiesAssigned)
