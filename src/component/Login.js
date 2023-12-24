import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/transactions');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password }, {
        headers: { 'Content-Type': 'application/json', 'allow-origin': '*' },
      });
      localStorage.setItem('token', res.data.access_token);
      navigate('/transactions');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="login-input" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="login-input" />
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}

export default Login;