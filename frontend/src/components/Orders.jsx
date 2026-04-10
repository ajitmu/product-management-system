import React from 'react'
import { useState, useEffect } from "react";
import axios from "axios";
const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
      const fetchOrders = async () => {
        try {
          const response = await axios.get('https://product-management-system-wrvg.onrender.com/api/orders', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('pos-token')}`
            },
          });
          if(response.data.success){
            setOrders(response.data.orders);
          }else{
            console.error('Error fetching products:', response.data);
            alert('Failed to fetch products,try again.');
          }
          
    
        } catch (error) {
           
          console.error('Error fetching orders:', error);
          setLoading(false);
        }
      }
        useEffect(() => {
        fetchOrders();
      }, []);

  return (
      <div className='p-4 w-full h-full flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Orders</h1>
      

       <div>
                    <table className='w-full border-collapse border border-gray-300 mt-4'>
                        <thead>
                            <tr className='bg-gray-300'>
                                <th className='border p-2'>S NO</th>
                                <th className='border p-2'>Product Name</th>
                                <th className='border p-2'>Category Name</th>
                                <th className='border p-2'> Quantity</th>
                                <th className='border p-2'>Total Price</th>
                                <th className='border p-2'>Date</th>

                            </tr>
                        </thead>
                        <tbody>
                            {orders && orders.map((order, index) => (
                                <tr key={order._id}>
                                    <td className='border  p-2'>{index + 1}</td>
                                    <td className='border  p-2'>{order.product.name}</td>
                                    <td className='border  p-2'>{order.product.categoryId.categoryName }</td>
                                    <td className='border  p-2'>{order.quantity}
                                    
                                    </td>
                                    <td className='border  p-2'>{order.totalPrice}
                                    </td>
                                    <td className='border p-2'>
                                        {new Date(order.orderDate).toLocaleDateString()}
                                      
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && <div className='text-center p-4'>No orders found.</div>}
                    </div>
    </div>
  )
}

export default Orders;
