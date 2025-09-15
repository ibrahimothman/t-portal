import { PageHeader } from '../../components'
import { DataTable } from '../../components' 
import { InformationMapTableFieldsConfig } from '../../config'
import { getInformationMapData } from '../../api'
import { useEffect, useState, useMemo } from 'react'

export default function InformationMap() {
    const [data, setData] = useState([])
    const [filters, setFilters] = useState([])


    useEffect(() => {
        getInformationMapData().then(setData)
    }, [])

    const filteredData = useMemo(() => {
        // if filters is empty, return all data
        if (filters.length === 0) return data
        return data.filter(item => filters.some(filter => filter.key === filter.key && filter.value === item[filter.key]))
    }, [data, filters])

    const handleSelectedItem = (item) => {
        console.log(item);
        // if item is already in filters, remove it
        if (filters.some(filter => filter.key === item.key && filter.value === item.value)) {
            setFilters(filters.filter(filter => filter.key !== item.key && filter.value !== item.value))
        } else {
            setFilters([...filters, item])
        }
    }

    
    
    return (
        <>
            <PageHeader title="Information Map" />
            
            <section className="mt-6 flex flex-col gap-6">
                <DataTable data={filteredData} fieldsConfig={InformationMapTableFieldsConfig} title="Information Map" />
            </section>
            
        </>
    )
}