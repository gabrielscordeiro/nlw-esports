import express, { request } from 'express';
import { PrismaClient } from '@prisma/client'

const app = express();

const prisma = new PrismaClient({
    log: ['query']
});

app.get('/games', async (request, response) => {
    /**
     * include é como se fosse o join
     * o count é como se fosse um aggregated do Ads
     */
    const games = await prisma.game.findMany({
        include:{
            _count:{
                select:{
                    ads: true
                }
            }
        }
    });

    return response.json(games);
})

app.post('/ads', (request, response) => {
    return response.status(201).json([]);
})

app.get('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;

    const ads = await prisma.ad.findMany({
        select:{
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true
        },

        where: {
            gameId: gameId
        },

        orderBy:{
            ceratedAt: 'desc'
        }
    });

    /** 
     * com o ...ad indico que vou manter tudo do Ad, porém vou substituir o valor de weekDays
    */
    return response.json(ads.map(ad => {

        return {
            ...ad,
            weekDays: ad.weekDays.split(',')
        }
    }));
    
});

app.get('/ads/:id/discord', async(request, response) => {
    const adId = request.params.id;

    /**
     * o findUniqueOrThrow vai tentar encontrar um valor com o ID passado, se não encontrar vai disparar um erro
     */

    const ad = await prisma.ad.findUniqueOrThrow({
        select:{
            discord: true
        }, 
        where:{
            id: adId
        }
    });

    return response.json({
        discord: ad.discord
    });
});

app.listen(3333);