import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            alert(result.error);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                    />
                </div>
                <button type="submit" style={{
                    width: '100%',
                    padding: '12px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: 'pointer'
                }}>Login</button>
            </form>
        </div>
    );
};

export default Login;