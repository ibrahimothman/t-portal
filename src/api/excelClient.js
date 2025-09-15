import * as XLSX from "xlsx";

export async function fetchExcel(path, sheet=0) {
    // 1) Load Excel
    const res = await fetch(path);
    const arrayBuffer = await res.arrayBuffer();
    const wb = XLSX.read(arrayBuffer, { type: "array" });
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[sheet]], { defval: "" });
    return rows;
  }