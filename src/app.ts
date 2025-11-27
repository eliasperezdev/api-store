import Fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config();
const port = Number(process.env.PORT)|| 3000;

const fastify = Fastify({ logger: true });

const start = async () => {
  try {
    await fastify.listen({ port });
    console.log(`Servidor escuchando en http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();