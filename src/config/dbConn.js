/* eslint-disable no-console */
import mongoose from 'mongoose';

import envVar from './config.js';

mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(envVar.mongoUri);
    if (conn) {
      console.log(
        `database successfully connected to host ${conn.connection.host} port ${conn.connection.port} `
      );
    }
    return conn;
  } catch (error) {
    console.log('error while connecting to db', error);
    process.exit(1);
  }
};

export default connectDB;
