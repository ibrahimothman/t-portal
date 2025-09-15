import { PageHeader } from '../../components'
import { DataTable } from '../../components' 
import { StakeholdersTableFieldsConfig } from '../../config'
import { getStakeholdersData } from '../../api'
import { useEffect, useState, useMemo } from 'react'

export default function Stakeholders() {
    const [data, setData] = useState([])
    const [filters, setFilters] = useState([])


    useEffect(() => {
        getStakeholdersData().then(setData)
    }, [])

    const filteredData = useMemo(() => {
        // if filters is empty, return all data
        if (filters.length === 0) return data
        return data.filter(item => filters.some(filter => filter.key === filter.key && filter.value === item[filter.key]))
    }, [data, filters])


    return (
        <>
            <PageHeader title="Stakeholders" />
            
            <section className="mt-6 flex flex-col gap-6">
                <DataTable data={filteredData} fieldsConfig={StakeholdersTableFieldsConfig} title="Stakeholders" />
            </section>
            
        </>
    )
}