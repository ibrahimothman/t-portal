import { useState, useEffect, useRef } from 'react';
import { Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components from Chart.js.
// We now use CategoryScale for the axes.
ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend);

// Dummy data for applications with TIME and 6R strategies

// Define axis mappings
const rationalizationCategories = ['Tolerate', 'Invest', 'Migrate', 'Eliminate'];
// Reordered to match the visual hierarchy (Refactor at the bottom)
const cloudMigrationStrategyCategories = ['Refactor', 'Retain', 'Rehost', 'Repurchase', 'Replatform', 'Retire'];

// Group data by TIME-6R pairs and count applications
function processData(data) {
  const grouped = {};
  
  data.forEach(app => {
    const key = `${app.rationalization}-${app.cloudMigrationStrategy}`;
    if (!grouped[key]) {
      grouped[key] = {
        rationalization: app.rationalization,
        cloudMigrationStrategy: app.cloudMigrationStrategy,
        count: 0,
        apps: []
      };
    }
    grouped[key].count += 1;
    grouped[key].apps.push(app.name);
  });
  
  return Object.values(grouped);
}

// Convert processed data to the specific format Chart.js expects for a bubble chart.
function formatDataForChart(processedData) {
  const data = {
    datasets: [{
      label: 'Applications',
      data: processedData.map(item => ({
        // Use category strings directly for the axes
        x: item.rationalization,
        y: item.cloudMigrationStrategy,
        // Set bubble radius (r) based on the number of applications
        // We use Math.max to ensure a minimum size for visibility
        r: Math.max(10, item.count * 3),
        // Store additional data for use in tooltips
        apps: item.apps,
        rationalization: item.rationalization,
        cloudMigrationStrategy: item.cloudMigrationStrategy
      })),
      backgroundColor: 'rgba(124, 58, 237, 0.6)',
      borderColor: '#fff',
      borderWidth: 2,
      hoverBackgroundColor: 'rgba(109, 40, 217, 0.8)',
    }]
  };
  return data;
}

