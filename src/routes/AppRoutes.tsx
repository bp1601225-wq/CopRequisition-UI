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
import RequisitionInformation from '../pages/Requisition/Requisition'
import RequisitionList from '../pages/Requisition/RequisitionList'
import RequisitionDetails from '../pages/Requisition/RequisitionDetails'
import StoresCosting from '../pages/Stores/Stores'

export function AppRoutes() {
return (
    <Routes>
        <Route path="/auth" element={<Login />} />


      <Route element={<AppLayout />}>

        {/* <Route path="/pending-review" element={<PendingReview />} /> */}
        <Route path="/create-request" element={<RequisitionInformation />} />

   <Route path="/requisitions-list" element={<RequisitionList />} />



        <Route path="/staff-information" element={<StaffInformation />} />
        <Route path="/dashboard" element={<DashboardSummary />} />
        <Route path="/staff-list" element={<StaffList />} />


        <Route path="/reports" element={<Reports />} />


        <Route path="/settings" element={<SettingsScreen />} />



        <Route path="/test" element={<RequisitionDetails />} />

        <Route path="/stores" element={<StoresCosting />} />





        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
