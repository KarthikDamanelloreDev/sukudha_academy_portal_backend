require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../features/auth/auth.schema');

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        const adminEmail = 'sukudhaadmin@gmail.com';
        const adminPassword = '123456';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists:', adminEmail);

            // Optionally update password if needed
            existingAdmin.password = adminPassword;
            existingAdmin.role = 'admin'; // Ensure role is admin
            await existingAdmin.save();
            console.log('Admin password updated successfully.');
        } else {
            // Create new admin
            await User.create({
                fullName: 'Sukudha Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            console.log('Admin user created successfully!');
            console.log('Email:', adminEmail);
            console.log('Password:', adminPassword);
        }

        console.log('Seeding completed.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
