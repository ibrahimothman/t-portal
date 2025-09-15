// src/api/cart.js
import { fetchExcel } from "./excelClient";
// import { transformApplications } from "../services/applications";



export const getCloudMigrationData = async () => {
  // 1) Load Excel
    const results = await fetchExcel("/data/applications/applications.xlsx");
    //   const transformedApplications = transformApplications(results);
    return results;
}
