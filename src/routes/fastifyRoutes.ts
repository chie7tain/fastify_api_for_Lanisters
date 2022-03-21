
import { computeTransactionFee, createFeeSpec } from "../controllers/fees";

function itemRoutes(fastify: any, options: any, done: any) {
  fastify.post("/fees", createFeeSpec);

  fastify.post("/compute-transaction-fee", computeTransactionFee);
  done();
}
export default itemRoutes;
