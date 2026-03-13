import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { env } from './env.js';

const client = new MercadoPagoConfig({
  accessToken: env.MP_ACCESS_TOKEN,
});

export const preference = new Preference(client);
export const payment = new Payment(client);