import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { AutoSizer, List as VirtualizedList } from 'react-virtualized'

import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { withStyles } from '@material-ui/core/styles'

import { CheckListFilter } from './'

class CheckList extends Component {
  state = {
    filteredList: [],
  }

  componentDidMount() {
    this.setState({ filteredList: [...this.props.data] })
  }

  handleToggle = checkListItemId => () => {
    const { filteredList } = this.state
    const newList = [...filteredList]
    const itemIndex = filteredList.indexOf(filteredList.find(listItem => listItem.accessor === checkListItemId))
    newList[itemIndex].value = !newList[itemIndex].value

    this.setState({
      filteredList: newList,
    })
    this.props.getTotalTenantsChecked()
  }

  handleSelectAllClick = () => {
    const newList = [...this.state.filteredList]
    const checkedItemCount = newList.filter(item => item.value === true).length

    if (checkedItemCount === 0 && newList.length > 0) {
      newList.forEach(listItem => {
        return (listItem.value = true) //eslint-disable-line
      })
    } else {
      newList.forEach(listItem => {
        return (listItem.value = false) //eslint-disable-line
      })
    }
    this.setState({ filteredList: newList })
    this.props.getTotalTenantsChecked()
  }

  handleFilter = value => {
    const filterTerm = value.toLowerCase()
    const { data } = this.props
    const newData = [...data].filter(listItem => listItem.label.toLowerCase().includes(filterTerm))
    newData.forEach(listItem => {
      return (listItem.value = false) //eslint-disable-line
    })
    this.setState({ filteredList: newData })
  }

  rowRenderer({ index, style }) {
    const { filteredList } = this.state
    const { dense, dividers, classes, errorState } = this.props
    const checkListItem = filteredList[index]
    return (
      <div key={checkListItem.label} style={style}>
        <ListItem
          dense={dense}
          disableGutters
          button
          onClick={this.handleToggle(checkListItem.accessor)}
          classes={{ dense: classes.dense }}
        >
          <Checkbox
            checked={checkListItem.value}
            value={checkListItem.accessor}
            classes={{
              root: `${errorState ? classes.errorStateRoot : classes.cssRoot}`,
              checked: `${errorState ? classes.errorState : classes.checked}`,
            }}
          />
          <ListItemText primary={checkListItem.label} classes={{ root: classes.listItem }} />
        </ListItem>
        {dividers && <Divider />}
      </div>
    )
  }

  render() {
    const { classes, data, dense, selectAll, filter, dividers, errorState } = this.props
    const { filteredList } = this.state
    const numSelected = filteredList.filter(item => item.value === true).length
    const filteredRowCount = filteredList.length
    const totalRowCount = data.length

    return (
      <div id="checklist-container">
        {filter && <CheckListFilter onChange={this.handleFilter} />}
        {totalRowCount > 0 && (
          <div className={classes.listContainer}>
            {selectAll && filteredRowCount > 0 && (
              <div>
                <ListItem
                  dense={dense}
                  disableGutters
                  button
                  classes={{ dense: classes.dense }}
                  onClick={this.handleSelectAllClick}
                >
                  <Checkbox
                    indeterminate={numSelected > 0 && numSelected < filteredRowCount}
                    checked={numSelected === totalRowCount || numSelected === filteredRowCount}
                    classes={{
                      root: `${errorState ? classes.errorStateRoot : classes.cssRoot}`,
                      checked: `${errorState ? classes.errorState : classes.checked}`,
                    }}
                  />
                  <ListItemText classes={{ primary: classes.boldText }} primary="Select All" />
                </ListItem>
                {dividers && <Divider />}
              </div>
            )}
            {filteredRowCount > 0 ? (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <VirtualizedList
                    width={width || 250}
                    height={200}
                    rowCount={filteredRowCount}
                    rowHeight={dense ? 25 : 50}
                    rowRenderer={this.rowRenderer.bind(this)}
                  />
                )}
              </AutoSizer>
            ) : null}
          </div>
        )}
        {filteredRowCount === 0 && <p className={classes.paragraph}>No list items present.</p>}
      </div>
    )
  }
}

CheckList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      accessor: PropTypes.string,
      value: PropTypes.bool,
    }),
  ),
  /* Toggles a compressed list view */
  dense: PropTypes.bool,
  /* Toggles a 'check all' checkbox */
  selectAll: PropTypes.bool,
  /* Toggles a filter */
  filter: PropTypes.bool,
  /* Toggles a horizontal line divider between each list element */
  dividers: PropTypes.bool,
  /* Toggles the color scheme to reflect an error state within the CheckList */
  errorState: PropTypes.bool,
}

CheckList.defaultProps = {
  data: [],
}

const styles = () => ({
  root: {
    overflow: 'auto',
    maxHeight: 200,
  },
  cssRoot: {
    height: '25px',
    marginLeft: '-12px',
  },
  dense: {
    paddingTop: '0px',
    paddingBottom: '0px',
  },
  checked: {
    color: '#03A5EF !important',
  },
  paragraph: {
    padding: '15px 0px',
    fontSize: '0.8125rem',
    textAlign: 'center',
  },
  listContainer: {
    marginBottom: '10px',
    textOverflow: 'ellipsis',
  },
  errorState: {
    color: '#e74c3c !important',
  },
  errorStateRoot: {
    height: '25px',
    marginLeft: '-12px',
    color: '#e74c3c !important',
  },
  boldText: {
    fontWeight: '600',
  },
  listItem: {
    whiteSpace: 'nowrap',
  },
})

export default withStyles(styles)(CheckList)
