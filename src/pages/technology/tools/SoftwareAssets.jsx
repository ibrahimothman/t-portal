import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTechnologies } from '../../../api/technologies';
import PageHeader from '../../../components/PageHeader';
import StatsCard from '../../../components/StatsCard';
import DataTable from '../../../components/DataTable';
import Bar from '../../../components/charts/Bar';
import Pie from '../../../components/charts/Pie';
import { Box, Chip } from '@mui/material';
import { Banknote, Filter, X as XIcon, AlertTriangle, Bell, Package, DollarSign, Percent, ShieldAlert, Shield, ClipboardList, Check, X as CloseIcon } from 'lucide-react';
import dayjs from 'dayjs';

function flattenTreeToPathMap(node, path = [], map = new Map()) {
  if (!node) return map;
  if (node.type === 'product') {
    map.set(node.name, path.slice());
  }
  if (node.children) {
    for (const child of node.children) flattenTreeToPathMap(child, [...path, node.name !== 'root' ? node.name : null].filter(Boolean), map);
  }
  return map;
}

function findChildrenAtPath(tree, pathSegments) {
  let current = tree;
  for (const seg of pathSegments) {
    const next = (current.children || []).find(c => c.name === seg);
    if (!next) return [];
    current = next;
  }
  return current.children || [];
}

