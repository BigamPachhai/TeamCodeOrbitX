import useAuth from "../hooks/useAuth";
import AchievementShare from "../components/AchievementShare";
import { getBadge } from "../utils/badges";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 shadow-xl rounded-lg mt-10">
        <p className="text-center text-gray-500">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 shadow-xl rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-red-700 mb-6">Your Profile</h1>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-lg font-semibold text-gray-700">Name:</span>
          <span className="text-lg text-gray-800">{user.fullName}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-lg font-semibold text-gray-700">Email:</span>
          <span className="text-lg text-gray-800">{user.email}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-2 border-red-200">
          <span className="text-lg font-semibold text-red-700">Points:</span>
          <span className="text-2xl font-bold text-red-700">{user.points || 0}</span>
        </div>
      </div>

      <div className="mt-6 p-6 border-l-4 border-blue-800 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md">
        <p className="text-lg font-semibold text-blue-900 mb-2">Your Badge:</p>
        <p className="text-3xl font-bold text-blue-800">{getBadge(user.points || 0)}</p>
      </div>

      {/* Share Achievement Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
        <h2 className="text-xl font-bold text-purple-800 mb-4 text-center">
          🎉 Share Your Achievement
        </h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Let your friends know about your contribution to the community!
        </p>
        <div className="flex justify-center">
          <AchievementShare user={user} />
        </div>
      </div>
    </div>
  );
}
