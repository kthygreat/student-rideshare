import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav style={{
            background: 'linear-gradient(135deg, #495057 0%, #343a40 100%)',
            padding: '1rem 0',
            color: 'white'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 30px'
            }}>
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '1.5rem'
                }}>
                    <img src="/RideShareLogo.png" alt="Logo" style={{
                        height: '40px',
                        borderRadius: '8px'
                    }} />
                    Student Rideshare
                </Link>
                
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    {user ? (
                        <>
                            <Link to="/dashboard" style={{
                                color: 'white',
                                textDecoration: 'none',
                                padding: '8px 16px',
                                borderRadius: '25px',
                                transition: 'all 0.3s ease'
                            }}>Dashboard</Link>
                            <span style={{
                                background: 'linear-gradient(45deg, #ffd43b, #ffc107)',
                                color: '#343a40',
                                padding: '6px 15px',
                                borderRadius: '20px',
                                fontWeight: '600'
                            }}>Welcome, {user.username}</span>
                            <button onClick={handleLogout} style={{
                                background: 'transparent',
                                border: '1px solid #ffd43b',
                                color: '#ffd43b',
                                padding: '8px 16px',
                                borderRadius: '25px',
                                cursor: 'pointer'
                            }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{
                                color: 'white',
                                textDecoration: 'none',
                                padding: '8px 16px',
                                borderRadius: '25px',
                                transition: 'all 0.3s ease'
                            }}>Login</Link>
                            <Link to="/register" style={{
                                color: 'white',
                                textDecoration: 'none',
                                padding: '8px 16px',
                                borderRadius: '25px',
                                transition: 'all 0.3s ease'
                            }}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;