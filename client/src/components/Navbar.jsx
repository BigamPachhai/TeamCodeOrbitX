import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-red-700 text-white shadow-md px-6 py-4 flex justify-between items-center">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide hover:text-yellow-300"
        >
          Rupandehi Portal
        </Link>

        <Link className="hover:text-yellow-300" to="/">Home</Link>
        <Link className="hover:text-yellow-300" to="/about">About</Link>
        <Link className="hover:text-yellow-300" to="/faq">FAQ</Link>
        <Link className="hover:text-yellow-300" to="/contact">Contact</Link>
        <Link className="hover:text-yellow-300" to="/stats">Stats</Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 bg-white text-red-700 rounded shadow hover:bg-gray-100"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 bg-blue-800 text-white rounded shadow hover:bg-blue-900"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link className="hover:text-yellow-300" to="/feed">Feed</Link>
            <Link className="hover:text-yellow-300" to="/report">Report</Link>
            <Link className="hover:text-yellow-300" to="/heatmap">Heatmap</Link>
            <Link className="hover:text-yellow-300" to="/leaderboard">Leaderboard</Link>
            <Link className="hover:text-yellow-300" to="/profile">Profile</Link>

            {user?.role === "admin" && (
              <Link className="hover:text-yellow-300" to="/admin">Admin</Link>
            )}

            <button
              onClick={logout}
              className="px-4 py-2 bg-white text-red-700 rounded shadow hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
