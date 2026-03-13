import dotenv from 'dotenv';

dotenv.config();

import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import formBody from '@fastify/formbody';

import { env } from './lib/env.js';
import { productRoutes } from './routes/product.routes.js';
import { paymentRoutes } from './routes/payment.routes.js';
import { orderRoutes } from './routes/order.routes.js';

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = env.FRONTEND_URL
      .split(',')
      .map((o) => o.trim().replace(/\/$/, ''));

    if (!origin) return cb(null, true);

    const normalizedOrigin = origin.replace(/\/$/, '');
    const allowed =
      allowedOrigins.includes(normalizedOrigin) ||
      allowedOrigins.some((o) => o.startsWith('*.') && normalizedOrigin.endsWith(o.slice(1)));

    if (allowed) {
      cb(null, true);
    } else {
      fastify.log.warn({ origin }, 'CORS bloqueado');
      cb(new Error('CORS no permitido'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});

fastify.register(helmet);
fastify.register(rateLimit, { max: 100, timeWindow: '1 minute' });
fastify.register(formBody);
fastify.register(productRoutes);
fastify.register(paymentRoutes);
fastify.register(orderRoutes);

fastify.get('/health', async () => ({ status: 'ok' }));

const start = async () => {
  try {
    await fastify.listen({ port: env.PORT, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
