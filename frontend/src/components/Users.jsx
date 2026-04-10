import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
const Users = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
         address: '',
         role: '',
    });
    const [users, setUsers] = useState([]);
     const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
   

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://product-management-system-wrvg.onrender.com/api/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                },
            });
       
            setUsers(response.data.users);
            setFilteredUsers(response.data.users);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }

    };
    useEffect(() => {

        fetchUsers();
    }, []);
    const handleSearch = (e) => {
    setFilteredUsers(users.filter(user =>
        user.name.toLowerCase().includes(e.target.value.toLowerCase())
    ));
}
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://product-management-system-wrvg.onrender.com/api/users/add', 
               formData,
             {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                },
            });
            

            if (response.data.success) {
                alert('User added successfully');
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    address: '',
                    role: '',
                });
               fetchUsers();
            } else {
                console.error('Error adding user:', response.data);
                alert('Failed to add user,try again.');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user, try again.');
        }
    };
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (confirmDelete) {
            try {
               const response = await axios.delete(`https://product-management-system-wrvg.onrender.com/api/users/${id}`, {           
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                    },
                });
                if (response.data.success) {
                alert('User deleted successfully');
                fetchUsers();
                } else {                   
                 console.error('Error deleting user:',response.data);
                    alert('Failed to delete user,try again.');
                }
            }
            catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user,try again.');
            }
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
         setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
       
    };

    if (loading) {
        return <div className='p-4'>Loading users...</div>;
    }

    return (
        <div className='p-4'>
            <h1 className='text-2xl  ml-2 font-bold mb-8'>Users Management</h1>
            <div className='flex flex-col lg:flex-row gap-4'>
                <div className='lg:w-1/3'>
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <h2 className='text-center text-xl font-bold mb-4'>Add User</h2>
                        <form className='space-y-4' onSubmit={handleSubmit} >
                            <div>
                                <input
                                    type="text"
                                    placeholder='Enter Name'
                                    value={formData.name}
                                    name="name"
                                    className='border p-2 rounded-md w-full'
                                   
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder='Enter Email'
                                    value={formData.email}
                                    name="email"
                                    className='border p-2 rounded-md w-full'
                                    
                                    onChange={handleChange} />

                                
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder='Enter Password'
                                    value={formData.password}
                                    name="password"
                                    className='border p-2 rounded-md w-full'
                                    
                                    onChange={handleChange} />

                                
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder='Enter Address'
                                    name="address"
                                    value={formData.address}
                                    className='border p-2 rounded-md w-full'
                                    
                                    onChange={handleChange} />

                                
                            </div>
                            <select name="role" className='border p-2 rounded-md w-full'value={formData.role} onChange={handleChange}>
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="customer">Customer</option>
                            </select>
                            <div className='flex space-x-2'>
                            </div>
                            <button type='submit' className='w-full rounded bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600 transition mt-2'>
                                Add User
                            </button>
                        </form>
                    </div>
                </div>
                <div className='lg:w-2/3' >
                <input type="text" placeholder='Search'className='p-2 bg-white w-full mb-4 rounded'onChange={handleSearch} />
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <table className='w-full border-collapse border border-gray-200'>
                            <thead>
                                <tr className='bg-gray-100'>
                                    <th className='border border-gray-200 p-2'> S.No</th>
                                    <th className='border border-gray-200 p-2'>Name</th>
                                    <th className='border border-gray-200 p-2'>Email</th>
                                    <th className='border border-gray-200 p-2'>Address</th>
                                    <th className='border border-gray-200 p-2'>Role</th>
                                    <th className='border border-gray-200 p-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers && filteredUsers.map((user, index) => (
                                    <tr key={user._id}>
                                        <td className='border border-gray-200 p-2'>{index + 1}</td>
                                        <td className='border border-gray-200 p-2'>{user.name}</td>
                                        <td className='border border-gray-200 p-2'>{user.email}</td>
                                        <td className='border border-gray-200 p-2'>{user.address}</td>
                                        <td className='border border-gray-200 p-2'>{user.role}</td>
                                        <td className='border border-gray-200 p-2'>
                                           
                                            <button className='bg-red-500 text-center text-white p-2 rounded-md hover:bg-red-600 transition'
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                                            {filteredUsers.length === 0 && <div className='text-center p-4'>No users found.</div>}
                                

                    </div>

                </div>
            </div>
        </div>
    );
};



export default Users;
