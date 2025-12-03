import Fastify from 'fastify';
import cors from '@fastify/cors';
import formBody from '@fastify/formbody';
import dotenv from 'dotenv';

import { getProducts, getCategories, getProductById } from './controllers/product.controller.js';
import { createOrder, receiveWebhook } from './controllers/payment.controller.js';
import { getOrderById } from './controllers/order.controller.js';

dotenv.config();
const port = Number(process.env.PORT)|| 3000;

const fastify = Fastify({ logger: true });


fastify.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL?.replace(/\/$/, "") 
    ];
4
    if (!origin) return cb(null, true);

    const cleanOrigin = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(cleanOrigin)) {
      cb(null, true);
    } else {
      console.error("CORS bloqueado:", origin);
      cb(new Error("CORS no permitido"), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
});

const start = async () => {

    fastify.get('/products', getProducts);
    fastify.get('/categories', getCategories);
    fastify.get('/products/:id', getProductById);

    fastify.get('/success', async (req, reply) => {
      const query = req.query as any;
      
      const orderId = query.external_reference; 
      
      const front = process.env.FRONTEND_URL;
      
      return reply.redirect(`${front}/success?orderId=${orderId}`);
    });

    fastify.get('/failure', async (req, reply) => {
      return reply.type('text/html').send(`
        <h1>Pago Fallido 😢</h1>
        <p>Hubo un problema con el pago.</p>
        <a href="http://localhost:5173">Intentar de nuevo</a>
      `);
    });

    fastify.get('/pending', async (req, reply) => {
      return reply.type('text/html').send(`
        <h1>Pago Pendiente ⏳</h1>
        <p>Estamos esperando la confirmación (ej: Rapipago).</p>
      `);
    });

    fastify.post('/checkout', createOrder);
    fastify.post('/webhook', receiveWebhook);
    fastify.get('/orders/:id', getOrderById);

  try {
    await fastify.register(formBody);
    await fastify.listen({ 
      port: port,
      host: '0.0.0.0' 
    });
    console.log(`Servidor escuchando en http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();