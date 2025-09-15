import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

// Convert Excel serial (1900 date system) to a JS Date (UTC)
function excelSerialToUTCDate(serial) {
  // Excel serial 1 = 1899-12-31, but JS epoch is 1970-01-01.
  // Using 25569 days between 1899-12-30 and 1970-01-01 handles the Excel 1900 leap bug.
  const ms = Math.round((serial - 25569) * 86400 * 1000);
  return new Date(ms);
}



export function toISO(v) {
  if (v == null || v === "") return null;

  // Handle object format
  if (typeof v === "object" && "y" in v && "m" in v && "d" in v) {
    return dayjs(`${v.y}-${v.m}-${v.d}`).format('DD/MM/YYYY');
  }

  // Handle Excel serial numbers
  if (typeof v === "number" && isFinite(v)) {
    return dayjs(excelSerialToUTCDate(v)).format('DD/MM/YYYY');
  }

  // Extract date part if it contains time
  const datePart = v.toString().split(' ')[0];
  
  // Check if it's likely DD/MM or MM/DD based on the day value
  const parts = datePart.split('/');
  if (parts.length === 3) {
    const first = parseInt(parts[0]);
    const second = parseInt(parts[1]);
    
    // If first number > 12, it's likely DD/MM format
    if (first > 12) {
      const formats = ['DD/MM/YYYY HH:mm', 'DD/MM/YYYY HH:mm:ss', 'DD/MM/YYYY'];
      for (const format of formats) {
        const date = dayjs(v, format, true);
        if (date.isValid()) return date.format('DD/MM/YYYY');
      }
    }
    // If second number > 12, it's likely MM/DD format  
    else if (second > 12) {
      const formats = ['MM/DD/YYYY HH:mm', 'MM/DD/YYYY HH:mm:ss', 'MM/DD/YYYY'];
      for (const format of formats) {
        const date = dayjs(v, format, true);
        if (date.isValid()) return date.format('DD/MM/YYYY');
      }
    }
    // Ambiguous case (both numbers <= 12) - try DD/MM first, then MM/DD
    else {
      // Try DD/MM formats first (European standard)
      const ddmmFormats = ['DD/MM/YYYY HH:mm', 'DD/MM/YYYY HH:mm:ss', 'DD/MM/YYYY'];
      for (const format of ddmmFormats) {
        const date = dayjs(v, format, true);
        if (date.isValid()) return date.format('DD/MM/YYYY');
      }
      
      // Fallback to MM/DD formats (US standard)
      const mmddFormats = ['MM/DD/YYYY HH:mm', 'MM/DD/YYYY HH:mm:ss', 'MM/DD/YYYY'];
      for (const format of mmddFormats) {
        const date = dayjs(v, format, true);
        if (date.isValid()) return date.format('DD/MM/YYYY');
      }
    }
  }

  // Handle other common formats
  const otherFormats = [
    'YYYY-MM-DD HH:mm:ss',
    'YYYY-MM-DD HH:mm',
    'YYYY-MM-DD',
    'MM-DD-YYYY',
    'DD-MM-YYYY',
  ];

  for (const format of otherFormats) {
    const date = dayjs(v, format, true);
    if (date.isValid()) return date.format('DD/MM/YYYY');
  }

  // Final fallback: try dayjs automatic parsing
  const fallbackDate = dayjs(v);
  if (fallbackDate.isValid()) {
    return fallbackDate.format('DD/MM/YYYY');
  }

  return null;
}

export function excelSerialToDate(serial, system = "1900") {

  if (serial === null || serial === undefined || serial === "" || isNaN(serial)) {
    return dayjs(""); // creates an invalid dayjs object
  }
  // Excel has two systems:
  // - 1900 (default on Windows Excel)
  // - 1904 (default on older Mac Excel)
  const baseDate = system === "1900" ? dayjs("1900-01-01") : dayjs("1904-01-01");

  // Excel's day 1 = 1900-01-01 → need to subtract 1
  const converted = baseDate.add(serial - 1, "day");

  return converted;
}

export function getDiffBetweenDates(date1, date2) {
  console.log(date1, date2);
  const years = date1.diff(date2, 'year');
  const months = date1.diff(date2, 'month');
  const weeks = date1.diff(date2, 'week');
  const days = date1.diff(date2, 'day');

  let diffText = "";
  if (years > 0) {
    diffText = `${years} Year${years > 1 ? "s" : ""}`;
  } else if (months > 0) {
    diffText = `${months} Month${months > 1 ? "s" : ""}`;
  } else if (weeks > 0) {
    diffText = `${weeks} Week${weeks > 1 ? "s" : ""}`;
  } else {
    diffText = `${days} Day${days > 1 ? "s" : ""}`;
  }

  return diffText;


}