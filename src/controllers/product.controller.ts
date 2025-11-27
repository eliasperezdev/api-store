import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface GetProductsQuery {
  categoryId?: string;
  sort?: 'asc' | 'desc';
  search?: string;
}

export const getProducts = async (
  req: FastifyRequest<{ Querystring: GetProductsQuery }>, 
  reply: FastifyReply
) => {
  const { categoryId, sort, search } = req.query;

  try {
    const whereClause: any = {};

    if (categoryId) {
      whereClause.categoryId = Number(categoryId);
    }

    if (search) {
      whereClause.name = {
        contains: search
      };
    }

    const orderByClause: any = [];
    
    if (sort) {
      orderByClause.push({ price: sort });
    } else {
      orderByClause.push({ id: 'asc' });
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause,
      include: {
        category: true
      }
    });

    return reply.send(products);

  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'Error al obtener productos' });
  }
};

export const getCategories = async (req: FastifyRequest, reply: FastifyReply) => {
  const categories = await prisma.category.findMany();
  return reply.send(categories);
};