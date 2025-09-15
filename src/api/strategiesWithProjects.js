// Function to combine strategies and projects data
export const getStrategiesWithProjects = async () => {
    // Import the existing data from projects.js
    const { getStrategiesData, getProjectsData } = await import('./projects.js');
    
    try {
        // Get both datasets
        const strategies = await getStrategiesData();
        const projects = await getProjectsData();
        
        // Create a map to efficiently group projects by strategy
        const strategyProjectsMap = new Map();
        
        // Initialize all strategies with empty project arrays
        strategies.forEach(strategy => {
            strategyProjectsMap.set(strategy.name, {
                ...strategy,
                projects: []
            });
        });
        
        // Group projects by their associated strategies
        projects.forEach(project => {
            if (project.strategies && Array.isArray(project.strategies)) {
                project.strategies.forEach(strategyName => {
                    if (strategyProjectsMap.has(strategyName)) {
                        strategyProjectsMap.get(strategyName).projects.push({
                            projectCode: project.projectCode,
                            projectName: project.projectName,
                            agencySector: project.agencySector,
                            department: project.department,
                            status: project.status || 'Unknown',
                            startDate: project.startDate || 'TBD',
                            endDate: project.endDate || 'TBD',
                            budget: project.budget || 'TBD',
                            projectManager: project.projectManager || 'TBD',
                            priority: project.priority || 'Medium'
                        });
                    }
                });
            }
        });
        
        // Convert map to array and add summary statistics
        const result = Array.from(strategyProjectsMap.values()).map(strategy => ({
            ...strategy,
            projectCount: strategy.projects.length,
            activeProjects: strategy.projects.filter(p => 
                p.status?.includes('In Progress') || 
                p.status?.includes('Active') || 
                p.status?.includes('Project Start')
            ).length,
            completedProjects: strategy.projects.filter(p => 
                p.status?.includes('Completed')
            ).length,
            projects: strategy.projects
        }));
        
        // Sort strategies by project count (descending)
        result.sort((a, b) => b.projectCount - a.projectCount);
        
        return result;
        
    } catch (error) {
        console.error('Error combining strategies and projects:', error);
        
        // Return fallback mock data
        return [
            {
                name: 'Digital Strategy 2030',
                category: 'Support',
                agency: 'CTSS',
                projectCount: 3,
                activeProjects: 2,
                completedProjects: 1,
                projects: [
                    {
                        projectCode: 'CTS/SSD/5340/2025',
                        projectName: 'IT - NTS - SDS - Development of Digital Experience Platform (DXP)',
                        agencySector: 'CTSS',
                        department: 'Digital Services',
                        status: 'Stage Gate 6: Finance Approval (General Budget Committee)',
                        startDate: '15/07/2026',
                        endDate: '31/12/2028',
                        budget: '$2,500,000',
                        projectManager: 'John Smith',
                        priority: 'High'
                    },
                    {
                        projectCode: 'CTS/SSD/5106/2024',
                        projectName: 'IT - TSE - I - Implementing Big Data Platform Revamp',
                        agencySector: 'CTSS',
                        department: 'Digital Services',
                        status: 'Stage Gate 8: Project Start',
                        startDate: '01/09/2026',
                        endDate: '31/03/2029',
                        budget: '$1,800,000',
                        projectManager: 'Sarah Johnson',
                        priority: 'Medium'
                    },
                    {
                        projectCode: 'CTS/SSD/4892/2024',
                        projectName: 'Cloud Migration Initiative Phase 2',
                        agencySector: 'CTSS',
                        department: 'IT Infrastructure',
                        status: 'Completed',
                        startDate: '01/01/2024',
                        endDate: '30/06/2024',
                        budget: '$3,200,000',
                        projectManager: 'Michael Brown',
                        priority: 'High'
                    }
                ]
            },
            {
                name: 'RTA Customer Experience Strategy',
                category: 'Support',
                agency: 'CASS',
                projectCount: 2,
                activeProjects: 1,
                completedProjects: 1,
                projects: [
                    {
                        projectCode: 'CASS/CX/4756/2024',
                        projectName: 'Customer Portal Enhancement',
                        agencySector: 'CASS',
                        department: 'Customer Experience',
                        status: 'In Progress',
                        startDate: '15/03/2024',
                        endDate: '15/12/2024',
                        budget: '$950,000',
                        projectManager: 'Emily Davis',
                        priority: 'Critical'
                    },
                    {
                        projectCode: 'CASS/CX/4623/2024',
                        projectName: 'Mobile App User Experience Redesign',
                        agencySector: 'CASS',
                        department: 'Digital Experience',
                        status: 'Completed',
                        startDate: '01/06/2023',
                        endDate: '31/12/2023',
                        budget: '$450,000',
                        projectManager: 'Robert Wilson',
                        priority: 'Medium'
                    }
                ]
            },
            {
                name: 'Traffic Safety Strategy',
                category: 'Core Business',
                agency: 'TRA',
                projectCount: 1,
                activeProjects: 1,
                completedProjects: 0,
                projects: [
                    {
                        projectCode: 'TRA/TS/5001/2024',
                        projectName: 'Smart Traffic Management System',
                        agencySector: 'TRA',
                        department: 'Traffic Operations',
                        status: 'In Progress',
                        startDate: '01/02/2024',
                        endDate: '31/08/2025',
                        budget: '$1,200,000',
                        projectManager: 'Ahmed Al-Rashid',
                        priority: 'High'
                    }
                ]
            },
            {
                name: 'Asset Strategy',
                category: 'Support',
                agency: 'SCG',
                projectCount: 0,
                activeProjects: 0,
                completedProjects: 0,
                projects: []
            },
            {
                name: 'Nol digital Strategy',
                category: 'Core Business',
                agency: 'CTSS',
                projectCount: 0,
                activeProjects: 0,
                completedProjects: 0,
                projects: []
            },
            {
                name: 'Logistics and commercial transport strategy for the Emirate of Dubai',
                category: 'Core Business',
                agency: 'LA',
                projectCount: 0,
                activeProjects: 0,
                completedProjects: 0,
                projects: []
            }
        ];
    }
};

