import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const CustomerProducts = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [orderData, setOrderData] = useState({
        productId: '',
        quantity: 1,
        total: 0,
        stock: 0,
        price: 0
    });
    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://product-management-system-wrvg.onrender.com/api/products', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                },
            });
            if (response.data.success) {
                setCategories(response.data.categories);
                setProducts(response.data.products);
                setFilteredProducts(response.data.products);
            } else {
                console.error('Error fetching products:', response.data);
                alert('Failed to fetch products,try again.');
            }


        } catch (error) {
            console.error('Error fetching suppliers:', error);
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchProducts();
    }, []);
    const handleSearch = (e) => {
        setFilteredProducts(products.filter(product =>
            product.name.toLowerCase().includes(e.target.value.toLowerCase())
        ));
    }
    const handleChangeCategory = (e) => {
        setFilteredProducts(products.filter(product =>
            product.categoryId._id === e.target.value
        ));
    }
    const handleOrderChange = (product) => {
        if (product.stock === 0) {  
        alert('You cannot buy this product as it is out of stock');
        return;
    }

        setOrderData({
            productId: product._id,
            quantity: 1,
            total: product.price,
            stock: product.stock,
            price: product.price
        });
        setOpenModal(true);

    }
    
    const closeModal = () => {
        setOpenModal(false);
     }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
               const response = await axios.post('https://product-management-system-wrvg.onrender.com/api/orders/add',orderData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                },
            });
            if (response.data.success) {
                setOpenModal(false);
                setOrderData({
                    productId: '',
                    quantity: 1,
                    stock: 0,
                    total: 0,
                    price: 0
                });
                await fetchProducts();
             
        alert('Order placed successfully');
            }
     
        } catch (error) {
            console.log(error);
         alert("error",error.message);
        }
    }
        
    // const increaseQuantity = (e) => {
    //     if (e.target.value > orderData.stock) {
    //         alert('not enough stock available');
    // }else {
    //     setOrderData((prev) => ({
    //         ...prev,
    //         quantity: parseInt(e.target.value), 
    //         total: parseInt(e.target.value) * parseInt(orderData.price)
    //     }));
    // }
    // }
    const increaseQuantity = (e) => {
    const newQty = parseInt(e.target.value);
    
    if (newQty > orderData.stock) {
        alert('not enough stock available');
    } else {
        setOrderData((prev) => ({
            ...prev,
            quantity: newQty,
            total: newQty * parseInt(orderData.price)
        }));
    }
}
    return (
        <div>
            <div className="py-4 px-6">
                <h2 className="font-bold text-xl ">Products</h2>
            </div>
            <div className="py-4 px-6 flex justify-between item-center">
                <div>
                    <select name="category" id="" className="bg-white border p-1 rounded"
                        onChange={handleChangeCategory}>
                        <option value="">Select Categories</option>
                        {categories.map((cat, index) => (
                            <option value={cat._id}>{cat.categoryName}</option>
                        ))}
                    </select>
                </div>
                <div>

                    <input type="text" placeholder='Search Products...' className=' border p-1 bg-white rounded px-4'
                        onChange={handleSearch} />
                </div>
            </div>
            <div>
                <table className='w-full border-collapse border border-gray-300 mt-4'>
                    <thead>
                        <tr className='bg-gray-300'>
                            <th className='border p-2'>S NO</th>
                            <th className='border p-2'>Product Name</th>
                            <th className='border p-2'>Category Name</th>
                            <th className='border p-2'>Price</th>
                            <th className='border p-2'>Stock</th>

                            <th className='border p-2'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {setFilteredProducts && filteredProducts.map((product, index) => (
                            <tr key={product._id}>
                                <td className='border  p-2'>{index + 1}</td>
                                <td className='border  p-2'>{product.name}</td>
                                <td className='border  p-2'>{product.categoryId.categoryName}</td>

                                <td className='border  p-2'>{product.price}
                                </td>

                                <td className='border  p-2 '>
                                    <span className='rounded-full font-semibold ' >
                                        {product.stock == 0 ? (
                                            <span className='text-red-500 bg-red-100 px-2 py-1'>{product.stock}</span>
                                        ) : product.stock < 5 ? (
                                            <span className='text-yellow-500 font-bold bg-yellow-100 px-2 py-1'>{product.stock}</span>
                                        ) : (
                                            <span className='text-green-500 font-bold bg-green-100 px-2 py-1'>{product.stock}</span>
                                        )}
                                    </span>
                                </td>

                                <td className='border p-2'>
                                    <button
                                        onClick={() => handleOrderChange(product)}
                                        className='px-2 py-1 bg-green-500 text-white rounded cursor-pointer mr-2'

                                    >
                                        Order
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && <div className='text-center p-4'>No products found.</div>}
            </div>
            {openModal && (
                <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-20'>
                    <div className='bg-white p-4 rounded shadow-md w-1/3 relative'>
                        <h2 className='text-xl font-bold'>Place Order</h2>
                        <button className='absolute top-4 right-4 font-bold text-lg cursor-pointer' onClick={closeModal}>x</button>

                        <form className='flex flex-col gap-4 mt-4' onSubmit={handleSubmit}>
                            <input
                                className='border p-1 bg-white rounded px-4'
                                type='number'
                                name='quantity'
                                value={orderData.quantity}
                                onChange={increaseQuantity}
                                min="1"
                                placeholder='Increase Quantity'

                            />
                            <p>Total:{orderData.quantity * orderData.price}</p>

                            <div className='flex space-x-2'>
                                <button type='submit' className='w-full rounded bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600 transition mt-2'
                                >
                                    Save Changes</button>
       
                                <button
                                    type='button' className='w-full rounded bg-red-500 text-white p-3 cursor-pointer hover:bg-red-600 transition mt-2'
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>
                    </div>

                </div>


            )}
        </div>
    )
}

export default CustomerProducts