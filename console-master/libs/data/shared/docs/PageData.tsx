import React, { useCallback, useState } from 'react'

import { Loading } from './util'

const preStyle = { margin: '1em' }

export const PageData = ({ loading = false, data = [], pageInfo = {} as Record<string, any>, fetchMore }) => {
  const [jsonFormat, setJsonFormat] = useState(false)
  const handleFormat = useCallback(
    e => {
      setJsonFormat(e.target.checked)
      fetchMore({ limit: pageInfo.limit, page: pageInfo.page })
    },
    [pageInfo.limit, pageInfo.page, fetchMore],
  )
  const handleOnChange = useCallback(
    e => {
      const limit = parseInt(e.target.value)
      if (limit > 0) {
        fetchMore({ limit, page: 1 })
      }
    },
    [fetchMore],
  )

  const handlePrevPage = useCallback(
    e => {
      fetchMore({ limit: pageInfo.limit, page: pageInfo.prev })
    },
    [pageInfo.limit, pageInfo.prev, fetchMore],
  )
  const handleNextPage = useCallback(
    e => {
      fetchMore({ limit: pageInfo.limit, page: pageInfo.next })
    },
    [pageInfo.limit, pageInfo.next, fetchMore],
  )

  return (
    <pre style={preStyle}>
      <div>
        <label>
          JSON format: <input type="checkbox" name="json" readOnly={jsonFormat} onChange={handleFormat} />
        </label>
        <p></p>
        <label>
          Page Limit: <input type="text" name="limit" disabled={false} defaultValue={pageInfo.limit} onChange={handleOnChange} />
        </label>
        <ol>
          {loading ? (
            <Loading />
          ) : (
            data.map(item => {
              if (jsonFormat) {
                return (
                  <li key={item.id}>
                    <code>{JSON.stringify(item)},</code>
                  </li>
                )
              } else {
                return (
                  <li key={item.id}>
                    id: {item.id}, name: {item.name}
                  </li>
                )
              }
            })
          )}
        </ol>
      </div>
      <button onClick={handlePrevPage} disabled={!pageInfo.prev}>
        Prev
      </button>
      Page {pageInfo.page}
      <button onClick={handleNextPage} disabled={!pageInfo.next}>
        Next
      </button>
    </pre>
  )
}

export const PageDataWithState = props => {
  const { data, fetchMore } = props
  const [content, setContent] = useState(data)

  const updatePageLimit = vars => {
    const { limit } = vars
    if (limit !== content.pageInfo.limit) {
      const newContent = content
      newContent.data = []
      newContent.pageInfo.limit = limit
      newContent.pageInfo.page = 1
      setContent(newContent)
      return updatePage({ ...vars, page: 1 })
    }
    return updatePage(vars)
  }

  const updatePage = async vars => {
    const newPageContent = await fetchMore(vars)
    // Update fetch data
    setContent(newPageContent)
  }

  return <PageData {...content} fetchMore={updatePageLimit} />
}
