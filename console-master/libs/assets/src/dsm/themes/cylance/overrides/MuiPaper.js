const MuiPaper = ({ palette, spacing }) => ({
  elevation0: {
    border: `1px solid ${palette.type === 'dark' ? palette.divider : palette.grey['A100']}`,
  },
})

export default MuiPaper
