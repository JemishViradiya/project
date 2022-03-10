import React from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'

import Paper from '@material-ui/core/Paper'

const StyledPanelListRow = styled.div`
  .panel-list-row {
    margin: auto 24px 14px 24px;
    display: flex;
    padding: 24px;
    overflow: hidden;
    border: 1px solid #cccccc;
    box-shadow: none;
    &.disabled {
      opacity: 0.4;
    }
    & > div,
    & > div > div,
    & > div > div > div {
      overflow: hidden;
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
`

const StyledPanelListCell = styled.div`
  flex: 1;
  /* padding-right: 24px; */
  & > div {
    display: flex;
    align-items: center;
    p {
      margin: 0;
    }
  }
  .MuiButton-root {
    margin-right: 16px;
  }
`

const PanelListRow = ({ data, templates, disabled }) => {
  const populatedTemplates = []
  templates.forEach((template, index) => {
    const templateContainer = (
      <StyledPanelListCell key={`col-${index.toString()}`}>
        {data && Object.keys(data).length > 0 ? template(data) : <Skeleton />}
      </StyledPanelListCell>
    )
    populatedTemplates.push(templateContainer)
  })
  return (
    <StyledPanelListRow>
      <Paper className={`panel-list-row ${disabled ? 'disabled' : ''}`}>{populatedTemplates}</Paper>
    </StyledPanelListRow>
  )
}

export default PanelListRow
