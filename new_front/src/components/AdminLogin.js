import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';  // Ensure the path is correct
import './css/AdminLogin.css';

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isAuthenticated, logout } = useAuth();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}admin/login/`, {
                username,
                password
            });
            if (response.data.user) {
                login(response.data.user);  // Assuming response.data.user contains the necessary user information
                alert('Login successful');
            } else {
                throw new Error(response.data.message || 'Unknown error');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials and try again.');
        }
    };

    const handleLogout = () => {
        logout();
    }

    return (
        <div className="login-container">
            <h2>Admin Login</h2>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="login-input"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="login-input"
            />
            <button onClick={handleLogin} className="login-button">Login</button>
            {isAuthenticated && <button onClick={handleLogout} className="logout-button">Logout</button>}
            {error && <p className="error-message">{error}</p>}
            <Link to="/" className="home-button">Home</Link>
        </div>
    );
}

export default AdminLogin;