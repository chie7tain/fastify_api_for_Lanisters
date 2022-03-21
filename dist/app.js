"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const fastify_cors_1 = __importDefault(require("fastify-cors"));
fastify.register(fastify_cors_1.default);
fastify.register(require("./routes/fastifyRoutes"));
const port = process.env.PORT || 3000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        fastify.listen(process.env.PORT || 3000, process.env.HOST || "localhost", (err) => {
            if (err)
                throw err;
            console.log(`server listening on ${fastify.server.address().port}`);
        });
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
start();
