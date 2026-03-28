import { createServerFn } from '@tanstack/react-start'
import { eq, sql } from "drizzle-orm";

type VoteInput = {
  jokeId: number
  value: number // +1 or -1
  userId: string
}

export const voteJoke = createServerFn({ method: "POST" })
  .inputValidator((data: VoteInput) => data)
  .handler(async ({ data }) => {
    const [{ db }, { jokeVotes, joke }] = await Promise.all([
      import('#/db'),
      import('#/db/schema'),
    ])

    //check existing vote
    const existing = await db.query.jokeVotes.findFirst({
      where: (v, { eq, and }) =>
        and(eq(v.userId, data.userId), eq(v.jokeId, data.jokeId)),
    })

    let scoreChange = 0

    if (!existing) {
      // new vote
      await db.insert(jokeVotes).values(data)
      scoreChange = data.value
    } else if (existing.value === data.value) {
      //same vote → remove
      //await db.delete(joke).where(eq(joke.id, data.jokeId));
      //await db.delete(jokeVotes).where((v, { eq }) => eq(v.id, existing.id))
      await db.delete(jokeVotes).where(eq(jokeVotes.id, existing.id));
      scoreChange = -data.value
    } else {
      //change vote
      await db
        .update(jokeVotes)
        .set({ value: data.value })
        .where(eq(jokeVotes.id, existing.id))

      scoreChange = data.value * 2
    }

    // 2️⃣ update joke score
    await db
    .update(joke)
    .set({
        score: sql`${joke.score} + ${scoreChange}`,
    })
    .where(eq(joke.id, data.jokeId))

        return { scoreChange }
    })