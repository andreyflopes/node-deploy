"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_client = require("@prisma/client");
var import_fastify = __toESM(require("fastify"));
var import_zod = require("zod");
var import_cors = __toESM(require("@fastify/cors"));
var app = (0, import_fastify.default)();
var prisma = new import_client.PrismaClient();
app.register(import_cors.default, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
});
app.get("/vagas", async (request, reply) => {
  try {
    const vagas = await prisma.vaga.findMany();
    reply.headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    reply.send(vagas);
  } catch (error) {
    reply.status(500).send({ error: "Erro ao buscar vagas" });
  }
});
app.get("/vagas/:id", async (request, reply) => {
  const params = request.params;
  const id = params.id;
  try {
    const vaga = await prisma.vaga.findUnique({
      where: {
        id
      }
    });
    if (vaga) {
      reply.send(vaga);
    } else {
      reply.status(404).send({ error: "Vaga n\xE3o encontrada" });
    }
  } catch (error) {
    console.error("(back) Erro ao buscar vaga:", error);
    reply.status(500).send({ error: "Erro ao buscar vaga" });
  }
});
app.post("/vagas", async (request, reply) => {
  const creteUserSchema = import_zod.z.object({
    cargo: import_zod.z.string(),
    empresa: import_zod.z.string(),
    link: import_zod.z.string(),
    status: import_zod.z.string()
  });
  const { cargo, empresa, link, status } = creteUserSchema.parse(request.body);
  await prisma.vaga.create({
    data: {
      cargo,
      empresa,
      link,
      status
    }
  });
  return reply.status(201).send();
});
app.delete("/vagas/:id", async (request, reply) => {
  const params = request.params;
  const id = params.id;
  if (id !== void 0) {
    try {
      await prisma.vaga.delete({
        where: {
          id
          // O tipo de id é string, e é o tipo esperado pelo Prisma
        }
      });
      reply.status(204).send();
    } catch (error) {
      console.error("(back) Erro ao excluir vaga:", error);
      reply.status(500).send({ error: "Erro ao excluir vaga" });
    }
  } else {
    reply.status(400).send({ error: "ID da vaga n\xE3o fornecido" });
  }
});
app.put("/vagas/:id", async (request, reply) => {
  const id = request.params.id;
  const { cargo, empresa, link, status } = request.body;
  try {
    const updatedVaga = await prisma.vaga.update({
      where: {
        id
      },
      data: {
        cargo,
        empresa,
        link,
        status
      }
    });
    reply.send(updatedVaga);
  } catch (error) {
    console.error("(back) Erro ao editar vaga:", error);
    reply.status(500).send({ error: "Erro ao editar vaga" });
  }
});
app.listen({
  host: "0.0.0.0",
  port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
  console.log("HTTP server running");
});
