import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { connectDB } from './config/db';
import { store } from './services/store';

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const startServer = async () => {
  const isMongoConnected = await connectDB();
  store.setMongoConnected(isMongoConnected);

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  🚀 ScaleUp Media REST API Server Running`);
    console.log(`  📍 Local: http://localhost:${PORT}`);
    console.log(`  🔗 Client URL: ${CLIENT_URL}`);
    console.log(`  🛡️  Security: Helmet + Rate Limiter Active`);
    console.log(`  📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`====================================================`);
  });
};

startServer();

export default app;
