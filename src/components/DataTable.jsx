import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  ExportCsv,
  ExportPrint,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  QuickFilterTrigger,
  GridActionsCellItem,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector
} from '@mui/x-data-grid';
import {
  Tooltip,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Typography,
  Box,
  Chip,
  IconButton,
  Select,
  FormControl,
  MenuItem as SelectMenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { Search, Download, Eye, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import StatusBadge from './StatusBadge';

// Modern Clean Pagination Component
function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  
  const rowCount = apiRef.current.state.pagination.rowCount || 0;
  const pageSize = apiRef.current.state.pagination.pageSize || 10;
  const currentPage = page || 0;
  
  const startRow = rowCount === 0 ? 0 : currentPage * pageSize + 1;
  const endRow = rowCount === 0 ? 0 : Math.min((currentPage + 1) * pageSize, rowCount);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageCount) {
      apiRef.current.setPage(newPage);
    }
  };

  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    if (newPageSize > 0) {
      apiRef.current.setPageSize(newPageSize);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        backgroundColor: 'transparent',
        minHeight: '56px',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Left side - Rows per page selector */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#6b7280', 
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: 'inherit',
            letterSpacing: '0.01em'
          }}
        >
          Rows per page:
        </Typography>
        <FormControl size="small" variant="outlined">
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            sx={{
              fontSize: '13px',
              fontFamily: 'inherit',
              color: '#374151',
              fontWeight: 600,
              minWidth: '70px',
              height: '32px',
              backgroundColor: 'white',
              borderRadius: '6px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e5e7eb',
                borderWidth: '1px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d1d5db',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#7c3aed',
                borderWidth: '1px',
              },
              '& .MuiSelect-select': {
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiSelect-icon': {
                color: '#9ca3af',
                fontSize: '18px',
              }
            }}
          >
            <SelectMenuItem value={5} sx={{ fontSize: '13px', fontFamily: 'inherit' }}>5</SelectMenuItem>
            <SelectMenuItem value={10} sx={{ fontSize: '13px', fontFamily: 'inherit' }}>10</SelectMenuItem>
            <SelectMenuItem value={25} sx={{ fontSize: '13px', fontFamily: 'inherit' }}>25</SelectMenuItem>
            <SelectMenuItem value={50} sx={{ fontSize: '13px', fontFamily: 'inherit' }}>50</SelectMenuItem>
            <SelectMenuItem value={100} sx={{ fontSize: '13px', fontFamily: 'inherit' }}>100</SelectMenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Right side - Page info and navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, marginLeft: 'auto', paddingLeft: 4 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#6b7280', 
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: 'inherit',
            letterSpacing: '0.01em'
          }}
        >
          {startRow}–{endRow} of {rowCount}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Previous page button */}
          <IconButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            size="small"
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              color: currentPage === 0 ? '#d1d5db' : '#6b7280',
              transition: 'all 0.15s ease-in-out',
              '&:hover': {
                backgroundColor: currentPage === 0 ? 'white' : '#f9fafb',
                borderColor: currentPage === 0 ? '#e5e7eb' : '#d1d5db',
                transform: currentPage === 0 ? 'none' : 'translateY(-1px)',
                boxShadow: currentPage === 0 ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
              },
              '&.Mui-disabled': {
                backgroundColor: 'white',
                borderColor: '#e5e7eb',
                color: '#d1d5db',
              }
            }}
          >
            <ChevronLeft size={16} strokeWidth={2} />
          </IconButton>

          {/* Next page button */}
          <IconButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= pageCount - 1 || pageCount <= 1}
            size="small"
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              color: (currentPage >= pageCount - 1 || pageCount <= 1) ? '#d1d5db' : '#6b7280',
              transition: 'all 0.15s ease-in-out',
              '&:hover': {
                backgroundColor: (currentPage >= pageCount - 1 || pageCount <= 1) ? 'white' : '#f9fafb',
                borderColor: (currentPage >= pageCount - 1 || pageCount <= 1) ? '#e5e7eb' : '#d1d5db',
                transform: (currentPage >= pageCount - 1 || pageCount <= 1) ? 'none' : 'translateY(-1px)',
                boxShadow: (currentPage >= pageCount - 1 || pageCount <= 1) ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
              },
              '&.Mui-disabled': {
                backgroundColor: 'white',
                borderColor: '#e5e7eb',
                color: '#d1d5db',
              }
            }}
          >
            <ChevronRight size={16} strokeWidth={2} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

