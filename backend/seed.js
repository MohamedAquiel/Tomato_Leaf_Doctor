
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const ADMIN = {
  name: 'Admin',
  email: process.env.ADMIN_EMAIL || 'admin@tomatoapp.com',
  password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  role: 'admin',
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log(`♻️  Existing user promoted to admin: ${ADMIN.email}`);
      } else {
        console.log(`ℹ️  Admin already exists: ${ADMIN.email}`);
      }
    } else {
      await User.create(ADMIN);
      console.log(`🌱 Admin user created successfully!`);
    }

    console.log('');
    console.log('─────────────────────────────────────');
    console.log('  Admin Credentials');
    console.log('─────────────────────────────────────');
    console.log(`  Email    : ${ADMIN.email}`);
    console.log(`  Password : ${ADMIN.password}`);
    console.log('─────────────────────────────────────');
    console.log('');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
