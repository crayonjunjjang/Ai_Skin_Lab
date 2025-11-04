import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppNavbar from './components/Navbar';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DiagnosisPage from './components/DiagnosisPage';
import MyPage from './components/MyPage';
import ProfilePage from './components/ProfilePage';

import AdminRoute from './components/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import UserManagement from './components/admin/UserManagement';
import ReviewManagement from './components/admin/ReviewManagement';
import DiagnosisManagement from './components/admin/DiagnosisManagement';

// Helper component for non-admin routes
const MainContent = () => (
  <main className="py-4">
    <Container>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/diagnosis" element={<DiagnosisPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* A catch-all route can be added here for 404 if needed */}
      </Routes>
    </Container>
  </main>
);

function App() {
  return (
    <Router>
      <AppNavbar />
      <Routes>
        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="users" element={<UserManagement />} />
            <Route path="reviews" element={<ReviewManagement />} />
            <Route path="diagnoses" element={<DiagnosisManagement />} />
            {/* Redirect /admin to /admin/users */}
            <Route index element={<Navigate to="users" replace />} />
          </Route>
        </Route>

        {/* Public and User Routes */}
        <Route path="/*" element={<MainContent />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;