const CustomDataGrid = styled(DataGrid)(() => ({
  border: 0,
  width: '100% !important',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

  '& .MuiDataGrid-main': {
    border: '1px solid #e5e7eb', // border-gray-200 equivalent
    borderRadius: '8px'
  },
  '& .MuiDataGrid-toolbar':{
    border: 'none', // border-gray-200 equivalent
    padding:'0 !important',
  },
  '& .MuiDataGrid-footerContainer':{
    border: 'none', // border-gray-200 equivalent
  },
  // Remove width overrides that can desync header/body widths
  '& .MuiDataGrid-columnHeaders': {
    minHeight: '40px !important',
    maxHeight: '40px !important',
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#f9fafb',
    minHeight: '40px !important',
    maxHeight: '40px !important',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f3f4f6', // hover:bg-gray-100 equivalent
    },
  },
  // Remove blue focus outline on header and cells
  '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
    boxShadow: 'none',
  },
  '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
    outline: 'none',
    boxShadow: 'none',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontSize: '0.75rem', // text-xs equivalent (12px)
    fontWeight: 500, // font-medium equivalent
    color: '#6b7280', // text-gray-500 equivalent
    // textTransform: 'uppercase', // uppercase
    letterSpacing: '0.05em', // tracking-wider equivalent
  },
  '& .MuiDataGrid-columnSeparator': {
    display: 'none', // Remove column separators
  },
  
  '& .MuiDataGrid-cell': {
    display: 'flex',
    alignItems: 'center',
    minHeight: 'auto',
    fontSize: '0.5rem',
    fontWeight: 500,
    fontFamily: 'inherit',
    padding: '12px 16px',
    color: '#374151',
    lineHeight: 1.5,
    whiteSpace: 'normal',
    overflow: 'visible',
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
    position: 'relative',
  },
  '& .MuiDataGrid-cell--textLeft': {
    justifyContent: 'flex-start',
  },
  '& .MuiDataGrid-cell--textRight': {
    justifyContent: 'flex-end',
  },

  '&.MuiDataGrid-scrollbarFiller--header': {
    backgroundColor: '#f9fafb !important',
  },

  '& .MuiBox-root': {
      paddingRight: 0,
    },
}));

