import mongoose from 'mongoose';

// Connection cache object across serverless lambda invocations
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export const connectDB = async (): Promise<boolean> => {
  // If already connected, reuse existing connection immediately
  if ((mongoose.connection.readyState as number) === 1) {
    return true;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scaleup_media';

  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 3000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      })
      .then((m) => {
        console.log(`[Database] MongoDB Connected Successfully: ${m.connection.host}`);
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        console.warn(`[Database] MongoDB connection notice: ${err.message}`);
        console.log('[Database] Operating with resilient store mode for instant responsiveness.');
        return null as any;
      });
  }

  try {
    cached.conn = await cached.promise;
    return !!(cached.conn && (mongoose.connection.readyState as number) === 1);
  } catch (err: any) {
    console.warn(`[Database] Error awaiting connection: ${err.message}`);
    return false;
  }
};
