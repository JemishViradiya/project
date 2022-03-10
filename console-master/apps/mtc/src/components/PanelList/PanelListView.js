import React from 'react'
import { List, WindowScroller } from 'react-virtualized'
import { pure } from 'recompose'
import styled from 'styled-components'

import Paper from '@material-ui/core/Paper'

import { PanelListFilter, PanelListRow } from './'

const StyledPanelListContainer = styled.div`
  width: 100%;
  height: 61vh;
  .ReactVirtualized__List {
    padding-bottom: 200px;
  }
`

const StyledPanelListHeader = styled.div`
  margin-left: 24px;
  .panel-list-filter {
    div[class*='MuiInput-underline']:after {
      border-bottom-color: #03a5ef;
    }
    div[class*='MuiInputAdornment-positionEnd'] p {
      color: rgba(0, 0, 0, 0.45);
    }
  }
`

const StyledPanelListBody = styled.div`
  margin-top: 8px;
  width: 100%;
  height: 100vh;
`

const StyledPanelListNoResults = styled.div`
  width: 64%;
  margin: 0 auto;
  & > div {
    h2 {
      text-align: center;
    }
    padding-top: 30px;
    padding-bottom: 30px;
  }
`

const rowRenderer = ({ key, index, style }, data, disabledRows, rowTemplate) => {
  const value = data[index]
  return (
    <div key={key} style={style}>
      <PanelListRow disabled={value && disabledRows.indexOf(value.id) !== -1} data={value} templates={rowTemplate} />
    </div>
  )
}

const PanelListView = ({
  onFilter,
  data,
  totalMatches,
  rowTemplate,
  resource,
  position,
  disabledRows,
  noResultsMessage,
  minFilter,
  minFilterMet,
  rowHeight,
  filter,
}) => {
  let noResults = data && data.length === 0
  let message = noResultsMessage
  let rows = data !== null ? data : [...Array(25).fill()]
  if (filter && minFilter && !minFilterMet) {
    noResults = true
    message = 'Type at least 3 characters to see results'
    rows = []
  }
  return (
    <StyledPanelListContainer key="panel-list-styled-container" position={position}>
      <StyledPanelListHeader>
        {filter && (
          <PanelListFilter onChange={onFilter} totalMatches={totalMatches === null ? 0 : totalMatches} resource={resource} />
        )}
      </StyledPanelListHeader>
      <StyledPanelListBody>
        {noResults ? (
          <StyledPanelListNoResults>
            <Paper>
              <h2>{message || 'No Results'}</h2>
            </Paper>
          </StyledPanelListNoResults>
        ) : (
          <WindowScroller>
            {({ height, isScrolling, onChildScroll, scrollTop, width }) => (
              <List
                autoHeight
                height={height}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                rowCount={rows.length}
                rowHeight={rowHeight || 105}
                rowRenderer={props => rowRenderer(props, rows, disabledRows, rowTemplate)}
                scrollTop={scrollTop}
                width={width}
              />
            )}
          </WindowScroller>
        )}
      </StyledPanelListBody>
    </StyledPanelListContainer>
  )
}

export default pure(PanelListView)
