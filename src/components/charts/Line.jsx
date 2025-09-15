import { LineChart } from '@mui/x-charts/LineChart'

export default function Line({ title, chartSetting }) {
    const simpleDataset = [
        { month: 'Jan', sales: 4000 },
        { month: 'Feb', sales: 3000 },
        { month: 'Mar', sales: 2000 },
        { month: 'Apr', sales: 2780 },
    ];
    return (
        <LineChart
        series={[
            { curve: "linear", data: [1, 5, 2, 6, 3, 9.3] },
            { curve: "linear", data: [6, 3, 7, 9.5, 4, 2] },
          ]}
            height={250}
        />
    )
}