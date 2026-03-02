import { FastifyReply, FastifyRequest } from 'fastify';
import * as paymentService from '../services/payment.service.js';

interface CheckoutItem {
  id: string | number;
  quantity: number;
}

interface CheckoutBody {
  items: CheckoutItem[];
  email: string;
}

export const createOrder = async (req: FastifyRequest<{ Body: CheckoutBody }>, reply: FastifyReply) => {
  const { items, email } = req.body;

  try {
    const initPoint = await paymentService.createCheckoutOrder(items, email);
    return reply.send({ url: initPoint });
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
      await paymentService.processPaymentWebhook(paymentId);
    } catch (error) {
      console.error('Error procesando webhook:', error);
    }
  }

  return reply.status(200).send();
};
