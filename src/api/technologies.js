// src/api/technologies.js
import { fetchExcel } from "./excelClient";
import dayjs from 'dayjs';
import { excelSerialToDate, toISO } from '../utils/dates';

function normalizeKey(key) {
  if (!key) return '';
  return String(key).trim().toLowerCase().replace(/\s+/g, ' ');
}

function safeString(value) {
  if (value == null) return '';
  return String(value).trim();
}

function formatExcelishToDDMMYYYY(input) {
  if (input == null || input === '') return '';
  // Use excelSerialToDate for numeric values (including numeric strings)
  const maybeNum = Number(input);
  if (!Number.isNaN(maybeNum) && Number.isFinite(maybeNum)) {
    const d = excelSerialToDate(maybeNum);
    if (d && d.isValid && d.isValid()) return d.format('DD/MM/YYYY');
  }
  // For strings or other date-like inputs, reuse toISO (already outputs DD/MM/YYYY)
  const iso = toISO(input);
  if (iso) return iso;
  // Final fallback
  const d2 = dayjs(input);
  return d2.isValid() ? d2.format('DD/MM/YYYY') : '';
}

function buildDomainTree(rows) {
  // Tree shape: { name: 'root', children: Map<string, Node> }
  const root = { name: 'root', type: 'root', children: new Map() };

  for (const row of rows) {
    const domainPathRaw = safeString(row.domain || row.Domain);
    const product = safeString(row.product || row.Product);
    const version = safeString(row.version || row.Version);

    const segments = domainPathRaw.split('/').map(s => s.trim()).filter(Boolean);
    let current = root;
    // Walk domain segments
    for (const seg of segments) {
      if (!current.children.has(seg)) {
        current.children.set(seg, { name: seg, type: 'domain', children: new Map() });
      }
      current = current.children.get(seg);
    }
    // Product level under last domain segment
    if (!current.children.has(product)) {
      current.children.set(product, { name: product, type: 'product', children: new Map(), versions: new Set() });
    }
    const productNode = current.children.get(product);
    // Version level (kept for counts, but UI stops at product)
    if (version) {
      productNode.versions.add(version);
      if (!productNode.children.has(version)) {
        productNode.children.set(version, { name: version, type: 'version' });
      }
    }
  }

  // Convert Maps/Sets to plain objects for consumption
  function serialize(node) {
    const out = { name: node.name, type: node.type };
    if (node.versions) out.versionCount = node.versions.size;
    if (node.children instanceof Map) {
      out.children = Array.from(node.children.values()).map(serialize);
    }
    return out;
  }

  return serialize(root);
}

function aggregateTechnologies(rows) {
  // Group by Product + Version
  const byTech = new Map();

  for (const r of rows) {
    const technology = safeString(r['technologyName'] ?? r.technologyName);
    const product = safeString(r.Product ?? r.product);
    const version = safeString(r.Version ?? r.version);
    const vendor = safeString(r.Vendor ?? r.vendor);
    const releaseDate = formatExcelishToDDMMYYYY(r['Realease Date'] ?? r['Release Date'] ?? r.releaseDate);
    const eosDate = formatExcelishToDDMMYYYY(r['EOS Date'] ?? r.eosDate);
    const eolDate = formatExcelishToDDMMYYYY(r['EOL Date'] ?? r.eolDate);
    const lifecycleStatus = safeString(r['Lifecycle Status'] ?? r.lifecycleStatus);
    const applicationName = safeString(r['Application Name'] ?? r.applicationName);
    const technicalOwner = safeString(r['Technical Owner'] ?? r['Technical Owner (Department)'] ?? r.technicalOwner);
    const BusinessOwner = safeString(r['Business Owner'] ?? r['Business Owner (Department)'] ?? r.BusinessOwner);
    const technicalAgencyOwner = safeString(r['Technical Agency/Sector']);
    const BusinessAgencyOwner = safeString(r['Business Agency/Sector']);
    const criticality = safeString(r['Criticaity'] ?? r['Criticality'] ?? r.criticality);

    const key = `${product}__${version}`;
    if (!byTech.has(key)) {
      byTech.set(key, {
        id: key,
        technology,
        product,
        version,
        vendor,
        releaseDate,
        eosDate,
        eolDate,
        lifecycleStatus,
        applications: [],
        technicalOwner,
        BusinessOwner,
        technicalAgencyOwner,
        BusinessAgencyOwner,
      });
    }
    const entry = byTech.get(key);
    // Prefer non-empty vendor/dates/status if missing
    if (!entry.vendor && vendor) entry.vendor = vendor;
    if (!entry.releaseDate && releaseDate) entry.releaseDate = releaseDate;
    if (!entry.eosDate && eosDate) entry.eosDate = eosDate;
    if (!entry.eolDate && eolDate) entry.eolDate = eolDate;
    if (!entry.lifecycleStatus && lifecycleStatus) entry.lifecycleStatus = lifecycleStatus;

    if (applicationName) {
      entry.applications.push({ name: applicationName, owner: technicalOwner, criticality });
    }
  }

  const tableRows = Array.from(byTech.values()).map(r => ({
    ...r,
    applicationsCount: r.applications.length,
  }));

  // Build product index for search (product -> set of versions)
  const productIndex = new Map();
  for (const row of tableRows) {
    if (!productIndex.has(row.product)) productIndex.set(row.product, new Set());
    if (row.version) productIndex.get(row.product).add(row.version);
  }
  const productSummary = Array.from(productIndex.entries()).map(([name, versions]) => ({
    name,
    versionCount: versions.size,
  }));

  return { tableRows, productSummary };
}

export const getTechnologies = async () => {
  // Load Excel
  const results = await fetchExcel('/data/technologies/technologies.xlsx');
  const rows = Array.isArray(results) ? results : [];

  const domainTree = buildDomainTree(rows);
  const { tableRows, productSummary } = aggregateTechnologies(rows);

  return {
    raw: rows,
    domainTree,
    tableRows,
    productSummary,
  };
};

export const getApplicationsTechnologies = async () => {
  // Load Excel
  const results = await fetchExcel('/data/technologies/technologies.xlsx');
  return results;
};
