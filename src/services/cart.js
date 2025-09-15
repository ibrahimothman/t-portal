import { getDiffBetweenDates, toISO } from "../utils/dates";
import dayjs from 'dayjs';

const FIELD_MAP = {
    "requestID": "id",
    "projectName": "name",
    "DocumentType": "type",
    "currentWFStage": "stage",
    "department": "department",
    "submissionDate": "submissionDate",
    "plannedclosuredate": "planningClosureDate",
    "requestSummary": "summary",
    "priority": "priority",
    "pendingWith": "pendingReviewers",
    "agency": "agency",
    // "Actual Closure Date": "actualClosureDate",
    // "CART Response Date - Round 1": "cartResponseDate1",
    // "CART Response Date - Round 2": "cartResponseDate2",
    // "CART Response Date - Round 3": "cartResponseDate3"
    // Optional: workflow can be a JSON column or separate sheet
    //   "Workflow JSON": "workflow",
};

  
const Document_TYPE_MAP = {
    "Business Case (Support)": "BC Support",
    "Integration Touch Point": "Integration TouchPoint",
    "Business Case (Implementation Project)": "BC Implementation",
    "Solution Architecture Design (SAD)": "SAD",
    "RFP/RFQ (Implementation)": "RFP/RFQ Implementation",
    "Detailed Design (DD)": "Detailed Design",
    "System Requirement Specification (SRS)": "SRS",
    "Business Requirement Specification (BRS)": "BRS",
    "RFP/RFQ (Support/Enhancement)": "RFP/RFQ Support",
    "Advisory Service": "Advisory Service"
}


const AGENCY_MAP = {
    "Corporate Technology Support Services": "CTSS",
    "Public Transport Agency": "PTA",
    "Rail Agency": "Rail",
    "Strategy & Corporate Governance": "SCG",
    "Licensing Agency": "LA",
    "Corporate Administrative Support Services": "CASS",
    "Traffic and Roads Agency": "TRA",
    "Director General, Chairman of the Board Executive Directors": "DGO"
};


const PRE_TENDERING_STATUS= ["EA Team", "Digital Strategy", "CART"];
const POST_TENDERING_STATUS = ["Under Review Cycle 1", "Under Review Cycle 2", "Under Review Cycle 3", "Chairperson Rejection Review"]   
// merging the two arrays
const ALL_STATUS = [...PRE_TENDERING_STATUS, ...POST_TENDERING_STATUS];

/**
 * Normalize raw CART request rows coming from a spreadsheet/export.
 * - Rename fields using FIELD_MAP (ignore unknowns)
 * - Exclude rows whose original Status is in EXECLUDED_STATUS
 * - Map agency names using AGENCY_MAP
 * - Map document type using Document_TYPE_MAP
 * - Convert dates (submission, planned closing, actual closing) to ISO
 * - Derive two fields:
 *    - isDelayed: true when planned closing date passed and not closed
 *    - status: "Beyond SLA" when delayed, otherwise "Within SLA"
 *
 * @param {Array<Record<string, any>>} rows
 * @returns {Array<object>} normalized rows
 */
export function transformCartRequests(rows) {
  if (!Array.isArray(rows)) return [];

  const toIsoSafe = (value) => {
    const date = toISO(value);
    return date;
  };

  const shouldInclude = (raw) => {
    const rawStatus = (raw?.stage ??  "").toString();
    return ALL_STATUS.some(
      (s) => s.toLowerCase() === rawStatus.toLowerCase()
    );
  };


  //  I want to map the rows to the fields in the FIELD_MAP first
  const mappedRows = rows.map((row) => {
    const mapped = {};
    for (const [sourceKey, targetKey] of Object.entries(FIELD_MAP)) {
      if (row[sourceKey] !== undefined) {
        mapped[targetKey] = row[sourceKey];
      }
    }
    return mapped;
  });

  // log the mapped rows keys
  return mappedRows
    .filter((raw) => shouldInclude(raw))
    .map((raw) => {

      // 2) Agency mapping (if present on the raw row)
      const agencyFull = raw.agency ?? '';
      if (agencyFull !== undefined) {
        raw.agency = AGENCY_MAP[agencyFull] ?? agencyFull;
      }

      // 3) Document type mapping
      if (raw.type != null) {
        raw.type = Document_TYPE_MAP[raw.type] ?? raw.type;
      }

      // 4) Dates → ISO

      

      

      let submissionDate = raw.submissionDate.split(" ")[0];
      submissionDate = dayjs(raw.submissionDate, 'DD/MM/YYYY').startOf('day').format('DD/MM/YYYY');

      let planningClosureDate = raw.planningClosureDate.split(" ")[0];
      planningClosureDate = dayjs(raw.planningClosureDate, 'DD/MM/YYYY').startOf('day');

      

      

      const today = dayjs().startOf('day');
      const isDelayed = planningClosureDate.isBefore(today);

      raw.submissionDate = submissionDate;
      raw.planningClosureDate = planningClosureDate.format('DD/MM/YYYY');
      raw.status = ALL_STATUS.includes(raw.stage) && isDelayed ? "Delayed" : "In Progress";

      if (PRE_TENDERING_STATUS.includes(raw.stage)) {
        raw.stage = "Pending with CART";
      }
      
      if(raw.status == "Delayed") {    
        raw.delay = getDiffBetweenDates(today, planningClosureDate);
      }
      raw.pendingReviewers = raw.pendingReviewers.split(',').map(reviewer => reviewer.trim());
    
      

      return raw;
    });
}











