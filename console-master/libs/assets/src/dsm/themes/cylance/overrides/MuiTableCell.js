const MuiTableCell = ({ spacing, palette }) => ({
  root: {
    '&.iconPadding': {
      paddingTop: 0,
      paddingBottom: 0,
    },
    '&:not(.iconPadding)': {
      padding: `${spacing(3.875)}px ${spacing(6)}px`,
    },

    borderBottom: `1px solid ${palette.divider}`,
    whiteSpace: 'nowrap',
    '&.dragAndDrop-handle .MuiSvgIcon-root': {
      cursor: 'move',
    },
    '&.linear-progress': {
      padding: 0,
    },
    '.ReactVirtualized__Grid &': {
      alignItems: 'center',
      boxSizing: 'border-box',
    },
  },

  head: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    '& div': {
      '& button': {
        marginLeft: `${spacing(1)}px`,
      },
    },
    '&$sizeSmall': {
      fontSize: '0.75rem',
      lineHeight: '1rem',
      color: palette.text.secondary,
      padding: [[spacing(0.5), spacing(2)]],
    },
  },
  body: {
    // .text-wrap is a normal text wrapping, where overflow
    // will break on a space after a word
    '&.text-wrap': {
      whiteSpace: 'normal',
      overflowWrap: 'normal',
      wordBreak: 'break-word',
    },
    // .single-word-wrap wraps the text by breaking in the
    // middle of a word (ie. SHA256)
    '&.single-word-wrap': {
      whiteSpace: 'normal',
      overflowWrap: 'anywhere',
    },
    '.ReactVirtualized__Grid &': {
      cursor: 'pointer',
    },
    '&$sizeSmall': {
      lineHeight: '1.25rem',
      '&:last-child': {
        paddingLeft: 0,
      },
      '&.iconPadding': {
        paddingTop: 0,
        paddingBottom: 0,
      },
      '&:not(.iconPadding)': {
        padding: [[spacing(2.5), spacing(2)]],
      },
    },
  },
  paddingCheckbox: {
    padding: `${spacing(1)}px 0 ${spacing(1)}px ${spacing(1)}px`,
    width: `${spacing(8)}px`,
    '&:not(.iconPadding)': {
      padding: `${spacing(1)}px 0 ${spacing(1)}px ${spacing(1)}px`,
    },
    '&.MuiTableCell-sizeSmall > *': {
      padding: [[spacing(1.25), spacing(2)]],
    },
  },
})

export default MuiTableCell
