import { createServerFn } from '@tanstack/react-start'
import { eq } from "drizzle-orm"

export const deleteJoke = createServerFn({ method: "POST" })
  .inputValidator((data: { jokeId: number }) => data)
  .handler(async ({ data }) => {
    const [{ db }, { joke }] = await Promise.all([
      import('#/db'),
      import('#/db/schema'),
    ])

    await db.delete(joke).where(eq(joke.id, data.jokeId));

    return { success: true }
  })