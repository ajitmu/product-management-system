import bcrypt from 'bcrypt';
import User from './models/User.js';
import connectDB from './db/connection.js';

const register = async () => {
    try {
        connectDB();
        const hashedPassword = await bcrypt.hash('admin', 10);
        const user = new User({
            name: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            address: 'admin address',
            role: 'admin'
        });
        await user.save();
        console.log('User registered successfully!');
    } catch (error) {
        console.error('Error registering user:', error);
    }
};

register();  
//eisko run karne ke liye terminal me jaake "node server/seed.js" command run karo. Ye command ek admin user create karega jiska email "