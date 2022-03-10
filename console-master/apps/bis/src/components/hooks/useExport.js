import { parse } from 'json2csv'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useStatefulApolloQuery } from '@ues-data/shared'

const BOM = '\ufeff'
const DOCUMENT_TYPE = 'text/csv'
const ELEMENT_ID = 'global-download-link'
const DISPLAY = 'none'
const ANCHOR_ELEMENT = 'a'

const DEFAULT_FILENAME = 'export.csv'
const DEFAULT_FETCH_POLICY = 'cache-only'

const MISSING_QUERY_PARAM_ERROR = 'Invariant Violation: query option is required in useExport when no fields are selected'
const SELECTED_ITEMS_TYPE_ERROR = 'Invariant Violation: selected items option has to be passed as an array to useExport'

const flattenObject = (object, path) =>
  Object.keys(object).reduce((acc, key) => {
    const newPath = [path, key].filter(Boolean).join('.')
    const value = object?.[key]

    const isArray = Array.isArray(value)
    const isObject = !isArray && typeof value === 'object' && value !== null

    return isObject ? { ...acc, ...flattenObject(value, newPath) } : { ...acc, [newPath]: isArray ? JSON.stringify(value) : value }
  }, {})

const flattenItems = items => items.map(item => flattenObject(item))

const makeAutoFields = items => {
  const properties = Object.keys(
    items.reduce(
      (acc, item) => ({
        ...acc,
        ...item,
      }),
      {},
    ),
  ).sort()

  return properties.map(property => ({
    label: property,
    value: item => item[property],
  }))
}

const createLink = (url, filename) => {
  let link = document.getElementById(ELEMENT_ID)
  if (link) {
    URL.revokeObjectURL(link.href)
    link.download = filename
    link.href = url
  } else {
    link = document.createElement(ANCHOR_ELEMENT)
    link.id = ELEMENT_ID
    link.style.display = DISPLAY
    link.download = filename
    link.href = url
    document.body.appendChild(link)
  }
  return link
}

const saveFile = ({ fields, items, filename, t }) => {
  const outputItems = fields ? items : flattenItems(items)
  const outputFields = fields ? fields.map(field => ({ ...field, label: t(field.label) })) : makeAutoFields(outputItems)

  const csv = parse(outputItems, { fields: outputFields })
  const blob = new Blob([BOM, csv], { type: DOCUMENT_TYPE })
  const url = URL.createObjectURL(blob)
  const link = createLink(url, filename)
  link.click()
}

const useGetItems = ({ skip, query, variables, parseItemsFn, fetchPolicy, queryPathName, selectedItems }) => {
  if (selectedItems && !Array.isArray(selectedItems)) throw new Error(SELECTED_ITEMS_TYPE_ERROR)
  if (!query) throw new Error(MISSING_QUERY_PARAM_ERROR)

  const hasSelectedItems = selectedItems?.length > 0
  const result = useStatefulApolloQuery(query, { skip: skip || hasSelectedItems, variables, fetchPolicy })
  const data = result?.data?.[queryPathName]

  return {
    loading: result.loading,
    items: hasSelectedItems ? selectedItems : parseItemsFn && data ? parseItemsFn(data) : data,
  }
}

const useExportHandler = ({ fields, query, variables, queryPathName, selectedItems, parseItemsFn, fetchPolicy, filename, t }) => {
  const [exporting, setExporting] = useState(false)
  const callback = useCallback(event => {
    event.preventDefault()
    setExporting(true)
  }, [])

  const { items, loading } = useGetItems({
    fetchPolicy,
    parseItemsFn,
    query,
    queryPathName,
    selectedItems,
    skip: !exporting,
    variables,
  })

  useEffect(() => {
    if (exporting && !loading) {
      setExporting(false)

      if (items && items.length > 0) {
        saveFile({ fields, items, filename, t })
      }
    }
  }, [items, exporting, fields, filename, loading, t])
  return {
    handleExport: callback,
    isExporting: loading,
  }
}

const useExport = ({
  fetchPolicy = DEFAULT_FETCH_POLICY,
  fields,
  filename = DEFAULT_FILENAME,
  parseItemsFn,
  query,
  queryPathName,
  selectedItems,
  variables,
}) => {
  const { t } = useTranslation()

  const { handleExport, isExporting } = useExportHandler({
    fetchPolicy,
    fields,
    filename,
    parseItemsFn,
    query,
    queryPathName,
    selectedItems,
    t,
    variables,
  })

  return { handleExport, isExporting }
}

export default useExport
