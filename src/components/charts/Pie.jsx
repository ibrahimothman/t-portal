import { PieChart } from '@mui/x-charts/PieChart';
import { useMemo, useState } from 'react';





export default function Pie({ data, datakey, title, subtitle, onItemSelected, preAggregated = false }) {

    const [selectedItem, setSelectedItem] = useState(null);

    const processedData = useMemo(() => {
        if (preAggregated) {
            return Array.isArray(data) ? data : [];
        }
        if (!data || !datakey) return [];
        const counts = data.reduce((acc, item) => {
            const rawValue = item[datakey];
            if (datakey === 'strategies' && rawValue) {
                const strategies = Array.isArray(rawValue)
                    ? rawValue
                    : String(rawValue)
                        .split(',')
                        .map(s => s.trim())
                        .filter(Boolean);
                strategies.forEach(strategy => {
                    acc[strategy] = (acc[strategy] || 0) + 1;
                });
            } else {
                const key = rawValue;
                acc[key] = (acc[key] || 0) + 1;
            }
            return acc;
        }, {});
        return Object.entries(counts).map(([key, value]) => ({ label: key, value }));
      }, [data, datakey, preAggregated]);



      const handleBarClick = (event, d) => {
        if (!onItemSelected) return;
        const idx = d?.dataIndex;
        const clickedItem = typeof idx === 'number' ? processedData[idx]?.label : null;
        if (!clickedItem) {
          setSelectedItem(null);
          return onItemSelected(null);
        }
        if (selectedItem && selectedItem.value === clickedItem) {
          setSelectedItem(null);
          onItemSelected(null);
        } else {
          setSelectedItem({key: datakey, value: clickedItem});
          onItemSelected({key: datakey, value: clickedItem});
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
            <PieChart
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                series={[{ innerRadius: 50, outerRadius: 130, data: processedData, arcLabel: 'value', paddingAngle: 1}]}
                height={340}
                slotProps={{
                    legend: {
                      position: { vertical: 'right', horizontal: 'top' },
                      itemHeight: 10,
                      itemWidth: 10,
                      itemText: {
                        fontSize: 12,
                        fontWeight: 'bold',
                        fontFamily: 'system-ui',
                      },
                    },
                }}
                onItemClick={(event, d) => handleBarClick(event, d)}
            />
        </div>
    </div>
  );
}