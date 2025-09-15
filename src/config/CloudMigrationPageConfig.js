export const CloudMigrationTableFieldsConfig = {
  id: {
    headerName: 'ID',
    flex: 0.5,
    minWidth: 50,
  },
  "Application Name": {
    headerName: 'Application Name',
    flex: 1,
    minWidth: 120,
  },

  "Agency/Sector Technical Owner": {
    headerName: 'Agency/Sector Technical Owner',
    flex: 1,
    minWidth: 100,
    type: 'singleSelect',
  },

  "Technical Owners (Department)": {
    headerName: 'Technical Owner',
    flex: 1,
    minWidth: 100,
  },
  "Business Owners (Department)": {
    headerName: 'Business Owner',
    flex: 1,
    minWidth: 100,
  },

  

  rationalization: {
    headerName: 'Rationalization',
    flex: 1,
    minWidth: 120,
    cellType: 'badge',  // Just specify the type
    badgeType: 'rationalization',
    type: 'singleSelect',
  },
  cloudMigrationStrategy: {
    headerName: 'Migration Strategy',
    flex: 1.2,
    minWidth: 140,
    cellType: 'badge',
    badgeType: 'cloudMigrationStrategy',
    type: 'singleSelect',
  },
  migrationYear: {
    headerName: 'Migration Year',
    flex: 1,
    minWidth: 100,
    type: 'singleSelect',
  },
  

  Criticality: {
    headerName: 'Criticality',
    flex: 1,
    minWidth: 100,
    cellType: 'badge',
    badgeType: 'criticality',
    type: 'singleSelect',
  },

  isEligable: {
    headerName: 'Is Eligable?',
    flex: 1,
    minWidth: 100,
    cellType: 'badge',
    badgeType: 'isEligable',
    type: 'singleSelect',
  },


};