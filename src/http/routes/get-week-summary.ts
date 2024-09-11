import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekSummary } from '../../features/get-week-summary'

const getWeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get('/week-summary', async () => {
    const { weekSummary } = await getWeekSummary()

    return {
      weekSummary,
    }
  })
}

export { getWeekSummaryRoute }
