import React, { useCallback, useState } from 'react'

import { Loading } from './util'

const preStyle = { margin: '1em' }

export const MoreData = ({ loading, data, pageInfo = {} as Record<string, any>, fetchMore }) => {
  const [jsonFormat, setJsonFormat] = useState(false)
  const handleFormat = useCallback(
    e => {
      setJsonFormat(e.target.checked)
      fetchMore({ limit: pageInfo.limit, offset: pageInfo.offset })
    },
    [pageInfo.limit, pageInfo.offset, fetchMore],
  )
  const handleOnChange = useCallback(
    e => {
      const limit = parseInt(e.target.value)
      if (limit > 0) {
        fetchMore({ limit, offset: 0 })
      }
    },
    [fetchMore],
  )

  const handleClickMore = useCallback(
    e => {
      fetchMore({ limit: pageInfo.limit, offset: pageInfo.offset })
    },
    [pageInfo.limit, pageInfo.offset, fetchMore],
  )

  return (
    <pre style={preStyle}>
      <div>
        <label>
          JSON format: <input type="checkbox" name="json" readOnly={jsonFormat} onChange={handleFormat} />
        </label>
        <p></p>
        <label>
          Fetch Limit: <input type="text" name="limit" disabled={false} defaultValue={pageInfo.limit} onChange={handleOnChange} />
        </label>
        <ol>
          {data &&
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
            })}
          {loading && <Loading />}
        </ol>
      </div>

      <p>
        <button onClick={handleClickMore} disabled={!pageInfo.hasMore}>
          More ...
        </button>
      </p>
    </pre>
  )
}

export const MoreDataWithState = props => {
  const { data, fetchMore } = props
  const [content, setContent] = useState(data)

  const updatePageLimit = async vars => {
    const { limit } = vars
    if (limit !== content.pageInfo.limit) {
      const newContent = content
      newContent.data = []
      newContent.pageInfo.limit = limit
      newContent.pageInfo.offset = 0
      setContent(newContent)
      return updatePage({ ...vars, offset: 0 })
    }
    return updatePage(vars)
  }

  const updatePage = async vars => {
    const newContent = await fetchMore({ ...vars, currentData: content })
    setContent(newContent)
  }

  return <MoreData {...content} fetchMore={updatePageLimit} />
}