const calculateColumnWidth = (key, data, config) => {
  // Calculate content-based width by analyzing actual data
  const headerLength = (config.headerName || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')).length;
  
  // Sample data to estimate content width
  const sampleSize = Math.min(data.length, 100);
  let maxContentLength = headerLength;
  
  data.slice(0, sampleSize).forEach(row => {
    const value = row[key];
    if (value == null) return;
    
    // Handle badge/array content
    if (config.cellType === 'badge') {
      const items = Array.isArray(value) ? value : String(value).split(',');
      const totalBadgeLength = items.reduce((sum, item) => {
        const trimmed = String(item).trim();
        return sum + (trimmed.length > 0 ? trimmed.length + 12 : 0); // +12 for badge padding and spacing
      }, 0);
      maxContentLength = Math.max(maxContentLength, totalBadgeLength);
    } else {
      maxContentLength = Math.max(maxContentLength, String(value).length);
    }
  });
  
  // Convert character count to approximate pixel width with more accurate estimation
  const baseCharWidth = key.toLowerCase().includes('year') || key.toLowerCase().includes('date') ? 10 : 
                       key.toLowerCase().includes('code') || key.toLowerCase().includes('id') ? 8 : 9;
  const cellPadding = 40; // More reasonable cell horizontal padding
  const estimatedWidth = maxContentLength * baseCharWidth + cellPadding;
  
  // Set widths based on content type with reasonable maximums for wrapping
  let width, maxWidth;
  if (config.cellType === 'badge') {
    width = Math.min(Math.max(estimatedWidth, 200), 300);
    maxWidth = 300;
  } else if (key.toLowerCase().includes('year') || key.toLowerCase().includes('date')) {
    width = Math.min(Math.max(estimatedWidth, 100), 120);
    maxWidth = 120;
  } else if (key.toLowerCase().includes('code') || key.toLowerCase().includes('id')) {
    width = Math.min(Math.max(estimatedWidth, 120), 200);
    maxWidth = 200;
  } else if (key.toLowerCase().includes('name') || key.toLowerCase().includes('title')) {
    width = Math.min(Math.max(estimatedWidth, 150), 250);
    maxWidth = 250;
  } else {
    width = Math.min(Math.max(estimatedWidth, 120), 200);
    maxWidth = 200;
  }
  
  return { width, maxWidth, minWidth: Math.min(width, 120) };
};

const generateColumnsFromRows = (data, fieldsConfig = {}, onAction, actionsFilter) => {
  if (!data || data.length === 0) return [];
  
  // Only use keys that are explicitly defined in the config
  // This ensures only configured columns are rendered
  const keys = Object.keys(fieldsConfig || {});
  
  // Calculate optimal column widths based on actual content
  const columnWidths = keys.map(key => {
    const config = fieldsConfig[key] || {};
    const { width, maxWidth, minWidth } = calculateColumnWidth(key, data, config);
    
    // Determine the ideal width based on content type
    let idealWidth;
    if (config.cellType === 'badge') {
      idealWidth = Math.max(minWidth, 250); // Badges need more space
    } else if (key.toLowerCase().includes('year') || key.toLowerCase().includes('date')) {
      idealWidth = Math.min(minWidth, 110); // Keep dates compact
    } else if (key.toLowerCase().includes('code') || key.toLowerCase().includes('id')) {
      idealWidth = Math.min(minWidth, 160); // Codes should be compact
    } else {
      idealWidth = Math.min(minWidth, 200); // Cap other columns
    }
    
    return {
      key,
      config,
      minWidth,
      maxWidth,
      idealWidth,
      priority: config.cellType === 'badge' ? 3 : 
               key.toLowerCase().includes('name') || key.toLowerCase().includes('title') ? 2 : 1
    };
  });
  
  // Calculate total ideal width
  const totalIdealWidth = columnWidths.reduce((sum, col) => sum + col.idealWidth, 0);
  
  // Normalize flex values to ensure they sum to a reasonable total
  const totalPriorityWeight = columnWidths.reduce((sum, col) => {
    const priorityMultiplier = col.priority === 3 ? 1.5 : col.priority === 2 ? 1.2 : 1;
    return sum + (col.idealWidth / totalIdealWidth) * priorityMultiplier;
  }, 0);
  
  // Determine which columns should flex (text-heavy) vs stay compact (years/codes)
  const elasticKeysSet = new Set(
    columnWidths
      .filter(({ key, config }) => (
        config.cellType === 'badge' ||
        /name|title|description/i.test(key) ||
        /agency|sector|department/i.test(key)
      ))
      .map(({ key }) => key)
  );
  const hasElastic = elasticKeysSet.size > 0;

  // Decide compact vs elastic columns
  const isCompactKey = (key) => (
    key.toLowerCase().includes('year') ||
    key.toLowerCase().includes('date') ||
    key.toLowerCase().includes('code') ||
    key.toLowerCase().includes('id')
  );

  let elasticKeys = new Set(
    columnWidths
      .filter(({ key, config }) => (
        config.cellType === 'badge' ||
        /name|title|description/i.test(key) ||
        /agency|sector|department/i.test(key)
      ))
      .map(({ key }) => key)
  );

  // If no elastic columns detected, make the widest non-compact column elastic to consume remaining space
  if (elasticKeys.size === 0) {
    const candidate = [...columnWidths]
      .filter(({ key }) => !isCompactKey(key))
      .sort((a, b) => b.idealWidth - a.idealWidth)[0];
    if (candidate) elasticKeys = new Set([candidate.key]);
  }

  // Create columns with equal flex distribution; wrap when constrained
  const columns = columnWidths.map(({ key, config }) => {
    const col = { 
      field: key,
      type: config.type || 'string',
      headerName: config.headerName || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      resizable: true,
      cellClassName: config.cellClassName,
      renderCell: config.cellType === 'badge' ? (params) => {
        const raw = params.value;
        const items = Array.isArray(raw)
          ? raw.filter(Boolean)
          : String(raw || '')
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0);
        return (
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 0.5, 
            alignItems: 'center',
            py: 0.5,
            width: '100%',
          }}>
            {(items.length > 0 ? items : ['—']).map((item, idx) => (
              <StatusBadge key={`${key}-${idx}`} value={item} type={config.badgeType} />
            ))}
          </Box>
        );
      } : config.renderCell || ((params) => (
        <Box sx={{
          width: '100%',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
          fontSize: '0.875rem',
          lineHeight: 1.4,
          py: 0.5,
        }}>
          {params.value}
        </Box>
      )),
      ...config, // Spread any other config options

    };
    // Equal distribution: each column gets the same flex
    col.flex = 1;
    // Minimum width to keep compact columns readable
    col.minWidth = config.cellType === 'badge' ? 180 : (/year|date/i.test(key) ? 90 : 120);
    // Remove explicit width/maxWidth to allow flex to decide
    delete col.width;
    delete col.maxWidth;

    if (config.type === 'singleSelect') {
        col.type = 'singleSelect';
        // get the unique values of the column
        const uniqueValues = [...new Set(data.map((r) => r[key]))];
        col.valueOptions = uniqueValues;
    }

    return col;
    
  });

  // Add actions column if onAction is provided
  if (onAction) {
    const viewDetails = useCallback(
      (id) => () => {
        onAction(id);
      },
      [onAction],
    );

    columns.push({
      field: 'actions',
      type: 'actions',
      headerName: 'Details',
      width: 80,
      minWidth: 80,
      maxWidth: 100,
      flex: 0,
      getActions: (params) => {
        if (typeof actionsFilter === 'function' && !actionsFilter(params.row)) {
          return []
        }
        return [
          <GridActionsCellItem
            key="view"
            icon={<Eye size={16} color="#7c3aed" />} 
            label="View Details"
            onClick={viewDetails(params.id)}
            sx={{
              '&:focus': { outline: 'none' },
              '& .MuiTouchRipple-root': { display: 'none' },
              border: 'none',
            }}
          />,
        ]
      },
    });
  }

  return columns;
};

