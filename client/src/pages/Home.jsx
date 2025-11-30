import React from 'react';

const Home = () => {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Welcome to Student Rideshare</h1>
            <p>React Frontend - Connected to Express Backend</p>
            <div style={{ marginTop: '20px' }}>
                <p>This is the React version of our application.</p>
                <p>Same backend API, better user experience!</p>
            </div>
        </div>
    );
};

export default Home;