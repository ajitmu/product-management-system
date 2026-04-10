import React from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

const Logout = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    logout();
    navigate('/login');
    return (
        <div className='flex items-center justify-center h-screen'>
            <h1 className='text-3xl font-bold'>Logging out...</h1>
        </div>
    )
  }

export default Logout
