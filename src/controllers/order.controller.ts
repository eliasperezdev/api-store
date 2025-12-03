import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getOrderById = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        items: {
          include: {
            product: true 
          }
        }
      }
    });

    if (!order) return reply.status(404).send({ error: 'Orden no encontrada' });

    return reply.send(order);
  } catch (error) {
    return reply.status(500).send({ error: 'Error al buscar la orden' });
  }
};