import mongoose from 'mongoose';

// Connection cache object across serverless lambda invocations
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
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

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[Database] Notice: MONGODB_URI environment variable is not configured.');
      return false;
    }
  }

  const effectiveUri = uri || 'mongodb://127.0.0.1:27017/scaleup_media';

  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    cached.promise = mongoose
      .connect(effectiveUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        bufferCommands: false,
      })
      .then((m) => {
        console.log(`[Database] MongoDB Connected Successfully: ${m.connection.host}`);
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        cached.conn = null;
        console.warn(`[Database] MongoDB connection notice: ${err.message}`);
        console.log('[Database] Operating with resilient store mode for instant responsiveness.');
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
    return !!(cached.conn && (mongoose.connection.readyState as number) === 1);
  } catch (err: any) {
    cached.promise = null;
    cached.conn = null;
    console.warn(`[Database] Error awaiting connection: ${err.message}`);
    return false;
  }
};

export const getDbStatus = (): string => {
  const state = mongoose.connection.readyState as number;
  const statusMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return statusMap[state] || 'unknown';
};
