import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Business from './pages/business/BusinessOverview.jsx'
import DashboardLayout from './pages/DashboardLayout.jsx'
import CART from './pages/technology/CART.jsx'
import CloudMigration from './pages/technology/CloudMigration.jsx'
import Applications from './pages/technology/Applications.jsx'
import InformationMap from './pages/business/InformationMap.jsx'
import Stakeholders from './pages/business/Stakeholders.jsx'
import ValueStreams from './pages/business/ValueStreams.jsx'  
import Processes from './pages/business/Processes.jsx'
import Services from './pages/business/Services.jsx'
import DigitalStrategyOverview from './pages/strategy/DigitalStrategyOverview.jsx'
import TargetArchitecture from './pages/technology/TargetArchitecture.jsx'
import ProjectsPortfolio from './pages/strategy/ProjectsPortfolio.jsx'
import Strategies from './pages/strategy/Strategies.jsx'
import Capabilities from './pages/business/Capabilities.jsx'
import BusinessCaseBuilder from './pages/services/BusinessCaseBuilder.jsx'
import CloudReadinessTool from './pages/technology/tools/CloudReadinessTool.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import NotFound from './pages/NotFound.jsx'
import SoftwareAssets from './pages/technology/tools/SoftwareAssets.jsx'

const router = createBrowserRouter([
  
  {
    path: "/",
    element: <DashboardLayout />,
   
    children: [
      {
        path: "/",
        element: <Home />
      },
      
      {
        
        path: "technology/cart",
        element: <CART />
      },
      {
        path: "technology/cloud-migration", 
        element: <CloudMigration />
      },
      {
        path: "technology/business-applications",
        element: <Applications />
      },
      {
        path: "business/information-map",
        element: <InformationMap />
      },
      {
        path: "business/stakeholders",
        element: <Stakeholders />
      },
      {
        path: "business/value-streams",
        element: <ValueStreams />
      },
      {
        path: "business/processes",
        element: <Processes />
      },
      {
        path: "business/services",
        element: <Services />
      },
      {
        path: "business/business-architecture-overview",
        element: <Business />
      },
      {
        path: "strategy/digital-strategy-overview",
        element: <DigitalStrategyOverview />
      },
      {
        path: "technology/target-architecture",
        element: <TargetArchitecture />
      },
      {
        path: "strategy/projects-portfolio",
        element: <ProjectsPortfolio />
      },
      {
        path: "strategy/specialized-strategies",
        element: <Strategies />
      },
      {
        path: "business/business-capabilities",
        element: <Capabilities />
      },
      {
        path: "services/business-case-builder",
        element: <BusinessCaseBuilder />
      },
      {
        path: "tools/cloud-eligibility-tool",
        element: <CloudReadinessTool />
      },
      {
        path: "technology/software-assets",
        element: <SoftwareAssets />
      }
    ]
  },
  // Catch-all route for 404 Not Found
  {
    path: "*",
    element: <NotFound />
  }
])


function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default App