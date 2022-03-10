const translations = {
  'policy.list.add': 'Add policy',
  // eslint-disable-next-line no-template-curly-in-string
  'policy.list.results': '${value} results',
  'policy.list.rank': 'Rank',
  'policy.deleteButton': 'Delete',
  'policy.list.searchPlaceholder': 'Search for policies',
  'policy.assignment.add': 'Add user or group',
  'policy.removeButton': 'Remove',
  'policy.assignment.searchPlaceholder': 'Search for users and groups',
}

export const t = (s: string, v?: { value: unknown }): string => {
  let found = translations[s] ?? s
  if (v) {
    // eslint-disable-next-line no-template-curly-in-string
    found = found.replace('${value}', v.value)
  }
  return found
} // use useTranslation(['policy']) instead

export const populateTable = (items, from = 0) => {
  const tableData = []
  for (let i = from; i < from + items; i++) {
    tableData.push({
      id: 'id' + i,
      name: 'Item name ' + i, // For groups
      displayName: 'Item name ' + i, // For users
      __typename: i % 5 === 0 ? 'User' : 'Group',
      emailAddress: i % 5 === 0 ? `user${i}@blackhole.sw.rim.net` : undefined,
    })
  }
  return tableData
}

export const populateDialog = () => {
  const items = []
  for (let i = 0; i < 20; i++) {
    const newItem = {
      id: 'id' + i,
      displayName: 'Some item ' + i,
      disabled: i % 10 === 0,
    }
    if (i % 5 === 0) {
      newItem['__typename'] = 'Group'
      newItem['name'] = 'Some item ' + i
      newItem['usersCount'] = Math.floor(Math.random() * 100 + 1)
    } else {
      newItem['__typename'] = 'User'
      newItem['emailAddress'] = `user${i}@blackhole.sw.rim.net`
    }
    items.push(newItem)
  }
  return items
}
