const MuiCardHeader = ({ spacing }) => ({
  root: {
    padding: `${spacing(0)}px ${spacing(0)}px ${spacing(6)}px ${spacing(0)}px`,
  },
  avatar: {
    // for our current uses, we don't need a right margin.
    // this may need to change if there are scenarios we want margin,
    // and others we don't
    marginRight: 0,
  },
})

export default MuiCardHeader
