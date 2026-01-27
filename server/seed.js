const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lawnmower');

        // Check if user exists
        const existingUser = await User.findOne({ email: 'admin@mower.ai' });
        if (existingUser) {
            console.log('Admin user already exists.');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const newUser = new User({
            email: 'admin@mower.ai',
            password: hashedPassword
        });

        await newUser.save();
        console.log('Admin user created: admin@mower.ai / admin123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUser();
