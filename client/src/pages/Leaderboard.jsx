import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";
import AchievementShare from "../components/AchievementShare";

export default function Leaderboard() {
  const { user } = useAuth();
  const { data: users, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data } = await api.get("/users/leaderboard");
      return data;
    },
  });

  // Find current user's rank
  const currentUserRank = user
    ? users?.findIndex((u) => u._id === user._id) + 1
    : null;

  if (isLoading) {
    return <p className="text-center mt-10">Loading leaderboard...</p>;
  }

  const getMedalEmoji = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "🏅";
  };

  const getPositionColor = (index) => {
    if (index === 0)
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    if (index === 1)
      return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    if (index === 2)
      return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
    return "bg-gray-100";
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 mb-10 bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-red-700 mb-2">
          🏆 Top Contributors
        </h1>
        <p className="text-gray-600">
          Users ranked by their contribution points
        </p>
        
        {/* Show share button if user is logged in and on leaderboard */}
        {user && currentUserRank && currentUserRank > 0 && (
          <div className="mt-6 flex justify-center">
            <AchievementShare 
              user={user} 
              rank={currentUserRank} 
              totalUsers={users?.length || 0}
            />
          </div>
        )}
      </div>

      {!users || users.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No contributors yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Be the first to report issues!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u, index) => {
            const isCurrentUser = user && u._id === user._id;
            return (
              <div
                key={u._id}
                className={`flex items-center justify-between p-4 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-102 ${
                  isCurrentUser
                    ? "ring-4 ring-blue-500 ring-offset-2"
                    : ""
                } ${getPositionColor(index)}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{getMedalEmoji(index)}</span>
                  <div>
                    <span className="font-bold text-lg">
                      #{index + 1} {u.fullName}
                      {isCurrentUser && (
                        <span className="ml-2 text-sm bg-blue-500 text-white px-2 py-1 rounded">
                          You
                        </span>
                      )}
                    </span>
                    <p
                      className={`text-sm ${
                        index < 3 ? "text-white opacity-80" : "text-gray-500"
                      }`}
                    >
                      {u.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-bold text-2xl ${
                      index < 3 ? "text-white" : "text-red-700"
                    }`}
                  >
                    {u.points}
                  </span>
                  <p
                    className={`text-xs ${
                      index < 3 ? "text-white opacity-80" : "text-gray-500"
                    }`}
                  >
                    points
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">
          How to earn points:
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            • Report a new issue: <strong>+10 points</strong>
          </li>
          <li>
            • Your issue gets upvoted: <strong>+1 point</strong>
          </li>
          <li>
            • Add helpful comments: <strong>+2 points</strong>
          </li>
          <li>
            • Issue gets resolved: <strong>+5 bonus points</strong>
          </li>
        </ul>
      </div>
    </div>
  );
}
