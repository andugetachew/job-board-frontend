import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import MyApplications from './pages/MyApplications';
import EmployerApplications from './pages/EmployerApplications';
import Profile from './pages/Profile';
import SavedJobs from './pages/SavedJobs';
import CompanyProfile from './pages/CompanyProfile';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) return <Navigate to="/jobs" />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/jobs" />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/company/:id" element={<CompanyProfile />} />

        {/* Protected Routes - All authenticated users */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Candidate Only Routes */}
        <Route path="/my-applications" element={<ProtectedRoute allowedRoles={['candidate']}><MyApplications /></ProtectedRoute>} />
        <Route path="/saved-jobs" element={<ProtectedRoute allowedRoles={['candidate']}><SavedJobs /></ProtectedRoute>} />

        {/* Employer Only Routes */}
        <Route path="/post-job" element={<ProtectedRoute allowedRoles={['employer']}><PostJob /></ProtectedRoute>} />
        <Route path="/my-jobs" element={<ProtectedRoute allowedRoles={['employer']}><MyJobs /></ProtectedRoute>} />
        <Route path="/employer-applications" element={<ProtectedRoute allowedRoles={['employer']}><EmployerApplications /></ProtectedRoute>} />

        {/* Admin Only Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;