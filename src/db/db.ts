import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    const DB_URL = process.env.MONGO_URL;
    if (!DB_URL) {
        console.error('MongoDB URI is not defined in environment variables');
        return;
      }
    try {
        await mongoose.connect(DB_URL);
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err);
        throw err
    }
};
  
  const closeDB = async () => {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
    }
  };
  
  const dbSignals = () => {
    const cleanUp = async (signal: string) => {
      console.log(`${signal} received. Closing MongoDB connection.`);
      await closeDB();
      process.exit(0);
    };
  
    process.on('SIGINT', () => cleanUp('SIGINT'));
  };

export {connectDB, closeDB, dbSignals };
