const fastify = require("fastify")({
  logger: true,
});
// fastify swagger
fastify.register(require("fastify-swagger"), {
  routePrefix: "/documentation",
  swagger: {
    info: {
      title: "Fee API",
      description: "Fee API",
      version: "1.0.0",
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
    host: "localhost:3000",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      {
        name: "Lanister API",
        description: "Fee APIs",
      },
    ],
  },
});
import fastifyCors from "fastify-cors";

fastify.register(fastifyCors);

fastify.register(require("./routes/fastifyRoutes"));

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    fastify.listen(
      process.env.PORT || 3000,
      process.env.HOST || "localhost",
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
