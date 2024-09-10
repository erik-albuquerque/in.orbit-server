import { client, db } from '.'
import { goalCompletions, goals } from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const dbGoals = await db
    .insert(goals)
    .values([
      { title: 'Acordar cedo', desiredWeeklyFrequency: 4 },
      { title: 'Me exercitar', desiredWeeklyFrequency: 5 },
      { title: 'Meditar', desiredWeeklyFrequency: 2 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    { goalId: dbGoals[0].id, createdAt: startOfWeek.toDate() },
    { goalId: dbGoals[1].id, createdAt: startOfWeek.add(1, 'day').toDate() },
  ])
}

seed().finally(() => {
  client.end()
})
