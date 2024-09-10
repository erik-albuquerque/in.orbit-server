import { db } from '../db'
import { goals } from '../db/schema'

type CreateGoalRequest = {
  title: string
  desiredWeeklyFrequency: number
}

const createGoal = async ({
  title,
  desiredWeeklyFrequency,
}: CreateGoalRequest) => {
  const dbGoal = await db
    .insert(goals)
    .values({
      title,
      desiredWeeklyFrequency,
    })
    .returning()

  const goal = dbGoal[0]

  return {
    goal,
  }
}

export { createGoal }
