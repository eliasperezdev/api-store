import { prisma } from '../lib/prisma.js';

interface GetProductsFilters {
  categoryId?: string;
  sort?: 'asc' | 'desc';
  search?: string;
}

export const getProducts = async ({ categoryId, sort, search }: GetProductsFilters) => {
  const whereClause: any = {};

  if (categoryId) {
    whereClause.categoryId = Number(categoryId);
  }

  if (search) {
    whereClause.name = { contains: search };
  }

  const orderByClause: any = sort ? [{ price: sort }] : [{ id: 'asc' }];

  return prisma.product.findMany({
    where: whereClause,
    orderBy: orderByClause,
    include: { category: true },
  });
};

export const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });
};

export const getCategories = async () => {
  return prisma.category.findMany();
};
