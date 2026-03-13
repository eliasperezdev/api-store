import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  MP_ACCESS_TOKEN: z.string().min(1),
  WEBHOOK_URL: z.string().url(),
  EMAIL_USER: z.string().email(),
  EMAIL_PASS: z.string().min(1),
  FRONTEND_URL: z.string().url(),
  SECRET_COOKIES: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variables de entorno inválidas:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
