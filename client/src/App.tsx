
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import OrderWeek from "@/components/Pages/Orders/OrderWeek";
import PatientSearch from "@/components/Pages/PatientSearch/PatientSearch";
import GpSurgeries from "@/components/Pages/GpSurgeries";
import PatientForm from "@/components/Pages/PatientForm/PatientForm";
import LoginPage from "@/components/Pages/Login/LoginPage";
import Dashboard from './components/Pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardTitleContext } from './contexts/DashboardTitleContext';

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={ 
              <ProtectedRoute>

                <Dashboard/>
              </ProtectedRoute>
            }>
              <Route path="/" element={<OrderWeek  />}/>
              <Route path="/patients" element={<PatientSearch />}/>
              <Route path="/patients/new" element={<PatientForm  />}/>
              <Route path="/gp" element={<GpSurgeries />}/>
              <Route path="/patients/:id" element={<PatientForm/>} />
            </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
