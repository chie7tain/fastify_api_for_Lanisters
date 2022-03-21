import { computeTransactionFee, createFeeSpec } from "../controllers/fees";

function itemRoutes(fastify: any, options: any, done: any) {
  fastify.get("/", async (req: any, reply: any) => {
    reply.send({
      status: "for Lanisters",
    });
  });
  fastify.post("/fees", createFeeSpec);

  fastify.post("/compute-transaction-fee", computeTransactionFee);
  done();
}
export default itemRoutes;
