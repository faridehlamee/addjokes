import { createFileRoute, Link } from '@tanstack/react-router'


export const Route = createFileRoute('/unauthorized')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex justify-center mt-16 px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        
        <h1 className="text-3xl font-semibold mb-4">
          Sign in to add a joke
        </h1>

        <p className="text-gray-600 mb-6">
          Joke submission is available to signed-in users only.
        </p>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="rounded-lg bg-orange-500 px-5 py-2 text-white font-medium hover:bg-orange-600 transition"
          >
            Sign in
          </Link>

          <Link
            to="/register"
            className="rounded-lg border border-gray-300 px-5 py-2 font-medium hover:bg-gray-100 transition"
          >
            Create account
          </Link>
        </div>

      </div>
    </div>
  )
}
