const createHeaders = () => {
  return {
    HEADER_1: {
      section: 'SECTION_1',
      columnName: 'COLUMN_NAME_1',
      dataKey: 'HEADER_1',
      cellDataGetter: data => data.someData,
      disableSort: false,
      defaultSortDirection: 'DESC',
      width: 95,
      visible: true,
      defaultVisible: true,
      disabled: true,
    },
  }
}

export { createHeaders }
