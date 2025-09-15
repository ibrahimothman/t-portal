// src/api/cart.js
import { fetchExcel } from "./excelClient";
// import { transformApplications } from "../services/applications";



export const getCapabilities = async () => {
  // 1) Load Excel
    const results = await fetchExcel("/data/capabilities/BusinessCapabilities.xlsx");
    //   const transformedApplications = transformApplications(results);

    // we have domin and capaBILTIES, capabioites duplciated, we need to extract ubique domains and unique assoicated capabilities
   // generate array of domains and with each domain, array of unique capabilities
   return results;
    
   
   
   
}
