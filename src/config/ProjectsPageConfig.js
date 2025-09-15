export const ProjectsTableFieldsConfig = {
    projectName: {
        headerName: 'Project Name',
        
    },

    projectCode: {
        headerName: 'Project Code',
        width: 'fixed'
    },

    strategies: {
        headerName: 'Strategies',
        cellType: 'badge',
        badgeType: 'strategy',
        width: 'fixed'
    },

    agencySector: {
        headerName: 'Agency/Sector',
        type: 'singleSelect'
    },

    department: {
        headerName: 'Department',
    },

    startYear: {
        headerName: 'Start Year',
        type: 'string'
    },

    endYear: {
        headerName: 'End Year',
        type: 'string'
    },
}
