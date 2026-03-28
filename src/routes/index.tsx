//import { authClient } from "#/lib/auth-client";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import JokeList from "#/components/JokeList";
import { desc } from "drizzle-orm/sql/expressions/select";

const getJokes = createServerFn({ method: 'GET' }).handler(async () => {
  const [{ db }, { joke }] = await Promise.all([
    import('#/db'),
    import('#/db/schema'),
  ])
  //const jokes = await db.select().from(joke)
  const jokes = await db.select().from(joke).orderBy(desc(joke.score),desc(joke.id));

  return jokes
})

export const Route = createFileRoute('/')({ 
  component: App,
  loader: async () => { // Don't fetch data here inside loader. For security reasons, just do it in server function,createServerFn.
    const jokes = await getJokes();
    return jokes;
  }
})

function App() {
  const jokes = Route.useLoaderData();   
  //const {data:session} = authClient.useSession()
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f5efe6] to-[#e8f0ec] page-wrap px-4 pb-10 pt-10">
      
      {/* HERO SECTION */}
      <section className="mb-10 rounded-2xl border border-[var(--line)] bg-[var(--card-bg)] p-6 shadow-sm md:flex md:items-center md:justify-between md:gap-8">
        
        {/* LEFT */}
        <div className="max-w-xl">
          <p className="mb-2 text-xs font-semibold tracking-widest text-orange-500">
            FRESHLY DEPLOYED HUMOR
          </p>

          <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
            Welcome to DevJokes,
            <br />
            where commits come
            <br />
            with chuckles.
          </h1>

          <p className="mb-4 text-sm text-gray-600">
            Browse the hottest jokes, vote the funniest one to the top, and keep your debugging sessions dangerously entertaining.
          </p>

          <div className="flex gap-2">
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
              PUNCHLINE POWERED
            </span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              COMMUNITY VOTED
            </span>
          </div>
        </div>

        {/* RIGHT (cards) */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:mt-0">
          <div className="rounded-xl bg-orange-200 p-4 text-sm font-semibold shadow">
            🤣 Crash Cackler
          </div>
          <div className="rounded-xl bg-teal-200 p-4 text-sm font-semibold shadow">
            😂 Pun Pilot
          </div>
          <div className="rounded-xl bg-pink-200 p-4 text-sm font-semibold shadow">
            😆 Loop Laughter
          </div>
          <div className="rounded-xl bg-yellow-200 p-4 text-sm font-semibold shadow">
            😹 Merge Meower
          </div>
        </div>
      </section>

      {/* JOKES SECTION */}
      <section className="page-wrap px-4 pb-8 pt-14">
        
        {jokes.length === 0 ? (
          <div className="rounded-lg border border-[var(--line)] bg-[var(--card-bg)] p-4 shadow-sm">
            <p className="text-sm text-gray-500">No jokes found.</p>
          </div>
        ) : (
          <JokeList jokes={jokes} />
        )}
        {/* {jokes.length === 0 ? (
          <div className="rounded-lg border border-[var(--line)] bg-[var(--card-bg)] p-4 shadow-sm">
            <p className="text-sm text-gray-500">No jokes found.</p>
          </div>
        ) : (
          jokes.map((j) => (
            <div
              key={j.id}
              className="mb-4 rounded-lg border border-[var(--line)] bg-[var(--card-bg)] p-4 shadow-sm"
            >
              <p>{j.content}</p>
            </div>
          ))
        )} */}

      </section>
    </main>
  )
}
