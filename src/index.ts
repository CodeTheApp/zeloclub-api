import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import 'reflect-metadata';
import { AppDataSource } from './config/ormconfig';
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/services', serviceRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
