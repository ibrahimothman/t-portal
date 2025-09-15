import { BarChart, BarPlot } from '@mui/x-charts/BarChart';
import { styled } from '@mui/material/styles';
import { useAnimate } from '@mui/x-charts/hooks';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';
import { useState, useMemo } from 'react';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';

 
const StyledBarChart = styled(BarChart)`
  .MuiBarChart-bar,
  .MuiChartsBar-bar,
  rect[data-testid*="bar"],
  .css-1q8gehs,
  rect {
    rx: 3 !important;
    ry: 3 !important;
  }
`;

const Text = styled('text')(({ theme }) => ({
  stroke: 'none',
  fill: '#000000',
  textAnchor: 'middle',
  dominantBaseline: 'central',
  pointerEvents: 'none',
}));

function BarLabel(props) {
  const {
    seriesId,
    dataIndex,
    color,
    isFaded,
    isHighlighted,
    classes,
    xOrigin,
    yOrigin,
    x,
    y,
    width,
    height,
    layout,
    skipAnimation,
    ...otherProps
  } = props;

  const animatedProps = useAnimate(
    { x: x + width / 2, y: y - 20 },
    {
      initialProps: { x: x + width / 2, y: yOrigin },
      createInterpolator: interpolateObject,
      transformProps: (p) => p,
      applyProps: (element, p) => {
        element.setAttribute('x', p.x.toString());
        element.setAttribute('y', p.y.toString());
      },
      skip: skipAnimation,
    },
  );

  return (
    <Text {...otherProps} fill={color} textAnchor="middle" {...animatedProps} />
  );
}



export default function Bar({ title, subtitle, datakey, data, onItemSelected, needToSort = true, tooltipKey = null, activeFilters = [], preAggregated = false }) {


  console.log("datakey", data);

  const [selectedCategory, setSelectedCategory] = useState(null);
  let processedData;

  

  if(preAggregated || title === "Projects Per Strategy") {
    processedData = data
    if (needToSort) {
      processedData = processedData.sort((a, b) => b.count - a.count);
    }
  }
  else {
    processedData = useMemo(() => {
      if (!data || !datakey) return [];

      // Count occurrences of each value in the specified datakey
      const counts = data.reduce((acc, item) => {
        const rawValue = item[datakey];
        
        // Handle comma-separated values (like strategies)
        if (datakey === 'strategies' && rawValue) {
          const strategies = Array.isArray(rawValue)
            ? rawValue
            : String(rawValue)
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);
          
          // Count each strategy separately
          strategies.forEach(strategy => {
            const tooltipValue = tooltipKey ? item[tooltipKey] : strategy;
            if (!acc[strategy]) {
              acc[strategy] = { count: 0, tooltipValue };
            }
            acc[strategy].count += 1;
          });
        } else {
          // Handle single values normally
          const key = rawValue;
          const tooltipValue = tooltipKey ? item[tooltipKey] : key;
          
          if (!acc[key]) {
            acc[key] = { count: 0, tooltipValue };
          }
          acc[key].count += 1;
        }
        
        return acc;
      }, {});
      
      // Convert to array format expected by the chart
      let result = Object.entries(counts).map(([key, value]) => ({
        category: key,
        count: value.count,
        tooltipValue: value.tooltipValue
      }));
      
      // Filter strategies if there's an active strategy filter
      if (datakey === 'strategies' && activeFilters) {
        const activeStrategyFilters = activeFilters.filter(f => f.key === 'strategy');
        if (activeStrategyFilters.length > 0) {
          const activeStrategies = activeStrategyFilters.map(f => f.value);
          result = result.filter(item => activeStrategies.includes(item.category));
        }
      }
      
      // Sort logic based on needToSort and datakey
      if (needToSort) {
        return result.sort((a, b) => b.count - a.count);
      } else if (datakey === 'startYear' || datakey === 'displayYear') {
        // For year data, sort by category (year) in ascending order
        // Handle "Running" as a special case that should appear between past/current and future years
        return result.sort((a, b) => {
          const yearA = parseInt(a.category);
          const yearB = parseInt(b.category);
          const currentYear = new Date().getFullYear();
          
          // If both are numbers, sort normally
          if (!isNaN(yearA) && !isNaN(yearB)) {
            return yearA - yearB;
          }
          
          // If a is "Running", it should come after current/past years but before future years
          if (a.category === 'Running') {
            if (!isNaN(yearB)) {
              return yearB <= currentYear ? 1 : -1; // After past/current, before future
            }
            return -1;
          }
          
          // If b is "Running"
          if (b.category === 'Running') {
            if (!isNaN(yearA)) {
              return yearA <= currentYear ? -1 : 1; // After past/current, before future
            }
            return 1;
          }
          
          // Default numeric comparison
          return yearA - yearB;
        });
      } else if (datakey === 'stageName') {
        // For stage data, sort alphabetically
        return result.sort((a, b) => a.category.localeCompare(b.category));
      } else {
        return result;
      }

    }, [data, datakey, tooltipKey, activeFilters]);
  }

  const handleBarClick = (event, d) => {
    const clickedCategory = d.axisValue;
    if (selectedCategory === clickedCategory) {
      // If same category is clicked, clear the filter
      setSelectedCategory(null);
      onItemSelected(null);
    } else {
      // Select new category
      setSelectedCategory({key: datakey, value: clickedCategory});
      onItemSelected({key: datakey, value: clickedCategory});
    }
  };
  
  return (
    <div className="w-full bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
      </div>

      <div className="p-6">

        <StyledBarChart
          dataset={processedData}
          xAxis={[
            {
              dataKey: 'category',
              scaleType: 'band',
              tickLabelStyle: {
                fontSize: 12,
                fontFamily: 'system-ui, -apple-system, sans-serif',
              },
              tickSize: 0,
            },
          ]}
          yAxis={[{ 
            position: 'none',
          }]}
          series={[
            { 
              dataKey: 'count',
              valueFormatter: (value, context) => {
                if (tooltipKey && context?.dataIndex != null) {
                  const dataPoint = processedData[context.dataIndex];
                  return `${dataPoint?.tooltipValue || dataPoint?.category || ''}: ${value?.toLocaleString() || ''}`;
                }
                return value?.toLocaleString() || '';
              },
              color: '#7c3aed',
            }
          ]}
          height={340}
          margin={{ top: 40, right: 0, bottom: 0, left: 0 }}
          borderRadius={10}
          slots={{
            barLabel: BarLabel
          }}

          onAxisClick={handleBarClick}
        >
          <BarPlot barLabel="value" slots={{ barLabel: BarLabel }} />
        </StyledBarChart>     
      </div>
    </div>
  );
}