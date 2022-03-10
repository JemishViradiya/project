const MuiTable = ({ spacing, palette }) => ({
  root: {
    '&.expansionTable-root': {
      borderCollapse: 'separate',
      // give the header a transparent background
      '& .MuiTableHead-root .MuiTableCell-root': {
        backgroundColor: 'transparent',
      },
      // give all table body rows a white background unless it's the expandable content row,
      // whose background color (and border) will be handled by its inner `Box`
      '& .MuiTableBody-root .MuiTableRow-root:not(.expansionTable-content)': {
        backgroundColor: palette.background.background,
        // give the first table cell of these table body rows a left border
        '& .MuiTableCell-root:first-child': {
          borderLeft: `1px solid ${palette.divider}`,
        },
        // give the last table cell of these table body rows (the expand icon) a right border
        '& .MuiTableCell-root:last-child': {
          borderRight: `1px solid ${palette.divider}`,
          width: '24px',
          cursor: 'pointer',
        },
      },
      // ensure the expandable content row's cell always has auto height
      '& .MuiTableRow-root:not(.expansionTable-content) + .expansionTable-open': {
        '& .MuiTableCell-root': {
          height: 'auto',
        },
      },
      // ensure the first expandable "top margin" doesn't render
      '& .expansionTable-content:first-child': {
        '& .MuiTableCell-root': {
          height: 0,
          border: 'none',
        },
      },
      // ensure the last expandable content row's cell doesn't render an outer border
      '& .expansionTable-content:last-child': {
        '& .MuiTableCell-root': {
          border: 'none',
        },
      },
      // now the expandable content magic...
      '& .expansionTable-content': {
        // ensure expandable content row's cell has no border or padding by default,
        // this will be handled by its inner `Box`, and apply the height transition
        '& .MuiTableCell-root': {
          border: 'none',
          padding: 0,
          height: 0,
          transition: 'height 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          whiteSpace: 'normal',
        },
        // apply height to open "top margins", which will trigger the transition,
        // and apply a bottom border that will act as the top border of its sibling
        '&.expansionTable-open': {
          '& .MuiTableCell-root': {
            height: `${spacing(2)}px`,
            borderBottom: `1px solid ${palette.divider}`,
          },
          // ...unless this "top margin" is the direct sibling of an open expandable content row,
          // in which case the desired margin and border will be rendered by the styles above
          '& + .expansionTable-open': {
            '& .MuiTableCell-root': {
              height: 0,
              border: 'none',
            },
          },
        },
      },
      // rotate the expansion icon up/down as the content expands/collapses
      '& .expansionTable-icon': {
        padding: 0,
        transform: 'rotate(0deg)',
        transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        '&.rotate-up': {
          transform: 'rotate(180deg)',
        },
      },
    },
  },
})

export default MuiTable
