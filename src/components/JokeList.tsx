//import { useState } from "react";
import { authClient } from "#/lib/auth-client";
import { deleteJoke } from "#/server/deleteJoke";
import { useNavigate } from '@tanstack/react-router';
import { Trash2 } from "lucide-react";
import { voteJoke } from "#/server/voteJoke";
import { useState } from "react";

type Joke = {
  id: number;
  content: string;
  userId: string;
  score: number;
};

type Props = {
  jokes: Joke[];
};

export default function JokeList({ jokes }: Props) {
  const topThreeJokes = jokes.slice(0, 3);
  const moreJokes = jokes.slice(3);
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="space-y-6">
      {topThreeJokes.map((joke) => (
        <JokeItem key={joke.id} joke={joke}/>
      ))}
      {moreJokes.length > 0 && (
        <>
            <div
            style={{ cursor: "pointer", marginTop: "20px", fontWeight: "bold" }}
            onClick={() => setShowMore((prev) => !prev)}
            >
            {showMore ? "LESS JOKES ▲" : " MORE JOKES ▼"}
            </div>

            {showMore &&
            moreJokes.map((joke) => (
                <JokeItem key={joke.id} joke={joke} />
            ))}
        </>
    )}
      {/* {showMore && (
        <div className="space-y-6">
          {moreJokes.map((joke) => (
            <JokeItem key={joke.id} joke={joke}/>
          ))}
        </div>
      )}
      {!showMore && jokes.length > 3 && (
        <button
          className="text-blue-500 hover:underline"
          onClick={() => setShowMore(true)}
        >
          Show More
        </button>
      )} */}
    </div>
  );
}

function JokeItem({ joke }: { joke: Joke}) {
  
  const { data: session } = authClient.useSession();
  //const [score, setScore] = useState(joke.score);

  // simple split between setup and punchline based on " - " separator
  const [setup, punchline] = joke.content.split(" - ");
  const navigate = useNavigate();

  const handleDelete = async () => {

    if (!session || session?.user.id !== joke.userId) {
      alert("You must be logged in to delete a joke.");
      return;
    }

    if (!confirm("Are you sure you want to delete this joke?")) return;

    try {
        await deleteJoke({
        data: { jokeId: joke.id },
        });
        
        // simplest: reload page
        //window.location.reload();
        navigate({ to: "/" });
       
    } catch (err) {
        console.error("Delete failed", err);
    }
};

const handleVote = async (value: number) => {
  if (!session) {
    alert("Please login to vote");
    return;
  }

  try {
    await voteJoke({
      data: {
        jokeId: joke.id,
        value,
        userId: session.user.id,
      },
    });

    // instant UI update (optimistic)
    //setScore((prev) => prev + value);
    navigate({ to: "/" });

  } catch (err) {
    console.error("Vote failed", err);
  }
};

  return (
    <div className="flex gap-4 rounded-2xl border border-[var(--line)] bg-[var(--card-bg)] p-5 shadow-sm">

      {/* LEFT: Voting */}
      <div className="flex flex-col items-center justify-start gap-1 text-sm">
        <button
          className="rounded-md p-1 hover:bg-gray-200"
          onClick={() => handleVote(1)}
        >
          ⬆️
        </button>

        <span className="font-semibold">{joke.score}</span>

        <button
          className="rounded-md p-1 hover:bg-gray-200"
          onClick={() => handleVote(-1)}
        >
          ⬇️
        </button>
      </div>

      {/* RIGHT: Content */}
      <div className="flex-1 space-y-2">
        <h3 className="font-semibold text-lg">
          {setup}
        </h3>

        <p className="text-sm text-gray-600">
          {punchline}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">

          {/* Top Joke badge */}
          {joke.score >= 3 && (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
              ⭐ Top Joke
            </span>
          )}

          {/* {session?.user.id === joke.userId && (
            <button className="text-sm text-red-500 hover:underline">
              Delete
            </button>
          )}     */}
            <button
            onClick={handleDelete}
            disabled={session?.user.id !== joke.userId}
            className={`inline-flex items-center gap-1 text-sm ${
                session?.user.id === joke.userId
                ? "text-red-500 hover:underline"
                : "text-gray-400 cursor-not-allowed"
            }`}
            >
            <Trash2 size={16} />
            <span>Delete</span>
            </button>
        </div>
      </div>
    </div>
  );
}