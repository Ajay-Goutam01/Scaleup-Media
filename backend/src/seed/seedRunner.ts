import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from '../config/db';
import { store } from '../services/store';

const runSeed = async () => {
  console.log('[Seed] Starting ScaleUp Media database seeding...');
  const isConnected = await connectDB();
  store.setMongoConnected(isConnected);
  await store.syncToMongo();
  console.log('[Seed] ScaleUp Media database seeding completed successfully!');
  process.exit(0);
};

runSeed().catch((err) => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
