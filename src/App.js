import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Users from './pages/Users';
import Equipements from './pages/Equipements';
import Interventions from './pages/Interventions';
import Profile from './pages/Profile';
import Accueil from './pages/Accueil';
import Settings from './pages/Settings';
import Services from './pages/Services';
import Declaration from './pages/Declaration';
import Licences from './pages/Licences';
import UsersList from './pages/UsersList';
import EquipementsList from './pages/EquipementsList';
import InterventionsList from './pages/InterventionsList';
import ServicesList from './pages/ServicesList';
import LicencesList from './pages/LicencesList';
import LicenseManagement from './pages/LicenseManagement'; // New combined license management page
import MaintenancePage from './pages/MaintenancePage';
import MaintenanceListPage from './pages/MaintenanceListPage';
import MaintenanceDebugPage from './pages/MaintenanceDebugPage';
import AddMaintenancePage from './pages/AddMaintenancePage';
import Notifications from './pages/Notifications';

import EditUser from './pages/EditUser'; // Page pour modifier un utilisateur
import EditEquipement from './pages/EditEquipement'; // ✅ Page pour modifier un équipement
import EditIntervention from './pages/EditIntervention';
import EditService from './pages/EditService';  // Ajustez le chemin si nécessaire
import EditLicence from './pages/EditLicence'; // Importer la page d'édition
import EditMaintenance from './pages/EditMaintenance'; // Importer la page d'édition de maintenance

const Layout = () => {
  const role = localStorage.getItem('role');
  if (!role) return <Navigate to="/login" />;
  return <Outlet />;
};

// Logout component to clear localStorage and redirect to login
const Logout = () => {
  React.useEffect(() => {
    // Clear all localStorage items
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    // Add any other items that need to be cleared
  }, []);

  // Redirect to login page
  return <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route for login */}
        <Route path="/login" element={<Login />} />

        {/* Logout route */}
        <Route path="/logout" element={<Logout />} />

        {/* Redirect root path to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Protected routes that require authentication */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Accueil />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/users/list" element={<UsersList />} />
          <Route path="/admin/users/edit/:id" element={<EditUser />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/interventions" element={<Interventions />} />
          <Route path="/admin/interventions/list" element={<InterventionsList />} />
          <Route path="/admin/services" element={<Services />} />
          <Route path="/admin/services/list" element={<ServicesList />} />
          <Route path="/admin/equipements" element={<Equipements />} />
          <Route path="/admin/equipements/list" element={<EquipementsList />} />
          <Route path="/equipements/edit/:id" element={<EditEquipement />} />
          <Route path="/admin/licences" element={<Licences />} />
          <Route path="/admin/licences/list" element={<LicencesList />} />
          <Route path="/admin/licences/management" element={<LicenseManagement />} />
          <Route path="/admin/maintenance" element={<MaintenancePage />} />
          <Route path="/admin/maintenance/list" element={<MaintenanceListPage />} />
          <Route path="/admin/maintenance/add" element={<AddMaintenancePage />} />
          <Route path="/admin/maintenance/debug" element={<MaintenanceDebugPage />} />
          <Route path="/admin/edit-maintenance/:id" element={<EditMaintenance />} />
          <Route path="/edit-intervention/:id" element={<EditIntervention />} />
          <Route path="/edit-service/:id" element={<EditService />} /> {/* La route pour EditService */}
          <Route path="/edit-licence/:id" element={<EditLicence />} />
          <Route path="/admin/edit-maintenance/:id" element={<EditMaintenance />} />
          <Route path="/notifications" element={<Notifications />} />

          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/declaration" element={<Declaration />} />
          <Route path="/employee/profile" element={<Profile />} />
        </Route>

        {/* Redirect all other routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
