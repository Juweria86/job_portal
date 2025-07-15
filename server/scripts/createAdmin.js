const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteOne({ username: 'admin' }); // Remove existing admin

    const admin = new User({
      username: 'admin',
      password: 'admin123', // will be hashed by pre-save hook
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();