import dayjs from 'dayjs'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import * as zz from 'drizzle-orm'

type CreateGoalCompletionRequest = {
  goalId: string
}

const createGoalCompletion = async ({
  goalId,
}: CreateGoalCompletionRequest) => {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const goalCompletionCounts = db.$with('goal_completion_counts').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: zz.count(goalCompletions.id).as('completionCount'),
      })
      .from(goalCompletions)
      .where(
        zz.and(
          zz.gte(goalCompletions.createdAt, firstDayOfWeek),
          zz.lte(goalCompletions.createdAt, lastDayOfWeek),
          zz.eq(goalCompletions.goalId, goalId)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  const dbGetGoalCompletion = await db
    .with(goalCompletionCounts)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: zz.sql /*sql*/`
        COALESCE(${goalCompletionCounts.completionCount}, 0)
      `.mapWith(Number),
    })
    .from(goals)
    .leftJoin(
      goalCompletionCounts,
      zz.eq(goalCompletionCounts.goalId, goals.id)
    )
    .where(zz.eq(goals.id, goalId))

  const { completionCount, desiredWeeklyFrequency } = dbGetGoalCompletion[0]

  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error('Goal already completed this week!')
  }

  const dbGoalCompletion = await db
    .insert(goalCompletions)
    .values({
      goalId,
    })
    .returning()

  const goalCompletion = dbGoalCompletion[0]

  return {
    goalCompletion,
  }
}

export { createGoalCompletion }
