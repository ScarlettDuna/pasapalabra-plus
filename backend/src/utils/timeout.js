import cron from 'node-cron'
import { prisma } from '../db/prisma.js'

export function initCronJobs() {
  cron.schedule('*/10 * * * *', async () => {
    const timeout = new Date(Date.now() - 15 * 60 * 1000)

    const result = await prisma.game.updateMany({
      where: {
        status: 'active',
        endedAt: null,
        startedAt: {
          lt: timeout
        }
      },
      data: {
        status: 'abandoned',
        endedAt: new Date()
      }
    })

    console.log(`Partidas abandonadas marcadas: ${result.count}`)
  })
}

