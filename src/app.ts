import Fastify from "fastify";
import fastifyCors from "fastify-cors";
const fastify = Fastify({ logger: true });
fastify.register(fastifyCors);

fastify.register(require("./routes/fastifyRoutes"));

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // @ts-ignore
    fastify.listen(process.env.PORT, process.env.HOST || "0.0.0.0");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
