
// Badge component for styled cells
export default function StatusBadge({ value, type }) {
  const getColors = () => {
    switch(type) {
      case 'rationalization':
        switch(value) {
          case 'Tolerate': return 'bg-orange-50 text-orange-600';  // Caution/warning state
          case 'Invest': return 'bg-emerald-50 text-emerald-600';  // Positive/growth state
          case 'Migrate': return 'bg-indigo-50 text-indigo-600';   // Action/movement state
          case 'Eliminate': return 'bg-red-50 text-red-600';       // Critical/removal state
          default: return 'bg-gray-50 text-gray-600';
        }
      case 'cloudMigrationStrategy':
        switch(value) {
          case 'Rehost': return 'bg-sky-50 text-sky-600';         // Simple lift & shift
          case 'Refactor': return 'bg-amber-50 text-amber-600';    // Moderate changes
          case 'Replatform': return 'bg-violet-50 text-violet-600'; // Significant platform change
          case 'Repurchase': return 'bg-fuchsia-50 text-fuchsia-600'; // Complete replacement
          case 'Retain': return 'bg-slate-50 text-slate-600';      // Keep as-is
          case 'Retire': return 'bg-rose-50 text-rose-600';        // End-of-life
          default: return 'bg-gray-50 text-gray-600';
        }
     
      case 'criticality':
        switch(value) {
          case 'Critical': return 'bg-red-50 text-red-600';       // Highest severity
          case 'High': return 'bg-orange-50 text-orange-600';     // Serious but not critical
          case 'Medium': return 'bg-amber-50 text-amber-600';     // Moderate importance
          case 'Low': return 'bg-emerald-50 text-emerald-600';    // Minor impact
          default: return 'bg-gray-50 text-gray-600';
        }

      case 'isEligable':
        switch(value) {
          case 'Yes': return 'bg-green-50 text-green-600';
          case 'No': return 'bg-red-50 text-red-600';
          default: return 'bg-gray-50 text-gray-600';
        }

      case 'requestStatus':
        switch(value) {
          case 'Delayed': return 'bg-red-50 text-red-600';
          case 'In Progress': return 'bg-yellow-50 text-yellow-600';
          default: return 'bg-gray-50 text-gray-600';
        }
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const colors = getColors();
  
  return (
     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors}`}>
      {value}
     </span>
  );
};