import { DATE_PICKER_WIDTH, FILTER_MAX_HEIGHT, FILTER_MAX_WIDTH, FILTER_MIN_WIDTH } from './../spacing'

const MuiPopover = ({ spacing, typography, palette }) => ({
  paper: {
    '&.filter-paper': {
      minWidth: FILTER_MIN_WIDTH,
      maxWidth: FILTER_MAX_WIDTH,
    },
    '& .MuiListItem-button > .MuiSvgIcon-root:first-child': {
      marginRight: '12px',
    },
    '&.date-picker-filter': {
      width: `${DATE_PICKER_WIDTH + spacing(4) * 2}px`,
    },
    '&.date-range-filter': {
      width: `${DATE_PICKER_WIDTH * 2 + spacing(4) * 2 + spacing(6)}px`,
    },
    '& .MuiListSubheader-sticky': {
      backgroundColor: palette.background.background,
    },
    '&.numeric-filter': {
      width: `${FILTER_MAX_WIDTH}px`,
      '& .MuiSlider-root': {
        width: `${FILTER_MAX_WIDTH - spacing(8) - 12}px`,
      },
    },
    '&.quick-search-filter': {
      width: `${FILTER_MAX_WIDTH}px`,
    },
    '&.chip-auto-complete-filter': {
      '& .columns-container': {
        maxHeight: `${FILTER_MAX_HEIGHT - parseInt(typography.h2.lineHeight)}px`,
        '& >.MuiBox-root': {
          width: FILTER_MAX_WIDTH,
        },
      },
    },
  },
  root: {
    '& .MuiListItem-root': {
      paddingTop: spacing(2),
      paddingBottom: spacing(2),
    },
    '& .MuiListItemText-root': {
      marginTop: 0,
      marginBottom: 0,
    },
  },
})

export default MuiPopover
