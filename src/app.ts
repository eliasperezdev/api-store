import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';

import { getProducts, getCategories, getProductById } from './controllers/product.controller.js';
import { createOrder, receiveWebhook } from './controllers/payment.controller.js';

dotenv.config();
const port = Number(process.env.PORT)|| 4000;

const fastify = Fastify({ logger: true });

fastify.register(cors, { 
  origin: true
});

const start = async () => {

    fastify.get('/products', getProducts);
    fastify.get('/categories', getCategories);
    fastify.get('/products/:id', getProductById);

    fastify.get('/success', async (req, reply) => {
      return reply.type('text/html').send(`
        <h1>¡Pago Exitoso! 🥳</h1>
        <p>Gracias por tu compra. Ya hemos registrado tu pedido.</p>
        <a href="http://localhost:5173">Volver a la tienda</a>
      `);
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

  try {
    await fastify.listen({ port });
    console.log(`Servidor escuchando en http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();