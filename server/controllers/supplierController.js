import Supplier from '../models/Supplier.js';
import ProductModel from '../models/Product.js';
const addSupplier = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const existingSupplier = await Supplier.findOne({ email });
        if (existingSupplier) {
            return res.status(400).json({ success: false, message: 'Supplier already exists' });
        }
        const newSupplier = new Supplier({ name, email, phone, address });
        await newSupplier.save();
        return res.status(201).json({ success: true, message: 'Supplier added successfully' });
    } catch (error) {
        console.error('Error adding supplier:', error);
        return res.status(500).json({ success: false, message: 'Server error' });

    }
}
const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        return res.status(200).json({ success: true, suppliers });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        return res.status(500).json({ success: false, message: 'Server error in supplier' });
    }
}
const updateSupplier = async (req, res) => {
    try {
        const {id} = req.params;
        const { name, email, phone, address } = req.body;
        const existingSupplier = await Supplier.findById(id);
        if (!existingSupplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }
        const updatedSupplier = await Supplier.findByIdAndUpdate(id, { name, email, phone, address }, { new: true });
        return res.status(200).json({ success: true, message: 'Supplier updated successfully', supplier: updatedSupplier });
    } catch (error) {
    console.error('Error updating supplier:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
};
}
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
         const productCount = await ProductModel.countDocuments({ supplierId: id, isDeleted: false });
        if (productCount > 0) {
            return res.status(400).json({ success: false, message: 'Cannot delete supplier with associated products' });
        }
        const existingSupplier = await Supplier.findById(id);   
        if (!existingSupplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }
        await Supplier.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }       
}
export { addSupplier, getSuppliers, updateSupplier,deleteSupplier};