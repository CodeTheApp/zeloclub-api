import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import 'reflect-metadata';
import { AppDataSource } from './config/ormconfig';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json()); // Middleware para interpretar JSON
app.use('/auth', authRoutes); // Rotas de autenticação

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
