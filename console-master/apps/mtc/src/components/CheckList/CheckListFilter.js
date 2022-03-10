import { debounce } from 'lodash'
import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import Search from '@material-ui/icons/Search'

import { Text } from '../Input'

const CheckListFilter = ({ onChange, classes }) => {
  const debouncedOnChange = debounce(onChange, 300)

  const handleChange = event => {
    event.persist()
    debouncedOnChange(event.target.value)
  }

  return <Text label="Filter" className={classes.margin} onChange={handleChange} startAdornment={<Search />} />
}

const styles = () => ({
  margin: {
    width: '95%',
    margin: '20px 0',
  },
})

export default withStyles(styles)(CheckListFilter)
