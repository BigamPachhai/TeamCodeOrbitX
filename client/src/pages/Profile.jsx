import useAuth from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-xl mx-auto bg-white p-8 shadow-xl rounded-lg mt-10">

      <h1 className="text-3xl font-bold text-red-700 mb-6">Your Profile</h1>

      <p className="text-lg text-gray-800"><strong>Name:</strong> {user.fullName}</p>
      <p className="text-lg text-gray-800"><strong>Email:</strong> {user.email}</p>
      <p className="text-lg text-gray-800"><strong>Points:</strong> {user.points}</p>

      <div className="mt-6 p-4 border-l-4 border-blue-800 bg-blue-50 rounded-lg">
        <p className="text-lg font-semibold text-blue-900">
          Badge:
        </p>
        <p className="text-xl mt-2">
          {user.points >= 1000 && "🏆 Legend Reporter"}
          {user.points >= 500 && user.points < 1000 && "🥇 Gold Reporter"}
          {user.points >= 200 && user.points < 500 && "🥈 Silver Reporter"}
          {user.points >= 50 && user.points < 200 && "🥉 Bronze Reporter"}
          {user.points < 50 && "🟢 New Citizen"}
        </p>
      </div>

    </div>
  );
}
