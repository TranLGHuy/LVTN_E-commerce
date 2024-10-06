import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh', 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            textAlign: 'center', 
            padding: '20px', 
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Unauthorized Access</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                Sorry, you do not have permission to access this page.
            </p>
            <Link to="/login" style={{ 
                margin: '10px', 
                padding: '10px 20px', 
                textDecoration: 'none', 
                backgroundColor: '#007bff', 
                color: '#fff', 
                borderRadius: '5px' 
            }}>
                Go to Login
            </Link>
            <Link to="/" style={{ 
                margin: '10px', 
                padding: '10px 20px', 
                textDecoration: 'none', 
                backgroundColor: '#007bff', 
                color: '#fff', 
                borderRadius: '5px' 
            }}>
                Go to Home
            </Link>
        </div>
    );
};

export default Unauthorized;
