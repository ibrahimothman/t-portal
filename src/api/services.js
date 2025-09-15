import { fetchExcel } from "./excelClient";

export const getServices = async () => {
    // Load Excel data
    const results = await fetchExcel("/data/services/Services.xlsx");
    
    console.log('Services data:', results);
    return results;
}
