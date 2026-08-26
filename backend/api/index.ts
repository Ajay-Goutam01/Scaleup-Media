import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '../src/app';
import { connectDB } from '../src/config/db';
import { store } from '../src/services/store';

let isInitialized = false;

async function initServerless() {
  if (!isInitialized) {
    const isMongoConnected = await connectDB();
    store.setMongoConnected(isMongoConnected);
    isInitialized = true;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initServerless();
  // Pass request to Express application instance
  return app(req as any, res as any);
}
