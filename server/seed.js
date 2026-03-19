const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const exists = await User.findOne({ email: 'admin@sses.com' });
    if (exists) {
      console.log('Admin already exists!');
      process.exit();
    }

    await User.create({
      name: 'Super Admin',
      email: 'admin@sses.com',
      password: 'admin@123',
      role: 'admin',
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Email   : admin@sses.com');
    console.log('🔑 Password: admin@123');
    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

seedAdmin();
