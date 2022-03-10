const MuiTableBody = ({ palette }) => ({
  // border color overrides are necessary because material-ui
  // lightens divider color defined in palette by default for
  // table row borders
  // https://tinyurl.com/tudu9v8
  root: {
    '& .MuiTableRow-root': {
      '&:last-child': {
        '& > td, & > th': {
          borderBottom: `1px solid ${palette.divider}`,
        },
      },
    },
  },
})

export default MuiTableBody
