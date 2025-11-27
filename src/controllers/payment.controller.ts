import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { preference, payment } from '../lib/mercadopago.js';

const prisma = new PrismaClient();

interface CheckoutBody {
  items: {
    productId: number;
    quantity: number;
  }[];
}

export const createOrder = async (req: FastifyRequest<{ Body: CheckoutBody }>, reply: FastifyReply) => {
  const { items } = req.body;

  try {
    let total = 0;
    const preferenceItems = [];
    const dbOrderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      
      if (!product) {
        throw new Error(`Producto ID ${item.productId} no encontrado`);
      }

      total += Number(product.price) * item.quantity;

      dbOrderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });

      preferenceItems.push({
        id: product.id.toString(),
        title: product.name,
        quantity: item.quantity,
        unit_price: Number(product.price),
        currency_id: 'ARS',
      });
    }

    const newOrder = await prisma.order.create({
      data: {
        total: total,
        status: 'PENDING',
        items: {
          create: dbOrderItems
        }
      }
    });

    const preferenceBody = {
      items: preferenceItems,
      external_reference: newOrder.id.toString(),
      notification_url: `${process.env.WEBHOOK_URL}/webhook`,
      
      // Asegúrate de que back_urls esté al mismo nivel que items
      back_urls: {
        success: `${process.env.WEBHOOK_URL}/success`,
        failure: `${process.env.WEBHOOK_URL}/failure`,
        pending: `${process.env.WEBHOOK_URL}/pending`
      },
      auto_return: undefined
    };
    

const result = await preference.create({
      body: preferenceBody
    });

    console.log("ENVIANDO A MP:", JSON.stringify(result, null, 2));
    return reply.send({ url: result.init_point });

  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'Error al crear la orden' });
  }
};

export const receiveWebhook = async (req: FastifyRequest, reply: FastifyReply) => {
  const query = req.query as any;
  const type = query.type || query.topic;

  if (type === 'payment') {
    const paymentId = query['data.id'] || query.id;
    
    try {
      const payInfo = await payment.get({ id: paymentId });
      
      const externalReference = payInfo.external_reference;
      const status = payInfo.status;

      if (externalReference && status === 'approved') {

        const order = await prisma.order.findUnique({
            where: { id: parseInt(externalReference) },
            include: { items: true } // Traemos los items
          });

          if (!order) return; // Si no existe, salimos

          if (order.status === 'PAID') return;

          await prisma.order.update({
            where: { id: order.id },
            data: { 
              status: 'PAID',
              paymentId: paymentId.toString()
            }
          });

          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.quantity
                }
              }
            });
          }

        await prisma.order.update({
          where: { id: parseInt(externalReference) },
          data: { 
            status: 'PAID',
            paymentId: paymentId.toString()
          }
        });
        console.log(`✅ Orden ${externalReference} pagada correctamente.`);
      }
    } catch (error) {
      console.error('Error procesando webhook:', error);
    }
  }

  return reply.status(200).send();
};