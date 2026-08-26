/**
 * ScaleUp Media — Development Admin Password Reset Script
 * Usage: npm run admin:reset
 *
 * This script is for DEVELOPMENT ONLY.
 * It is strictly blocked in production environments.
 */

import dotenv from 'dotenv';
dotenv.config();

import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/config/db';
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
  console.log('\nScaleUp Media Admin Password Reset\n');

  await connectDB();

  const rl = readline.createInterface({ input, output });

  try {
    const emailAnswer = await rl.question('Enter admin email:\n> ');
    const email = emailAnswer.trim().toLowerCase();

    if (!email) {
      console.error('\n❌ Error: Admin email cannot be empty.\n');
      process.exit(1);
    }

    const admin = await store.findAdminByEmail(email);
    if (!admin) {
      console.log('\nNo admin account found for this email.\n');
      process.exit(0);
    }

    const tempPassword = generateTempPassword();
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    await store.resetAdminPassword(email, hashedPassword);

    console.log('\nAdmin password reset successfully.\n');
    console.log('Email:');
    console.log(admin.email);
    console.log('\nTemporary Password:');
    console.log(tempPassword);
    console.log('\nYou must change this password after login.\n');

    process.exit(0);
  } finally {
    rl.close();
  }
};

run().catch((err) => {
  console.error('\n❌ Unexpected error resetting admin password:', err.message, '\n');
  process.exit(1);
});
