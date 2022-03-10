import React from 'react'

require('./Search.scss')

const Search = () => (
  <div className="search-container">
    <input aria-label="Search site" className="search-bar" type="search" placeholder="i.e., 'Search for tenant' " />
    <div className="circle-background" id="search-button-background">
      <span className="icon-search" id="search-button" />
    </div>
  </div>
)

export default Search
