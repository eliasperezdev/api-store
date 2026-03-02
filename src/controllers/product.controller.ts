import { FastifyReply, FastifyRequest } from 'fastify';
import * as productService from '../services/product.service.js';

interface GetProductsQuery {
  categoryId?: string;
  sort?: 'asc' | 'desc';
  search?: string;
}

interface GetProductParams {
  id: string;
}

export const getProducts = async (
  req: FastifyRequest<{ Querystring: GetProductsQuery }>,
  reply: FastifyReply
) => {
  try {
    const products = await productService.getProducts(req.query);
    return reply.send(products);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'Error al obtener productos' });
  }
};

export const getProductById = async (
  req: FastifyRequest<{ Params: GetProductParams }>,
  reply: FastifyReply
) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return reply.status(404).send({ error: 'Producto no encontrado' });
    }
    return reply.send(product);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'Error al obtener el producto' });
  }
};

export const getCategories = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const categories = await productService.getCategories();
    return reply.send(categories);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'Error al obtener categorías' });
  }
};
