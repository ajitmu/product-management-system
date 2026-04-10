import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Suppliers = () => {
    const [addModal, setAddModal] = useState(false);
    const [editsupplier, setEditSupplier] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
   
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
     const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/api/supplier', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                },
            });
           
            setSuppliers(response.data.suppliers);
                setFilteredSuppliers(response.data.suppliers);
            
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }

    };
    useEffect(() => {

        fetchSuppliers();
    }, []);
    const handleEdit = (supplier) => {
        setFormData({
            name: supplier.name,    
            email: supplier.email,
            phone: supplier.phone,
            address: supplier.address
        });
        setEditSupplier(supplier._id);
        setAddModal(true);
    };
    const closeModal = () => {
        setAddModal(false);
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: ''
        });
        setEditSupplier(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editsupplier) {
            try {
            const response = await axios.put(`http://localhost:3000/api/supplier/${editsupplier}`, 
                formData,
             {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                },
            });

            if (response.data.success) {
                fetchSuppliers();
                alert('supplier updated successfully');
                setAddModal(false);
                setEditSupplier(null);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    address: ''
                });
            } else {
                alert('Failed to update supplier,try again.');
            }
        } catch (error) {
            console.error('Error updating supplier:', error);
            alert('Failed to update supplier,try again.');
        }
        }
        else {
        try {
            const response = await axios.post('http://localhost:3000/api/supplier/add', 
                formData,
             {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                },
            });

            if (response.data.success) {
                  fetchSuppliers();
                alert('supplier added successfully');
                setAddModal(false);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    address: ''
                });
            } else {
                alert('Failed to add supplier,try again.');
            }
        } catch (error) {
            console.error('Error adding supplier:', error);
            alert('Failed to add supplier,try again.');
        }
    }
      }
 const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this supplier?');
        if (confirmDelete) {
            try {
               const response = await axios.delete(`http://localhost:3000/api/supplier/${id}`, {           
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                    },
                });
                if (response.data.success) {
                alert('Supplier deleted successfully');
                fetchSuppliers();
                } else {                   
                  if(error.response){
                     
                    alert(error.response.data.message);
                } else {
                alert('Failed to delete supplier,try again.');
                }
                }
            }
              catch (error) {
                if(error.response){
                    alert(error.response.data.message);
                } else {
                alert('Failed to delete supplier,try again.');
                }
            }
        }
    }
const handleSearch = (e) => {
    setFilteredSuppliers(suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        supplier.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
        supplier.phone.toLowerCase().includes(e.target.value.toLowerCase()) ||
        supplier.address.toLowerCase().includes(e.target.value.toLowerCase())
    ));
}
        return (
            <div className='p-4 w-full h-full flex flex-col gap-4'>
                <h1 className='text-2xl font-bold'>Supplier Management</h1>
                <div className='flex justify-between items-center'>
                    <input type="text" placeholder='Search Suppliers...' className='border p-1 bg-white rounded px-4'
                    onChange={handleSearch} />
                    <button className='px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer'
                        onClick={() => setAddModal(1)} >Add Supplier</button>
                
                </div>
               
                {loading ?<div>Loading suppliers...</div> : (
                     <div>
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-gray-300' >
                                <th className='border p-2'>S NO</th>
                                <th className='border p-2'>Supplier Name</th>
                                <th className='border p-2'>Email</th>
                                <th className='border p-2'>Phone</th>
                                <th className='border p-2'>Address</th>
                                <th className='border p-2'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSuppliers.map((supplier, index) => (
                                <tr key={supplier._id}>
                                    <td className='border p-2'>{index + 1}</td>
                                    <td className='border p-2'>{supplier.name}</td>
                                    <td className='border p-2'>{supplier.email}</td>
                                    <td className='border p-2'>{supplier.phone}</td>
                                    <td className='border p-2'>{supplier.address}</td>
                                    <td className='border p-2'>
                                        <button className='px-2 py-1 bg-green-500 text-white rounded cursor-pointer mr-2'
                                          onClick={()=> handleEdit(supplier)} >
                                            Edit
                                            </button>
                                        <button className='px-2 py-1 bg-red-500 text-white rounded cursor-pointer'
                                          onClick={() => handleDelete(supplier._id)} >
                                            Delete
                                            </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredSuppliers.length === 0 && <div className='text-center p-4'>No suppliers found.</div>}
                    </div>

                )}

                {addModal && (
                    <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center'>
                        <div className='bg-white p-4 rounded shadow-md w-1/3 relative'>
                            <h2 className='text-xl font-bold'>Add Supplier</h2>
                            <button className='absolute top-4 right-4 font-bold text-lg cursor-pointer' onClick={closeModal}>x</button>

                            <form className='flex flex-col gap-4 mt-4' onSubmit={handleSubmit}>
                                <input
                                    className='border p-1 bg-white rounded px-4'
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder='Supplier Name'

                                />
                                <input
                                    className='border p-1 bg-white rounded px-4'
                                    id='supplierEmail'
                                    type='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder='Supplier Email'
                                />
                                <input
                                    className='border p-1 bg-white rounded px-4'
                                    id='supplierPhone'
                                    type='text'
                                    name='phone'
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder='Supplier Phone Number'
                                />
                                <input
                                    className='border p-1 bg-white rounded px-4'
                                    id='supplierAddress'
                                    type='text'
                                    name='address'
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder='Supplier Address'
                                />
                               
                                       <div className='flex space-x-2'>
                                <button type='submit' className='w-full rounded bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600 transition mt-2'>{addModal ? 'Save Changes' : 'Add Supplier'}</button>
                                {
                                    editsupplier && (<button type='button' className='w-full rounded bg-red-500 text-white p-3 cursor-pointer hover:bg-red-600 transition mt-2' onClick={
                                        closeModal
                                    }>
                                        Cancel
                                    </button>)

                                }
                            </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        )
    
}
    export default Suppliers