const StyledQuickFilter = styled(QuickFilter)({
  display: 'grid',
  alignItems: 'center',
});

const StyledToolbarButton = styled(ToolbarButton)(({ theme, ownerState }) => ({
  gridArea: '1 / 1',
  width: 'min-content',
  height: 'min-content',
  zIndex: 1,
  opacity: ownerState.expanded ? 0 : 1,
  pointerEvents: ownerState.expanded ? 'none' : 'auto',
  transition: theme.transitions.create(['opacity']),
}));

const StyledTextField = styled(TextField)(({ theme, ownerState }) => ({
  gridArea: '1 / 1',
  overflowX: 'clip',
  width: ownerState.expanded ? 260 : 'var(--trigger-width)',
  opacity: ownerState.expanded ? 1 : 0,
  transition: theme.transitions.create(['width', 'opacity']),
  // Use soft indigo border on default, hover and focus
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e5e7eb',
      borderWidth: '1px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e5e7eb',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e5e7eb',
      borderWidth: '1px',
    },
    '&.Mui-focused': {
      boxShadow: 'none',
    },
    // Ensure input uses system font while typing
    '& .MuiInputBase-input': {
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: '0.875rem',
    },
  },
}));

// Custom Toolbar with title
function CustomToolbar({ title, subtitle, itemCount, toolbarExtras, searchPlaceholder }) {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportMenuTriggerRef = useRef(null);

  return (
    <Toolbar sx={{ padding: '30px 10px'}}>
      {/* Left side - Title and subtitle */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, mx: 0.5 }}>
        {title && (
          <Typography 
            component="h3"
            sx={{ 
              
              fontSize: '1rem',  // text-base equivalent
              fontWeight: 500, // font-medium equivalent
              color: '#1f2937', // text-gray-900 equivalent
              fontFamily: 'system-ui',
            }}
          >
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography 
            sx={{ 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}
          >
            {subtitle}
          </Typography>
        )}
        {itemCount !== undefined && (
          <Chip 
            label={`${itemCount} items`}
            size="small"
            sx={{ 
              backgroundColor: '#f9fafb',
              color: '#3730a3',
              fontSize: '0.75rem',
              fontWeight: 500,
              height: '24px'
            }}
          />
        )}
      </Box>

      {/* Right side - Toolbar actions */}
      {toolbarExtras && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 1 }}>
          {toolbarExtras}
        </Box>
      )}
      <Tooltip title="Export">
        <ToolbarButton
          ref={exportMenuTriggerRef}
          id="export-menu-trigger"
          aria-controls="export-menu"
          aria-haspopup="true"
          aria-expanded={exportMenuOpen ? 'true' : undefined}
          onClick={() => setExportMenuOpen(true)}
        >
          <Download size={16} />
        </ToolbarButton>
      </Tooltip>

      <Menu
        id="export-menu"
        anchorEl={exportMenuTriggerRef.current}
        open={exportMenuOpen}
        onClose={() => setExportMenuOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          list: {
            'aria-labelledby': 'export-menu-trigger',
            sx: { fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', fontSize: '0.875rem' },
          },
        }}
      >
        <ExportPrint render={<MenuItem sx={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', fontSize: '0.875rem' }} />} onClick={() => setExportMenuOpen(false)}>
          Print
        </ExportPrint>
        <ExportCsv render={<MenuItem sx={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', fontSize: '0.875rem' }} />} onClick={() => setExportMenuOpen(false)}>
          Download as CSV
        </ExportCsv>
      </Menu>

      {/* Inline filters area (moved before icons) */}

      <StyledQuickFilter>
        <QuickFilterTrigger
          render={(triggerProps, state) => (
            <Tooltip title="Search" enterDelay={0}>
              <StyledToolbarButton
                {...triggerProps}
                ownerState={{ expanded: state.expanded }}
                color="default"
                aria-disabled={state.expanded}
              >
                <Search size={16} />
              </StyledToolbarButton>
            </Tooltip>
          )}
        />
        <QuickFilterControl
          render={({ ref, ...controlProps }, state) => (
            <StyledTextField
              {...controlProps}
              ownerState={{ expanded: state.expanded }}
              inputRef={ref}
              aria-label="Search"
              placeholder={searchPlaceholder || "Search..."}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} />
                    </InputAdornment>
                  ),
                  endAdornment: state.value ? (
                    <InputAdornment position="end">
                      <QuickFilterClear
                        edge="end"
                        size="small"
                        aria-label="Clear search"
                        material={{ sx: { marginRight: -0.75 } }}
                      >
                        <X size={16} />
                      </QuickFilterClear>
                    </InputAdornment>
                  ) : null,
                  ...controlProps.slotProps?.input,
                },
                ...controlProps.slotProps,
              }}
            />
          )}
        />
      </StyledQuickFilter>
    </Toolbar>
  );
}

