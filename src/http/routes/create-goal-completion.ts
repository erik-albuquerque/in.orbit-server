import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createGoalCompletion } from '../../features/create-goal-completion'

const createGoalCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/goal-completions',
    {
      schema: {
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async request => {
      const { goalId } = request.body

      await createGoalCompletion({
        goalId,
      })
    }
  )
}

export { createGoalCompletionRoute }
