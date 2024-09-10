import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekPendingGoals } from '../../features/get-week-pending-goals'

const getWeekPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/week-pending-goals', async () => {
    const { weekPendingGoals } = await getWeekPendingGoals()

    return { weekPendingGoals }
  })
}

export { getWeekPendingGoalsRoute }
