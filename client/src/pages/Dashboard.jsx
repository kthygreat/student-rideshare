import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [myRides, setMyRides] = useState([]);
    const [availableRides, setAvailableRides] = useState([]);
    const [myBookings, setMyBookings] = useState([]);

    useEffect(() => {
        if (user) {
            loadMyRides();
            loadAvailableRides();
            loadMyBookings();
        }
    }, [user]);

    const loadMyRides = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/rides/my-rides', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const rides = await response.json();
                setMyRides(rides);
            }
        } catch (error) {
            console.error('Error loading rides:', error);
        }
    };

    const loadAvailableRides = async () => {
        try {
            const response = await fetch('/api/rides/available');
            const rides = await response.json();
            setAvailableRides(rides);
        } catch (error) {
            console.error('Error loading available rides:', error);
        }
    };

    const loadMyBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/bookings/my-bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const bookings = await response.json();
                setMyBookings(bookings);
            }
        } catch (error) {
            console.error('Error loading bookings:', error);
        }
    };

    return (
        <div style={containerStyle}>
            <h1>Dashboard</h1>
            <p>Welcome, {user?.username}</p>
            
            <div style={gridStyle}>
                <div style={cardStyle}>
                    <h3>My Rides</h3>
                    {myRides.map(ride => (
                        <div key={ride._id} style={itemStyle}>
                            <h4>{ride.startLocation} → {ride.destination}</h4>
                            <p>Date: {new Date(ride.dateTime).toLocaleString()}</p>
                            <button>Edit</button>
                            <button>Delete</button>
                        </div>
                    ))}
                </div>

                <div style={cardStyle}>
                    <h3>Available Rides</h3>
                    {availableRides.map(ride => (
                        <div key={ride._id} style={itemStyle}>
                            <h4>{ride.startLocation} → {ride.destination}</h4>
                            <button>Book</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginTop: '20px'
};

const cardStyle = {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
};

const itemStyle = {
    border: '1px solid #ddd',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px'
};

export default Dashboard;