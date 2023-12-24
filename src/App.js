import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/Login';
import Transactions from './component/Transactions';

// This is a mock function to simulate an authentication check.
// Replace this with your actual authentication check logic.
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token != null;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect any unknown routes to "/login" */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;