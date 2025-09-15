import { BarChart } from '@mui/x-charts/BarChart'
import { Paper, Typography, Box } from '@mui/material'

export default function Bar({ title }) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      {title ? (
        <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 1 }}>
          {title}
        </Typography>
      ) : null}
      <Box sx={{ width: '100%' }}>
        <BarChart
          dataset={dataset}
          xAxis={[{ dataKey: 'month' }]}
          series={[
            { dataKey: 'london', label: 'London', valueFormatter },
            { dataKey: 'paris', label: 'Paris', valueFormatter },
            { dataKey: 'newYork', label: 'New York', valueFormatter },
            { dataKey: 'seoul', label: 'Seoul', valueFormatter },
          ]}
          layout="horizontal"
          borderRadius={10}
          {...chartSetting}
        />
      </Box>
    </Paper>
  )
}