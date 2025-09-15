import React, { useState, useMemo } from 'react';

const Table = () => {
    const applications = [
        {
            id: 2,
            name: 'Application 2',
            rationalization: 'Retire',
            cloudMigrationStrategy: 'Rehost', 
            migrationYear: '2024',
            department: 'Finance',
            criticality: 'Medium'
        },
        {
            id: 3,
            name: 'Application 3',
            rationalization: 'Migrate',
            cloudMigrationStrategy: 'Replatform',
            migrationYear: '2024',
            department: 'HR',
            criticality: 'Low'
        },
        {
            id: 4,
            name: 'Application 4',
            rationalization: 'Invest',
            cloudMigrationStrategy: 'Retain',
            migrationYear: '2025',
            department: 'Sales',
            criticality: 'High'
        },
        {
            id: 5,
            name: 'Application 5',
            rationalization: 'Migrate',
            cloudMigrationStrategy: 'Refactor',
            migrationYear: '2024',
            department: 'Marketing',
            criticality: 'Medium'
        },
        {
            id: 6,
            name: 'Application 6',
            rationalization: 'Retire',
            cloudMigrationStrategy: 'Rehost',
            migrationYear: '2025',
            department: 'Operations',
            criticality: 'Low'
        },
        {
            id: 7,
            name: 'Application 7',
            rationalization: 'Invest',
            cloudMigrationStrategy: 'Replatform',
            migrationYear: '2024',
            department: 'IT',
            criticality: 'High'
        },
        {
            id: 8,
            name: 'Application 8',
            rationalization: 'Migrate',
            cloudMigrationStrategy: 'Refactor',
            migrationYear: '2025',
            department: 'Finance',
            criticality: 'Medium'
        },
        {
            id: 9,
            name: 'Application 9',
            rationalization: 'Retire',
            cloudMigrationStrategy: 'Retain',
            migrationYear: '2024',
            department: 'HR',
            criticality: 'Low'
        },
        {
            id: 10,
            name: 'Application 10',
            rationalization: 'Invest',
            cloudMigrationStrategy: 'Rehost',
            migrationYear: '2025',
            department: 'Sales',
            criticality: 'High'
        },
        {
            id: 11,
            name: 'Application 11',
            rationalization: 'Migrate',
            cloudMigrationStrategy: 'Replatform',
            migrationYear: '2024',
            department: 'Marketing',
            criticality: 'Medium'
        },
        {
            id: 1,
            name: 'Application 1',
            rationalization: 'Invest',
            cloudMigrationStrategy: 'Refactor',
            migrationYear: '2025',
            department: 'IT',
            criticality: 'High'
        }
    ];

    const [sortField, setSortField] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [filters, setFilters] = useState({
        rationalization: '',
        department: '',
        criticality: '',
        migrationYear: '',
        cloudMigrationStrategy: ''
    });

    // Get unique values for filter dropdowns
    const uniqueValues = useMemo(() => ({
        rationalization: [...new Set(applications.map(app => app.rationalization))],
        department: [...new Set(applications.map(app => app.department))],
        criticality: [...new Set(applications.map(app => app.criticality))],
        migrationYear: [...new Set(applications.map(app => app.migrationYear))],
        cloudMigrationStrategy: [...new Set(applications.map(app => app.cloudMigrationStrategy))]
    }), []);

    // Filter and sort data
    const filteredAndSortedData = useMemo(() => {
        let filtered = applications.filter(app => {
            return Object.entries(filters).every(([key, value]) => 
                !value || app[key] === value
            );
        });

        if (sortField) {
            filtered.sort((a, b) => {
                const aVal = a[sortField];
                const bVal = b[sortField];
                
                if (typeof aVal === 'string') {
                    return sortDirection === 'asc' 
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                }
                
                return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            });
        }

        return filtered;
    }, [filters, sortField, sortDirection]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getCriticalityColor = (criticality) => {
        switch (criticality) {
            case 'High': return 'text-red-600 bg-red-50';
            case 'Medium': return 'text-yellow-600 bg-yellow-50';
            case 'Low': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getRationalizationColor = (rationalization) => {
        switch (rationalization) {
            case 'Invest': return 'text-blue-600 bg-blue-50';
            case 'Migrate': return 'text-purple-600 bg-purple-50';
            case 'Retire': return 'text-gray-600 bg-gray-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) {
            return <span className="text-gray-400">↕</span>;
        }
        return <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
    };

    return (
        <>
            
            {/* Filters
            <div className="mb-6 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-40">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rationalization</label>
                    <select 
                        value={filters.rationalization}
                        onChange={(e) => handleFilterChange('rationalization', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Rationalization</option>
                        {uniqueValues.rationalization.map(val => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
                
                <div className="flex-1 min-w-40">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select 
                        value={filters.department}
                        onChange={(e) => handleFilterChange('department', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Departments</option>
                        {uniqueValues.department.map(val => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
                
                <div className="flex-1 min-w-40">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Criticality</label>
                    <select 
                        value={filters.criticality}
                        onChange={(e) => handleFilterChange('criticality', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Criticality</option>
                        {uniqueValues.criticality.map(val => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
                
                <div className="flex-1 min-w-40">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Migration Year</label>
                    <select 
                        value={filters.migrationYear}
                        onChange={(e) => handleFilterChange('migrationYear', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Years</option>
                        {uniqueValues.migrationYear.map(val => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 min-w-40">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Migration Strategy</label>
                    <select 
                        value={filters.cloudMigrationStrategy}
                        onChange={(e) => handleFilterChange('cloudMigrationStrategy', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Strategies</option>
                        {uniqueValues.cloudMigrationStrategy.map(val => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
                
                
            </div> */}

            {/* Data Grid */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th 
                                    onClick={() => handleSort('id')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>ID</span>
                                        <SortIcon field="id" />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort('name')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Application Name</span>
                                        <SortIcon field="name" />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort('rationalization')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Rationalization</span>
                                        <SortIcon field="rationalization" />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort('cloudMigrationStrategy')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Migration Strategy</span>
                                        <SortIcon field="cloudMigrationStrategy" />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort('migrationYear')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Migration Year</span>
                                        <SortIcon field="migrationYear" />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort('department')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Department</span>
                                        <SortIcon field="department" />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort('criticality')}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Criticality</span>
                                        <SortIcon field="criticality" />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAndSortedData.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {app.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {app.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRationalizationColor(app.rationalization)}`}>
                                            {app.rationalization}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {app.cloudMigrationStrategy}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {app.migrationYear}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {app.department}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCriticalityColor(app.criticality)}`}>
                                            {app.criticality}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Summary */}
            <div className="mt-4 text-sm text-gray-600">
                Showing {filteredAndSortedData.length} of {applications.length} applications
            </div>
        </>
    );
};

export default Table;