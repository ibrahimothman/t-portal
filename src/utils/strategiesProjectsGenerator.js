import { getStrategiesWithProjects } from '../api/strategiesWithProjects';

/**
 * Generates a JSON structure combining strategies with their associated projects
 * @returns {Promise<Object>} JSON object with strategies and projects data
 */
export const generateStrategiesProjectsJSON = async () => {
    try {
        const strategiesWithProjects = await getStrategiesWithProjects();
        
        const result = {
            metadata: {
                generatedAt: new Date().toISOString(),
                totalStrategies: strategiesWithProjects.length,
                totalProjects: strategiesWithProjects.reduce((sum, strategy) => sum + strategy.projectCount, 0),
                totalActiveProjects: strategiesWithProjects.reduce((sum, strategy) => sum + strategy.activeProjects, 0),
                totalCompletedProjects: strategiesWithProjects.reduce((sum, strategy) => sum + strategy.completedProjects, 0)
            },
            data: strategiesWithProjects,
            summary: {
                strategiesByCategory: getStrategiesByCategory(strategiesWithProjects),
                strategiesByAgency: getStrategiesByAgency(strategiesWithProjects),
                topStrategiesByProjectCount: strategiesWithProjects
                    .filter(s => s.projectCount > 0)
                    .slice(0, 5)
                    .map(s => ({
                        name: s.name,
                        projectCount: s.projectCount,
                        activeProjects: s.activeProjects
                    }))
            }
        };
        
        return result;
        
    } catch (error) {
        console.error('Error generating strategies-projects JSON:', error);
        throw error;
    }
};

/**
 * Groups strategies by category
 * @param {Array} strategies - Array of strategy objects
 * @returns {Object} Grouped strategies by category
 */
const getStrategiesByCategory = (strategies) => {
    const grouped = {};
    
    strategies.forEach(strategy => {
        const category = strategy.category || 'Unknown';
        if (!grouped[category]) {
            grouped[category] = {
                count: 0,
                totalProjects: 0,
                strategies: []
            };
        }
        
        grouped[category].count++;
        grouped[category].totalProjects += strategy.projectCount;
        grouped[category].strategies.push({
            name: strategy.name,
            agency: strategy.agency,
            projectCount: strategy.projectCount
        });
    });
    
    return grouped;
};

/**
 * Groups strategies by agency
 * @param {Array} strategies - Array of strategy objects
 * @returns {Object} Grouped strategies by agency
 */
const getStrategiesByAgency = (strategies) => {
    const grouped = {};
    
    strategies.forEach(strategy => {
        const agency = strategy.agency || 'Unknown';
        if (!grouped[agency]) {
            grouped[agency] = {
                count: 0,
                totalProjects: 0,
                strategies: []
            };
        }
        
        grouped[agency].count++;
        grouped[agency].totalProjects += strategy.projectCount;
        grouped[agency].strategies.push({
            name: strategy.name,
            category: strategy.category,
            projectCount: strategy.projectCount
        });
    });
    
    return grouped;
};

/**
 * Exports strategies and projects data to a downloadable JSON file
 * @returns {Promise<string>} JSON string ready for download
 */
export const exportStrategiesProjectsJSON = async () => {
    const data = await generateStrategiesProjectsJSON();
    return JSON.stringify(data, null, 2);
};

/**
 * Filters strategies by specific criteria
 * @param {string} filterType - Type of filter ('category', 'agency', 'hasProjects')
 * @param {string} filterValue - Value to filter by (not needed for 'hasProjects')
 * @returns {Promise<Array>} Filtered strategies array
 */
export const getFilteredStrategiesWithProjects = async (filterType, filterValue = null) => {
    const strategiesWithProjects = await getStrategiesWithProjects();
    
    switch (filterType) {
        case 'category':
            return strategiesWithProjects.filter(s => s.category === filterValue);
            
        case 'agency':
            return strategiesWithProjects.filter(s => s.agency === filterValue);
            
        case 'hasProjects':
            return strategiesWithProjects.filter(s => s.projectCount > 0);
            
        case 'activeProjects':
            return strategiesWithProjects.filter(s => s.activeProjects > 0);
            
        default:
            return strategiesWithProjects;
    }
};

