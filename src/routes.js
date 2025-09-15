import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home.jsx'
import BusinessCaseBuilder from './pages/services/BusinessCaseBuilder.jsx'
import CloudReadinessTool from './pages/technology/tools/CloudReadinessTool.jsx'


const routes = [
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/services/business-case-builder",
    element: <BusinessCaseBuilder />
  },
  {
    path: "/tools/cloud-eligibility-tool",
    element: <CloudReadinessTool />
  }
]

export default routes