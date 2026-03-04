import { FastifyInstance } from 'fastify';
import { getProducts, getProductById, getCategories } from '../controllers/product.controller.js';

export const productRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/products', getProducts);
  fastify.get('/products/:id', getProductById);
  fastify.get('/categories', getCategories);
};
