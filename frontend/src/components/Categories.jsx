import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
const Categories = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editCategory, setEditCategory] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/api/category', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                },
            });
            console.log(response.data.categories);
            setCategories(response.data.categories);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setLoading(false);
        }

    };
    useEffect(() => {

        fetchCategories();
    }, []);
    const handleSumbit = async (e) => {
        e.preventDefault();
        if (editCategory) {
            const response = await axios.put(`http://localhost:3000/api/category/${editCategory}`, {
                categoryName,
                categoryDescription
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                },
            });


            if (response.data.success) {
                setEditCategory(null);
                setCategoryName('');
                setCategoryDescription('');

                alert('Category updated successfully');

                fetchCategories();
            } else {
                console.error('Error updating category:', data);
                alert('Failed to update category,try again.');
            }

        } else {
            const response = await axios.post('http://localhost:3000/api/category/add', {
                categoryName,
                categoryDescription
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                },
            });

            if (response.data.success) {
                alert('Category added successfully');
                setCategoryName('');
                setCategoryDescription('');
                fetchCategories();
            } else {
                alert('Failed to add category,try again.');
            }
        }

    };
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this category?');
        if (confirmDelete) {
            try {
               const response = await axios.delete(`http://localhost:3000/api/category/${id}`, {           
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                    },
                });
                if (response.data.success) {
                alert('Category deleted successfully');
                fetchCategories();
                } else {                   
                 console.error('Error deleting category:',response.data);
                    alert('Failed to delete category,try again.');
                }
            }
            catch (error) {
                if(error.response){
                    alert(error.response.data.message);
                } else {
                alert('Failed to delete category,try again.');
                }
            }
        }
    }
    const handleEdit = async (category) => {
        setEditCategory(category._id);
        setCategoryName(category.categoryName);
        setCategoryDescription(category.categoryDescription);
    };
    const handleCanel = () => {
        setEditCategory(null);
        setCategoryName('');
        setCategoryDescription('');
    };

    if (loading) {
        return <div className='p-4'>Loading categories...</div>;
    }

    return (
        <div className='p-4'>
            <h1 className='text-2xl  ml-2 font-bold mb-8'>Category Management</h1>
            <div className='flex flex-col lg:flex-row gap-4'>
                <div className='lg:w-1/3'>
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <h2 className='text-center text-xl font-bold mb-4'>{editCategory ? 'Edit Category' : 'Add Category'}</h2>
                        <form className='space-y-4' onSubmit={handleSumbit} >
                            <div>
                                <input
                                    type="text"
                                    placeholder='Category Name'
                                    className='border p-2 rounded-md w-full'
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder='Category Description'
                                    className='border p-2 rounded-md w-full'
                                    value={categoryDescription}
                                    onChange={(e) => setCategoryDescription(e.target.value)}
                                />
                            </div>
                            <div className='flex space-x-2'>
                                <button type='submit' className='w-full rounded bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600 transition mt-2'>{editCategory ? 'Save Changes' : 'Add Category'}</button>
                                {
                                    editCategory && (<button type='button' className='w-full rounded bg-red-500 text-white p-3 cursor-pointer hover:bg-red-600 transition mt-2' onClick={
                                        handleCanel
                                    }>
                                        Cancel
                                    </button>)

                                }
                            </div>
                        </form>
                    </div>
                </div>
                <div className='lg:w-2/3'>
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <table className='w-full border-collapse border border-gray-200'>
                            <thead>
                                <tr className='bg-gray-100'>
                                    <th className='border border-gray-200 p-2'> S.No</th>
                                    <th className='border border-gray-200 p-2'>Category Name</th>
                                    <th className='border border-gray-200 p-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category, index) => (
                                    <tr key={index}>
                                        <td className='border border-gray-200 p-2'>{index + 1}</td>
                                        <td className='border border-gray-200 p-2'>{category.categoryName}</td>

                                        <td className='border border-gray-200 p-2'>
                                            <button className='bg-blue-500 text-center text-white mr-2 p-2 rounded-md hover:bg-red-600 transition'
                                                onClick={() => handleEdit(category)}>Edit</button>
                                            <button className='bg-red-500 text-center text-white p-2 rounded-md hover:bg-blue-600 transition'
                                                onClick={() => handleDelete(category._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>

                </div>
            </div>
        </div>
    );
};



export default Categories;
