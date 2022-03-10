import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { DateCell, LinkCell, TextCell } from '../../../../components/DataGrid/Cells'
import DataGridContainer from '../../../../components/DataGrid/DataGridContainer'
import { getPartnerList } from '../redux/actions'

import('./PartnerList.scss')

class PartnerList extends Component {
  updateParams = params => {
    this.fetch(params)
  }

  async fetch(params) {
    await this.props.getPartnerList(params)
  }

  render() {
    return [
      <Helmet key="metadata">
        <title>Partner List View</title>
      </Helmet>,
      <DataGridContainer
        key="partner-list"
        storedColumnKey="partner"
        data={this.props.partnerList}
        onParamChange={this.updateParams.bind(this)}
        loading={this.props.dataLoading}
        partnerFilter={false}
        button={
          <div className="data-grid-buttons">
            <Link to="/partner/create">
              <span className="icon-plus" />
              Add New Partner
            </Link>
          </div>
        }
        buttonPermission="partner:manage"
        columns={[
          {
            Header: 'ID',
            accessor: 'id',
            show: false,
            toggleHidden: false,
          },
          {
            Header: 'Name',
            accessor: 'name',
            toggleHidden: true,
            Cell: row => <LinkCell row={row} template={'/partner/details/${id}'} />,
          },
          {
            Header: 'Partner Type',
            accessor: 'partnerType',
            toggleHidden: true,
            Cell: row => <TextCell row={row} loading={this.props.dataLoading} />,
            type: 'enum',
            enumValues: [
              {
                label: 'MSSP',
                value: 'mssp',
              },
              {
                label: 'OEM',
                value: 'oem',
              },
              {
                label: 'Technical Alliance',
                value: 'alliance',
              },
              {
                label: 'Multi-Tenant Enterprise',
                value: 'mtc',
              },
            ],
          },
          {
            Header: 'Tenant Count',
            accessor: 'tenantCount',
            toggleHidden: true,
            filterable: false,
            sortable: false,
            Cell: row => <TextCell row={row} loading={this.props.dataLoading} />,
          },
          {
            Header: 'Created',
            accessor: 'createdDateTime',
            toggleHidden: true,
            Cell: row => <DateCell row={row} loading={this.props.dataLoading} />,
            type: 'date',
          },
          {
            Header: 'Created By',
            accessor: 'createdBy',
            toggleHidden: true,
            show: false,
            Cell: row => <TextCell row={row} />,
          },
          {
            Header: 'Modified',
            accessor: 'updatedDateTime',
            toggleHidden: true,
            Cell: row => <DateCell row={row} loading={this.props.dataLoading} />,
            type: 'date',
          },
          {
            Header: 'Modified By',
            accessor: 'updatedBy',
            toggleHidden: true,
            show: false,
            Cell: row => <TextCell row={row} />,
          },
        ]}
      />,
    ]
  }
}

function mapStateToProps(state) {
  return {
    partnerList: state.partners.partnerList,
    dataLoading: state.requests.inProcess['get-partner-list'],
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPartnerList: getPartnerList,
    },
    dispatch,
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(PartnerList)
