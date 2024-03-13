import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { string, z } from 'zod'
import fastifyCors from "@fastify/cors"; 

import { FastifyRequest, FastifyReply } from 'fastify';



const app = fastify()

const prisma = new PrismaClient()

// Registrar o plugin @fastify/cors
app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});



app.get('/vagas', async (request, reply) => {
    try {
        // Buscar todas as vagas do banco de dados
        const vagas = await prisma.vaga.findMany();
        
        // Configurar os cabeçalhos CORS
        reply.headers({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        
        // Enviar a resposta com os dados das vagas
        reply.send(vagas);
    } catch (error) {
        // Se ocorrer um erro, enviar uma resposta de erro
        reply.status(500).send({ error: 'Erro ao buscar vagas' });
    }
});

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

interface RouteParams {
    id: string;
}

app.delete('/vagas/:id', async (request: FastifyRequest<{ Params: RouteParams }>, reply: FastifyReply) => {
    const params = request.params as RouteParams; // Atribuição de tipo para os parâmetros da rota

    // Extração do ID da rota
    const id = params.id;   
    if (id !== undefined) {
        try {
            // Exclui a vaga com o ID fornecido utilizando o Prisma
            await prisma.vaga.delete({
                where: {
                    id: id // O tipo de id é string, e é o tipo esperado pelo Prisma
                }
            });

            reply.status(204).send(); // Retorna status 204 (Sem conteúdo) para indicar que a exclusão foi bem-sucedida
        } catch (error) {
            console.error('(back) Erro ao excluir vaga:', error);
            reply.status(500).send({ error: 'Erro ao excluir vaga' }); // Retorna status 500 (Erro do servidor) em caso de erro
        }
    } else {
        reply.status(400).send({ error: 'ID da vaga não fornecido' }); // Retorna status 400 (Bad Request) se o ID não foi fornecido
    }
});
// Defina uma interface para os dados de edição da vaga
interface EdicaoVaga {
    cargo: string;
    empresa: string;
    link: string;
    status: string;
}

// Defina uma interface para os parâmetros da rota
interface RouteParams {
    id: string;
}

// Use as interfaces ao definir os tipos de request.params e request.body
app.put('/vagas/:id', async (request: FastifyRequest<{ Params: RouteParams, Body: EdicaoVaga }>, reply: FastifyReply) => {
    const id = request.params.id;
    const { cargo, empresa, link, status } = request.body;

    try {
        const updatedVaga = await prisma.vaga.update({
            where: {
                id: id
            },
            data: {
                cargo: cargo,
                empresa: empresa,
                link: link,
                status: status
            }
        });

        reply.send(updatedVaga);
    } catch (error) {
        console.error('(back) Erro ao editar vaga:', error);
        reply.status(500).send({ error: 'Erro ao editar vaga' });
    }
});



app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(()=>{
    console.log('HTTP server running')
})
