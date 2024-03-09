import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { request } from "http";
import { z } from 'zod'
const app = fastify()

const prisma = new PrismaClient()

app.get('/vagas', async()=>{
    const vagas = await prisma.vaga.findMany()

    return {vagas}
})

app.post('/vagas', async(request, reply)=>{
    const creteUserSchema = z.object({
        cargo: z.string(),
        empresa: z.string(),
        link: z.string(),
        status: z.string()
    })
    const { cargo, empresa, link, status } = creteUserSchema.parse(request.body)

    await prisma.vaga.create({
        data: {
            cargo,
            empresa,
            link,
            status
        }
    })

    return reply.status(201).send()
})

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(()=>{
    console.log('HTTP server running')
})