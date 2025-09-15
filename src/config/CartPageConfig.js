
export const CartTableFieldsConfig = {
  id: {
    headerName: 'ID',
    flex: 0.5,
    minWidth: 50,
  },
  name: {
    headerName: 'Name',
    flex: 1,
    minWidth: 120,
  },
  agency: {
    headerName: 'Agency/Sector',
    flex: 1,
    minWidth: 120,
    type: 'singleSelect',
  },
  department: {
    headerName: 'Department',
    flex: 1,
    minWidth: 120,
    
  },
  type: {
    headerName: 'Type',
    flex: 1,
    minWidth: 120,
    type: 'singleSelect',
  },
  planningClosureDate: {
    headerName: 'Planned Due Date',
    flex: 1,
    minWidth: 120,
  },
  status: {
    headerName: 'Status',
    flex: 1,
    minWidth: 120,
    cellType: 'badge',
    badgeType: 'requestStatus',
    type: 'singleSelect',
  }
}

export const CartPageFilters = {
  selectedAgency: '', 
  selectedPeriod: '',
  selectedStatus: '',
  selectedStartDate: '',
  selectedEndDate: '',
  selectedDocTypes: [],
}