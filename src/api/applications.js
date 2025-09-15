// src/api/cart.js
import { fetchExcel } from "./excelClient";
// import { transformApplications } from "../services/applications";



export const getApplications = async () => {
  // 1) Load Excel
    const results = await fetchExcel("/data/applications/applications.xlsx");
    //   const transformedApplications = transformApplications(results);

    console.log(results);
    return results;
}
