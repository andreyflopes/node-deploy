import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { string, z } from 'zod'
import fastifyCors from "@fastify/cors"; 
import { strict } from "assert";



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




app.delete('/vagas/:id', async (request, reply) => {
    const id = String(request.params)

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
});

// // Rota para editar uma vaga pelo ID
// app.put('/vagas/:id', async (request, reply) => {
//     const { id } = request.params;
//     const { cargo, empresa, link, status } = request.body;

//     try {
//         // Edita a vaga com o ID fornecido utilizando o Prisma
//         await prisma.vaga.update({
//             where: {
//                 id: parseInt(id) // Converte o ID para um número, se necessário
//             },
//             data: {
//                 cargo,
//                 empresa,
//                 link,
//                 status
//             }
//         });

//         reply.status(204).send(); // Retorna status 204 (Sem conteúdo) para indicar que a edição foi bem-sucedida
//     } catch (error) {
//         console.error('(back) Erro ao editar vaga:', error);
//         reply.status(500).send({ error: 'Erro ao editar vaga' }); // Retorna status 500 (Erro do servidor) em caso de erro
//     }
// });


app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(()=>{
    console.log('HTTP server running')
})
