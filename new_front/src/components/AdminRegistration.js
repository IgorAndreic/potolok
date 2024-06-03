import React, { useState } from 'react';
import axios from 'axios';

function AdminRegistration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleRegistration = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}admin/register/`, {
                username,
                password,
                email
            });
            alert(response.data.message); // Handle registration status
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div>
            <h2>Admin Registration</h2>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <button onClick={handleRegistration}>Register</button>
            {error && <p>{error}</p>}
        </div>
    );
}

export default AdminRegistration;
