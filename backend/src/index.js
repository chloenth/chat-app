import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';

dotenv.config(); // load environment variables from a .env file into the process.env object in Node.js.
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser()); // allow to parse the cookie

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log('Server is running on PORT: ' + PORT);
  connectDB();
});
