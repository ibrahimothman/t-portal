export const getTargetPlatforms = async () => {
    return [
    {
        id: 1,
        code: 'dxp',
        name: 'Digital Experience Platform',
        projects: [
            {
                id: 1,
                code: 'CTS/SSD/5340/2025',
                name: 'IT - NTS - SDS - Development of Digital Experience Platform (DXP)',
                department: 'Digital Services',
                status: 'Stage Gate 6: Finance Approval (General Budget Committee)',
                startDate: '15/07/2026',
                endDate: '31/12/2028'
            }
        ]
   
    },

    {
        id: 2,
        code: 'multi-experience',
        name: 'Multi-Experience Platform',
        projects: [
           {
            id: 1,
            code: 'CTS/TSG/5491/2025',
            name: 'IT - NTS - SDS - Development of Develop Multiexperience development platform',
            department: 'Technology Strategy & Governance',
            status: 'Stage Gate 1: Project Request',
            startDate: '',
            endDate: ''
           },
           
        ]
    },
    {
        id: 3,
        code: 'analytics-service',
        name: 'Analytics as a Service',
        projects: [
            {
                id: 1,
                code: 'CTS/SSD/5106/20245',
                name: 'IT - TSE - I - Implementing Big Data Platform Revamp',
                department: 'Digital Services',
                status: 'Stage Gate 8: Project Start',
                startDate: '1/9/2026',
                endDate: '31/3/2029'
            }
        ]
    },
    {
        id: 4,
        code: 'cloud-erp',
        name: 'Cloud Enterprise Resource Planning',
        projects: [
            
        ]
    },
    {
        id: 5,
        code: 'cloud-assets',
        name: 'Cloud Enterprise Asset Management Platform',
        projects: [
            {
             id: 1,
             code: 'CTS/TSG/5505/2025',
             name: 'IT - NTS - SDS - Development of enterprise asset management suite',
             department: 'Technology Strategy & Governance',
             status: 'Stage Gate 1: Project Request',
             startDate: '',
             endDate: ''
            },
            {    
             id: 2,
             code: 'CTS/ITD/4876/2023',
             name: 'IT - TSE - SDS - Upgrading Maximo Technology',
             department: 'Information Technology',
             status: 'Stage Gate 9: Project Execution',
             startDate: '25/04/2025',
             endDate: '10/05/2029'
            }
         ]
    },

]
}