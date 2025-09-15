// src/api/cart.js
import { fetchExcel } from "./excelClient";
// import { transformApplications } from "../services/applications";



export const getProcesses = async () => {
  // 1) Load Excel
    const results = await fetchExcel("/data/processes/Processes.xlsx");
    //   const transformedApplications = transformApplications(results);

    console.log(results);
    return results;
}
