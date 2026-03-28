import { Link, useNavigate } from "@tanstack/react-router";
//import ThemeToggle from "./ThemeToggle";
import { authClient } from "#/lib/auth-client";

export default function Header() {
  const { data: session } = authClient.useSession()
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await authClient.signOut()
      navigate({ to: "/login" })
    } catch (err) {
      console.error("Logout failed", err)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex items-center justify-between py-3">
      {/* LEFT: Logo */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm"
        >
          <span className="h-2 w-2 rounded-full bg-orange-400" />
          DevJokes
        </Link>

        {/* MIDDLE: Links */}
        <div className="flex items-center gap-5 text-sm font-medium">
          <Link to="/" className="nav-link">
            Home
          </Link>

          <Link
            to="/addJoke"
            className={`nav-link ${
              !session ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            Add Joke
          </Link>

          <Link to="/about" className="nav-link">
            About
          </Link>
        </div>
      </div>

      {/* RIGHT: Auth Buttons */}
      <div className="flex items-center gap-3">
        {!session ? (
          <>
            <Link
              to="/login"
              className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium hover:bg-gray-100"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="rounded-full bg-orange-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-orange-600"
            >
              Sign up
            </Link>
          </>
        ) : (
        <>
          <div className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium hover:bg-gray-100">
            {session.user.email}
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium hover:bg-gray-100"
          >
            Logout
          </button>
        </>
        )}
      </div>
    </nav>
    </header>
  )
}
