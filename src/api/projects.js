
import { fetchExcel } from "./excelClient";
import dayjs from 'dayjs';
import { excelSerialToDate } from '../utils/dates';

export const getStrategies = async () => {
  // 1) Load Excel
    const results = await fetchExcel("/data/strategies/strategies.xlsx", 0);
    //   const transformedApplications = transformApplications(results);
    return results;
}

export const getProjects = async () => {
  // 1) Load Excel
    const results = await fetchExcel("/data/strategies/strategies.xlsx", 1);
    //   const transformedApplications = transformApplications(results);
    // select only a few attrs (status, stageName, ProjectName, projectCode, agencySector,department, projectDescription, projectCategory, startDate, endDatem strategies, applications)
    let updatedResults = results.map(row => {
      const start = excelSerialToDate(row.startDate);
      const end = excelSerialToDate(row.endDate);
    
      const startDate = start.isValid() ? start.format("DD/MM/YYYY") : null;
      const endDate = end.isValid() ? end.format("DD/MM/YYYY") : null;

    
      // Force numbers (0 if invalid)
      const startYear = start.isValid() ? start.year() : null;
      const endYear = end.isValid() ? end.year() : null;

      const displayedStartYear = startYear;

      const latestActual = row.latestActual;
      const latestTarget = row.latestTarget;

      let projectStatus = "";

      // Ensure both values are valid numbers
      if (typeof latestActual === "number" && typeof latestTarget === "number") {
        if (latestActual === latestTarget) {
          projectStatus = "On Track";     // exactly on target
        } else if (latestActual > latestTarget) {
          projectStatus = "Ahead";        // ahead of schedule
        } else {
          projectStatus = "Delayed";      // behind schedule
        }
      }
    
      return {
        status: row.status,
        stageName: row.stageName,
        projectName: row.projectName,
        projectCode: row.projectCode,
        agencySector: row.agencySector,
        department: row.department,
        projectDescription: row.projectDescription,
        projectCategory: row.projectCategory,
        startDate,
        startYear,
        displayedStartYear,
        endDate,
        endYear,
        strategies: row.strategies,
        applications: row.applications,
        budget: row.totalBudget,
        fullStageName: row.fullStageName,
        latestActual,
        latestTarget,
        projectStatus,
      };
    });


    updatedResults = updatedResults.filter(row => row.startYear != null);
    console.log("updatedResults", updatedResults.filter(row => row.projectCode == "CAS/BUF/4119/2021"));
    return updatedResults;
}

export const getStrategiesProjects = async () => {
  // 1) Load Excel
    const results = await getStrategies();

    // Add number of unique projects for each strategy
    const updatedResults = results.map(row => {
        // Split projects string by comma, trim each value, and filter out empty strings
        const projectsList = (row.Projects || '')
            .split(',')
            .map(p => p.trim())
            .filter(p => p.length > 0);
            
        // Get unique projects count
        const uniqueProjects = new Set(projectsList);
        
        return {
            ...row,
            no_projects: uniqueProjects.size
        };
    });
    
    console.log("strategiesProjects", updatedResults);
    return updatedResults;
}

export const getPojectsByCode = async (codes) => {
  // 1) Load Excel
    const results = await getProjects();
    // Split codes by comma, trim each value, and filter out empty strings
    const codesList = (codes || '')
        .split(',')
        .map(code => code.trim())
        .filter(code => code.length > 0);
    
    // Filter results to match any of the provided codes
    const filteredResults = results.filter(row => codesList.includes(row.projectCode));
    console.log("filteredResults", filteredResults);
    return filteredResults;
}