// Helper function to get strategies data
export const getStrategiesData = async () => {
    return [
        {
            name: 'Asset Strategy',
            category: 'Support',
            agency: 'SCG'
        },
        {
            name: 'Digital Strategy 2030',
            category: 'Support',
            agency: 'CTSS'
        },
        {
            name: 'Logistics and commercial transport strategy for the Emirate of Dubai',
            category: 'Core Business',
            agency: 'LA'
        },
        {
            name: 'Nol digital Strategy',
            category: 'Core Business',
            agency: 'CTSS'
        },
        {
            name: 'RTA Customer Experience Strategy',
            category: 'Support',
            agency: 'CASS'
        },
        {
            name: 'Traffic Safety Strategy',
            category: 'Core Business',
            agency: 'TRA'
        }
    ];
};

// Helper function to get projects data
export const getProjectsData = async () => {
    return [
        {
            projectName: "Enterprise Transportation Management platform",
            projectCode: "LIC/SSO/4985/2023",
            strategies: ["Asset Strategy", "Traffic Safety Strategy"],
            agencySector: "CTSS",
            department: "Information Technology",
            status: "In Progress",
            startDate: "01/01/2024",
            endDate: "31/12/2025",
            budget: "$1,500,000",
            projectManager: "Ahmad Hassan",
            priority: "High"
        },
        {
            projectName: "Inf - PT - DS - Execution of Design and Implementing of New TVM and TOM for PTA (with CBT and ABT)",
            projectCode: "PTA/TSD/3158/2019",
            strategies: ["Nol digital Strategy"],
            agencySector: "PTA",
            department: "Transportation Systems",
            status: "Active",
            startDate: "15/03/2024",
            endDate: "30/09/2025",
            budget: "$2,100,000",
            projectManager: "Fatima Al-Zahra",
            priority: "Critical"
        },
        {
            projectName: "IT - TIS - SDS - Implementing Account Based Ticketing system for Rail Agency",
            projectCode: "RAA/POD/4808/2023",
            strategies: ["Digital Strategy 2030", "RTA Customer Experience Strategy"],
            agencySector: "Rail",
            department: "Rail Operations",
            status: "Stage Gate 8: Project Start",
            startDate: "01/06/2024",
            endDate: "31/05/2026",
            budget: "$3,500,000",
            projectManager: "Mohammed Al-Mansoori",
            priority: "High"
        },
        {
            projectName: "Customer Experience Enhancement Platform",
            projectCode: "CASS/CX/4756/2024",
            strategies: ["RTA Customer Experience Strategy"],
            agencySector: "CASS",
            department: "Customer Experience",
            status: "In Progress",
            startDate: "15/02/2024",
            endDate: "15/11/2024",
            budget: "$950,000",
            projectManager: "Layla Ibrahim",
            priority: "Medium"
        },
        {
            projectName: "Smart Traffic Control System Implementation",
            projectCode: "TRA/TS/5001/2024",
            strategies: ["Traffic Safety Strategy"],
            agencySector: "TRA",
            department: "Traffic Operations",
            status: "Planning",
            startDate: "01/07/2024",
            endDate: "31/12/2025",
            budget: "$2,800,000",
            projectManager: "Omar Al-Rashid",
            priority: "Critical"
        },
        {
            projectName: "Digital Transformation Initiative Phase 3",
            projectCode: "CTS/SSD/5340/2025",
            strategies: ["Digital Strategy 2030"],
            agencySector: "CTSS",
            department: "Digital Services",
            status: "Stage Gate 6: Finance Approval",
            startDate: "15/07/2026",
            endDate: "31/12/2028",
            budget: "$4,200,000",
            projectManager: "Aisha Al-Mahmoud",
            priority: "High"
        }
    ];
};

