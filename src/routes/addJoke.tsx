
import { authClient } from '#/lib/auth-client'
import { createFileRoute } from '@tanstack/react-router'
//import { createServerFn } from '@tanstack/start-client-core'
import { useState } from 'react'
//import { addJokes } from '#/server/addJokes'
import { createServerFn } from '@tanstack/react-start'


type CreateJoke = {  
  content: string
  userId: string
}

const addJokes = createServerFn({ method: "POST" })
  .inputValidator((data: CreateJoke) => data)
  .handler(async ({ data }) => {

    const { db } = await import('#/db')
    const { joke } = await import('#/db/schema')

    const inserted = await db.insert(joke).values({
      content: data.content,
      userId: data.userId
    }).returning()

    return inserted
  })

export const Route = createFileRoute('/addJoke')({
  component: RouteComponent,
})

function RouteComponent() {
    const {data:session} = authClient.useSession()
    const navigate = Route.useNavigate()

    if (!session) {
        navigate({ to: "/unauthorized" });
        return null; // render nothing
    }
    
    const [setup, setSetup] = useState("");
    const [punchline, setPunchline] = useState("");       

    const handleSubmit : React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await addJokes({
      data: {
        content: `${setup} - ${punchline}`,
        userId: session.user.id, // string ✅
        //current date and time ✅

      },
    });

  navigate({ to: "/" });

  };

    return (
    <main className="page-wrap px-4 pt-10 pb-20">
      <div className="rounded-2xl border border-[var(--line)] 
        bg-[rgba(255,255,255,0.6)] backdrop-blur-md 
        p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          

        {/* Header */}
        <p className="text-xs font-semibold tracking-widest text-orange-500 mb-2">
          SHIP A PUNCHLINE
        </p>

        <h1 className="text-4xl font-bold mb-4">
          Add a New Joke
        </h1>

        <p className="text-sm text-gray-600 mb-8 max-w-xl">
          Drop in a setup and punchline. Once it saves, you will be redirected back to the collection.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">

          {/* Setup */}
          <div>
            <label className="block mb-2 text-sm font-semibold">
              Setup
            </label>
            <input
              type="text"
              value={setup}
              onChange={(e) => setSetup(e.target.value)}
              placeholder="What is a web developer's favorite tea?"
              className="w-full rounded-xl border border-gray-300 
                bg-white/70 px-4 py-3 text-sm 
                focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Punchline */}
          <div>
            <label className="block mb-2 text-sm font-semibold">
              Punchline
            </label>
            <textarea
              value={punchline}
              onChange={(e) => setPunchline(e.target.value)}
              placeholder="URL Grey."
              rows={4}
              className="w-full rounded-xl border border-gray-300 
                bg-white/70 px-4 py-3 text-sm resize-none
                focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white 
              shadow-md hover:bg-orange-600 active:scale-95 transition"
          >
            Save Joke
          </button>

        </form>
      </div>
    </main>
  );
}
