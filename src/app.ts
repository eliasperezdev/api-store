import dotenv from 'dotenv';
dotenv.config();

import Fastify from 'fastify';
import cors from '@fastify/cors';
import formBody from '@fastify/formbody';

import { productRoutes } from './routes/product.routes.js';
import { paymentRoutes } from './routes/payment.routes.js';
import { orderRoutes } from './routes/order.routes.js';

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = [process.env.FRONTEND_URL?.replace(/\/$/, '')];

    if (!origin) return cb(null, true);

    const cleanOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.includes(cleanOrigin)) {
      cb(null, true);
    } else {
      console.error('CORS bloqueado:', origin);
      cb(new Error('CORS no permitido'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});

fastify.register(formBody);
fastify.register(productRoutes);
fastify.register(paymentRoutes);
fastify.register(orderRoutes);

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Servidor escuchando en http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
