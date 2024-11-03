import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import 'reflect-metadata';
import { AppDataSource } from './config/ormconfig';

import authRoutes from './routes/authRoutes';
import careCharacteristicRoutes from './routes/careCharacteristicRoutes';
import serviceRoutes from './routes/serviceRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/services', serviceRoutes);

app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use('/api/care-characteristics', careCharacteristicRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
