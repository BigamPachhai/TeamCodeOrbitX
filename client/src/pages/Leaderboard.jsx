import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";
import AchievementShare from "../components/AchievementShare";
import { Trophy, Award, TrendingUp, Medal, Crown, Star, Target, CheckCircle } from "lucide-react";

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border-2 border-purple-200">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
          <p className="mt-6 text-gray-700 text-xl font-semibold">
            ✨ Loading community rankings...
          </p>
        </div>
      </div>
    );
  }

  const getRankTier = (index) => {
    if (index === 0) return { 
      color: "from-amber-400 via-yellow-500 to-amber-600", 
      border: "border-amber-300",
      bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
      icon: <Crown className="w-6 h-6 text-amber-600" />,
      badge: "👑 Gold Medal"
    };
    if (index === 1) return { 
      color: "from-gray-300 via-gray-400 to-gray-600", 
      border: "border-gray-300",
      bg: "bg-gradient-to-br from-gray-50 to-slate-50",
      icon: <Medal className="w-6 h-6 text-gray-600" />,
      badge: "🥈 Silver Medal"
    };
    if (index === 2) return { 
      color: "from-orange-400 via-amber-500 to-orange-600", 
      border: "border-orange-300",
      bg: "bg-gradient-to-br from-orange-50 to-amber-50",
      icon: <Award className="w-6 h-6 text-orange-600" />,
      badge: "🥉 Bronze Medal"
    };
    return { 
      color: "from-blue-100 to-indigo-100", 
      border: "border-blue-200",
      bg: "bg-white",
      icon: <Star className="w-5 h-5 text-blue-500" />,
      badge: null
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6 flex-wrap gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent whitespace-nowrap">
                🏆 Leaderboard
              </h1>
              <p className="text-gray-700 mt-2 text-xl font-semibold whitespace-nowrap">
                Community Engagement Rankings
              </p>
            </div>
          </div>
          <div className="w-40 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 mx-auto rounded-full shadow-lg"></div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-blue-200 p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              {users?.length || 0}
            </div>
            <div className="text-gray-700 font-bold text-lg">👥 Active Contributors</div>
            <div className="text-sm text-gray-500 mt-1">Community members</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-green-200 p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              {users?.reduce((total, user) => total + (user.points || 0), 0) || 0}
            </div>
            <div className="text-gray-700 font-bold text-lg">⭐ Total Points</div>
            <div className="text-sm text-gray-500 mt-1">Combined contributions</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-200 p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {users?.filter(u => u.points > 50).length || 0}
            </div>
            <div className="text-gray-700 font-bold text-lg">🌟 High Contributors</div>
            <div className="text-sm text-gray-500 mt-1">50+ points achieved</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-orange-200 p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              {currentUserRank || '--'}
            </div>
            <div className="text-gray-700 font-bold text-lg">📍 Your Position</div>
            <div className="text-sm text-gray-500 mt-1">Current ranking</div>
          </div>
        </div>

        {/* Current User Status */}
        {user && currentUserRank && currentUserRank > 0 && (
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl p-8 mb-10 text-white border-2 border-white/20 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6 flex-1">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border-2 border-white/30 shadow-xl">
                  <Trophy className="w-12 h-12 text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    🎯 Your Community Standing
                  </h3>
                  <p className="text-blue-100 text-xl font-semibold mb-1">
                    Position <span className="text-yellow-300 font-bold text-2xl">#{currentUserRank}</span> of {users?.length || 0} contributors
                  </p>
                  <p className="text-blue-200 text-lg mt-2 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-300" />
                    <span className="font-bold">{users?.[currentUserRank - 1]?.points || 0}</span> contribution points
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <AchievementShare 
                  user={user} 
                  rank={currentUserRank} 
                  totalUsers={users?.length || 0}
                />
              </div>
            </div>
          </div>
        )}

        {/* Rankings Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-purple-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-5 border-b-2 border-purple-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-bold text-gray-800 uppercase tracking-wide">
              <div className="col-span-1 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Rank
              </div>
              <div className="col-span-6 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Contributor
              </div>
              <div className="col-span-3 text-center flex items-center justify-center gap-2">
                <Star className="w-4 h-4" />
                Points
              </div>
              <div className="col-span-2 text-center flex items-center justify-center gap-2">
                <Target className="w-4 h-4" />
                Status
              </div>
            </div>
          </div>

          {/* Table Body */}
          {!users || users.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Contributors</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Community engagement metrics will appear as citizens participate in public service initiatives.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.map((u, index) => {
                const isCurrentUser = user && u._id === user._id;
                const tier = getRankTier(index);

                return (
                  <div
                    key={u._id}
                    className={`px-6 py-5 transition-all duration-300 ${
                      isCurrentUser 
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 shadow-md' 
                        : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50'
                    } ${index < 3 ? tier.bg : ''}`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Rank */}
                      <div className="col-span-1">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center text-white font-bold text-lg border-2 ${tier.border} shadow-lg relative`}>
                          {index < 3 && (
                            <span className="absolute -top-1 -right-1">{tier.icon}</span>
                          )}
                          <span className={index < 3 ? 'text-xl' : ''}>{index + 1}</span>
                        </div>
                      </div>

                      {/* Contributor Info */}
                      <div className="col-span-6">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className={`text-xl font-bold ${isCurrentUser ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' : 'text-gray-900'}`}>
                            {u.fullName}
                          </h3>
                          {index < 3 && (
                            <span className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border-2 border-amber-300">
                              {tier.badge}
                            </span>
                          )}
                          {isCurrentUser && (
                            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full border-2 border-blue-400 shadow-md">
                              ✨ Your Account
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
                          <span>📧</span>
                          {u.email}
                        </p>
                      </div>

                      {/* Points */}
                      <div className="col-span-3 text-center">
                        <div className="inline-flex flex-col items-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-3 border-2 border-purple-200">
                          <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{u.points}</span>
                          <span className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Points</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-2 text-center">
                        {index < 3 ? (
                          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-bold px-4 py-2 rounded-full border-2 border-green-300 shadow-md">
                            <CheckCircle className="w-4 h-4" />
                            Top Contributor
                          </span>
                        ) : (
                          <span className="text-gray-600 text-sm font-semibold bg-gray-100 px-3 py-2 rounded-full">Active</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Points System */}
        <div className="mt-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-purple-200 p-10">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-8 text-center">
            💎 Contribution Metrics System
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 border-2 border-blue-200 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Issue Reporting</h4>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">+10</p>
              <p className="text-gray-600 text-sm font-medium">Points per verified issue report</p>
            </div>

            <div className="text-center p-6 border-2 border-green-200 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Community Support</h4>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">+1</p>
              <p className="text-gray-600 text-sm font-medium">Point per issue upvote received</p>
            </div>

            <div className="text-center p-6 border-2 border-purple-200 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Constructive Feedback</h4>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">+2</p>
              <p className="text-gray-600 text-sm font-medium">Points per helpful comment</p>
            </div>

            <div className="text-center p-6 border-2 border-orange-200 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Resolution Impact</h4>
              <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">+5</p>
              <p className="text-gray-600 text-sm font-medium">Bonus points for resolved issues</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 pt-8 border-t-2 border-purple-200">
          <p className="text-sm text-gray-600 font-semibold">
            🏛️ Municipal Corporation Public Service Portal • Community Engagement Metrics
          </p>
          <p className="text-xs text-gray-500 mt-2">
            ⚡ Rankings updated in real-time based on community contributions
          </p>
        </div>
      </div>
    </div>
  );
}