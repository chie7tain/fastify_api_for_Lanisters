"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fees_1 = require("../controllers/fees");
function itemRoutes(fastify, options, done) {
    fastify.post("/fees", fees_1.createFeeSpec);
    fastify.post("/compute-transaction-fee", fees_1.computeTransactionFee);
    done();
}
exports.default = itemRoutes;
