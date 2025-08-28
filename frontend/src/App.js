import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/home-page';
import { HomePage2 } from "./components/home-page2";
import { RegisterForm } from './components/register-form';
import { LoginForm } from './components/login-form';
import { AdminDashboard } from "./components/admin-dashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route redirects to home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          {/* Home page route */}
          <Route path="/home" element={<HomePage />} />

           <Route path="/home2" element={<HomePage2 />} />
          
          {/* Register page route */}
          <Route path="/register" element={<RegisterForm />} />
          
          {/* Login route placeholder - you can add your login component here */}
          <Route path="/login" element={<LoginForm />} />

          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          
          {/* Catch-all route for 404s */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;