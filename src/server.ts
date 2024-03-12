import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { request } from "http";
import { z } from 'zod'
const app = fastify()

const prisma = new PrismaClient()

app.get('/vagas', async(request, reply)=>{
    try {
        // Buscar todas as vagas do banco de dados
        const vagas = await prisma.vaga.findMany();
        
        // Enviar a resposta com os dados das vagas
        reply.send(vagas);
    } catch (error) {
        // Se ocorrer um erro, enviar uma resposta de erro
        reply.status(500).send({ error: 'Erro ao buscar vagas' });
    }
   
           
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
