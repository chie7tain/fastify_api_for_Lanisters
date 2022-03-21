const fastify = require("fastify")({
  logger: true,
});

import fastifyCors from "fastify-cors";

fastify.register(fastifyCors);

fastify.register(require("./routes/fastifyRoutes"));

const start = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      await fastify.listen(process.env.PORT, "0.0.0.0");
    } else {
      fastify.listen(
        process.env.PORT || 3000,
        process.env.HOST || "localhost",
        (err: any) => {
          if (err) throw err;
          console.log(`server listening on ${fastify.server.address().port}`);
        }
      );
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
