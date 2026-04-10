import React from 'react'
import { FaBox, FaHome, FaShoppingCart, FaSignOutAlt, FaTable, FaTruck ,FaUsers,FaCog } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';
const Sidebar = () => {
    const menuItems = [
        { name: "Dashboard", path: '/admin/dashboard', icon: <FaHome />, isParent: true },
        { name: "Categories", path: '/admin/dashboard/categories', icon: <FaTable />, isParent: false },
        { name: "Products", path: '/admin/dashboard/products', icon: <FaBox />, isParent: false },
        { name: "Suppliers", path: '/admin/dashboard/suppliers', icon: <FaTruck />, isParent: false },
        { name: "Orders", path: '/admin/dashboard/orders', icon: <FaShoppingCart />, isParent: false },
        { name: "Users", path: '/admin/dashboard/users', icon: <FaUsers />, isParent: false },
        { name: "Profile", path: '/admin/dashboard/profile', icon: <FaCog />, isParent: false },
        { name: "Logout", path: '/admin/dashboard/logout', icon: <FaSignOutAlt />, isParent: false },
    ];
    const customerItems = [
        // { name: "Dashboard", path: '/customer/dashboard', icon: <FaHome />, isParent: true },
       { name: "Products", path: '/customer/dashboard/products', icon: <FaBox />, isParent: false },
        { name: "Orders", path: '/customer/dashboard/orders', icon: <FaShoppingCart />, isParent: false },

        { name: "Profile", path: '/customer/dashboard/profile', icon: <FaCog />, isParent: false },
        { name: "Logout", path: '/customer/dashboard/logout', icon: <FaSignOutAlt />, isParent: false },
    ];
 const {user} = useAuth();
 const [menulinks, setMenulinks] = useState(customerItems);
    useEffect(() => {
        if(user && user.role === 'admin'){
            setMenulinks(menuItems);
        }

    }, [user])

    return (

        <div className='flex flex-col h-screen bg-black text-white w-16 md:w-64 fixed '>
            <div className='h-16 flex flex-item justify-center'>
                <span className=' mt-8 mr-11 hidden md:block text-xl font-bold' >PRODUCT MS</span>
                <span className='md:hidden text-xl font-bold' >PMS</span>

            </div>
            <div>
                <ul className='space-y-2 p-2'>
                    {menulinks.map((item) => (
                        <li key={item.name} >
                            <NavLink
                            end={item.isParent}
                            className={({ isActive }) =>(isActive ? 'bg-gray-700' :"")  + ' flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors duration-200'}
                            to={item.path}
                            >
                                <span className='text-xl'>{item.icon}</span>
                                <span className=' ml-2 hidden md:block'>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    )
}

export default Sidebar
