import { Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
// import About from '../pages/About'
import Dashboard from '../pages/Dashboard/Dashboard'
// import Home from '../pages/Home'
import NotFound from '../pages/NotFound'
import StaffInformation from '../pages/Staffs_Information/Staff_Information'
import Reports from '../pages/Reports/Reports'
import DashboardSummary from '../pages/Dashboard/Dashboard'
import SettingsScreen from '../pages/Settings/Settings'
import Login from '../pages/Login/Login'
import StaffList from '../pages/Staffs_Information/StaffList'
import RequisitionList from '../pages/Requisition/RequisitionList'
import RequisitionDetails from '../pages/Requisition/RequisitionDetails'
import StoresCosting from '../pages/Stores/Stores'
import AuditComponent from '../pages/Audits/Audits'
import Finance from '../pages/Finance/Finance'
import RequsitionManagement from '../pages/Requisition/RequisitionManagement'

export function AppRoutes() {
return (
    <Routes>
        <Route path="/auth" element={<Login />} />


      <Route element={<AppLayout />}>

        {/* <Route path="/pending-review" element={<PendingReview />} /> */}
        
        <Route path="/create-request" element={<RequsitionManagement />} />

   <Route path="/requisitions-list" element={<RequisitionList />} />



        <Route path="/staff-information" element={<StaffInformation />} />
        <Route path="/dashboard" element={<DashboardSummary />} />
        <Route path="/staff-list" element={<StaffList />} />


        <Route path="/reports" element={<Reports />} />


        <Route path="/settings" element={<SettingsScreen />} />



        <Route path="/test" element={<RequisitionDetails />} />




        <Route path="/stores" element={<StoresCosting />} />

        <Route path="/audit" element={<AuditComponent />} />

        <Route path="/finance" element={<Finance />} />


        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
