import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import TeachersUI from './components/teachers/TeachersUI';
import ParentsUI from './components/parents/ParentsUI';
import SuperAdminDashboard from './components/super-admin/SuperAdminDashboard';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['school_admin', 'super_admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/teachers" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeachersUI />
              </ProtectedRoute>
            } />
            <Route path="/parents" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentsUI />
              </ProtectedRoute>
            } />
            <Route path="/super-admin" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </DataProvider>
    </AuthProvider>
  );
}

export default App; 