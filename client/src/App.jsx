// /client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import Navbar from './components/Navbar.jsx';  // ← .jsx
import Home from './pages/Home.jsx';           // ← .jsx
import Login from './pages/Login.jsx';         // ← .jsx
import Register from './pages/Register.jsx';   // ← .jsx
import Dashboard from './pages/Dashboard.jsx'; // ← .jsx
import './App.css';
function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;