export default function SoftwareAssets() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ raw: [], domainTree: null, tableRows: [], productSummary: [] });

  const [search, setSearch] = useState('');
  const [path, setPath] = useState([]); // domain drilldown path
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');

  const [filters, setFilters] = useState({
    eos: '',
    eol: '',
    lifecycle: '',
  });

  const [appsModal, setAppsModal] = useState(null); // { technology, applications }
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [isVendorsOpen, setIsVendorsOpen] = useState(false);
  const [isVendorsSheetVisible, setIsVendorsSheetVisible] = useState(false);
  const [notificationsQueue, setNotificationsQueue] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);
  const [notifVisible, setNotifVisible] = useState(false);
  const [contractsModal, setContractsModal] = useState(null); // { contracts }
  const [riskDetailModal, setRiskDetailModal] = useState(null); // { row, risks }
  const [impactedAppsModal, setImpactedAppsModal] = useState(false);
  const [impactedFilters, setImpactedFilters] = useState({
    riskType: 'all',
    BusinessAgencyOwner: '',
    technicalAgencyOwner: '',
    criticality: '',
    search: ''
  });
  const [riskYear, setRiskYear] = useState('');
  const [vendorSearch, setVendorSearch] = useState('');

  useEffect(() => {
    getTechnologies().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const productPathMap = useMemo(() => flattenTreeToPathMap(data.domainTree), [data.domainTree]);

  // Risk index extracted from raw rows
  const riskIndex = useMemo(() => {
    const map = new Map();
    const rows = Array.isArray(data.raw) ? data.raw : [];
    for (const r of rows) {
      const product = String(r.Product ?? r.product ?? '').trim();
      const version = String(r.Version ?? r.version ?? '').trim();
      const vendor = String(r.Vendor ?? r.vendor ?? '').trim();
      const id = `${product}__${version}`;
      if (!map.has(id)) map.set(id, { vendor, hasVulnerability: false, isLicensed: undefined, contracts: [], risks: new Set() });
      const entry = map.get(id);
      const keys = Object.keys(r || {});
      for (const k of keys) {
        const lk = k.toLowerCase();
        const v = r[k];
        if (/vuln|cve|security\s*risk|security_issue|security/.test(lk)) {
          const truthy = typeof v === 'number' ? v > 0 : typeof v === 'string' ? v.trim() !== '' && v.trim() !== '0' && !/^no$/i.test(v) && !/^false$/i.test(v) : !!v;
          if (truthy) {
            entry.hasVulnerability = true;
            entry.risks.add('Vulnerability');
          }
        }
        if (/license(d)?|licen/.test(lk)) {
          if (typeof v === 'string') {
            if (/^(yes|valid|active)$/i.test(v)) entry.isLicensed = true;
            if (/^(no|expired|inactive)$/i.test(v)) entry.isLicensed = false;
          } else if (typeof v === 'boolean') {
            entry.isLicensed = v;
          }
        }
      }
      const nameKey = keys.find(k => /contract.*(name|title)/i.test(k));
      const codeKey = keys.find(k => /contract.*(code|id|number|no)/i.test(k));
      const expiryKey = keys.find(k => /(expiry|expiration|end).*date/i.test(k));
      if (nameKey || codeKey || expiryKey) {
        entry.contracts.push({
          name: (nameKey && r[nameKey]) || '',
          code: (codeKey && r[codeKey]) || '',
          expiryDate: (expiryKey && r[expiryKey]) || ''
        });
      }
    }
    return map;
  }, [data.raw]);

  // Badge items to render
  const badgeItems = useMemo(() => {
    if (!data.domainTree) return [];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      // Show matching products across any domain, count = #versions
      return (data.domainTree.children || []) && Array.from(productPathMap.keys())
        .filter(p => p.toLowerCase().includes(q))
        .map(p => ({ type: 'product', name: p, count: (data.tableRows || []).filter(r => r.product === p).length, highlighted: selectedProduct === p }));
    }
    // No search: show next children of current path
    const children = findChildrenAtPath(data.domainTree, path);
    return children.map(child => ({
      type: child.type,
      name: child.name,
      count: child.type === 'product' ? (child.versionCount || 0) : (child.children ? child.children.length : 0),
      highlighted: selectedProduct && child.type === 'product' && child.name === selectedProduct,
    }));
  }, [data.domainTree, data.tableRows, path, search, productPathMap]);

  // Filtered table rows
  const filteredRows = useMemo(() => {
    let rows = data.tableRows || [];
    if (selectedProduct) rows = rows.filter(r => r.product === selectedProduct);
    if (selectedVendor) rows = rows.filter(r => r.vendor === selectedVendor);

    // Date filters: eos/eol as YYYY-MM-DD strings; rows hold free-form dates, accept same string or ISO
    if (filters.eos) rows = rows.filter(r => (r.eosDate || '').includes(filters.eos) || (r.eosDate || '').slice(0,10) === filters.eos);
    if (filters.eol) rows = rows.filter(r => (r.eolDate || '').includes(filters.eol) || (r.eolDate || '').slice(0,10) === filters.eol);
    if (filters.lifecycle) rows = rows.filter(r => (r.lifecycleStatus || '').toLowerCase() === filters.lifecycle.toLowerCase());
    if (riskYear) {
      rows = rows.filter(r => {
        const status = String(r.lifecycleStatus || '').toLowerCase();
        const eosYearMatch = (r.eosDate || '').includes(riskYear);
        const eolYearMatch = (r.eolDate || '').includes(riskYear);
        const isObsoleteInYear = /obsolete/.test(status) && eolYearMatch;
        const isEosInYear = /reached\s*end\s*of\s*support/.test(status) && eosYearMatch;
        return isObsoleteInYear || isEosInYear;
      });
    }
    return rows;
  }, [data.tableRows, selectedProduct, filters, selectedVendor, riskYear]);

  const totalTechnologies = useMemo(() => filteredRows.length, [filteredRows]);
  const totalApplications = useMemo(() => filteredRows.reduce((s, r) => s + (r.applicationsCount || 0), 0), [filteredRows]);
  const totalProducts = useMemo(() => new Set(filteredRows.map(r => r.product).filter(Boolean)).size, [filteredRows]);
  const totalVendors = useMemo(() => new Set(filteredRows.map(r => r.vendor).filter(Boolean)).size, [filteredRows]);
  const obsoleteCount = useMemo(() => filteredRows.filter(r => /obsolete/i.test(r.lifecycleStatus || '')).length, [filteredRows]);
  const reachedEosCount = useMemo(() => filteredRows.filter(r => /reached\s*end\s*of\s*support/i.test(r.lifecycleStatus || '')).length, [filteredRows]);
  const [showCharts, setShowCharts] = useState(false);

  // Spend, usage and vendors
  const totalSpend = useMemo(() => {
    let sum = 0;
    for (const r of filteredRows) {
      const keys = Object.keys(r || {});
      for (const k of keys) {
        if (/spend|cost|amount|value/i.test(k)) {
          const num = Number(r[k]);
          if (!Number.isNaN(num)) sum += num;
        }
      }
    }
    return sum;
  }, [filteredRows]);

  const percentUsage = useMemo(() => {
    const products = new Set(filteredRows.map(r => r.product).filter(Boolean));
    if (products.size === 0) return 0;
    const used = new Set(filteredRows.filter(r => (r.applicationsCount || 0) > 0).map(r => r.product).filter(Boolean));
    return Math.round((used.size / products.size) * 100);
  }, [filteredRows]);

  const vendorBadges = useMemo(() => {
    const map = new Map();
    (data.tableRows || []).forEach(r => {
      const v = r.vendor || '—';
      map.set(v, (map.get(v) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [data.tableRows]);

  const expiredContracts = useMemo(() => {
    const out = [];
    const today = dayjs();
    for (const [id, entry] of riskIndex.entries()) {
      for (const c of entry.contracts) {
        const d = c.expiryDate ? dayjs(c.expiryDate) : null;
        const yearOk = riskYear ? (d && d.isValid() && d.year() === Number(riskYear)) : true;
        if (d && d.isValid() && d.isBefore(today) && yearOk) {
          out.push({ ...c, techId: id, vendor: entry.vendor });
        }
      }
    }
    return out;
  }, [riskIndex, riskYear]);

  const vulnerableCount = useMemo(() => {
    let cnt = 0;
    for (const r of filteredRows) {
      const id = `${r.product}__${r.version}`;
      const entry = riskIndex.get(id);
      if (entry?.hasVulnerability) cnt += 1;
    }
    return cnt;
  }, [filteredRows, riskIndex]);

  // Years available (from EOS/EOL)
  const availableRiskYears = useMemo(() => {
    const years = new Set();
    for (const r of (data.tableRows || [])) {
      const eol = r.eolDate || '';
      const eos = r.eosDate || '';
      const y1 = (eol.match(/\d{4}/) || [])[0];
      const y2 = (eos.match(/\d{4}/) || [])[0];
      if (y1) years.add(y1);
      if (y2) years.add(y2);
    }
    return Array.from(years).sort((a,b) => Number(b) - Number(a));
  }, [data.tableRows]);

  const riskYearsRange = useMemo(() => {
    if (!availableRiskYears || availableRiskYears.length === 0) return [];
    const numeric = availableRiskYears.map((y) => Number(y)).filter((n) => !Number.isNaN(n));
    if (numeric.length === 0) return [];
    const min = Math.min(...numeric);
    const max = Math.max(...numeric);
    const out = [];
    for (let y = min; y <= max; y += 1) out.push(String(y));
    return out;
  }, [availableRiskYears]);

  // Risk counts filtered by selected year (if any)
  const obsoleteCountYear = useMemo(() => {
    return filteredRows.filter(r => /obsolete/i.test(r.lifecycleStatus || '') && (!riskYear || (r.eolDate || '').includes(riskYear))).length;
  }, [filteredRows, riskYear]);

  const reachedEosCountYear = useMemo(() => {
    return filteredRows.filter(r => /reached\s*end\s*of\s*support/i.test(r.lifecycleStatus || '') && (!riskYear || (r.eosDate || '').includes(riskYear))).length;
  }, [filteredRows, riskYear]);

  const expiredContractsCountYear = useMemo(() => {
    if (!riskYear) return expiredContracts.length;
    return expiredContracts.filter(c => (c.expiryDate || '').includes(riskYear)).length;
  }, [expiredContracts, riskYear]);

  const impactedApplications = useMemo(() => {
    const byApp = new Map();
    const isExpired = (contracts) => (contracts || []).some(c => c.expiryDate && dayjs(c.expiryDate).isBefore(dayjs()));
    for (const r of filteredRows) {
      const id = `${r.product}__${r.version}`;
      const entry = riskIndex.get(id);
      const hasObsolete = /obsolete/i.test(r.lifecycleStatus || '') || /reached\s*end\s*of\s*support/i.test(r.lifecycleStatus || '');
      const hasVuln = !!entry?.hasVulnerability;
      const hasExpired = isExpired(entry?.contracts);
      if (!(hasObsolete || hasVuln || hasExpired)) continue;
      for (const a of (r.applications || [])) {
        if (!a?.name) continue;
        if (!byApp.has(a.name)) byApp.set(a.name, {
          name: a.name,
          BusinessAgencyOwner: r.BusinessAgencyOwner || '—',
          technicalAgencyOwner: r.technicalAgencyOwner || '—',
          technicalOwner: r.technicalOwner || a.owner || '—',
          criticality: a.criticality || '—',
          obsolete: false,
          vulnerable: false,
          expiredLicense: false
        });
        const app = byApp.get(a.name);
        app.obsolete = app.obsolete || hasObsolete;
        app.vulnerable = app.vulnerable || hasVuln;
        app.expiredLicense = app.expiredLicense || hasExpired;
      }
    }
    return Array.from(byApp.values());
  }, [filteredRows, riskIndex]);

  // Chart datasets
  const topProductsByApps = useMemo(() => {
    const map = new Map();
    filteredRows.forEach(r => {
      const key = r.product || '—';
      const add = Array.isArray(r.applications) ? r.applications.length : (r.applicationsCount || 0);
      map.set(key, (map.get(key) || 0) + add);
    });
    return Array.from(map.entries())
      .map(([label, count]) => ({ category: label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredRows]);

  const topVendorsByProducts = useMemo(() => {
    const vendorToProducts = new Map();
    filteredRows.forEach(r => {
      const vendor = r.vendor || '—';
      const product = r.product || '—';
      if (!vendorToProducts.has(vendor)) vendorToProducts.set(vendor, new Set());
      vendorToProducts.get(vendor).add(product);
    });
    return Array.from(vendorToProducts.entries())
      .map(([vendor, set]) => ({ category: vendor, count: set.size }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredRows]);

  // Insight: obsolete technology impacting most applications
  const topObsoleteImpact = useMemo(() => {
    const map = new Map();
    filteredRows.forEach(r => {
      if (/obsolete/i.test(r.lifecycleStatus || '')) {
        const tech = r.technology || r.product || '—';
        const apps = Array.isArray(r.applications) ? r.applications.length : (r.applicationsCount || 0);
        map.set(tech, (map.get(tech) || 0) + apps);
      }
    });
    const arr = Array.from(map.entries()).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
    return arr[0] || null;
  }, [filteredRows]);

  function enqueueNotification(message) {
    setNotificationsQueue((q) => [...q, { id: Date.now() + Math.random(), message }]);
  }

  useEffect(() => {
    if (!activeNotification && notificationsQueue.length > 0) {
      const next = notificationsQueue[0];
      setActiveNotification(next);
      setNotificationsQueue((q) => q.slice(1));
      requestAnimationFrame(() => setNotifVisible(true));
      const hideTimer = setTimeout(() => {
        setNotifVisible(false);
        setTimeout(() => setActiveNotification(null), 250);
      }, 4000);
      return () => clearTimeout(hideTimer);
    }
  }, [activeNotification, notificationsQueue]);

  const fieldsConfig = useMemo(() => ({
    technology: { headerName: 'Technology' },
    vendor: { headerName: 'Vendor' },
    releaseDate: { headerName: 'Release Date' },
    eosDate: { headerName: 'EOS'},
    eolDate: { headerName: 'EOL' },
    lifecycleStatus: {
      headerName: 'Status',
      renderCell: (params) => {
        const value = params.value || '';
        const color = /obsolete/i.test(value)
          ? 'bg-rose-50 text-rose-700 ring-rose-600/20'
          : /reached\s*end\s*of\s*support/i.test(value)
            ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
            : /no\s*information\s*available/i.test(value)
              ? 'bg-gray-100 text-gray-700 ring-gray-500/20'
              : 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
            

        return (
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ring-1 ring-inset ${color}`}>{value || '—'}</span>
        );
      }
    },
    vulnerable: {
      headerName: 'Vulnerability',
      renderCell: (params) => {
        const row = params.row;
        const id = `${row.product}__${row.version}`;
        const v = riskIndex.get(id)?.hasVulnerability;
        return (
          <button onClick={() => setRiskDetailModal({ row, risks: riskIndex.get(id) })} className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50">
            {v ? <ShieldAlert size={14} className="text-rose-600" /> : <Shield size={14} className="text-emerald-600" />}
          </button>
        );
      }
    },
    licensed: {
      headerName: 'Licensed',
      renderCell: (params) => {
        const row = params.row;
        const id = `${row.product}__${row.version}`;
        const lic = riskIndex.get(id)?.isLicensed;
        const label = lic === undefined ? '—' : lic ? 'Yes' : 'No';
        return (
          <button onClick={() => setRiskDetailModal({ row, risks: riskIndex.get(id) })} className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50">
            {label}
          </button>
        );
      }
    },
    applicationsCount: {
      headerName: '# Applications',
      renderCell: (params) => {
        const row = params.row;
        const count = row.applicationsCount || 0;
        return (
          <button
            onClick={() => setAppsModal({ technology: row.technology, applications: row.applications })}
            className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
          >
            {count}
          </button>
        );
      }
    },
  }), [riskIndex]);

  return (
    <>
      <div className="flex items-center justify-between">
        <PageHeader title="Software Technologies" />
        <div className="flex items-center gap-2">
        <button
            onClick={() => { setIsCategoriesOpen(true); setTimeout(() => setIsSheetVisible(true), 0); }}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Filter size={14} className={`mr-2 ${((path && path.length > 0) || !!selectedProduct) ? 'text-indigo-600' : 'text-gray-400'}`} />
            Browse Categories
            {((path && path.length > 0) || !!selectedProduct) && (
              <span className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px]">•</span>
            )}
          </button>
          {/* Browse Vendors */}
          <button
            onClick={() => { setIsVendorsOpen(true); setTimeout(() => setIsVendorsSheetVisible(true), 0); }}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Filter size={14} className={`mr-2 ${!!selectedVendor ? 'text-indigo-600' : 'text-gray-400'}`} />
            Browse Vendors
            {!!selectedVendor && (
              <span className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px]">•</span>
            )}
          </button>
          {/* Show Analytics toggle (same style as ProjectsPortfolio) */}
          <button
            onClick={() => setShowCharts(!showCharts)}
            className="inline-flex items-center gap-2 rounded-md brand-button px-4 py-2 text-sm font-medium text-white  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {showCharts ? 'Hide Analytics' : 'Show Analytics'}
            <svg 
              className={`h-4 w-4 transition-transform duration-200 ${showCharts ? 'rotate-180' : 'rotate-0'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
        </div>
      </div>


      {/* Active filters summary */}
      {(((path && path.length > 0) || !!selectedProduct || !!selectedVendor) || !!filters.lifecycle) && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          {(path && path.length > 0) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-gray-900 border border-black">
              <span>Category: {path.join(' / ')}</span>
              <button onClick={() => setPath([])} className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100">×</button>
            </span>
          )}
          {selectedProduct && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-gray-900 border border-black">
              <span>Product: {selectedProduct}</span>
              <button onClick={() => setSelectedProduct('')} className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100">×</button>
            </span>
          )}
          {selectedVendor && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-gray-900 border border-black">
              <span>Vendor: {selectedVendor}</span>
              <button onClick={() => setSelectedVendor('')} className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100">×</button>
            </span>
          )}
          {filters.lifecycle && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-gray-900 border border-black">
              <span>Lifecycle: {filters.lifecycle}</span>
              <button onClick={() => setFilters({ ...filters, lifecycle: '' })} className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100">×</button>
            </span>
          )}
          <button onClick={() => { setPath([]); setSelectedProduct(''); setSelectedVendor(''); setFilters({ ...filters, lifecycle: '' }); }} className="ml-1 inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 border border-gray-300">Clear all</button>
        </div>
      )}

      {/* Stats: 3 cards */}
      <div className="mt-6 grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-4">
          <StatsCard
            title="Total Products"
            value={totalProducts}
            icon={<Package size={16} className="text-indigo-600" />}
            subtitle="Distinct products within current selection"
          />
            </div>
        <div className="col-span-12 md:col-span-4">
              <StatsCard
            title="Total Spend"
            value={totalSpend.toLocaleString(undefined, { style: 'currency', currency: 'AED', maximumFractionDigits: 0 })}
            icon={<Banknote size={16} className="text-indigo-600" />}
            subtitle="Estimated, based on available spend fields"
              />
            </div>
        <div className="col-span-12 md:col-span-4">
              <StatsCard
            title="Usage"
            value={`${percentUsage}%`}
            icon={<Percent size={16} className="text-indigo-600" />}
            subtitle={percentUsage < 60 ? 'Under-utilized portfolio' : 'Healthy utilization'}
              />
            </div>
          </div>


       {/* Analytics */}
       <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showCharts ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
            <section className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          {!selectedVendor && !selectedProduct && (
            <>
              <div className="md:col-span-6">
                <Bar
                  title="Spend by Top Vendors"
                  subtitle="Aggregated spend across visible technologies"
                  datakey="category"
                  data={(() => {
                    const vendorSpend = new Map();
                    for (const r of filteredRows) {
                      const v = r.vendor || '—';
                      let s = 0; const keys = Object.keys(r || {});
                      for (const k of keys) { if (/spend|cost|amount|value/i.test(k)) { const num = Number(r[k]); if (!Number.isNaN(num)) s += num; } }
                      vendorSpend.set(v, (vendorSpend.get(v) || 0) + s);
                    }
                    return Array.from(vendorSpend.entries()).map(([category, count]) => ({ category, count })).sort((a,b)=>b.count-a.count).slice(0,5);
                  })()}
                  preAggregated={true}
                  needToSort={true}
                />
              </div>
              <div className="md:col-span-6">
                <Bar
                  title="Top Products by Applications"
                  subtitle="Applications count per product"
                  datakey="category"
                  data={topProductsByApps}
                  preAggregated={true}
                  needToSort={true}
                />
              </div>
            </>
          )}
          {selectedVendor && !selectedProduct && (
            <>
              <div className="md:col-span-6">
                <Bar
                  title="Top Products by Applications"
                  subtitle={`Products from ${selectedVendor}`}
                  datakey="category"
                  data={topProductsByApps}
                  preAggregated={true}
                  needToSort={true}
                />
              </div>
              <div className="md:col-span-6">
                <Pie
                  title="Vendor Usage"
                  subtitle={`Applications using ${selectedVendor} vs total (120)`}
                  datakey="label"
                  data={(() => {
                    const TOTAL = 120;
                    const appsUsingVendor = new Set();
                    // Use RAW rows to count unique applications across all occurrences
                    for (const row of (data.raw || [])) {
                      const vendor = String(row['Vendor'] ?? row.vendor ?? '');
                      if (vendor === selectedVendor) {
                        const appName = String(row['Application Name'] ?? row.applicationName ?? '').trim();
                        if (appName) appsUsingVendor.add(appName);
                      }
                    }
                    const used = appsUsingVendor.size;
                    const notUsed = Math.max(TOTAL - used, 0);
                    return [
                      { label: 'Using vendor', value: used },
                      { label: 'Not using vendor', value: notUsed },
                    ];
                  })()}
                  preAggregated={true}
                />
              </div>
            </>
          )}
          {selectedProduct && (
            <div className="md:col-span-12">
              <div className="w-full rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900">{selectedProduct} Versions Timeline</h3>
                <p className="text-sm text-gray-600 mb-4">All versions with obsolete year (EOL) and dependent applications</p>
                <div className="flex flex-col gap-4">
                  {(() => {
                    const raw = Array.isArray(data.raw) ? data.raw : [];
                    const byVersion = new Map(); // version -> { release, eos, eol }
                    raw.forEach(r => {
                      if (String(r.Product ?? r.product ?? '') !== selectedProduct) return;
                      const v = String(r.Version ?? r.version ?? '').trim();
                      const release = r['Release Date'] ?? r['Realease Date'] ?? r.releaseDate;
                      const eos = r['EOS Date'] ?? r.eosDate;
                      const eol = r['EOL Date'] ?? r.eolDate;
                      if (!byVersion.has(v)) byVersion.set(v, { release, eos, eol });
                      else {
                        const cur = byVersion.get(v);
                        byVersion.set(v, {
                          release: cur.release || release,
                          eos: cur.eos || eos,
                          eol: cur.eol || eol,
                        });
                      }
                    });

                    // applications per version from aggregated table
                    const appsPerVersion = new Map();
                    (data.tableRows || []).forEach(tr => {
                      if (tr.product === selectedProduct) {
                        const v = String(tr.version || '');
                        const count = Array.isArray(tr.applications) ? tr.applications.length : (tr.applicationsCount || 0);
                        appsPerVersion.set(v, (appsPerVersion.get(v) || 0) + count);
                      }
                    });

                    const items = Array.from(byVersion.entries()).map(([ver, dates]) => {
                      const eolYear = String(dates.eol || '').match(/\b(\d{4})\b/);
                      const eosYear = String(dates.eos || '').match(/\b(\d{4})\b/);
                      const apps = appsPerVersion.get(ver) || 0;
                      return { ver, release: dates.release, eos: dates.eos, eol: dates.eol, eolYear: eolYear ? eolYear[1] : '—', eosYear: eosYear ? eosYear[1] : '—', apps };
                    })
                    // sort: by EOL year desc, then version asc
                    .sort((a,b) => {
                      const ay = Number(a.eolYear) || 0; const by = Number(b.eolYear) || 0;
                      if (ay !== by) return ay - by; // ascending year
                      return String(a.ver).localeCompare(String(b.ver));
                    });

                    if (items.length === 0) return (
                      <div className="text-sm text-gray-500">No versions found</div>
                    );

                    return items.map((row) => (
                      <div key={row.ver || '—'} className="flex items-center gap-4">
                        <div className="w-28 text-sm font-medium text-gray-800">v{row.ver || '—'}</div>
                        <div className="flex-1 flex items-center gap-3">
                          <div className="inline-flex items-center gap-1 text-xs text-gray-700">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                            <span>{row.release || '—'}</span>
                          </div>
                          <div className="inline-flex items-center gap-1 text-xs text-gray-700">
                            <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                            <span>EOS: {row.eos || '—'}</span>
                          </div>
                          <div className="inline-flex items-center gap-1 text-xs text-gray-700">
                            <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
                            <span>Obsolete: {row.eolYear}</span>
                          </div>
                        </div>
                        <div className="w-40 text-xs text-gray-700">Apps: {row.apps}</div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          )}
            </section>
          </div>

      

      {/* Filters */}
      {/* Inline filters moved next to table toolbar */}

      {/* Table + Risks side panel */}
      <section className="mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9">
          <DataTable
            data={filteredRows}
            fieldsConfig={fieldsConfig}
            title="Technologies Inventory"
            searchPlaceholder="Search by product or vendor"
            toolbarExtras={
              <div className="flex items-center gap-2">
              <select value={filters.lifecycle} onChange={(e) => setFilters({ ...filters, lifecycle: e.target.value })} className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:outline-none" aria-label="Filter by lifecycle status">
                <option value="">All Lifecycle</option>
                <option value="Obsolete">Obsolete</option>
                <option value="Reached End of Support">Reached End of Support</option>
                <option value="Active">Active</option>
                <option value="No Information Available">No Information Available</option>
              </select>
              </div>
            }
          />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <div className="flex flex-col gap-3 lg:sticky lg:top-[88px] self-start">
            {/* Risks header with year filter */}
            <div className="flex items-center justify-between mt-[0px] min-h-[52px]">
              <h3 className="text-base font-medium text-gray-900">Technology Risks</h3>
              <select value={riskYear} onChange={(e) => setRiskYear(e.target.value)} className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:outline-none">
                <option value="">All years</option>
                {riskYearsRange.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button onClick={() => setFilters({ ...filters, lifecycle: filters.lifecycle === 'Obsolete' ? '' : 'Obsolete' })} className={`rounded-lg border p-4 text-left transition-opacity ${filters.lifecycle === 'Obsolete' ? 'opacity-100 border-rose-400 bg-rose-100 text-rose-900 shadow-sm' : 'opacity-70 hover:opacity-100 border-rose-200 bg-rose-50 text-rose-700'}`}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Obsolete technologies</div>
                <AlertTriangle size={16} className="text-rose-600" />
              </div>
              <div className="mt-1 text-2xl font-semibold">{riskYear ? filteredRows.filter(r => /obsolete/i.test(r.lifecycleStatus || '') && (r.eolDate || '').includes(riskYear)).length : obsoleteCount}</div>
            </button>
            <button onClick={() => setFilters({ ...filters, lifecycle: filters.lifecycle === 'Reached End of Support' ? '' : 'Reached End of Support' })} className={`rounded-lg border p-4 text-left transition-opacity ${filters.lifecycle === 'Reached End of Support' ? 'opacity-100 border-amber-400 bg-amber-100 text-amber-900 shadow-sm' : 'opacity-70 hover:opacity-100 border-amber-200 bg-amber-50 text-amber-800'}`}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Reached end of support</div>
                <AlertTriangle size={16} className="text-amber-600" />
              </div>
              <div className="mt-1 text-2xl font-semibold">{riskYear ? filteredRows.filter(r => /reached\s*end\s*of\s*support/i.test(r.lifecycleStatus || '') && (r.eosDate || '').includes(riskYear)).length : reachedEosCount}</div>
            </button>
            <button onClick={() => setContractsModal({ contracts: expiredContracts })} className="text-left rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700 hover:bg-rose-100">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Expired license contracts</div>
                <ClipboardList size={16} className="text-rose-600" />
              </div>
              <div className="mt-1 text-2xl font-semibold">{riskYear ? expiredContracts.filter(c => (c.expiryDate || '').includes(riskYear)).length : expiredContracts.length}</div>
            </button>
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Vulnerable technologies</div>
                <ShieldAlert size={16} className="text-rose-600" />
              </div>
              <div className="mt-1 text-2xl font-semibold">{vulnerableCount}</div>
            </div>
            <button onClick={() => setImpactedAppsModal(true)} className="mt-1 rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-indigo-800 hover:bg-indigo-100 text-left">
              <div className="flex items-center justify-between">
                
                <div className="text-sm font-medium">
                  Total impacted applications
                </div>
                <ClipboardList size={16} className="text-indigo-700" />

              </div>
              <div className="mt-1 text-2xl font-semibold text-left">{impactedApplications.length}</div>
            </button>
          </div>
        </div>
        </section>

      

      {/* Categories Sheet */}
      {isCategoriesOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/30" onClick={() => { setIsSheetVisible(false); setTimeout(() => setIsCategoriesOpen(false), 200); }} />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[340px] md:w-[440px] lg:w-[520px] bg-white shadow-2xl border-l border-gray-200 flex flex-col" style={{ transform: isSheetVisible ? 'translateX(0%)' : 'translateX(100%)', transition: 'transform 200ms ease-in-out' }}>
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div className="text-sm font-semibold text-gray-900">Technology Categories</div>
              <button onClick={() => { setIsSheetVisible(false); setTimeout(() => setIsCategoriesOpen(false), 200); }} className="rounded-md p-1 text-gray-500 hover:bg-gray-50" aria-label="Close categories">✕</button>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="h-8 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:outline-none"
                />
                {(path.length > 0 || selectedProduct) && (
                  <button
                    onClick={() => { setPath([]); setSelectedProduct(''); setSearch(''); }}
                    className="ml-auto inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <XIcon size={12} />
                    Clear all
                  </button>
                )}
              </div>
              {((path && path.length > 0) || !!selectedProduct) && (
                <div className="text-xs text-gray-600">
                  <div className="flex flex-wrap items-center gap-1">
                    <button className="text-indigo-600 hover:text-indigo-700" onClick={() => { setPath([]); setSelectedProduct(''); }}>All categories</button>
                    {path.map((seg, idx) => (
                      <span key={`${seg}-${idx}`} className="inline-flex items-center gap-1">
                        <span className="text-gray-400">/</span>
                        <button className="text-indigo-600 hover:text-indigo-700" onClick={() => { setPath(path.slice(0, idx + 1)); setSelectedProduct(''); }}>{seg}</button>
                      </span>
                    ))}
                    {selectedProduct && (
                      <span className="inline-flex items-center gap-1">
                        <span className="text-gray-400">/</span>
                        <button className="text-indigo-600 hover:text-indigo-700" onClick={() => setSelectedProduct('')}>{selectedProduct}</button>
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-1 flex flex-wrap gap-2">
                {badgeItems.map((b) => (
                  <button
                    key={`${b.type}-${b.name}`}
                    onClick={() => {
                      if (b.type === 'domain') {
                        if (path[path.length - 1] === b.name) {
                          setPath(path.slice(0, -1));
                        } else {
                          setPath([...path, b.name]);
                        }
                      } else if (b.type === 'product') {
                        setSelectedProduct(prev => prev === b.name ? '' : b.name);
                        if (search.trim() && productPathMap.has(b.name)) {
                          setPath(productPathMap.get(b.name));
                        }
                        setSearch('');
                      }
                    }}
                    aria-pressed={b.highlighted ? 'true' : 'false'}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${b.highlighted ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    <span>{b.name}</span>
                    <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-700">{b.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Vendors Sheet */}
      {isVendorsOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/30" onClick={() => { setIsVendorsSheetVisible(false); setTimeout(() => setIsVendorsOpen(false), 200); }} />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[340px] md:w-[440px] lg:w-[520px] bg-white shadow-2xl border-l border-gray-200 flex flex-col" style={{ transform: isVendorsSheetVisible ? 'translateX(0%)' : 'translateX(100%)', transition: 'transform 200ms ease-in-out' }}>
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div className="text-sm font-semibold text-gray-900">Vendors</div>
              <button onClick={() => { setIsVendorsSheetVisible(false); setTimeout(() => setIsVendorsOpen(false), 200); }} className="rounded-md p-1 text-gray-500 hover:bg-gray-50" aria-label="Close vendors">✕</button>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  placeholder="Search vendors..."
                  className="h-8 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:outline-none"
                />
                {(selectedVendor || vendorSearch) && (
                  <button
                    onClick={() => { setSelectedVendor(''); setVendorSearch(''); }}
                    className="ml-auto inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <XIcon size={12} />
                    Clear all
                  </button>
                )}
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                {vendorBadges.filter(b => !vendorSearch || String(b.name || '').toLowerCase().includes(vendorSearch.toLowerCase())).map((b) => (
                  <button
                    key={`vendor-${b.name}`}
                    onClick={() => setSelectedVendor(prev => prev === b.name ? '' : b.name)}
                    aria-pressed={selectedVendor === b.name ? 'true' : 'false'}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${selectedVendor === b.name ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    <span>{b.name}</span>
                    <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-700">{b.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Notifications (bottom-right) */}
      <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
        {activeNotification && (
          <div
            className={`pointer-events-auto w-80 max-w-[90vw] transform rounded-lg border border-gray-200 bg-white p-3 shadow-lg transition-all duration-200 ease-out ${notifVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-2">
              <div className="mt-[2px]">
                <AlertTriangle size={16} className="text-amber-600" />
              </div>
              <div className="flex-1 text-sm text-gray-800">{activeNotification.message}</div>
              <button
                onClick={() => { setNotifVisible(false); setTimeout(() => setActiveNotification(null), 200); }}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Applications modal */}
      {appsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setAppsModal(null)} />
          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
              <h3 className="text-sm font-semibold text-gray-900">Applications using {appsModal.technology}</h3>
              <button onClick={() => setAppsModal(null)} className="rounded-md p-1 text-gray-500 hover:bg-gray-50">✕</button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5 text-sm">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-gray-600">
                  <tr>
                    <th className="py-2">Name</th>
                    <th className="py-2">Technical Owner</th>
                    <th className="py-2">Criticality</th>
                  </tr>
                </thead>
                <tbody>
                  {appsModal.applications && appsModal.applications.length > 0 ? (
                    appsModal.applications.map((a, idx) => (
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="py-2">
                          <button
                            onClick={() => navigate(`/technology/business-applications?application_name=${encodeURIComponent(a.name)}`)}
                            className="text-indigo-600 hover:text-indigo-700"
                          >
                            {a.name}
                          </button>
                        </td>
                        <td className="py-2">{a.owner || '—'}</td>
                        <td className="py-2">{a.criticality || '—'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-gray-500">No applications</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-3">
              <button onClick={() => setAppsModal(null)} className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
      {/* Contracts modal */}
      {contractsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setContractsModal(null)} />
          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
              <h3 className="text-sm font-semibold text-gray-900">Expired License Contracts</h3>
              <button onClick={() => setContractsModal(null)} className="rounded-md p-1 text-gray-500 hover:bg-gray-50">✕</button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5 text-sm">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-gray-600">
                  <tr>
                    <th className="py-2">Name</th>
                    <th className="py-2">Code</th>
                    <th className="py-2">Expiry Date</th>
                    <th className="py-2">Vendor</th>
                  </tr>
                </thead>
                <tbody>
                  {contractsModal.contracts && contractsModal.contracts.length > 0 ? (
                    contractsModal.contracts.map((c, idx) => (
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="py-2">{c.name || '—'}</td>
                        <td className="py-2">{c.code || '—'}</td>
                        <td className="py-2">{c.expiryDate || '—'}</td>
                        <td className="py-2">{c.vendor || '—'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-500">No expired contracts found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-3">
              <button onClick={() => setContractsModal(null)} className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Risk detail modal */}
      {riskDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setRiskDetailModal(null)} />
          <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
              <h3 className="text-sm font-semibold text-gray-900">Technology details</h3>
              <button onClick={() => setRiskDetailModal(null)} className="rounded-md p-1 text-gray-500 hover:bg-gray-50">✕</button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto p-5 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Technology</div>
                  <div className="font-medium text-gray-900">{riskDetailModal.row?.technology || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Product / Version</div>
                  <div className="font-medium text-gray-900">{riskDetailModal.row?.product || '—'} / {riskDetailModal.row?.version || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Vendor</div>
                  <div className="font-medium text-gray-900">{riskDetailModal.row?.vendor || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Lifecycle</div>
                  <div className="font-medium text-gray-900">{riskDetailModal.row?.lifecycleStatus || '—'}</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-1">Risks</div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs">
                    Vulnerability: {riskDetailModal.risks?.hasVulnerability ? <Check size={14} className="text-emerald-600" /> : <CloseIcon size={14} className="text-rose-600" />}
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs">
                    Licensed: {riskDetailModal.risks?.isLicensed === undefined ? '—' : riskDetailModal.risks?.isLicensed ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <div className="text-sm font-semibold text-gray-900 mb-2">Using applications</div>
                <div className="border border-gray-200 rounded-lg">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs text-gray-600">
                      <tr>
                        <th className="py-2 px-3">Name</th>
                        <th className="py-2 px-3">Owner</th>
                        <th className="py-2 px-3">Criticality</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(riskDetailModal.row?.applications || []).map((a, idx) => (
                        <tr key={idx} className="border-t border-gray-100">
                          <td className="py-2 px-3">
                            <button onClick={() => navigate(`/technology/business-applications?application_name=${encodeURIComponent(a.name)}`)} className="text-indigo-600 hover:text-indigo-700">{a.name}</button>
                          </td>
                          <td className="py-2 px-3">{a.owner || '—'}</td>
                          <td className="py-2 px-3">{a.criticality || '—'}</td>
                        </tr>
                      ))}
                      {!(riskDetailModal.row?.applications || []).length && (
                        <tr><td colSpan={3} className="py-4 text-center text-gray-500">No applications</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-3">
              <button onClick={() => setRiskDetailModal(null)} className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Impacted applications modal */}
      {impactedAppsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setImpactedAppsModal(false)} />
          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
              <h3 className="text-sm font-semibold text-gray-900">Impacted Applications</h3>
              <button onClick={() => setImpactedAppsModal(false)} className="rounded-md p-1 text-gray-500 hover:bg-gray-50">✕</button>
            </div>
            <div className="p-5 text-sm">
              {(() => {
                const unique = (key) => Array.from(new Set((impactedApplications || []).map(a => String(a[key] || '').trim()).filter(v => v && v !== '—'))).sort((a,b) => a.localeCompare(b));
                const filteredImpacted = (impactedApplications || [])
                  .filter(a => impactedFilters.riskType === 'all' || (impactedFilters.riskType === 'obsolete' && a.obsolete) || (impactedFilters.riskType === 'vulnerability' && a.vulnerable) || (impactedFilters.riskType === 'contract' && a.expiredLicense))
                  .filter(a => !impactedFilters.BusinessAgencyOwner || a.BusinessAgencyOwner === impactedFilters.BusinessAgencyOwner)
                  .filter(a => !impactedFilters.technicalAgencyOwner || a.technicalAgencyOwner === impactedFilters.technicalAgencyOwner)
                  .filter(a => !impactedFilters.criticality || a.criticality === impactedFilters.criticality)
                  .filter(a => !impactedFilters.search || String(a.name || '').toLowerCase().includes(impactedFilters.search.toLowerCase()));

                return (
                  <>
                    <div className="flex flex-col gap-2 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <select value={impactedFilters.BusinessAgencyOwner} onChange={(e) => setImpactedFilters({ ...impactedFilters, BusinessAgencyOwner: e.target.value })} className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:outline-none">
                          <option value="">Business Owner (Agency/Sector)</option>
                          {unique('BusinessAgencyOwner').map(v => (<option key={v} value={v}>{v}</option>))}
                        </select>
                        <select value={impactedFilters.technicalAgencyOwner} onChange={(e) => setImpactedFilters({ ...impactedFilters, technicalAgencyOwner: e.target.value })} className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:outline-none">
                          <option value="">Technical Owner (Agency/Sector)</option>
                          {unique('technicalAgencyOwner').map(v => (<option key={v} value={v}>{v}</option>))}
                        </select>
                        <select value={impactedFilters.criticality} onChange={(e) => setImpactedFilters({ ...impactedFilters, criticality: e.target.value })} className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:outline-none">
                          <option value="">Criticality</option>
                          {unique('criticality').map(v => (<option key={v} value={v}>{v}</option>))}
                        </select>
                        <select value={impactedFilters.riskType} onChange={(e) => setImpactedFilters({ ...impactedFilters, riskType: e.target.value })} className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:outline-none">
                          <option value="all">All risks</option>
                          <option value="obsolete">Obsolete</option>
                          <option value="vulnerability">Vulnerability</option>
                          <option value="contract">Expired license</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <input value={impactedFilters.search} onChange={(e) => setImpactedFilters({ ...impactedFilters, search: e.target.value })} placeholder="Search..." className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:outline-none w-full" />
                      </div>
                    </div>
                    <div className="max-h-[65vh] overflow-y-auto overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="text-xs text-gray-600">
                          <tr>
                            <th className="py-2">Application</th>
                            <th className="py-2 w-32 whitespace-normal leading-tight">
                              <span className="block">Business Owner</span>
                              <span className="block">(Agency/Sector)</span>
                            </th>
                            <th className="py-2 w-32 whitespace-normal leading-tight">
                              <span className="block">Technical Owner</span>
                              <span className="block">(Agency/Sector)</span>
                            </th>
                            <th className="py-2">Obsolete</th>
                            <th className="py-2">Vulnerability</th>
                            <th className="py-2">Expired License</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredImpacted.map((a, idx) => (
                            <tr key={idx} className="border-t border-gray-100">
                              <td className="py-2">
                                <button onClick={() => navigate(`/technology/business-applications?application_name=${encodeURIComponent(a.name)}`)} className="text-indigo-600 hover:text-indigo-700">{a.name}</button>
                              </td>
                              <td className="py-2">{a.BusinessAgencyOwner || '—'}</td>
                              <td className="py-2">{a.technicalAgencyOwner || '—'}</td>
                              <td className="py-2">{a.obsolete ? <Check size={14} className="text-emerald-600" /> : <CloseIcon size={14} className="text-rose-600" />}</td>
                              <td className="py-2">{a.vulnerable ? <Check size={14} className="text-emerald-600" /> : <CloseIcon size={14} className="text-rose-600" />}</td>
                              <td className="py-2">{a.expiredLicense ? <Check size={14} className="text-emerald-600" /> : <CloseIcon size={14} className="text-rose-600" />}</td>
                            </tr>
                          ))}
                          {filteredImpacted.length === 0 && (
                            <tr><td colSpan={6} className="py-6 text-center text-gray-500">No impacted applications</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">Rows: {filteredImpacted.length}</div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
