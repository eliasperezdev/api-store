import { FastifyInstance } from 'fastify';
import { createOrder, receiveWebhook } from '../controllers/payment.controller.js';

export const paymentRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/checkout', createOrder);
  fastify.post('/webhook', receiveWebhook);

  fastify.get('/success', async (req, reply) => {
    const query = req.query as any;
    const orderId = query.external_reference;
    return reply.redirect(`${process.env.FRONTEND_URL}/success?orderId=${orderId}`);
  });

  fastify.get('/failure', async (_req, reply) => {
    const front = process.env.FRONTEND_URL;
    return reply.type('text/html').send(`
      <h1>Pago Fallido 😢</h1>
      <p>Hubo un problema con el pago.</p>
      <a href="${front}">Intentar de nuevo</a>
    `);
  });

  fastify.get('/pending', async (_req, reply) => {
    return reply.type('text/html').send(`
      <h1>Pago Pendiente ⏳</h1>
      <p>Estamos esperando la confirmación (ej: Rapipago).</p>
    `);
  });
};