export default function BubbleChart({data, onItemSelected}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const processedData = processData(data);
  const chartData = formatDataForChart(processedData);


  useEffect(() => {
    // Function to handle clicks outside the modal
    const handleClickOutside = (event) => {
      // If the modal is open and the click is outside the modal's content
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    // Add event listener when the modal is open
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    // Clean up the event listener when the component unmounts or the modal closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]); // Rerun the effect whenever the modal state changes

  // Chart.js options for configuring axes, tooltips, and other chart features
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category', // Changed to category to treat labels as discrete groups
        position: 'bottom',
        labels: rationalizationCategories, // Explicitly provide the category labels
        grid: {
          color: '#e5e7eb',
          lineWidth: 1,
          drawOnChartArea: true,
          drawTicks: true,
        },
        ticks: {
          font: {
            size: 12,
            weight: 'bold',
            family: 'system-ui',
          },
        },
        title: {
          display: true,
          text: 'TIME Strategy',
          font: {
            size: 12,
            weight: 'bold',
            family: 'system-ui',
          },
          color: '#374151',
          padding: { // Added padding to push the title away from the axis
            top: 20,
          },
        },
      },
      y: {
        type: 'category', // Changed to category
        labels: cloudMigrationStrategyCategories, // Explicitly provide the category labels
        grid: {
          color: '#e5e7eb',
          lineWidth: 1,
          drawOnChartArea: true,
          drawTicks: true,
        },
        ticks: {
          font: {
            size: 12,
            weight: 'bold',
            family: 'system-ui',
          },
        },
        title: {
          display: true,
          text: '6R Migration Strategy',
          font: {
            size: 12,
            weight: 'bold',
            family: 'system-ui',
          },
          color: '#374151',
          padding: { // Added padding to push the title away from the axis
            bottom: 5,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // We don't need a legend for a single dataset
      },
      tooltip: {
        // Customize the tooltip content to display app details
        callbacks: {
          title: function(tooltipItems) {
            const item = tooltipItems[0].raw;
            // Change made here: The title now shows the TIME and 6R strategies.
            return `${item.rationalization} • ${item.cloudMigrationStrategy}`;
          },
          label: function(context) {
            const item = context.raw;
            // The label now shows the number of apps.
            return `Apps: ${item.apps.length}`;
          },
          
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedElement = elements[0];
        const dataIndex = clickedElement.index;
        const datasetIndex = clickedElement.datasetIndex;
        const value = chartData.datasets[datasetIndex].data[dataIndex];
        console.log(`Clicked on: TIME=${value.rationalization}, 6R=${value.cloudMigrationStrategy}`);
        onItemSelected({key: 'rationalization', value: value.rationalization});
        onItemSelected({key: 'cloudMigrationStrategy', value: value.cloudMigrationStrategy});
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200">
      {/* Header, Modal Trigger */}
      <div className="p-6 border-b border-gray-100 ">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Application Portfolio: TIME vs 6R</h3>
            <p className="text-sm text-gray-600 mt-1">Strategic positioning of apps by timeframe and migration approach</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors duration-200"
            aria-label="What is TIME & 6R?"
            title="What is TIME & 6R?"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="p-6 relative">
        <div className="w-full h-[340px]">
          {/* The Bubble component from react-chartjs-2 handles the rendering */}
          <Bubble data={chartData} options={options} />
        </div>
      </div>

      {/* Modal */}
      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/30" 
          onClick={() => setIsModalOpen(false)} // This handler now closes the modal on click
        >
          <div 
            className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            ref={modalRef} // Added a ref to the modal content for the click outside logic
            onClick={(e) => e.stopPropagation()} // Prevents clicks on the modal content from bubbling up
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Understanding TIME & 6R Frameworks</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* TIME Framework Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  TIME Framework
                </h3>
                <p className="text-gray-600 mb-4">
                  TIME is a strategic framework for application portfolio rationalization based on technical and business value assessment.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <h4 className="font-semibold text-gray-900">Tolerate</h4>
                    </div>
                    <p className="text-sm text-gray-700">Keep applications running as-is for now. Usually legacy systems that work well technically but don't drive much business value.</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <h4 className="font-semibold text-gray-900">Invest</h4>
                    </div>
                    <p className="text-sm text-gray-700">Your "golden" applications - invest more in them. Modern, well-architected systems that deliver strong business outcomes.</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <h4 className="font-semibold text-gray-900">Migrate</h4>
                    </div>
                    <p className="text-sm text-gray-700">Important for business but technically outdated. Prime candidates for cloud migration, modernization, or replacement.</p>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <h4 className="font-semibold text-gray-900">Eliminate</h4>
                    </div>
                    <p className="text-sm text-gray-700">Phase out or retire these applications. Usually old, problematic systems that don't contribute much to the business.</p>
                  </div>
                </div>
              </div>

              {/* 6R Framework Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  6R Cloud Migration Strategies
                </h3>
                <p className="text-gray-600 mb-4">
                  The 6R framework defines different approaches for migrating applications to the cloud, each with varying levels of effort and transformation.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Refactor</h4>
                    <p className="text-sm text-gray-700">Recode or rewrite applications to be cloud-native. Highest effort but maximum cloud benefits.</p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Retain</h4>
                    <p className="text-sm text-gray-700">Keep applications on-premises. Usually due to compliance, performance, or cost considerations.</p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Rehost</h4>
                    <p className="text-sm text-gray-700">"Lift and shift" - move applications to cloud with minimal changes. Quick migration with moderate benefits.</p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Repurchase</h4>
                    <p className="text-sm text-gray-700">Replace with Software-as-a-Service (SaaS) solutions. Often more cost-effective than rebuilding.</p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Replatform</h4>
                    <p className="text-sm text-gray-700">"Lift and reshape" - make targeted optimizations during migration. Balance of effort and cloud benefits.</p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Retire</h4>
                    <p className="text-sm text-gray-700">Decommission applications that are no longer needed. Reduces complexity and ongoing costs.</p>
                  </div>
                </div>
              </div>

              {/* How to Read the Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Read This Chart</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-xs">1</span>
                    </div>
                    <p><strong>X-axis (TIME):</strong> Shows the strategic decision for each application group</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-xs">2</span>
                    </div>
                    <p><strong>Y-axis (6R):</strong> Shows the planned migration approach for each group</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-xs">3</span>
                    </div>
                    <p><strong>Bubble Size:</strong> Represents the number of applications in each TIME-6R combination</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-xs">4</span>
                    </div>
                    <p><strong>Hover:</strong> See detailed information about each application group</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