export default function DataTable({ data, fieldsConfig, title, actionTitle, onAction, actionsFilter, onRowClick, toolbarExtras, searchPlaceholder }) {
  console.log("data", data);
    const finalColumns = generateColumnsFromRows(data, fieldsConfig, onAction, actionsFilter);
   
    return (
      <Box sx={{ 
        width: '100%', 
        // border: '1px solid #e5e7eb', // border-gray-200 equivalent
        // borderRadius: '8px', // rounded-lg equivalent (or use 2 for MUI theme units)
        overflowX: 'auto',
        overflowY: 'hidden',
        marginBottom: '50px',
      }}>
        <CustomDataGrid
            rows={data}
            columns={finalColumns}
            getRowHeight={() => 'auto'}
            onRowClick={(params) => { if (typeof onRowClick === 'function') onRowClick(params.row) }}
            pagination
            initialState={{
                pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                },
            }}
            showToolbar
            slots={{
              toolbar: CustomToolbar,
              pagination: CustomPagination,
            }}
            slotProps={{
              toolbar: {
                title: title,
                toolbarExtras: toolbarExtras,
                searchPlaceholder: searchPlaceholder
              },
            }}
            columnBuffer={2}
            columnThreshold={2}
            disableColumnResize={false}
            disableExtendRowFullWidth={false}
            autoHeight
            hideFooter={false}
            hideFooterPagination={false}
            hideFooterSelectedRowCount={true}
            sx={{ width: '100%', '& .MuiDataGrid-virtualScrollerContent': { minWidth: '100%' } }}
            // Remove unsupported props that might interfere
        />
        </Box>
    );
}