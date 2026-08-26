/**
 * ScaleUp Media — Development Admin Creation Script
 * Usage: npm run admin:create
 *
 * This script is for DEVELOPMENT ONLY.
 * It is strictly blocked in production environments.
 */

import dotenv from 'dotenv';
dotenv.config();

import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import crypto from 'crypto';
import { connectDB } from '../src/config/db';
import { Admin } from '../src/models/Admin';
import { store } from '../src/services/store';

// Production safety gate
if (process.env.NODE_ENV === 'production' || process.env.ALLOW_DEV_ADMIN_SCRIPTS === 'false') {
  console.error('\n❌ Admin development scripts are disabled outside development.\n');
  process.exit(1);
}

const generateTempPassword = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*';
  let pwd = '';
  const bytes = crypto.randomBytes(12);
  for (let i = 0; i < 12; i++) {
    pwd += chars[bytes[i] % chars.length];
  }
  return pwd;
};

const run = async () => {
  console.log('\nScaleUp Media Admin Setup\n');

  await connectDB();

  // Check if an admin already exists
  const existingCount = await store.countAdmins();
  if (existingCount > 0) {
    console.log('An admin account already exists.\n');
    console.log('Use the password reset script if you need to reset the existing admin account.\n');
    process.exit(0);
  }

  const rl = readline.createInterface({ input, output });

  try {
    const nameAnswer = await rl.question('Enter admin name:\n> ');
    const name = nameAnswer.trim();
    if (!name) {
      console.error('\n❌ Error: Admin name cannot be empty.\n');
      process.exit(1);
    }

    const emailAnswer = await rl.question('\nEnter admin email:\n> ');
    const email = emailAnswer.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      console.error('\n❌ Error: Please provide a valid email address.\n');
      process.exit(1);
    }

    // Double check email uniqueness
    const existingAdmin = await store.findAdminByEmail(email);
    if (existingAdmin) {
      console.log('\nAn admin account already exists.\n');
      console.log('Use the password reset script if you need to reset the existing admin account.\n');
      process.exit(0);
    }

    const tempPassword = generateTempPassword();

    // Create the admin — the pre-save hook will hash tempPassword with bcrypt before saving to MongoDB
    await Admin.create({
      name,
      email,
      password: tempPassword,
      role: 'superadmin',
      mustChangePassword: true,
    });

    console.log('\nAdmin account created successfully.\n');
    console.log('Name:');
    console.log(name);
    console.log('\nEmail:');
    console.log(email);
    console.log('\nTemporary Password:');
    console.log(tempPassword);
    console.log('\nIMPORTANT:');
    console.log('This password is temporary.');
    console.log('Login with this password and change it immediately.\n');

    process.exit(0);
  } finally {
    rl.close();
  }
};

run().catch((err) => {
  console.error('\n❌ Unexpected error creating admin:', err.message, '\n');
  process.exit(1);
});
