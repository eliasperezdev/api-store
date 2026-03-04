import { FastifyInstance } from 'fastify';
import { getOrderById } from '../controllers/order.controller.js';

export const orderRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/orders/:id', getOrderById);
};
