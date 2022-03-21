import Fastify from "fastify";
import fastifyCors from "fastify-cors";
const fastify = Fastify({ logger: true });
fastify.register(fastifyCors);

fastify.register(require("./routes/fastifyRoutes"));
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await fastify.listen(port);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
