const fastify = require("fastify")({
  logger: true,
});

import fastifyCors from "fastify-cors";

fastify.register(fastifyCors);

fastify.register(require("./routes/fastifyRoutes"));

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    fastify.listen(
      process.env.PORT || 3000,
      process.env.HOST || "::",
      (err: any) => {
        if (err) throw err;
        console.log(`server listening on ${fastify.server.address().port}`);
      }
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
