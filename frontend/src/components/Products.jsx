import React, { useState, useEffect } from 'react'
import axios from 'axios';
const Product = () => {
  const [openModal, setopenModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    supplierId: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://product-management-system-wrvg.onrender.com/api/products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`
        },
      });
      if(response.data.success){
        setSuppliers(response.data.suppliers);
      setCategories(response.data.categories);
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
      }else{
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
   const handleEdit = (product) => {
    setopenModal(true);
    setEditProduct(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId._id,
      supplierId: product.supplierId._id,
    });
    
  }
  const handleSearch = (e) => {
    setFilteredProducts(products.filter(product =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase())
    ));
}
  const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (confirmDelete) {
            try {
               const response = await axios.delete(`https://product-management-system-wrvg.onrender.com/api/products/${id}`, {           
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                    },
                });
                if (response.data.success) {
                alert('Product deleted successfully');
                fetchProducts();
                } else {                   
                 console.error('Error deleting product:',response.data);
                    alert('Failed to delete product,try again.');
                }
            }
            catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product,try again.');
            }
        }
    }
  const closeModal = () => {
    setopenModal(false);
    setEditProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
      supplierId: ''
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editProduct) {
      try {
        const resonse = await axios.put(`https://product-management-system-wrvg.onrender.com/api/products/${editProduct}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('pos-token')}`
            },
          });
        if (resonse.data.success) {
          alert('Product updated successfully');
          fetchProducts();
         closeModal();
          setEditProduct(null);
          setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            categoryId: '',
            supplierId: ''
          });
        }else {
          alert('Failed to update product,try again.');
        }

      } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product,try again.');
        return;
      }
    }
else{
   try {
            const response = await axios.post('https://product-management-system-wrvg.onrender.com/api/products/add', 
                formData,
             {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                },
            });

            if (response.data.success) {
                  fetchProducts();
                alert('Product added successfully');
               closeModal();
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    stock: '',
                    categoryId: '',
                    supplierId: ''
                });
            } else {
                alert('Failed to add product,try again.');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product,try again.');
        }
  };
}

  return (
    <div className='p-4 w-full h-full flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Product Management</h1>
      <div className='flex justify-between items-center'>
        <input type="text" placeholder='Search Products...' className='border p-1 bg-white rounded px-4'
         onChange={handleSearch}  />
        <button className='px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer'
          onClick={() => setopenModal(true)} >Add Product</button>

      </div>

       <div>
                    <table className='w-full border-collapse  '>
                        <thead>
                            <tr className='bg-gray-300' >
                                <th className='border p-2'>S NO</th>
                                <th className='border p-2'>Product Name</th>
                                <th className='border p-2'>Category Name</th>
                                <th className='border p-2'>Supplier Name</th>
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
                                    <td className='border  p-2'>{product.categoryId.categoryName }</td>
                                    <td className='border  p-2'>{product.supplierId.name}
                                    
                                    </td>
                                    <td className='border  p-2'>{product.price}
                                    </td>
                                    
                                    <td className='border  p-2 '>
                                      <span className='rounded-full font-semibold ' >
                                        {product.stock==0 ? (
                                          <span className='text-red-500 bg-red-100 px-2 py-1'>{product.stock}</span>
                                        ) :product.stock <5 ? (
                                          <span className='text-yellow-500 font-bold bg-yellow-100 px-2 py-1'>{product.stock}</span>
                                        ) : (
                                          <span className='text-green-500 font-bold bg-green-100 px-2 py-1'>{product.stock}</span>
                                        ) }
                                      </span>
                                    </td>

                                    <td className='border p-2'>
                                        <button className='px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer mr-2'
                                          onClick={()=> handleEdit(product)} >
                                            Edit
                                            </button>
                                        <button className='px-2 py-1 bg-red-500 text-white rounded cursor-pointer'
                                          onClick={() => handleDelete(product._id)} >
                                            Delete
                                            </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && <div className='text-center p-4'>No products found.</div>}
                    </div>
      {openModal && (
        <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center'>
          <div className='bg-white p-4 rounded shadow-md w-1/3 relative'>
            <h2 className='text-xl font-bold'>Add Product</h2>
            <button className='absolute top-4 right-4 font-bold text-lg cursor-pointer' onClick={closeModal}>x</button>

            <form className='flex flex-col gap-4 mt-4' onSubmit={handleSubmit}>
              <input
                className='border p-1 bg-white rounded px-4'
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Product Name'

              />
              <input
                className='border p-1 bg-white rounded px-4'
                id='productDescription'
                type='text'
                name='description'
                value={formData.description}
                onChange={handleChange}
                placeholder='Product Description'
              />
              <input
                className='border p-1 bg-white rounded px-4'
                id='productPrice'
                type='number'
                name='price'
                  min={"0"}
                value={formData.price}
                onChange={handleChange}
                placeholder='Product Price'
              />
              <input
                className='border p-1 bg-white rounded px-4'
                id='productImage'
                type='number'
                name='stock'
                min={"0"}
                value={formData.stock}
                onChange={handleChange}
                placeholder='Enter Stock'
              />
              <div className='w-full border'>
                <select
                className='w-full p-2'
                  name='categoryId'
                  value={formData.categoryId}
                  onChange={handleChange}
                >
                  <option value=''>Select Category</option>
                  {categories && categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className='w-full border'>
                <select
                className='w-full p-2'
                  name='supplierId'
                  value={formData.supplierId}
                  onChange={handleChange}
                >
                  <option value=''>Select Supplier</option>
                  {suppliers && suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div >
              <div className='flex space-x-2'>
                <button type='submit' className='w-full rounded bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600 transition mt-2'
                >
                  {editProduct ? "Save changes":"Add Product" }</button>
                {
                  editProduct && (<button type='button' className='w-full rounded bg-red-500 text-white p-3 cursor-pointer hover:bg-red-600 transition mt-2'
                    onClick={
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

export default Product
