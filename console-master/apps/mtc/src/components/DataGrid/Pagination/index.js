/*
	The <Pagination /> component renders pagination in an <ul></ul> based on props.
	Props:
		limit - total limit of results per page
		totalCount - totalCount of all matched results (the totalCount property returned from the server)
		offset - a zero-based indexing of the page (index 0 is the 1st page)
		pageChangeCallback - a function called when the page changes so the parent knows to refetch data
*/
import PropTypes from 'prop-types'
import React from 'react'

require('./Pagination.scss')

class Pagination extends React.Component {
  state = {
    currentIndex: 0,
    totalPages: 0,
  }

  componentDidMount() {
    this._calculatePages(this.props, parseInt(this.props.offset, 10))
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      if (this.props.offset !== this.state.currentIndex) {
        this._calculatePages(this.props, parseInt(this.props.offset, 10))
      } else {
        this._calculatePages(this.props)
      }
    }
  }

  _calculatePages = (newProps, index = this.state.currentIndex) => {
    const total = Math.ceil(newProps.totalCount / newProps.limit)

    this.setState({
      currentIndex: index,
      totalPages: total,
    })
  }

  _goToIndex = index => {
    this.setState(
      {
        currentIndex: index,
      },
      () => {
        this.props.pageChangeCallback(index)
      },
    )
  }

  render() {
    const listItems = []
    const visiblePages = []
    if (this.state.totalPages > 0) {
      if (this.state.totalPages >= 5) {
        if (this.state.currentIndex < 3) {
          visiblePages.push(0)
          visiblePages.push(1)
          visiblePages.push(2)
          visiblePages.push(3)
          visiblePages.push('...')
          visiblePages.push(this.state.totalPages - 1)
        } else if (this.state.currentIndex > this.state.totalPages - 4) {
          visiblePages.push(0)
          visiblePages.push('...')
          visiblePages.push(this.state.totalPages - 4)
          visiblePages.push(this.state.totalPages - 3)
          visiblePages.push(this.state.totalPages - 2)
          visiblePages.push(this.state.totalPages - 1)
        } else {
          visiblePages.push(0)
          visiblePages.push('...')
          visiblePages.push(this.state.currentIndex - 1)
          visiblePages.push(this.state.currentIndex)
          visiblePages.push(this.state.currentIndex + 1)
          visiblePages.push('...')
          visiblePages.push(this.state.totalPages - 1)
        }
      } else {
        for (let i = 0; i <= this.state.totalPages - 1; i++) {
          visiblePages.push(i)
        }
      }
    }
    for (let i = 0; i < visiblePages.length; i++) {
      if (visiblePages[i] !== '...') {
        const index = visiblePages[i]
        listItems.push(
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <li key={i} className={this.state.currentIndex === index ? 'active' : ''} onClick={() => this._goToIndex(index)}>
            {index + 1}
          </li>,
        )
      } else {
        listItems.push(
          <li key={i} className="ellipses">
            {visiblePages[i]}
          </li>,
        )
      }
    }
    return (
      <div id="data-table-pagination" className="pagination">
        <ul>{listItems}</ul>
      </div>
    )
  }
}

function allowNull(wrappedPropTypes) {
  return (props, propName, ...rest) => {
    if (props[propName] === null) return null
    return wrappedPropTypes(props, propName, ...rest)
  }
}

Pagination.defaultProps = {
  totalCount: null,
}

Pagination.propTypes = {
  limit: PropTypes.number.isRequired,
  totalCount: allowNull(PropTypes.number.isRequired),
  offset: PropTypes.number.isRequired,
  pageChangeCallback: PropTypes.func.isRequired,
}

export default Pagination
