const MuiDialogTitle = ({ spacing }) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: [[spacing(6), spacing(8)]],
    '& .MuiIconButton-root': {
      //padding: 0,
    },
  },
})

export default MuiDialogTitle
