/* eslint-disable no-console */
import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import envVar from './config/config.js';
import connectDB from './config/dbConn.js';

connectDB()
  .then(() => {
    app.listen(envVar.port, async () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.log('error while connecting to db', error);
  });
