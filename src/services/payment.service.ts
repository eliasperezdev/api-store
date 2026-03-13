import { prisma } from '../lib/prisma.js';
import { preference, payment } from '../lib/mercadopago.js';
import { sendOrderEmail } from '../lib/mailer.js';
import { env } from '../lib/env.js';

interface CheckoutItem {
  id: string | number;
  quantity: number;
}

export const createCheckoutOrder = async (items: CheckoutItem[], email: string) => {
  let total = 0;
  const preferenceItems = [];
  const dbOrderItems = [];

  for (const item of items) {
    const productId = Number(item.id);
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new Error(`Producto ID ${productId} no encontrado`);
    }

    total += Number(product.price) * item.quantity;

    dbOrderItems.push({
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
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
      total,
      status: 'PENDING',
      email,
      items: { create: dbOrderItems },
    },
  });

  const result = await preference.create({
    body: {
      items: preferenceItems,
      external_reference: newOrder.id.toString(),
      notification_url: `${env.WEBHOOK_URL}/webhook`,
      back_urls: {
        success: `${env.WEBHOOK_URL}/success`,
        failure: `${env.WEBHOOK_URL}/failure`,
        pending: `${env.WEBHOOK_URL}/pending`,
      },
      auto_return: undefined,
    },
  });

  return result.init_point;
};

export const processPaymentWebhook = async (paymentId: string) => {
  const payInfo = await payment.get({ id: paymentId });

  const externalReference = payInfo.external_reference;
  const status = payInfo.status;

  if (!externalReference || status !== 'approved') return;

  const order = await prisma.order.findUnique({
    where: { id: parseInt(externalReference) },
    include: { items: { include: { product: true } } },
  });

  if (!order || order.status === 'PAID') return;

  await prisma.order.update({
    where: { id: order.id },
    data: { status: 'PAID', paymentId: paymentId.toString() },
  });

  for (const item of order.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  sendOrderEmail(
    order.email,
    order.id.toString(),
    order.items,
    Number(order.total)
  );

  console.log(`✅ Orden ${externalReference} pagada correctamente.`);
};
