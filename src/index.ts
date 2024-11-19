import express from 'express';
import path from 'path';
import { prisma } from './lib/prisma';

import { auth } from 'express-openid-connect';
import { loggerMiddleware } from './middlewares/loggerMiddleware';
import applicationRoutes from './routes/applicationRoutes';
import authRoutes from './routes/authRoutes';
import careCharacteristicRoutes from './routes/careCharacteristicRoutes';
import serviceRoutes from './routes/serviceRoutes';
import userRoutes from './routes/userRoutes';

const startServer = async () => {
  try {
    const authConfig = {
      authRequired: false,
      auth0Logout: true,
      secret: process.env.AUTH0_SECRET,
      baseURL: process.env.AUTH0_BASE_URL,
      clientID: process.env.AUTH0_CLIENT_ID,
      issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    };

    const PORT = process.env.PORT ?? 3000;

    const app = express();
    const trustedProxies = ['loopback', 'linklocal', 'uniquelocal'];
    app.set('trust proxy', trustedProxies);

    app.use(loggerMiddleware);
    app.use(auth(authConfig));
    app.use(express.json());

    app.use('/auth', authRoutes);
    app.use('/users', userRoutes);
    app.use('/services', serviceRoutes);
    app.use('/application', applicationRoutes);

    app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
    app.use('/api/care-characteristics', careCharacteristicRoutes);
    app.get('/', (req, res) => {
      res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
    });

    // Testar conexão com o Prisma
    await prisma.$connect();
    console.log('Database connected');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

// Garantir que o Prisma seja desconectado ao encerrar
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
